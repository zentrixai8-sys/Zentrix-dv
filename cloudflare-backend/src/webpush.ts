// Web Push sender for Cloudflare Workers.
// Implements VAPID (RFC 8292) and aes128gcm payload encryption (RFC 8291)
// directly on WebCrypto, so it needs no Node polyfills or npm dependencies.

export interface PushSubscriptionRecord {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface VapidConfig {
  publicKey: string;
  privateKey: string;
  subject: string; // "mailto:..." or an https origin
}

// --- base64url helpers ---

const b64urlToBytes = (input: string): Uint8Array => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
};

const bytesToB64url = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const concatBytes = (...parts: Uint8Array[]): Uint8Array => {
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
};

// --- VAPID JWT (RFC 8292) ---

const importVapidPrivateKey = async (privateKey: string, publicKey: string): Promise<CryptoKey> => {
  const pub = b64urlToBytes(publicKey); // uncompressed point: 0x04 || X || Y
  if (pub.length !== 65) throw new Error('VAPID public key must be a 65-byte uncompressed P-256 point');

  return crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',
      crv: 'P-256',
      d: privateKey,
      x: bytesToB64url(pub.slice(1, 33)),
      y: bytesToB64url(pub.slice(33, 65)),
      ext: true
    },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
};

const createVapidJwt = async (audience: string, vapid: VapidConfig): Promise<string> => {
  const encoder = new TextEncoder();
  const header = bytesToB64url(encoder.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const claims = bytesToB64url(
    encoder.encode(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: vapid.subject
      })
    )
  );

  const unsigned = `${header}.${claims}`;
  const key = await importVapidPrivateKey(vapid.privateKey, vapid.publicKey);
  // WebCrypto ECDSA already returns the raw r||s form that JWS ES256 expects.
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    encoder.encode(unsigned)
  );

  return `${unsigned}.${bytesToB64url(new Uint8Array(signature))}`;
};

// --- Payload encryption (RFC 8291, aes128gcm) ---

const hkdf = async (
  salt: Uint8Array,
  ikm: Uint8Array,
  info: Uint8Array,
  lengthBytes: number
): Promise<Uint8Array> => {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    key,
    lengthBytes * 8
  );
  return new Uint8Array(bits);
};

const encryptPayload = async (
  subscription: PushSubscriptionRecord,
  payload: string
): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const uaPublic = b64urlToBytes(subscription.p256dh);
  const authSecret = b64urlToBytes(subscription.auth);

  // Ephemeral sender keypair for this message.
  const asKeyPair = (await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  )) as CryptoKeyPair;
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', asKeyPair.publicKey));

  const uaKey = await crypto.subtle.importKey(
    'raw',
    uaPublic,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, asKeyPair.privateKey, 256)
  );

  // ikm binds both public keys into the key derivation.
  const keyInfo = concatBytes(encoder.encode('WebPush: info\0'), uaPublic, asPublic);
  const ikm = await hkdf(authSecret, sharedSecret, keyInfo, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const contentEncryptionKey = await hkdf(
    salt,
    ikm,
    encoder.encode('Content-Encoding: aes128gcm\0'),
    16
  );
  const nonce = await hkdf(salt, ikm, encoder.encode('Content-Encoding: nonce\0'), 12);

  const aesKey = await crypto.subtle.importKey('raw', contentEncryptionKey, 'AES-GCM', false, [
    'encrypt'
  ]);
  // 0x02 marks this as the final record.
  const plaintext = concatBytes(encoder.encode(payload), new Uint8Array([0x02]));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, plaintext)
  );

  // Header: salt(16) || record size(4, big endian) || key id length(1) || sender public key(65)
  const header = new Uint8Array(16 + 4 + 1 + asPublic.length);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, 4096, false);
  header[20] = asPublic.length;
  header.set(asPublic, 21);

  return concatBytes(header, ciphertext);
};

// --- Public API ---

export interface SendResult {
  ok: boolean;
  status: number;
  /** True when the subscription is gone and should be deleted. */
  expired: boolean;
}

export const sendWebPush = async (
  subscription: PushSubscriptionRecord,
  payload: Record<string, any>,
  vapid: VapidConfig,
  ttlSeconds = 86400
): Promise<SendResult> => {
  const audience = new URL(subscription.endpoint).origin;
  const jwt = await createVapidJwt(audience, vapid);
  const body = await encryptPayload(subscription, JSON.stringify(payload));

  const res = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: String(ttlSeconds),
      Authorization: `vapid t=${jwt}, k=${vapid.publicKey}`
    },
    body
  });

  return {
    ok: res.ok,
    status: res.status,
    // 404/410 mean the browser dropped the subscription for good.
    expired: res.status === 404 || res.status === 410
  };
};

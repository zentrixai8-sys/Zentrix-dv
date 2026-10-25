// Enterprise Real-Time OS Push Notification Service for Zentrixs
// Supports:
// 1. Native Android OS Status Bar & Lock Screen Notifications via @capacitor/local-notifications
// 2. Web Browser & PWA Push Notifications via Service Worker

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  onClick?: () => void;
}

const API_BASE_URL = (import.meta as any).env?.VITE_CLOUDFLARE_API_URL || '';

let swRegistration: ServiceWorkerRegistration | null = null;
let swRegistrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;
let isChannelCreated = false;

// Initialize Android Native Notification Channel (Heads-Up Banner + Sound + Vibration)
export const initNotificationChannel = async () => {
  if (typeof window === 'undefined') return;

  if (Capacitor.isNativePlatform()) {
    try {
      if (!isChannelCreated) {
        await LocalNotifications.createChannel({
          id: 'zentrixs_tickets',
          name: 'Zentrixs Tickets & Alerts',
          description: 'Instant ticket updates and task delegation notifications',
          importance: 5, // 5 = High importance (Heads-up alert banner)
          visibility: 1, // 1 = Public (visible on lock screen)
          vibration: true,
          lights: true,
          lightColor: '#EA552E'
        });
        isChannelCreated = true;
      }
    } catch (err) {
      console.warn('Android notification channel creation:', err);
    }
  } else if ('serviceWorker' in navigator) {
    // Register Service Worker for PWA / Web.
    // Register right away if the page has already finished loading, otherwise
    // wait for 'load'. Relying on the event alone silently skipped registration
    // whenever this module was imported after load had already fired, which left
    // navigator.serviceWorker.ready pending forever and swallowed notifications.
    if (!swRegistrationPromise) {
      swRegistrationPromise = new Promise<ServiceWorkerRegistration | null>((resolve) => {
        const register = () => {
          navigator.serviceWorker.register('/sw.js')
            .then((reg) => {
              swRegistration = reg;
              resolve(reg);
            })
            .catch((err) => {
              console.warn('Service Worker registration skipped:', err);
              resolve(null);
            });
        };

        if (document.readyState === 'complete') register();
        else window.addEventListener('load', register, { once: true });
      });
    }
  }
};

// Auto-run channel initialization
if (typeof window !== 'undefined') {
  initNotificationChannel();
}

// Resolve the service worker registration without hanging forever.
// navigator.serviceWorker.ready never settles if nothing ever registered a
// worker, which used to block sendOutsideNotification indefinitely.
const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;

  try {
    if (!swRegistrationPromise) await initNotificationChannel();

    const existing = await Promise.race([
      swRegistrationPromise ?? Promise.resolve(null),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
    ]);
    if (existing) return existing;

    // Fall back to a worker registered elsewhere (e.g. a previous session).
    const current = await Promise.race([
      navigator.serviceWorker.getRegistration(),
      new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 3000))
    ]);
    if (current) {
      swRegistration = current;
      return current;
    }
  } catch (_) {}

  return null;
};

export const isNotificationSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) return true;
  return 'Notification' in window;
};

// Request OS-level notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // 1. Android Native APK Permission
  if (Capacitor.isNativePlatform()) {
    try {
      await initNotificationChannel();
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } catch (err) {
      console.warn('Android native permission request error:', err);
      return false;
    }
  }

  // 2. Web Browser Permission
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.warn('Browser permission request error:', err);
      return false;
    }
  }

  return false;
};

// --- WEB PUSH: lets the browser alert the user even with the app fully closed ---

const b64urlToUint8Array = (base64Url: string): Uint8Array => {
  const normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const raw = atob(padded);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
};

const bufferToB64url = (buffer: ArrayBuffer | null): string => {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Registers this browser with the backend so it receives push even when closed.
// Safe to call repeatedly; it is a no-op when push is unsupported or unconfigured.
export const registerPushSubscription = async (
  role: 'admin' | 'company',
  companyId?: string
): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) return false; // the APK uses its own native background sync
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  if (!API_BASE_URL) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const reg = swRegistration || (await getServiceWorkerRegistration());
    if (!reg || !reg.pushManager) return false;

    const keyRes = await fetch(`${API_BASE_URL}/api/push/public-key`);
    if (!keyRes.ok) return false;
    const { publicKey } = await keyRes.json();
    if (!publicKey) return false;

    // Reuse an existing subscription when present, otherwise create one.
    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: b64urlToUint8Array(publicKey) as any
      });
    }

    const res = await fetch(`${API_BASE_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: bufferToB64url(subscription.getKey('p256dh')),
          auth: bufferToB64url(subscription.getKey('auth'))
        },
        role,
        companyId: companyId || null
      })
    });

    return res.ok;
  } catch (err) {
    console.warn('Push subscription failed:', err);
    return false;
  }
};

// Send Outside Device Notification (Phone status bar, lock screen, banner outside app)
export const sendOutsideNotification = async (payload: NotificationPayload): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Audio beep/chime helper
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioContext.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
    // Release the context once the chime finishes; browsers cap how many can
    // exist at once and start throwing after a handful of notifications.
    osc.onended = () => { audioContext.close().catch(() => {}); };
  } catch (_) {}

  // 1. Android Native APK Mode: Real Android OS Notification via @capacitor/local-notifications
  if (Capacitor.isNativePlatform()) {
    try {
      await initNotificationChannel();

      // Ensure permission is requested
      const permCheck = await LocalNotifications.checkPermissions();
      if (permCheck.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        if (req.display !== 'granted') return false;
      }

      const notifId = Math.floor(Math.random() * 1000000) + 1;

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            title: payload.title,
            body: payload.body,
            channelId: 'zentrixs_tickets',
            schedule: { at: new Date(Date.now() + 100) },
            smallIcon: 'ic_launcher',
            iconColor: '#EA552E',
            extra: payload.data || { url: '/dashboard' }
          }
        ]
      });

      return true;
    } catch (err) {
      console.warn('Native Android notification failed:', err);
    }
  }

  // 2. Web Browser / PWA Mode
  if ('Notification' in window) {
    // Permission may still be 'default' when the first ticket arrives (the
    // watcher requests it without awaiting). Ask here instead of silently
    // dropping the notification.
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (_) {}
    }

    if (Notification.permission !== 'granted') return false;

    const defaultIcon = '/logo.png';
    const defaultBadge = '/favicon.png';
    const tag = payload.tag || `zentrixs-${Date.now()}`;
    const options = {
      body: payload.body,
      icon: payload.icon || defaultIcon,
      badge: payload.badge || defaultBadge,
      tag,
      renotify: true, // alert again even when a tag is reused
      vibrate: [200, 100, 200, 100, 200] as any,
      data: payload.data || { url: '/dashboard' }
    } as any;

    try {
      // Prefer the service worker: it is the only path that still shows a
      // notification while the tab is in the background or minimised.
      const reg = swRegistration || (await getServiceWorkerRegistration());
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(payload.title, options);
        return true;
      }

      const notification = new Notification(payload.title, options);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return true;
    } catch (e) {
      console.warn('Browser notification error:', e);
    }
  }

  return false;
};

// Instant Test Notification
export const testOutsideNotification = async () => {
  await requestNotificationPermission();
  await sendOutsideNotification({
    title: '🔔 Zentrixs Real Notification Test',
    body: 'Awesome! Real outside push notifications are active on this device.',
    tag: `test-${Date.now()}`,
    data: { url: '/dashboard' }
  });
};

// Real-Time Background Watcher that triggers Real OS notifications outside the app
let liveWatcherInterval: any = null;
let liveWatcherVisibilityHandler: (() => void) | null = null;
const trackedTaskIds = new Set<string>();
const trackedTaskStatuses = new Map<string, string>();
let isWatcherInitialized = false;

export const startLiveTicketWatcher = (
  role: 'admin' | 'company',
  companyId?: string,
  onUpdate?: () => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  // Prompt for notification permission, then register this browser for web push
  // so alerts still arrive once the app is closed and polling has stopped.
  requestNotificationPermission().then((granted) => {
    if (granted) registerPushSubscription(role, companyId);
  });

  if (liveWatcherInterval) {
    clearInterval(liveWatcherInterval);
  }
  if (liveWatcherVisibilityHandler && typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', liveWatcherVisibilityHandler);
    liveWatcherVisibilityHandler = null;
  }

  // Last change digest seen by this watcher instance.
  let lastSignature: string | null = null;

  const pollTickets = async () => {
    // NOTE: this deliberately keeps polling while the tab is hidden, otherwise
    // no notification can ever fire in the background. Cost stays negligible
    // because an unchanged poll only transfers the small pulse digest below.
    try {
      const { fetchTasks, fetchTasksPulse } = await import('./taskService');
      const scopedCompanyId = role === 'company' && companyId ? companyId : undefined;

      // Cheap constant-size digest first. While nothing has changed this is the
      // only thing that crosses the wire, instead of the entire tasks table.
      // A null signature means the endpoint is unavailable, so we fall through
      // to the full fetch and behave exactly as before.
      const signature = await fetchTasksPulse(scopedCompanyId);
      if (signature !== null) {
        if (isWatcherInitialized && signature === lastSignature) return;
        lastSignature = signature;
      }

      const latestTasks = await fetchTasks(scopedCompanyId ? { companyId: scopedCompanyId } : undefined, true);

      if (!Array.isArray(latestTasks)) return;

      // First run: Seed current existing tasks into memory so we don't spam old notifications.
      // This must also mark an empty table as seeded, otherwise the first ticket
      // ever created would arrive as a seed instead of a notification.
      if (!isWatcherInitialized) {
        latestTasks.forEach((t) => {
          trackedTaskIds.add(t.id);
          trackedTaskStatuses.set(t.id, t.status);
        });
        isWatcherInitialized = true;
        return;
      }

      if (latestTasks.length === 0) return;

      // Collapse every change found in this poll into a single refresh callback,
      // so N changed tickets cost one reload instead of N.
      let hasChanges = false;
      let deliveryPending = false;

      // A ticket is only marked as seen once its notification actually went out.
      // Marking it up front meant any failure (permission still pending, service
      // worker not ready yet, transient error) silently dropped that ticket
      // forever - this was the main reason notifications arrived only sometimes.
      for (const t of latestTasks) {
        if (!trackedTaskIds.has(t.id)) {
          // Fire native OS notification outside app
          const delivered = await sendOutsideNotification({
            title: `🔔 New Ticket #${t.ticketNumber}`,
            body: `${t.partyName}: ${t.typeOfWork || 'New Task'} - ${t.systemName || ''}`,
            tag: `new-ticket-${t.id}`,
            data: { url: '/dashboard', ticketId: t.id }
          });

          if (delivered) {
            trackedTaskIds.add(t.id);
            trackedTaskStatuses.set(t.id, t.status);
          } else {
            // Leave it untracked and retry on the next poll.
            deliveryPending = true;
          }

          hasChanges = true;
        } else {
          // Check for status changes on existing tickets
          const oldStatus = trackedTaskStatuses.get(t.id);
          if (oldStatus && oldStatus !== t.status) {
            const delivered = await sendOutsideNotification({
              title: `⚡ Ticket #${t.ticketNumber} ${t.status}`,
              body: `${t.systemName || t.partyName} status changed from ${oldStatus} to ${t.status}`,
              tag: `status-${t.id}-${t.status}`,
              data: { url: '/dashboard', ticketId: t.id }
            });

            if (delivered) trackedTaskStatuses.set(t.id, t.status);
            else deliveryPending = true;

            hasChanges = true;
          }
        }
      }

      // If anything failed to deliver, drop the digest so the next poll
      // re-examines the table instead of short-circuiting on an equal signature.
      if (deliveryPending) lastSignature = null;

      if (hasChanges && onUpdate) onUpdate();
    } catch (_) {
      // background network error: fail silently
    }
  };

  // Immediate initial check
  pollTickets();

  // Poll every 15 seconds, foreground and background alike. An unchanged poll
  // only costs the pulse digest, so this stays cheap while keeping alerts prompt.
  liveWatcherInterval = setInterval(pollTickets, 15000);

  // Extra immediate check when the user returns to the tab, since timers are
  // throttled in background tabs and may have fired late or not at all.
  if (typeof document !== 'undefined') {
    liveWatcherVisibilityHandler = () => {
      if (!document.hidden) pollTickets();
    };
    document.addEventListener('visibilitychange', liveWatcherVisibilityHandler);
  }

  return () => {
    if (liveWatcherInterval) {
      clearInterval(liveWatcherInterval);
      liveWatcherInterval = null;
    }
    if (liveWatcherVisibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', liveWatcherVisibilityHandler);
      liveWatcherVisibilityHandler = null;
    }
  };
};

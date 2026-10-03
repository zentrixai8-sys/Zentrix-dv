import React, { useEffect, useMemo, useRef, useState, startTransition } from 'react';
import * as THREE from 'three';

const FONT = '"Plus Jakarta Sans", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';
const PAPER = '#121418';
const INK = '#F2F1EC';
const ACCENT = '#5B6B86';
const STRAP = '#181a20';
const DEMO_LOGO = 'https://i.ibb.co/P2msKBd/Logo.png';
const DEMO_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

const PAD_MIN = 28;
const PAD_MAX = 88;
const NAME_MIN = 48;
const NAME_MAX = 140;
const META_MIN = 14;
const META_MAX = 36;
const NUM_MIN = 24;
const NUM_MAX = 96;
const PRINT_PAD = 48;
const CARD_DEPTH = 0.08;
const JOINTS = 3;
const SEG_LEN = 0.82;
const CARD_W = 1.58;
const CARD_H = 2.16;
const SLEEVE_PAD_W = 0.08;
const SLEEVE_LIP = 0.05;
const SLEEVE_HEAD = 0.16;
const SLEEVE_PAD_H = SLEEVE_LIP + SLEEVE_HEAD;
const SLEEVE_PAD_D = 0.03;
const SLEEVE_SHIFT = (SLEEVE_HEAD - SLEEVE_LIP) / 2;
const HOLE = 0.09;
const ROPE_ITERS = 18;
const GRAVITY = -22;
const AIR = 0.986;
const DT = 1 / 60;
const STRAP_SEGS = 40;
const STRAP_RADIAL = 10;
const STRAP_HALF_W = 0.07;
const STRAP_HALF_T = 0.02;
const TEX_W = 768;
const TEX_H = 1024;
const STRAP_TEX_W = 256;
const STRAP_TEX_H = 1024;
const STRAP_REPEAT = 3;
const CAM_X = 0;
const CAM_Y = -0.65;
const CAM_Z = 7.4;
const CAM_LOOK_Y = -1.1;
const IDLE_SPRING = 6;
const IDLE_DAMP = 0.9;

export interface LanyardPassProps {
  attendeeName?: string;
  ticketType?: string;
  ticketNumber?: string;
  eventName?: string;
  eventDate?: string;
  barcodeValue?: string;
  strapText?: string;
  paper?: string;
  ink?: string;
  accent?: string;
  strapColor?: string;
  strapStyle?: 'flat' | 'cord';
  logoSrc?: string;
  photoSrc?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseColor(color: string): [number, number, number] | null {
  const hex = color.trim();
  if (hex.startsWith('#') && hex.length === 7) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }
  const m = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(hex);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function isDark(color: string) {
  const rgb = parseColor(color);
  if (!rgb) return true;
  const [r, g, b] = rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
}

function inkAlpha(ink: string, alpha: number) {
  const rgb = parseColor(ink);
  if (!rgb) return ink;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function drawCord(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const dark = isDark(color);
  const hi = dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.4)';
  const lo = dark ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0.18)';
  const strands = 6;
  const pitch = h / 2;
  ctx.lineCap = 'butt';
  for (let s = 0; s < strands; s++) {
    const x0 = (s / strands) * w;
    ctx.lineWidth = w / strands;
    ctx.strokeStyle = s % 2 === 0 ? hi : lo;
    for (const off of [-w, 0, w]) {
      ctx.beginPath();
      ctx.moveTo(x0 + off, 0);
      ctx.lineTo(x0 + off + w, pitch);
      ctx.moveTo(x0 + off, pitch);
      ctx.lineTo(x0 + off + w, h);
      ctx.stroke();
    }
  }
}

function drawStrap(canvas: HTMLCanvasElement, ticket: any) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = ticket.strapColor || STRAP;
  ctx.fillRect(0, 0, w, h);

  if (ticket.strapStyle === 'cord') {
    drawCord(ctx, w, h, ticket.strapColor || STRAP);
    return;
  }

  const dark = isDark(ticket.strapColor || STRAP);
  const lightHatch = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.28)';
  const darkHatch = dark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1.2;
  for (let i = -h; i < w + h; i += 5) {
    ctx.strokeStyle = i % 10 === 0 ? lightHatch : darkHatch;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i + h, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }

  const selvedge = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.2)';
  ctx.fillStyle = selvedge;
  for (const u of [0, 0.5]) {
    ctx.fillRect(Math.round(w * u) - 3, 0, 6, h);
  }

  const text = ticket.strapText || ticket.eventName || 'ZENTRIXS';
  const print = `${text.toUpperCase()}   •   `;
  ctx.fillStyle = dark ? 'rgba(244,243,240,0.85)' : 'rgba(10,10,10,0.82)';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = `600 46px ${FONT}`;
  const runW = Math.max(1, ctx.measureText(print).width);
  const runs = Math.max(1, Math.round(h / runW));
  const stretch = h / (runs * runW);
  const bandU = [0.25, 0.75];
  for (const u of bandU) {
    ctx.save();
    ctx.translate(w * u, 0);
    ctx.rotate(Math.PI / 2);
    ctx.scale(stretch, -1);
    for (let i = 0; i < runs; i++) {
      ctx.fillText(print, i * runW, 0);
    }
    ctx.restore();
  }
}

function makeStudioEnvironment(three: typeof THREE, renderer: THREE.WebGLRenderer) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const sky = ctx.createLinearGradient(0, 0, 0, 256);
    sky.addColorStop(0, '#3a3b40');
    sky.addColorStop(0.42, '#1c1d21');
    sky.addColorStop(0.55, '#101114');
    sky.addColorStop(1, '#050506');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 512, 256);

    const softbox = (x: number, y: number, w: number, h: number, a: number) => {
      const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) / 2);
      g.addColorStop(0, `rgba(255,252,246,${a})`);
      g.addColorStop(0.6, `rgba(255,252,246,${a * 0.55})`);
      g.addColorStop(1, 'rgba(255,252,246,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
    };

    softbox(70, 20, 150, 90, 1);
    softbox(210, 40, 120, 70, 0.85);
    softbox(200, 150, 220, 40, 0.3);
    softbox(394, 28, 4, 204, 2.3);

    const equirect = new three.CanvasTexture(canvas);
    equirect.mapping = three.EquirectangularReflectionMapping;
    if ('SRGBColorSpace' in three) {
      equirect.colorSpace = three.SRGBColorSpace;
    }
    equirect.needsUpdate = true;
    const pmrem = new three.PMREMGenerator(renderer);
    const env = pmrem.fromEquirectangular(equirect).texture;
    equirect.dispose();
    pmrem.dispose();
    return env;
  } catch (err) {
    console.warn('PMREM environment generation skipped', err);
    return null;
  }
}

function makeHoloTexture(three: typeof THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const w = canvas.width;
    const h = canvas.height;
    const g = ctx.createLinearGradient(0, 0, w, h * 0.35);
    g.addColorStop(0, '#ff4fa3');
    g.addColorStop(0.16, '#ffb347');
    g.addColorStop(0.3, '#e9ff5a');
    g.addColorStop(0.46, '#3cf2c8');
    g.addColorStop(0.62, '#3aa0ff');
    g.addColorStop(0.8, '#b06cff');
    g.addColorStop(1, '#ff4fa3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'overlay';
    ctx.lineWidth = 1;
    for (let i = -h; i < w + h; i += 3) {
      ctx.strokeStyle = i % 6 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.6, h);
      ctx.stroke();
    }
  }
  const map = new three.CanvasTexture(canvas);
  map.wrapS = three.RepeatWrapping;
  map.wrapT = three.RepeatWrapping;
  map.repeat.set(1.4, 1.9);
  map.anisotropy = 4;
  map.needsUpdate = true;
  return map;
}

function drawContained(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, focusY = 0.5) {
  if (img.width < 1 || img.height < 1) return;
  const ir = img.width / img.height;
  const r = w / h;
  let dw = w;
  let dh = h;
  let dx = x;
  let dy = y;
  if (ir > r) {
    dw = h * ir;
    dx = x - (dw - w) / 2;
  } else {
    dh = w / ir;
    dy = y - (dh - h) * focusY;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function barcodeBars(value: string) {
  const src = value.length > 0 ? value : 'PASS';
  const bars: { width: number; ink: boolean }[] = [];
  let hash = 2166136261;
  for (let i = 0; i < src.length; i++) {
    hash ^= src.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
    const bits = Math.abs(hash);
    bars.push({ width: (bits % 3) + 1, ink: true });
    bars.push({ width: ((bits >>> 3) % 2) + 1, ink: false });
    bars.push({ width: ((bits >>> 5) % 3) + 1, ink: true });
    bars.push({ width: 1, ink: false });
  }
  return bars;
}

function washPaper(ctx: CanvasRenderingContext2D, paper: string, w: number, h: number, startY: number) {
  const g = ctx.createLinearGradient(0, startY, 0, h);
  g.addColorStop(0, inkAlpha(paper, 0));
  g.addColorStop(0.28, inkAlpha(paper, 0.22));
  g.addColorStop(0.58, inkAlpha(paper, 0.92));
  g.addColorStop(1, inkAlpha(paper, 1));
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.max(0, startY), w, Math.max(0, h - startY));
}

function scrimTop(ctx: CanvasRenderingContext2D, paper: string, w: number, depth: number) {
  const g = ctx.createLinearGradient(0, 0, 0, depth);
  g.addColorStop(0, inkAlpha(paper, 0.65));
  g.addColorStop(0.55, inkAlpha(paper, 0.22));
  g.addColorStop(1, inkAlpha(paper, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, depth);
}

function drawFront(canvas: HTMLCanvasElement, mask: HTMLCanvasElement, ticket: any) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const pad = ticket.pad || 48;
  const col = w - pad * 2;
  const mark = 84;
  const markX = pad;
  const markY = pad;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = ticket.paper || PAPER;
  ctx.fillRect(0, 0, w, h);

  // Background cover photo
  if (ticket.photo) {
    drawContained(ctx, ticket.photo, 0, 0, w, h, 0.28);
  } else {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#1e293b');
    g.addColorStop(0.55, '#0f172a');
    g.addColorStop(1, '#020617');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // Smooth dark paper wash for typography legibility
  washPaper(ctx, ticket.paper || PAPER, w, h, Math.round(h * 0.44));
  scrimTop(ctx, ticket.paper || PAPER, w, pad + mark + 32);

  // Draw Brand Logo Mark (Top Left)
  if (ticket.logo) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(markX, markY, mark, mark);
    ctx.clip();
    drawContained(ctx, ticket.logo, markX, markY, mark, mark);
    ctx.restore();
  }

  // Top header text (Top Right)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(244, 243, 240, 0.45)';
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText((ticket.eventName || 'IN A ZENTRIXS SESSION').toUpperCase(), w - pad, pad + 4);

  ctx.fillStyle = 'rgba(244, 243, 240, 0.8)';
  ctx.font = `400 22px ${FONT}`;
  ctx.fillText(ticket.eventDate || '12 MAR 2027', w - pad, pad + 32);

  // Big Bold Attendee Name
  let y = h - pad - 230;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = ticket.ink || INK;
  ctx.font = `700 92px ${FONT}`;
  ctx.fillText(ticket.attendeeName || 'Zentrixs', pad, y);

  // Subtitle / Ticket Type
  y += 98;
  ctx.fillStyle = 'rgba(244, 243, 240, 0.65)';
  ctx.font = `500 24px ${FONT}`;
  ctx.fillText(ticket.ticketType || 'Enterprise AI Architect', pad, y);

  // Divider Hairline
  y += 42;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(w - pad, y);
  ctx.stroke();

  // Bottom Barcode (Left)
  const barH = 46;
  const barW = Math.round(col * 0.46);
  const barY = h - pad - barH;
  const bars = barcodeBars(ticket.barcodeValue || 'ZX2026A0842');
  const total = bars.reduce((sum, b) => sum + b.width, 0) || 1;
  let bx = pad;
  for (const bar of bars) {
    const bw = (bar.width / total) * barW;
    if (bar.ink) {
      ctx.fillStyle = ticket.ink || INK;
      ctx.fillRect(bx, barY, Math.max(1, bw), barH);
    }
    bx += bw;
  }

  // Small serial text under barcode
  ctx.fillStyle = 'rgba(244, 243, 240, 0.35)';
  ctx.font = `600 14px monospace`;
  ctx.fillText(ticket.barcodeValue || 'ZX2026A0842', pad, h - pad + 14);

  // Ticket Number Code (Right)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = ticket.ink || INK;
  ctx.font = `700 52px ${FONT}`;
  ctx.fillText(ticket.ticketNumber || 'A-0842', w - pad, h - pad + 6);

  if (mask) {
    const m = mask.getContext('2d');
    if (m) {
      m.clearRect(0, 0, w, h);
      m.fillStyle = '#000000';
      m.fillRect(0, 0, w, h);
      if (ticket.logo) {
        m.fillStyle = '#ffffff';
        m.fillRect(markX, markY, mark, mark);
      }
    }
  }
}

function drawBack(canvas: HTMLCanvasElement, mask: HTMLCanvasElement, ticket: any) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = ticket.paper || PAPER;
  ctx.fillRect(0, 0, w, h);

  if (ticket.logo) {
    ctx.drawImage(ticket.logo, 0, 0, w, h);
  }
}

function particle(x: number, y: number, z: number, pinned = false) {
  return { x, y, z, ox: x, oy: y, oz: z, pinned };
}

function integrateParticle(p: any, dt: number, grav: number, damp: number) {
  if (p.pinned) {
    p.ox = p.x;
    p.oy = p.y;
    p.oz = p.z;
    return;
  }
  const vx = (p.x - p.ox) * damp;
  const vy = (p.y - p.oy) * damp;
  const vz = (p.z - p.oz) * damp;
  p.ox = p.x;
  p.oy = p.y;
  p.oz = p.z;
  p.x += vx;
  p.y += vy + grav * dt * dt;
  p.z += vz;
}

function applyMaxDist(a: any, b: any, maxDist: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist <= maxDist || dist < 1e-8) return;
  const frac = (dist - maxDist) / dist;
  const ox = dx * frac;
  const oy = dy * frac;
  const oz = dz * frac;
  if (a.pinned && b.pinned) return;
  if (a.pinned) {
    b.x -= ox;
    b.y -= oy;
    b.z -= oz;
    return;
  }
  if (b.pinned) {
    a.x += ox;
    a.y += oy;
    a.z += oz;
    return;
  }
  a.x += ox * 0.5;
  a.y += oy * 0.5;
  a.z += oz * 0.5;
  b.x -= ox * 0.5;
  b.y -= oy * 0.5;
  b.z -= oz * 0.5;
}

function makeTubeGeometry(three: typeof THREE, pathSegs: number, radialSegs: number) {
  const geometry = new three.BufferGeometry();
  const rings = pathSegs + 1;
  const cols = radialSegs + 1;
  const positions = new Float32Array(rings * cols * 3);
  const normals = new Float32Array(rings * cols * 3);
  const uvs = new Float32Array(rings * cols * 2);
  const index: number[] = [];

  for (let i = 0; i <= pathSegs; i++) {
    for (let j = 0; j <= radialSegs; j++) {
      const u = i * cols + j;
      uvs[u * 2] = j / radialSegs;
      uvs[u * 2 + 1] = i / pathSegs;
    }
  }

  for (let i = 0; i < pathSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * cols + j;
      const b = (i + 1) * cols + j;
      const c = (i + 1) * cols + j + 1;
      const d = i * cols + j + 1;
      index.push(a, b, d, b, c, d);
    }
  }

  geometry.setAttribute('position', new three.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new three.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new three.BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  return { geometry, positions, normals, pathSegs, radialSegs };
}

function updateWebbing(three: typeof THREE, points: THREE.Vector3[], camera: THREE.Camera, clipSideWorld: THREE.Vector3, halfW: number, halfT: number, strap: any) {
  if (points.length < 2) return;
  const curve = new three.CatmullRomCurve3(points, false, 'catmullrom', 0.45);
  const cols = strap.radialSegs + 1;
  const tan = new three.Vector3();
  const view = new three.Vector3();
  const sideCam = new three.Vector3();
  const sideClip = new three.Vector3();
  const side = new three.Vector3();
  const bin = new three.Vector3();
  const n = new three.Vector3();

  for (let i = 0; i <= strap.pathSegs; i++) {
    const t = i / strap.pathSegs;
    const p = curve.getPoint(t);
    tan.copy(curve.getTangent(t));
    if (tan.lengthSq() < 1e-8) tan.set(0, -1, 0);
    else tan.normalize();

    view.subVectors(camera.position, p);
    if (view.lengthSq() < 1e-8) view.set(0, 0, 1);
    else view.normalize();

    sideCam.crossVectors(tan, view);
    if (sideCam.lengthSq() < 1e-8) {
      sideCam.set(1, 0, 0);
      sideCam.cross(tan);
    }
    if (sideCam.lengthSq() < 1e-8) sideCam.set(1, 0, 0);
    else sideCam.normalize();

    sideClip.copy(clipSideWorld);
    sideClip.addScaledVector(tan, -sideClip.dot(tan));
    if (sideClip.lengthSq() < 1e-8) sideClip.copy(sideCam);
    else sideClip.normalize();
    if (sideClip.dot(sideCam) < 0) sideClip.negate();

    const twist = t < 0.55 ? 0 : (t - 0.55) / 0.45;
    const k = twist * twist * (3 - 2 * twist);
    side.lerpVectors(sideCam, sideClip, k);
    if (side.lengthSq() < 1e-8) side.copy(sideCam);
    else side.normalize();

    bin.crossVectors(tan, side).normalize();

    for (let j = 0; j <= strap.radialSegs; j++) {
      const v = (j / strap.radialSegs) * Math.PI * 2;
      const cx = Math.cos(v);
      const sy = Math.sin(v);
      n.set(
        (cx / halfW) * side.x + (sy / halfT) * bin.x,
        (cx / halfW) * side.y + (sy / halfT) * bin.y,
        (cx / halfW) * side.z + (sy / halfT) * bin.z
      );
      if (n.lengthSq() < 1e-8) n.copy(side);
      else n.normalize();

      const o = (i * cols + j) * 3;
      strap.positions[o] = p.x + cx * side.x * halfW + sy * bin.x * halfT;
      strap.positions[o + 1] = p.y + cx * side.y * halfW + sy * bin.y * halfT;
      strap.positions[o + 2] = p.z + cx * side.z * halfW + sy * bin.z * halfT;
      strap.normals[o] = n.x;
      strap.normals[o + 1] = n.y;
      strap.normals[o + 2] = n.z;
    }
  }

  const pos = strap.geometry.getAttribute('position');
  const nor = strap.geometry.getAttribute('normal');
  pos.needsUpdate = true;
  nor.needsUpdate = true;
  strap.geometry.computeBoundingSphere();
}

export const LanyardPass: React.FC<LanyardPassProps> = ({
  attendeeName = 'BuiltByZentrixs',
  ticketType = 'Enterprise AI Architect',
  ticketNumber = 'A-0842',
  eventName = 'IN A ZENTRIXS SESSION',
  eventDate = '12 Mar 2027',
  barcodeValue = 'NDS2027A0842',
  strapText = 'BUILTBYZENTRIXS',
  paper = PAPER,
  ink = INK,
  accent = ACCENT,
  strapColor = STRAP,
  strapStyle = 'flat',
  logoSrc = DEMO_LOGO,
  photoSrc = DEMO_PHOTO,
  size = 440,
  className = '',
  style
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'boot' | 'ready' | 'fail'>('boot');

  const ticketRef = useRef({
    attendeeName,
    ticketType,
    ticketNumber,
    eventName,
    eventDate,
    barcodeValue,
    paper,
    ink,
    accent,
    pad: PRINT_PAD,
    strapColor,
    strapStyle,
    strapText,
    logo: null as HTMLImageElement | null,
    photo: null as HTMLImageElement | null
  });

  ticketRef.current = {
    ...ticketRef.current,
    attendeeName,
    ticketType,
    ticketNumber,
    eventName,
    eventDate,
    barcodeValue,
    paper,
    ink,
    accent,
    strapColor,
    strapStyle,
    strapText
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stageEl = rootRef.current;
    if (!stageEl) return;

    let cancelled = false;
    let dispose: () => void;

    try {
      const clipY = 2.05;
      const cardHalfH = CARD_H / 2;

      const clip = particle(0, clipY, 0, true);
      const joints: any[] = [];
      for (let i = 0; i < JOINTS; i++) {
        joints.push(particle(0, clipY - SEG_LEN * (i + 1), 0));
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
      camera.position.set(CAM_X, CAM_Y, CAM_Z);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, CAM_LOOK_Y, 0);
      camera.updateMatrixWorld(true);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0, 0);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.style.cursor = 'grab';
      stageEl.appendChild(renderer.domElement);

      const envMap = makeStudioEnvironment(THREE, renderer);
      if (envMap) {
        scene.environment = envMap;
      }

      const hemi = new THREE.HemisphereLight(0xffffff, 0x111111, 0.7);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xffffff, 1.8);
      key.position.set(1.8, 6.4, 4.0);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0x7dd3fc, 0.5);
      fill.position.set(-3.4, 0.6, 3.2);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0x38bdf8, 1.6);
      rim.position.set(-3.2, 2.2, -2.6);
      scene.add(rim);

      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = TEX_W;
      frontCanvas.height = TEX_H;
      const backCanvas = document.createElement('canvas');
      backCanvas.width = TEX_W;
      backCanvas.height = TEX_H;
      const frontMaskCanvas = document.createElement('canvas');
      frontMaskCanvas.width = TEX_W;
      frontMaskCanvas.height = TEX_H;

      drawFront(frontCanvas, frontMaskCanvas, ticketRef.current);
      drawBack(backCanvas, frontMaskCanvas, ticketRef.current);

      const frontMap = new THREE.CanvasTexture(frontCanvas);
      const backMap = new THREE.CanvasTexture(backCanvas);
      const frontMaskMap = new THREE.CanvasTexture(frontMaskCanvas);

      frontMap.anisotropy = 8;
      backMap.anisotropy = 8;
      if ('SRGBColorSpace' in THREE) {
        frontMap.colorSpace = THREE.SRGBColorSpace;
        backMap.colorSpace = THREE.SRGBColorSpace;
      }
      frontMap.needsUpdate = true;
      backMap.needsUpdate = true;
      frontMaskMap.needsUpdate = true;

      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x1f242d,
        roughness: 0.35,
        metalness: 0.1
      });
      const frontMat = new THREE.MeshPhysicalMaterial({
        map: frontMap,
        roughness: 0.22,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5
      });
      const backMat = new THREE.MeshPhysicalMaterial({
        map: backMap,
        roughness: 0.22,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5
      });

      const cardGeo = new THREE.BoxGeometry(CARD_W, CARD_H, CARD_DEPTH);
      const cardMesh = new THREE.Mesh(cardGeo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]);
      scene.add(cardMesh);

      // Holographic foil (applied specifically to logo/marks via alphaMap)
      const holoMap = makeHoloTexture(THREE);
      const holoMat = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        map: holoMap,
        alphaMap: frontMaskMap,
        emissive: 0xffffff,
        emissiveMap: holoMap,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.85,
        depthWrite: false
      });
      const holoGeo = new THREE.PlaneGeometry(CARD_W * 0.99, CARD_H * 0.99);
      const holoFront = new THREE.Mesh(holoGeo, holoMat);
      holoFront.position.z = CARD_DEPTH / 2 + 0.003;
      holoFront.renderOrder = 1;
      cardMesh.add(holoFront);

      // Transparent Glossy PVC Badge Sleeve
      const sleeveMat = new THREE.MeshPhysicalMaterial({
        color: 0x10141a,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        roughness: 0.06,
        metalness: 0,
        depthWrite: false,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.8,
        specularIntensity: 1
      });
      const sleeveGeo = new THREE.BoxGeometry(CARD_W + SLEEVE_PAD_W, CARD_H + SLEEVE_PAD_H, CARD_DEPTH + SLEEVE_PAD_D);
      const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
      sleeveMesh.position.y = SLEEVE_SHIFT;
      sleeveMesh.renderOrder = 2;
      cardMesh.add(sleeveMesh);

      // Chrome Clamp / Clip at top
      const clipMat = new THREE.MeshStandardMaterial({ color: 0xd8dee9, metalness: 0.92, roughness: 0.18 });
      const clipGeo = new THREE.BoxGeometry(0.28, 0.08, 0.08);
      const badgeClip = new THREE.Mesh(clipGeo, clipMat);
      badgeClip.position.set(0, cardHalfH + 0.02, 0);
      cardMesh.add(badgeClip);

      const clipMesh = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 10, 22), clipMat);
      clipMesh.position.set(0, clipY, 0);
      clipMesh.rotation.x = Math.PI / 2;
      scene.add(clipMesh);

      // Webbing strap
      const strap = makeTubeGeometry(THREE, STRAP_SEGS, STRAP_RADIAL);
      const strapCanvas = document.createElement('canvas');
      strapCanvas.width = STRAP_TEX_W;
      strapCanvas.height = STRAP_TEX_H;
      drawStrap(strapCanvas, ticketRef.current);
      const strapMap = new THREE.CanvasTexture(strapCanvas);
      if ('SRGBColorSpace' in THREE) {
        strapMap.colorSpace = THREE.SRGBColorSpace;
      }
      strapMap.wrapS = THREE.RepeatWrapping;
      strapMap.wrapT = THREE.RepeatWrapping;
      strapMap.repeat.set(1, STRAP_REPEAT);
      strapMap.anisotropy = 8;
      strapMap.needsUpdate = true;

      const strapMat = new THREE.MeshStandardMaterial({ map: strapMap, roughness: 0.82, metalness: 0 });
      const strapMesh = new THREE.Mesh(strap.geometry, strapMat);
      scene.add(strapMesh);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const dragPlane = new THREE.Plane();
      const planeHit = new THREE.Vector3();
      const camDir = new THREE.Vector3();
      const holeWorld = new THREE.Vector3();
      const clipAxis = new THREE.Vector3();
      const jointPts = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
      const grabOff = { x: 0, y: 0, z: 0 };
      const grabState = { down: false, pointerId: -1, lastT: 0, lastNdcX: 0, vx: 0, vy: 0, vz: 0 };
      let acc = 0;
      let spinY = 0.16;
      let spinVel = 0;
      let simT = 0;

      function paintTicket() {
        drawFront(frontCanvas, frontMaskCanvas, ticketRef.current);
        drawBack(backCanvas, frontMaskCanvas, ticketRef.current);
        drawStrap(strapCanvas, ticketRef.current);
        frontMap.needsUpdate = true;
        backMap.needsUpdate = true;
        frontMaskMap.needsUpdate = true;
        strapMap.needsUpdate = true;
      }

      function frameCamera() {
        if (!stageEl || !renderer || !camera) return;
        const rect = stageEl.getBoundingClientRect();
        const w = Math.max(1, rect.width || window.innerWidth || 1);
        const h = Math.max(1, rect.height || 680);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }

      function solvePhysics(dt: number) {
        simT += dt;
        integrateParticle(clip, dt, GRAVITY, AIR);
        for (const j of joints) integrateParticle(j, dt, GRAVITY, AIR);

        if (!grabState.down) {
          const sway = Math.sin(simT * 1.8) * 0.08;
          joints[JOINTS - 1].x += sway * dt;
        }

        for (let iter = 0; iter < ROPE_ITERS; iter++) {
          applyMaxDist(clip, joints[0], SEG_LEN);
          for (let i = 0; i < JOINTS - 1; i++) {
            applyMaxDist(joints[i], joints[i + 1], SEG_LEN);
          }
        }
      }

      function simulate() {
        const step = DT;
        acc += step;
        while (acc >= step) {
          solvePhysics(step);
          acc -= step;
        }
      }

      function syncVisuals() {
        const bottom = joints[JOINTS - 1];
        const prev = joints[JOINTS - 2];
        cardMesh.position.set(bottom.x, bottom.y - (cardHalfH - HOLE), bottom.z);

        const dx = bottom.x - prev.x;
        const dy = bottom.y - prev.y;
        const dz = bottom.z - prev.z;
        const pitch = Math.atan2(dz, Math.hypot(dx, -dy));
        const roll = -Math.atan2(dx, -dy);

        if (!grabState.down) {
          spinVel += (-spinY * IDLE_SPRING - spinVel * IDLE_DAMP) * DT;
          spinY += spinVel * DT;
        }

        cardMesh.rotation.set(pitch, spinY, roll, 'YXZ');

        holeWorld.set(bottom.x, bottom.y, bottom.z);
        clipAxis.set(1, 0, 0).applyQuaternion(cardMesh.quaternion);

        jointPts[0].set(clip.x, clip.y, clip.z);
        for (let i = 0; i < JOINTS - 1; i++) {
          jointPts[i + 1].set(joints[i].x, joints[i].y, joints[i].z);
        }
        jointPts[JOINTS].copy(holeWorld);

        updateWebbing(THREE, jointPts, camera, clipAxis, STRAP_HALF_W, STRAP_HALF_T, strap);
      }

      function pointerNdc(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        const w = rect.width || 1;
        const h = rect.height || 1;
        pointer.x = ((event.clientX - rect.left) / w) * 2 - 1;
        pointer.y = -(((event.clientY - rect.top) / h) * 2 - 1);
      }

      function onDown(event: PointerEvent) {
        pointerNdc(event);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObject(cardMesh, true);
        if (hits.length === 0) return;
        event.preventDefault();
        renderer.domElement.setPointerCapture(event.pointerId);
        renderer.domElement.style.cursor = 'grabbing';
        grabState.down = true;
        grabState.pointerId = event.pointerId;
        grabState.lastT = performance.now();
        grabState.lastNdcX = pointer.x;

        const hit = hits[0].point;
        grabOff.x = cardMesh.position.x - hit.x;
        grabOff.y = cardMesh.position.y - hit.y;
        grabOff.z = cardMesh.position.z - hit.z;
        camera.getWorldDirection(camDir);
        dragPlane.setFromNormalAndCoplanarPoint(camDir, hit);
      }

      function onMove(event: PointerEvent) {
        if (!grabState.down || event.pointerId !== grabState.pointerId) return;
        pointerNdc(event);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.ray.intersectPlane(dragPlane, planeHit);
        if (!hit) return;

        const maxR = SEG_LEN * JOINTS * 0.95;
        const tx = hit.x + grabOff.x;
        const ty = hit.y + grabOff.y;
        const tz = clamp(hit.z + grabOff.z, -0.4, 0.4);

        const now = performance.now();
        const stepDt = Math.max(DT, (now - grabState.lastT) / 1000);
        const hole = joints[JOINTS - 1];

        const dYaw = (pointer.x - grabState.lastNdcX) * 3.4;
        spinY += dYaw;
        spinVel = dYaw / stepDt;
        grabState.lastNdcX = pointer.x;
        grabState.lastT = now;

        hole.x = clamp(tx, -maxR, maxR);
        hole.y = ty + (cardHalfH - HOLE);
        hole.z = tz;
        hole.ox = hole.x;
        hole.oy = hole.y;
        hole.oz = hole.z;
      }

      function onUp(event: PointerEvent) {
        if (!grabState.down || event.pointerId !== grabState.pointerId) return;
        grabState.down = false;
        renderer.domElement.style.cursor = 'grab';
        try {
          renderer.domElement.releasePointerCapture(event.pointerId);
        } catch {}
      }

      // Load Images
      const imgLogo = new Image();
      imgLogo.crossOrigin = 'anonymous';
      imgLogo.onload = () => {
        ticketRef.current.logo = imgLogo;
        paintTicket();
      };
      imgLogo.src = logoSrc;

      const imgPhoto = new Image();
      imgPhoto.crossOrigin = 'anonymous';
      imgPhoto.onload = () => {
        ticketRef.current.photo = imgPhoto;
        paintTicket();
      };
      imgPhoto.src = photoSrc;

      paintTicket();
      frameCamera();
      setTimeout(frameCamera, 50);

      let raf = 0;
      function loop() {
        raf = requestAnimationFrame(loop);
        simulate();
        syncVisuals();
        renderer.render(scene, camera);
      }

      raf = requestAnimationFrame(loop);
      startTransition(() => setStatus('ready'));

      const ro = new ResizeObserver(() => frameCamera());
      ro.observe(stageEl);

      const canvas = renderer.domElement;
      canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        canvas.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        renderer.dispose();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      };
    } catch (e) {
      console.error('LanyardPass render error', e);
      startTransition(() => setStatus('fail'));
    }

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [logoSrc, photoSrc, size]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full min-h-[580px] overflow-hidden select-none touch-none ${className}`}
      style={{ ...style }}
    >
      {status === 'boot' && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">
          Loading 3D Access Pass...
        </div>
      )}
    </div>
  );
};

export default LanyardPass;

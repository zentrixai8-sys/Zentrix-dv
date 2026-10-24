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

let swRegistration: ServiceWorkerRegistration | null = null;
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
    // Register Service Worker for PWA / Web
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          swRegistration = reg;
        })
        .catch((err) => {
          console.warn('Service Worker registration skipped:', err);
        });
    });
  }
};

// Auto-run channel initialization
if (typeof window !== 'undefined') {
  initNotificationChannel();
}

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
  if ('Notification' in window && Notification.permission === 'granted') {
    const defaultIcon = '/logo.png';
    const defaultBadge = '/favicon.png';
    const tag = payload.tag || `zentrixs-${Date.now()}`;

    try {
      if (swRegistration && 'showNotification' in swRegistration) {
        swRegistration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || defaultIcon,
          badge: payload.badge || defaultBadge,
          tag,
          vibrate: [200, 100, 200, 100, 200] as any,
          data: payload.data || { url: '/dashboard' }
        } as any);
        return true;
      }

      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || defaultIcon,
          badge: payload.badge || defaultBadge,
          tag,
          vibrate: [200, 100, 200, 100, 200] as any,
          data: payload.data || { url: '/dashboard' }
        } as any);
        return true;
      }

      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || defaultIcon,
        badge: payload.badge || defaultBadge,
        tag
      });

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
const trackedTaskIds = new Set<string>();
const trackedTaskStatuses = new Map<string, string>();
let isWatcherInitialized = false;

export const startLiveTicketWatcher = (
  role: 'admin' | 'company',
  companyId?: string,
  onUpdate?: () => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  // Prompt for notification permission on start
  requestNotificationPermission();

  if (liveWatcherInterval) {
    clearInterval(liveWatcherInterval);
  }

  const pollTickets = async () => {
    try {
      const { fetchTasks } = await import('./taskService');
      const latestTasks = await fetchTasks(role === 'company' && companyId ? { companyId } : undefined, true);

      if (!Array.isArray(latestTasks) || latestTasks.length === 0) return;

      // First run: Seed current existing tasks into memory so we don't spam old notifications
      if (!isWatcherInitialized) {
        latestTasks.forEach((t) => {
          trackedTaskIds.add(t.id);
          trackedTaskStatuses.set(t.id, t.status);
        });
        isWatcherInitialized = true;
        return;
      }

      // Check for newly added tickets (raised while logged in)
      for (const t of latestTasks) {
        if (!trackedTaskIds.has(t.id)) {
          trackedTaskIds.add(t.id);
          trackedTaskStatuses.set(t.id, t.status);

          // Fire native OS notification outside app
          await sendOutsideNotification({
            title: `🔔 New Ticket #${t.ticketNumber}`,
            body: `${t.partyName}: ${t.typeOfWork || 'New Task'} - ${t.systemName || ''}`,
            tag: `new-ticket-${t.id}`,
            data: { url: '/dashboard', ticketId: t.id }
          });

          if (onUpdate) onUpdate();
        } else {
          // Check for status changes on existing tickets
          const oldStatus = trackedTaskStatuses.get(t.id);
          if (oldStatus && oldStatus !== t.status) {
            trackedTaskStatuses.set(t.id, t.status);

            await sendOutsideNotification({
              title: `⚡ Ticket #${t.ticketNumber} ${t.status}`,
              body: `${t.systemName || t.partyName} status changed from ${oldStatus} to ${t.status}`,
              tag: `status-${t.id}-${t.status}`,
              data: { url: '/dashboard', ticketId: t.id }
            });

            if (onUpdate) onUpdate();
          }
        }
      }
    } catch (_) {
      // background network error: fail silently
    }
  };

  // Immediate initial check
  pollTickets();

  // Poll every 10 seconds while user is logged in
  liveWatcherInterval = setInterval(pollTickets, 10000);

  return () => {
    if (liveWatcherInterval) {
      clearInterval(liveWatcherInterval);
      liveWatcherInterval = null;
    }
  };
};

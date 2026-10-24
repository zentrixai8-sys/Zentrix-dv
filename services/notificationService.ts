// Enterprise Real-Time OS Push Notification Service for Zentrixs
// Fires native system notifications outside the browser window (device level & lock screen)

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

// Auto-register service worker for OS-level background notifications
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        swRegistration = reg;
      })
      .catch((err) => {
        console.warn('Zentrixs Service Worker registration:', err);
      });
  });
}

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendOutsideNotification({
        title: '🔔 Zentrixs Real-time Alerts Enabled',
        body: 'You will now receive instant ticket updates and enterprise alerts even when the app is in background or closed.',
        tag: 'zentrixs-welcome'
      });
    }
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

export const sendOutsideNotification = (payload: NotificationPayload): boolean => {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  const defaultIcon = '/logo.png';
  const defaultBadge = '/favicon.png';
  const tag = payload.tag || `zentrixs-${Date.now()}`;

  try {
    // 1. Try Service Worker ShowNotification (Works outside app & in background on Android/Mobile)
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

    // Check navigator.serviceWorker.ready
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        swRegistration = reg;
        reg.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || defaultIcon,
          badge: payload.badge || defaultBadge,
          tag,
          vibrate: [200, 100, 200, 100, 200] as any,
          data: payload.data || { url: '/dashboard' }
        } as any);
      }).catch(() => {
        fallbackWindowNotification(payload, defaultIcon, defaultBadge, tag);
      });
      return true;
    }

    return fallbackWindowNotification(payload, defaultIcon, defaultBadge, tag);
  } catch (err) {
    return fallbackWindowNotification(payload, defaultIcon, defaultBadge, tag);
  }
};

const fallbackWindowNotification = (
  payload: NotificationPayload,
  defaultIcon: string,
  defaultBadge: string,
  tag: string
): boolean => {
  try {
    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || defaultIcon,
      badge: payload.badge || defaultBadge,
      tag,
      data: payload.data,
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      if (payload.onClick) {
        payload.onClick();
      }
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to display native notification:', err);
    return false;
  }
};

// Ready-made alerts
export const samplePushAlerts = {
  newTicket: (ticketNumber: string, clientName: string) => ({
    title: `🎫 New Ticket #${ticketNumber}`,
    body: `${clientName} has raised an urgent automation task. Tap to review.`,
    tag: `ticket-${ticketNumber}`
  }),
  statusUpdate: (ticketNumber: string, status: string) => ({
    title: `⚡ Ticket #${ticketNumber} Updated`,
    body: `Status changed to "${status}". Enterprise engineer is working on it.`,
    tag: `status-${ticketNumber}`
  }),
  delegationAssigned: (taskTitle: string, assignee: string) => ({
    title: `📋 Delegation Assigned`,
    body: `"${taskTitle}" assigned to ${assignee}.`,
    tag: `delegation-${Date.now()}`
  })
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

  // Prompt for notification permission on login if not yet granted/denied
  if (isNotificationSupported() && Notification.permission === 'default') {
    requestNotificationPermission();
  }

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
          sendOutsideNotification({
            title: `🔔 New Ticket #${t.ticketNumber}`,
            body: `${t.partyName}: ${t.typeOfWork || 'New Task'} - ${t.systemName || ''}`,
            tag: `new-ticket-${t.id}`,
            data: { url: '/dashboard' }
          });

          if (onUpdate) onUpdate();
        } else {
          // Check for status changes on existing tickets
          const oldStatus = trackedTaskStatuses.get(t.id);
          if (oldStatus && oldStatus !== t.status) {
            trackedTaskStatuses.set(t.id, t.status);

            sendOutsideNotification({
              title: `⚡ Ticket #${t.ticketNumber} ${t.status}`,
              body: `${t.systemName || t.partyName} status changed from ${oldStatus} to ${t.status}`,
              tag: `status-${t.id}-${t.status}`,
              data: { url: '/dashboard' }
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

  // Poll every 15 seconds while user is logged in
  liveWatcherInterval = setInterval(pollTickets, 15000);

  return () => {
    if (liveWatcherInterval) {
      clearInterval(liveWatcherInterval);
      liveWatcherInterval = null;
    }
  };
};

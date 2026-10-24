// Zentrixs Enterprise Service Worker
// Enables Native Android OS Push Notifications & Background Alerts outside app window

const CACHE_NAME = 'zentrixs-portal-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from web application to display OS-level notification outside app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, badge, tag, data } = event.data.payload || {};
    
    event.waitUntil(
      self.registration.showNotification(title || 'Zentrixs Alert', {
        body: body || 'You have a new enterprise update.',
        icon: icon || '/logo.png',
        badge: badge || '/favicon.png',
        tag: tag || 'zentrixs-alert',
        vibrate: [200, 100, 200, 100, 200],
        data: data || { url: '/dashboard' },
        requireInteraction: false
      })
    );
  }
});

// Native Push Event from Cloudflare / Push Server
self.addEventListener('push', (event) => {
  let data = { title: 'Zentrixs Alert', body: 'New notification received.' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data = { title: 'Zentrixs Alert', body: event.data ? event.data.text() : 'New notification received.' };
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/logo.png',
      badge: data.badge || '/favicon.png',
      tag: data.tag || `zentrixs-push-${Date.now()}`,
      vibrate: [200, 100, 200],
      data: data.data || { url: '/dashboard' }
    })
  );
});

// Clicking notification opens or focuses the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(targetUrl)) {
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

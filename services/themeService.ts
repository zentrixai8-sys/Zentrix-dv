import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export type PortalTheme = 'dark' | 'light';

export const applyStatusBarTheme = async (theme: PortalTheme): Promise<void> => {
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) return;
  try {
    // overlaysWebView: false ensures webview is pushed down below the status bar,
    // so content never collides with camera punch-holes or status bar icons.
    await StatusBar.setOverlaysWebView({ overlay: false });

    if (theme === 'light') {
      // In Capacitor StatusBar:
      // Style.Light = Dark icons (Battery, Wifi, Cell Tower, Clock turn dark on light backgrounds)
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#FAF3EA' });
    } else {
      // Style.Dark = Light/White icons (Battery, Wifi, Cell Tower, Clock turn white on dark backgrounds)
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0A0D14' });
    }
  } catch (err) {
    console.warn('Status bar update skipped:', err);
  }
};

export const getStoredTheme = (): PortalTheme => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('zentrix_theme');
    // Default to 'light' as requested by the user
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const setStoredTheme = (theme: PortalTheme): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('zentrix_theme', theme);
    applyStatusBarTheme(theme);
    window.dispatchEvent(new CustomEvent('zentrix_theme_change', { detail: theme }));
  } catch (e) {
    console.error(e);
  }
};

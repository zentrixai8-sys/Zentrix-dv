import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export type PortalTheme = 'dark' | 'light';

export const applyStatusBarTheme = async (theme: PortalTheme): Promise<void> => {
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) return;
  try {
    if (theme === 'light') {
      // In @capacitor/status-bar:
      // Style.Light = Dark content (battery, wifi, network, time icons turn dark on light backgrounds)
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#FFFCF8' });
    } else {
      // Style.Dark = Light content (battery, wifi, network, time icons turn white on dark backgrounds)
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#070A11' });
    }
  } catch (err) {
    console.warn('Status bar update skipped:', err);
  }
};

export const getStoredTheme = (): PortalTheme => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem('zentrix_theme');
    return saved === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
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

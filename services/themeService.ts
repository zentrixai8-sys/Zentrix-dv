import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export type PortalTheme = 'dark' | 'light';

export const applyHtmlThemeClass = (theme: PortalTheme): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
    body.classList.remove('dark');
    body.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    body.classList.remove('light');
    body.classList.add('dark');
  }
};

export const applyStatusBarTheme = async (theme: PortalTheme): Promise<void> => {
  if (typeof window === 'undefined') return;
  applyHtmlThemeClass(theme);
  if (!Capacitor.isNativePlatform()) return;
  try {
    // Explicitly make sure StatusBar is visible and never hidden
    await StatusBar.show();
    await StatusBar.setOverlaysWebView({ overlay: false });

    if (theme === 'light') {
      // In Capacitor StatusBar:
      // Style.Light = Dark content (Battery, Wifi, Cell Tower, Clock turn dark on light background)
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#FAF3EA' });
    } else {
      // In Capacitor StatusBar:
      // Style.Dark = Light/White content (Battery, Wifi, Cell Tower, Clock turn bright white on dark background)
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
    // Default to 'light' as requested
    const finalTheme = saved === 'dark' ? 'dark' : 'light';
    applyHtmlThemeClass(finalTheme);
    return finalTheme;
  } catch {
    applyHtmlThemeClass('light');
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

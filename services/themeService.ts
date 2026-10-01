export type PortalTheme = 'dark' | 'light';

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
    window.dispatchEvent(new CustomEvent('zentrix_theme_change', { detail: theme }));
  } catch (e) {
    console.error(e);
  }
};

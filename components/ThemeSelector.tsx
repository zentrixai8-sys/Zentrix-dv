import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { PortalTheme, setStoredTheme } from '../services/themeService';

interface ThemeSelectorProps {
  theme: PortalTheme;
  onChange?: (theme: PortalTheme) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  theme,
  onChange,
  className = '',
  size = 'md'
}) => {
  const isLight = theme === 'light';

  const handleSelect = (nextTheme: PortalTheme) => {
    if (nextTheme === theme) return;
    setStoredTheme(nextTheme);
    if (onChange) onChange(nextTheme);
  };

  const isSmall = size === 'sm';

  return (
    <div
      role="radiogroup"
      aria-label="Theme Selection"
      className={`inline-flex items-center p-1 rounded-2xl border transition-all duration-300 select-none shadow-sm ${
        isLight
          ? 'bg-[#F5EAD9]/80 border-[#E8D9C5] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]'
          : 'bg-[#0F172A]/90 border-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] backdrop-blur-md'
      } ${className}`}
    >
      {/* Light Theme Button */}
      <button
        type="button"
        role="radio"
        aria-checked={isLight}
        onClick={() => handleSelect('light')}
        title="Switch to Light Theme"
        className={`relative flex items-center gap-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
          isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        } ${
          isLight
            ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] text-white shadow-md shadow-[#EA552E]/30 scale-[1.02]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Sun
          className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform duration-300 ${
            isLight ? 'text-amber-200 rotate-12 scale-110' : 'text-slate-400'
          }`}
        />
        <span className="tracking-tight">Light</span>
      </button>

      {/* Dark Theme Button */}
      <button
        type="button"
        role="radio"
        aria-checked={!isLight}
        onClick={() => handleSelect('dark')}
        title="Switch to Dark Theme"
        className={`relative flex items-center gap-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
          isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        } ${
          !isLight
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
            : 'text-[#8A7B68] hover:text-[#2A2118] hover:bg-black/5'
        }`}
      >
        <Moon
          className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform duration-300 ${
            !isLight ? 'text-cyan-200 -rotate-12 scale-110' : 'text-[#8A7B68]'
          }`}
        />
        <span className="tracking-tight">Dark</span>
      </button>
    </div>
  );
};

export default ThemeSelector;

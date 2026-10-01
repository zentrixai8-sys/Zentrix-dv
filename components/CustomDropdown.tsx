import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  dotColor?: string;
  badge?: string;
  badgeColor?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  isLight?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  badgeStyle?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  isLight = false,
  size = 'md',
  className = '',
  menuClassName = '',
  align = 'left',
  badgeStyle = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getStatusBadgeColors = (statusVal: string) => {
    switch (statusVal) {
      case 'Completed':
        return isLight 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return isLight 
          ? 'bg-blue-50 text-blue-700 border-blue-200' 
          : 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'In Review':
        return isLight 
          ? 'bg-purple-50 text-purple-700 border-purple-200' 
          : 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Rejected':
        return isLight 
          ? 'bg-red-50 text-red-700 border-red-200' 
          : 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Pending':
      default:
        return isLight 
          ? 'bg-amber-50 text-amber-700 border-amber-200' 
          : 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const isSmall = size === 'sm';

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl transition-all cursor-pointer font-medium border select-none ${
          badgeStyle
            ? `${getStatusBadgeColors(value)} ${isSmall ? 'px-2.5 py-1 text-[11px] font-bold' : 'px-3 py-1.5 text-xs font-bold'}`
            : isLight
            ? `bg-slate-50 hover:bg-slate-100 text-slate-800 ${
                isOpen 
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-white' 
                  : 'border-slate-200 hover:border-slate-300'
              } ${isSmall ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2.5 text-xs font-semibold'}`
            : `bg-[#0B1120] hover:bg-[#111A2E] text-slate-200 ${
                isOpen 
                  ? 'border-cyan-400 ring-2 ring-cyan-500/20 text-white' 
                  : 'border-white/10 hover:border-cyan-500/40'
              } ${isSmall ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2.5 text-xs font-semibold'}`
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
          {selectedOption?.dotColor && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.dotColor}`} />
          )}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 min-w-[190px] w-max max-w-xs max-h-64 overflow-y-auto z-[70] rounded-2xl p-1.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 border ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${
            isLight
              ? 'bg-white/98 backdrop-blur-2xl border-slate-200 shadow-slate-900/15'
              : 'bg-[#0B1120]/98 backdrop-blur-2xl border-cyan-500/30 shadow-black/90'
          } ${menuClassName}`}
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                  isSelected
                    ? isLight
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'bg-cyan-500/15 text-white font-bold border border-cyan-500/30'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {opt.dotColor && (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                  )}
                  <div className="truncate">
                    <div className="truncate font-medium">{opt.label}</div>
                    {opt.sublabel && (
                      <div className={`text-[10px] truncate ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {opt.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${opt.badgeColor || 'bg-white/10 text-slate-400'}`}>
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

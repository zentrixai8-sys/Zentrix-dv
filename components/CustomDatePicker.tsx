import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, X, Clock } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // ISO format 'YYYY-MM-DD'
  onChange: (val: string) => void;
  isLight?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  isLight = false,
  className = '',
  placeholder = 'Select completion date...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date or default to current date
  const parseDate = (str: string) => {
    if (!str) return new Date();
    const parts = str.split('-').map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date();
  };

  const selectedDate = value ? parseDate(value) : null;
  const [viewDate, setViewDate] = useState<Date>(selectedDate || new Date());

  useEffect(() => {
    if (value) {
      setViewDate(parseDate(value));
    }
  }, [value]);

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

  const formatToISO = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplay = (val: string) => {
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length === 3) {
      return `${parts[2]} - ${parts[1]} - ${parts[0]}`;
    }
    return val;
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const handleSelectDay = (day: number) => {
    const chosen = new Date(currentYear, currentMonth, day);
    onChange(formatToISO(chosen));
    setIsOpen(false);
  };

  const setPreset = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    onChange(formatToISO(d));
    setIsOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${
          isLight
            ? `bg-[#FBF5EC] text-[#2A2118] ${
                isOpen
                  ? 'border-[#EA552E] ring-2 ring-[#EA552E]/20'
                  : 'border-[#EDE2D3] hover:border-[#EA552E]/50'
              }`
            : `bg-black/50 text-white ${
                isOpen
                  ? 'border-cyan-400 ring-2 ring-cyan-500/20'
                  : 'border-white/10 hover:border-cyan-500/40'
              }`
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon
            className={`w-4 h-4 shrink-0 ${
              isLight ? 'text-[#EA552E]' : 'text-cyan-400'
            }`}
          />
          <span className={`font-mono font-bold ${value ? '' : 'opacity-60 font-sans font-normal'}`}>
            {value ? formatDisplay(value) : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen
              ? isLight ? 'rotate-180 text-[#EA552E]' : 'rotate-180 text-cyan-400'
              : isLight ? 'text-[#9C8F7D]' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Floating In-DOM Calendar Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 left-0 right-0 w-full sm:w-80 max-w-full z-[85] rounded-2xl p-3.5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150 border ${
            isLight
              ? 'bg-[#FFFCF8] border-[#EDE2D3] text-[#2A2118] shadow-[0_12px_36px_rgba(234,85,46,0.14)]'
              : 'bg-[#0B1120] border-cyan-500/30 text-white shadow-2xl shadow-black/90'
          }`}
        >
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
            <span className={`flex items-center gap-1 shrink-0 mr-0.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
              <Clock className="w-3 h-3" />
              <span>Quick:</span>
            </span>
            <button
              type="button"
              onClick={() => setPreset(0)}
              className={`px-2 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#D9481F] border-[#EDE2D3]'
                  : 'bg-white/5 hover:bg-white/10 text-cyan-300 border-white/10'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setPreset(1)}
              className={`px-2 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#D9481F] border-[#EDE2D3]'
                  : 'bg-white/5 hover:bg-white/10 text-cyan-300 border-white/10'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setPreset(3)}
              className={`px-2 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#D9481F] border-[#EDE2D3]'
                  : 'bg-white/5 hover:bg-white/10 text-cyan-300 border-white/10'
              }`}
            >
              +3 Days
            </button>
            <button
              type="button"
              onClick={() => setPreset(7)}
              className={`px-2 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#D9481F] border-[#EDE2D3]'
                  : 'bg-white/5 hover:bg-white/10 text-cyan-300 border-white/10'
              }`}
            >
              +1 Week
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={prevMonth}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FBF5EC] hover:bg-[#F5EDE1] text-[#2A2118] border-[#EDE2D3]'
                  : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
              }`}
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-xs tracking-wide">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FBF5EC] hover:bg-[#F5EDE1] text-[#2A2118] border-[#EDE2D3]'
                  : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
              }`}
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase opacity-60">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-8 w-full" />;
              }
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-full flex items-center justify-center rounded-xl font-bold transition-all cursor-pointer ${
                    selected
                      ? isLight
                        ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] text-white shadow-md shadow-[#EA552E]/30 scale-105'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30 scale-105'
                      : today
                      ? isLight
                        ? 'border border-[#EA552E] text-[#EA552E] bg-[#FDF3E7]'
                        : 'border border-cyan-400 text-cyan-400 bg-cyan-950/20'
                      : isLight
                      ? 'text-[#2A2118] hover:bg-[#FDF3E7]'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer with Clear & Close */}
          <div className={`flex items-center justify-between pt-2 border-t text-[11px] font-bold ${
            isLight ? 'border-[#EDE2D3]' : 'border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className={`hover:underline cursor-pointer ${
                isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1 rounded-lg text-white transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#EA552E] hover:bg-[#D9481F]'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;

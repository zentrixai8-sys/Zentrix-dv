import React, { useRef, useEffect, useState } from 'react';
import { 
  Home, 
  FileText, 
  Headphones, 
  PlusCircle,
  ListTodo,
  Users
} from 'lucide-react';

interface DashboardMobileBarProps {
  role: 'company' | 'admin';
  activeTab: string;
  onTabChange: (tab: any) => void;
  onCenterAction?: () => void;
  onOpenMenu?: () => void;
  unreadCount?: number;
  delegationsCount?: number;
  employeesCount?: number;
  isSuperAdmin?: boolean;
  isLight?: boolean;
}

export const DashboardMobileBar: React.FC<DashboardMobileBarProps> = ({
  role,
  activeTab,
  onTabChange,
  onCenterAction,
  onOpenMenu,
  unreadCount = 0,
  delegationsCount = 0,
  employeesCount = 0,
  isSuperAdmin = true,
  isLight = false
}) => {
  const isCompany = role === 'company';

  // Company tabs
  const isHome = activeTab === 'overview';
  const isBookings = activeTab === 'all_tickets' || activeTab === 'pending' || activeTab === 'completed';
  const isRaise = activeTab === 'raise';
  const isSupport = activeTab === 'troubleshoot' || activeTab === 'ai';

  // Admin tabs
  const isAdminHome = activeTab === 'overview';
  const isAdminTickets = activeTab === 'console' || activeTab === 'tickets';
  const isAdminDelegation = activeTab === 'delegation';
  const isAdminEmployees = activeTab === 'employees';

  const items = isCompany
    ? [
        {
          id: 'overview',
          label: 'Home',
          icon: Home,
          isActive: isHome,
          onClick: () => onTabChange('overview')
        },
        {
          id: 'all_tickets',
          label: 'Tickets',
          icon: FileText,
          isActive: isBookings,
          badge: unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : undefined,
          onClick: () => onTabChange('all_tickets')
        },
        {
          id: 'raise',
          label: 'Raise Ticket',
          icon: PlusCircle,
          isActive: isRaise,
          onClick: () => onTabChange('raise')
        },
        {
          id: 'troubleshoot',
          label: 'Support',
          icon: Headphones,
          isActive: isSupport,
          onClick: () => onTabChange('troubleshoot')
        }
      ]
    : [
        {
          id: 'overview',
          label: 'Home',
          icon: Home,
          isActive: isAdminHome,
          onClick: () => onTabChange('overview')
        },
        {
          id: 'console',
          label: 'Tickets',
          icon: FileText,
          isActive: isAdminTickets,
          badge: unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : undefined,
          onClick: () => onTabChange('console')
        },
        {
          id: 'delegation',
          label: 'Delegation',
          icon: ListTodo,
          isActive: isAdminDelegation,
          badge: delegationsCount > 0 ? (delegationsCount > 9 ? '9+' : delegationsCount) : undefined,
          onClick: () => onTabChange('delegation')
        },
        {
          id: 'employees',
          label: isSuperAdmin ? 'Workload' : 'My Tasks',
          icon: Users,
          isActive: isAdminEmployees,
          onClick: () => {
            if (isSuperAdmin) {
              onTabChange('employees');
            } else {
              onTabChange('delegation');
            }
          }
        }
      ];

  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0
  });

  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Calculate sliding pill indicator position with spring-like smooth movement
  useEffect(() => {
    const activeItem = items.find(it => it.isActive);
    if (!activeItem) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    const activeButton = buttonRefs.current[activeItem.id];
    const nav = navRef.current;

    if (activeButton && nav) {
      const navRect = nav.getBoundingClientRect();
      const btnRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
        opacity: 1
      });
    }
  }, [activeTab, items]);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden pb-[max(env(safe-area-inset-bottom),14px)] pt-2 px-3 pointer-events-none select-none">
      <nav
        ref={navRef}
        className={`relative max-w-[400px] mx-auto p-1.5 rounded-full border shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-3xl flex items-center justify-between gap-1 pointer-events-auto transition-colors duration-500 overflow-hidden ${
          isLight
            ? 'bg-white/95 border-[#E8DEC8] text-[#2A2118]'
            : 'bg-[#0B0F19]/95 border-white/15 text-white'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Sliding Fluid Indicator Pill with Spring Easing */}
        <div
          className={`absolute top-1.5 bottom-1.5 rounded-full pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isLight
              ? 'bg-[#1C1610] text-white shadow-lg shadow-black/25'
              : 'bg-gradient-to-r from-[#EA552E] via-[#F0653A] to-[#FF7A50] text-white shadow-[0_0_20px_rgba(234,85,46,0.55)]'
          }`}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
        />

        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              ref={(el) => { buttonRefs.current[item.id] = el; }}
              onClick={item.onClick}
              className={`relative z-10 flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer focus:outline-none active:scale-90 ${
                active
                  ? 'px-4 sm:px-5 py-2.5 text-white gap-2 font-bold'
                  : isLight
                    ? 'text-[#8A7B68] hover:text-[#1C1610] p-2.5 flex-1'
                    : 'text-zinc-400 hover:text-white p-2.5 flex-1'
              }`}
            >
              {/* Icon with subtle scale jump on active */}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${
                  active ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[2]'
                }`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text label with smooth fade & horizontal reveal */}
              {active && (
                <span className="text-xs sm:text-sm font-bold font-sans tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardMobileBar;

import React from 'react';
import { 
  Home, 
  FileText, 
  Headphones, 
  User, 
  PlusCircle
} from 'lucide-react';

interface DashboardMobileBarProps {
  role: 'company' | 'admin';
  activeTab: string;
  onTabChange: (tab: any) => void;
  onCenterAction?: () => void;
  onOpenMenu?: () => void;
  unreadCount?: number;
  isLight?: boolean;
}

export const DashboardMobileBar: React.FC<DashboardMobileBarProps> = ({
  role,
  activeTab,
  onTabChange,
  onCenterAction,
  onOpenMenu,
  unreadCount = 0,
  isLight = false
}) => {
  if (role === 'company') {
    const isHome = activeTab === 'overview';
    const isBookings = activeTab === 'all_tickets' || activeTab === 'pending' || activeTab === 'completed';
    const isRaise = activeTab === 'raise';
    const isSupport = activeTab === 'troubleshoot' || activeTab === 'ai';

    const navItems = [
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
    ];

    return (
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden pb-[max(env(safe-area-inset-bottom),14px)] pt-2 px-3 pointer-events-none">
        {/* Floating Capsule Bar Container */}
        <nav
          className={`max-w-[390px] mx-auto p-2 rounded-full border shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-2xl flex items-center justify-between gap-1.5 pointer-events-auto transition-all ${
            isLight
              ? 'bg-white/95 border-[#EDE2D3] text-[#2A2118]'
              : 'bg-[#090D18]/95 border-white/15 text-white'
          }`}
          aria-label="Company Portal Mobile Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer focus:outline-none active:scale-95 ${
                  active
                    ? isLight
                      ? 'bg-[#1C1610] text-white px-5 py-2.5 shadow-md gap-2.5'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black px-5 py-2.5 shadow-[0_0_18px_rgba(6,182,212,0.45)] gap-2.5'
                    : isLight
                      ? 'text-[#8A7B68] hover:text-[#2A2118] p-3 flex-1'
                      : 'text-zinc-400 hover:text-white p-3 flex-1'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Show Label ONLY for the active item, exactly matching reference image */}
                {active && (
                  <span className="text-sm font-bold font-sans tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Admin Bottom Bar
  const isAdminHome = activeTab === 'overview';
  const isAdminTickets = activeTab === 'console' || activeTab === 'tickets';
  const isAdminClients = activeTab === 'companies';

  const adminItems = [
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
      id: 'companies',
      label: 'Clients',
      icon: Headphones,
      isActive: isAdminClients,
      onClick: () => onTabChange('companies')
    },
    {
      id: 'account',
      label: 'Admin',
      icon: User,
      isActive: false,
      onClick: () => {
        if (onOpenMenu) onOpenMenu();
      }
    }
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden pb-[max(env(safe-area-inset-bottom),14px)] pt-2 px-3 pointer-events-none">
      <nav
        className={`max-w-[390px] mx-auto p-2 rounded-full border shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-2xl flex items-center justify-between gap-1.5 pointer-events-auto transition-all ${
          isLight
            ? 'bg-white/95 border-[#EDE2D3] text-[#2A2118]'
            : 'bg-[#090D18]/95 border-white/15 text-white'
        }`}
        aria-label="Admin Console Mobile Navigation"
      >
        {adminItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`relative flex items-center justify-center transition-all duration-300 rounded-full cursor-pointer focus:outline-none active:scale-95 ${
                active
                  ? isLight
                    ? 'bg-[#1C1610] text-white px-5 py-2.5 shadow-md gap-2.5'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black px-5 py-2.5 shadow-[0_0_18px_rgba(6,182,212,0.45)] gap-2.5'
                  : isLight
                    ? 'text-[#8A7B68] hover:text-[#2A2118] p-3 flex-1'
                    : 'text-zinc-400 hover:text-white p-3 flex-1'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 stroke-[2.2]" />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {active && (
                <span className="text-sm font-bold font-sans tracking-tight whitespace-nowrap">
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

import React, { useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  Building2, 
  Users, 
  MessageSquare, 
  Wrench, 
  Sun, 
  Moon, 
  LogOut, 
  ExternalLink, 
  Bell, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { sendOutsideNotification, isNotificationSupported, requestNotificationPermission } from '../services/notificationService';
import { PortalTheme } from '../services/themeService';

interface DashboardSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'admin' | 'company';
  activeTab: string;
  onSelectTab: (tab: any) => void;
  userName: string;
  userRoleLabel: string;
  companyName?: string;
  companyLogo?: string;
  theme: PortalTheme;
  onToggleTheme: () => void;
  onLogout: () => void;
  totalTickets?: number;
  pendingTickets?: number;
  isLight?: boolean;
}

export const DashboardSidebarDrawer: React.FC<DashboardSidebarDrawerProps> = ({
  isOpen,
  onClose,
  role,
  activeTab,
  onSelectTab,
  userName,
  userRoleLabel,
  companyName,
  companyLogo,
  theme,
  onToggleTheme,
  onLogout,
  totalTickets = 0,
  pendingTickets = 0,
  isLight = false
}) => {
  // Prevent body scroll when drawer is open & handle ESC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const handleTestAlert = async () => {
    if (!isNotificationSupported()) return;
    if (Notification.permission !== 'granted') {
      await requestNotificationPermission();
      return;
    }

    sendOutsideNotification({
      title: role === 'admin' ? '⚡ Super Admin Notification' : '⚡ Client Portal Notification',
      body: 'Real-time OS device alerts active. All enterprise automation systems operating at 100%.',
      tag: 'sidebar-alert'
    });
  };

  const handleTabClick = (tabKey: string) => {
    onSelectTab(tabKey);
    onClose();
  };

  // Menu items for Admin
  const adminMenuItems = [
    { key: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard, badge: undefined },
    { key: 'console', label: 'Tickets Console', icon: Ticket, badge: totalTickets > 0 ? `${totalTickets}` : undefined },
    { key: 'delegation', label: 'Task Delegation', icon: PlusCircle, badge: undefined },
    { key: 'companies', label: 'Client Companies CRM', icon: Building2, badge: undefined },
    { key: 'employees', label: 'Engineers & Staff', icon: Users, badge: undefined },
    { key: 'whatsapp', label: 'WhatsApp Settings', icon: MessageSquare, badge: 'Live' },
    { key: 'cms', label: 'Website CMS Controls', icon: Cpu, badge: undefined },
  ];

  // Menu items for Company
  const companyMenuItems = [
    { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, badge: undefined },
    { key: 'all_tickets', label: 'All Support Tickets', icon: Ticket, badge: totalTickets > 0 ? `${totalTickets}` : undefined },
    { key: 'raise', label: '+ Raise New Ticket', icon: PlusCircle, badge: 'Quick' },
    { key: 'systems', label: 'Connected Systems', icon: Cpu, badge: undefined },
    { key: 'ai', label: 'AI Support Copilot', icon: Sparkles, badge: 'AI' },
    { key: 'troubleshoot', label: 'Troubleshoot Guide', icon: Wrench, badge: undefined },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : companyMenuItems;

  return (
    <>
      {/* Frosted Glass Backdrop Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto bg-black/75 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-In Native App Drawer (Airtel Thanks / Jio App Style) */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[84%] max-w-[320px] transition-transform duration-300 ease-out md:hidden flex flex-col shadow-2xl border-r ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isLight 
            ? 'bg-[#FFFFFF] border-[#E8DEC8] text-[#2A2118]' 
            : 'bg-[#0A0D15] border-white/10 text-white'
        }`}
        aria-label="Mobile Navigation Menu"
      >
        {/* Top Profile / User Card Banner */}
        <div className={`p-5 border-b relative ${
          isLight ? 'bg-gradient-to-br from-[#FDF6ED] to-[#F5E8D8] border-[#E8DEC8]' : 'bg-gradient-to-br from-[#0F1420] to-[#0A0D15] border-white/10'
        }`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-transform active:scale-90 ${
              isLight ? 'bg-black/5 hover:bg-black/10 text-[#6B5D4A]' : 'bg-white/10 hover:bg-white/15 text-zinc-300'
            }`}
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            {companyLogo ? (
              <div className="w-13 h-13 rounded-2xl bg-white p-1.5 border border-black/10 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                <img src={companyLogo} alt={companyName || userName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg shrink-0 ${
                isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F]' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
              }`}>
                {(companyName || userName || 'Z').charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono tracking-wider uppercase ${
                  isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {userRoleLabel}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="font-bold text-sm truncate leading-tight">
                {companyName || userName}
              </h3>
              <p className={`text-[11px] font-mono truncate ${isLight ? 'text-[#8A7B68]' : 'text-zinc-400'}`}>
                {role === 'admin' ? 'admin@zentrixs.in' : `User: ${userName}`}
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge Strip */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/5">
            <div className={`p-2 rounded-xl text-center ${
              isLight ? 'bg-white/80 border border-[#EDE2D3]' : 'bg-white/5 border border-white/5'
            }`}>
              <div className={`text-sm font-black font-mono ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>
                {totalTickets}
              </div>
              <div className={`text-[9px] uppercase tracking-wider font-bold ${isLight ? 'text-[#8A7B68]' : 'text-zinc-400'}`}>
                Total Tickets
              </div>
            </div>
            <div className={`p-2 rounded-xl text-center ${
              isLight ? 'bg-white/80 border border-[#EDE2D3]' : 'bg-white/5 border border-white/5'
            }`}>
              <div className="text-sm font-black font-mono text-amber-400">
                {pendingTickets}
              </div>
              <div className={`text-[9px] uppercase tracking-wider font-bold ${isLight ? 'text-[#8A7B68]' : 'text-zinc-400'}`}>
                Active / In Progress
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
            isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            Navigation Menu
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-[0.98] ${
                  isItemActive
                    ? isLight
                      ? 'bg-[#EA552E] text-white shadow-md shadow-[#EA552E]/20'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25'
                    : isLight
                      ? 'text-[#2A2118] hover:bg-[#FDF3E7]'
                      : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    isItemActive
                      ? 'bg-white/20 text-white'
                      : isLight ? 'bg-[#F5EAD9] text-[#6B5D4A]' : 'bg-white/10 text-zinc-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                      isItemActive 
                        ? 'bg-white text-zinc-900' 
                        : isLight ? 'bg-[#EA552E]/10 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isItemActive ? 'text-white' : ''}`} />
                </div>
              </button>
            );
          })}

          {/* Quick Outside Alert Test Button */}
          <div className="pt-3 mt-3 border-t border-black/5">
            <button
              onClick={handleTestAlert}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                isLight 
                  ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#E8DEC8] hover:border-[#EA552E]' 
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Test Outside OS Alert</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Push
              </span>
            </button>
          </div>
        </div>

        {/* Footer: Theme Toggle & Logout */}
        <div className={`p-4 border-t space-y-2 ${
          isLight ? 'bg-[#FDF6ED] border-[#E8DEC8]' : 'bg-[#0A0D15] border-white/10'
        }`}>
          {/* Theme switcher row */}
          <div className="flex items-center justify-between px-1">
            <span className={`text-xs font-bold ${isLight ? 'text-[#6B5D4A]' : 'text-zinc-300'}`}>
              Display Theme
            </span>
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-transform active:scale-95 ${
                isLight 
                  ? 'bg-white border-[#E8DEC8] text-[#2A2118]' 
                  : 'bg-white/10 border-white/10 text-white'
              }`}
            >
              {isLight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs border transition-transform active:scale-95 ${
              isLight 
                ? 'bg-[#FBEAEA] text-[#D14343] border-[#F3D5D5] hover:bg-[#F8DCDC]' 
                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebarDrawer;

import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Plus, 
  Cpu, 
  Building2, 
  Menu
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
  // Common container styling - 100% OPAQUE to prevent any background text bleed
  const navBg = isLight 
    ? 'bg-white border-t border-[#E8DEC8] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] text-[#2A2118]' 
    : 'bg-[#090C14] border-t border-cyan-500/25 shadow-[0_-10px_35px_rgba(0,0,0,0.95)] text-white';

  if (role === 'company') {
    const isTicketsActive = activeTab === 'all_tickets' || activeTab === 'pending' || activeTab === 'completed';

    return (
      <nav
        className={`fixed bottom-0 inset-x-0 z-50 md:hidden pb-[max(env(safe-area-inset-bottom),10px)] pt-2 transition-all ${navBg}`}
        aria-label="Company Portal Mobile Navigation"
      >
        <div className="max-w-md mx-auto px-3 flex items-center justify-between relative">
          {/* TAB 1: Home */}
          <button
            onClick={() => onTabChange('overview')}
            className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none"
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'overview'
                ? isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
            }`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${
              activeTab === 'overview'
                ? isLight ? 'text-[#EA552E] font-bold' : 'text-cyan-400 font-bold'
                : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
            }`}>
              Home
            </span>
          </button>

          {/* TAB 2: Tickets */}
          <button
            onClick={() => onTabChange('all_tickets')}
            className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none relative"
          >
            <div className={`p-1.5 rounded-xl transition-all relative ${
              isTicketsActive
                ? isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
            }`}>
              <Ticket className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${
              isTicketsActive
                ? isLight ? 'text-[#EA552E] font-bold' : 'text-cyan-400 font-bold'
                : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
            }`}>
              Tickets
            </span>
          </button>

          {/* TAB 3: CENTER ACTION BUTTON - + Raise */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-5">
            <button
              onClick={() => {
                if (onCenterAction) onCenterAction();
                else onTabChange('raise');
              }}
              className="relative group active:scale-90 transition-transform focus:outline-none cursor-pointer"
              aria-label="Raise Ticket"
            >
              {/* Outer Glow */}
              <div className={`absolute -inset-1 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse ${
                isLight ? 'bg-[#EA552E]' : 'bg-cyan-400'
              }`} />
              
              {/* Crisp Elevated Circle Button */}
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ${
                isLight 
                  ? 'bg-gradient-to-tr from-[#EA552E] to-[#F0653A] border-2 border-white' 
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 border-2 border-[#090C14]'
              }`}>
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
            </button>
            <span className={`text-[10px] font-mono font-bold tracking-wider uppercase mt-1 ${
              isLight ? 'text-[#EA552E]' : 'text-cyan-300'
            }`}>
              Raise
            </span>
          </div>

          {/* TAB 4: Systems */}
          <button
            onClick={() => onTabChange('systems')}
            className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none"
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'systems'
                ? isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${
              activeTab === 'systems'
                ? isLight ? 'text-[#EA552E] font-bold' : 'text-cyan-400 font-bold'
                : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
            }`}>
              Systems
            </span>
          </button>

          {/* TAB 5: Menu (Opens Side Drawer) */}
          <button
            onClick={onOpenMenu}
            className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none"
            aria-label="Open Side Menu"
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-zinc-400 hover:text-white'
            }`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${isLight ? 'text-[#8A7B68]' : 'text-zinc-400'}`}>
              Menu
            </span>
          </button>
        </div>
      </nav>
    );
  }

  // Admin Bottom Bar
  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-50 md:hidden pb-[max(env(safe-area-inset-bottom),10px)] pt-2 transition-all ${navBg}`}
      aria-label="Admin Console Mobile Navigation"
    >
      <div className="max-w-md mx-auto px-3 flex items-center justify-between relative">
        {/* TAB 1: Dashboard */}
        <button
          onClick={() => onTabChange('overview')}
          className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'overview'
              ? isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${
            activeTab === 'overview'
              ? isLight ? 'text-[#EA552E] font-bold' : 'text-cyan-400 font-bold'
              : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            Home
          </span>
        </button>

        {/* TAB 2: Tickets */}
        <button
          onClick={() => onTabChange('console')}
          className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none relative"
        >
          <div className={`p-1.5 rounded-xl transition-all relative ${
            activeTab === 'console'
              ? isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            <Ticket className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${
            activeTab === 'console'
              ? isLight ? 'text-[#EA552E] font-bold' : 'text-cyan-400 font-bold'
              : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            Tickets
          </span>
        </button>

        {/* TAB 3: CENTER ACTION BUTTON - + Delegate */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => {
              if (onCenterAction) onCenterAction();
              else onTabChange('delegation');
            }}
            className="relative group active:scale-90 transition-transform focus:outline-none cursor-pointer"
            aria-label="Delegate Task"
          >
            {/* Outer Glow */}
            <div className={`absolute -inset-1 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse ${
              isLight ? 'bg-[#EA552E]' : 'bg-cyan-400'
            }`} />
            
            {/* Crisp Elevated Circle Button */}
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ${
              isLight 
                ? 'bg-gradient-to-tr from-[#EA552E] to-[#F0653A] border-2 border-white' 
                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 border-2 border-[#090C14]'
            }`}>
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
          </button>
          <span className={`text-[10px] font-mono font-bold tracking-wider uppercase mt-1 ${
            isLight ? 'text-[#EA552E]' : 'text-cyan-300'
          }`}>
            Assign
          </span>
        </div>

        {/* TAB 4: Clients */}
        <button
          onClick={() => onTabChange('companies')}
          className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'companies'
              ? isLight ? 'bg-[#EA552E]/15 text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${
            activeTab === 'companies'
              ? isLight ? 'text-[#EA552E] font-bold' : 'text-cyan-400 font-bold'
              : isLight ? 'text-[#8A7B68]' : 'text-zinc-400'
          }`}>
            Clients
          </span>
        </button>

        {/* TAB 5: Menu (Opens Side Drawer) */}
        <button
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center py-1 active:scale-90 transition-transform focus:outline-none"
          aria-label="Open Side Menu"
        >
          <div className={`p-1.5 rounded-xl transition-all ${isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-zinc-400 hover:text-white'}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${isLight ? 'text-[#8A7B68]' : 'text-zinc-400'}`}>
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardMobileBar;

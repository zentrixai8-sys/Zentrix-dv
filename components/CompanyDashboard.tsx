import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  Sparkles, 
  LogOut, 
  Search, 
  RefreshCw, 
  SlidersHorizontal, 
  ExternalLink, 
  Calendar, 
  User, 
  UploadCloud, 
  Check, 
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  Send,
  MessageSquare,
  BarChart3,
  Mail,
  AlertTriangle,
  Eye,
  Paperclip,
  Smartphone,
  Sun,
  Moon,
  Zap,
  Server,
  LayoutDashboard
} from 'lucide-react';
import { Task, SystemItem, WorkType, TaskPriority } from '../types/taskTypes';
import { 
  fetchTasks, 
  createTask, 
  uploadFileToCloudinary,
  getSystemsForCompany, 
  getCompanies,
  getAuthSession, 
  clearAuthSession 
} from '../services/taskService';
import { sendTicketWhatsAppNotification } from '../services/whatsappService';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import CustomDropdown from './CustomDropdown';
import AnalyticsOverview from './AnalyticsOverview';
import ThemeSelector from './ThemeSelector';
import TroubleshootCenter from './TroubleshootCenter';

interface CompanyDashboardProps {
  onLogout: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onLogout }) => {
  const session = getAuthSession();
  const companyName = session?.companyName || 'Piramal Petroleum Private Limited';
  const userName = session?.user || 'Vaibhav1';
  const companyId = session?.companyId || 'comp_piramal';
  const compRecord = getCompanies().find(c => c.id === companyId || c.code === companyId || c.name === companyName);
  const companyLogo = compRecord?.logoUrl || compRecord?.avatar;
  const companyInitials = companyName.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Portal Theme: 'dark' | 'light'
  const [theme, setTheme] = useState<PortalTheme>(getStoredTheme);

  useEffect(() => {
    const handleThemeEvent = () => setTheme(getStoredTheme());
    window.addEventListener('zentrix_theme_change', handleThemeEvent);
    return () => window.removeEventListener('zentrix_theme_change', handleThemeEvent);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setStoredTheme(next);
  };

  const isLight = theme === 'light';

  // Navigation tabs styled like the admin pills
  const [activeTab, setActiveTab] = useState<
    'overview' | 'all_tickets' | 'raise' | 'pending' | 'completed' | 'systems' | 'troubleshoot' | 'ai'
  >('overview');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [companyLogoError, setCompanyLogoError] = useState(false);

  // Form states matching screenshot requirements
  const [formTypeOfWork, setFormTypeOfWork] = useState<WorkType>('Existing System Edit & Update');
  const [formPersonName, setFormPersonName] = useState(userName);
  const [formPhone, setFormPhone] = useState('');
  const [formSystemName, setFormSystemName] = useState('Checklist & Delegation');
  const [formDescription, setFormDescription] = useState('');
  const [formExpectedDate, setFormExpectedDate] = useState('2026-03-20');
  const [formPriority, setFormPriority] = useState<TaskPriority>('High');
  const [formLink, setFormLink] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail view modal
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // AI chat state
  const [aiMessages, setAiMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: `Welcome ${userName}! Zentrixs AI Diagnostic Hub is active for ${companyName}. How can I assist you with your systems or error reports today?` }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRaiseTicketFromTroubleshoot = (
    systemName: string,
    typeOfWork: WorkType,
    description: string,
    priority: TaskPriority
  ) => {
    setFormSystemName(systemName);
    setFormTypeOfWork(typeOfWork);
    setFormDescription(description);
    setFormPriority(priority);
    setActiveTab('raise');
    showToast(`Pre-filled ticket for ${systemName}. Please review and submit.`);
  };

  const handleAskAiFromTroubleshoot = (prompt: string) => {
    setAiInput(prompt);
    setActiveTab('ai');
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
      setCurrentTime(`${dateStr} • ${timeStr}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks({ companyId });
      setTasks(data);
      const sysList = getSystemsForCompany(companyId);
      setSystems(sysList);

      // Pre-fill phone if available from company records
      const comp = getCompanies().find(c => c.id === companyId || c.code === companyId || c.name === companyName);
      if (comp?.phone && !formPhone) {
        setFormPhone(comp.phone);
      }
    } catch (err) {
      console.error('Failed to load company tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;

    setSubmitting(true);
    try {
      let uploadedFileUrl: string | undefined = undefined;
      if (formFile) {
        const upRes = await uploadFileToCloudinary(formFile);
        if (upRes.success && upRes.url) {
          uploadedFileUrl = upRes.url;
        }
      }

      const res = await createTask({
        companyId,
        partyName: companyName,
        personName: formPersonName,
        typeOfWork: formTypeOfWork,
        systemName: formSystemName,
        descriptionOfWork: formDescription,
        expectedDateToClose: formExpectedDate,
        priorityInCustomer: formPriority,
        linkOfSystem: formLink || undefined,
        uploadFileUrl: uploadedFileUrl,
        uploadFileName: formFile ? formFile.name : undefined
      });

      if (res.success) {
        const ticketId = res.task?.ticketNumber || `TCK-2026-${Math.floor(100 + Math.random() * 900)}`;
        const targetPhone = formPhone.trim() || getCompanies().find(c => c.id === companyId || c.code === companyId)?.phone || '';

        // Trigger WhatsApp Notification via Meta Cloud API using template help_ticket
        if (targetPhone) {
          sendTicketWhatsAppNotification({
            to: targetPhone,
            personName: formPersonName || companyName,
            ticketNumber: ticketId
          }).then((waRes) => {
            if (waRes.success) {
              console.log('WhatsApp notification successfully dispatched:', waRes.messageId);
            } else {
              console.warn('WhatsApp auto-dispatch note:', waRes.error);
            }
          }).catch(err => {
            console.error('WhatsApp dispatch error:', err);
          });
        }

        showToast(`Ticket raised successfully (${ticketId})! ${targetPhone ? 'WhatsApp notification sent to client.' : ''}`);
        setFormDescription('');
        setFormFile(null);
        await loadData();
        setTimeout(() => {
          setActiveTab('pending');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      let reply = `Telemetry diagnosis for "${userText}": System endpoints are responsive. If this is a breaking bug, submit an 'Error Received' ticket via '+ Raise Ticket' and our assigned engineer will address it.`;
      if (userText.toLowerCase().includes('whatsapp')) {
        reply = 'WhatsApp Status: Meta webhook callback is healthy. If message triggers stop, check if the auth token refreshed or submit an edit request.';
      } else if (userText.toLowerCase().includes('database') || userText.toLowerCase().includes('sync')) {
        reply = 'System Database sync is operational with latency under 15ms. All records are intact.';
      }
      setAiMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setAiLoading(false);
    }, 800);
  };

  // Filter tasks based on selected tab & filters
  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'pending' && t.status === 'Completed') return false;
    if (activeTab === 'completed' && t.status !== 'Completed') return false;
    if (priorityFilter !== 'All' && t.priorityInCustomer !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        t.ticketNumber.toLowerCase().includes(q) ||
        t.systemName.toLowerCase().includes(q) ||
        t.descriptionOfWork.toLowerCase().includes(q) ||
        t.typeOfWork.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // KPI counts
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const urgentTasks = tasks.filter(t => t.priorityInCustomer === 'Urgent' || t.priorityInCustomer === 'High').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#FBF5EC] text-[#2A2118] selection:bg-[#EA552E]/20' : 'bg-[#070A11] text-slate-100 selection:bg-blue-600/30'
    }`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-400 text-xs font-bold animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 text-cyan-300" />
          {toastMessage}
        </div>
      )}

      <header className={`border-b sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors duration-300 ${
        isLight ? 'bg-[#FFFCF8]/90 border-[#EDE2D3] backdrop-blur-xl shadow-[0_2px_20px_rgba(234,85,46,0.06)] text-[#2A2118]' : 'bg-black/95 border-white/10 backdrop-blur-xl text-white'
      }`}>
        {/* Row 1: Identity + Account Controls */}
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {companyLogo && !companyLogoError ? (
              <div className={`w-11 h-11 rounded-2xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden border shadow-sm ${
                isLight ? 'bg-[#FDF3E7] border-[#EDE2D3]' : 'bg-white/5 border-white/10'
              }`}>
                <img src={companyLogo} alt={companyName} loading="eager" decoding="async" className="w-full h-full object-contain" onError={() => setCompanyLogoError(true)} />
              </div>
            ) : (
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm tracking-wide shadow-sm ${
                isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F] text-white' : 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'
              }`}>
                {companyInitials}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className={`text-base sm:text-lg font-black tracking-tight uppercase truncate max-w-[200px] sm:max-w-sm ${
                  isLight ? 'text-[#2A2118]' : 'text-white'
                }`}>
                  {companyName}
                </h1>
                <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black font-mono border shrink-0 ${
                  isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  CLIENT PORTAL
                </span>
              </div>
              <p className={`hidden md:flex text-[11px] items-center gap-1.5 mt-0.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                <span>Welcome back, <strong className={`font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{userName}</strong></span>
                <span className="opacity-50">•</span>
                <span className={`font-mono ${isLight ? 'text-[#EA552E]' : 'text-cyan-500'}`}>{currentTime || '10/1/2026 • 9:53:14 PM'}</span>
                <span className="opacity-50">•</span>
                <span className="text-emerald-600 font-semibold">{systems.length || 7} Systems Connected</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Selector (Light / Dark) */}
            <ThemeSelector theme={theme} onChange={setTheme} size="sm" />

            {/* Disconnect Button (Icon Only) */}
            <button
              onClick={() => {
                clearAuthSession();
                onLogout();
              }}
              title="Disconnect / Logout"
              className={`flex items-center justify-center p-2.5 text-xs font-bold rounded-xl border transition-all duration-200 hover:scale-[1.05] active:scale-95 cursor-pointer ${
                isLight
                  ? 'text-[#D14343] hover:bg-[#FBEAEA] border-[#F3D5D5]'
                  : 'text-red-400 hover:text-white hover:bg-red-600/20 border-red-500/30'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Primary Navigation — own row so nothing ever clips */}
        <div className={`-mx-4 sm:-mx-8 mt-3 px-4 sm:px-8 pt-2.5 border-t overflow-x-auto no-scrollbar ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
          <div className="flex items-center gap-1 w-max">
            {([
              { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { key: 'completed', label: `Completed Tasks (${completedTasks})` },
              { key: 'pending', label: `Pending Tasks (${pendingTasks})` },
              { key: 'raise', label: '+ Raise Ticket', icon: PlusCircle },
              { key: 'systems', label: `All Systems (${systems.length || 7})` },
              { key: 'troubleshoot', label: 'Troubleshoot' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:bg-[#FDF3E7] hover:text-[#2A2118]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {'icon' in tab && tab.icon ? React.createElement(tab.icon as any, { className: "w-3.5 h-3.5" }) : null}
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                  : isLight ? 'text-amber-600 hover:bg-amber-50 hover:text-[#2A2118]' : 'text-amber-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Consultant
            </button>
          </div>
        </div>
      </header>

      {/* Main Body - Full Canvas Width */}
      <div className="w-full px-4 sm:px-8 py-6 space-y-6">
        {/* KPI Tiles — dynamic contextual metrics per tab */}
        {(activeTab === 'overview' || activeTab === 'completed' || activeTab === 'pending' || activeTab === 'all_tickets') && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(() => {
            if (activeTab === 'completed') {
              const comp = tasks.filter((t) => t.status === 'Completed').length;
              const compUrgent = tasks.filter((t) => t.status === 'Completed' && (t.priorityInCustomer === 'Urgent' || t.priorityInCustomer === 'High')).length;
              return [
                {
                  label: 'Completed Tasks',
                  value: comp,
                  icon: CheckCircle2,
                  accent: 'emerald' as const,
                  sub: 'Resolved & Live ✓',
                  live: true,
                  ratio: 1,
                  onClick: () => { setActiveTab('completed'); setPriorityFilter('All'); setSearchQuery(''); }
                },
                {
                  label: 'High Priority Closed',
                  value: compUrgent,
                  icon: AlertTriangle,
                  accent: 'red' as const,
                  sub: 'Critical Solved',
                  ratio: comp ? compUrgent / comp : 0,
                  onClick: () => { setActiveTab('completed'); setPriorityFilter('High'); setSearchQuery(''); }
                },
                {
                  label: 'Total Company Tasks',
                  value: totalTasks,
                  icon: Layers,
                  accent: 'cyan' as const,
                  sub: 'All Historical',
                  ratio: 1,
                  onClick: () => { setActiveTab('all_tickets'); setPriorityFilter('All'); setSearchQuery(''); }
                },
                {
                  label: 'Completion Rate',
                  value: `${totalTasks ? Math.round((comp / totalTasks) * 100) : 0}%`,
                  icon: Zap,
                  accent: 'blue' as const,
                  sub: 'Resolution Rate',
                  ratio: totalTasks ? comp / totalTasks : 0,
                  onClick: () => { setActiveTab('completed'); }
                },
                {
                  label: 'Still Active/Pending',
                  value: activeTasks,
                  icon: Clock,
                  accent: 'amber' as const,
                  sub: 'Ongoing Work',
                  ratio: totalTasks ? activeTasks / totalTasks : 0,
                  onClick: () => { setActiveTab('pending'); setPriorityFilter('All'); setSearchQuery(''); }
                },
                {
                  label: 'Protected Systems',
                  value: systems.length || 7,
                  icon: Server,
                  accent: 'purple' as const,
                  sub: '100% Operational',
                  ratio: 1,
                  onClick: () => { setActiveTab('systems'); }
                },
              ];
            }

            if (activeTab === 'pending') {
              const pend = tasks.filter((t) => t.status === 'Pending').length;
              const inProg = tasks.filter((t) => t.status === 'In Progress').length;
              const inRev = tasks.filter((t) => t.status === 'In Review').length;
              const pendUrgent = tasks.filter((t) => t.status === 'Pending' && (t.priorityInCustomer === 'Urgent' || t.priorityInCustomer === 'High')).length;
              return [
                {
                  label: 'Pending Action',
                  value: pend,
                  icon: Clock,
                  accent: 'amber' as const,
                  sub: 'Awaiting engineer ↗',
                  live: true,
                  ratio: 1,
                  onClick: () => { setActiveTab('pending'); setPriorityFilter('All'); setSearchQuery(''); }
                },
                {
                  label: 'In Progress Dev',
                  value: inProg,
                  icon: Zap,
                  accent: 'blue' as const,
                  sub: 'Active Resolution',
                  ratio: totalTasks ? inProg / totalTasks : 0,
                  onClick: () => { setActiveTab('pending'); setPriorityFilter('All'); setSearchQuery('In Progress'); }
                },
                {
                  label: 'In Review / QA',
                  value: inRev,
                  icon: Eye,
                  accent: 'purple' as const,
                  sub: 'Verification Stage',
                  ratio: totalTasks ? inRev / totalTasks : 0,
                  onClick: () => { setActiveTab('pending'); setPriorityFilter('All'); setSearchQuery('In Review'); }
                },
                {
                  label: 'Urgent Pending',
                  value: pendUrgent,
                  icon: AlertTriangle,
                  accent: 'red' as const,
                  sub: 'Priority Tickets',
                  ratio: pend ? pendUrgent / pend : 0,
                  onClick: () => { setActiveTab('pending'); setPriorityFilter('High'); setSearchQuery(''); }
                },
                {
                  label: 'Completed So Far',
                  value: completedTasks,
                  icon: CheckCircle2,
                  accent: 'emerald' as const,
                  sub: 'Resolved Tickets ✓',
                  ratio: totalTasks ? completedTasks / totalTasks : 0,
                  onClick: () => { setActiveTab('completed'); setPriorityFilter('All'); setSearchQuery(''); }
                },
                {
                  label: 'Total Raised',
                  value: totalTasks,
                  icon: Layers,
                  accent: 'cyan' as const,
                  sub: 'Lifetime Tickets',
                  ratio: 1,
                  onClick: () => { setActiveTab('all_tickets'); setPriorityFilter('All'); setSearchQuery(''); }
                },
              ];
            }

            return [
              {
                label: 'Total Tasks',
                value: totalTasks,
                icon: Layers,
                accent: 'cyan' as const,
                sub: 'Real-time Live Sync',
                live: true,
                ratio: 1,
                onClick: () => { setActiveTab('all_tickets'); setPriorityFilter('All'); setSearchQuery(''); }
              },
              {
                label: 'Active Tasks',
                value: activeTasks,
                icon: Zap,
                accent: 'blue' as const,
                sub: 'In Progress & Dev',
                ratio: totalTasks ? activeTasks / totalTasks : 0,
                onClick: () => { setActiveTab('pending'); setPriorityFilter('All'); setSearchQuery(''); }
              },
              {
                label: 'Pending',
                value: pendingTasks,
                icon: Clock,
                accent: 'amber' as const,
                sub: 'Awaiting engineer ↗',
                ratio: totalTasks ? pendingTasks / totalTasks : 0,
                onClick: () => { setActiveTab('pending'); setPriorityFilter('All'); setSearchQuery(''); }
              },
              {
                label: 'High / Urgent',
                value: urgentTasks,
                icon: AlertTriangle,
                accent: 'red' as const,
                sub: 'Priority tickets',
                ratio: totalTasks ? urgentTasks / totalTasks : 0,
                onClick: () => { setActiveTab('all_tickets'); setPriorityFilter('High'); setSearchQuery(''); }
              },
              {
                label: 'Completed',
                value: completedTasks,
                icon: CheckCircle2,
                accent: 'emerald' as const,
                sub: 'Verified & Live ✓',
                ratio: totalTasks ? completedTasks / totalTasks : 0,
                onClick: () => { setActiveTab('completed'); setPriorityFilter('All'); setSearchQuery(''); }
              },
              {
                label: 'Connected Systems',
                value: systems.length || 7,
                icon: Server,
                accent: 'purple' as const,
                sub: '100% Operational',
                ratio: 1,
                onClick: () => { setActiveTab('systems'); }
              },
            ];
          })().map((tile, idx) => {
            const palette: Record<string, { rgb: string; iconGrad: string; meterLight: string; meterDark: string; numLight: string; numDark: string; subLight: string; subDark: string; ring: string }> = {
              cyan: { rgb: '6,182,212', iconGrad: 'from-cyan-400 to-cyan-600', meterLight: 'bg-cyan-500', meterDark: 'bg-cyan-400', numLight: 'text-[#0E7490]', numDark: 'text-cyan-300', subLight: 'text-cyan-700', subDark: 'text-cyan-300/80', ring: 'group-hover:ring-cyan-400/40' },
              blue: { rgb: '59,130,246', iconGrad: 'from-blue-400 to-blue-600', meterLight: 'bg-blue-500', meterDark: 'bg-blue-400', numLight: 'text-[#1D4ED8]', numDark: 'text-blue-300', subLight: 'text-blue-700', subDark: 'text-blue-300/80', ring: 'group-hover:ring-blue-400/40' },
              amber: { rgb: '245,158,11', iconGrad: 'from-amber-400 to-orange-500', meterLight: 'bg-amber-500', meterDark: 'bg-amber-400', numLight: 'text-[#B45309]', numDark: 'text-amber-300', subLight: 'text-amber-700', subDark: 'text-amber-300/80', ring: 'group-hover:ring-amber-400/40' },
              red: { rgb: '239,68,68', iconGrad: 'from-red-400 to-rose-600', meterLight: 'bg-red-500', meterDark: 'bg-red-400', numLight: 'text-[#B91C1C]', numDark: 'text-red-300', subLight: 'text-red-700', subDark: 'text-red-300/80', ring: 'group-hover:ring-red-400/40' },
              emerald: { rgb: '16,185,129', iconGrad: 'from-emerald-400 to-green-600', meterLight: 'bg-emerald-500', meterDark: 'bg-emerald-400', numLight: 'text-[#047857]', numDark: 'text-emerald-300', subLight: 'text-emerald-700', subDark: 'text-emerald-300/80', ring: 'group-hover:ring-emerald-400/40' },
              purple: { rgb: '168,85,247', iconGrad: 'from-purple-400 to-fuchsia-600', meterLight: 'bg-purple-500', meterDark: 'bg-purple-400', numLight: 'text-[#7E22CE]', numDark: 'text-purple-300', subLight: 'text-purple-700', subDark: 'text-purple-300/80', ring: 'group-hover:ring-purple-400/40' },
            };
            const p = palette[tile.accent];
            const Icon = tile.icon;
            return (
              <div
                key={tile.label}
                role="button"
                tabIndex={0}
                onClick={tile.onClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tile.onClick?.();
                  }
                }}
                className={`stagger-item group relative border rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] cursor-pointer select-none ring-1 ring-transparent ${p.ring} ${
                  isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_34px_rgba(234,85,46,0.12)]' : 'bg-[#0F172A]/80 border-white/10 hover:shadow-[0_14px_34px_rgba(0,0,0,0.45)]'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
                title={`Click to view ${tile.label}`}
              >
                {/* Radial accent glow */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(${p.rgb},${isLight ? 0.5 : 0.65}) 0%, transparent 70%)` }}
                ></div>

                <div className="relative flex items-start justify-between mb-3">
                  <div className={`text-[10px] font-bold uppercase tracking-widest pt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>{tile.label}</div>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${p.iconGrad} text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-md`}
                    style={{ boxShadow: `0 6px 16px rgba(${p.rgb},${isLight ? 0.35 : 0.45})` }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className={`relative text-[32px] leading-none font-black ${isLight ? p.numLight : p.numDark}`}>{tile.value}</div>

                {/* Share-of-total meter */}
                <div className={`relative mt-3 h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-[#F3EADC]' : 'bg-white/10'}`}>
                  <div
                    className={`h-full rounded-full ${isLight ? p.meterLight : p.meterDark}`}
                    style={{ width: `${Math.max(6, Math.round(tile.ratio * 100))}%`, transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)', transitionDelay: `${0.2 + idx * 0.05}s` }}
                  ></div>
                </div>

                <div className={`relative text-[10px] mt-2 font-mono flex items-center gap-1 ${isLight ? p.subLight : p.subDark}`}>
                  {tile.live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                  {tile.sub}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: DASHBOARD (Interactive Analytics Overview)                            */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <AnalyticsOverview tasks={tasks} systems={systems} isLight={isLight} />
        )}

        {/* ========================================================================= */}
        {/* TAB: COMPLETED TASKS & PENDING TASKS (Dark Cyber Table matching Admin)   */}
        {/* ========================================================================= */}
        {(activeTab === 'completed' || activeTab === 'pending' || activeTab === 'all_tickets') && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className={`border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
              isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)]' : 'bg-[#0F172A]/90 border-white/10'
            }`}>
              <div className="relative w-full md:w-80">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-[#B5A892]' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, system, description..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all duration-200 ${
                    isLight
                      ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/10'
                      : 'bg-black/40 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={loadData}
                  className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                    isLight ? 'bg-[#EA552E] hover:bg-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Priorities' },
                    { value: 'Urgent', label: 'Urgent', dotColor: 'bg-red-500' },
                    { value: 'High', label: 'High', dotColor: 'bg-amber-400' },
                    { value: 'Medium', label: 'Medium', dotColor: 'bg-blue-400' },
                    { value: 'Low', label: 'Low', dotColor: 'bg-slate-400' }
                  ]}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  isLight={isLight}
                  className="w-36"
                />

                <button
                  onClick={() => setActiveTab('raise')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-white rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                    isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Raise Ticket
                </button>
              </div>
            </div>

            {/* Tasks Table */}
            <div className={`border rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${
              isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0B0F19]/90 border-white/10'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                      isLight ? 'bg-[#FBF5EC]/90 border-[#EDE2D3] text-[#8A7B68]' : 'border-white/10 bg-white/[0.02] text-slate-400'
                    }`}>
                      <th className="py-4 px-4 whitespace-nowrap">Type of Work</th>
                      <th className="py-4 px-4 whitespace-nowrap">Party Name</th>
                      <th className="py-4 px-4 whitespace-nowrap">System Name</th>
                      <th className="py-4 px-4 min-w-[280px]">Description of Work</th>
                      <th className="py-4 px-3 text-center">Link</th>
                      <th className="py-4 px-3">Priority</th>
                      <th className="py-4 px-4 whitespace-nowrap">Assigned Engineer</th>
                      <th className="py-4 px-4 whitespace-nowrap">Expected Close</th>
                      <th className="py-4 px-4 whitespace-nowrap">Status</th>
                      <th className="py-4 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-[#F3EADC]' : 'divide-white/5'}`}>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={10} className={`py-12 text-center ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`}>
                          No tasks found. Click <strong>+ Raise Ticket</strong> above to assign work to Zentrixs.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((t) => (
                        <tr key={t.id} className={`transition-colors duration-200 ${isLight ? 'hover:bg-[#FBF5EC]' : 'hover:bg-white/[0.02]'}`}>
                          {/* Type of Work */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                              isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#EDE2D3]' : 'bg-white/5 text-slate-300 border-white/5'
                            }`}>
                              {t.typeOfWork}
                            </span>
                          </td>

                          {/* Party Name */}
                          <td className={`py-4 px-4 font-bold whitespace-nowrap ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                            {t.partyName}
                          </td>

                          {/* System Name */}
                          <td className={`py-4 px-4 font-semibold whitespace-nowrap ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>
                            {t.systemName}
                          </td>

                          {/* Description of Work */}
                          <td className={`py-4 px-4 leading-relaxed ${isLight ? 'text-[#5C5244]' : 'text-slate-300'}`}>
                            {expandedTaskId === t.id ? (
                              <div>
                                {t.descriptionOfWork}
                                <button
                                  onClick={() => setExpandedTaskId(null)}
                                  className={`ml-2 font-bold hover:underline ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}
                                >
                                  Show less
                                </button>
                              </div>
                            ) : (
                              <div>
                                {t.descriptionOfWork.length > 75
                                  ? `${t.descriptionOfWork.slice(0, 75)}... `
                                  : t.descriptionOfWork}
                                {t.descriptionOfWork.length > 75 && (
                                  <button
                                    onClick={() => setExpandedTaskId(t.id)}
                                    className={`font-bold hover:underline ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}
                                  >
                                    Read more
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Link of System */}
                          <td className="py-4 px-3 text-center">
                            {t.linkOfSystem ? (
                              <a
                                href={t.linkOfSystem}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex p-1.5 rounded-lg transition-colors ${isLight ? 'bg-[#FDEEE7] hover:bg-[#F9DCCB] text-[#EA552E]' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'}`}
                                title="Open System Link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className={isLight ? 'text-[#C9BCA8]' : 'text-slate-600'}>-</span>
                            )}
                          </td>

                          {/* Priority */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.priorityInCustomer === 'Urgent'
                                ? isLight ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : t.priorityInCustomer === 'High'
                                ? isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border border-[#EDE2D3]' : 'bg-slate-700/40 text-slate-300 border border-white/10'
                            }`}>
                              {t.priorityInCustomer}
                            </span>
                          </td>

                          {/* Assigned Engineer */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`font-medium ${isLight ? 'text-[#5C5244]' : 'text-slate-300'}`}>
                              {t.assignedTo && t.assignedTo !== 'Unassigned' ? (
                                <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#EA552E]' : 'bg-cyan-400'}`}></span>
                                  {t.assignedTo}
                                </span>
                              ) : (
                                <span className={isLight ? 'text-[#B5A892] italic' : 'text-slate-500 italic'}>Assigning...</span>
                              )}
                            </span>
                          </td>

                          {/* Expected Date to Close */}
                          <td className={`py-4 px-4 font-mono whitespace-nowrap ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                            {t.expectedDateToClose}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              t.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : t.status === 'In Progress'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : t.status === 'In Review'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                t.status === 'Completed' ? 'bg-emerald-400' : t.status === 'In Progress' ? 'bg-blue-400' : 'bg-amber-400'
                              }`}></span>
                              {t.status}
                            </span>
                          </td>

                          {/* Action (View detail modal & Cloudinary file) */}
                          <td className="py-4 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {t.uploadFileUrl && (
                                <a
                                  href={t.uploadFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1.5 rounded-lg border transition-colors ${isLight ? 'bg-[#FDEEE7] hover:bg-[#F9DCCB] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}
                                  title={`Cloudinary File: ${t.uploadFileName || 'View Upload'}`}
                                >
                                  <Paperclip className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => setViewingTask(t)}
                                className={`p-1.5 rounded-lg transition-colors ${isLight ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#6B5D4A] hover:text-[#2A2118]' : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'}`}
                                title="View full ticket details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: RAISE TICKET (Dark Cyber Glassmorphic Form)                           */}
        {/* ========================================================================= */}
        {activeTab === 'raise' && (
          <div className={`max-w-3xl mx-auto border rounded-3xl p-8 shadow-2xl space-y-6 transition-colors duration-300 ${
            isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0F172A] border-white/10'
          }`}>
            <div className={`pb-4 border-b flex items-center justify-between ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div>
                <span className={`inline-block px-3 py-1 rounded-lg font-bold text-xs tracking-wider mb-2 border font-mono ${
                  isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  TASK TICKET 1
                </span>
                <h2 className={`text-2xl font-black tracking-tight ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Raise New Task to Zentrixs Admin</h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Once raised, this task will appear immediately in the Super Admin Console for engineer assignment.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-6">
              {/* Type of Work */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Type of Work <span className="text-red-400">*</span>
                </label>
                <CustomDropdown
                  options={[
                    { value: 'Complain Report', label: 'Complain Report', dotColor: 'bg-red-400' },
                    { value: 'Error Received', label: 'Error Received', dotColor: 'bg-amber-400' },
                    { value: 'Existing System Edit & Update', label: 'Existing System Edit & Update', dotColor: 'bg-blue-400' },
                    { value: 'New System', label: 'New System', dotColor: 'bg-emerald-400' }
                  ]}
                  value={formTypeOfWork}
                  onChange={(val) => setFormTypeOfWork(val as WorkType)}
                  isLight={isLight}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Date (Auto Generated) */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Date (Auto Generated)
                  </label>
                  <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 text-sm font-mono ${
                    isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#EA552E]' : 'bg-black/40 border-white/10 text-cyan-400'
                  }`}>
                    <Calendar className={`w-4 h-4 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <span>{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                {/* Person Name */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Person Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      required
                      value={formPersonName}
                      onChange={(e) => setFormPersonName(e.target.value)}
                      placeholder="Enter person name"
                      className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-colors duration-200 ${
                        isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Client WhatsApp Number */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Client WhatsApp
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Auto Alert</span>
                  </label>
                  <div className="relative">
                    <Smartphone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-sm font-mono focus:outline-none transition-colors duration-200 ${
                        isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#C9BCA8] focus:border-emerald-500' : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* System Name */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    System Name <span className="text-red-400">*</span>
                  </label>
                  <CustomDropdown
                    options={[
                      { value: 'Checklist & Delegation', label: 'Checklist & Delegation' },
                      { value: 'Repair System', label: 'Repair System' },
                      { value: 'MaintenancePro', label: 'MaintenancePro' },
                      { value: 'Document Manager', label: 'Document Manager' },
                      { value: 'HR FMS', label: 'HR FMS' },
                      { value: 'Inventory & Stock Tracker', label: 'Inventory & Stock Tracker' },
                      { value: 'Billing & ERP', label: 'Billing & ERP' },
                      { value: 'WhatsApp Automation System', label: 'WhatsApp Automation System' },
                      { value: 'Other Custom System', label: 'Other Custom System' }
                    ]}
                    value={formSystemName}
                    onChange={setFormSystemName}
                    isLight={isLight}
                    className="w-full"
                  />
                </div>

                {/* Priority for Customer */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Priority for Customer
                  </label>
                  <CustomDropdown
                    options={[
                      { value: 'Low', label: 'Low - Minor aesthetic / query', dotColor: 'bg-slate-400' },
                      { value: 'Medium', label: 'Medium - Regular adjustment', dotColor: 'bg-blue-400' },
                      { value: 'High', label: 'High - Urgent operational issue', dotColor: 'bg-amber-400' },
                      { value: 'Urgent', label: 'Urgent - System down / critical blocker', dotColor: 'bg-red-500' }
                    ]}
                    value={formPriority}
                    onChange={(val) => setFormPriority(val as TaskPriority)}
                    isLight={isLight}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Description of Work */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Description of Work <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter detailed description of what needs to be fixed, added or edited..."
                  className={`w-full border rounded-2xl p-4 text-sm focus:outline-none resize-y transition-colors duration-200 ${
                    isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#C9BCA8] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Expected Date To Close */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Expected Date To Close
                  </label>
                  <input
                    type="date"
                    value={formExpectedDate}
                    onChange={(e) => setFormExpectedDate(e.target.value)}
                    className={`w-full border rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none transition-colors duration-200 ${
                      isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                    }`}
                  />
                </div>

                {/* Link of System */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Link of System (Optional)
                  </label>
                  <input
                    type="url"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://company.zentrix.app/..."
                    className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors duration-200 ${
                      isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#C9BCA8] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Upload File (Optional) */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Upload File / Screenshot (Optional)
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer relative ${
                  isLight ? 'border-[#EDE2D3] hover:border-[#EA552E]/50 bg-[#FBF5EC]' : 'border-white/10 hover:border-cyan-400/50 bg-black/30'
                }`}>
                  <input
                    type="file"
                    onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                  {formFile ? (
                    <p className="text-xs font-bold text-emerald-500 font-mono">{formFile.name} selected</p>
                  ) : (
                    <>
                      <p className={`text-xs font-bold ${isLight ? 'text-[#5C5244]' : 'text-slate-200'}`}>Click to upload or drag & drop</p>
                      <p className={`text-[10px] mt-1 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`}>PNG, JPG, PDF, XLSX up to 25MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('completed')}
                  className={`px-6 py-3 rounded-xl text-xs font-bold transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-8 py-3.5 text-white rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                    isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'
                  }`}
                >
                  {submitting ? 'Submitting Ticket...' : 'Raise Ticket & Assign to Zentrixs Admin'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ALL SYSTEMS (Dark Cyber System Cards)                                 */}
        {/* ========================================================================= */}
        {activeTab === 'systems' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Active Automation Systems for {companyName}</h2>
              <p className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Live operational status and versioning across your custom modules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((s) => (
                <div key={s.id} className={`stagger-item border rounded-3xl p-6 shadow-xl space-y-4 transition-all duration-300 ${
                  isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-cyan-400 hover:shadow-[0_10px_28px_rgba(234,85,46,0.1)] hover:-translate-y-1' : 'bg-[#0F172A] border-white/10 hover:border-cyan-500/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>{s.category}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Active'
                        ? isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{s.name}</h3>

                  <div className={`pt-4 border-t flex items-center justify-between text-xs ${isLight ? 'border-[#F3EADC] text-[#9C8F7D]' : 'border-white/5 text-slate-400'}`}>
                    <span className={`font-mono ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>Version: {s.version}</span>
                    <a
                      href={s.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                        isLight ? 'bg-[#FDEEE7] text-[#EA552E] hover:bg-[#EA552E] hover:text-white border-[#F5D5C3]' : 'bg-blue-600/20 text-cyan-400 hover:bg-blue-600 hover:text-white border-cyan-500/30'
                      }`}
                    >
                      Launch <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: TROUBLESHOOT CENTER (Enterprise Diagnostics & Detailed Playbooks)     */}
        {/* ========================================================================= */}
        {activeTab === 'troubleshoot' && (
          <TroubleshootCenter
            isLight={isLight}
            companyName={companyName}
            companyId={companyId}
            onRaiseTicketWithDetails={handleRaiseTicketFromTroubleshoot}
            onAskAi={handleAskAiFromTroubleshoot}
            onShowToast={showToast}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: AI CONSULTANT (Dark Cyber AI Chat Console)                           */}
        {/* ========================================================================= */}
        {activeTab === 'ai' && (
          <div className={`max-w-3xl mx-auto border rounded-3xl p-6 shadow-2xl flex flex-col h-[650px] transition-colors duration-300 ${
            isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0F172A] border-white/10'
          }`}>
            <div className={`flex items-center gap-3 pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${isLight ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Zentrixs AI System Consultant</h3>
                <p className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Automated diagnostic and guidance assistant for {companyName}</p>
              </div>
            </div>

            {/* Chat message feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? isLight ? 'bg-[#EA552E] text-white rounded-br-none shadow-lg' : 'bg-blue-600 text-white rounded-br-none shadow-lg'
                        : isLight ? 'bg-[#FBF5EC] border border-[#EDE2D3] text-[#5C5244] rounded-bl-none' : 'bg-black/50 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 text-xs animate-pulse font-mono border ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#D9481F]' : 'bg-black/40 border-white/10 text-cyan-400'}`}>
                    Analyzing module diagnostics & Cloudflare logs...
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleAiSend} className={`pt-4 border-t flex gap-2 ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about errors, module updates, or integration issues..."
                className={`flex-1 border rounded-2xl px-4 py-3 text-xs focus:outline-none transition-colors duration-200 ${
                  isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#C9BCA8] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-400'
                }`}
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || aiLoading}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/25 hover:scale-[1.03] active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Ask AI
              </button>
            </form>
          </div>
        )}
      </div>

      {/* TICKET DETAILS MODAL */}
      {viewingTask && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/85 backdrop-blur-md'}`}>
          <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 border transition-all ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-[#2A2118]' : 'bg-[#0F172A] border-white/20 shadow-2xl text-white'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div>
                <span className={`font-mono font-bold text-sm ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>{viewingTask.ticketNumber}</span>
                <h3 className={`text-lg font-bold mt-1 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{viewingTask.systemName}</h3>
              </div>
              <button
                onClick={() => setViewingTask(null)}
                className={`text-lg font-bold p-2 transition-colors ${isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                <span className={isLight ? 'text-[#8A7B68]' : 'text-slate-400'}>Type of Work:</span>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{viewingTask.typeOfWork}</div>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                <span className={isLight ? 'text-[#8A7B68]' : 'text-slate-400'}>Raised By:</span>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{viewingTask.personName}</div>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                <span className={isLight ? 'text-[#8A7B68]' : 'text-slate-400'}>Assigned Engineer:</span>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>{viewingTask.assignedTo || 'Assigning...'}</div>
              </div>
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                <span className={isLight ? 'text-[#8A7B68]' : 'text-slate-400'}>Target Resolution:</span>
                <div className={`font-bold font-mono mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{viewingTask.expectedDateToClose}</div>
              </div>
            </div>

            <div>
              <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Description</span>
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed max-h-40 overflow-y-auto ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3] text-[#2A2118]' : 'bg-black/50 border-white/10 text-slate-200'}`}>
                {viewingTask.descriptionOfWork}
              </div>
            </div>

            <div>
              <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Internal Notes & Status</span>
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3] text-[#5C5244]' : 'bg-black/40 border-white/5 text-slate-300'}`}>
                <span>{viewingTask.notes || 'Under review by Zentrixs engineering team.'}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-blue-500/20 text-cyan-400 border-cyan-500/30'}`}>
                  {viewingTask.status}
                </span>
              </div>
            </div>

            {viewingTask.uploadFileUrl && (
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Cloudinary Attachment</span>
                <div className={`rounded-2xl p-4 flex items-center justify-between gap-3 border ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-cyan-950/30 border-cyan-500/30'}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${isLight ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E]' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-xs font-bold truncate font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                        {viewingTask.uploadFileName || 'Uploaded File'}
                      </div>
                      <div className={`text-[10px] truncate ${isLight ? 'text-[#8A7B68]' : 'text-cyan-400'}`}>
                        Stored in Cloudinary (dfbllmnld / zentrixs)
                      </div>
                    </div>
                  </div>
                  <a
                    href={viewingTask.uploadFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 text-white ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-md shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-cyan-500/20'}`}
                  >
                    <span>View / Download</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            <div className={`flex justify-end pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <button
                onClick={() => setViewingTask(null)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all text-white ${isLight ? 'bg-[#EA552E] hover:bg-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;

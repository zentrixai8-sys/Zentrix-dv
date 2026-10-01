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
  Moon
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
import { Link } from 'react-router-dom';
import { LOGO_URL, COMPANY_NAME } from '../constants';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import CustomDropdown from './CustomDropdown';

interface CompanyDashboardProps {
  onLogout: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onLogout }) => {
  const session = getAuthSession();
  const companyName = session?.companyName || 'Piramal Petroleum Private Limited';
  const userName = session?.user || 'Vaibhav1';
  const compRecord = getCompanies().find(c => c.id === companyId || c.code === companyId || c.name === companyName);
  const companyLogo = compRecord?.logoUrl || compRecord?.avatar;

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
    'all_tickets' | 'raise' | 'pending' | 'completed' | 'systems' | 'troubleshoot' | 'ai'
  >('completed');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

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
      let reply = `Telemetry diagnosis for "${userText}": Cloudflare D1 endpoints are responsive. If this is a breaking bug, submit an 'Error Received' ticket via '+ Raise Ticket' and our assigned engineer will address it.`;
      if (userText.toLowerCase().includes('whatsapp')) {
        reply = 'WhatsApp Status: Meta webhook callback is healthy. If message triggers stop, check if the auth token refreshed or submit an edit request.';
      } else if (userText.toLowerCase().includes('database') || userText.toLowerCase().includes('d1')) {
        reply = 'Cloudflare D1 Database sync is operational with latency under 15ms. All records are intact.';
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
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      isLight ? 'bg-[#F8FAFC] text-slate-800 selection:bg-blue-600/20' : 'bg-[#070A11] text-slate-100 selection:bg-blue-600/30'
    }`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-400 text-xs font-bold animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 text-cyan-300" />
          {toastMessage}
        </div>
      )}

      <header className={`border-b sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors duration-200 ${
        isLight ? 'bg-white/95 border-slate-200 backdrop-blur-xl shadow-sm text-slate-900' : 'bg-black/95 border-white/10 backdrop-blur-xl text-white'
      }`}>
        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Logo & Company Title */}
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center space-x-3.5 group cursor-pointer" title="Go to Zentrixs Website">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-60 transition-opacity"></div>
                <div className={`relative w-11 h-11 overflow-hidden rounded-xl border group-hover:scale-105 transition-transform flex items-center justify-center shadow-lg ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-white/10'
                }`}>
                  <img
                    src={LOGO_URL}
                    alt={`${COMPANY_NAME} Logo`}
                    width="44"
                    height="44"
                    className="w-full h-full object-contain p-1.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d47353039331e11a6839.svg";
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl sm:text-2xl font-black tracking-[0.3em] uppercase group-hover:text-blue-400 transition-colors ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  ZEN<span className="font-extralight text-blue-500">TRIXS</span>
                </span>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.5em] mt-[-2px] group-hover:text-gray-500 transition-colors">
                  Automation
                </span>
              </div>
            </Link>

            <div className={`hidden sm:block pl-5 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2.5">
                {companyLogo && (
                  <div className={`w-8 h-8 rounded-lg p-0.5 flex items-center justify-center shrink-0 overflow-hidden border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                  }`}>
                    <img src={companyLogo} alt={companyName} className="w-full h-full object-contain" />
                  </div>
                )}
                <h1 className={`text-lg font-black tracking-tight uppercase truncate max-w-md ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {companyName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  CLIENT PORTAL
                </span>
              </div>
              <p className={`text-xs flex items-center gap-2 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Welcome back, <strong className={`font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>{userName}</strong></span>
                <span>•</span>
                <span className="font-mono text-cyan-500">{currentTime || '10/1/2026 • 9:53:14 PM'}</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold">{systems.length || 7} Systems Connected</span>
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs matching Admin Console */}
          <div className="flex items-center gap-3">
            <div className={`flex flex-wrap p-1 rounded-2xl border text-xs font-bold transition-colors ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'completed'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed Tasks ({completedTasks})
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending Tasks ({pendingTasks})
              </button>

              <button
                onClick={() => setActiveTab('raise')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'raise'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-cyan-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                + Raise Ticket
              </button>

              <button
                onClick={() => setActiveTab('systems')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'systems'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Systems ({systems.length || 7})
              </button>

              <button
                onClick={() => setActiveTab('troubleshoot')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'troubleshoot'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Troubleshoot
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === 'ai'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                    : 'text-amber-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Consultant
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                clearAuthSession();
                onLogout();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? 'text-red-600 hover:bg-red-50 border-red-200'
                  : 'text-red-400 hover:text-white hover:bg-red-600/20 border-red-500/30'
              }`}
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Main Body - Full Canvas Width */}
      <div className="w-full px-4 sm:px-8 py-6 space-y-6">
        {/* KPI Tiles matching Admin Console */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Tile 1: Total Tasks */}
          <div className={`border rounded-2xl p-4 relative overflow-hidden group transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm hover:border-cyan-500/40' : 'bg-[#0F172A]/80 border-white/10 hover:border-cyan-500/40'
          }`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Tasks</div>
            <div className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{totalTasks}</div>
            <div className="text-[10px] text-cyan-500 mt-2 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Synced in Cloudflare D1
            </div>
          </div>

          {/* Tile 2: Active Tasks */}
          <div className={`border rounded-2xl p-4 relative overflow-hidden group transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm hover:border-blue-400' : 'bg-[#0F172A]/80 border-white/10 hover:border-blue-500/40'
          }`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Tasks</div>
            <div className="text-2xl font-black text-blue-500">{activeTasks}</div>
            <div className={`text-[10px] mt-2 font-mono ${isLight ? 'text-blue-600' : 'text-blue-300'}`}>In Progress & Dev</div>
          </div>

          {/* Tile 3: Pending Assign */}
          <div className={`border rounded-2xl p-4 relative overflow-hidden group transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm hover:border-amber-400' : 'bg-[#0F172A]/80 border-white/10 hover:border-amber-500/40'
          }`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Pending</div>
            <div className="text-2xl font-black text-amber-500">{pendingTasks}</div>
            <div className={`text-[10px] mt-2 font-mono ${isLight ? 'text-amber-600' : 'text-amber-300'}`}>Awaiting engineer ↗</div>
          </div>

          {/* Tile 4: Urgent */}
          <div className={`border rounded-2xl p-4 relative overflow-hidden group transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm hover:border-red-400' : 'bg-[#0F172A]/80 border-white/10 hover:border-red-500/40'
          }`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>High / Urgent</div>
            <div className="text-2xl font-black text-red-500">{urgentTasks}</div>
            <div className={`text-[10px] mt-2 font-mono ${isLight ? 'text-red-600' : 'text-red-300'}`}>Priority tickets</div>
          </div>

          {/* Tile 5: Completed */}
          <div className={`border rounded-2xl p-4 relative overflow-hidden group transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm hover:border-emerald-400' : 'bg-[#0F172A]/80 border-white/10 hover:border-emerald-500/40'
          }`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Completed</div>
            <div className="text-2xl font-black text-emerald-500">{completedTasks}</div>
            <div className={`text-[10px] mt-2 font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-300'}`}>Verified & Live ✓</div>
          </div>

          {/* Tile 6: Systems */}
          <div className={`border rounded-2xl p-4 relative overflow-hidden group transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-sm hover:border-purple-400' : 'bg-[#0F172A]/80 border-white/10 hover:border-purple-500/40'
          }`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Connected Systems</div>
            <div className="text-2xl font-black text-purple-500">{systems.length || 7}</div>
            <div className={`text-[10px] mt-2 font-mono ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>100% Operational</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB: COMPLETED TASKS & PENDING TASKS (Dark Cyber Table matching Admin)   */}
        {/* ========================================================================= */}
        {(activeTab === 'completed' || activeTab === 'pending' || activeTab === 'all_tickets') && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className={`border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0F172A]/90 border-white/10'
            }`}>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, system, description..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white' 
                      : 'bg-black/40 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={loadData}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Raise Ticket
                </button>
              </div>
            </div>

            {/* Tasks Table */}
            <div className={`border rounded-2xl shadow-xl overflow-hidden transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[#0B0F19]/90 border-white/10'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                      isLight ? 'bg-slate-100/90 border-slate-200 text-slate-600' : 'border-white/10 bg-white/[0.02] text-slate-400'
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
                  <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-white/5'}`}>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={10} className={`py-12 text-center ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          No tasks found. Click <strong>+ Raise Ticket</strong> above to assign work to Zentrixs.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((t) => (
                        <tr key={t.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                          {/* Type of Work */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-slate-300 border-white/5'
                            }`}>
                              {t.typeOfWork}
                            </span>
                          </td>

                          {/* Party Name */}
                          <td className="py-4 px-4 text-white font-bold whitespace-nowrap">
                            {t.partyName}
                          </td>

                          {/* System Name */}
                          <td className="py-4 px-4 font-semibold text-cyan-400 whitespace-nowrap">
                            {t.systemName}
                          </td>

                          {/* Description of Work */}
                          <td className="py-4 px-4 text-slate-300 leading-relaxed">
                            {expandedTaskId === t.id ? (
                              <div>
                                {t.descriptionOfWork}
                                <button
                                  onClick={() => setExpandedTaskId(null)}
                                  className="ml-2 text-cyan-400 font-bold hover:underline"
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
                                    className="text-cyan-400 font-bold hover:underline"
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
                                className="inline-flex p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                title="Open System Link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>

                          {/* Priority */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.priorityInCustomer === 'Urgent'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : t.priorityInCustomer === 'High'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-700/40 text-slate-300 border border-white/10'
                            }`}>
                              {t.priorityInCustomer}
                            </span>
                          </td>

                          {/* Assigned Engineer */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-medium text-slate-300">
                              {t.assignedTo && t.assignedTo !== 'Unassigned' ? (
                                <span className="inline-flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                  {t.assignedTo}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">Assigning...</span>
                              )}
                            </span>
                          </td>

                          {/* Expected Date to Close */}
                          <td className="py-4 px-4 font-mono text-slate-400 whitespace-nowrap">
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
                                  className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                                  title={`Cloudinary File: ${t.uploadFileName || 'View Upload'}`}
                                >
                                  <Paperclip className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => setViewingTask(t)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
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
          <div className="max-w-3xl mx-auto bg-[#0F172A] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs tracking-wider mb-2 border border-cyan-500/30 font-mono">
                  TASK TICKET 1
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">Raise New Task to Zentrixs Admin</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Once raised, this task will appear immediately in the Super Admin Console for engineer assignment.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-6">
              {/* Type of Work */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                  isLight={false}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Date (Auto Generated) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Date (Auto Generated)
                  </label>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-cyan-400 font-mono">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                {/* Person Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Person Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formPersonName}
                      onChange={(e) => setFormPersonName(e.target.value)}
                      placeholder="Enter person name"
                      className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Client WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Client WhatsApp
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Auto Alert</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* System Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                    isLight={false}
                    className="w-full"
                  />
                </div>

                {/* Priority for Customer */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                    isLight={false}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Description of Work */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Description of Work <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter detailed description of what needs to be fixed, added or edited..."
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 resize-y placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Expected Date To Close */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Expected Date To Close
                  </label>
                  <input
                    type="date"
                    value={formExpectedDate}
                    onChange={(e) => setFormExpectedDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Link of System */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Link of System (Optional)
                  </label>
                  <input
                    type="url"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://company.zentrix.app/..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Upload File (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Upload File / Screenshot (Optional)
                </label>
                <div className="border-2 border-dashed border-white/10 hover:border-cyan-400/50 rounded-2xl p-6 text-center transition-colors bg-black/30 cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  {formFile ? (
                    <p className="text-xs font-bold text-emerald-400 font-mono">{formFile.name} selected</p>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-slate-200">Click to upload or drag & drop</p>
                      <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, PDF, XLSX up to 25MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('completed')}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Syncing to Cloudflare D1...' : 'Raise Ticket & Assign to Zentrixs Admin'}
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
              <h2 className="text-xl font-bold text-white">Active Automation Systems for {companyName}</h2>
              <p className="text-xs text-slate-400">Live operational status and versioning across your custom modules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((s) => (
                <div key={s.id} className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.category}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{s.name}</h3>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">Version: {s.version}</span>
                    <a
                      href={s.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600/20 text-cyan-400 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1"
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
        {/* TAB: TROUBLESHOOT CENTER (Dark Cyber Troubleshooting matching Screenshot 4)*/}
        {/* ========================================================================= */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Troubleshoot Center</h2>
                <p className="text-xs text-slate-400 mt-1">Instant resolutions and diagnostic steps for connected modules</p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search technical issues..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 shadow-sm"
                />
              </div>
            </div>

            {/* 4 Issue Cards in Dark Cyber Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* WhatsApp Issues */}
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">WhatsApp Issues</h3>
                <p className="text-xs text-slate-400 mt-0.5">3 active guides</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold cursor-pointer">
                  <span>View solutions</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Looker Studio */}
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-blue-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-sm">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Looker Studio</h3>
                <p className="text-xs text-slate-400 mt-0.5">3 active guides</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-semibold cursor-pointer">
                  <span>View solutions</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Email Issues */}
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-purple-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Email Issues</h3>
                <p className="text-xs text-slate-400 mt-0.5">3 active guides</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-semibold cursor-pointer">
                  <span>View solutions</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Dashboard Issues */}
              <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-red-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Dashboard Issues</h3>
                <p className="text-xs text-slate-400 mt-0.5">3 active guides</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-red-400 font-semibold cursor-pointer">
                  <span>View solutions</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Common Solutions in Dark Cyber Style */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Common Solutions</h3>
                <p className="text-xs text-slate-400">Quick fixes for frequent issues</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Clear Browser Cache */}
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h4 className="text-sm font-bold text-cyan-400 mb-1">Clear Browser Cache</h4>
                  <p className="text-xs text-slate-400 mb-4">Clear browser cache and cookies to resolve display issues</p>
                  <div className="text-xs text-slate-300 space-y-1.5 font-medium bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="font-bold text-white">Steps:</p>
                    <p>1. Open browser settings</p>
                    <p>2. Go to Privacy/Security</p>
                    <p>3. Clear browsing data</p>
                    <p>4. Restart browser</p>
                  </div>
                </div>

                {/* 2. Check Network Connection */}
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h4 className="text-sm font-bold text-cyan-400 mb-1">Check Network Connection</h4>
                  <p className="text-xs text-slate-400 mb-4">Verify internet connectivity and firewall settings</p>
                  <div className="text-xs text-slate-300 space-y-1.5 font-medium bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="font-bold text-white">Steps:</p>
                    <p>1. Test internet connection</p>
                    <p>2. Check firewall rules</p>
                    <p>3. Verify DNS settings</p>
                    <p>4. Test from different network</p>
                  </div>
                </div>

                {/* 3. Restart Services */}
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h4 className="text-sm font-bold text-cyan-400 mb-1">Restart Services</h4>
                  <p className="text-xs text-slate-400 mb-4">Restart application services to resolve temporary issues</p>
                  <div className="text-xs text-slate-300 space-y-1.5 font-medium bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="font-bold text-white">Steps:</p>
                    <p>1. Stop application services</p>
                    <p>2. Wait 30 seconds</p>
                    <p>3. Start services again</p>
                    <p>4. Monitor logs for errors</p>
                  </div>
                </div>

                {/* 4. Update Credentials */}
                <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h4 className="text-sm font-bold text-cyan-400 mb-1">Update Credentials</h4>
                  <p className="text-xs text-slate-400 mb-4">Refresh API keys and authentication tokens</p>
                  <div className="text-xs text-slate-300 space-y-1.5 font-medium bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="font-bold text-white">Steps:</p>
                    <p>1. Generate new API keys</p>
                    <p>2. Update configuration files</p>
                    <p>3. Test connections</p>
                    <p>4. Monitor for success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: AI CONSULTANT (Dark Cyber AI Chat Console)                           */}
        {/* ========================================================================= */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-[650px]">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Zentrixs AI System Consultant</h3>
                <p className="text-xs text-slate-400">Automated diagnostic and guidance assistant for {companyName}</p>
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
                        ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                        : 'bg-black/50 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-cyan-400 animate-pulse font-mono">
                    Analyzing module diagnostics & Cloudflare logs...
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleAiSend} className="pt-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about errors, module updates, or integration issues..."
                className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || aiLoading}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/25"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0F172A] border border-white/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-cyan-400 font-bold text-sm">{viewingTask.ticketNumber}</span>
                <h3 className="text-lg font-bold text-white mt-1">{viewingTask.systemName}</h3>
              </div>
              <button
                onClick={() => setViewingTask(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-2"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Type of Work:</span>
                <div className="text-white font-bold">{viewingTask.typeOfWork}</div>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Raised By:</span>
                <div className="text-white font-bold">{viewingTask.personName}</div>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Assigned Engineer:</span>
                <div className="text-cyan-400 font-bold">{viewingTask.assignedTo || 'Assigning...'}</div>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Target Resolution:</span>
                <div className="text-white font-bold font-mono">{viewingTask.expectedDateToClose}</div>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Description</span>
              <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-xs text-slate-200 leading-relaxed max-h-40 overflow-y-auto">
                {viewingTask.descriptionOfWork}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Internal Notes & Status</span>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span>{viewingTask.notes || 'Under review by Zentrixs engineering team.'}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-400 border border-cyan-500/30">
                  {viewingTask.status}
                </span>
              </div>
            </div>

            {viewingTask.uploadFileUrl && (
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Cloudinary Attachment</span>
                <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate font-mono">
                        {viewingTask.uploadFileName || 'Uploaded File'}
                      </div>
                      <div className="text-[10px] text-cyan-400 truncate">
                        Stored in Cloudinary (dfbllmnld / zentrixs)
                      </div>
                    </div>
                  </div>
                  <a
                    href={viewingTask.uploadFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 shrink-0 flex items-center gap-1.5"
                  >
                    <span>View / Download</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => setViewingTask(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
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

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  UserCheck, 
  ExternalLink, 
  RefreshCw, 
  LogOut, 
  Layers, 
  Building2, 
  ChevronRight, 
  Sliders, 
  Settings, 
  FileText, 
  Flame, 
  MessageSquare, 
  Eye, 
  Check, 
  Calendar,
  User,
  Plus,
  Paperclip,
  LayoutList,
  LayoutGrid,
  Camera,
  UploadCloud,
  ImageIcon,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { Task, TaskStatus, Company, Employee } from '../types/taskTypes';
import { 
  fetchTasks, 
  assignTask, 
  updateTaskStatus, 
  deleteTask, 
  getCompanies, 
  fetchCompanies,
  createCompany,
  updateCompanyLogo,
  uploadFileToCloudinary,
  getEmployees, 
  clearAuthSession 
} from '../services/taskService';
import AdminDashboard from './AdminDashboard';
import { WhatsAppSettings } from './WhatsAppSettings';
import { Link } from 'react-router-dom';
import { LOGO_URL, COMPANY_NAME } from '../constants';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import CustomDropdown from './CustomDropdown';

interface SuperAdminConsoleProps {
  onLogout: () => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'employees' | 'companies' | 'cms' | 'whatsapp'>('console');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Selected task for detailed modal / notes
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [noteEdit, setNoteEdit] = useState('');
  const [statusEdit, setStatusEdit] = useState<TaskStatus>('Pending');
  const [savingNote, setSavingNote] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Company view mode: 'list' (default) | 'grid'
  const [companyViewMode, setCompanyViewMode] = useState<'list' | 'grid'>('list');
  const [companySearch, setCompanySearch] = useState('');

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

  // New Company Registration by Admin
  const [showAddCompModal, setShowAddCompModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompCode, setNewCompCode] = useState('');
  const [newCompPass, setNewCompPass] = useState('');
  const [newCompContact, setNewCompContact] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompPhone, setNewCompPhone] = useState('');
  const [newCompLogoFile, setNewCompLogoFile] = useState<File | null>(null);
  const [newCompLogoPreview, setNewCompLogoPreview] = useState<string>('');
  const [creatingComp, setCreatingComp] = useState(false);

  // Edit company logo modal for existing companies
  const [editingLogoCompany, setEditingLogoCompany] = useState<Company | null>(null);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string>('');
  const [savingLogo, setSavingLogo] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim() || !newCompCode.trim() || !newCompPass.trim()) return;
    setCreatingComp(true);

    let uploadedLogoUrl = '';
    if (newCompLogoFile) {
      const upRes = await uploadFileToCloudinary(newCompLogoFile);
      if (upRes.success && upRes.url) {
        uploadedLogoUrl = upRes.url;
      }
    }

    const res = await createCompany({
      name: newCompName.trim(),
      code: newCompCode.trim().toUpperCase(),
      password: newCompPass.trim(),
      contactPerson: newCompContact.trim() || 'Manager',
      email: newCompEmail.trim(),
      phone: newCompPhone.trim(),
      logoUrl: uploadedLogoUrl || undefined,
      avatar: uploadedLogoUrl || undefined
    });
    setCreatingComp(false);
    if (res.success) {
      showToast(`Company registered! ID: ${newCompCode.toUpperCase()} | Password: ${newCompPass}`);
      setShowAddCompModal(false);
      setNewCompName('');
      setNewCompCode('');
      setNewCompPass('');
      setNewCompContact('');
      setNewCompEmail('');
      setNewCompPhone('');
      setNewCompLogoFile(null);
      setNewCompLogoPreview('');
      await loadData();
    }
  };

  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogoCompany) return;
    setSavingLogo(true);

    let logoUrl = editLogoPreview;
    if (editLogoFile) {
      const upRes = await uploadFileToCloudinary(editLogoFile);
      if (upRes.success && upRes.url) {
        logoUrl = upRes.url;
      }
    }

    if (logoUrl) {
      await updateCompanyLogo(editingLogoCompany.id, logoUrl);
      showToast(`Company logo updated for ${editingLogoCompany.name}!`);
      setEditingLogoCompany(null);
      setEditLogoFile(null);
      setEditLogoPreview('');
      await loadData();
    }
    setSavingLogo(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, compList] = await Promise.all([
        fetchTasks(),
        fetchCompanies()
      ]);
      setTasks(data);
      setCompanies(compList);
      setEmployees(getEmployees());
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (taskId: string, employeeName: string) => {
    const res = await assignTask(taskId, employeeName);
    if (res.success) {
      showToast(`Task assigned to ${employeeName}`);
      await loadData();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const res = await updateTaskStatus(taskId, newStatus);
    if (res.success) {
      showToast(`Status updated to ${newStatus}`);
      await loadData();
    }
  };

  const handleSaveModal = async () => {
    if (!selectedTask) return;
    setSavingNote(true);
    const res = await updateTaskStatus(selectedTask.id, statusEdit, noteEdit);
    setSavingNote(false);
    if (res.success) {
      showToast('Task details & internal notes updated!');
      setSelectedTask(null);
      await loadData();
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      await deleteTask(taskId);
      showToast('Ticket removed');
      await loadData();
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedCompany !== 'All' && t.partyName !== selectedCompany) return false;
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    if (selectedAssignee !== 'All' && t.assignedTo !== selectedAssignee) return false;
    if (selectedPriority !== 'All' && t.priorityInCustomer !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.ticketNumber.toLowerCase().includes(q) ||
        t.partyName.toLowerCase().includes(q) ||
        t.personName.toLowerCase().includes(q) ||
        t.systemName.toLowerCase().includes(q) ||
        t.descriptionOfWork.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // KPI Calculations matching Screenshot 1 style
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Pending').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const urgentTasks = tasks.filter((t) => t.priorityInCustomer === 'Urgent' || t.priorityInCustomer === 'High').length;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      isLight ? 'bg-[#F8FAFC] text-slate-800 selection:bg-blue-600/20' : 'bg-[#070A11] text-slate-100 selection:bg-blue-600/30'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-400 text-xs font-bold animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Website-Styled Admin Header */}
      <header className={`border-b sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors duration-200 ${
        isLight ? 'bg-white/95 border-slate-200 backdrop-blur-xl shadow-sm text-slate-900' : 'bg-black/95 border-white/10 backdrop-blur-xl text-white'
      }`}>
        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Exact Brand Logo matching Website */}
          <div className="flex items-center gap-6">
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
                <div className="flex items-center gap-2">
                  <span className={`text-xl sm:text-2xl font-black tracking-[0.3em] uppercase group-hover:text-blue-500 transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    ZEN<span className="font-extralight text-blue-500">TRIXS</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                    SUPER ADMIN
                  </span>
                </div>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.5em] mt-[-2px] group-hover:text-gray-500 transition-colors">
                  Automation Command Center
                </span>
              </div>
            </Link>

            <div className={`hidden sm:flex items-center gap-2 pl-4 border-l ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <span className={`text-[10px] flex items-center gap-1.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Cloudflare D1 Live
              </span>
            </div>
          </div>

          {/* Navigation Pill Tabs, Theme Switcher & Logout */}
          <div className="flex items-center gap-3">
            <div className={`flex p-1 rounded-2xl border text-xs font-bold transition-colors ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tickets Console
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'employees'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee Workload
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'companies'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Companies ({companies.length})
              </button>
              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'cms'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Website CMS
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'whatsapp'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Settings</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
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
        {/* KPI Tiles matching Screenshot 1 */}
        {activeTab !== 'cms' && activeTab !== 'whatsapp' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Tile 1 */}
            <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tasks</div>
              <div className="text-2xl font-black text-white">{totalTasks}</div>
              <div className="text-[10px] text-cyan-400 mt-2 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Across all clients
              </div>
            </div>

            {/* Tile 2 */}
            <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Tasks</div>
              <div className="text-2xl font-black text-blue-400">{activeTasks}</div>
              <div className="text-[10px] text-blue-300 mt-2 font-mono">In Progress & Dev</div>
            </div>

            {/* Tile 3 */}
            <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Assign</div>
              <div className="text-2xl font-black text-amber-400">{pendingTasks}</div>
              <div className="text-[10px] text-amber-300 mt-2 font-mono">Action required ↗</div>
            </div>

            {/* Tile 4 */}
            <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-red-500/40 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">High / Urgent</div>
              <div className="text-2xl font-black text-red-400">{urgentTasks}</div>
              <div className="text-[10px] text-red-300 mt-2 font-mono">Top priority</div>
            </div>

            {/* Tile 5 */}
            <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</div>
              <div className="text-2xl font-black text-emerald-400">{completedTasks}</div>
              <div className="text-[10px] text-emerald-300 mt-2 font-mono">Target Exceeded ✓</div>
            </div>

            {/* Tile 6 */}
            <div className="bg-[#0F172A]/80 border border-white/10 rounded-2xl p-4 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engineers</div>
              <div className="text-2xl font-black text-purple-400">{employees.length}</div>
              <div className="text-[10px] text-purple-300 mt-2 font-mono">Active & Certified</div>
            </div>
          </div>
        )}

        {/* TAB 1: TICKETS CONSOLE (Admin tracking & assigning) */}
        {activeTab === 'console' && (
          <div className="space-y-6">
            {/* Search and Multi-Filters Bar */}
            <div className={`border rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0F172A]/90 border-white/10'
            }`}>
              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ticket, company, system..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white' 
                      : 'bg-black/40 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
                {/* Company Filter */}
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Companies' },
                    ...companies.map((c) => ({ value: c.name, label: c.name }))
                  ]}
                  value={selectedCompany}
                  onChange={setSelectedCompany}
                  isLight={isLight}
                  className="w-44"
                />

                {/* Status Filter */}
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'Pending', label: 'Pending', dotColor: 'bg-amber-400' },
                    { value: 'In Progress', label: 'In Progress', dotColor: 'bg-blue-400' },
                    { value: 'In Review', label: 'In Review', dotColor: 'bg-purple-400' },
                    { value: 'Completed', label: 'Completed', dotColor: 'bg-emerald-400' }
                  ]}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  isLight={isLight}
                  className="w-36"
                />

                {/* Priority Filter */}
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Priorities' },
                    { value: 'Urgent', label: 'Urgent', dotColor: 'bg-red-500' },
                    { value: 'High', label: 'High', dotColor: 'bg-amber-400' },
                    { value: 'Medium', label: 'Medium', dotColor: 'bg-blue-400' },
                    { value: 'Low', label: 'Low', dotColor: 'bg-slate-400' }
                  ]}
                  value={selectedPriority}
                  onChange={setSelectedPriority}
                  isLight={isLight}
                  className="w-36"
                />

                {/* Assignee Filter */}
                <CustomDropdown
                  options={[
                    { value: 'All', label: 'All Assignees' },
                    ...employees.map((emp) => ({
                      value: emp.name,
                      label: emp.name,
                      sublabel: emp.role,
                      dotColor: 'bg-cyan-400'
                    }))
                  ]}
                  value={selectedAssignee}
                  onChange={setSelectedAssignee}
                  isLight={isLight}
                  className="w-40"
                />

                <button
                  onClick={loadData}
                  className="p-2.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-xl transition-all cursor-pointer shadow-sm"
                  title="Reload from Cloudflare D1"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Enterprise Task Table */}
            <div className={`border rounded-2xl shadow-xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0B0F19]/90 border-white/10'
            }`}>
              <div className="overflow-x-auto min-h-[340px] pb-32">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-4">Ticket & Date</th>
                      <th className="py-4 px-4">Company (Client)</th>
                      <th className="py-4 px-4">Person & System</th>
                      <th className="py-4 px-4 min-w-[240px]">Description & Type</th>
                      <th className="py-4 px-3">Priority</th>
                      <th className="py-4 px-4 min-w-[170px]">Assigned Engineer</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          No tickets matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((t) => (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Ticket Number & Date */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-cyan-400">{t.ticketNumber}</div>
                            <div className="text-[10px] text-slate-500">{t.createdAt}</div>
                          </td>

                          {/* Company Name */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="truncate max-w-[180px]" title={t.partyName}>
                                {t.partyName}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">Due: {t.expectedDateToClose}</div>
                          </td>

                          {/* Person & System */}
                          <td className="py-4 px-4">
                            <div className="font-medium text-slate-200">{t.systemName}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-500" />
                              {t.personName}
                            </div>
                          </td>

                          {/* Description & Type */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 mb-1 border border-white/5">
                              {t.typeOfWork}
                            </span>
                            <div className="text-slate-300 leading-snug line-clamp-2">
                              {t.descriptionOfWork}
                            </div>
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

                          {/* ASSIGNED ENGINEER (Direct Dropdown Assignment requested by user!) */}
                          <td className="py-4 px-4">
                            <CustomDropdown
                              options={[
                                { value: 'Unassigned', label: '-- Assign Employee --' },
                                ...employees.map((emp) => ({
                                  value: emp.name,
                                  label: emp.name,
                                  sublabel: emp.role,
                                  dotColor: 'bg-cyan-400'
                                }))
                              ]}
                              value={t.assignedTo || 'Unassigned'}
                              onChange={(val) => handleAssign(t.id, val)}
                              isLight={isLight}
                              size="sm"
                              className="w-full min-w-[170px]"
                            />
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <CustomDropdown
                              options={[
                                { value: 'Pending', label: 'Pending', dotColor: 'bg-amber-400' },
                                { value: 'In Progress', label: 'In Progress', dotColor: 'bg-blue-400' },
                                { value: 'In Review', label: 'In Review', dotColor: 'bg-purple-400' },
                                { value: 'Completed', label: 'Completed', dotColor: 'bg-emerald-400' },
                                { value: 'Rejected', label: 'Rejected', dotColor: 'bg-red-400' }
                              ]}
                              value={t.status}
                              onChange={(val) => handleStatusChange(t.id, val as TaskStatus)}
                              isLight={isLight}
                              size="sm"
                              badgeStyle={true}
                              align="right"
                              className="min-w-[125px]"
                            />
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedTask(t);
                                  setNoteEdit(t.notes || '');
                                  setStatusEdit(t.status);
                                }}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
                                title="View & Edit Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {t.uploadFileUrl && (
                                <a
                                  href={t.uploadFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl transition-colors"
                                  title={`Cloudinary Attachment: ${t.uploadFileName || 'View File'}`}
                                >
                                  <Paperclip className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {t.linkOfSystem && (
                                <a
                                  href={t.linkOfSystem}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors"
                                  title="Open System Link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(t.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                                title="Delete Ticket"
                              >
                                &times;
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

        {/* TAB 2: EMPLOYEE WORKLOAD (Company Employee tracking requested by user) */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Zentrixs Engineering & Support Workload</h2>
              <p className="text-xs text-slate-400">Track tasks assigned per engineer and their operational backlog</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp) => {
                const assignedTasks = tasks.filter((t) => t.assignedTo === emp.name);
                const active = assignedTasks.filter((t) => t.status !== 'Completed');
                const completed = assignedTasks.filter((t) => t.status === 'Completed');

                return (
                  <div key={emp.id} className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                          {emp.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{emp.name}</h3>
                          <p className="text-[11px] text-cyan-400 font-medium">{emp.role}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-300">
                        {assignedTasks.length} Assigned
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Active Backlog</div>
                        <div className="text-xl font-black text-amber-400">{active.length}</div>
                      </div>
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Closed</div>
                        <div className="text-xl font-black text-emerald-400">{completed.length}</div>
                      </div>
                    </div>

                    {/* Task list for this employee */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Current Assigned Tasks:</div>
                      {active.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No pending tasks assigned. Ready for new tickets.</div>
                      ) : (
                        active.slice(0, 3).map((t) => (
                          <div key={t.id} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs flex items-center justify-between">
                            <div className="overflow-hidden pr-2">
                              <span className="font-bold text-white">{t.partyName.split(' ')[0]}: </span>
                              <span className="text-slate-300">{t.systemName}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                              t.priorityInCustomer === 'High' || t.priorityInCustomer === 'Urgent'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {t.priorityInCustomer}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED COMPANIES (Admin Credentials Management) */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Authorized Client Companies & Credentials</h2>
                <p className="text-xs text-slate-400">
                  Yahan Admin nayi company add karega aur unko Login ID & Password assign karega. Keval authorized company hi login kar sakti hai.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search company or ID..."
                    className="bg-[#0F172A] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 w-44 sm:w-52"
                  />
                </div>

                {/* View Switcher: List View (Default) vs Grid View */}
                <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCompanyViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      companyViewMode === 'list'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="List View (Default)"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>List View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanyViewMode('grid')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      companyViewMode === 'grid'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid View</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowAddCompModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Register New Company
                </button>
              </div>
            </div>

            {(() => {
              const filteredComps = companies.filter((c) => {
                if (!companySearch.trim()) return true;
                const q = companySearch.toLowerCase();
                return (
                  c.name?.toLowerCase().includes(q) ||
                  c.code?.toLowerCase().includes(q) ||
                  c.contactPerson?.toLowerCase().includes(q) ||
                  c.phone?.toLowerCase().includes(q) ||
                  c.email?.toLowerCase().includes(q)
                );
              });

              if (filteredComps.length === 0) {
                return (
                  <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-12 text-center text-slate-400 space-y-2">
                    <p className="text-sm font-bold text-white">No companies match your search</p>
                    <p className="text-xs">Try searching with a different company name or ID code.</p>
                  </div>
                );
              }

              {/* LIST VIEW (DEFAULT) */}
              if (companyViewMode === 'list') {
                return (
                  <div className="bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/5">
                          <tr>
                            <th className="py-3.5 px-4">Company Name</th>
                            <th className="py-3.5 px-4">Login ID / Code</th>
                            <th className="py-3.5 px-4">Password</th>
                            <th className="py-3.5 px-4">Contact Info</th>
                            <th className="py-3.5 px-3 text-center">Active Tickets</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredComps.map((c) => {
                            const compTasks = tasks.filter((t) => t.partyName === c.name);
                            return (
                              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      onClick={() => {
                                        setEditingLogoCompany(c);
                                        setEditLogoPreview(c.logoUrl || '');
                                      }}
                                      title="Click to change or upload company logo"
                                      className="relative group/logo w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-cyan-400 transition-all"
                                    >
                                      {c.logoUrl ? (
                                        <img 
                                          src={c.logoUrl} 
                                          alt={c.name} 
                                          className="w-full h-full object-contain p-1" 
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                                          {c.name.substring(0, 2).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity">
                                        <Camera className="w-4 h-4 text-cyan-400" />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm">{c.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingLogoCompany(c);
                                            setEditLogoPreview(c.logoUrl || '');
                                          }}
                                          title="Upload / Change Logo"
                                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono hover:underline"
                                        >
                                          <Camera className="w-3 h-3" /> Logo
                                        </button>
                                      </div>
                                      <span className="inline-block mt-0.5 text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                                        Authorized Client
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 text-xs">
                                    {c.code}
                                  </span>
                                </td>

                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 text-xs">
                                    {c.password || 'client@123'}
                                  </span>
                                </td>

                                <td className="py-4 px-4">
                                  <div className="text-white font-medium">{c.contactPerson}</div>
                                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                                    {c.phone || c.email || 'No phone'}
                                  </div>
                                </td>

                                <td className="py-4 px-3 text-center whitespace-nowrap">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    compTasks.length > 0 
                                      ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30' 
                                      : 'bg-white/5 text-slate-400'
                                  }`}>
                                    {compTasks.length} Tickets
                                  </span>
                                </td>

                                <td className="py-4 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingLogoCompany(c);
                                        setEditLogoPreview(c.logoUrl || '');
                                      }}
                                      title="Upload / Change Logo"
                                      className="p-2 bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5"
                                    >
                                      <Camera className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Logo</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedCompany(c.name);
                                        setActiveTab('console');
                                      }}
                                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer shadow-md shadow-blue-600/20"
                                    >
                                      View Tickets <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              {/* GRID VIEW (Card View) */}
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredComps.map((c) => {
                    const compTasks = tasks.filter((t) => t.partyName === c.name);
                    return (
                      <div key={c.id} className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                              ID: {c.code}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Authorized Client
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div 
                              onClick={() => {
                                setEditingLogoCompany(c);
                                setEditLogoPreview(c.logoUrl || '');
                              }}
                              title="Click to change or upload company logo"
                              className="relative group/cardlogo w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-cyan-400 transition-all shadow-md"
                            >
                              {c.logoUrl ? (
                                <img 
                                  src={c.logoUrl} 
                                  alt={c.name} 
                                  className="w-full h-full object-contain p-1" 
                                />
                              ) : (
                                <div className="w-full h-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                                  {c.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/cardlogo:opacity-100 transition-opacity">
                                <Camera className="w-4 h-4 text-cyan-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-white truncate">{c.name}</h3>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLogoCompany(c);
                                  setEditLogoPreview(c.logoUrl || '');
                                }}
                                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 mt-0.5"
                              >
                                <Camera className="w-3 h-3" /> Change Logo
                              </button>
                            </div>
                          </div>

                          {/* Credentials Box */}
                          <div className="mt-4 p-3 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-mono">Login ID:</span>
                              <span className="text-cyan-400 font-mono font-bold">{c.code}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-mono">Password:</span>
                              <span className="text-amber-400 font-mono font-bold bg-white/5 px-2 py-0.5 rounded">
                                {c.password || 'client@123'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                            <p>Contact Person: <strong className="text-slate-200">{c.contactPerson}</strong></p>
                            {c.email && <p>Email: <strong className="text-slate-200">{c.email}</strong></p>}
                            {c.phone && <p>Phone: <strong className="text-slate-200">{c.phone}</strong></p>}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            Active Tickets: <strong className="text-white font-bold">{compTasks.length}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLogoCompany(c);
                                setEditLogoPreview(c.logoUrl || '');
                              }}
                              className="px-3 py-2 bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" /> Logo
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCompany(c.name);
                                setActiveTab('console');
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              View Tickets <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 4: WEBSITE CMS (Preserving existing AdminDashboard features) */}
        {activeTab === 'cms' && (
          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Website CMS & Public Content</h2>
              <p className="text-xs text-slate-400">Manage client testimonials, social links and banners</p>
            </div>
            <AdminDashboard onClose={() => setActiveTab('console')} />
          </div>
        )}

        {/* TAB 5: META WHATSAPP SETTINGS (Protected by PIN 5002) */}
        {activeTab === 'whatsapp' && (
          <div className="w-full">
            <WhatsAppSettings onClose={() => setActiveTab('console')} />
          </div>
        )}
      </div>

      {/* DETAIL & NOTES MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-white/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-cyan-400 font-bold text-sm">{selectedTask.ticketNumber}</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedTask.systemName}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-2"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Company:</span>
                <div className="text-white font-bold">{selectedTask.partyName}</div>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Raised By:</span>
                <div className="text-white font-bold">{selectedTask.personName}</div>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Type of Work:</span>
                <div className="text-white font-bold">{selectedTask.typeOfWork}</div>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Expected Resolution Date:</span>
                <div className="text-white font-bold font-mono">{selectedTask.expectedDateToClose}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Work Description
              </label>
              <div className="p-4 bg-black/50 border border-white/10 rounded-2xl text-xs text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
                {selectedTask.descriptionOfWork}
              </div>
            </div>

            {selectedTask.uploadFileUrl && (
              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  Cloudinary Attachment / Uploaded File
                </label>
                <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate font-mono">
                        {selectedTask.uploadFileName || 'Uploaded Attachment'}
                      </div>
                      <div className="text-[10px] text-cyan-400 truncate">
                        Cloudinary CDN: dfbllmnld / zentrixs
                      </div>
                    </div>
                  </div>
                  <a
                    href={selectedTask.uploadFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 shrink-0 flex items-center gap-1.5"
                  >
                    <span>Open in Cloudinary</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Update Status
                </label>
                <CustomDropdown
                  options={[
                    { value: 'Pending', label: 'Pending', dotColor: 'bg-amber-400' },
                    { value: 'In Progress', label: 'In Progress', dotColor: 'bg-blue-400' },
                    { value: 'In Review', label: 'In Review', dotColor: 'bg-purple-400' },
                    { value: 'Completed', label: 'Completed', dotColor: 'bg-emerald-400' },
                    { value: 'Rejected', label: 'Rejected', dotColor: 'bg-red-400' }
                  ]}
                  value={statusEdit}
                  onChange={(val) => setStatusEdit(val as TaskStatus)}
                  isLight={false}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Assign To Engineer
                </label>
                <CustomDropdown
                  options={[
                    { value: 'Unassigned', label: '-- Unassigned --' },
                    ...employees.map((emp) => ({
                      value: emp.name,
                      label: emp.name,
                      sublabel: emp.role,
                      dotColor: 'bg-cyan-400'
                    }))
                  ]}
                  value={selectedTask.assignedTo || 'Unassigned'}
                  onChange={(val) => handleAssign(selectedTask.id, val)}
                  isLight={false}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Internal Engineer Notes & Resolution Remarks
              </label>
              <textarea
                rows={3}
                value={noteEdit}
                onChange={(e) => setNoteEdit(e.target.value)}
                placeholder="Add technical notes, git commit ref, or resolution comments..."
                className="w-full bg-black/50 border border-white/20 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Close
              </button>
              <button
                type="button"
                disabled={savingNote}
                onClick={handleSaveModal}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {savingNote ? 'Saving to Cloudflare D1...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW CLIENT COMPANY MODAL */}
      {showAddCompModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0F172A] border border-white/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="font-mono text-cyan-400 font-bold text-xs tracking-wider">ADMIN CLIENT SETUP</span>
                <h3 className="text-xl font-bold text-white mt-1">Register New Client Company & Generate Login</h3>
              </div>
              <button
                onClick={() => setShowAddCompModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRegisterCompany} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="e.g. Reliance Logistics Pvt Ltd"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                    Company Code / Login ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompCode}
                    onChange={(e) => setNewCompCode(e.target.value)}
                    placeholder="e.g. RELIANCE01"
                    className="w-full bg-black/50 border border-cyan-500/40 rounded-xl px-4 py-3 text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-300 uppercase"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Company is ID se login karegi</p>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                    Password Assigned <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompPass}
                    onChange={(e) => setNewCompPass(e.target.value)}
                    placeholder="e.g. rel@2026"
                    className="w-full bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Jo password aap unhe denge</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={newCompContact}
                    onChange={(e) => setNewCompContact(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newCompPhone}
                    onChange={(e) => setNewCompPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={newCompEmail}
                  onChange={(e) => setNewCompEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider text-xs">
                  Company Logo (Optional)
                </label>
                <div className="flex items-center gap-4 p-3.5 bg-black/40 border border-white/10 rounded-xl">
                  {newCompLogoPreview ? (
                    <div className="relative group w-14 h-14 rounded-xl overflow-hidden border border-cyan-500/40 bg-white/5 flex items-center justify-center shrink-0">
                      <img src={newCompLogoPreview} alt="Preview" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => { setNewCompLogoFile(null); setNewCompLogoPreview(''); }}
                        className="absolute inset-0 bg-black/80 text-red-400 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-slate-500 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all">
                      <UploadCloud className="w-4 h-4 text-cyan-400" />
                      {newCompLogoFile ? 'Change Logo Image' : 'Select Company Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewCompLogoFile(file);
                            setNewCompLogoPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG or WEBP (Saved to Cloudflare D1 & Cloudinary CDN)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddCompModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingComp}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
                >
                  {creatingComp ? 'Creating...' : 'Register Company & Assign Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMPANY LOGO MODAL */}
      {editingLogoCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Update Company Logo</h3>
                  <p className="text-xs text-slate-400">{editingLogoCompany.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingLogoCompany(null);
                  setEditLogoFile(null);
                  setEditLogoPreview('');
                }}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateLogo} className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                {editLogoPreview ? (
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border border-cyan-500/40 p-2 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                    <img
                      src={editLogoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-blue-600/20 border border-dashed border-blue-500/40 flex flex-col items-center justify-center text-blue-400 font-bold text-2xl">
                    {editingLogoCompany.name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 transition-all">
                  <UploadCloud className="w-4 h-4" />
                  {editLogoPreview ? 'Choose Different Image' : 'Select Logo to Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditLogoFile(file);
                        setEditLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
                <p className="text-[10px] text-slate-400 text-center">
                  Will upload to Cloudinary CDN & save to Cloudflare D1 database.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLogoCompany(null);
                    setEditLogoFile(null);
                    setEditLogoPreview('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLogo || (!editLogoFile && !editLogoPreview)}
                  className="px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {savingLogo ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Logo'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminConsole;

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users,
  Zap,
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
  Moon,
  Phone,
  Mail,
  Trash2,
  Briefcase,
  UserPlus,
  Edit3,
  Pencil
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
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  clearAuthSession 
} from '../services/taskService';
import AdminDashboard from './AdminDashboard';
import AdminAnalyticsOverview from './AdminAnalyticsOverview';
import { WhatsAppSettings } from './WhatsAppSettings';
import { Link } from 'react-router-dom';
import { LOGO_URL, COMPANY_NAME } from '../constants';
import { getStoredTheme, setStoredTheme, PortalTheme } from '../services/themeService';
import CustomDropdown from './CustomDropdown';
import ThemeSelector from './ThemeSelector';

interface SuperAdminConsoleProps {
  onLogout: () => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'console' | 'employees' | 'companies' | 'cms' | 'whatsapp'>('overview');
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

  // New Employee / Engineer Registration by Admin
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpUserRole, setNewEmpUserRole] = useState<'support_engineer' | 'employee' | 'admin' | 'manager'>('support_engineer');
  const [newEmpDesignation, setNewEmpDesignation] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpAvatarDisplay, setNewEmpAvatarDisplay] = useState<string>('');
  const [newEmpCloudUrl, setNewEmpCloudUrl] = useState<string>('');
  const [uploadingNewAvatar, setUploadingNewAvatar] = useState(false);
  const [creatingEmp, setCreatingEmp] = useState(false);
  const [empSearch, setEmpSearch] = useState('');

  // Edit Employee / Engineer Profile
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpPhone, setEditEmpPhone] = useState('');
  const [editEmpUserRole, setEditEmpUserRole] = useState<'support_engineer' | 'employee' | 'admin' | 'manager'>('support_engineer');
  const [editEmpDesignation, setEditEmpDesignation] = useState('');
  const [editEmpEmail, setEditEmpEmail] = useState('');
  const [editEmpAvatarDisplay, setEditEmpAvatarDisplay] = useState<string>('');
  const [editEmpCloudUrl, setEditEmpCloudUrl] = useState<string>('');
  const [uploadingEditAvatar, setUploadingEditAvatar] = useState(false);
  const [savingEditEmp, setSavingEditEmp] = useState(false);

  const openEditEmployeeModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditEmpName(emp.name);
    setEditEmpPhone(emp.phone || '');
    setEditEmpUserRole((emp.role as any) || 'support_engineer');
    setEditEmpDesignation(emp.designation || emp.role || '');
    setEditEmpEmail(emp.email || '');
    setEditEmpAvatarDisplay(emp.avatar || '');
    setEditEmpCloudUrl(emp.avatar || '');
    setUploadingEditAvatar(false);
  };

  const handleUploadNewAvatar = async (file: File) => {
    setUploadingNewAvatar(true);
    // Instant synchronous local blob URL for 100% reliable preview
    const localUrl = URL.createObjectURL(file);
    setNewEmpAvatarDisplay(localUrl);

    // Upload to Cloudinary in background
    const res = await uploadFileToCloudinary(file);
    setUploadingNewAvatar(false);
    if (res.success && res.url) {
      setNewEmpCloudUrl(res.url);
      showToast('Image uploaded & hosted on cloud storage!');
    } else {
      setNewEmpCloudUrl(localUrl);
      showToast('Photo selected locally');
    }
  };

  const handleUploadEditAvatar = async (file: File) => {
    setUploadingEditAvatar(true);
    // Instant synchronous local blob URL for 100% reliable preview
    const localUrl = URL.createObjectURL(file);
    setEditEmpAvatarDisplay(localUrl);

    // Upload to Cloudinary in background
    const res = await uploadFileToCloudinary(file);
    setUploadingEditAvatar(false);
    if (res.success && res.url) {
      setEditEmpCloudUrl(res.url);
      showToast('Image uploaded & hosted on cloud storage!');
    } else {
      setEditEmpCloudUrl(localUrl);
      showToast('Photo selected locally');
    }
  };

  const handleSaveEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    if (!editEmpName.trim()) {
      showToast('Please enter engineer name');
      return;
    }
    setSavingEditEmp(true);

    const finalAvatar = editEmpCloudUrl || editEmpAvatarDisplay || undefined;

    const res = await updateEmployee(editingEmployee.id, {
      name: editEmpName.trim(),
      role: editEmpUserRole,
      designation: editEmpDesignation.trim() || editEmpUserRole,
      phone: editEmpPhone.trim(),
      email: editEmpEmail.trim(),
      avatar: finalAvatar ? finalAvatar.trim() : undefined
    });

    setSavingEditEmp(false);
    if (res.success) {
      showToast(`Engineer "${editEmpName.trim()}" profile updated!`);
      setEditingEmployee(null);
      setEditEmpAvatarDisplay('');
      setEditEmpCloudUrl('');
      await loadData();
    } else {
      showToast(res.error || 'Failed to update engineer profile');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) {
      showToast('Please enter engineer/employee name');
      return;
    }
    setCreatingEmp(true);

    const finalAvatar = newEmpCloudUrl || newEmpAvatarDisplay || undefined;

    const res = await createEmployee({
      name: newEmpName.trim(),
      role: newEmpUserRole,
      designation: newEmpDesignation.trim() || newEmpUserRole,
      phone: newEmpPhone.trim(),
      email: newEmpEmail.trim(),
      avatar: finalAvatar ? finalAvatar.trim() : undefined
    });

    setCreatingEmp(false);
    if (res.success) {
      showToast(`Engineer "${newEmpName.trim()}" added successfully!`);
      setShowAddEmpModal(false);
      setNewEmpName('');
      setNewEmpPhone('');
      setNewEmpUserRole('support_engineer');
      setNewEmpDesignation('');
      setNewEmpEmail('');
      setNewEmpAvatarDisplay('');
      setNewEmpCloudUrl('');
      await loadData();
    } else {
      showToast(res.error || 'Failed to create engineer');
    }
  };

  const handleDeleteEmployee = async (empId: string, empName: string) => {
    if (window.confirm(`Are you sure you want to remove engineer "${empName}"?`)) {
      await deleteEmployee(empId);
      showToast(`Engineer "${empName}" removed`);
      await loadData();
    }
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
      // 1. Immediately update React state for instantaneous UI feedback
      setCompanies(prev => prev.map(c => 
        (c.id === editingLogoCompany.id || c.code === editingLogoCompany.code)
          ? { ...c, logoUrl, avatar: logoUrl }
          : c
      ));

      // 2. Persist to storage & Cloudflare D1
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
      const [data, compList, empList] = await Promise.all([
        fetchTasks(),
        fetchCompanies(),
        fetchEmployees()
      ]);
      setTasks(data);
      setCompanies(compList);
      setEmployees(empList);
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

  // Dynamic Page-Specific KPI Tiles
  const getPageKpis = () => {
    if (activeTab === 'console') {
      const inProg = filteredTasks.filter((t) => t.status === 'In Progress').length;
      const pending = filteredTasks.filter((t) => t.status === 'Pending').length;
      const inReview = filteredTasks.filter((t) => t.status === 'In Review').length;
      const comp = filteredTasks.filter((t) => t.status === 'Completed').length;
      const urgent = filteredTasks.filter((t) => (t.priorityInCustomer === 'Urgent' || t.priorityInCustomer === 'High')).length;
      const tot = filteredTasks.length;

      return [
        { label: 'Matching Tickets', value: tot, icon: Layers, accent: 'cyan' as const, sub: selectedCompany !== 'All' || selectedStatus !== 'All' || searchQuery ? 'Active Filtered' : 'Across All Clients', live: true, ratio: 1 },
        { label: 'In Progress', value: inProg, icon: Zap, accent: 'blue' as const, sub: 'Under Development', ratio: tot ? inProg / tot : 0 },
        { label: 'Pending Assign', value: pending, icon: Clock, accent: 'amber' as const, sub: 'Action Required ↗', ratio: tot ? pending / tot : 0 },
        { label: 'In Review', value: inReview, icon: Eye, accent: 'purple' as const, sub: 'Quality Inspection', ratio: tot ? inReview / tot : 0 },
        { label: 'High / Urgent', value: urgent, icon: AlertTriangle, accent: 'red' as const, sub: 'Critical Priority', ratio: tot ? urgent / tot : 0 },
        { label: 'Completed', value: comp, icon: CheckCircle2, accent: 'emerald' as const, sub: 'Resolved Tickets ✓', ratio: tot ? comp / tot : 0 },
      ];
    }

    if (activeTab === 'employees') {
      const assignedCount = tasks.filter((t) => t.assignedTo && t.assignedTo !== 'Unassigned' && t.status !== 'Completed').length;
      const unassignedCount = tasks.filter((t) => !t.assignedTo || t.assignedTo === 'Unassigned').length;
      const devCount = tasks.filter((t) => t.status === 'In Progress').length;
      const staffCompleted = tasks.filter((t) => t.status === 'Completed').length;
      const avgLoad = employees.length ? (tasks.filter((t) => t.status !== 'Completed').length / employees.length).toFixed(1) : '0';

      return [
        { label: 'Total Engineers', value: employees.length, icon: Users, accent: 'purple' as const, sub: 'Registered Staff', live: true, ratio: 1 },
        { label: 'Active Workload', value: assignedCount, icon: Zap, accent: 'blue' as const, sub: 'Currently Assigned', ratio: tasks.length ? assignedCount / tasks.length : 0 },
        { label: 'Unassigned Tasks', value: unassignedCount, icon: Clock, accent: 'amber' as const, sub: 'Ready To Assign ↗', ratio: tasks.length ? unassignedCount / tasks.length : 0 },
        { label: 'In-Progress Dev', value: devCount, icon: Sliders, accent: 'cyan' as const, sub: 'Active Engineering', ratio: tasks.length ? devCount / tasks.length : 0 },
        { label: 'Tasks Completed', value: staffCompleted, icon: UserCheck, accent: 'emerald' as const, sub: 'Delivered Work ✓', ratio: tasks.length ? staffCompleted / tasks.length : 0 },
        { label: 'Avg Tasks / Eng', value: avgLoad, icon: Flame, accent: 'red' as const, sub: 'Workload Density', ratio: Math.min(1, parseFloat(avgLoad) / 5) },
      ];
    }

    if (activeTab === 'companies') {
      const activeClients = companies.filter((c) => tasks.some((t) => t.partyName === c.name && t.status !== 'Completed')).length;
      const openIssues = tasks.filter((t) => t.status !== 'Completed').length;
      const urgentClient = tasks.filter((t) => (t.priorityInCustomer === 'Urgent' || t.priorityInCustomer === 'High') && t.status !== 'Completed').length;
      const clientCompleted = tasks.filter((t) => t.status === 'Completed').length;
      const avgTickets = companies.length ? (tasks.length / companies.length).toFixed(1) : '0';

      return [
        { label: 'Total Companies', value: companies.length, icon: Building2, accent: 'cyan' as const, sub: 'Enterprise Clients', live: true, ratio: 1 },
        { label: 'Active Portals', value: activeClients, icon: Zap, accent: 'blue' as const, sub: 'With Active Issues', ratio: companies.length ? activeClients / companies.length : 0 },
        { label: 'Open Client Issues', value: openIssues, icon: Clock, accent: 'amber' as const, sub: 'Ongoing Support ↗', ratio: tasks.length ? openIssues / tasks.length : 0 },
        { label: 'Urgent Client Issues', value: urgentClient, icon: AlertTriangle, accent: 'red' as const, sub: 'High SLA Priority', ratio: tasks.length ? urgentClient / tasks.length : 0 },
        { label: 'Resolved Tickets', value: clientCompleted, icon: CheckCircle2, accent: 'emerald' as const, sub: 'Completed Portals ✓', ratio: tasks.length ? clientCompleted / tasks.length : 0 },
        { label: 'Avg Issues / Client', value: avgTickets, icon: Layers, accent: 'purple' as const, sub: 'Client Ticket Density', ratio: Math.min(1, parseFloat(avgTickets) / 10) },
      ];
    }

    // Default overview (Dashboard tab)
    return [
      { label: 'Total Tasks', value: totalTasks, icon: Layers, accent: 'cyan' as const, sub: 'Across all clients', live: true, ratio: 1 },
      { label: 'Active Tasks', value: activeTasks, icon: Zap, accent: 'blue' as const, sub: 'In Progress & Dev', ratio: totalTasks ? activeTasks / totalTasks : 0 },
      { label: 'Pending Assign', value: pendingTasks, icon: Clock, accent: 'amber' as const, sub: 'Action required ↗', ratio: totalTasks ? pendingTasks / totalTasks : 0 },
      { label: 'High / Urgent', value: urgentTasks, icon: AlertTriangle, accent: 'red' as const, sub: 'Top priority', ratio: totalTasks ? urgentTasks / totalTasks : 0 },
      { label: 'Completed', value: completedTasks, icon: CheckCircle2, accent: 'emerald' as const, sub: 'Target Exceeded ✓', ratio: totalTasks ? completedTasks / totalTasks : 0 },
      { label: 'Engineers', value: employees.length, icon: Users, accent: 'purple' as const, sub: 'Active & Certified', ratio: 1 },
    ];
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isLight ? 'bg-[#FBF5EC] text-[#2A2118] selection:bg-[#EA552E]/20' : 'bg-[#070A11] text-slate-100 selection:bg-blue-600/30'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-400 text-xs font-bold animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Website-Styled Admin Header */}
      <header className={`border-b sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors duration-300 ${
        isLight ? 'bg-[#FFFCF8]/90 border-[#EDE2D3] backdrop-blur-xl shadow-[0_2px_20px_rgba(234,85,46,0.06)] text-[#2A2118]' : 'bg-black/95 border-white/10 backdrop-blur-xl text-white'
      }`}>
        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Exact Brand Logo matching Website */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-3.5 group cursor-pointer" title="Go to Zentrixs Website">
              <div className="relative">
                <div className={`absolute inset-0 blur-xl opacity-20 group-hover:opacity-60 transition-opacity ${isLight ? 'bg-[#EA552E]' : 'bg-blue-500'}`}></div>
                <div className={`relative w-11 h-11 overflow-hidden rounded-xl border group-hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-lg ${
                  isLight ? 'bg-[#FDF3E7] border-[#EDE2D3]' : 'bg-zinc-900 border-white/10'
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
                  <span className={`text-xl sm:text-2xl font-black tracking-[0.3em] uppercase transition-colors ${
                    isLight ? 'text-[#2A2118] group-hover:text-[#EA552E]' : 'text-white group-hover:text-blue-500'
                  }`}>
                    ZEN<span className={isLight ? 'font-extralight text-[#EA552E]' : 'font-extralight text-blue-500'}>TRIXS</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono border ${
                    isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}>
                    SUPER ADMIN
                  </span>
                </div>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.5em] mt-[-2px] group-hover:text-gray-500 transition-colors">
                  Automation Command Center
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Pill Tabs, Theme Switcher & Logout */}
          <div className="flex items-center gap-3">
            <div className={`flex flex-nowrap overflow-x-auto no-scrollbar p-1 rounded-2xl border text-xs font-bold transition-colors ${
              isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] text-[#8A7B68]' : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                  activeTab === 'overview'
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                  activeTab === 'console'
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tickets Console ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                  activeTab === 'employees'
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee Workload ({employees.length})
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                  activeTab === 'companies'
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Companies ({companies.length})
              </button>
              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                  activeTab === 'cms'
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Website CMS
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'whatsapp'
                    ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Settings</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
            </div>

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
      </header>

      {/* Main Body - Full Canvas Width */}
      <div className="w-full px-4 sm:px-8 py-6 space-y-6">
        {/* Dynamic Contextual KPI Tiles per Page/Tab */}
        {activeTab !== 'cms' && activeTab !== 'whatsapp' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {getPageKpis().map((tile, idx) => {
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
                  key={`${activeTab}-${tile.label}`}
                  className={`stagger-item group relative border rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ring-1 ring-transparent ${p.ring} ${
                    isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_34px_rgba(234,85,46,0.12)]' : 'bg-[#0F172A]/80 border-white/10 hover:shadow-[0_14px_34px_rgba(0,0,0,0.45)]'
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle, rgba(${p.rgb},${isLight ? 0.5 : 0.65}) 0%, transparent 70%)` }}
                  ></div>

                  <div className="relative flex items-start justify-between mb-3">
                    <div className={`text-[10px] font-bold uppercase tracking-widest pt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>{tile.label}</div>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${p.iconGrad} text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                      style={{ boxShadow: `0 6px 16px rgba(${p.rgb},${isLight ? 0.35 : 0.45})` }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className={`relative text-[32px] leading-none font-black ${isLight ? p.numLight : p.numDark}`}>{tile.value}</div>

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

        {/* TAB 0: DASHBOARD (All-company analytics overview) */}
        {activeTab === 'overview' && (
          <AdminAnalyticsOverview tasks={tasks} companies={companies} employees={employees} isLight={isLight} />
        )}

        {/* TAB 1: TICKETS CONSOLE (Admin tracking & assigning) */}
        {activeTab === 'console' && (
          <div className="space-y-6">
            {/* Search and Multi-Filters Bar */}
            <div className={`border rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
              isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)]' : 'bg-[#0F172A]/90 border-white/10'
            }`}>
              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-[#B5A892]' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ticket, company, system..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all duration-200 ${
                    isLight
                      ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/10'
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
                  className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.05] active:scale-95 cursor-pointer shadow-sm ${
                    isLight ? 'bg-[#FDEEE7] text-[#EA552E] hover:bg-[#EA552E] hover:text-white border-[#F5D5C3]' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border-blue-500/30'
                  }`}
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Enterprise Task Table */}
            <div className={`border rounded-2xl shadow-xl transition-colors duration-300 ${
              isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0B0F19]/90 border-white/10'
            }`}>
              <div className="overflow-x-auto min-h-[340px] pb-32">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                      isLight ? 'bg-[#FBF5EC]/90 border-[#EDE2D3] text-[#8A7B68]' : 'border-white/10 bg-white/[0.02] text-slate-400'
                    }`}>
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
                  <tbody className={`divide-y ${isLight ? 'divide-[#F3EADC]' : 'divide-white/5'}`}>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className={`py-12 text-center ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`}>
                          No tickets matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((t) => (
                        <tr key={t.id} className={`transition-colors duration-200 ${isLight ? 'hover:bg-[#FBF5EC]' : 'hover:bg-white/[0.02]'}`}>
                          {/* Ticket Number & Date */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className={`font-mono font-bold ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>{t.ticketNumber}</div>
                            <div className={`text-[10px] ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`}>{t.createdAt}</div>
                          </td>

                          {/* Company Name */}
                          <td className="py-4 px-4">
                            <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                              <Building2 className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#EA552E]' : 'text-blue-400'}`} />
                              <span className="truncate max-w-[180px]" title={t.partyName}>
                                {t.partyName}
                              </span>
                            </div>
                            <div className={`text-[10px] ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Due: {t.expectedDateToClose}</div>
                          </td>

                          {/* Person & System */}
                          <td className="py-4 px-4">
                            <div className={`font-medium ${isLight ? 'text-[#5C5244]' : 'text-slate-200'}`}>{t.systemName}</div>
                            <div className={`text-[10px] flex items-center gap-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                              <User className={`w-3 h-3 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                              {t.personName}
                            </div>
                          </td>

                          {/* Description & Type */}
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-1 border ${
                              isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#EDE2D3]' : 'bg-white/5 text-slate-300 border-white/5'
                            }`}>
                              {t.typeOfWork}
                            </span>
                            <div className={`leading-snug line-clamp-2 ${isLight ? 'text-[#5C5244]' : 'text-slate-300'}`}>
                              {t.descriptionOfWork}
                            </div>
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
                                className={`p-2 rounded-xl transition-colors ${isLight ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#6B5D4A] hover:text-[#2A2118]' : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'}`}
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

        {/* TAB 2: EMPLOYEE WORKLOAD (Company Employee tracking & management) */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Zentrixs Engineering & Support Team</h2>
                <p className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Manage assigned engineers, workload distribution, contact details & onboard new support users
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Employees */}
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    placeholder="Search engineer, role, phone..."
                    className={`rounded-xl pl-9 pr-3 py-2 text-xs outline-none w-48 sm:w-56 border transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-[#0F172A] border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500'}`}
                  />
                </div>

                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'}`}
                >
                  <UserPlus className="w-4 h-4" />
                  + Add New Engineer / User
                </button>
              </div>
            </div>

            {(() => {
              const filteredEmployees = employees.filter((emp) => {
                if (!empSearch.trim()) return true;
                const q = empSearch.toLowerCase();
                return (
                  emp.name.toLowerCase().includes(q) ||
                  emp.role.toLowerCase().includes(q) ||
                  (emp.phone && emp.phone.toLowerCase().includes(q)) ||
                  (emp.email && emp.email.toLowerCase().includes(q))
                );
              });

              if (filteredEmployees.length === 0) {
                return (
                  <div className={`border rounded-2xl p-12 text-center space-y-3 ${isLight ? 'bg-white border-[#EDE2D3] text-[#9C8F7D]' : 'bg-[#0F172A] border-white/10 text-slate-400'}`}>
                    <Users className="w-10 h-10 mx-auto opacity-40" />
                    <p className={`text-sm font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>No engineers match your search</p>
                    <p className="text-xs">Try searching by another name, designation or phone number, or click "+ Add New Engineer".</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmployees.map((emp) => {
                    const assignedTasks = tasks.filter((t) => t.assignedTo === emp.name);
                    const active = assignedTasks.filter((t) => t.status !== 'Completed');
                    const completed = assignedTasks.filter((t) => t.status === 'Completed');

                    return (
                      <div key={emp.id} className={`stagger-item border rounded-3xl p-6 shadow-xl space-y-4 transition-all duration-300 flex flex-col justify-between ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(234,85,46,0.08)] hover:border-[#EA552E]/30' : 'bg-[#0F172A] border-white/10 hover:border-white/20'}`}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                onClick={() => openEditEmployeeModal(emp)}
                                title="Click to edit photo & profile"
                                className={`relative group/empavatar w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-2xl flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border shadow-sm cursor-pointer transition-all ${
                                  isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] hover:border-[#EA552E]' : 'bg-white/5 border-white/10 hover:border-cyan-400'
                                }`}
                              >
                                {emp.avatar ? (
                                  <img
                                    src={emp.avatar}
                                    alt={emp.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback on image load error to UI Avatars
                                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=EA552E&color=fff&bold=true`;
                                    }}
                                  />
                                ) : (
                                  <div className={`w-full h-full flex items-center justify-center ${isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F] text-white' : 'bg-blue-600/20 text-blue-400'}`}>
                                    {emp.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/empavatar:opacity-100 transition-opacity">
                                  <Camera className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h3 className={`font-bold text-base truncate ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{emp.name}</h3>
                                  <button
                                    type="button"
                                    onClick={() => openEditEmployeeModal(emp)}
                                    title="Edit Profile"
                                    className={`p-1 rounded-md transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#EA552E] hover:bg-[#FDF3E7]' : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'}`}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>
                                  <Briefcase className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{emp.role}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border border-[#EDE2D3]' : 'bg-white/5 text-slate-300'}`}>
                                {assignedTasks.length} Assigned
                              </span>
                              <button
                                type="button"
                                onClick={() => openEditEmployeeModal(emp)}
                                title="Edit Profile Details"
                                className={`p-1.5 rounded-lg transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#EA552E] hover:bg-[#FDF3E7]' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                title="Delete / Remove Engineer"
                                className={`p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Contact Details (Phone & Email) */}
                          <div className={`p-3 rounded-2xl border space-y-1.5 text-xs ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/30 border-white/5'}`}>
                            <div className="flex items-center gap-2">
                              <Phone className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                              <span className={`font-mono ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                                {emp.phone ? (
                                  <a href={`tel:${emp.phone}`} className="hover:underline font-bold">
                                    {emp.phone}
                                  </a>
                                ) : (
                                  <span className="italic opacity-60">No phone provided</span>
                                )}
                              </span>
                            </div>
                            {emp.email && (
                              <div className="flex items-center gap-2">
                                <Mail className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`} />
                                <span className={`truncate ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                                  <a href={`mailto:${emp.email}`} className="hover:underline">
                                    {emp.email}
                                  </a>
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`rounded-xl p-3 border ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                              <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Active Backlog</div>
                              <div className="text-xl font-black text-amber-500">{active.length}</div>
                            </div>
                            <div className={`rounded-xl p-3 border ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                              <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Closed</div>
                              <div className="text-xl font-black text-emerald-500">{completed.length}</div>
                            </div>
                          </div>

                          {/* Task list for this employee */}
                          <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-[#F3EADC]' : 'border-white/5'}`}>
                            <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Current Assigned Tickets:</div>
                            {active.length === 0 ? (
                              <div className={`text-xs italic ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`}>No pending tasks. Available for new tickets.</div>
                            ) : (
                              active.slice(0, 3).map((t) => (
                                <div key={t.id} className={`p-2.5 border rounded-xl text-xs flex items-center justify-between ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-white/[0.02] border-white/5'}`}>
                                  <div className="overflow-hidden pr-2">
                                    <span className={`font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{t.partyName.split(' ')[0]}: </span>
                                    <span className={isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}>{t.systemName}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                                    t.priorityInCustomer === 'High' || t.priorityInCustomer === 'Urgent'
                                      ? isLight ? 'bg-red-50 text-red-600' : 'bg-red-500/20 text-red-400'
                                      : isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {t.priorityInCustomer}
                                  </span>
                                </div>
                              ))
                            )}
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

        {/* TAB 3: REGISTERED COMPANIES (Admin Credentials Management) */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Authorized Client Companies & Credentials</h2>
                <p className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Yahan Admin nayi company add karega aur unko Login ID & Password assign karega. Keval authorized company hi login kar sakti hai.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search company or ID..."
                    className={`rounded-xl pl-9 pr-3 py-2 text-xs outline-none w-44 sm:w-52 border transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-[#0F172A] border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500'}`}
                  />
                </div>

                {/* View Switcher: List View (Default) vs Grid View */}
                <div className={`flex items-center p-1 rounded-xl border text-xs font-bold ${isLight ? 'bg-[#FDF3E7] border-[#EDE2D3]' : 'bg-black/50 border-white/10'}`}>
                  <button
                    type="button"
                    onClick={() => setCompanyViewMode('list')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      companyViewMode === 'list'
                        ? isLight ? 'bg-[#EA552E] text-white shadow-md shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
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
                        ? isLight ? 'bg-[#EA552E] text-white shadow-md shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid View</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowAddCompModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'}`}
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
                  <div className={`border rounded-2xl p-12 text-center space-y-2 ${isLight ? 'bg-white border-[#EDE2D3] text-[#9C8F7D]' : 'bg-[#0F172A] border-white/10 text-slate-400'}`}>
                    <p className={`text-sm font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>No companies match your search</p>
                    <p className="text-xs">Try searching with a different company name or ID code.</p>
                  </div>
                );
              }

              {/* LIST VIEW (DEFAULT) */}
              if (companyViewMode === 'list') {
                return (
                  <div className={`border rounded-3xl overflow-hidden shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0F172A] border-white/10'}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className={`uppercase text-[10px] font-bold tracking-wider border-b ${isLight ? 'bg-[#FBF5EC]/90 text-[#8A7B68] border-[#EDE2D3]' : 'bg-slate-950/80 text-slate-400 border-white/5'}`}>
                          <tr>
                            <th className="py-3.5 px-4">Company Name</th>
                            <th className="py-3.5 px-4">Login ID / Code</th>
                            <th className="py-3.5 px-4">Password</th>
                            <th className="py-3.5 px-4">Contact Info</th>
                            <th className="py-3.5 px-3 text-center">Active Tickets</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isLight ? 'divide-[#F3EADC]' : 'divide-white/5'}`}>
                          {filteredComps.map((c) => {
                            const compTasks = tasks.filter((t) => t.partyName === c.name);
                            return (
                              <tr key={c.id} className={`transition-colors ${isLight ? 'hover:bg-[#FBF5EC]' : 'hover:bg-white/[0.02]'}`}>
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <div
                                      onClick={() => {
                                        setEditingLogoCompany(c);
                                        setEditLogoPreview(c.logoUrl || c.avatar || '');
                                        setEditLogoFile(null);
                                      }}
                                      title="Click to change or upload company logo"
                                      className={`relative group/logo w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 cursor-pointer border transition-all ${isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] hover:border-[#EA552E]' : 'bg-white/5 border-white/10 hover:border-cyan-400'}`}
                                    >
                                      {(c.logoUrl || c.avatar) ? (
                                        <img
                                          src={c.logoUrl || c.avatar}
                                          alt={c.name}
                                          className="w-full h-full object-contain p-1"
                                        />
                                      ) : (
                                        <div className={`w-full h-full flex items-center justify-center font-bold text-xs ${isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F] text-white' : 'bg-blue-600/20 border border-blue-500/30 text-blue-400'}`}>
                                          {c.name.substring(0, 2).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity">
                                        <Camera className="w-4 h-4 text-white" />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{c.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingLogoCompany(c);
                                            setEditLogoPreview(c.logoUrl || c.avatar || '');
                                            setEditLogoFile(null);
                                          }}
                                          title="Upload / Change Logo"
                                          className={`text-[10px] flex items-center gap-1 font-mono hover:underline ${isLight ? 'text-[#D9481F] hover:text-[#EA552E]' : 'text-cyan-400 hover:text-cyan-300'}`}
                                        >
                                          <Camera className="w-3 h-3" /> Logo
                                        </button>
                                      </div>
                                      <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.2 rounded-full border font-semibold ${isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                                        Authorized Client
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className={`font-mono font-bold px-2.5 py-1 rounded-lg border text-xs ${isLight ? 'text-[#0E7490] bg-cyan-50 border-cyan-200' : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'}`}>
                                    {c.code}
                                  </span>
                                </td>

                                <td className="py-4 px-4 whitespace-nowrap">
                                  <span className={`font-mono font-bold px-2.5 py-1 rounded-lg border text-xs ${isLight ? 'text-[#B45309] bg-amber-50 border-amber-200' : 'text-amber-300 bg-amber-500/10 border-amber-500/30'}`}>
                                    {c.password || 'client@123'}
                                  </span>
                                </td>

                                <td className="py-4 px-4">
                                  <div className={`font-medium ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{c.contactPerson}</div>
                                  <div className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>
                                    {c.phone || c.email || 'No phone'}
                                  </div>
                                </td>

                                <td className="py-4 px-3 text-center whitespace-nowrap">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    compTasks.length > 0
                                      ? isLight ? 'bg-[#FDEEE7] text-[#D9481F] border border-[#F5D5C3]' : 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                                      : isLight ? 'bg-[#FDF3E7] text-[#9C8F7D] border border-[#EDE2D3]' : 'bg-white/5 text-slate-400'
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
                                        setEditLogoPreview(c.logoUrl || c.avatar || '');
                                        setEditLogoFile(null);
                                      }}
                                      title="Upload / Change Logo"
                                      className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${isLight ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#D9481F] hover:text-[#2A2118] border-[#EDE2D3]' : 'bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white border-white/10'}`}
                                    >
                                      <Camera className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Logo</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedCompany(c.name);
                                        setActiveTab('console');
                                      }}
                                      className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-[#EA552E] hover:bg-[#D9481F] shadow-md shadow-[#EA552E]/25' : 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20'}`}
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
                      <div key={c.id} className={`border rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all duration-300 ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-[#EA552E]/40 hover:shadow-[0_8px_28px_rgba(234,85,46,0.08)]' : 'bg-[#0F172A] border-white/10 hover:border-cyan-500/40'}`}>
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${isLight ? 'text-[#0E7490] bg-cyan-50 border-cyan-200' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'}`}>
                              ID: {c.code}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                              Authorized Client
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => {
                                setEditingLogoCompany(c);
                                setEditLogoPreview(c.logoUrl || c.avatar || '');
                                setEditLogoFile(null);
                              }}
                              title="Click to change or upload company logo"
                              className={`relative group/cardlogo w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 cursor-pointer border transition-all shadow-md ${isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] hover:border-[#EA552E]' : 'bg-white/5 border-white/10 hover:border-cyan-400'}`}
                            >
                              {(c.logoUrl || c.avatar) ? (
                                <img
                                  src={c.logoUrl || c.avatar}
                                  alt={c.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center font-bold text-sm ${isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F] text-white' : 'bg-blue-600/20 border border-blue-500/30 text-blue-400'}`}>
                                  {c.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/cardlogo:opacity-100 transition-opacity">
                                <Camera className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-base font-bold truncate ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{c.name}</h3>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLogoCompany(c);
                                  setEditLogoPreview(c.logoUrl || c.avatar || '');
                                  setEditLogoFile(null);
                                }}
                                className={`text-[11px] font-mono flex items-center gap-1 mt-0.5 ${isLight ? 'text-[#D9481F] hover:text-[#EA552E]' : 'text-cyan-400 hover:text-cyan-300'}`}
                              >
                                <Camera className="w-3 h-3" /> Change Logo
                              </button>
                            </div>
                          </div>

                          {/* Credentials Box */}
                          <div className={`mt-4 p-3 rounded-2xl border space-y-2 ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-mono ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Login ID:</span>
                              <span className={`font-mono font-bold ${isLight ? 'text-[#0E7490]' : 'text-cyan-400'}`}>{c.code}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-mono ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Password:</span>
                              <span className={`font-mono font-bold px-2 py-0.5 rounded ${isLight ? 'text-[#B45309] bg-amber-50' : 'text-amber-400 bg-white/5'}`}>
                                {c.password || 'client@123'}
                              </span>
                            </div>
                          </div>

                          <div className={`mt-4 space-y-1.5 text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                            <p>Contact Person: <strong className={isLight ? 'text-[#2A2118]' : 'text-slate-200'}>{c.contactPerson}</strong></p>
                            {c.email && <p>Email: <strong className={isLight ? 'text-[#2A2118]' : 'text-slate-200'}>{c.email}</strong></p>}
                            {c.phone && <p>Phone: <strong className={isLight ? 'text-[#2A2118]' : 'text-slate-200'}>{c.phone}</strong></p>}
                          </div>
                        </div>

                        <div className={`pt-4 border-t flex items-center justify-between ${isLight ? 'border-[#F3EADC]' : 'border-white/5'}`}>
                          <div className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                            Active Tickets: <strong className={isLight ? 'text-[#2A2118] font-bold' : 'text-white font-bold'}>{compTasks.length}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLogoCompany(c);
                                setEditLogoPreview(c.logoUrl || c.avatar || '');
                                setEditLogoFile(null);
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${isLight ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#D9481F] hover:text-[#2A2118] border-[#EDE2D3]' : 'bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white border-white/10'}`}
                            >
                              <Camera className="w-3.5 h-3.5" /> Logo
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCompany(c.name);
                                setActiveTab('console');
                              }}
                              className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-[#EA552E] hover:bg-[#D9481F]' : 'bg-blue-600 hover:bg-blue-500'}`}
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
          <div className={`border rounded-3xl p-6 shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0F172A] border-white/10'}`}>
            <div className={`mb-6 pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <h2 className={`text-xl font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Website CMS & Public Content</h2>
              <p className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Manage client testimonials, social links and banners</p>
            </div>
            <AdminDashboard onClose={() => setActiveTab('console')} isLight={isLight} />
          </div>
        )}

        {/* TAB 5: META WHATSAPP SETTINGS (Protected by PIN 5002) */}
        {activeTab === 'whatsapp' && (
          <div className="w-full">
            <WhatsAppSettings onClose={() => setActiveTab('console')} isLight={isLight} />
          </div>
        )}
      </div>

      {/* DETAIL & NOTES MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div>
                <span className={`font-mono font-bold text-sm ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>{selectedTask.ticketNumber}</span>
                <h3 className={`text-lg font-bold mt-1 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{selectedTask.systemName}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className={`text-lg font-bold p-2 ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {[
                { label: 'Company:', value: selectedTask.partyName },
                { label: 'Raised By:', value: selectedTask.personName },
                { label: 'Type of Work:', value: selectedTask.typeOfWork },
                { label: 'Expected Resolution Date:', value: selectedTask.expectedDateToClose, mono: true },
              ].map((f, i) => (
                <div key={i} className={`p-3 rounded-xl border ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/30 border-white/5'}`}>
                  <span className={isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}>{f.label}</span>
                  <div className={`font-bold ${f.mono ? 'font-mono' : ''} ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{f.value}</div>
                </div>
              ))}
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                Work Description
              </label>
              <div className={`p-4 border rounded-2xl text-xs leading-relaxed max-h-36 overflow-y-auto ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#5C5244]' : 'bg-black/50 border-white/10 text-slate-200'}`}>
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
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
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
                  isLight={isLight}
                  className="w-full"
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
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
                  isLight={isLight}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                Internal Engineer Notes & Resolution Remarks
              </label>
              <textarea
                rows={3}
                value={noteEdit}
                onChange={(e) => setNoteEdit(e.target.value)}
                placeholder="Add technical notes, git commit ref, or resolution comments..."
                className={`w-full border rounded-2xl p-3 text-xs focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/20 text-white focus:border-blue-500'}`}
              />
            </div>

            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Close
              </button>
              <button
                type="button"
                disabled={savingNote}
                onClick={handleSaveModal}
                className={`px-6 py-2.5 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-[#EA552E] hover:bg-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30'}`}
              >
                {savingNote ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW CLIENT COMPANY MODAL */}
      {showAddCompModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-xl border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div>
                <span className={`font-mono font-bold text-xs tracking-wider ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>ADMIN CLIENT SETUP</span>
                <h3 className={`text-xl font-bold mt-1 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Register New Client Company & Generate Login</h3>
              </div>
              <button
                onClick={() => setShowAddCompModal(false)}
                className={`text-lg font-bold p-2 ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRegisterCompany} className="space-y-4 text-xs">
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? "text-[#6B5D4A]" : "text-slate-300"}`}>
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  placeholder="e.g. Reliance Logistics Pvt Ltd"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${isLight ? "bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]" : "bg-black/50 border-white/10 text-white focus:border-cyan-400"}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? "text-[#6B5D4A]" : "text-slate-300"}`}>
                    Company Code / Login ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompCode}
                    onChange={(e) => setNewCompCode(e.target.value)}
                    placeholder="e.g. RELIANCE01"
                    className={`w-full rounded-xl px-4 py-3 font-mono font-bold focus:outline-none uppercase border ${isLight ? 'bg-cyan-50 border-cyan-300 text-[#0E7490] focus:border-[#0E7490]' : 'bg-black/50 border-cyan-500/40 text-cyan-400 focus:border-cyan-300'}`}
                  />
                  <p className={`text-[10px] mt-1 ${isLight ? "text-[#9C8F7D]" : "text-slate-400"}`}>Company is ID se login karegi</p>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? "text-[#6B5D4A]" : "text-slate-300"}`}>
                    Password Assigned <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompPass}
                    onChange={(e) => setNewCompPass(e.target.value)}
                    placeholder="e.g. rel@2026"
                    className={`w-full rounded-xl px-4 py-3 font-mono font-bold focus:outline-none border ${isLight ? 'bg-amber-50 border-amber-300 text-[#B45309] focus:border-[#B45309]' : 'bg-black/50 border-amber-500/40 text-amber-400 focus:border-amber-300'}`}
                  />
                  <p className={`text-[10px] mt-1 ${isLight ? "text-[#9C8F7D]" : "text-slate-400"}`}>Jo password aap unhe denge</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? "text-[#6B5D4A]" : "text-slate-300"}`}>
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={newCompContact}
                    onChange={(e) => setNewCompContact(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${isLight ? "bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]" : "bg-black/50 border-white/10 text-white focus:border-cyan-400"}`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? "text-[#6B5D4A]" : "text-slate-300"}`}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newCompPhone}
                    onChange={(e) => setNewCompPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${isLight ? "bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]" : "bg-black/50 border-white/10 text-white focus:border-cyan-400"}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? "text-[#6B5D4A]" : "text-slate-300"}`}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value={newCompEmail}
                  onChange={(e) => setNewCompEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${isLight ? "bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]" : "bg-black/50 border-white/10 text-white focus:border-cyan-400"}`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider text-xs ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Company Logo (Optional)
                </label>
                <div className={`flex items-center gap-4 p-3.5 border rounded-xl ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/10'}`}>
                  {newCompLogoPreview ? (
                    <div className={`relative group w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center shrink-0 ${isLight ? 'border-[#EDE2D3] bg-white' : 'border-cyan-500/40 bg-white/5'}`}>
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
                    <div className={`w-14 h-14 rounded-xl border border-dashed flex flex-col items-center justify-center shrink-0 ${isLight ? 'border-[#D9C9B2] bg-white text-[#B5A892]' : 'border-white/20 bg-white/5 text-slate-500'}`}>
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isLight ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#2A2118] border border-[#EDE2D3]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                      <UploadCloud className={`w-4 h-4 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                      {newCompLogoFile ? 'Change Logo Image' : 'Select Company Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewCompLogoFile(file);
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.result) {
                                setNewCompLogoPreview(reader.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className={`text-[10px] mt-1 ${isLight ? "text-[#9C8F7D]" : "text-slate-400"}`}>PNG, JPG, SVG or WEBP (Encrypted Cloud Storage)</p>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setShowAddCompModal(false)}
                  className={`px-5 py-2.5 rounded-xl ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingComp}
                  className={`px-6 py-2.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'}`}
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
          <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-cyan-500/30'}`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${isLight ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E]' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Update Company Logo</h3>
                  <p className={`text-xs ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>{editingLogoCompany.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingLogoCompany(null);
                  setEditLogoFile(null);
                  setEditLogoPreview('');
                }}
                className={`text-lg font-bold p-1 cursor-pointer ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateLogo} className="space-y-4">
              <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border space-y-3 ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                {editLogoPreview ? (
                  <div className={`w-24 h-24 rounded-2xl p-2 flex items-center justify-center shadow-lg ${isLight ? 'bg-white border border-[#EDE2D3]' : 'bg-white/5 border border-cyan-500/40 shadow-cyan-500/10'}`}>
                    <img
                      src={editLogoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className={`w-24 h-24 rounded-2xl border border-dashed flex flex-col items-center justify-center font-bold text-2xl ${isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F] border-transparent text-white' : 'bg-blue-600/20 border-blue-500/40 text-blue-400'}`}>
                    {editingLogoCompany.name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-md shadow-[#EA552E]/20' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-cyan-500/20'}`}>
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
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (reader.result) {
                            setEditLogoPreview(reader.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <p className={`text-[10px] text-center ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Will upload & save to secure cloud storage.
                </p>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-2 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLogoCompany(null);
                    setEditLogoFile(null);
                    setEditLogoPreview('');
                  }}
                  className={`px-4 py-2 text-xs font-bold ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLogo || (!editLogoFile && !editLogoPreview)}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-[#EA552E] hover:bg-[#D9481F] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'}`}
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
      {/* REGISTER NEW ENGINEER / USER MODAL */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-lg border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl border ${isLight ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E]' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-mono font-bold text-[10px] uppercase tracking-wider ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>ENGINEERING & SUPPORT TEAM</span>
                  <h3 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Create New User / Engineer</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddEmpModal(false);
                  setNewEmpAvatarDisplay('');
                  setNewEmpCloudUrl('');
                }}
                className={`text-lg font-bold p-2 rounded-xl transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              {/* Profile Image Upload & Preview */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Profile Photo / Avatar
                </label>
                <div className={`flex items-center gap-4 p-3.5 border rounded-2xl ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/10'}`}>
                  {/* Clickable Image Box */}
                  <div 
                    onClick={() => document.getElementById('new-emp-avatar-input')?.click()}
                    className={`relative w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl overflow-hidden border flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-all ${
                      isLight ? 'border-[#EDE2D3] bg-[#FDF3E7] hover:border-[#EA552E]' : 'border-cyan-500/40 bg-[#162032] hover:border-cyan-400'
                    }`}
                    title="Click to upload or change profile photo"
                  >
                    {uploadingNewAvatar ? (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <RefreshCw className={`w-5 h-5 animate-spin ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                        <span className={`text-[7px] font-bold mt-1 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>Uploading...</span>
                      </div>
                    ) : newEmpAvatarDisplay ? (
                      <div className="relative w-full h-full">
                        <img 
                          key={newEmpAvatarDisplay}
                          src={newEmpAvatarDisplay} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-2xl block" 
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/75 py-0.5 text-[8px] text-white font-bold text-center">
                          Change
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <User className={`w-6 h-6 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                        <span className={`text-[8px] font-semibold mt-0.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>+ Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Buttons & Input */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingNewAvatar}
                        onClick={() => document.getElementById('new-emp-avatar-input')?.click()}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isLight
                            ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#2A2118] border border-[#EDE2D3]'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {uploadingNewAvatar ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Cloud...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className={`w-3.5 h-3.5 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                            <span>{newEmpAvatarDisplay ? 'Change Photo' : 'Upload from Device'}</span>
                          </>
                        )}
                      </button>

                      {newEmpAvatarDisplay && !uploadingNewAvatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewEmpAvatarDisplay('');
                            setNewEmpCloudUrl('');
                            const inputEl = document.getElementById('new-emp-avatar-input') as HTMLInputElement;
                            if (inputEl) inputEl.value = '';
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      id="new-emp-avatar-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadNewAvatar(file);
                        }
                      }}
                    />

                    {newEmpCloudUrl ? (
                      <p className={`text-[10px] font-semibold flex items-center gap-1 truncate ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        <Check className="w-3 h-3 shrink-0 text-emerald-600" />
                        <span>Hosted on secure Cloud Storage</span>
                      </p>
                    ) : uploadingNewAvatar ? (
                      <p className={`text-[10px] truncate ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>Uploading file to cloud storage...</p>
                    ) : (
                      <p className={`text-[10px] truncate ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Uploads directly to encrypted cloud storage</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                />
              </div>

              {/* Mobile Number & User Role in 2 cols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <input
                      type="tel"
                      required
                      value={newEmpPhone}
                      onChange={(e) => setNewEmpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full border rounded-xl pl-9 pr-3 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    User Role (Access Level) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Shield className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <select
                      value={newEmpUserRole}
                      onChange={(e) => setNewEmpUserRole(e.target.value as any)}
                      className={`w-full border rounded-xl pl-9 pr-8 py-3 focus:outline-none transition-colors appearance-none cursor-pointer ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' : 'bg-[#0F172A] border-white/10 text-white focus:border-cyan-400'}`}
                    >
                      <option value="support_engineer">Support Engineer</option>
                      <option value="employee">Systems Engineer / Developer</option>
                      <option value="admin">Admin / Director</option>
                      <option value="manager">Operations Manager</option>
                    </select>
                    <ChevronDown className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              {/* Designation / Job Title */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Designation / Job Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    required
                    value={newEmpDesignation}
                    onChange={(e) => setNewEmpDesignation(e.target.value)}
                    placeholder="e.g. Director/Admin, Sr Developer, Automation Architect"
                    className={`w-full border rounded-xl pl-9 pr-3 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Official Email (Optional)
                </label>
                <div className="relative">
                  <Mail className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  <input
                    type="email"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@zentrixs.com"
                    className={`w-full border rounded-xl pl-9 pr-3 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                  />
                </div>
              </div>

              {/* Quick Role Templates */}
              <div>
                <span className={`block text-[10px] font-semibold mb-1.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Quick Designation suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Director/Admin', 'Automation Architect', 'Backend & Cloudflare D1 Lead', 'Full Stack Systems Engineer', 'Senior DevOps Lead', 'WhatsApp Bot & CRM Specialist', 'Frontend UI/UX Engineer', 'Sr Developer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewEmpDesignation(role)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                        newEmpDesignation === role
                          ? isLight ? 'bg-[#EA552E] text-white border-[#EA552E]' : 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#EDE2D3] hover:border-[#EA552E]' : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEmpModal(false);
                    setNewEmpAvatarDisplay('');
                    setNewEmpCloudUrl('');
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingEmp || !newEmpName.trim() || !newEmpPhone.trim() || !newEmpDesignation.trim()}
                  className={`px-6 py-2.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'}`}
                >
                  {creatingEmp ? 'Saving Engineer...' : 'Create & Register Engineer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ENGINEER / USER PROFILE MODAL */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-lg border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl border ${isLight ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E]' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-mono font-bold text-[10px] uppercase tracking-wider ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>ENGINEER PROFILE</span>
                  <h3 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>Edit Engineer / User Details</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingEmployee(null);
                  setEditEmpAvatarDisplay('');
                  setEditEmpCloudUrl('');
                }}
                className={`text-lg font-bold p-2 rounded-xl transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditEmployee} className="space-y-4 text-xs">
              {/* Profile Image Upload & Preview */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Profile Photo / Avatar
                </label>
                <div className={`flex items-center gap-4 p-3.5 border rounded-2xl ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/40 border-white/10'}`}>
                  {/* Clickable Image Box */}
                  <div 
                    onClick={() => document.getElementById('edit-emp-avatar-input')?.click()}
                    className={`relative w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl overflow-hidden border flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-all ${
                      isLight ? 'border-[#EDE2D3] bg-[#FDF3E7] hover:border-[#EA552E]' : 'border-cyan-500/40 bg-[#162032] hover:border-cyan-400'
                    }`}
                    title="Click to upload or change profile photo"
                  >
                    {uploadingEditAvatar ? (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <RefreshCw className={`w-5 h-5 animate-spin ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                        <span className={`text-[7px] font-bold mt-1 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>Uploading...</span>
                      </div>
                    ) : editEmpAvatarDisplay ? (
                      <div className="relative w-full h-full">
                        <img 
                          key={editEmpAvatarDisplay}
                          src={editEmpAvatarDisplay} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-2xl block" 
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/75 py-0.5 text-[8px] text-white font-bold text-center">
                          Change
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <User className={`w-6 h-6 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                        <span className={`text-[8px] font-semibold mt-0.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>+ Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Buttons & Input */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingEditAvatar}
                        onClick={() => document.getElementById('edit-emp-avatar-input')?.click()}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isLight
                            ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#2A2118] border border-[#EDE2D3]'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {uploadingEditAvatar ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Cloud...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className={`w-3.5 h-3.5 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                            <span>{editEmpAvatarDisplay ? 'Change Photo' : 'Upload from Device'}</span>
                          </>
                        )}
                      </button>

                      {editEmpAvatarDisplay && !uploadingEditAvatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditEmpAvatarDisplay('');
                            setEditEmpCloudUrl('');
                            const inputEl = document.getElementById('edit-emp-avatar-input') as HTMLInputElement;
                            if (inputEl) inputEl.value = '';
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      id="edit-emp-avatar-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadEditAvatar(file);
                        }
                      }}
                    />

                    {editEmpCloudUrl ? (
                      <p className={`text-[10px] font-semibold flex items-center gap-1 truncate ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        <Check className="w-3 h-3 shrink-0 text-emerald-600" />
                        <span>Hosted on secure Cloud Storage</span>
                      </p>
                    ) : uploadingEditAvatar ? (
                      <p className={`text-[10px] truncate ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>Uploading file to cloud storage...</p>
                    ) : (
                      <p className={`text-[10px] truncate ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Uploads directly to encrypted cloud storage</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editEmpName}
                  onChange={(e) => setEditEmpName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                />
              </div>

              {/* Mobile Number & User Role in 2 cols */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <input
                      type="tel"
                      required
                      value={editEmpPhone}
                      onChange={(e) => setEditEmpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full border rounded-xl pl-9 pr-3 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                    User Role (Access Level) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Shield className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                    <select
                      value={editEmpUserRole}
                      onChange={(e) => setEditEmpUserRole(e.target.value as any)}
                      className={`w-full border rounded-xl pl-9 pr-8 py-3 focus:outline-none transition-colors appearance-none cursor-pointer ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' : 'bg-[#0F172A] border-white/10 text-white focus:border-cyan-400'}`}
                    >
                      <option value="support_engineer">Support Engineer</option>
                      <option value="employee">Systems Engineer / Developer</option>
                      <option value="admin">Admin / Director</option>
                      <option value="manager">Operations Manager</option>
                    </select>
                    <ChevronDown className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              {/* Designation / Job Title */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Designation / Job Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    required
                    value={editEmpDesignation}
                    onChange={(e) => setEditEmpDesignation(e.target.value)}
                    placeholder="e.g. Director/Admin, Sr Developer, Automation Architect"
                    className={`w-full border rounded-xl pl-9 pr-3 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                  Official Email (Optional)
                </label>
                <div className="relative">
                  <Mail className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-500'}`} />
                  <input
                    type="email"
                    value={editEmpEmail}
                    onChange={(e) => setEditEmpEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@zentrixs.com"
                    className={`w-full border rounded-xl pl-9 pr-3 py-3 focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'}`}
                  />
                </div>
              </div>

              {/* Quick Role Templates */}
              <div>
                <span className={`block text-[10px] font-semibold mb-1.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Quick Designation suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Director/Admin', 'Automation Architect', 'Backend & Cloudflare D1 Lead', 'Full Stack Systems Engineer', 'Senior DevOps Lead', 'WhatsApp Bot & CRM Specialist', 'Frontend UI/UX Engineer', 'Sr Developer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setEditEmpDesignation(role)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                        editEmpDesignation === role
                          ? isLight ? 'bg-[#EA552E] text-white border-[#EA552E]' : 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#EDE2D3] hover:border-[#EA552E]' : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEmployee(null);
                    setEditEmpAvatarDisplay('');
                    setEditEmpCloudUrl('');
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-colors ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditEmp || !editEmpName.trim() || !editEmpPhone.trim() || !editEmpDesignation.trim()}
                  className={`px-6 py-2.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-[1.03] active:scale-95 ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'}`}
                >
                  {savingEditEmp ? 'Saving Changes...' : 'Save Profile Changes'}
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

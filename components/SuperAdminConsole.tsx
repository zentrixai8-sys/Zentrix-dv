import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
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
  Pencil,
  ListTodo,
  CheckSquare,
  Sparkles,
  FolderPlus,
  Download,
  FileUp,
  FileCheck2,
  CalendarClock,
  Bell,
  BellRing,
  CheckCheck,
  Inbox
} from 'lucide-react';
import { Task, TaskStatus, Company, Employee, TaskPriority, Delegation } from '../types/taskTypes';
import {
  fetchTasks,
  createTask,
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
  clearAuthSession,
  fetchDelegations,
  createDelegation,
  updateDelegationStatus,
  deleteDelegation,
  formatDateDDMMYYYY
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
  const [activeTab, setActiveTab] = useState<'overview' | 'console' | 'delegation' | 'employees' | 'companies' | 'cms' | 'whatsapp'>('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
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

  // Client Ticket Notification Panel State
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [readTicketIds, setReadTicketIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('zentrix_admin_read_tickets_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const markTicketAsRead = (ticketId: string) => {
    setReadTicketIds(prev => {
      if (prev.includes(ticketId)) return prev;
      const updated = [...prev, ticketId];
      try {
        localStorage.setItem('zentrix_admin_read_tickets_v1', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const markAllTicketsAsRead = () => {
    const allIds = tasks.map(t => t.id);
    setReadTicketIds(allIds);
    try {
      localStorage.setItem('zentrix_admin_read_tickets_v1', JSON.stringify(allIds));
    } catch (_) {}
    showToast('All notifications marked as read');
  };

  const unreadTickets = tasks.filter(t => !readTicketIds.includes(t.id));
  const unreadCount = unreadTickets.length;

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
  const [newEmpUserRole, setNewEmpUserRole] = useState<'admin' | 'user' | string>('admin');
  const [newEmpDesignation, setNewEmpDesignation] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpAvatarDisplay, setNewEmpAvatarDisplay] = useState<string>('');
  const [newEmpCloudUrl, setNewEmpCloudUrl] = useState<string>('');
  const [uploadingNewAvatar, setUploadingNewAvatar] = useState(false);
  const [creatingEmp, setCreatingEmp] = useState(false);
  const [empSearch, setEmpSearch] = useState('');

  // View Employee Profile Details Modal
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Edit Employee / Engineer Profile
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editEmpName, setEditEmpName] = useState('');
  const [editEmpPhone, setEditEmpPhone] = useState('');
  const [editEmpUserRole, setEditEmpUserRole] = useState<'admin' | 'user' | string>('admin');
  const [editEmpDesignation, setEditEmpDesignation] = useState('');
  const [editEmpEmail, setEditEmpEmail] = useState('');
  const [editEmpAvatarDisplay, setEditEmpAvatarDisplay] = useState<string>('');
  const [editEmpCloudUrl, setEditEmpCloudUrl] = useState<string>('');
  const [uploadingEditAvatar, setUploadingEditAvatar] = useState(false);
  const [savingEditEmp, setSavingEditEmp] = useState(false);

  // Task & Delegation Completion & Resolution Proof Modal
  const [completingTask, setCompletingTask] = useState<Task | null>(null);
  const [completingDelegation, setCompletingDelegation] = useState<Delegation | null>(null);
  const [selectedDelegation, setSelectedDelegation] = useState<Delegation | null>(null);
  const [completionRemark, setCompletionRemark] = useState('');
  const [completionFile, setCompletionFile] = useState<File | null>(null);
  const [completionFileUrl, setCompletionFileUrl] = useState('');
  const [completionFileName, setCompletionFileName] = useState('');
  const [completionFilesList, setCompletionFilesList] = useState<{ file?: File; name: string; url?: string; preview?: string }[]>([]);
  const [uploadingCompletionFile, setUploadingCompletionFile] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);

  // Delegation Task Management State
  const [showAddDelegationModal, setShowAddDelegationModal] = useState(false);
  const [delegationTitle, setDelegationTitle] = useState('');
  const [delegationDesc, setDelegationDesc] = useState('');
  const [delegationAssignee, setDelegationAssignee] = useState('');
  const [delegationDeadline, setDelegationDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [delegationPriority, setDelegationPriority] = useState<TaskPriority>('High');
  const [delegationCategory, setDelegationCategory] = useState('Workflow Automation');
  const [delegationLink, setDelegationLink] = useState('');
  const [creatingDelegation, setCreatingDelegation] = useState(false);

  // Delegation Tab Filter States
  const [delegationFilterEmployee, setDelegationFilterEmployee] = useState('All');
  const [delegationFilterStatus, setDelegationFilterStatus] = useState('All');
  const [delegationFilterPriority, setDelegationFilterPriority] = useState('All');
  const [delegationSearch, setDelegationSearch] = useState('');

  const openEditEmployeeModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditEmpName(emp.name);
    setEditEmpPhone(emp.phone || '');
    setEditEmpUserRole((emp.role as any) || 'admin');
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
      setNewEmpUserRole('admin');
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
      const [data, compList, empList, dlgList] = await Promise.all([
        fetchTasks(),
        fetchCompanies(),
        fetchEmployees(),
        fetchDelegations()
      ]);
      setTasks(data);
      setCompanies(compList);
      setEmployees(empList);
      setDelegations(dlgList);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live polling for incoming client tickets every 15 seconds
    const interval = setInterval(() => {
      fetchTasks().then(latestTasks => {
        if (Array.isArray(latestTasks) && latestTasks.length > 0) {
          setTasks(latestTasks);
        }
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (taskId: string, employeeName: string) => {
    const res = await assignTask(taskId, employeeName);
    if (res.success) {
      showToast(`Task assigned to ${employeeName}`);
      await loadData();
    }
  };

  const openCompletionModal = (target: Task) => {
    setCompletingTask(target);
    setCompletingDelegation(null);
    setCompletionRemark(target.completionRemark || target.notes || '');
    
    // Populate existing completion files if any
    const existing: { file?: File; name: string; url?: string; preview?: string }[] = [];
    if (target.completionFiles && Array.isArray(target.completionFiles) && target.completionFiles.length > 0) {
      target.completionFiles.forEach(cf => existing.push({ name: cf.name, url: cf.url, preview: cf.url }));
    } else if (target.completionFileUrl) {
      existing.push({
        name: target.completionFileName || 'Completion Attachment',
        url: target.completionFileUrl,
        preview: target.completionFileUrl
      });
    }
    setCompletionFilesList(existing);
    setCompletionFile(null);
    setCompletionFileUrl('');
    setCompletionFileName('');
  };

  const openDelegationCompletionModal = (target: Delegation) => {
    setCompletingDelegation(target);
    setCompletingTask(null);
    setCompletionRemark(target.completionRemark || '');
    
    // Populate existing completion files if any
    const existing: { file?: File; name: string; url?: string; preview?: string }[] = [];
    if (target.completionFiles && Array.isArray(target.completionFiles) && target.completionFiles.length > 0) {
      target.completionFiles.forEach(cf => existing.push({ name: cf.name, url: cf.url, preview: cf.url }));
    } else if (target.completionFileUrl) {
      existing.push({
        name: target.completionFileName || 'Completion Attachment',
        url: target.completionFileUrl,
        preview: target.completionFileUrl
      });
    }
    setCompletionFilesList(existing);
    setCompletionFile(null);
    setCompletionFileUrl('');
    setCompletionFileName('');
  };

  const handleMultipleCompletionFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: { file: File; name: string; preview: string }[] = [];
      const fileList = Array.from(e.target.files) as File[];
      fileList.forEach((file: File) => {
        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
        newItems.push({ file, name: file.name, preview });
      });
      setCompletionFilesList(prev => [...prev, ...newItems]);
      e.target.value = '';
    }
  };

  const handleRemoveCompletionFileItem = (index: number) => {
    setCompletionFilesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === 'Completed') {
      const target = tasks.find((t) => t.id === taskId);
      if (target) {
        openCompletionModal(target);
        return;
      }
    }
    const res = await updateTaskStatus(taskId, newStatus);
    if (res.success) {
      showToast(`Status updated to ${newStatus}`);
      await loadData();
    }
  };

  const handleDelegationStatusChange = async (delegationId: string, newStatus: TaskStatus) => {
    if (newStatus === 'Completed') {
      const target = delegations.find((d) => d.id === delegationId);
      if (target) {
        openDelegationCompletionModal(target);
        return;
      }
    }
    const res = await updateDelegationStatus(delegationId, newStatus);
    if (res.success) {
      showToast(`Delegation status updated to ${newStatus}`);
      await loadData();
    }
  };

  const handleDeleteDelegationTask = async (delegationId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete delegation: "${title}"?`)) {
      await deleteDelegation(delegationId);
      showToast('Delegation deleted successfully');
      await loadData();
    }
  };

  const handleConfirmCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTask && !completingDelegation) return;
    setSavingCompletion(true);

    const finalFiles: { name: string; url: string }[] = [];

    // Upload any new selected files to Cloudinary
    for (const item of completionFilesList) {
      if (item.url) {
        finalFiles.push({ name: item.name, url: item.url });
      } else if (item.file) {
        setUploadingCompletionFile(true);
        const upRes = await uploadFileToCloudinary(item.file);
        if (upRes.success && upRes.url) {
          finalFiles.push({ name: item.name, url: upRes.url });
        }
      }
    }
    setUploadingCompletionFile(false);

    const firstFile = finalFiles[0];

    if (completingDelegation) {
      const res = await updateDelegationStatus(completingDelegation.id, 'Completed', completionRemark, {
        completionRemark: completionRemark.trim() || 'Work completed successfully.',
        completionFileUrl: firstFile?.url || '',
        completionFileName: firstFile?.name || '',
        completionFiles: finalFiles
      });
      setSavingCompletion(false);
      if (res.success) {
        showToast('Delegation marked as Completed with resolution proofs!');
        setCompletingDelegation(null);
        setCompletionRemark('');
        setCompletionFilesList([]);
        await loadData();
      } else {
        showToast(res.error || 'Failed to update status');
      }
      return;
    }

    if (completingTask) {
      const res = await updateTaskStatus(completingTask.id, 'Completed', completionRemark, {
        completionRemark: completionRemark.trim() || 'Work completed successfully.',
        completionFileUrl: firstFile?.url || '',
        completionFileName: firstFile?.name || '',
        completionFiles: finalFiles
      });

      setSavingCompletion(false);
      if (res.success) {
        showToast('Task marked as Completed with multiple resolution attachments!');
        setCompletingTask(null);
        setCompletionRemark('');
        setCompletionFilesList([]);
        await loadData();
      } else {
        showToast(res.error || 'Failed to update status');
      }
    }
  };

  const handleCreateDelegationTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegationTitle.trim() || !delegationAssignee) {
      showToast('Please provide task description and assign an engineer');
      return;
    }

    setCreatingDelegation(true);
    const fullDesc = delegationDesc.trim() 
      ? `${delegationTitle.trim()}\n\nScope & Briefing:\n${delegationDesc.trim()}`
      : delegationTitle.trim();

    // 100% separate: Saves ONLY to delegation table
    const res = await createDelegation({
      title: delegationTitle.trim(),
      description: fullDesc,
      category: delegationCategory || 'Workflow Automation',
      priority: delegationPriority,
      targetDate: delegationDeadline || '2026-03-31',
      assignedTo: delegationAssignee,
      linkUrl: delegationLink.trim() || undefined,
      status: 'Pending'
    });

    setCreatingDelegation(false);
    if (res.success) {
      showToast(`Task successfully delegated to ${delegationAssignee}!`);
      setShowAddDelegationModal(false);
      setDelegationTitle('');
      setDelegationDesc('');
      setDelegationAssignee('');
      setDelegationLink('');
      setDelegationPriority('High');
      await loadData();
    } else {
      showToast(res.error || 'Failed to create delegation task');
    }
  };

  const handleSaveModal = async () => {
    if (!selectedTask) return;
    setSavingNote(true);
    const res = await updateTaskStatus(
      selectedTask.id,
      statusEdit,
      noteEdit,
      statusEdit === 'Completed'
        ? {
            completionRemark: noteEdit,
            completionFileUrl: selectedTask.completionFileUrl,
            completionFileName: selectedTask.completionFileName
          }
        : undefined
    );
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
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isLight ? 'bg-[#FBF5EC] text-[#2A2118] selection:bg-[#EA552E]/20' : 'bg-[#070A11] text-slate-100 selection:bg-blue-600/30'
      }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-400 text-xs font-bold animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Website-Styled Admin Header */}
      <header className={`border-b sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors duration-300 ${isLight ? 'bg-[#FFFCF8]/90 border-[#EDE2D3] backdrop-blur-xl shadow-[0_2px_20px_rgba(234,85,46,0.06)] text-[#2A2118]' : 'bg-black/95 border-white/10 backdrop-blur-xl text-white'
        }`}>
        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Exact Brand Logo matching Website */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-3.5 group cursor-pointer" title="Go to Zentrixs Website">
              <div className="relative">
                <div className={`absolute inset-0 blur-xl opacity-20 group-hover:opacity-60 transition-opacity ${isLight ? 'bg-[#EA552E]' : 'bg-blue-500'}`}></div>
                <div className={`relative w-11 h-11 overflow-hidden rounded-xl border group-hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-lg ${isLight ? 'bg-[#FDF3E7] border-[#EDE2D3]' : 'bg-zinc-900 border-white/10'
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
                  <span className={`text-xl sm:text-2xl font-black tracking-[0.3em] uppercase transition-colors ${isLight ? 'text-[#2A2118] group-hover:text-[#EA552E]' : 'text-white group-hover:text-blue-500'
                    }`}>
                    ZEN<span className={isLight ? 'font-extralight text-[#EA552E]' : 'font-extralight text-blue-500'}>TRIXS</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black font-mono border ${isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
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
            <div className={`flex flex-nowrap overflow-x-auto no-scrollbar p-1 rounded-2xl border text-xs font-bold transition-colors ${isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] text-[#8A7B68]' : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${activeTab === 'overview'
                  ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${activeTab === 'console'
                  ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Tickets Console ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('delegation')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-1.5 ${activeTab === 'delegation'
                  ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Task Delegation ({delegations.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${activeTab === 'employees'
                  ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Employee Workload ({employees.length})
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${activeTab === 'companies'
                  ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Companies ({companies.length})
              </button>
              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${activeTab === 'cms'
                  ? isLight ? 'bg-[#EA552E] text-white shadow-lg shadow-[#EA552E]/25' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isLight ? 'text-[#8A7B68] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Website CMS
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center gap-1.5 cursor-pointer ${activeTab === 'whatsapp'
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

            {/* Notification Bell Icon & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                title="Client Ticket Notifications"
                className={`relative flex items-center justify-center p-2.5 text-xs font-bold rounded-xl border transition-all duration-200 hover:scale-[1.05] active:scale-95 cursor-pointer ${
                  showNotificationPanel
                    ? isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                    : isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#EDE2D3] hover:text-[#2A2118]' : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
                }`}
              >
                {unreadCount > 0 ? (
                  <BellRing className={`w-4 h-4 animate-bounce ${isLight ? 'text-[#EA552E]' : 'text-blue-400'}`} />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse border-2 border-white dark:border-black">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotificationPanel && (
                <>
                  {/* Backdrop for closing */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotificationPanel(false)}
                  />
                  
                  <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden backdrop-blur-xl transition-all duration-200 ${
                    isLight ? 'bg-white/95 border-[#EDE2D3] text-[#2A2118] shadow-orange-950/10' : 'bg-[#0B1120]/95 border-white/10 text-white shadow-black/80'
                  }`}>
                    {/* Header */}
                    <div className={`p-4 border-b flex items-center justify-between ${
                      isLight ? 'border-[#EDE2D3] bg-[#FDFBF7]' : 'border-white/10 bg-white/[0.02]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isLight ? 'bg-[#FDEEE7] text-[#EA552E]' : 'bg-blue-600/20 text-blue-400'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs">Client Ticket Alerts</h4>
                          <p className={`text-[10px] ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                            {unreadCount > 0 ? `${unreadCount} new unread tickets` : 'All tickets caught up'}
                          </p>
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={markAllTicketsAsRead}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                            isLight ? 'text-[#EA552E] hover:bg-[#FDEEE7]' : 'text-blue-400 hover:bg-blue-600/20'
                          }`}
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-inherit">
                      {tasks.length === 0 ? (
                        <div className="p-8 text-center">
                          <Inbox className={`w-8 h-8 mx-auto mb-2 opacity-30 ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`} />
                          <p className={`text-xs font-bold ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>No client tickets yet</p>
                        </div>
                      ) : (
                        tasks.slice(0, 15).map(task => {
                          const isUnread = !readTicketIds.includes(task.id);
                          return (
                            <div
                              key={task.id}
                              onClick={() => {
                                markTicketAsRead(task.id);
                                setSelectedTask(task);
                                setStatusEdit(task.status);
                                setNoteEdit(task.notes || '');
                                setActiveTab('console');
                                setShowNotificationPanel(false);
                              }}
                              className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                                isUnread
                                  ? isLight ? 'bg-[#FDF3E7]/60 hover:bg-[#FDF3E7]' : 'bg-blue-950/30 hover:bg-blue-900/40'
                                  : isLight ? 'hover:bg-[#FBF5EC]' : 'hover:bg-white/[0.03]'
                              }`}
                            >
                              {/* Unread Indicator Dot */}
                              {isUnread && (
                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse ${
                                  isLight ? 'bg-[#EA552E]' : 'bg-blue-500'
                                }`} />
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                    isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                  }`}>
                                    {task.ticketNumber}
                                  </span>
                                  
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                    task.priorityInCustomer === 'Urgent'
                                      ? 'bg-red-500/15 text-red-500 border-red-500/30'
                                      : task.priorityInCustomer === 'High'
                                      ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                      : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                  }`}>
                                    {task.priorityInCustomer || 'Medium'}
                                  </span>
                                </div>

                                <h5 className={`font-bold text-xs truncate mb-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                  {task.partyName}
                                </h5>

                                <p className={`text-[11px] line-clamp-2 leading-relaxed mb-1.5 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-300'}`}>
                                  {task.descriptionOfWork}
                                </p>

                                <div className="flex items-center justify-between text-[9px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <User className="w-2.5 h-2.5" />
                                    {task.personName}
                                  </span>
                                  <span className="font-mono">
                                    {formatDateDDMMYYYY(task.createdAt || task.expectedDateToClose)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    {tasks.length > 0 && (
                      <div className={`p-2.5 text-center border-t ${
                        isLight ? 'border-[#EDE2D3] bg-[#FDFBF7]' : 'border-white/10 bg-white/[0.02]'
                      }`}>
                        <button
                          onClick={() => {
                            setActiveTab('console');
                            setShowNotificationPanel(false);
                          }}
                          className={`text-xs font-bold transition-colors cursor-pointer ${
                            isLight ? 'text-[#EA552E] hover:text-[#D9481F]' : 'text-blue-400 hover:text-blue-300'
                          }`}
                        >
                          View all in Tickets Console →
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Disconnect Button (Icon Only) */}
            <button
              onClick={() => {
                clearAuthSession();
                onLogout();
              }}
              title="Disconnect / Logout"
              className={`flex items-center justify-center p-2.5 text-xs font-bold rounded-xl border transition-all duration-200 hover:scale-[1.05] active:scale-95 cursor-pointer ${isLight
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
        {activeTab !== 'cms' && activeTab !== 'whatsapp' && activeTab !== 'delegation' && (
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
                  className={`stagger-item group relative border rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ring-1 ring-transparent ${p.ring} ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_34px_rgba(234,85,46,0.12)]' : 'bg-[#0F172A]/80 border-white/10 hover:shadow-[0_14px_34px_rgba(0,0,0,0.45)]'
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
            <div className={`border rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4 transition-colors duration-300 ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)]' : 'bg-[#0F172A]/90 border-white/10'
              }`}>
              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-[#B5A892]' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ticket, company, system..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none border transition-all duration-200 ${isLight
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
                  className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.05] active:scale-95 cursor-pointer shadow-sm ${isLight ? 'bg-[#FDEEE7] text-[#EA552E] hover:bg-[#EA552E] hover:text-white border-[#F5D5C3]' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border-blue-500/30'
                    }`}
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Enterprise Task Table */}
            <div className={`border rounded-2xl shadow-xl transition-colors duration-300 ${isLight ? 'bg-white border-[#EDE2D3] shadow-[0_4px_24px_rgba(0,0,0,0.05)]' : 'bg-[#0B0F19]/90 border-white/10'
              }`}>
              <div className="overflow-x-auto min-h-[340px] pb-32">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${isLight ? 'bg-[#FBF5EC]/90 border-[#EDE2D3] text-[#8A7B68]' : 'border-white/10 bg-white/[0.02] text-slate-400'
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
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mb-1 border ${isLight ? 'bg-[#FDF3E7] text-[#6B5D4A] border-[#EDE2D3]' : 'bg-white/5 text-slate-300 border-white/5'
                              }`}>
                              {t.typeOfWork}
                            </span>
                            <div className={`leading-snug line-clamp-2 ${isLight ? 'text-[#5C5244]' : 'text-slate-300'}`}>
                              {t.descriptionOfWork}
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${t.priorityInCustomer === 'Urgent'
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
                              {t.completionFileUrl && (
                                <a
                                  href={t.completionFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-xl transition-colors"
                                  title={`Completion Proof: ${t.completionFileName || 'View Resolution Attachment'}`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
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

        {/* TAB: TASK DELEGATION (Admin assigning internal tasks to employees) */}
        {activeTab === 'delegation' && (() => {
          const allDelegations = delegations;
          const pendingDelegations = allDelegations.filter(t => t.status !== 'Completed' && t.status !== 'Rejected');
          const completedDelegations = allDelegations.filter(t => t.status === 'Completed');
          const urgentDelegations = allDelegations.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Completed');

          const filteredDelegations = allDelegations.filter(t => {
            if (delegationFilterEmployee !== 'All' && (t.assignedTo || '').toLowerCase().trim() !== delegationFilterEmployee.toLowerCase().trim()) {
              return false;
            }
            if (delegationFilterStatus !== 'All' && t.status !== delegationFilterStatus) {
              return false;
            }
            if (delegationFilterPriority !== 'All' && t.priority !== delegationFilterPriority) {
              return false;
            }
            if (delegationSearch.trim()) {
              const q = delegationSearch.toLowerCase();
              const matchText = `${t.delegationNumber} ${t.title} ${t.description} ${t.assignedTo || ''} ${t.category || ''}`.toLowerCase();
              if (!matchText.includes(q)) return false;
            }
            return true;
          });

          return (
            <div className="space-y-6">
              {/* Hero Banner with Create Button */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                isLight 
                  ? 'bg-gradient-to-r from-white via-[#FDFBF7] to-[#FBF5EC] border-[#EDE2D3]' 
                  : 'bg-gradient-to-r from-[#0F172A] via-[#0B1120] to-[#070D18] border-white/10'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}>
                      INTERNAL TASK MANAGEMENT
                    </span>
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Delegation Active
                    </span>
                  </div>
                  <h2 className={`text-2xl font-black tracking-tight ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    Admin Task & Work Delegation
                  </h2>
                  <p className={`text-xs ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Directly assign tasks to engineers, set completion deadlines, track real-time resolution and verify multiple image/document proofs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddDelegationModal(true)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                    isLight 
                      ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-[#EA552E]/30' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/30'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Assign New Task / Delegation</span>
                </button>
              </div>

              {/* KPI Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border transition-all ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Total Delegated</span>
                    <ListTodo className={`w-4 h-4 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                  </div>
                  <div className={`text-2xl font-black mt-2 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    {allDelegations.length}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`}>
                    Internal work assignments
                  </span>
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>In Progress / Pending</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black mt-2 text-amber-500">
                    {pendingDelegations.length}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`}>
                    Active engineer execution
                  </span>
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Urgent / High Priority</span>
                    <Flame className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-black mt-2 text-red-500">
                    {urgentDelegations.length}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`}>
                    Requires immediate action
                  </span>
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Completed & Resolved</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black mt-2 text-emerald-500">
                    {completedDelegations.length}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`}>
                    With resolution proofs
                  </span>
                </div>
              </div>

              {/* Filters & Search Control Bar */}
              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
                isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'
              }`}>
                {/* Search Box */}
                <div className="relative w-full md:w-72">
                  <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#B5A892]' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={delegationSearch}
                    onChange={(e) => setDelegationSearch(e.target.value)}
                    placeholder="Search task, engineer, system..."
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl outline-none border transition-all ${
                      isLight 
                        ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' 
                        : 'bg-black/40 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400'
                    }`}
                  />
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* Filter by Employee */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`font-bold hidden sm:inline ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Engineer:</span>
                    <select
                      value={delegationFilterEmployee}
                      onChange={(e) => setDelegationFilterEmployee(e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold outline-none border cursor-pointer ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118]' 
                          : 'bg-[#1E293B] border-white/10 text-white'
                      }`}
                    >
                      <option value="All">All Engineers ({employees.length})</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Status */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`font-bold hidden sm:inline ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Status:</span>
                    <select
                      value={delegationFilterStatus}
                      onChange={(e) => setDelegationFilterStatus(e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold outline-none border cursor-pointer ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118]' 
                          : 'bg-[#1E293B] border-white/10 text-white'
                      }`}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Filter by Priority */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={`font-bold hidden sm:inline ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Priority:</span>
                    <select
                      value={delegationFilterPriority}
                      onChange={(e) => setDelegationFilterPriority(e.target.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold outline-none border cursor-pointer ${
                        isLight 
                          ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118]' 
                          : 'bg-[#1E293B] border-white/10 text-white'
                      }`}
                    >
                      <option value="All">All Priorities</option>
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delegated Tasks List Table */}
              <div className={`rounded-3xl border overflow-hidden shadow-xl ${
                isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'
              }`}>
                {filteredDelegations.length === 0 ? (
                  <div className="py-16 px-6 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${
                      isLight ? 'bg-[#FDF8F2] border-[#EDE2D3] text-[#8A7B68]' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      <ListTodo className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                        No delegated tasks match your filters
                      </h3>
                      <p className={`text-xs mt-1 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                        Assign your first internal task or adjust search criteria to see active delegations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddDelegationModal(true)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer ${
                        isLight ? 'bg-[#EA552E] shadow-md shadow-[#EA552E]/25' : 'bg-blue-600 shadow-md shadow-blue-600/30'
                      }`}
                    >
                      + Assign Task Now
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b font-mono font-bold uppercase tracking-wider text-[10px] ${
                          isLight ? 'bg-[#FDF8F2] text-[#8A7B68] border-[#EDE2D3]' : 'bg-white/[0.02] text-slate-400 border-white/10'
                        }`}>
                          <th className="py-3.5 px-4">Task Details & Scope</th>
                          <th className="py-3.5 px-4">Assigned Engineer</th>
                          <th className="py-3.5 px-4">Target Deadline</th>
                          <th className="py-3.5 px-4">Priority</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Resolution Proofs</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-inherit">
                        {filteredDelegations.map((dlg) => {
                          const assignedEmp = employees.find(e => e.name.toLowerCase().trim() === (dlg.assignedTo || '').toLowerCase().trim());
                          const proofFilesCount = (dlg.completionFiles && dlg.completionFiles.length) || (dlg.completionFileUrl ? 1 : 0);

                          return (
                            <tr
                              key={dlg.id}
                              className={`transition-colors duration-150 ${
                                isLight ? 'hover:bg-[#FDFBF7]' : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              {/* Task Details */}
                              <td className="py-4 px-4 max-w-xs sm:max-w-sm">
                                <div className="flex items-start gap-2.5">
                                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                                    dlg.status === 'Completed'
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                      : isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] text-[#EA552E]' : 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                                  }`}>
                                    <ListTodo className="w-4 h-4" />
                                  </div>
                                  <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-md border ${
                                        isLight ? 'bg-[#FDEEE7] text-[#EA552E] border-[#F5D5C3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                      }`}>
                                        {dlg.delegationNumber}
                                      </span>
                                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                                        isLight ? 'bg-[#F5EFE6] text-[#7A6B58] border-[#E8DEC8]' : 'bg-white/5 text-slate-400 border-white/10'
                                      }`}>
                                        {dlg.category || 'Internal Task'}
                                      </span>
                                    </div>
                                    <h4 className={`font-bold text-xs truncate leading-relaxed ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                      {dlg.title}
                                    </h4>
                                    {dlg.description && (
                                      <p className={`text-[11px] line-clamp-2 leading-relaxed ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                                        {dlg.description}
                                      </p>
                                    )}
                                    {dlg.linkUrl && (
                                      <a
                                        href={dlg.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>Reference / Docs Link</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Assigned Engineer */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center font-bold text-xs ${
                                    isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] text-[#EA552E]' : 'bg-white/5 border-white/10 text-cyan-400'
                                  }`}>
                                    {assignedEmp?.avatar ? (
                                      <img src={assignedEmp.avatar} alt={dlg.assignedTo || 'Unassigned'} className="w-full h-full object-cover" />
                                    ) : (
                                      (dlg.assignedTo || 'U').substring(0, 2).toUpperCase()
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className={`font-bold text-xs truncate ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                      {dlg.assignedTo || 'Unassigned'}
                                    </div>
                                    <div className={`text-[10px] truncate ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                                      {assignedEmp?.designation || assignedEmp?.role || 'Support Engineer'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Target Deadline */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                  <Calendar className={`w-3.5 h-3.5 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                                  <span className={`font-bold ${isLight ? 'text-[#2A2118]' : 'text-slate-200'}`}>
                                    {formatDateDDMMYYYY(dlg.targetDate)}
                                  </span>
                                </div>
                              </td>

                              {/* Priority */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                                  dlg.priority === 'Urgent'
                                    ? 'bg-red-500/15 text-red-500 border-red-500/30'
                                    : dlg.priority === 'High'
                                      ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                      : 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                                }`}>
                                  {dlg.priority === 'Urgent' && <Flame className="w-3 h-3" />}
                                  {dlg.priority}
                                </span>
                              </td>

                              {/* Status Dropdown */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <select
                                  value={dlg.status}
                                  onChange={(e) => handleDelegationStatusChange(dlg.id, e.target.value as TaskStatus)}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border outline-none cursor-pointer ${
                                    dlg.status === 'Completed'
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                      : dlg.status === 'In Progress'
                                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="In Review">In Review</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>

                              {/* Resolution Proofs Count */}
                              <td className="py-4 px-4 whitespace-nowrap">
                                {proofFilesCount > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDelegation(dlg)}
                                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border inline-flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer ${
                                      isLight 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    }`}
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    <span>{proofFilesCount} Proof file{proofFilesCount > 1 ? 's' : ''}</span>
                                  </button>
                                ) : (
                                  <span className={`text-[10px] italic ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`}>
                                    No proof yet
                                  </span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {dlg.status !== 'Completed' ? (
                                    <button
                                      type="button"
                                      onClick={() => openDelegationCompletionModal(dlg)}
                                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Mark Done</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDelegation(dlg)}
                                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                                        isLight 
                                          ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#EA552E] border-[#EDE2D3]' 
                                          : 'bg-white/5 hover:bg-white/10 text-cyan-400 border-white/10'
                                      }`}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>View Proof</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setSelectedDelegation(dlg)}
                                    title="View Delegation Details"
                                    className={`p-1.5 rounded-xl border transition-colors ${
                                      isLight 
                                        ? 'bg-[#FBF5EC] hover:bg-[#F0E6D6] text-[#6B5D4A] border-[#EDE2D3]' 
                                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                                    }`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDelegationTask(dlg.id, dlg.title)}
                                    title="Delete Delegation"
                                    className="p-1.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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
                <div className="space-y-6">
                  {/* 1. WHATSAPP / INSTAGRAM STORY CIRCULAR AVATARS ROW */}
                  <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border shadow-sm ${
                    isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EA552E] animate-pulse"></span>
                        <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                          isLight ? 'text-[#2A2118]' : 'text-white'
                        }`}>
                          Team Stories & Quick Profiles
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLight ? 'bg-[#FDF3E7] text-[#EA552E]' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          {employees.length} Engineers
                        </span>
                      </div>
                      <span className={`text-[11px] font-medium hidden sm:inline ${
                        isLight ? 'text-[#8A7B68]' : 'text-slate-400'
                      }`}>
                        Click circle to view full profile details
                      </span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
                      {/* Add New Story Circle */}
                      <div
                        onClick={() => setShowAddEmpModal(true)}
                        className="flex flex-col items-center shrink-0 cursor-pointer group"
                      >
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[#EA552E] shadow-sm ${
                          isLight ? 'border-[#C8BAA7] bg-[#FDF8F2] text-[#8A7B68]' : 'border-white/20 bg-white/5 text-slate-300'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isLight ? 'bg-[#EA552E] text-white group-hover:bg-[#D9481F]' : 'bg-cyan-500 text-slate-950 group-hover:bg-cyan-400'
                          }`}>
                            <Plus className="w-5 h-5" />
                          </div>
                        </div>
                        <span className={`text-xs font-bold mt-2 truncate max-w-[76px] text-center ${
                          isLight ? 'text-[#2A2118]' : 'text-white'
                        }`}>
                          Add New
                        </span>
                        <span className={`text-[10px] truncate max-w-[76px] text-center ${
                          isLight ? 'text-[#8A7B68]' : 'text-slate-500'
                        }`}>
                          Engineer
                        </span>
                      </div>

                      {/* Employee Story Circles */}
                      {filteredEmployees.map((emp) => {
                        const assignedTasks = tasks.filter((t) => t.assignedTo === emp.name);
                        const active = assignedTasks.filter((t) => t.status !== 'Completed');
                        const hasActive = active.length > 0;

                        return (
                          <div
                            key={emp.id}
                            onClick={() => setViewingEmployee(emp)}
                            title={`Click to view ${emp.name}'s profile and tickets`}
                            className="flex flex-col items-center shrink-0 cursor-pointer group"
                          >
                            {/* Instagram/WhatsApp Story Gradient Ring */}
                            <div className={`p-[2.5px] rounded-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
                              hasActive
                                ? 'bg-gradient-to-tr from-amber-500 via-[#EA552E] to-rose-500 shadow-sm'
                                : isLight ? 'bg-gradient-to-tr from-emerald-400 to-teal-500' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
                            }`}>
                              <div className={`p-[2px] rounded-full ${
                                isLight ? 'bg-white' : 'bg-[#0F172A]'
                              }`}>
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-900">
                                  {emp.avatar ? (
                                    <img
                                      src={emp.avatar}
                                      alt={emp.name}
                                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=EA552E&color=fff&bold=true&size=160`;
                                      }}
                                    />
                                  ) : (
                                    <div className={`w-full h-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                                      isLight ? 'bg-gradient-to-br from-[#EA552E] to-[#D9481F] text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                      {emp.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                  )}

                                  {/* Task count pill or online badge */}
                                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white ring-2 ${
                                    isLight ? 'ring-white' : 'ring-[#0F172A]'
                                  } ${hasActive ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                    {active.length}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Name & Role below circle */}
                            <span className={`text-xs font-bold mt-1.5 truncate max-w-[80px] text-center group-hover:text-[#EA552E] transition-colors ${
                              isLight ? 'text-[#2A2118]' : 'text-white'
                            }`}>
                              {emp.name.split(' ')[0]}
                            </span>
                            <span className={`text-[10px] truncate max-w-[80px] text-center ${
                              isLight ? 'text-[#8A7B68]' : 'text-slate-400'
                            }`}>
                              {emp.role.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. TABLE FORM DATA VIEW */}
                  <div className={`border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm ${
                    isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/10'
                  }`}>
                    <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-white/[0.02] border-white/5'
                    }`}>
                      <div>
                        <h3 className={`font-bold text-sm sm:text-base ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                          All Engineers & Team Workload
                        </h3>
                        <p className={`text-xs ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                          Complete overview of contact details, active backlog tasks, and current ticket assignments.
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl self-start sm:self-auto border ${
                        isLight ? 'bg-white text-[#EA552E] border-[#EDE2D3]' : 'bg-white/5 text-cyan-400 border-white/10'
                      }`}>
                        Showing {filteredEmployees.length} of {employees.length}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                            isLight ? 'bg-[#FBF5EC] text-[#8A7B68] border-[#EDE2D3]' : 'bg-black/30 text-slate-400 border-white/10'
                          }`}>
                            <th className="py-3 px-4">Engineer / Profile</th>
                            <th className="py-3 px-4">Role & Designation</th>
                            <th className="py-3 px-4">Contact Info</th>
                            <th className="py-3 px-4 text-center">Active Backlog</th>
                            <th className="py-3 px-4 text-center">Completed</th>
                            <th className="py-3 px-4">Current Task</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isLight ? 'divide-[#EDE2D3]' : 'divide-white/5'}`}>
                          {filteredEmployees.map((emp) => {
                            const assignedTasks = tasks.filter((t) => t.assignedTo === emp.name);
                            const active = assignedTasks.filter((t) => t.status !== 'Completed');
                            const completed = assignedTasks.filter((t) => t.status === 'Completed');
                            const latestActiveTask = active[0];

                            return (
                              <tr
                                key={emp.id}
                                className={`transition-colors ${
                                  isLight ? 'hover:bg-[#FDF8F2]' : 'hover:bg-white/[0.02]'
                                }`}
                              >
                                {/* Profile / Name */}
                                <td className="py-3.5 px-4">
                                  <div
                                    onClick={() => setViewingEmployee(emp)}
                                    className="flex items-center gap-3 cursor-pointer group"
                                  >
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10 shadow-sm">
                                      {emp.avatar ? (
                                        <img
                                          src={emp.avatar}
                                          alt={emp.name}
                                          className="w-full h-full object-cover object-top"
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=EA552E&color=fff&bold=true&size=100`;
                                          }}
                                        />
                                      ) : (
                                        <div className={`w-full h-full flex items-center justify-center font-bold text-xs ${
                                          isLight ? 'bg-[#EA552E] text-white' : 'bg-blue-600 text-white'
                                        }`}>
                                          {emp.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                      )}
                                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white"></span>
                                    </div>
                                    <div>
                                      <div className={`font-bold text-xs sm:text-sm group-hover:underline ${
                                        isLight ? 'text-[#2A2118]' : 'text-white'
                                      }`}>
                                        {emp.name}
                                      </div>
                                      <div className={`text-[11px] font-mono ${
                                        isLight ? 'text-[#8A7B68]' : 'text-slate-400'
                                      }`}>
                                        {emp.phone || 'No phone'}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Role */}
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                                    isLight ? 'bg-[#FDF3E7] text-[#EA552E] border-[#EDE2D3]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  }`}>
                                    <Briefcase className="w-3 h-3 shrink-0" />
                                    <span>{emp.role}</span>
                                  </span>
                                </td>

                                {/* Contact Details */}
                                <td className="py-3.5 px-4 space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <Phone className={`w-3 h-3 shrink-0 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                                    {emp.phone ? (
                                      <a href={`tel:${emp.phone}`} className="font-mono hover:underline font-medium">
                                        {emp.phone}
                                      </a>
                                    ) : (
                                      <span className="italic opacity-50">N/A</span>
                                    )}
                                  </div>
                                  {emp.email && (
                                    <div className="flex items-center gap-1.5">
                                      <Mail className={`w-3 h-3 shrink-0 ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`} />
                                      <a href={`mailto:${emp.email}`} className="hover:underline truncate max-w-[160px] opacity-80">
                                        {emp.email}
                                      </a>
                                    </div>
                                  )}
                                </td>

                                {/* Active Tasks Count */}
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full text-xs font-black ${
                                    active.length > 0
                                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 font-mono'
                                      : isLight ? 'bg-zinc-100 text-zinc-400' : 'bg-white/5 text-slate-500'
                                  }`}>
                                    {active.length}
                                  </span>
                                </td>

                                {/* Closed Tasks Count */}
                                <td className="py-3.5 px-4 text-center">
                                  <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-mono">
                                    {completed.length}
                                  </span>
                                </td>

                                {/* Current Task Preview */}
                                <td className="py-3.5 px-4 max-w-[200px]">
                                  {latestActiveTask ? (
                                    <div
                                      onClick={() => setViewingEmployee(emp)}
                                      className={`p-1.5 rounded-lg border text-[11px] truncate cursor-pointer transition-colors ${
                                        isLight
                                          ? 'bg-[#FDF8F2] border-[#EDE2D3] hover:border-[#EA552E]'
                                          : 'bg-white/[0.02] border-white/10 hover:border-cyan-400'
                                      }`}
                                      title={`${latestActiveTask.ticketNumber} - ${latestActiveTask.partyName}`}
                                    >
                                      <span className={`font-mono font-bold mr-1.5 ${
                                        isLight ? 'text-[#EA552E]' : 'text-cyan-400'
                                      }`}>
                                        {latestActiveTask.ticketNumber}
                                      </span>
                                      <span className="truncate">{latestActiveTask.systemName}</span>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] italic text-emerald-500 font-medium">
                                      ✓ Available for tasks
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setViewingEmployee(emp)}
                                      title="View Full Details"
                                      className={`p-1.5 rounded-lg transition-colors border ${
                                        isLight
                                          ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#EA552E] border-[#EDE2D3]'
                                          : 'bg-white/5 hover:bg-white/10 text-cyan-400 border-white/10'
                                      }`}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openEditEmployeeModal(emp)}
                                      title="Edit Engineer"
                                      className={`p-1.5 rounded-lg transition-colors border ${
                                        isLight
                                          ? 'bg-white hover:bg-[#FDF8F2] text-[#8A7B68] hover:text-[#EA552E] border-[#EDE2D3]'
                                          : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/10'
                                      }`}
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                      title="Delete Engineer"
                                      className="p-1.5 rounded-lg transition-colors border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${companyViewMode === 'list'
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
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${companyViewMode === 'grid'
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

              {/* LIST VIEW (DEFAULT) */ }
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
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${compTasks.length > 0
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

              {/* GRID VIEW (Card View) */ }
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTask(null);
          }}
        >
          <div className={`w-full max-w-lg max-h-[88vh] flex flex-col border rounded-3xl shadow-2xl my-auto overflow-hidden ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b shrink-0 ${isLight ? 'border-[#EDE2D3] bg-[#FDFBF7]' : 'border-white/10 bg-white/[0.02]'}`}>
              <div>
                <span className={`font-mono font-bold text-xs ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>{selectedTask.ticketNumber}</span>
                <h3 className={`text-base font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{selectedTask.systemName}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className={`text-lg font-bold p-1.5 rounded-xl transition-colors cursor-pointer ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FDF3E7]' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                &times;
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {[
                  { label: 'Company:', value: selectedTask.partyName },
                  { label: 'Raised By:', value: selectedTask.personName },
                  { label: 'Type of Work:', value: selectedTask.typeOfWork },
                  { label: 'Expected Resolution Date:', value: formatDateDDMMYYYY(selectedTask.expectedDateToClose), mono: true },
                ].map((f, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-black/30 border-white/5'}`}>
                    <span className={`text-[10px] block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>{f.label}</span>
                    <div className={`font-bold truncate mt-0.5 ${f.mono ? 'font-mono' : ''} ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{f.value}</div>
                  </div>
                ))}
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Work Description
                </label>
                <div className={`p-3 border rounded-xl text-xs leading-relaxed max-h-28 overflow-y-auto ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#5C5244]' : 'bg-black/50 border-white/10 text-slate-200'}`}>
                  {selectedTask.descriptionOfWork}
                </div>
              </div>

              {selectedTask.uploadFileUrl && (
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>
                    <Paperclip className="w-3.5 h-3.5" />
                    Cloudinary Attachment / Uploaded File
                  </label>
                  <div className={`rounded-xl p-3 flex items-center justify-between gap-3 border ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3]' : 'bg-cyan-950/30 border-cyan-500/30'}`}>
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`p-2 rounded-lg border shrink-0 ${isLight ? 'bg-[#FDEEE7] border-[#F5D5C3] text-[#EA552E]' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                        <Paperclip className="w-3.5 h-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className={`text-xs font-bold truncate font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                          {selectedTask.uploadFileName || 'Uploaded Attachment'}
                        </div>
                        <div className={`text-[10px] truncate ${isLight ? 'text-[#8A7B68]' : 'text-cyan-400'}`}>
                          Cloudinary CDN: dfbllmnld / zentrixs
                        </div>
                      </div>
                    </div>
                    <a
                      href={selectedTask.uploadFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 text-white ${isLight ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-[#EA552E]/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/20'}`}
                    >
                      <span>Open in Cloudinary</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Completion Remark & Attachment Display */}
              {(selectedTask.completionRemark || selectedTask.completionFileUrl) && (
                <div className={`p-3.5 rounded-xl border space-y-2.5 ${isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completion & Resolution Proof</span>
                    </div>
                    {selectedTask.completedAt && (
                      <span className={`text-[10px] font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400/80'}`}>
                        {new Date(selectedTask.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {selectedTask.completionRemark && (
                    <p className={`text-xs leading-relaxed p-2.5 rounded-lg ${isLight ? 'bg-white/80 border border-emerald-100 text-emerald-950' : 'bg-black/30 border border-emerald-500/20 text-emerald-200'}`}>
                      {selectedTask.completionRemark}
                    </p>
                  )}

                  {/* Multiple Completion Proofs Gallery */}
                  {((selectedTask.completionFiles && selectedTask.completionFiles.length > 0) || selectedTask.completionFileUrl) && (
                    <div className="space-y-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                        Resolution Attachments & Proofs ({selectedTask.completionFiles?.length || 1})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedTask.completionFiles && selectedTask.completionFiles.length > 0 ? (
                          selectedTask.completionFiles.map((fileItem, idx) => (
                            <div
                              key={idx}
                              className={`rounded-lg p-2 flex items-center justify-between gap-2 border ${
                                isLight ? 'bg-white/90 border-emerald-200' : 'bg-black/40 border-emerald-500/30'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                                <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                                  <Paperclip className="w-3 h-3" />
                                </div>
                                <div className="overflow-hidden">
                                  <div className={`text-[11px] font-bold truncate font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                    {fileItem.name}
                                  </div>
                                  <div className="text-[8px] text-emerald-600 dark:text-emerald-400">
                                    Proof #{idx + 1}
                                  </div>
                                </div>
                              </div>
                              <a
                                href={fileItem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded text-[9px] font-bold text-white shrink-0 flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-sm"
                              >
                                <span>Open</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ))
                        ) : selectedTask.completionFileUrl ? (
                          <div className={`rounded-lg p-2 flex items-center justify-between gap-2 border ${
                            isLight ? 'bg-white/90 border-emerald-200' : 'bg-black/40 border-emerald-500/30'
                          }`}>
                            <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                              <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                                <Paperclip className="w-3 h-3" />
                              </div>
                              <div className="overflow-hidden">
                                <div className={`text-[11px] font-bold truncate font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                  {selectedTask.completionFileName || 'Completion Proof'}
                                </div>
                                <div className="text-[8px] text-emerald-600 dark:text-emerald-400">
                                  Uploaded resolution proof
                                </div>
                              </div>
                            </div>
                            <a
                              href={selectedTask.completionFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded text-[9px] font-bold text-white shrink-0 flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-sm"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
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
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
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
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>
                  Internal Engineer Notes & Resolution Remarks
                </label>
                <textarea
                  rows={2}
                  value={noteEdit}
                  onChange={(e) => setNoteEdit(e.target.value)}
                  placeholder="Add technical notes, git commit ref, or resolution comments..."
                  className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none transition-colors ${isLight ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' : 'bg-black/50 border-white/20 text-white focus:border-blue-500'}`}
                />
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className={`flex items-center justify-end gap-2.5 px-5 py-3.5 border-t shrink-0 ${isLight ? 'border-[#EDE2D3] bg-[#FDFBF7]' : 'border-white/10 bg-white/[0.02]'}`}>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Close
              </button>
              <button
                type="button"
                disabled={savingNote}
                onClick={handleSaveModal}
                className={`px-5 py-2 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 cursor-pointer ${isLight ? 'bg-[#EA552E] hover:bg-[#D9481F] shadow-md shadow-[#EA552E]/25' : 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30'}`}
              >
                {savingNote ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETION & RESOLUTION REMARK / ATTACHMENT MODAL */}
      {(completingTask || completingDelegation) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-xl border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl transition-all ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {completingDelegation ? completingDelegation.delegationNumber : completingTask?.ticketNumber}
                    </span>
                    <span className={`text-xs ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                      {completingDelegation ? `Assigned to ${completingDelegation.assignedTo}` : `for ${completingTask?.partyName}`}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    {completingDelegation ? 'Mark Delegation as Completed' : 'Mark Task as Completed'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCompletingTask(null);
                  setCompletingDelegation(null);
                  setCompletionFilesList([]);
                }}
                className={`text-lg font-bold p-2 ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConfirmCompletion} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${isLight ? 'text-[#8A7B68]' : 'text-slate-300'}`}>
                  <span>Resolution Remark / Work Done *</span>
                  <span className="text-[10px] lowercase font-normal opacity-75">
                    {completingDelegation ? '(Admin work verification)' : '(visible to client)'}
                  </span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={completionRemark}
                  onChange={(e) => setCompletionRemark(e.target.value)}
                  placeholder="Describe the solution, updates made, fixes implemented, or remarks..."
                  className={`w-full border rounded-2xl p-3 text-xs focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-emerald-500' 
                      : 'bg-black/50 border-white/20 text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${isLight ? 'text-[#8A7B68]' : 'text-slate-300'}`}>
                  <span>Resolution Proofs & Attachments (Multiple Files)</span>
                  <span className="text-[10px] lowercase font-normal opacity-75">(Images, Screenshots, PDFs, ZIPs)</span>
                </label>
                
                {/* Upload Box */}
                <div className={`p-4 border-2 border-dashed rounded-2xl transition-all ${
                  isLight ? 'border-[#EDE2D3] bg-[#FBF5EC]' : 'border-white/10 bg-black/30'
                }`}>
                  <input
                    type="file"
                    id="multiple-completion-files-input"
                    multiple
                    className="hidden"
                    onChange={handleMultipleCompletionFilesSelected}
                  />
                  <label
                    htmlFor="multiple-completion-files-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-2 text-center"
                  >
                    <UploadCloud className={`w-8 h-8 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                    <div className={`text-xs font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                      Click to upload one or multiple resolution screenshots / files
                    </div>
                    <div className={`text-[11px] ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                      Select multiple images, PDFs or documents simultaneously
                    </div>
                  </label>
                </div>

                {/* Selected Files List & Previews */}
                {completionFilesList.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                      Selected Files ({completionFilesList.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {completionFilesList.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden min-w-0">
                            {item.preview ? (
                              <img src={item.preview} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-emerald-500/30 shrink-0" />
                            ) : (
                              <Paperclip className="w-4 h-4 shrink-0" />
                            )}
                            <span className="font-mono font-bold truncate text-[11px]">{item.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCompletionFileItem(idx)}
                            className="text-[11px] font-bold text-red-500 hover:underline ml-2 shrink-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                isLight ? 'bg-amber-50/70 border-amber-200 text-amber-800' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Marking this as Completed will record the resolution remarks and all uploaded multiple proofs into database records.</span>
              </div>

              <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setCompletingTask(null);
                    setCompletingDelegation(null);
                    setCompletionFilesList([]);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCompletion || uploadingCompletionFile}
                  className="px-6 py-2.5 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-98 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  {savingCompletion || uploadingCompletionFile ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{uploadingCompletionFile ? 'Uploading Attachments...' : 'Completing...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Mark Completed</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DELEGATION DETAILS & PROOFS MODAL */}
      {selectedDelegation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  <ListTodo className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {selectedDelegation.delegationNumber}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${isLight ? 'bg-[#FDF3E7] text-[#EA552E] border-[#EDE2D3]' : 'bg-white/5 text-slate-300 border-white/10'}`}>
                      {selectedDelegation.category || 'Internal Task'}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mt-1 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    {selectedDelegation.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDelegation(null)}
                className={`text-lg font-bold p-2 ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Scope & Briefing */}
              {selectedDelegation.description && (
                <div className={`p-4 rounded-2xl border ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-white/[0.02] border-white/10'}`}>
                  <span className={`font-bold uppercase tracking-wider block mb-1.5 text-[10px] ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    Task Scope & Instructions:
                  </span>
                  <p className={`whitespace-pre-wrap leading-relaxed ${isLight ? 'text-[#2A2118]' : 'text-slate-200'}`}>
                    {selectedDelegation.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-black/30 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Assigned Engineer</span>
                  <span className={`font-bold text-xs mt-1 block truncate ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    {selectedDelegation.assignedTo}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-black/30 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Target Deadline</span>
                  <span className={`font-bold text-xs font-mono mt-1 block ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    {formatDateDDMMYYYY(selectedDelegation.targetDate)}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-black/30 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Priority</span>
                  <span className="font-bold text-xs mt-1 block text-amber-500">
                    {selectedDelegation.priority}
                  </span>
                </div>
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-black/30 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block ${isLight ? 'text-[#9C8F7D]' : 'text-slate-400'}`}>Status</span>
                  <span className={`font-bold text-xs mt-1 block ${selectedDelegation.status === 'Completed' ? 'text-emerald-500' : 'text-blue-400'}`}>
                    {selectedDelegation.status}
                  </span>
                </div>
              </div>

              {selectedDelegation.linkUrl && (
                <div className={`p-3 rounded-2xl border flex items-center justify-between ${isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-blue-950/20 border-blue-500/30'}`}>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Reference / Spec Link</span>
                  <a
                    href={selectedDelegation.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Resolution Proofs & Remarks */}
              {(selectedDelegation.completionRemark || selectedDelegation.completionFileUrl || (selectedDelegation.completionFiles && selectedDelegation.completionFiles.length > 0)) && (
                <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completion & Resolution Proofs</span>
                    </div>
                    {selectedDelegation.completedAt && (
                      <span className={`text-[10px] font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400/80'}`}>
                        {selectedDelegation.completedAt}
                      </span>
                    )}
                  </div>
                  {selectedDelegation.completionRemark && (
                    <p className={`text-xs leading-relaxed p-3 rounded-xl ${isLight ? 'bg-white/80 border border-emerald-100 text-emerald-950' : 'bg-black/30 border border-emerald-500/20 text-emerald-200'}`}>
                      {selectedDelegation.completionRemark}
                    </p>
                  )}

                  {/* Multiple Resolution Proofs Gallery */}
                  {((selectedDelegation.completionFiles && selectedDelegation.completionFiles.length > 0) || selectedDelegation.completionFileUrl) && (
                    <div className="space-y-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                        Resolution Attachments ({selectedDelegation.completionFiles?.length || 1})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedDelegation.completionFiles && selectedDelegation.completionFiles.length > 0 ? (
                          selectedDelegation.completionFiles.map((fileItem, idx) => (
                            <div
                              key={idx}
                              className={`rounded-xl p-2.5 flex items-center justify-between gap-2 border ${
                                isLight ? 'bg-white/90 border-emerald-200' : 'bg-black/40 border-emerald-500/30'
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                                  <Paperclip className="w-3.5 h-3.5" />
                                </div>
                                <div className="overflow-hidden">
                                  <div className={`text-xs font-bold truncate font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                    {fileItem.name}
                                  </div>
                                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400">
                                    Proof #{idx + 1}
                                  </div>
                                </div>
                              </div>
                              <a
                                href={fileItem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shrink-0 flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-sm"
                              >
                                <span>Open</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ))
                        ) : selectedDelegation.completionFileUrl ? (
                          <div className={`rounded-xl p-2.5 flex items-center justify-between gap-2 border ${
                            isLight ? 'bg-white/90 border-emerald-200' : 'bg-black/40 border-emerald-500/30'
                          }`}>
                            <div className="flex items-center gap-2 overflow-hidden min-w-0">
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                                <Paperclip className="w-3.5 h-3.5" />
                              </div>
                              <div className="overflow-hidden">
                                <div className={`text-xs font-bold truncate font-mono ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                  {selectedDelegation.completionFileName || 'Completion Proof'}
                                </div>
                              </div>
                            </div>
                            <a
                              href={selectedDelegation.completionFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shrink-0 flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-sm"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setSelectedDelegation(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Close
              </button>
              {selectedDelegation.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => {
                    const d = selectedDelegation;
                    setSelectedDelegation(null);
                    openDelegationCompletionModal(d);
                  }}
                  className="px-6 py-2.5 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Done with Proofs</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN NEW INTERNAL TASK / DELEGATION MODAL */}
      {showAddDelegationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className={`w-full max-w-2xl border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl my-auto ${
            isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  isLight ? 'bg-[#FDF3E7] border-[#EDE2D3] text-[#EA552E]' : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                }`}>
                  <ListTodo className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-mono font-bold text-[10px] tracking-widest uppercase ${
                    isLight ? 'text-[#D9481F]' : 'text-cyan-400'
                  }`}>
                    DIRECT TASK DELEGATION
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                    Assign Task to Employee / Engineer
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDelegationModal(false)}
                className={`text-2xl font-bold p-1 leading-none rounded-lg transition-colors ${
                  isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
                }`}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateDelegationTask} className="space-y-4 text-xs">
              {/* Task Title */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                  isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                }`}>
                  Task Title / Objective <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={delegationTitle}
                  onChange={(e) => setDelegationTitle(e.target.value)}
                  placeholder="e.g. Implement Multi-Factor Authentication (MFA) on ERP"
                  className={`w-full border rounded-xl px-4 py-3 font-semibold focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' 
                      : 'bg-black/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400'
                  }`}
                />
              </div>

              {/* Task Briefing / Scope */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                  isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                }`}>
                  Task Briefing & Detailed Instructions
                </label>
                <textarea
                  rows={3}
                  value={delegationDesc}
                  onChange={(e) => setDelegationDesc(e.target.value)}
                  placeholder="Write clear steps, requirements, deliverables, and acceptance criteria for the assigned engineer..."
                  className={`w-full border rounded-xl p-4 focus:outline-none transition-colors resize-none ${
                    isLight 
                      ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' 
                      : 'bg-black/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400'
                  }`}
                />
              </div>

              {/* Assignee & Deadline Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                    isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                  }`}>
                    Assign To Employee / Engineer <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={delegationAssignee}
                    onChange={(e) => setDelegationAssignee(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 font-semibold focus:outline-none cursor-pointer transition-colors ${
                      isLight 
                        ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'
                    }`}
                  >
                    <option value="">-- Select Engineer / Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.designation || emp.role || 'Engineer'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                    isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                  }`}>
                    Target Completion Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={delegationDeadline}
                    onChange={(e) => setDelegationDeadline(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 font-mono font-bold focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'
                    }`}
                  />
                </div>
              </div>

              {/* Priority & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                    isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                  }`}>
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={delegationPriority}
                    onChange={(e) => setDelegationPriority(e.target.value as TaskPriority)}
                    className={`w-full border rounded-xl px-4 py-3 font-semibold focus:outline-none cursor-pointer transition-colors ${
                      isLight 
                        ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] focus:border-[#EA552E]' 
                        : 'bg-black/50 border-white/10 text-white focus:border-cyan-400'
                    }`}
                  >
                    <option value="Urgent">🔥 Urgent / Critical</option>
                    <option value="High">⚡ High Priority</option>
                    <option value="Medium">⚖️ Medium Priority</option>
                    <option value="Low">🌱 Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                    isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                  }`}>
                    Category / Project Scope
                  </label>
                  <input
                    type="text"
                    value={delegationCategory}
                    onChange={(e) => setDelegationCategory(e.target.value)}
                    placeholder="e.g. Workflow Automation, Core API, UI/UX"
                    className={`w-full border rounded-xl px-4 py-3 font-semibold focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' 
                        : 'bg-black/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400'
                    }`}
                  />
                </div>
              </div>

              {/* Reference Link */}
              <div>
                <label className={`block font-bold mb-1.5 uppercase tracking-wider text-[11px] ${
                  isLight ? 'text-[#6B5D4A]' : 'text-slate-300'
                }`}>
                  Reference URL / Spec Link (Optional)
                </label>
                <input
                  type="url"
                  value={delegationLink}
                  onChange={(e) => setDelegationLink(e.target.value)}
                  placeholder="https://github.com/... or docs URL"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#B5A892] focus:border-[#EA552E]' 
                      : 'bg-black/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400'
                  }`}
                />
              </div>

              {/* Footer Actions */}
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setShowAddDelegationModal(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                    isLight ? 'text-[#9C8F7D] hover:text-[#2A2118] hover:bg-[#FBF5EC]' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDelegation}
                  className={`px-6 py-2.5 text-white rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-98 flex items-center gap-2 cursor-pointer ${
                    isLight 
                      ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-lg shadow-[#EA552E]/25' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25'
                  }`}
                >
                  {creatingDelegation ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Delegating Task...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Task to Employee</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto precision-scrollbar border rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
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
                    className={`relative w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl overflow-hidden border flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-all ${isLight ? 'border-[#EDE2D3] bg-[#FDF3E7] hover:border-[#EA552E]' : 'border-cyan-500/40 bg-[#162032] hover:border-cyan-400'
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLight
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
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
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
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${newEmpDesignation === role
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

      {/* VIEW ENGINEER / USER PROFILE DETAILS MODAL */}
      {viewingEmployee && (() => {
        const empTasks = tasks.filter((t) => (t.assignedTo || '').toLowerCase().trim() === viewingEmployee.name.toLowerCase().trim() || (t.assignedTo || '').toLowerCase().trim() === viewingEmployee.id.toLowerCase().trim());
        const empActive = empTasks.filter((t) => t.status !== 'Completed');
        const empCompleted = empTasks.filter((t) => t.status === 'Completed');

        return (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${isLight ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/85 backdrop-blur-md'} animate-in fade-in duration-200`}>
            <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl ${isLight ? 'bg-white border-[#EDE2D3] text-[#2A2118]' : 'bg-[#0F172A] border-white/20 text-white'}`}>

              {/* Profile Header & Large Avatar */}
              <div className={`flex items-start justify-between pb-5 border-b ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <div className="flex items-center gap-4">
                  <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 shadow-lg ${isLight ? 'border-[#EA552E]/30 bg-[#FDF3E7]' : 'border-cyan-400/40 bg-white/5'
                    }`}>
                    {viewingEmployee.avatar ? (
                      <img
                        src={viewingEmployee.avatar}
                        alt={viewingEmployee.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingEmployee.name)}&background=EA552E&color=fff&bold=true`;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center font-bold text-2xl ${isLight ? 'bg-gradient-to-br from-[#F0653A] to-[#D9481F] text-white' : 'bg-blue-600/30 text-blue-400'}`}>
                        {viewingEmployee.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                        {viewingEmployee.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        Active
                      </span>
                    </div>
                    <p className={`text-xs font-semibold flex items-center gap-1.5 mt-1 ${isLight ? 'text-[#D9481F]' : 'text-cyan-400'}`}>
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span>{viewingEmployee.designation || viewingEmployee.role}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${isLight ? 'bg-[#FDF3E7] text-[#6B5D4A]' : 'bg-white/5 text-slate-400'}`}>
                        ID: {viewingEmployee.id}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingEmployee(null)}
                  className={`text-2xl font-bold p-1 rounded-xl transition-colors ${isLight ? 'text-[#8A7B68] hover:text-[#2A2118] hover:bg-[#FDF3E7]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  &times;
                </button>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/30 border-white/5'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Phone Number</span>
                  <div className="flex items-center gap-2">
                    <Phone className={`w-3.5 h-3.5 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                    {viewingEmployee.phone ? (
                      <a href={`tel:${viewingEmployee.phone}`} className="font-mono font-bold hover:underline">
                        {viewingEmployee.phone}
                      </a>
                    ) : (
                      <span className="italic opacity-60">Not provided</span>
                    )}
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border space-y-1 ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/30 border-white/5'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Email Address</span>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Mail className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
                    {viewingEmployee.email ? (
                      <a href={`mailto:${viewingEmployee.email}`} className="font-medium hover:underline truncate">
                        {viewingEmployee.email}
                      </a>
                    ) : (
                      <span className="italic opacity-60">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Workload Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                  <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Total Tasks</div>
                  <div className={`text-2xl font-black mt-1 ${isLight ? 'text-[#0E7490]' : 'text-cyan-400'}`}>{empTasks.length}</div>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                  <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Active Backlog</div>
                  <div className="text-2xl font-black mt-1 text-amber-500">{empActive.length}</div>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'}`}>
                  <div className={`text-[10px] font-bold uppercase ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>Closed Done</div>
                  <div className="text-2xl font-black mt-1 text-emerald-500">{empCompleted.length}</div>
                </div>
              </div>

              {/* Assigned Tickets */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#8A7B68]' : 'text-slate-400'}`}>
                    Assigned Tickets ({empTasks.length})
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {empTasks.length === 0 ? (
                    <div className={`p-4 rounded-2xl border text-center text-xs italic ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3] text-[#8A7B68]' : 'bg-white/[0.02] border-white/5 text-slate-500'}`}>
                      No tickets currently assigned to this engineer.
                    </div>
                  ) : (
                    empTasks.map((t) => (
                      <div key={t.id} className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${isLight ? 'bg-[#FDF8F2] border-[#EDE2D3]' : 'bg-white/[0.02] border-white/5'}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono font-bold text-[11px] ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`}>{t.ticketNumber}</span>
                            <span className={`font-bold truncate ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{t.partyName}</span>
                          </div>
                          <div className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-[#6B5D4A]' : 'text-slate-400'}`}>{t.systemName} - {t.typeOfWork}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.priorityInCustomer === 'High' || t.priorityInCustomer === 'Urgent'
                            ? isLight ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isLight ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                            {t.priorityInCustomer}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.status === 'Completed'
                            ? isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'
                            : isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingEmployee;
                    setViewingEmployee(null);
                    openEditEmployeeModal(target);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${isLight
                    ? 'bg-[#FDF3E7] hover:bg-[#F7E8D4] text-[#2A2118] border-[#EDE2D3]'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingEmployee(null)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all text-white cursor-pointer ${isLight
                    ? 'bg-[#EA552E] hover:bg-[#D9481F] shadow-lg shadow-[#EA552E]/25'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30'
                    }`}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* EDIT ENGINEER / USER PROFILE MODAL */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto precision-scrollbar border rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'}`}>
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
                    className={`relative w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl overflow-hidden border flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-all ${isLight ? 'border-[#EDE2D3] bg-[#FDF3E7] hover:border-[#EA552E]' : 'border-cyan-500/40 bg-[#162032] hover:border-cyan-400'
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLight
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
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
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
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${editEmpDesignation === role
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

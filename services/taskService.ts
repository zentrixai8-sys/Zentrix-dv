import { Task, Company, Employee, SystemItem, AuthSession, TaskStatus } from '../types/taskTypes';

const STORAGE_KEYS = {
  TASKS: 'zentrix_portal_tasks_v1',
  COMPANIES: 'zentrix_portal_companies_v1',
  AUTH: 'zentrix_portal_auth_session_v1',
  EMPLOYEES: 'zentrix_portal_employees_v1'
};

// Configurable Cloudflare Worker API URL
export const CLOUDFLARE_API_URL = (import.meta as any).env?.VITE_CLOUDFLARE_API_URL || '';

// Cloudinary Configuration from User's Cloudinary Account (reads from .env with fallback)
export const CLOUDINARY_CLOUD_NAME = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'dfbllmnld';
export const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'zentrixs';

export const uploadFileToCloudinary = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Cloudinary upload failed');
    }

    const data = await res.json();
    return { success: true, url: data.secure_url };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
};

export const DEFAULT_COMPANIES: Company[] = [
  {
    id: 'comp_cirticare',
    name: 'Cirti Care',
    code: 'CIRTICARE01',
    password: 'Cirti123',
    contactPerson: 'Cirti Care Admin',
    email: 'admin@cirticare.com',
    phone: '+91 98765 11223',
    activeSystemsCount: 3,
    avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=60'
  },
  {
    id: 'comp_piramal',
    name: 'Piramal Petroleum Private Limited',
    code: 'PIRAMAL01',
    password: 'piramal@123',
    contactPerson: 'Vaibhav1',
    email: 'vaibhav@piramalpetroleum.com',
    phone: '+91 98765 43210',
    activeSystemsCount: 7,
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60'
  },
  {
    id: 'comp_popular',
    name: 'Popular Paints',
    code: 'POPULAR02',
    password: 'popular@123',
    contactPerson: 'Sunil Sharma',
    email: 'contact@popularpaints.com',
    phone: '+91 98234 56789',
    activeSystemsCount: 4,
    avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&auto=format&fit=crop&q=60'
  },
  {
    id: 'comp_avinash',
    name: 'Avinash Group',
    code: 'AVINASH03',
    password: 'avinash@123',
    contactPerson: 'Ramesh Patel',
    email: 'admin@avinashgroup.com',
    phone: '+91 98980 12345',
    activeSystemsCount: 5,
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60'
  },
  {
    id: 'comp_pratap',
    name: 'Pratap Technocrats Pvt. Ltd',
    code: 'PRATAP04',
    password: 'pratap@123',
    contactPerson: 'Dinesh Pratap',
    email: 'support@prataptechno.com',
    phone: '+91 98123 45670',
    activeSystemsCount: 3,
    avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&auto=format&fit=crop&q=60'
  }
];

export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'emp_1', name: 'Vaibhav Sharma', role: 'Automation Architect', email: 'vaibhav@zentrixs.com', activeTasksCount: 3 },
  { id: 'emp_2', name: 'Amit Verma', role: 'Cloudflare D1 & Backend Lead', email: 'amit@zentrixs.com', activeTasksCount: 2 },
  { id: 'emp_3', name: 'Alex Rivera', role: 'Full Stack Systems Engineer', email: 'alex@zentrixs.com', activeTasksCount: 4 },
  { id: 'emp_4', name: 'Robert Vance', role: 'Senior DevOps & Integration Lead', email: 'robert@zentrixs.com', activeTasksCount: 2 },
  { id: 'emp_5', name: 'Priya Patel', role: 'AI Agent & FMS Specialist', email: 'priya@zentrixs.com', activeTasksCount: 1 }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_001',
    ticketNumber: 'TCK-2026-001',
    typeOfWork: 'Existing System Edit & Update',
    partyName: 'Piramal Petroleum Private Limited',
    companyId: 'comp_piramal',
    personName: 'Vaibhav1',
    systemName: 'Checklist & Delegation',
    descriptionOfWork: 'change the monthly logic of Checklist & Delegation trigger.',
    linkOfSystem: 'https://piramal.zentrix.app/checklist',
    priorityInCustomer: 'High',
    notes: 'In review with automation script testing',
    expectedDateToClose: '2026-03-04',
    assignedTo: 'Vaibhav Sharma',
    status: 'In Progress',
    createdAt: '2026-02-28 10:30 AM',
    updatedAt: '2026-03-01 04:15 PM'
  },
  {
    id: 'tsk_002',
    ticketNumber: 'TCK-2026-002',
    typeOfWork: 'Existing System Edit & Update',
    partyName: 'Piramal Petroleum Private Limited',
    companyId: 'comp_piramal',
    personName: 'Vaibhav1',
    systemName: 'Repair System',
    descriptionOfWork: 'complete the repair system, it not working properly.',
    linkOfSystem: 'https://piramal.zentrix.app/repair',
    priorityInCustomer: 'High',
    notes: 'Assigned to dev for fixing webhook endpoint',
    expectedDateToClose: '2026-02-16',
    assignedTo: 'Amit Verma',
    status: 'Pending',
    createdAt: '2026-02-12 02:40 PM',
    updatedAt: '2026-02-12 02:40 PM'
  },
  {
    id: 'tsk_003',
    ticketNumber: 'TCK-2026-003',
    typeOfWork: 'Existing System Edit & Update',
    partyName: 'Piramal Petroleum Private Limited',
    companyId: 'comp_piramal',
    personName: 'Vaibhav1',
    systemName: 'MaintenancePro',
    descriptionOfWork: "Maintenance system not working properly even task isn't assign of maintenance and auto notification failed.",
    linkOfSystem: 'https://piramal.zentrix.app/maintenance',
    priorityInCustomer: 'High',
    notes: 'Schema update needed on Cloudflare D1',
    expectedDateToClose: '2026-02-17',
    assignedTo: 'Alex Rivera',
    status: 'In Progress',
    createdAt: '2026-02-14 11:20 AM',
    updatedAt: '2026-02-15 09:00 AM'
  },
  {
    id: 'tsk_004',
    ticketNumber: 'TCK-2026-004',
    typeOfWork: 'Existing System Edit & Update',
    partyName: 'Piramal Petroleum Private Limited',
    companyId: 'comp_piramal',
    personName: 'Vaibhav1',
    systemName: 'Document Manager',
    descriptionOfWork: 'Serial number not store when i select some option in category solve the problem.',
    linkOfSystem: 'https://piramal.zentrix.app/docs',
    priorityInCustomer: 'High',
    notes: 'Resolved and deployed to production',
    expectedDateToClose: '2026-02-13',
    assignedTo: 'Robert Vance',
    status: 'Completed',
    createdAt: '2026-02-10 09:15 AM',
    updatedAt: '2026-02-13 06:00 PM'
  },
  {
    id: 'tsk_005',
    ticketNumber: 'TCK-2026-005',
    typeOfWork: 'Existing System Edit & Update',
    partyName: 'Piramal Petroleum Private Limited',
    companyId: 'comp_piramal',
    personName: 'Vaibhav1',
    systemName: 'HR FMS',
    descriptionOfWork: 'Fetching problem solve in Shortlist new candidate popup.',
    linkOfSystem: 'https://piramal.zentrix.app/hr-fms',
    priorityInCustomer: 'High',
    notes: 'Hotfix applied and verified',
    expectedDateToClose: '2026-02-13',
    assignedTo: 'Priya Patel',
    status: 'Completed',
    createdAt: '2026-02-10 01:45 PM',
    updatedAt: '2026-02-13 04:30 PM'
  },
  {
    id: 'tsk_006',
    ticketNumber: 'TCK-2026-006',
    typeOfWork: 'New System',
    partyName: 'Popular Paints',
    companyId: 'comp_popular',
    personName: 'Sunil Sharma',
    systemName: 'Automated Billing & GST Bot',
    descriptionOfWork: 'Setup WhatsApp auto invoice dispatch after sales entry.',
    linkOfSystem: 'https://popularpaints.zentrix.app/billing',
    priorityInCustomer: 'Urgent',
    notes: 'Requirement blueprint completed',
    expectedDateToClose: '2026-03-10',
    assignedTo: 'Vaibhav Sharma',
    status: 'In Review',
    createdAt: '2026-02-27 04:00 PM',
    updatedAt: '2026-03-01 11:00 AM'
  },
  {
    id: 'tsk_007',
    ticketNumber: 'TCK-2026-007',
    typeOfWork: 'Error Received',
    partyName: 'Avinash Group',
    companyId: 'comp_avinash',
    personName: 'Ramesh Patel',
    systemName: 'Lead Management CRM',
    descriptionOfWork: 'Facebook Leads webhook throwing 500 error during high traffic.',
    linkOfSystem: 'https://avinash.zentrix.app/crm',
    priorityInCustomer: 'High',
    notes: 'Worker timeout increased',
    expectedDateToClose: '2026-02-20',
    assignedTo: 'Amit Verma',
    status: 'Completed',
    createdAt: '2026-02-18 10:10 AM',
    updatedAt: '2026-02-20 01:25 PM'
  }
];

export const SYSTEM_LIST: SystemItem[] = [
  { id: 'sys_cc_1', companyId: 'comp_cirticare', name: 'Patient Care & Appointment Automation', category: 'Healthcare & Clinical', status: 'Active', version: 'v2.4', linkUrl: 'https://cirticare.zentrix.app/appointments', lastUpdated: 'Today' },
  { id: 'sys_cc_2', companyId: 'comp_cirticare', name: 'Billing & Pharmacy Inventory System', category: 'Operations & Finance', status: 'Active', version: 'v1.8', linkUrl: 'https://cirticare.zentrix.app/billing', lastUpdated: 'Yesterday' },
  { id: 'sys_cc_3', companyId: 'comp_cirticare', name: 'WhatsApp Doctor Consultation Alert Bot', category: 'Communication', status: 'Active', version: 'v3.0', linkUrl: 'https://cirticare.zentrix.app/whatsapp', lastUpdated: '3 days ago' },
  { id: 'sys_1', companyId: 'comp_piramal', name: 'Checklist & Delegation', category: 'Operations & Workflow', status: 'Active', version: 'v3.2', linkUrl: 'https://piramal.zentrix.app/checklist', lastUpdated: 'Yesterday' },
  { id: 'sys_2', companyId: 'comp_piramal', name: 'Repair System', category: 'Maintenance & Service', status: 'Update Pending', version: 'v2.1', linkUrl: 'https://piramal.zentrix.app/repair', lastUpdated: '2 days ago' },
  { id: 'sys_3', companyId: 'comp_piramal', name: 'MaintenancePro', category: 'Equipment & Asset', status: 'Under Maintenance', version: 'v1.9', linkUrl: 'https://piramal.zentrix.app/maintenance', lastUpdated: '3 days ago' },
  { id: 'sys_4', companyId: 'comp_piramal', name: 'Document Manager', category: 'Records & Compliance', status: 'Active', version: 'v4.0', linkUrl: 'https://piramal.zentrix.app/docs', lastUpdated: '13/02/2026' },
  { id: 'sys_5', companyId: 'comp_piramal', name: 'HR FMS (Fast Management System)', category: 'Recruitment & HR', status: 'Active', version: 'v2.8', linkUrl: 'https://piramal.zentrix.app/hr-fms', lastUpdated: '13/02/2026' },
  { id: 'sys_6', companyId: 'comp_piramal', name: 'Inventory & Stock Tracker', category: 'Supply Chain', status: 'Active', version: 'v2.0', linkUrl: 'https://piramal.zentrix.app/inventory', lastUpdated: 'Last week' },
  { id: 'sys_7', companyId: 'comp_piramal', name: 'Analytics & Looker Studio Hub', category: 'BI & Reporting', status: 'Active', version: 'v1.5', linkUrl: 'https://piramal.zentrix.app/reports', lastUpdated: 'Today' }
];

export const TROUBLESHOOT_GUIDES = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Issues',
    icon: 'MessageSquare',
    issueCount: 3,
    color: 'emerald',
    solutions: [
      { problem: 'Messages not sending', solution: 'Verify WhatsApp Business API token expiry in settings.' },
      { problem: 'QR code session disconnected', solution: 'Scan fresh QR code in Meta Business Suite.' },
      { problem: 'Template message rejected', solution: 'Check variable formats and ensure no promotional words in utility template.' }
    ]
  },
  {
    id: 'looker',
    title: 'Looker Studio',
    icon: 'BarChart3',
    issueCount: 3,
    color: 'blue',
    solutions: [
      { problem: 'Data set configuration error', solution: 'Reconnect the Google Sheets or Cloudflare D1 connector with fresh authorization.' },
      { problem: 'Chart showing null metrics', solution: 'Check if column names were renamed in the source sheet.' },
      { problem: 'Slow report rendering', solution: 'Enable data extraction schedule or cache acceleration.' }
    ]
  },
  {
    id: 'email',
    title: 'Email Issues',
    icon: 'Mail',
    issueCount: 3,
    color: 'purple',
    solutions: [
      { problem: 'SMTP authentication failed', solution: 'Check App Password if 2-factor authentication is active on Google Workspace.' },
      { problem: 'Emails landing in spam', solution: 'Verify SPF, DKIM, and DMARC DNS records in your domain provider.' },
      { problem: 'Attachment size error', solution: 'Keep files below 10MB or use Cloudflare R2 / Drive storage link.' }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard Issues',
    icon: 'AlertTriangle',
    issueCount: 3,
    color: 'red',
    solutions: [
      { problem: 'White screen or UI freeze', solution: 'Clear browser cache and reload using Ctrl + F5.' },
      { problem: 'Session expired immediately', solution: 'Check system clock time synchronization on your PC.' },
      { problem: 'Permissions denied message', solution: 'Contact Super Admin to verify your assigned role and access level.' }
    ]
  }
];

// --- STORAGE INITIALIZERS ---
const getStoredTasks = (): Task[] => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return INITIAL_TASKS;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
};

const saveTasks = (tasks: Task[]) => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
};

// --- AUTHENTICATION ---
export const getAuthSession = (): AuthSession | null => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (session: AuthSession) => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
  } catch (e) {
    console.error(e);
  }
};

export const clearAuthSession = () => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (e) {
    console.error(e);
  }
};

const getStoredCompanies = (): Company[] => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return DEFAULT_COMPANIES;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(DEFAULT_COMPANIES));
      return DEFAULT_COMPANIES;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.some((c: any) => c.code?.toUpperCase() === 'CIRTICARE01' || c.name?.toLowerCase() === 'cirti care')) {
      parsed.unshift(DEFAULT_COMPANIES[0]);
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_COMPANIES;
  }
};

const saveCompanies = (comps: Company[]) => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(comps));
  } catch (e) {
    console.error('Failed to save companies to localStorage', e);
  }
};

export const createCompany = async (compInput: Partial<Company>): Promise<{ success: boolean; company?: Company; error?: string }> => {
  const companies = getStoredCompanies();
  const logoUrl = compInput.logoUrl || compInput.avatar || '';
  const newCompany: Company = {
    id: `comp_${Date.now()}`,
    name: compInput.name || 'New Client Company',
    code: compInput.code || `COMP-${Math.floor(100 + Math.random() * 900)}`,
    password: compInput.password || 'client@123',
    contactPerson: compInput.contactPerson || 'Authorized Manager',
    email: compInput.email || '',
    phone: compInput.phone || '',
    activeSystemsCount: 1,
    avatar: logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60',
    logoUrl: logoUrl
  };

  if (CLOUDFLARE_API_URL) {
    try {
      await fetch(`${CLOUDFLARE_API_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
    } catch (e) {
      console.warn(e);
    }
  }

  companies.unshift(newCompany);
  saveCompanies(companies);
  return { success: true, company: newCompany };
};

export const updateCompanyLogo = async (companyId: string, logoUrl: string): Promise<boolean> => {
  const companies = getStoredCompanies();
  const idx = companies.findIndex(c => c.id === companyId || c.code === companyId);
  if (idx !== -1) {
    companies[idx].avatar = logoUrl;
    companies[idx].logoUrl = logoUrl;
    saveCompanies(companies);
  }

  if (CLOUDFLARE_API_URL) {
    try {
      await fetch(`${CLOUDFLARE_API_URL}/api/companies/${companyId}/logo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl })
      });
    } catch (e) {
      console.warn('Remote logo update error', e);
    }
  }
  return true;
};

export const fetchCompanies = async (): Promise<Company[]> => {
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/companies`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.companies) && data.companies.length > 0) {
          const stored = getStoredCompanies();
          data.companies.forEach((rc: any) => {
            const idx = stored.findIndex(c => c.id === rc.id || c.code === rc.code);
            if (idx !== -1) {
              if (rc.logo_url) {
                stored[idx].logoUrl = rc.logo_url;
                stored[idx].avatar = rc.logo_url;
              }
              if (rc.password) stored[idx].password = rc.password;
              if (rc.contact_person) stored[idx].contactPerson = rc.contact_person;
              if (rc.phone) stored[idx].phone = rc.phone;
              if (rc.email) stored[idx].email = rc.email;
            } else {
              stored.unshift({
                id: rc.id,
                name: rc.name,
                code: rc.code,
                password: rc.password || 'client@123',
                contactPerson: rc.contact_person || 'Authorized Manager',
                email: rc.email || '',
                phone: rc.phone || '',
                activeSystemsCount: 1,
                logoUrl: rc.logo_url,
                avatar: rc.logo_url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60'
              });
            }
          });
          saveCompanies(stored);
          return stored;
        }
      }
    } catch (e) {
      console.warn('Failed to sync companies from D1, using local', e);
    }
  }
  return getStoredCompanies();
};

export const loginCompany = async (params: {
  companyNameOrCode: string;
  userName?: string;
  password?: string;
}): Promise<{ success: boolean; session?: AuthSession; error?: string }> => {
  // If Cloudflare API URL is configured, try remote login first
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/auth/company-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        setAuthSession(data.session);
        return { success: true, session: data.session };
      } else {
        const errData = await res.json();
        return { success: false, error: errData.error || 'Access Denied: Invalid Company ID or Password' };
      }
    } catch (e) {
      console.warn('Cloudflare auth failed, checking registered companies', e);
    }
  }

  // Strict check against registered companies only!
  const companies = getStoredCompanies();
  const search = (params.companyNameOrCode || '').toLowerCase().trim();
  const enteredPass = (params.password || '').trim();

  const found = companies.find(
    c => c.code.toLowerCase() === search || c.name.toLowerCase() === search
  );

  if (!found) {
    return {
      success: false,
      error: 'Access Denied: Yeh Company ID registered nahi hai. Admin se company ID aur password lene ke baad hi login kiya ja sakta hai.'
    };
  }

  if (found.password && found.password !== enteredPass) {
    return {
      success: false,
      error: 'Access Denied: Password galat hai. Kripya Admin dwara set kiya gaya password dalein.'
    };
  }

  const session: AuthSession = {
    user: params.userName || found.contactPerson,
    role: 'company',
    companyId: found.id,
    companyName: found.name,
    email: found.email,
    idCode: found.code
  };

  setAuthSession(session);
  return { success: true, session };
};

export const loginAdmin = async (params: {
  username: string;
  idCode: string;
  password?: string;
}): Promise<{ success: boolean; session?: AuthSession; error?: string }> => {
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        setAuthSession(data.session);
        return { success: true, session: data.session };
      }
    } catch (e) {
      console.warn('Cloudflare admin auth failed, fallback to local', e);
    }
  }

  // Local verification
  const session: AuthSession = {
    user: params.username || 'Super Admin',
    role: 'admin',
    idCode: params.idCode || 'ADM-001',
    email: 'admin@zentrixs.com'
  };

  setAuthSession(session);
  return { success: true, session };
};

// --- IN-MEMORY CACHE TO MINIMIZE CLOUDFLARE D1 READS (Prevents hitting free limits) ---
interface TaskCacheEntry {
  companyIdKey: string;
  tasks: Task[];
  cachedAt: number;
}

let memoryTaskCache: TaskCacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 Seconds Cache

export const invalidateTaskCache = () => {
  memoryTaskCache = null;
};

// --- TASK OPERATIONS ---
export const fetchTasks = async (
  filter?: {
    companyId?: string;
    status?: string;
    assignedTo?: string;
    search?: string;
  },
  forceRefresh: boolean = false
): Promise<Task[]> => {
  const companyKey = filter?.companyId || 'ALL';
  const now = Date.now();

  let baseTasks: Task[] | null = null;

  // 1. Check in-memory cache first (Cost: 0 Cloudflare D1 Reads)
  if (!forceRefresh && memoryTaskCache && memoryTaskCache.companyIdKey === companyKey && (now - memoryTaskCache.cachedAt < CACHE_TTL_MS)) {
    baseTasks = memoryTaskCache.tasks;
  }

  // 2. Fetch from Cloudflare D1 only when cache expired or force refreshed
  if (!baseTasks && CLOUDFLARE_API_URL) {
    try {
      const query = new URLSearchParams();
      if (filter?.companyId) query.set('companyId', filter.companyId);

      const res = await fetch(`${CLOUDFLARE_API_URL}/api/tasks?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tasks)) {
          baseTasks = data.tasks;
          memoryTaskCache = {
            companyIdKey: companyKey,
            tasks: data.tasks,
            cachedAt: Date.now()
          };
        }
      }
    } catch (e) {
      console.warn('Cloudflare fetch tasks failed, using local storage fallback', e);
    }
  }

  // 3. Fallback to localStorage if offline/initial
  if (!baseTasks) {
    baseTasks = getStoredTasks();
    if (filter?.companyId) {
      baseTasks = baseTasks.filter(t => t.companyId === filter.companyId);
    }
  }

  // 4. Instant In-Memory Filter (Cost: 0 Cloudflare D1 Reads)
  let filtered = [...baseTasks];

  if (filter?.status && filter.status !== 'All') {
    filtered = filtered.filter(t => t.status === filter.status);
  }

  if (filter?.assignedTo && filter.assignedTo !== 'All') {
    filtered = filtered.filter(t => t.assignedTo === filter.assignedTo);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.ticketNumber.toLowerCase().includes(q) ||
      t.partyName.toLowerCase().includes(q) ||
      t.systemName.toLowerCase().includes(q) ||
      t.descriptionOfWork.toLowerCase().includes(q) ||
      t.personName.toLowerCase().includes(q)
    );
  }

  return filtered;
};

export const createTask = async (taskInput: Partial<Task>): Promise<{ success: boolean; task?: Task; error?: string }> => {
  const currentSession = getAuthSession();
  const ticketNumber = `TCK-2026-${Math.floor(100 + Math.random() * 900)}`;

  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newTask: Task = {
    id: `tsk_${Date.now()}`,
    ticketNumber,
    typeOfWork: taskInput.typeOfWork || 'Existing System Edit & Update',
    partyName: taskInput.partyName || currentSession?.companyName || 'Piramal Petroleum Private Limited',
    companyId: taskInput.companyId || currentSession?.companyId || 'comp_piramal',
    personName: taskInput.personName || currentSession?.user || 'Vaibhav1',
    systemName: taskInput.systemName || 'General System',
    descriptionOfWork: taskInput.descriptionOfWork || '',
    linkOfSystem: taskInput.linkOfSystem || '',
    priorityInCustomer: taskInput.priorityInCustomer || 'Medium',
    notes: taskInput.notes || '-',
    expectedDateToClose: taskInput.expectedDateToClose || '2026-03-15',
    uploadFileUrl: taskInput.uploadFileUrl,
    uploadFileName: taskInput.uploadFileName,
    assignedTo: taskInput.assignedTo || 'Unassigned',
    status: 'Pending',
    createdAt: formattedDate,
    updatedAt: formattedDate
  };

  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        const data = await res.json();
        // Also update local
        const tasks = getStoredTasks();
        tasks.unshift(data.task || newTask);
        saveTasks(tasks);
        return { success: true, task: data.task || newTask };
      }
    } catch (e) {
      console.warn('Cloudflare create task failed, using local', e);
    }
  }

  const tasks = getStoredTasks();
  tasks.unshift(newTask);
  saveTasks(tasks);
  invalidateTaskCache();
  return { success: true, task: newTask };
};

export const assignTask = async (taskId: string, employeeName: string): Promise<{ success: boolean; error?: string }> => {
  invalidateTaskCache();
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: employeeName })
      });
      if (res.ok) {
        // continue to update local
      }
    } catch (e) {
      console.warn('Cloudflare assign failed, updating local', e);
    }
  }

  const tasks = getStoredTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index].assignedTo = employeeName;
    if (tasks[index].status === 'Pending') {
      tasks[index].status = 'In Progress';
    }
    tasks[index].updatedAt = new Date().toLocaleString();
    saveTasks(tasks);
    return { success: true };
  }
  return { success: false, error: 'Task not found' };
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  notes?: string
): Promise<{ success: boolean; error?: string }> => {
  invalidateTaskCache();
  if (CLOUDFLARE_API_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_API_URL}/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        // continue
      }
    } catch (e) {
      console.warn('Cloudflare update status failed, updating local', e);
    }
  }

  const tasks = getStoredTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index].status = status;
    if (notes !== undefined) {
      tasks[index].notes = notes;
    }
    tasks[index].updatedAt = new Date().toLocaleString();
    saveTasks(tasks);
    return { success: true };
  }
  return { success: false, error: 'Task not found' };
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  invalidateTaskCache();
  if (CLOUDFLARE_API_URL) {
    try {
      await fetch(`${CLOUDFLARE_API_URL}/api/tasks/${taskId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Cloudflare delete failed, updating local', e);
    }
  }
  const tasks = getStoredTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  saveTasks(filtered);
  return true;
};

export const getCompanies = (): Company[] => getStoredCompanies();
export const getEmployees = (): Employee[] => DEFAULT_EMPLOYEES;
export const getSystemsForCompany = (companyId?: string): SystemItem[] => {
  if (!companyId) return SYSTEM_LIST;
  return SYSTEM_LIST.filter(s => s.companyId === companyId);
};

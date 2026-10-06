export type WorkType = 
  | 'Complain Report' 
  | 'Error Received' 
  | 'Existing System Edit & Update' 
  | 'New System';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskStatus = 'Pending' | 'In Progress' | 'In Review' | 'Completed' | 'Rejected';

export interface Task {
  id: string;
  ticketNumber: string;
  typeOfWork: WorkType;
  partyName: string; // Company Name
  companyId: string;
  personName: string;
  systemName: string;
  descriptionOfWork: string;
  linkOfSystem?: string;
  priorityInCustomer: TaskPriority;
  notes?: string;
  expectedDateToClose: string;
  uploadFileUrl?: string;
  uploadFileName?: string;
  uploadFiles?: { name: string; url: string }[];
  assignedTo?: string; // Zentrix employee / engineer
  status: TaskStatus;
  completionRemark?: string;
  completionFileUrl?: string;
  completionFileName?: string;
  completionFiles?: { name: string; url: string }[];
  completedAt?: string;
  isDelegation?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  code: string; // Company ID / Login Code
  password?: string; // Company Password assigned by Admin
  contactPerson: string;
  email?: string;
  phone?: string;
  activeSystemsCount: number;
  avatar?: string;
  logoUrl?: string;
}

export interface SystemItem {
  id: string;
  companyId: string;
  name: string;
  category: string;
  status: 'Active' | 'Under Maintenance' | 'Update Pending';
  version: string;
  linkUrl: string;
  lastUpdated: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  designation?: string;
  email?: string;
  phone?: string;
  activeTasksCount?: number;
  avatar?: string;
  createdAt?: string;
}

export interface AuthSession {
  user: string;
  role: 'admin' | 'company' | 'employee';
  companyId?: string;
  companyName?: string;
  email?: string;
  idCode?: string;
}

export interface Delegation {
  id: string;
  delegationNumber: string; // e.g. DLG-2026-101
  title: string;
  description: string;
  assignedTo: string; // Zentrix Employee / Engineer Name
  assignedBy?: string; // Admin / Super Admin
  category?: string; // Workflow Automation, UI/UX, Bug Fix, etc.
  priority: TaskPriority; // 'Low' | 'Medium' | 'High' | 'Urgent'
  targetDate: string; // Expected completion date (YYYY-MM-DD)
  linkUrl?: string; // Reference Link / Specification
  status: TaskStatus; // 'Pending' | 'In Progress' | 'In Review' | 'Completed' | 'Rejected'
  completionRemark?: string;
  completionFileUrl?: string;
  completionFileName?: string;
  completionFiles?: { name: string; url: string }[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

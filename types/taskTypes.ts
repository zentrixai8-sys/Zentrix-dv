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
  assignedTo?: string; // Zentrix employee / engineer
  status: TaskStatus;
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

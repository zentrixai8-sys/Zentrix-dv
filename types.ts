
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  postedAt: string;
  description: string;
  category: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  details: string;
  specs: string[];
  implementation: string;
}

export interface NavItem {
  label: string;
  href: string;
}

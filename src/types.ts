export type Role = string;

export interface Employee {
  id: string;
  name: string;
  role: Role;
  department: string;
  joinDate: string;
  contact: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface FinanceRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  managerId: string;
  deadline: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number;
}

export interface DailyProduction {
  id: string;
  date: string;
  employeeId: string;
  interviewsDone?: number; // For Agents
  namesCollected?: number; // For Agents
  interviewsProcessed?: number; // For Data Entry
  namesInserted?: number; // For Data Entry
}

export interface Goal {
  id: string;
  employeeId: string;
  type: 'DAILY' | 'MONTHLY';
  metricName: string;
  targetValue: number;
  unit: string;
}

export interface AppState {
  employees: Employee[];
  finance: FinanceRecord[];
  projects: Project[];
  production: DailyProduction[];
  goals: Goal[];
}

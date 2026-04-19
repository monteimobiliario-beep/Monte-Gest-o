import { Employee, FinanceRecord, Project, DailyProduction, Goal } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Admin User', role: 'ADMIN', department: 'Management', joinDate: '2023-01-01', contact: 'admin@company.com', status: 'ACTIVE' },
  { id: '2', name: 'João Silva', role: 'AGENT', department: 'Field Operations', joinDate: '2023-05-10', contact: 'joao@company.com', status: 'ACTIVE' },
  { id: '3', name: 'Maria Santos', role: 'DATA_ENTRY', department: 'Processing', joinDate: '2023-06-15', contact: 'maria@company.com', status: 'ACTIVE' },
  { id: '4', name: 'Carlos Oliveira', role: 'SUPERVISOR', department: 'Field Operations', joinDate: '2023-02-20', contact: 'carlos@company.com', status: 'ACTIVE' },
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: '1', type: 'INCOME', category: 'Project A', amount: 5000, date: '2024-03-01', description: 'Initial payment' },
  { id: '2', type: 'EXPENSE', category: 'Office', amount: 1200, date: '2024-03-05', description: 'Monthly rent' },
  { id: '3', type: 'EXPENSE', category: 'Salaries', amount: 3000, date: '2024-03-10', description: 'Team salaries' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'Censo Regional 2024', managerId: '4', deadline: '2024-12-31', status: 'IN_PROGRESS', progress: 45 },
  { id: '2', name: 'Pesquisa de Mercado', managerId: '4', deadline: '2024-06-30', status: 'DELAYED', progress: 20 },
];

export const MOCK_PRODUCTION: DailyProduction[] = [
  { id: '1', date: '2024-03-20', employeeId: '2', interviewsDone: 15, namesCollected: 45 },
  { id: '2', date: '2024-03-20', employeeId: '3', interviewsProcessed: 10, namesInserted: 30 },
];

export const MOCK_GOALS: Goal[] = [
  { id: '1', employeeId: '2', type: 'DAILY', metricName: 'Entrevistas', targetValue: 20, unit: 'unid' },
  { id: '2', employeeId: '3', type: 'DAILY', metricName: 'Processamento', targetValue: 15, unit: 'unid' },
];

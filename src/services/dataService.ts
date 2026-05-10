import { Employee, FinanceRecord, Project, DailyProduction, Goal } from '../types';
import { 
  MOCK_EMPLOYEES, 
  MOCK_FINANCE, 
  MOCK_PROJECTS, 
  MOCK_PRODUCTION, 
  MOCK_GOALS 
} from '../constants';

const DEPARTMENTS = ["Operacional", "Administrativo", "Gestão", "RH", "Financeiro", "Field Operations", "Processing", "Management"];
const ROLES = ["Administrador", "Agente de Campo", "Entrada de Dados", "Supervisor", "Coordenador", "Gestor de Projeto", "RH", "Financeiro"];

const STORAGE_KEYS = {
  EMPLOYEES: 'chaisa_employees',
  FINANCE: 'chaisa_finance',
  PROJECTS: 'chaisa_projects',
  PRODUCTION: 'chaisa_production',
  GOALS: 'chaisa_goals',
  PERMISSIONS: 'chaisa_permissions',
  ROLES: 'chaisa_config_roles',
  DEPARTMENTS: 'chaisa_config_departments'
};

// Helper para gerenciar o LocalStorage
const getStoredData = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error(`Erro ao ler ${key} do LocalStorage:`, e);
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dataService = {
  // Employees
  async getEmployees(): Promise<Employee[]> {
    return getStoredData(STORAGE_KEYS.EMPLOYEES, MOCK_EMPLOYEES);
  },
  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const employees = await this.getEmployees();
    const newEmployee = { ...employee, id: crypto.randomUUID() } as Employee;
    setStoredData(STORAGE_KEYS.EMPLOYEES, [...employees, newEmployee]);
    return newEmployee;
  },
  async updateEmployee(employee: Employee): Promise<Employee> {
    const employees = await this.getEmployees();
    const updated = employees.map(e => e.id === employee.id ? employee : e);
    setStoredData(STORAGE_KEYS.EMPLOYEES, updated);
    return employee;
  },
  async deleteEmployee(id: string): Promise<void> {
    const employees = await this.getEmployees();
    setStoredData(STORAGE_KEYS.EMPLOYEES, employees.filter(e => e.id !== id));
  },

  // Finance
  async getFinanceRecords(): Promise<FinanceRecord[]> {
    return getStoredData(STORAGE_KEYS.FINANCE, MOCK_FINANCE);
  },
  async createFinanceRecord(record: Omit<FinanceRecord, 'id'>): Promise<FinanceRecord> {
    const records = await this.getFinanceRecords();
    const newRecord = { ...record, id: crypto.randomUUID() } as FinanceRecord;
    setStoredData(STORAGE_KEYS.FINANCE, [newRecord, ...records]);
    return newRecord;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return getStoredData(STORAGE_KEYS.PROJECTS, MOCK_PROJECTS);
  },
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const projects = await this.getProjects();
    const newProject = { ...project, id: crypto.randomUUID() } as Project;
    setStoredData(STORAGE_KEYS.PROJECTS, [...projects, newProject]);
    return newProject;
  },
  async updateProject(project: Project): Promise<Project> {
    const projects = await this.getProjects();
    const updated = projects.map(p => p.id === project.id ? project : p);
    setStoredData(STORAGE_KEYS.PROJECTS, updated);
    return project;
  },
  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects();
    setStoredData(STORAGE_KEYS.PROJECTS, projects.filter(p => p.id !== id));
  },

  // Production
  async getProduction(): Promise<DailyProduction[]> {
    return getStoredData(STORAGE_KEYS.PRODUCTION, MOCK_PRODUCTION);
  },
  async createProduction(production: Omit<DailyProduction, 'id'>): Promise<DailyProduction> {
    const records = await this.getProduction();
    const newRecord = { ...production, id: crypto.randomUUID() } as DailyProduction;
    setStoredData(STORAGE_KEYS.PRODUCTION, [newRecord, ...records]);
    return newRecord;
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    return getStoredData(STORAGE_KEYS.GOALS, MOCK_GOALS);
  },
  async updateGoal(goal: Goal): Promise<Goal> {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index === -1) {
      setStoredData(STORAGE_KEYS.GOALS, [...goals, goal]);
    } else {
      const updated = goals.map(g => g.id === goal.id ? goal : g);
      setStoredData(STORAGE_KEYS.GOALS, updated);
    }
    return goal;
  },

  // Permissions
  async getPermissions(): Promise<Record<string, string[]>> {
    const defaultPermissions: Record<string, string[]> = {};
    return getStoredData(STORAGE_KEYS.PERMISSIONS, defaultPermissions);
  },
  async updatePermissions(role: string, permissions: string[]): Promise<void> {
    const allPermissions = await this.getPermissions();
    allPermissions[role] = permissions;
    setStoredData(STORAGE_KEYS.PERMISSIONS, allPermissions);
  },

  // Config (Roles/Departments)
  async getConfig(key: string): Promise<string[]> {
    if (key === 'roles') return getStoredData(STORAGE_KEYS.ROLES, ROLES);
    if (key === 'departments') return getStoredData(STORAGE_KEYS.DEPARTMENTS, DEPARTMENTS);
    return [];
  },
  async updateConfig(key: string, value: string[]): Promise<void> {
    if (key === 'roles') setStoredData(STORAGE_KEYS.ROLES, value);
    if (key === 'departments') setStoredData(STORAGE_KEYS.DEPARTMENTS, value);
  }
};

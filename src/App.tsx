/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Calendar from 'react-calendar';
import { 
  LayoutDashboard, 
  Wallet, 
  Briefcase, 
  Users, 
  Database, 
  Target, 
  Settings,
  ChevronRight,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Info,
  FileText,
  Activity,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  TreeDeciduous,
  CreditCard,
  LayoutGrid,
  Sun,
  Moon
} from 'lucide-react';

// Initialize Stripe with the provided sandbox key
const stripePromise = loadStripe('sb_publishable_Gjq7HQr64L9AIw_C2JokAA_t0y1ybyx');
const STRIPE_REFERENCE = 'siaoxshhgtbpegkhfrnn';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { cn } from './lib/utils';
import { 
  MOCK_EMPLOYEES, 
  MOCK_FINANCE, 
  MOCK_PROJECTS, 
  MOCK_PRODUCTION, 
  MOCK_GOALS 
} from './constants';
import { Employee, FinanceRecord, Project, DailyProduction, Goal, Role } from './types';

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden"
        >
          <div className="px-8 py-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>
          <div className="px-8 pb-8">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group relative mb-2",
      active 
        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
        : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
    )}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    {/* Tooltip */}
    <div className="absolute left-12 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
      {label}
    </div>
  </button>
);

const Card = ({ children, className, title, subtitle, action, ...props }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string, action?: React.ReactNode, [key: string]: any }) => (
  <div className={cn("yango-card p-6 transition-colors duration-300", className)} {...props}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

const StatCard = ({ label, value, trend, icon: Icon, color }: { label: string, value: string | number, trend?: { value: string, positive: boolean }, icon: any, color: string }) => (
  <Card className="relative overflow-hidden group">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-1 group/title cursor-pointer">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
          <ChevronRight size={10} className="text-slate-300 dark:text-slate-600 group-hover/title:translate-x-0.5 transition-transform" />
        </div>
        <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">{value}</h4>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mt-2",
            trend.positive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
          )}>
            {trend.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend.value}
          </div>
        )}
      </div>
      <div className={cn("p-2.5 rounded-2xl transition-all group-hover:scale-110", color.replace('text-', 'bg-').replace('600', '50'), "dark:" + color.replace('text-', 'bg-').replace('600', '900/20'))}>
        <Icon size={20} className={color} />
      </div>
    </div>
  </Card>
);

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<Employee>(MOCK_EMPLOYEES[0]); // Default to Admin
  const [employees, setEmployees] = useState<Employee[]>([MOCK_EMPLOYEES[0]]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Censo Regional 2024', managerId: '4', deadline: '2024-04-15', status: 'IN_PROGRESS', progress: 45 },
    { id: '2', name: 'Pesquisa de Mercado', managerId: '4', deadline: '2024-04-20', status: 'DELAYED', progress: 20 },
    { id: '3', name: 'Treinamento de Equipe', managerId: '4', deadline: '2024-04-10', status: 'COMPLETED', progress: 100 },
  ]);
  const [production, setProduction] = useState<DailyProduction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([
    'Operacional', 'Administrativo', 'Gestão', 'RH', 'Financeiro', 'Field Operations', 'Processing', 'Management'
  ]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    'Administrador', 'Agente de Campo', 'Entrada de Dados', 'Supervisor', 'Coordenador', 'Gestor de Projeto', 'RH', 'Financeiro'
  ]);

  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [editingDeptIndex, setEditingDeptIndex] = useState<number | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newDeptName, setNewDeptName] = useState('');

  // --- Dynamic Permissions State ---
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    'Administrador': ['dashboard', 'finance', 'projects', 'production', 'goals', 'hr', 'reports', 'settings', 'permissions'],
    'ADMIN': ['dashboard', 'finance', 'projects', 'production', 'goals', 'hr', 'reports', 'settings', 'permissions'],
    'Supervisor': ['dashboard', 'projects', 'production', 'goals', 'hr', 'reports', 'settings'],
    'SUPERVISOR': ['dashboard', 'projects', 'production', 'goals', 'hr', 'reports', 'settings'],
    'Financeiro': ['dashboard', 'finance', 'projects', 'reports', 'settings'],
    'FINANCE': ['dashboard', 'finance', 'projects', 'reports', 'settings'],
    'RH': ['dashboard', 'hr', 'reports', 'settings'],
    'Agente de Campo': ['dashboard', 'production', 'projects', 'goals'],
    'AGENT': ['dashboard', 'production', 'projects', 'goals'],
    'Entrada de Dados': ['dashboard', 'production', 'projects', 'goals'],
    'DATA_ENTRY': ['dashboard', 'production', 'projects', 'goals']
  });

  const ALL_AREAS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finance', label: 'Financeiro', icon: Wallet },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'production', label: 'Produção', icon: Database },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'hr', label: 'RH', icon: TreeDeciduous },
    { id: 'reports', label: 'Relatórios', icon: Activity },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'permissions', label: 'Permissões/Administração', icon: Users }
  ];

  const hasPermission = (tab: string) => {
    const userRole = currentUser.role;
    const allowedTabs = rolePermissions[userRole] || ['dashboard'];
    return allowedTabs.includes(tab);
  };

  // --- Form States ---
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState<{ open: boolean, type: 'AGENT' | 'DATA_ENTRY' }>({ open: false, type: 'AGENT' });
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [hrSearch, setHrSearch] = useState('');

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- Dashboard Filters ---
  const [dashboardPeriod, setDashboardPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [dashboardDept, setDashboardDept] = useState<string>('All');

  const handleStripePayment = async (amount: number, description: string) => {
    setIsProcessingPayment(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Simulate a payment process for this demo
      // In a real app, you would call your backend to create a PaymentIntent
      console.log(`Processing payment of MT ${amount} for ${description} with reference ${STRIPE_REFERENCE}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to finance records
      addFinance({
        type: 'INCOME',
        category: 'Stripe Payment',
        amount: amount,
        description: `${description} (Ref: ${STRIPE_REFERENCE})`,
        date: new Date().toISOString().split('T')[0]
      });

      alert('Pagamento processado com sucesso via Stripe!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento.');
    } finally {
      setIsProcessingPayment(false);
      setIsFinanceModalOpen(false);
    }
  };

  // --- Form Actions ---
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp = { ...emp, id: Math.random().toString(36).substr(2, 9) };
    setEmployees([...employees, newEmp]);
    setIsEmployeeModalOpen(false);
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees(employees.map(e => e.id === emp.id ? emp : e));
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const deleteEmployee = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este colaborador?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const addProduction = (prod: Omit<DailyProduction, 'id'>) => {
    const newProd = { ...prod, id: Math.random().toString(36).substr(2, 9) };
    setProduction([...production, newProd]);
    setIsProductionModalOpen({ open: false, type: 'AGENT' });
  };

  const addFinance = (record: Omit<FinanceRecord, 'id'>) => {
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    setFinance([...finance, newRecord]);
    setIsFinanceModalOpen(false);
  };

  const updateGoal = (goal: Goal) => {
    setGoals(goals.map(g => g.id === goal.id ? goal : g));
    setIsGoalModalOpen(false);
  };

  // --- Calculations ---

  const filteredFinance = useMemo(() => {
    const now = new Date();
    return finance.filter(f => {
      const fDate = new Date(f.date);
      const matchesPeriod = 
        dashboardPeriod === 'week' ? (now.getTime() - fDate.getTime()) <= 7 * 24 * 60 * 60 * 1000 :
        dashboardPeriod === 'month' ? (now.getMonth() === fDate.getMonth() && now.getFullYear() === fDate.getFullYear()) :
        dashboardPeriod === 'year' ? (now.getFullYear() === fDate.getFullYear()) : true;
      
      // Finance records don't have a department field in the current schema, 
      // but we could filter by employee department if we had that link.
      // For now, we'll just filter by period.
      return matchesPeriod;
    });
  }, [finance, dashboardPeriod]);

  const filteredProduction = useMemo(() => {
    const now = new Date();
    return production.filter(p => {
      const pDate = new Date(p.date);
      const matchesPeriod = 
        dashboardPeriod === 'week' ? (now.getTime() - pDate.getTime()) <= 7 * 24 * 60 * 60 * 1000 :
        dashboardPeriod === 'month' ? (now.getMonth() === pDate.getMonth() && now.getFullYear() === pDate.getFullYear()) :
        dashboardPeriod === 'year' ? (now.getFullYear() === pDate.getFullYear()) : true;
      
      const employee = employees.find(e => e.id === p.employeeId);
      const matchesDept = dashboardDept === 'All' || (employee && employee.department === dashboardDept);

      return matchesPeriod && matchesDept;
    });
  }, [production, dashboardPeriod, dashboardDept, employees]);

  const stats = useMemo(() => {
    const totalIncome = filteredFinance.filter(f => f.type === 'INCOME').reduce((acc, f) => acc + f.amount, 0);
    const totalExpense = filteredFinance.filter(f => f.type === 'EXPENSE').reduce((acc, f) => acc + f.amount, 0);
    const balance = totalIncome - totalExpense;

    const totalInterviews = filteredProduction.reduce((acc, p) => acc + (p.interviewsDone || 0), 0);
    const totalProcessed = filteredProduction.reduce((acc, p) => acc + (p.interviewsProcessed || 0), 0);
    const backlog = totalInterviews - totalProcessed;

    return { totalIncome, totalExpense, balance, totalInterviews, totalProcessed, backlog };
  }, [filteredFinance, filteredProduction]);

  const getGoalStatus = (current: number, target: number) => {
    if (target === 0) return { color: 'text-slate-400', bg: 'bg-slate-100', label: 'N/A' };
    const percentage = (current / target) * 100;
    if (percentage >= 100) return { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Excelente', percent: percentage };
    if (percentage >= 70) return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Bom', percent: percentage };
    return { color: 'text-rose-600', bg: 'bg-rose-50', label: 'Crítico', percent: percentage };
  };

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Visão geral do desempenho operacional e financeiro</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <button 
              onClick={() => setDashboardPeriod('week')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                dashboardPeriod === 'week' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              Semana
            </button>
            <button 
              onClick={() => setDashboardPeriod('month')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                dashboardPeriod === 'month' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              Mês
            </button>
            <button 
              onClick={() => setDashboardPeriod('year')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                dashboardPeriod === 'year' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              Ano
            </button>
          </div>

          <select 
            value={dashboardDept}
            onChange={(e) => setDashboardDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">Todos Departamentos</option>
            {availableDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Saldo Total" value={`MT ${stats.balance.toLocaleString()}`} trend={{ value: '+12%', positive: true }} icon={Wallet} color="text-blue-600" />
        <StatCard label="Entrevistas" value={stats.totalInterviews} trend={{ value: '+5%', positive: true }} icon={Database} color="text-indigo-600" />
        <StatCard label="Pendente" value={stats.backlog} trend={{ value: '-2%', positive: false }} icon={Clock} color="text-amber-600" />
        <StatCard label="Projetos" value={projects.filter(p => p.status === 'IN_PROGRESS').length} icon={Briefcase} color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Produção Diária" subtitle="Volume de entrevistas vs processamento" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredProduction.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', 
                    padding: '12px',
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}
                />
                <Bar dataKey="interviewsDone" name="Realizadas" fill="#FF0000" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="interviewsProcessed" name="Processadas" fill="#00B341" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Status de Projetos" subtitle="Distribuição de projetos">
          <div className="h-80 flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Em Andamento', value: projects.filter(p => p.status === 'IN_PROGRESS').length },
                      { name: 'Concluído', value: projects.filter(p => p.status === 'COMPLETED').length },
                      { name: 'Atrasado', value: projects.filter(p => p.status === 'DELAYED').length },
                    ]}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" stroke="none" />
                    <Cell fill="#00B341" stroke="none" />
                    <Cell fill="#FF0000" stroke="none" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{projects.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
              </div>
            </div>
            
            <div className="w-full space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Ativos</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{projects.filter(p => p.status === 'IN_PROGRESS').length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yango-green" />
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Concluídos</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{projects.filter(p => p.status === 'COMPLETED').length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yango-red" />
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Atrasados</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{projects.filter(p => p.status === 'DELAYED').length}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Desempenho da Equipe" subtitle="Ranking de produtividade operacional">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                <th className="px-4 py-4">Colaborador</th>
                <th className="px-4 py-4">Função</th>
                <th className="px-4 py-4">Produção</th>
                <th className="px-4 py-4">Meta</th>
                <th className="px-4 py-4">Progresso</th>
                <th className="px-4 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {employees
                .filter(emp => dashboardDept === 'All' || emp.department === dashboardDept)
                .map(emp => {
                const prod = filteredProduction.filter(p => p.employeeId === emp.id).reduce((acc, p) => acc + (p.interviewsDone || p.interviewsProcessed || 0), 0);
                const goal = goals.find(g => g.employeeId === emp.id);
                const target = goal ? goal.targetValue : 0;
                const monthlyTarget = target * 22;
                const status = getGoalStatus(prod, monthlyTarget);
                const progress = monthlyTarget > 0 ? Math.min(100, (prod / monthlyTarget) * 100) : 0;

                return (
                  <tr key={emp.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5">{emp.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{emp.role}</span>
                    </td>
                    <td className="px-4 py-5 text-sm font-black text-slate-900 dark:text-white">{prod.toLocaleString()}</td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-400">{monthlyTarget.toLocaleString()}</td>
                    <td className="px-4 py-5 w-48">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={cn("h-full rounded-full", status.color.replace('text-', 'bg-'))}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", status.bg, status.color)}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const FinanceView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Fluxo Financeiro</h2>
          <p className="text-xs font-medium text-slate-400 mt-1">Gestão de receitas, despesas e lucratividade</p>
        </div>
        <button 
          onClick={() => setIsFinanceModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Receitas" value={`MT ${stats.totalIncome.toLocaleString()}`} icon={TrendingUp} color="text-yango-green" />
        <StatCard label="Despesas" value={`MT ${stats.totalExpense.toLocaleString()}`} icon={TrendingDown} color="text-yango-red" />
        <StatCard label="Lucro Líquido" value={`MT ${stats.balance.toLocaleString()}`} icon={Wallet} color="text-blue-600" />
      </div>

      <Card title="Histórico de Transações" subtitle="Últimas movimentações registradas">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                <th className="px-4 py-4">Data</th>
                <th className="px-4 py-4">Descrição</th>
                <th className="px-4 py-4">Categoria</th>
                <th className="px-4 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {finance.map(record => (
                <tr key={record.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">{record.date}</td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-900 dark:text-white">{record.description}</td>
                  <td className="px-4 py-5">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase tracking-wider">{record.category}</span>
                  </td>
                  <td className={cn("px-4 py-5 text-sm font-black text-right", record.type === 'INCOME' ? "text-yango-green" : "text-yango-red")}>
                    {record.type === 'INCOME' ? '+' : '-'} MT {record.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const ReportsView = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Relatórios Operacionais</h2>
          <p className="text-xs font-medium text-slate-400 mt-1">Análise detalhada de produtividade e metas</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <FileText size={18} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Tendência de Produção" subtitle="Evolução semanal de entrevistas">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={production.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', 
                    padding: '12px',
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}
                />
                <Bar dataKey="interviewsDone" name="Realizadas" fill="#FF0000" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Eficiência por Departamento" subtitle="Processamento vs Coleta">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Operacional', value: stats.totalInterviews },
                    { name: 'Processamento', value: stats.totalProcessed },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#FF0000" stroke="none" />
                  <Cell fill="#00B341" stroke="none" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const HRView = () => {
    const filteredEmployees = employees.filter(emp => 
      emp.name.toLowerCase().includes(hrSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(hrSearch.toLowerCase()) ||
      emp.department.toLowerCase().includes(hrSearch.toLowerCase())
    );

    const hrStats = useMemo(() => ({
      total: employees.length,
      active: employees.filter(e => e.status === 'ACTIVE').length,
      suspended: employees.filter(e => e.status === 'SUSPENDED').length
    }), [employees]);

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recursos Humanos</h2>
            <p className="text-xs font-medium text-slate-400 mt-1">Gestão de colaboradores e departamentos</p>
          </div>
          <button 
            onClick={() => setIsEmployeeModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Plus size={18} />
            Cadastrar Funcionário
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Equipe</p>
            <p className="text-2xl font-black text-slate-900">{hrStats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Ativos</p>
            <p className="text-2xl font-black text-emerald-600">{hrStats.active}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Suspensos</p>
            <p className="text-2xl font-black text-amber-600">{hrStats.suspended}</p>
          </div>
        </div>

        <Card title="Lista de Colaboradores" subtitle="Visualização completa da equipe ativa" action={
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 w-64 group focus-within:ring-2 focus-within:ring-slate-200 transition-all">
            <Search size={14} className="text-slate-400 group-focus-within:text-slate-600" />
            <input 
              type="text" 
              placeholder="Filtrar por nome, cargo..." 
              className="bg-transparent border-none outline-none text-xs ml-2 w-full text-slate-600 placeholder:text-slate-400"
              value={hrSearch}
              onChange={(e) => setHrSearch(e.target.value)}
            />
          </div>
        }>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-4 py-4">Nome</th>
                  <th className="px-4 py-4">Cargo</th>
                  <th className="px-4 py-4">Departamento</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5">{emp.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider">{emp.role}</span>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-500">{emp.department}</td>
                    <td className="px-4 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        emp.status === 'ACTIVE' ? "bg-yango-green/10 text-yango-green" : 
                        emp.status === 'SUSPENDED' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {emp.status === 'ACTIVE' ? 'Ativo' : emp.status === 'SUSPENDED' ? 'Suspenso' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingEmployee(emp);
                            setIsEmployeeModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteEmployee(emp.id)}
                          className="p-2 text-slate-400 hover:text-yango-red hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const PermissionsView = () => {
    const togglePermission = (role: string, areaId: string) => {
      const currentPermissions = rolePermissions[role] || [];
      const newPermissions = currentPermissions.includes(areaId)
        ? currentPermissions.filter(id => id !== areaId)
        : [...currentPermissions, areaId];
      
      setRolePermissions({
        ...rolePermissions,
        [role]: newPermissions
      });
    };

    return (
      <div className="space-y-8 pb-20">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestão de Administradores e Permissões</h2>
          <p className="text-xs text-slate-500 mt-1">Defina quais áreas cada cargo do sistema pode acessar e gerir.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {availableRoles.map(role => (
            <Card key={role} title={`Permissões: ${role}`} className="overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {ALL_AREAS.map(area => {
                  const Icon = area.icon;
                  const isChecked = (rolePermissions[role] || []).includes(area.id);
                  
                  return (
                    <button
                      key={area.id}
                      onClick={() => togglePermission(role, area.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                        isChecked 
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 grayscale opacity-70 hover:opacity-100"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl",
                        isChecked ? "bg-blue-100 dark:bg-blue-800" : "bg-slate-50 dark:bg-slate-800"
                      )}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">{area.label}</p>
                        <p className="text-[10px] opacity-60 mt-1">{isChecked ? 'Acesso Ativo' : 'Sem Acesso'}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const ProductionView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Lançamento Diário</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsProductionModalOpen({ open: true, type: 'AGENT' })}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            <Plus size={18} />
            Lançamento Agente
          </button>
          <button 
            onClick={() => setIsProductionModalOpen({ open: true, type: 'DATA_ENTRY' })}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
          >
            <Plus size={18} />
            Lançamento Processamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Histórico de Produção">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Funcionário</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3 text-right">Qtd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {production.map(prod => {
                    const emp = employees.find(e => e.id === prod.employeeId);
                    const isAgent = !!prod.interviewsDone;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-slate-500">{prod.date}</td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-700">{emp?.name}</td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            isAgent ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            {isAgent ? 'Campo' : 'Processamento'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-right text-slate-700">
                          {isAgent ? prod.interviewsDone : prod.interviewsProcessed}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Backlog de Trabalho" className="bg-slate-900 text-white border-none">
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Entrevistas Pendentes</p>
                <h3 className="text-4xl font-bold mt-1">{stats.backlog}</h3>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (stats.totalProcessed / stats.totalInterviews) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {Math.round((stats.totalProcessed / stats.totalInterviews) * 100)}% do total processado
              </p>
            </div>
          </Card>

          <Card title="Alertas de Produção">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl">
                <AlertCircle className="text-rose-600 shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-rose-900">Meta não atingida</p>
                  <p className="text-[10px] text-rose-700 mt-0.5">João Silva ficou 25% abaixo da meta ontem.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <Clock className="text-amber-600 shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-amber-900">Acúmulo de trabalho</p>
                  <p className="text-[10px] text-amber-700 mt-0.5">Backlog aumentou 15% nos últimos 3 dias.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const [projectsViewMode, setProjectsViewMode] = useState<'grid' | 'calendar'>('grid');

  const ProjectsView = () => {
    const projectsByDate = useMemo(() => {
      const map: Record<string, Project[]> = {};
      projects.forEach(p => {
        if (!map[p.deadline]) map[p.deadline] = [];
        map[p.deadline].push(p);
      });
      return map;
    }, [projects]);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Gestão de Projetos</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setProjectsViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  projectsViewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setProjectsViewMode('calendar')}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  projectsViewMode === 'calendar' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <CalendarIcon size={18} />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
            <Plus size={18} />
            Novo Projeto
          </button>
        </div>

        {projectsViewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Nenhum projeto encontrado</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">Comece criando um novo projeto para gerenciar prazos e progresso.</p>
              </div>
            ) : (
              projects.map(project => (
                <Card key={project.id} className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      project.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-600" :
                      project.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {project.status.replace('_', ' ')}
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Settings size={16} />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{project.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">Prazo: {project.deadline}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Progresso</span>
                      <span className="font-bold text-slate-700">{project.progress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={project.progress}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setProjects(projects.map(p => p.id === project.id ? { ...p, progress: val, status: val === 100 ? 'COMPLETED' : p.status } : p));
                      }}
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold">
                          U{i}
                        </div>
                      ))}
                    </div>
                    <button className="text-xs font-medium text-blue-600 hover:underline">
                      Ver detalhes
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="p-8">
              <Calendar 
                className="w-full border-none font-sans"
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayProjects = projectsByDate[dateStr];
                    if (dayProjects) {
                      return (
                        <div className="mt-1 space-y-1">
                          {dayProjects.map(p => (
                            <div key={p.id} className="text-[8px] px-1 py-0.5 bg-blue-100 text-blue-700 rounded truncate font-bold">
                              {p.name}
                            </div>
                          ))}
                        </div>
                      );
                    }
                  }
                  return null;
                }}
              />
            </div>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex h-screen bg-[#F5F5F7] dark:bg-slate-950 overflow-hidden transition-colors duration-300", theme === 'dark' && "dark")}>
      {/* Narrow Sidebar */}
      <aside className="w-16 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col items-center py-6 z-50 shrink-0">
        <div className="w-10 h-10 bg-yango-red rounded-xl flex items-center justify-center text-white font-black text-xl mb-8 shadow-lg shadow-red-100">
          Y
        </div>
        
        <nav className="flex-1 flex flex-col items-center gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          {hasPermission('finance') && <SidebarItem icon={Wallet} label="Financeiro" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />}
          {hasPermission('projects') && <SidebarItem icon={Briefcase} label="Projetos" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />}
          {hasPermission('production') && <SidebarItem icon={Database} label="Produção" active={activeTab === 'production'} onClick={() => setActiveTab('production')} />}
          {hasPermission('goals') && <SidebarItem icon={Target} label="Metas" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />}
          {hasPermission('hr') && <SidebarItem icon={TreeDeciduous} label="RH" active={activeTab === 'hr'} onClick={() => setActiveTab('hr')} />}
          {hasPermission('reports') && <SidebarItem icon={Activity} label="Relatórios" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />}
          {hasPermission('permissions') && <SidebarItem icon={Users} label="Gestão Adm" active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')} />}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2">
          <SidebarItem icon={Info} label="Ajuda" active={false} onClick={() => {}} />
          <SidebarItem icon={Settings} label="Configurações" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'dashboard' ? 'Visão Geral' : 
               activeTab === 'finance' ? 'Financeiro' :
               activeTab === 'projects' ? 'Projetos' :
               activeTab === 'hr' ? 'Recursos Humanos' :
               activeTab === 'production' ? 'Produção Diária' :
               activeTab === 'goals' ? 'Metas' : 
               activeTab === 'permissions' ? 'Gestão de Administradores' :
               activeTab === 'reports' ? 'Relatórios do Sistema' : 'Configurações'}
            </h1>
            
            <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-1.5 w-64 group focus-within:ring-2 focus-within:ring-slate-200 transition-all">
              <Search size={16} className="text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none outline-none text-xs ml-2 w-full text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <Wallet size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">MT {stats.balance.toLocaleString()}</span>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                <Users size={14} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">{currentUser.role}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2">Trocar Perfil (Demo)</p>
                {employees.slice(0, 5).map(emp => (
                  <button 
                    key={emp.id}
                    onClick={() => {
                      setCurrentUser(emp);
                      setActiveTab('dashboard');
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      currentUser.id === emp.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {emp.name} ({emp.role})
                  </button>
                ))}
              </div>
            </div>
            
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-yango-red rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-slate-100 mx-1" />
            
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 mt-1">{currentUser.contact}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-sm overflow-hidden">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {!hasPermission(activeTab) ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
                    <AlertCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Acesso Negado</h2>
                  <p className="text-slate-500 mt-2 max-w-sm">Você não tem permissão para acessar este módulo. Entre em contato com o administrador.</p>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
                  >
                    Voltar ao Dashboard
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === 'dashboard' && <DashboardView />}
                  {activeTab === 'finance' && <FinanceView />}
                  {activeTab === 'projects' && <ProjectsView />}
                  {activeTab === 'hr' && <HRView />}
                  {activeTab === 'production' && <ProductionView />}
                  {activeTab === 'reports' && <ReportsView />}
                  {activeTab === 'permissions' && <PermissionsView />}
                  {activeTab === 'goals' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Configuração de Metas</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map(emp => {
                      const goal = goals.find(g => g.employeeId === emp.id) || { 
                        id: Math.random().toString(36).substr(2, 9), 
                        employeeId: emp.id, 
                        type: 'DAILY', 
                        metricName: emp.role === 'AGENT' || emp.role === 'Agente de Campo' ? 'Entrevistas' : 
                                   emp.role === 'DATA_ENTRY' || emp.role === 'Entrada de Dados' ? 'Processamento' : 'Tarefas',
                        targetValue: 0,
                        unit: 'unid'
                      };
                      
                      return (
                        <Card key={emp.id} title={emp.name} subtitle={emp.role}>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Métrica</label>
                                <input 
                                  type="text" 
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                                  defaultValue={goal.metricName}
                                  onChange={(e) => {
                                    const newGoal = { ...goal, metricName: e.target.value };
                                    setGoals(prev => prev.find(g => g.id === goal.id) ? prev.map(g => g.id === goal.id ? newGoal : g) : [...prev, newGoal]);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unidade</label>
                                <input 
                                  type="text" 
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                                  defaultValue={goal.unit}
                                  onChange={(e) => {
                                    const newGoal = { ...goal, unit: e.target.value };
                                    setGoals(prev => prev.find(g => g.id === goal.id) ? prev.map(g => g.id === goal.id ? newGoal : g) : [...prev, newGoal]);
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meta Diária</label>
                              <input 
                                type="number" 
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                                defaultValue={goal.targetValue}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const newGoal = { ...goal, targetValue: val };
                                  setGoals(prev => prev.find(g => g.id === goal.id) ? prev.map(g => g.id === goal.id ? newGoal : g) : [...prev, newGoal]);
                                }}
                              />
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl">
                              <p className="text-[10px] font-bold text-blue-600 uppercase">Projeção Mensal</p>
                              <p className="text-lg font-bold text-blue-900">{goal.targetValue * 22} {goal.unit}</p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <Card title="Configurações do Sistema">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="font-bold text-slate-800">Modo Administrador</p>
                          <p className="text-xs text-slate-500">Acesso total a todas as funcionalidades</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="font-bold text-slate-800">Notificações de Metas</p>
                          <p className="text-xs text-slate-500">Alertar quando metas diárias não forem atingidas</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Gestão de Estrutura" subtitle="Configurar cargos e departamentos disponíveis">
                    <div className="space-y-8">
                      {/* Roles Management */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Cargos Disponíveis</label>
                          <span className="text-[10px] text-slate-400 font-medium">{availableRoles.length} cargos</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="Novo cargo..."
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newRoleName.trim()) {
                                  setAvailableRoles([...availableRoles, newRoleName.trim()]);
                                  setNewRoleName('');
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/5 outline-none transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (newRoleName.trim()) {
                                  setAvailableRoles([...availableRoles, newRoleName.trim()]);
                                  setNewRoleName('');
                                }
                              }}
                              disabled={!newRoleName.trim()}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                              <Plus size={14} />
                              Adicionar
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            {availableRoles.map((role, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm group animate-in fade-in zoom-in duration-200">
                                {editingRoleIndex === index ? (
                                  <input 
                                    autoFocus
                                    className="text-sm font-bold text-slate-700 bg-transparent outline-none w-24"
                                    defaultValue={role}
                                    onBlur={(e) => {
                                      const newVal = e.target.value.trim();
                                      if (newVal && newVal !== role) {
                                        const newRoles = [...availableRoles];
                                        newRoles[index] = newVal;
                                        setAvailableRoles(newRoles);
                                      }
                                      setEditingRoleIndex(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') e.currentTarget.blur();
                                      if (e.key === 'Escape') setEditingRoleIndex(null);
                                    }}
                                  />
                                ) : (
                                  <>
                                    <span className="text-sm font-bold text-slate-700">{role}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => setEditingRoleIndex(index)}
                                        className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button 
                                        onClick={() => setAvailableRoles(availableRoles.filter((_, i) => i !== index))}
                                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Departments Management */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Departamentos</label>
                          <span className="text-[10px] text-slate-400 font-medium">{availableDepartments.length} departamentos</span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="Novo departamento..."
                              value={newDeptName}
                              onChange={(e) => setNewDeptName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newDeptName.trim()) {
                                  setAvailableDepartments([...availableDepartments, newDeptName.trim()]);
                                  setNewDeptName('');
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/5 outline-none transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (newDeptName.trim()) {
                                  setAvailableDepartments([...availableDepartments, newDeptName.trim()]);
                                  setNewDeptName('');
                                }
                              }}
                              disabled={!newDeptName.trim()}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                              <Plus size={14} />
                              Adicionar
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                            {availableDepartments.map((dept, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm group animate-in fade-in zoom-in duration-200">
                                {editingDeptIndex === index ? (
                                  <input 
                                    autoFocus
                                    className="text-sm font-bold text-slate-700 bg-transparent outline-none w-24"
                                    defaultValue={dept}
                                    onBlur={(e) => {
                                      const newVal = e.target.value.trim();
                                      if (newVal && newVal !== dept) {
                                        const newDepts = [...availableDepartments];
                                        newDepts[index] = newVal;
                                        setAvailableDepartments(newDepts);
                                      }
                                      setEditingDeptIndex(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') e.currentTarget.blur();
                                      if (e.key === 'Escape') setEditingDeptIndex(null);
                                    }}
                                  />
                                ) : (
                                  <>
                                    <span className="text-sm font-bold text-slate-700">{dept}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => setEditingDeptIndex(index)}
                                        className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button 
                                        onClick={() => setAvailableDepartments(availableDepartments.filter((_, i) => i !== index))}
                                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                          <strong>Dica:</strong> Clique no ícone de lápis para editar um item existente ou no ícone de fechar para removê-lo. 
                          As alterações são aplicadas instantaneamente em todos os formulários do sistema.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modals */}
        <Modal 
          isOpen={isEmployeeModalOpen} 
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setEditingEmployee(null);
          }} 
          title={editingEmployee ? "Editar Colaborador" : "Cadastrar Funcionário"}
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const empData = {
              name: formData.get('name') as string,
              role: formData.get('role') as Role,
              department: formData.get('department') as string,
              contact: formData.get('contact') as string,
              joinDate: editingEmployee?.joinDate || new Date().toISOString().split('T')[0],
              status: editingEmployee?.status || 'ACTIVE'
            };
            
            if (editingEmployee) {
              updateEmployee({ ...empData, id: editingEmployee.id });
            } else {
              addEmployee(empData);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome Completo</label>
              <input 
                name="name" 
                required 
                defaultValue={editingEmployee?.name}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cargo</label>
                <select 
                  name="role" 
                  defaultValue={editingEmployee?.role}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Departamento</label>
                <select 
                  name="department" 
                  required 
                  defaultValue={editingEmployee?.department}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                >
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contato (Email/Tel)</label>
              <input 
                name="contact" 
                required 
                defaultValue={editingEmployee?.contact}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" 
              />
            </div>
            <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
              {editingEmployee ? "Salvar Alterações" : "Cadastrar Funcionário"}
            </button>
          </form>
        </Modal>

        <Modal 
          isOpen={isProductionModalOpen.open} 
          onClose={() => setIsProductionModalOpen({ ...isProductionModalOpen, open: false })} 
          title={`Lançamento: ${isProductionModalOpen.type === 'AGENT' ? 'Agente' : 'Processamento'}`}
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const empId = formData.get('employeeId') as string;
            const val = parseInt(formData.get('value') as string) || 0;
            const names = parseInt(formData.get('names') as string) || 0;
            
            addProduction({
              date: new Date().toISOString().split('T')[0],
              employeeId: empId,
              ...(isProductionModalOpen.type === 'AGENT' 
                ? { interviewsDone: val, namesCollected: names } 
                : { interviewsProcessed: val, namesInserted: names })
            });
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Funcionário</label>
              <select name="employeeId" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                {employees.filter(e => {
                  if (isProductionModalOpen.type === 'AGENT') {
                    return e.role === 'AGENT' || e.role === 'Agente de Campo';
                  } else {
                    return e.role === 'DATA_ENTRY' || e.role === 'Entrada de Dados';
                  }
                }).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  {isProductionModalOpen.type === 'AGENT' ? 'Entrevistas' : 'Processadas'}
                </label>
                <input name="value" type="number" required className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  {isProductionModalOpen.type === 'AGENT' ? 'Nomes Coletados' : 'Nomes Inseridos'}
                </label>
                <input name="names" type="number" required className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
              Confirmar Lançamento
            </button>
          </form>
        </Modal>

        <Modal isOpen={isFinanceModalOpen} onClose={() => setIsFinanceModalOpen(false)} title="Novo Lançamento Financeiro">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            addFinance({
              type: formData.get('type') as 'INCOME' | 'EXPENSE',
              category: formData.get('category') as string,
              amount: parseFloat(formData.get('amount') as string) || 0,
              description: formData.get('description') as string,
              date: new Date().toISOString().split('T')[0]
            });
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo</label>
                <select name="type" className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                  <option value="INCOME">Receita (+)</option>
                  <option value="EXPENSE">Despesa (-)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor (R$)</label>
                <input name="amount" type="number" step="0.01" required className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoria</label>
              <input name="category" required className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="Ex: Aluguel, Venda, Salário" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição</label>
              <textarea name="description" required className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm h-20" />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors mb-2"
            >
              Registrar Transação
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                const form = e.currentTarget.closest('form');
                if (!form) return;
                const formData = new FormData(form);
                const amount = parseFloat(formData.get('amount') as string) || 0;
                const description = formData.get('description') as string;
                if (amount > 0 && description) {
                  handleStripePayment(amount, description);
                } else {
                  alert('Por favor, preencha o valor e a descrição.');
                }
              }}
              disabled={isProcessingPayment}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CreditCard size={18} />
              )}
              {isProcessingPayment ? 'Processando...' : 'Pagar com Stripe'}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}

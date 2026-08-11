import React, { useState } from 'react';
import { 
  Patient, 
  Attendance, 
  FinancialRecord, 
  QuickFilterOptions 
} from '../types/pilates';
import { 
  formatCurrency, 
  formatDate, 
  getPatientAttendanceStats, 
  isBirthdayThisMonth 
} from '../utils/helpers';
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Calendar, 
  CalendarCheck, 
  DollarSign, 
  AlertCircle, 
  Gift, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  patients: Patient[];
  attendance: Attendance[];
  financial: FinancialRecord[];
  onOpenNewPatient: () => void;
  onOpenNewAttendance: () => void;
  onOpenNewFinancial: () => void;
  onOpenNewAssessment: () => void;
  onOpenNewEvolution: () => void;
  onSelectPatient: (patient: Patient) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  attendance,
  financial,
  onOpenNewPatient,
  onOpenNewAttendance,
  onOpenNewFinancial,
  onOpenNewAssessment,
  onOpenNewEvolution,
  onSelectPatient,
  onNavigateToTab,
}) => {
  // Quick Filter state
  const [filters, setFilters] = useState<QuickFilterOptions>({
    searchQuery: '',
    weekDay: '',
    time: '',
    patientId: '',
    financialStatus: '',
  });

  // KPI Calculations
  const activePatients = patients.filter(p => p.status === 'Ativo').length;
  const pausedPatients = patients.filter(p => p.status === 'Pausado').length;
  const inactivePatients = patients.filter(p => p.status === 'Inativo').length;

  // New patients this month
  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const newPatientsThisMonth = patients.filter(p => p.enrollmentDate.startsWith(currentMonthStr)).length;

  // Attendance statistics
  const todayStr = new Date().toISOString().substring(0, 10);
  const classesToday = attendance.filter(a => a.date === todayStr && a.status === 'Presente').length;
  
  // Classes this week (past 7 days)
  const classesThisWeek = attendance.filter(a => a.status === 'Presente' || a.status === 'Reposição').length;
  const absencesThisWeek = attendance.filter(a => a.status === 'Falta Justificada' || a.status === 'Falta Não Justificada').length;

  // Replacements pending across all active patients
  let pendingReplacementsCount = 0;
  patients.forEach(p => {
    const stats = getPatientAttendanceStats(p.id, attendance);
    pendingReplacementsCount += stats.replacementsAvailable;
  });

  // Financial KPIs
  const totalReceivedThisMonth = financial
    .filter(f => f.status === 'Pago' && f.competence === currentMonthStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingInvoices = financial.filter(f => f.status === 'Em aberto' || f.status === 'Vencido');
  const pendingAmount = pendingInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  // Birthday patients this month
  const birthdayPatients = patients.filter(p => isBirthdayThisMonth(p.birthDate));

  // Quick Filter processing for table view
  const filteredPatients = patients.filter(patient => {
    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = patient.name.toLowerCase().includes(q);
      const matchCode = patient.id.toLowerCase().includes(q);
      const matchCPF = patient.cpf.includes(q);
      if (!matchName && !matchCode && !matchCPF) return false;
    }

    // Week day filter
    if (filters.weekDay && !patient.weekDays.includes(filters.weekDay as any)) {
      return false;
    }

    // Time filter
    if (filters.time && patient.classTime !== filters.time) {
      return false;
    }

    // Patient dropdown filter
    if (filters.patientId && patient.id !== filters.patientId) {
      return false;
    }

    // Financial status filter
    if (filters.financialStatus) {
      const patientFinances = financial.filter(f => f.patientId === patient.id);
      if (filters.financialStatus === 'Em aberto' && !patientFinances.some(f => f.status === 'Em aberto')) return false;
      if (filters.financialStatus === 'Vencido' && !patientFinances.some(f => f.status === 'Vencido')) return false;
      if (filters.financialStatus === 'Pago' && !patientFinances.some(f => f.status === 'Pago')) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Painel de Indicadores da Clínica
          </h1>
          <p className="text-sm text-slate-500">
            Visão geral em tempo real da gestão de pacientes, frequência, finanças e atendimento.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenNewPatient}
            className="px-2 sm:px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>+ Paciente</span>
          </button>

          <button
            onClick={onOpenNewAttendance}
            className="px-2 sm:px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>Presença</span>
          </button>

          <button
            onClick={onOpenNewFinancial}
            className="px-2 sm:px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
          >
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span>Financeiro</span>
          </button>
        </div>
      </div>

      {/* Primary Indicator Cards (KPIs) Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Pacientes Ativos */}
        <div 
          onClick={() => onNavigateToTab('pacientes')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pacientes Ativos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{activePatients}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.5 rounded">
              +{newPatientsThisMonth} novos
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {pausedPatients} pausados • {inactivePatients} inativos
          </p>
        </div>

        {/* Aulas Realizadas Hoje */}
        <div 
          onClick={() => onNavigateToTab('presenca')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Aulas Hoje</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{classesToday}</span>
            <span className="text-[11px] text-slate-500 font-medium">realizadas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {classesThisWeek} aulas nesta semana
          </p>
        </div>

        {/* Receita do Mês */}
        <div 
          onClick={() => onNavigateToTab('financeiro')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Receita Mês</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-emerald-700 block truncate">
              {formatCurrency(totalReceivedThisMonth)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Recebimentos quitados
          </p>
        </div>

        {/* Mensalidades Pendentes/Vencidas */}
        <div 
          onClick={() => onNavigateToTab('financeiro')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pendente / Vencido</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-amber-700 block truncate">
              {formatCurrency(pendingAmount)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {pendingInvoices.length} parcelas em aberto
          </p>
        </div>

        {/* Reposições Pendentes */}
        <div 
          onClick={() => onNavigateToTab('presenca')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reposições Pendentes</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{pendingReplacementsCount}</span>
            <span className="text-[11px] text-slate-500">créditos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {absencesThisWeek} faltas registradas
          </p>
        </div>

      </div>

      {/* Quick Filters & Patient List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Filter Toolbar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">Filtros Rápidos da Recepção</h2>
            </div>

            {/* Filter Select Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full lg:w-auto">
              
              {/* Dia da Semana */}
              <select
                value={filters.weekDay}
                onChange={e => setFilters(prev => ({ ...prev, weekDay: e.target.value }))}
                className="bg-white border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Dia da Semana (Todos)</option>
                <option value="Segunda">Segunda-feira</option>
                <option value="Terça">Terça-feira</option>
                <option value="Quarta">Quarta-feira</option>
                <option value="Quinta">Quinta-feira</option>
                <option value="Sexta">Sexta-feira</option>
                <option value="Sábado">Sábado</option>
              </select>

              {/* Horário */}
              <select
                value={filters.time}
                onChange={e => setFilters(prev => ({ ...prev, time: e.target.value }))}
                className="bg-white border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Horário (Todos)</option>
                <option value="07:00">07:00</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="15:00">15:00</option>
                <option value="18:00">18:00</option>
              </select>

              {/* Paciente especifico */}
              <select
                value={filters.patientId}
                onChange={e => setFilters(prev => ({ ...prev, patientId: e.target.value }))}
                className="bg-white border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Paciente (Todos)</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.name}
                  </option>
                ))}
              </select>

              {/* Situação Financeira */}
              <select
                value={filters.financialStatus}
                onChange={e => setFilters(prev => ({ ...prev, financialStatus: e.target.value }))}
                className="bg-white border border-slate-200 rounded-lg text-xs font-medium px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Situação Financeira</option>
                <option value="Pago">Somente Quitados</option>
                <option value="Em aberto">Com Pendência</option>
                <option value="Vencido">Somente Vencidos</option>
              </select>

            </div>
          </div>
        </div>

        {/* Results Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código & Paciente</th>
                <th className="py-3 px-4 hidden sm:table-cell">Plano & Horário</th>
                <th className="py-3 px-4 hidden md:table-cell">Professor</th>
                <th className="py-3 px-4 hidden sm:table-cell">Presença / Reposições</th>
                <th className="py-3 px-4">Status Financeiro</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Nenhum paciente encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => {
                  const stats = getPatientAttendanceStats(patient.id, attendance);
                  const patientFinancials = financial.filter(f => f.patientId === patient.id);
                  const hasOverdue = patientFinancials.some(f => f.status === 'Vencido');
                  const hasOpen = patientFinancials.some(f => f.status === 'Em aberto');

                  return (
                    <tr 
                      key={patient.id} 
                      className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectPatient(patient)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {patient.photo ? (
                            <img 
                              src={patient.photo} 
                              alt={patient.name} 
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                              {patient.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-blue-700">
                                {patient.name}
                              </span>
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {patient.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {patient.phone} • {patient.plan}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="font-medium text-slate-800 block">{patient.plan}</span>
                        <span className="text-[11px] text-slate-500">
                          {patient.weekDays.join(', ')} às {patient.classTime}
                        </span>
                      </td>

                      <td className="py-3 px-4 hidden md:table-cell text-slate-700 font-medium">
                        {patient.instructor}
                      </td>

                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded font-medium">
                            {stats.totalPresences} P
                          </span>
                          <span className="bg-rose-100 text-rose-800 text-[11px] px-2 py-0.5 rounded font-medium">
                            {stats.totalAbsences} F
                          </span>
                          {stats.replacementsAvailable > 0 && (
                            <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded font-medium">
                              {stats.replacementsAvailable} Rep.
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {hasOverdue ? (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                            <XCircle className="w-3 h-3" /> Vencido
                          </span>
                        ) : hasOpen ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                            <Clock className="w-3 h-3" /> Em aberto
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Quitado
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline flex items-center gap-1 ml-auto"
                        >
                          Ficha <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Birthday Patients Section */}
      {birthdayPatients.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Aniversariantes do Mês ({birthdayPatients.length})</h3>
              <p className="text-xs text-blue-100">
                {birthdayPatients.map(p => `${p.name} (${formatDate(p.birthDate)})`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('pacientes')}
            className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs rounded-lg transition-colors shrink-0"
          >
            Ver Pacientes
          </button>
        </div>
      )}

    </div>
  );
};

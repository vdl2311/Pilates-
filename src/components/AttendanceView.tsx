import React, { useState } from 'react';
import { Patient, Attendance, AttendanceStatus } from '../types/pilates';
import { formatDate, getPatientAttendanceStats } from '../utils/helpers';
import { 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  Plus, 
  Filter, 
  User, 
  Clock, 
  Trash2,
  Calendar
} from 'lucide-react';

interface AttendanceViewProps {
  patients: Patient[];
  attendance: Attendance[];
  onOpenNewAttendance: () => void;
  onDeleteAttendance: (id: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  patients,
  attendance,
  onOpenNewAttendance,
  onDeleteAttendance,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Filter attendance list
  const filteredAttendance = attendance.filter(item => {
    if (selectedPatientId && item.patientId !== selectedPatientId) return false;
    if (selectedStatus && item.status !== selectedStatus) return false;
    return true;
  });

  // Calculate global summary metrics
  const totalPresences = attendance.filter(a => a.status === 'Presente').length;
  const totalJustified = attendance.filter(a => a.status === 'Falta Justificada').length;
  const totalUnjustified = attendance.filter(a => a.status === 'Falta Não Justificada').length;
  const totalReplacements = attendance.filter(a => a.status === 'Reposição').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            Controle de Presença & Reposições
          </h1>
          <p className="text-sm text-slate-500">
            Registro de frequência diária, faltas justificadas e saldos de reposição.
          </p>
        </div>

        <button
          onClick={onOpenNewAttendance}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Presença / Reposição</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total de Presenças</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">{totalPresences}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Aulas frequentadas</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Faltas Justificadas</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">{totalJustified}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Geram crédito de reposição</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Faltas Não Justificadas</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">{totalUnjustified}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Sem direito a reposição</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Reposições Realizadas</span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-2 block">{totalReplacements}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Créditos já utilizados</p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Patient Selector Filter */}
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Pacientes</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name}
              </option>
            ))}
          </select>

          {/* Status Selector Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Status</option>
            <option value="Presente">Presente</option>
            <option value="Falta Justificada">Falta Justificada</option>
            <option value="Falta Não Justificada">Falta Não Justificada</option>
            <option value="Reposição">Reposição</option>
          </select>
        </div>

        {selectedPatientId && (
          <div className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
            <span>
              Saldo do Aluno:{' '}
              <strong>
                {getPatientAttendanceStats(selectedPatientId, attendance).replacementsAvailable} reposição(ões) disponível(is)
              </strong>
            </span>
          </div>
        )}

      </div>

      {/* Attendance Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Data & Horário</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4 hidden sm:table-cell">Aula / Turma</th>
                <th className="py-3 px-4">Status da Frequência</th>
                <th className="py-3 px-4 hidden md:table-cell">Observação / Justificativa</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Nenhum registro de presença encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(item => {
                  const patient = patients.find(p => p.id === item.patientId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-slate-900 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{formatDate(item.date)}</span>
                          <span className="text-slate-400">•</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.time}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {patient ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{patient.name}</span>
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded hidden sm:inline-block">
                              {patient.id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Paciente {item.patientId}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700 hidden sm:table-cell">
                        {item.className || 'Studio Pilates'}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.status === 'Presente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Falta Justificada'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'Falta Não Justificada'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status === 'Presente' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {item.status === 'Falta Justificada' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                          {item.status === 'Falta Não Justificada' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {item.status === 'Reposição' && <RotateCcw className="w-3.5 h-3.5 text-blue-600" />}
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 hidden md:table-cell">
                        {item.replacementNotes || item.replacementUsed ? 'Crédito utilizado de reposição' : '-'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteAttendance(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Excluir Registro"
                        >
                          <Trash2 className="w-4 h-4" />
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

    </div>
  );
};

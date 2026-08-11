import React, { useState } from 'react';
import { Patient, Attendance, FinancialRecord } from '../types/pilates';
import { formatDate, getPatientAttendanceStats } from '../utils/helpers';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  User, 
  UserCheck, 
  UserX, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface PatientsViewProps {
  patients: Patient[];
  attendance: Attendance[];
  financial: FinancialRecord[];
  onOpenNewPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  onSelectPatientDetails: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  attendance,
  financial,
  onOpenNewPatient,
  onEditPatient,
  onDeletePatient,
  onSelectPatientDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Filter patients list
  const filteredPatients = patients.filter(patient => {
    const matchSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm) ||
      patient.phone.includes(searchTerm);

    const matchStatus = statusFilter === 'Todos' || patient.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestão de Pacientes
          </h1>
          <p className="text-sm text-slate-500">
            {patients.length} pacientes cadastrados no sistema da clínica.
          </p>
        </div>

        <button
          onClick={onOpenNewPatient}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nome, código (P0001), CPF ou telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['Todos', 'Ativo', 'Pausado', 'Inativo'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código & Paciente</th>
                <th className="py-3 px-4 hidden sm:table-cell">CPF / Contato</th>
                <th className="py-3 px-4 hidden md:table-cell">Plano & Horário</th>
                <th className="py-3 px-4 hidden lg:table-cell">Professor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Nenhum paciente encontrado com os critérios digitados.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => {
                  const stats = getPatientAttendanceStats(patient.id, attendance);

                  return (
                    <tr key={patient.id} className="hover:bg-blue-50/40 transition-colors group">
                      
                      {/* Código & Photo & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {patient.photo ? (
                            <img 
                              src={patient.photo} 
                              alt={patient.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                              {patient.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-blue-700">
                                {patient.name}
                              </span>
                              <span className="font-mono text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                                {patient.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {patient.phone} • {patient.plan}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 text-slate-700 hidden sm:table-cell">
                        <p className="font-mono text-[11px] font-semibold text-slate-800">{patient.cpf}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <a 
                            href={`https://wa.me/${patient.whatsapp}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      </td>

                      {/* Plan & Schedule */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="font-medium text-slate-900 block">{patient.plan}</span>
                        <span className="text-[11px] text-slate-500">
                          {patient.weekDays.join(', ')} às {patient.classTime}
                        </span>
                      </td>

                      {/* Instructor */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium hidden lg:table-cell">
                        {patient.instructor}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          patient.status === 'Ativo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : patient.status === 'Pausado'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            patient.status === 'Ativo' ? 'bg-emerald-500' : patient.status === 'Pausado' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          {patient.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectPatientDetails(patient)}
                            title="Ver Ficha Completa do Paciente"
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditPatient(patient)}
                            title="Editar Paciente"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja remover o paciente ${patient.name}?`)) {
                                onDeletePatient(patient.id);
                              }
                            }}
                            title="Excluir Paciente"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

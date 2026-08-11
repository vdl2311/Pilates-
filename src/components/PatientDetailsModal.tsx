import React, { useState } from 'react';
import { Patient, Attendance, FinancialRecord, Assessment, Evolution } from '../types/pilates';
import { formatDate, formatCurrency, getPatientAttendanceStats } from '../utils/helpers';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle, 
  CalendarCheck, 
  DollarSign, 
  ClipboardList, 
  TrendingUp, 
  MessageCircle, 
  Printer, 
  Edit3 
} from 'lucide-react';

interface PatientDetailsModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  attendance: Attendance[];
  financial: FinancialRecord[];
  assessments: Assessment[];
  evolutions: Evolution[];
  onEditPatient: (patient: Patient) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  isOpen,
  onClose,
  attendance,
  financial,
  assessments,
  evolutions,
  onEditPatient,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'presenca' | 'financeiro' | 'avaliacoes' | 'evolucao'>('geral');

  if (!isOpen || !patient) return null;

  const stats = getPatientAttendanceStats(patient.id, attendance);
  const patientAttendance = attendance.filter(a => a.patientId === patient.id);
  const patientFinancial = financial.filter(f => f.patientId === patient.id);
  const patientAssessments = assessments.filter(a => a.patientId === patient.id);
  const patientEvolutions = evolutions.filter(e => e.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-w-full">
        
        {/* Header Profile Summary */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
            {patient.photo ? (
              <img 
                src={patient.photo} 
                alt={patient.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0" 
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0 border-2 border-slate-700">
                {patient.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left min-w-0 w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                <h2 className="text-lg sm:text-xl font-bold break-words">{patient.name}</h2>
                <span className="bg-blue-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0">
                  {patient.id}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 break-words">
                CPF: {patient.cpf} • {patient.age} anos ({formatDate(patient.birthDate)}) • {patient.gender}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium border border-slate-700 max-w-full break-words text-center">
                  {patient.plan} • {patient.weekDays.join(', ')} às {patient.classTime}
                </span>
                <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium border border-slate-700 shrink-0">
                  {patient.instructor}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold shrink-0 ${
                  patient.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  Status: {patient.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onEditPatient(patient);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-center sm:self-start transition-colors shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-2 sm:px-6 pt-2 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-medium touch-pan-x">
          {[
            { id: 'geral', label: 'Cadastro & Contatos', icon: User },
            { id: 'presenca', label: `Frequência (${patientAttendance.length})`, icon: CalendarCheck },
            { id: 'financeiro', label: `Financeiro (${patientFinancial.length})`, icon: DollarSign },
            { id: 'avaliacoes', label: `Avaliações (${patientAssessments.length})`, icon: ClipboardList },
            { id: 'evolucao', label: `Evolução (${patientEvolutions.length})`, icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 sm:py-2.5 px-2.5 sm:px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 text-xs max-h-[60vh] overflow-y-auto">
          
          {/* Tab 1: Cadastro & Contatos */}
          {activeTab === 'geral' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">Informações de Contato</h3>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-blue-600" /> {patient.phone}
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-600" /> {patient.email || 'Não informado'}
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> {patient.address || 'Não informado'}
                  </p>
                  <a
                    href={`https://wa.me/${patient.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Abrir no WhatsApp
                  </a>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">Contato de Emergência</h3>
                  <p className="font-semibold text-slate-800">{patient.emergencyContact.name || 'Não cadastrado'}</p>
                  <p className="text-slate-600">{patient.emergencyContact.phone}</p>
                  <p className="text-slate-500 italic">{patient.emergencyContact.relation}</p>
                </div>
              </div>

              {patient.notes && (
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-1">Observações Gerais</h3>
                  <p className="text-slate-700 leading-relaxed">{patient.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Frequência */}
          {activeTab === 'presenca' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-base font-bold text-emerald-700">{stats.totalPresences}</span>
                  <span className="block text-[10px] text-slate-500">Presenças</span>
                </div>
                <div>
                  <span className="text-base font-bold text-rose-700">{stats.totalAbsences}</span>
                  <span className="block text-[10px] text-slate-500">Faltas Total</span>
                </div>
                <div>
                  <span className="text-base font-bold text-blue-700">{stats.replacementsAvailable}</span>
                  <span className="block text-[10px] text-slate-500">Reposições Disp.</span>
                </div>
              </div>

              <div className="space-y-2">
                {patientAttendance.length === 0 ? (
                  <p className="text-slate-400 py-4 text-center">Nenhum registro de presença para este aluno.</p>
                ) : (
                  patientAttendance.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900">{formatDate(a.date)} às {a.time}</span>
                        <p className="text-[11px] text-slate-500">{a.className}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        a.status === 'Presente' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Financeiro */}
          {activeTab === 'financeiro' && (
            <div className="space-y-2">
              {patientFinancial.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">Nenhuma cobrança lançada para este aluno.</p>
              ) : (
                patientFinancial.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900">{formatCurrency(f.amount)}</span>
                      <span className="text-slate-500 ml-2 font-mono">Competência: {f.competence}</span>
                      <p className="text-[11px] text-slate-500">Vencimento: {formatDate(f.dueDate)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      f.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Avaliações */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-3">
              {patientAssessments.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">Nenhuma avaliação cadastrada para este paciente.</p>
              ) : (
                patientAssessments.map(ava => (
                  <div key={ava.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-900">Avaliado em: {formatDate(ava.date)}</span>
                      <span className="text-slate-500">Por {ava.evaluator}</span>
                    </div>
                    <p><strong>Objetivos:</strong> {ava.objectives}</p>
                    <p className="text-rose-700"><strong>Restrições:</strong> {ava.restrictions}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 5: Evolução */}
          {activeTab === 'evolucao' && (
            <div className="space-y-3">
              {patientEvolutions.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">Nenhuma evolução registrada para este paciente.</p>
              ) : (
                patientEvolutions.map(evo => (
                  <div key={evo.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Data: {formatDate(evo.date)}</span>
                      <span>Prof. {evo.instructor}</span>
                    </div>
                    <p className="font-bold text-slate-900">Exercícios: {evo.exercisesPerformed}</p>
                    <p className="text-slate-700 italic">"{evo.evolutionNotes}"</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

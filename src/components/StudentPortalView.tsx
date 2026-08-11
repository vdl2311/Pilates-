import React, { useState } from 'react';
import { Patient, Attendance, FinancialRecord, Assessment, Evolution } from '../types/pilates';
import { formatDate, formatCurrency, getPatientAttendanceStats } from '../utils/helpers';
import { 
  GraduationCap, 
  CalendarCheck, 
  Clock, 
  User, 
  DollarSign, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Award, 
  Sparkles,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

interface StudentPortalViewProps {
  patients: Patient[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  attendance: Attendance[];
  financial: FinancialRecord[];
  assessments: Assessment[];
  evolutions: Evolution[];
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  patients,
  selectedStudentId,
  setSelectedStudentId,
  attendance,
  financial,
  assessments,
  evolutions,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  const student = patients.find(p => p.id === selectedStudentId) || patients[0];

  if (!student) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
        Nenhum aluno cadastrado no sistema.
      </div>
    );
  }

  // Student specific data
  const stats = getPatientAttendanceStats(student.id, attendance);
  const studentInvoices = financial.filter(f => f.patientId === student.id);
  const currentInvoice = studentInvoices.find(f => f.status === 'Em aberto' || f.status === 'Vencido') || studentInvoices[0];
  const studentAssessments = assessments.filter(a => a.patientId === student.id);
  const latestAssessment = studentAssessments[0];
  const studentEvolutions = evolutions.filter(e => e.patientId === student.id);

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405320.005802BR5913StudioPilates6009SaoPaulo620705031236304C1C5');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Student Selector Switcher */}
      <div className="bg-blue-900 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-300" />
          <div>
            <span className="font-bold text-sm block">Área Exclusiva do Aluno (Simulação)</span>
            <span className="text-xs text-blue-200">Visualização do app no celular ou portal do aluno.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-blue-200 shrink-0">Simular Aluno:</label>
          <select
            value={student.id}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="bg-blue-800 text-white text-xs font-semibold rounded-lg px-3 py-1.5 border border-blue-700 focus:outline-none w-full sm:w-auto"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5">
          {student.photo ? (
            <img 
              src={student.photo} 
              alt={student.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg shrink-0" 
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0 border-2 border-white/30">
              {student.name.charAt(0)}
            </div>
          )}

          <div className="text-center sm:text-left flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl font-bold break-words">{student.name}</h1>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-mono shrink-0">
                {student.id}
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1 break-words">
              Plano: <strong>{student.plan}</strong> • Instrutor(a): <strong>{student.instructor}</strong>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-white/10 max-w-full text-center break-words">
                <Clock className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>{student.weekDays.join(' e ')} às {student.classTime}</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-xl text-xs font-semibold shrink-0">
                Status: {student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Attendance Stats & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Frequency & Replacements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              Minha Frequência & Reposições
            </h2>
            <span className="text-xs text-slate-500 font-mono">Este Mês</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <span className="text-xl font-bold text-emerald-800 block">{stats.totalPresences}</span>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase">Presenças</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <span className="text-xl font-bold text-amber-800 block">{stats.totalJustifiedAbsences}</span>
              <span className="text-[10px] font-semibold text-amber-600 uppercase">Faltas Just.</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
              <span className="text-xl font-bold text-blue-800 block">{stats.replacementsAvailable}</span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase">Reposições Disp.</span>
            </div>
          </div>

          {stats.replacementsAvailable > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>Você tem <strong>{stats.replacementsAvailable} aula(s) de reposição</strong> para agendar com a recepção!</span>
              <a 
                href={`https://wa.me/5511999999999?text=Ol%C3%A1,%20gostaria%20de%20agendar%20minha%20reposi%C3%A7%C3%A3o%20de%20Pilates%20(${student.name})`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1 shrink-0 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Agendar no WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Current Invoice & Payment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Minha Mensalidade
            </h2>
            <span className="text-xs text-slate-500 font-mono">Competência {currentInvoice?.competence || '2026-08'}</span>
          </div>

          {currentInvoice ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Valor da Mensalidade</span>
                  <span className="text-lg font-bold text-slate-900">{formatCurrency(currentInvoice.amount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Vencimento</span>
                  <span className="text-xs font-bold text-slate-800">{formatDate(currentInvoice.dueDate)}</span>
                </div>
              </div>

              {currentInvoice.status === 'Pago' ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mensalidade quitada! Obrigado por manter suas contas em dia.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleCopyPix}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {copiedPix ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chave PIX Copiada!</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        <span>Copiar Chave PIX da Clínica</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Ao realizar o pagamento, o comprovante é sincronizado automaticamente com a recepção.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Nenhuma mensalidade registrada para este período.</p>
          )}
        </div>

      </div>

      {/* Assessment & Medical Restrictions */}
      {latestAssessment && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Suas Orientações & Restrições Fisioterapêuticas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">Seus Objetivos no Pilates:</span>
              <p className="text-slate-700">{latestAssessment.objectives}</p>
            </div>
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
              <span className="font-bold text-rose-900 block mb-1">Restrições Pessoais:</span>
              <p className="text-slate-700">{latestAssessment.restrictions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Workout Evolutions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Seu Histórico de Exercícios & Evolução Recente
        </h2>

        {studentEvolutions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            Ainda não há registros de evolução para este aluno.
          </p>
        ) : (
          <div className="space-y-3">
            {studentEvolutions.map(evo => (
              <div key={evo.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Aula do dia: <strong>{formatDate(evo.date)}</strong></span>
                  <span>Prof. <strong>{evo.instructor}</strong></span>
                </div>
                <p className="text-slate-800 font-semibold">Exercícios: {evo.exercisesPerformed}</p>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                  "{evo.evolutionNotes}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Patient, Attendance, AttendanceStatus } from '../types/pilates';
import { X, CalendarCheck, Save } from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attendance: Attendance) => void;
  patients: Patient[];
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
}) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState('08:00');
  const [className, setClassName] = useState('Studio Pilates');
  const [status, setStatus] = useState<AttendanceStatus>('Presente');
  const [replacementNotes, setReplacementNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('Selecione um paciente.');
      return;
    }

    const newAttendance: Attendance = {
      id: `ATT_${Date.now()}`,
      patientId,
      date,
      time,
      className,
      status,
      replacementUsed: status === 'Reposição',
      replacementNotes: replacementNotes || (status === 'Reposição' ? 'Aula de reposição agendada' : undefined),
    };

    onSave(newAttendance);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden my-auto max-w-full">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm">Registrar Presença / Frequência</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Paciente *</label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Data da Aula</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Horário</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status da Frequência *</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as AttendanceStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Presente">Presente (Compareceu)</option>
              <option value="Falta Justificada">Falta Justificada (Gera crédito de reposição)</option>
              <option value="Falta Não Justificada">Falta Não Justificada (Sem direito a reposição)</option>
              <option value="Reposição">Reposição (Utiliza crédito)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações / Motivo</label>
            <input
              type="text"
              placeholder="Ex: Avisou por WhatsApp, consulta médica..."
              value={replacementNotes}
              onChange={e => setReplacementNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Registro</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

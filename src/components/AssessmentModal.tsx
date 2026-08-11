import React, { useState } from 'react';
import { Patient, Assessment } from '../types/pilates';
import { X, ClipboardList, Save } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assessment: Assessment) => void;
  patients: Patient[];
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
}) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [evaluator, setEvaluator] = useState('Prof. Ana Paula Santos');
  const [objectives, setObjectives] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [notes, setNotes] = useState('');
  const [nextReevaluationDate, setNextReevaluationDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !objectives) {
      alert('Preencha o paciente e os objetivos.');
      return;
    }

    const newAssessment: Assessment = {
      id: `AVA_${Date.now()}`,
      patientId,
      date,
      evaluator,
      objectives,
      restrictions,
      notes,
      nextReevaluationDate,
    };

    onSave(newAssessment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden my-auto max-w-full">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">Nova Avaliação Fisioterapêutica</h2>
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
              <label className="block font-semibold text-slate-700 mb-1">Data da Avaliação</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Avaliador / Fisioterapeuta</label>
              <input
                type="text"
                value={evaluator}
                onChange={e => setEvaluator(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Objetivos do Aluno *</label>
            <textarea
              rows={2}
              required
              placeholder="Ex: Fortalecimento de core, alívio de dores na coluna..."
              value={objectives}
              onChange={e => setObjectives(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Restrições e Cuidados Biomecânicos</label>
            <textarea
              rows={2}
              placeholder="Ex: Hérnia discal L4-L5, evitar hiperflexão lumbar desassistida..."
              value={restrictions}
              onChange={e => setRestrictions(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações Clínicas Gerais</label>
            <textarea
              rows={2}
              placeholder="Ex: Testes de flexibilidade, postura, mobilidade de ombros..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Previsão para Reavaliação</label>
            <input
              type="date"
              value={nextReevaluationDate}
              onChange={e => setNextReevaluationDate(e.target.value)}
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
              <span>Salvar Avaliação</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

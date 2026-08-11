import React, { useState } from 'react';
import { Patient, Evolution } from '../types/pilates';
import { X, TrendingUp, Save } from 'lucide-react';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evolution: Evolution) => void;
  patients: Patient[];
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
}) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState('08:00');
  const [instructor, setInstructor] = useState('Prof. Ana Paula Santos');
  const [evolutionNotes, setEvolutionNotes] = useState('');
  const [exercisesPerformed, setExercisesPerformed] = useState('');
  const [observations, setObservations] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !exercisesPerformed) {
      alert('Preencha o paciente e os exercícios realizados.');
      return;
    }

    const newEvolution: Evolution = {
      id: `EVO_${Date.now()}`,
      patientId,
      date,
      time,
      instructor,
      evolutionNotes: evolutionNotes || 'Executou a rotina com bom alinhamento postural.',
      exercisesPerformed,
      observations,
    };

    onSave(newEvolution);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden my-auto max-w-full">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">Registrar Evolução do Treino</h2>
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Data</label>
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instrutor</label>
              <input
                type="text"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Exercícios Realizados (Cadillac, Reformer, Chair, Solo) *</label>
            <textarea
              rows={2}
              required
              placeholder="Ex: Reformer: Footwork, Hundred. Cadillac: Leg Springs. Chair: Swan..."
              value={exercisesPerformed}
              onChange={e => setExercisesPerformed(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Evolução & Resposta do Aluno</label>
            <textarea
              rows={2}
              placeholder="Ex: Boa ativação de powerhouse, relatou alívio de dor lombar ao final..."
              value={evolutionNotes}
              onChange={e => setEvolutionNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações Adicionais</label>
            <input
              type="text"
              placeholder="Ex: Cargas utilizadas, dores relatadas no início..."
              value={observations}
              onChange={e => setObservations(e.target.value)}
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
              <span>Salvar Evolução</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

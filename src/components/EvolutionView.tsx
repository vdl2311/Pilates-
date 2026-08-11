import React, { useState } from 'react';
import { Patient, Evolution } from '../types/pilates';
import { formatDate } from '../utils/helpers';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Activity, 
  Calendar, 
  User, 
  Trash2, 
  Dumbbell, 
  FileText 
} from 'lucide-react';

interface EvolutionViewProps {
  patients: Patient[];
  evolutions: Evolution[];
  onOpenNewEvolution: () => void;
  onDeleteEvolution: (id: string) => void;
}

export const EvolutionView: React.FC<EvolutionViewProps> = ({
  patients,
  evolutions,
  onOpenNewEvolution,
  onDeleteEvolution,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const filteredEvolutions = selectedPatientId
    ? evolutions.filter(e => e.patientId === selectedPatientId)
    : evolutions;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Evolução e Registro das Sessões
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhamento diário dos aparelhos (Cadillac, Reformer, Chair, Barrel, Solo) e resposta dos pacientes.
          </p>
        </div>

        <button
          onClick={onOpenNewEvolution}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Evolução do Treino</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-700 shrink-0">Filtrar por Paciente:</label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Pacientes</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evolution Timeline List */}
      <div className="space-y-4">
        {filteredEvolutions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            Nenhuma evolução registrada para este filtro.
          </div>
        ) : (
          filteredEvolutions.map(evo => {
            const patient = patients.find(p => p.id === evo.patientId);

            return (
              <div 
                key={evo.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    {patient?.photo ? (
                      <img 
                        src={patient.photo} 
                        alt={patient.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                        {patient?.name.charAt(0) || 'P'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{patient?.name}</h3>
                      <p className="text-xs text-slate-500">
                        {patient?.id} • Instrutor: <strong>{evo.instructor}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {formatDate(evo.date)} {evo.time ? `às ${evo.time}` : ''}
                    </span>

                    <button
                      onClick={() => onDeleteEvolution(evo.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Excluir Evolução"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Evolution Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Exercises Performed */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1.5">
                      <Dumbbell className="w-4 h-4 text-blue-600" />
                      <span>Exercícios Realizados</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">{evo.exercisesPerformed}</p>
                  </div>

                  {/* Instructor Notes */}
                  <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1.5">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Evolução & Resposta do Paciente</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{evo.evolutionNotes}</p>
                  </div>

                </div>

                {evo.observations && (
                  <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100 italic">
                    Obs: {evo.observations}
                  </p>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

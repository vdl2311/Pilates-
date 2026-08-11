import React, { useState } from 'react';
import { Patient, Assessment } from '../types/pilates';
import { formatDate } from '../utils/helpers';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  AlertTriangle, 
  Target, 
  FileText, 
  Calendar, 
  User, 
  Trash2 
} from 'lucide-react';

interface AssessmentsViewProps {
  patients: Patient[];
  assessments: Assessment[];
  onOpenNewAssessment: () => void;
  onDeleteAssessment: (id: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  patients,
  assessments,
  onOpenNewAssessment,
  onDeleteAssessment,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const filteredAssessments = selectedPatientId
    ? assessments.filter(a => a.patientId === selectedPatientId)
    : assessments;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Avaliações e Reavaliações Fisioterapêuticas
          </h1>
          <p className="text-sm text-slate-500">
            Registro de anamnese, restrições biomecânicas, patologias e objetivos do aluno.
          </p>
        </div>

        <button
          onClick={onOpenNewAssessment}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Avaliação</span>
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

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssessments.length === 0 ? (
          <div className="col-span-2 bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            Nenhuma avaliação encontrada para o filtro selecionado.
          </div>
        ) : (
          filteredAssessments.map(item => {
            const patient = patients.find(p => p.id === item.patientId);

            return (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
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
                          {patient?.id} • Avaliado por {item.evaluator}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAssessment(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Excluir Avaliação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-3 text-xs">
                    
                    {/* Objectives */}
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-1.5 text-blue-900 font-semibold mb-1">
                        <Target className="w-3.5 h-3.5 text-blue-600" />
                        <span>Objetivos do Aluno</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item.objectives}</p>
                    </div>

                    {/* Restrictions */}
                    <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                      <div className="flex items-center gap-1.5 text-rose-900 font-semibold mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Restrições & Cuidados Biomecânicos</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item.restrictions}</p>
                    </div>

                    {/* Observations */}
                    {item.notes && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-1">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Observações Clínicas</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{item.notes}</p>
                      </div>
                    )}

                  </div>
                </div>

                {/* Footer Dates */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Avaliado em: <strong>{formatDate(item.date)}</strong>
                  </span>
                  {item.nextReevaluationDate && (
                    <span className="text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded">
                      Próxima Reavaliação: {formatDate(item.nextReevaluationDate)}
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

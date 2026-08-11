import React, { useState } from 'react';
import { Patient, FinancialRecord, PaymentStatus } from '../types/pilates';
import { formatCurrency, formatDate } from '../utils/helpers';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  CreditCard, 
  QrCode, 
  Trash2, 
  Check, 
  Download,
  FileCheck
} from 'lucide-react';

interface FinancialViewProps {
  patients: Patient[];
  financial: FinancialRecord[];
  onOpenNewFinancial: () => void;
  onUpdateFinancialStatus: (recordId: string, status: PaymentStatus, paymentMethod?: any) => void;
  onDeleteFinancial: (recordId: string) => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  patients,
  financial,
  onOpenNewFinancial,
  onUpdateFinancialStatus,
  onDeleteFinancial,
}) => {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Em aberto' | 'Pago' | 'Vencido' | 'MesAtual'>('Todos');
  const [searchPatient, setSearchPatient] = useState('');

  const currentCompetence = new Date().toISOString().substring(0, 7); // YYYY-MM

  // Filter financial list based on tab & search
  const filteredRecords = financial.filter(record => {
    // Tab filter
    if (activeTab === 'Em aberto' && record.status !== 'Em aberto') return false;
    if (activeTab === 'Pago' && record.status !== 'Pago') return false;
    if (activeTab === 'Vencido' && record.status !== 'Vencido') return false;
    if (activeTab === 'MesAtual' && record.competence !== currentCompetence) return false;

    // Search filter
    if (searchPatient) {
      const patient = patients.find(p => p.id === record.patientId);
      const query = searchPatient.toLowerCase();
      const matchName = patient?.name.toLowerCase().includes(query);
      const matchCode = record.patientId.toLowerCase().includes(query);
      if (!matchName && !matchCode) return false;
    }

    return true;
  });

  // Calculate stats
  const totalPaid = financial
    .filter(f => f.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOpen = financial
    .filter(f => f.status === 'Em aberto')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOverdue = financial
    .filter(f => f.status === 'Vencido')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Módulo Financeiro & Mensalidades
          </h1>
          <p className="text-sm text-slate-500">
            Controle de boletos, PIX, mensalidades quitadas e cobranças em aberto.
          </p>
        </div>

        <button
          onClick={onOpenNewFinancial}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Lançar Mensalidade / Cobrança</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Recebido */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Total Recebido (Quitado)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-900 mt-2 block">
            {formatCurrency(totalPaid)}
          </span>
          <p className="text-xs text-emerald-700 mt-1">Valores confirmados em caixa</p>
        </div>

        {/* Em Aberto */}
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">A Receber (Em Aberto)</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-amber-900 mt-2 block">
            {formatCurrency(totalOpen)}
          </span>
          <p className="text-xs text-amber-700 mt-1">Dentro do prazo de vencimento</p>
        </div>

        {/* Vencido */}
        <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider">Vencido (Inadimplência)</span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <span className="text-2xl font-bold text-rose-900 mt-2 block">
            {formatCurrency(totalOverdue)}
          </span>
          <p className="text-xs text-rose-700 mt-1">Necessitam cobrança da recepção</p>
        </div>

      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Tab buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'Todos', label: 'Todos os Lançamentos' },
            { id: 'Em aberto', label: 'Em Aberto' },
            { id: 'Pago', label: 'Pagos / Quitados' },
            { id: 'Vencido', label: 'Vencidos' },
            { id: 'MesAtual', label: 'Recebimentos do Mês' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por paciente ou código..."
            value={searchPatient}
            onChange={e => setSearchPatient(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Financial Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4 hidden sm:table-cell">Competência</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 hidden md:table-cell">Data & Forma</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Nenhum lançamento financeiro encontrado.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => {
                  const patient = patients.find(p => p.id === record.patientId);

                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {patient ? (
                          <div>
                            <span className="block font-bold text-slate-900">{patient.name}</span>
                            <span className="font-mono text-[10px] text-slate-500">{patient.id} • {patient.plan}</span>
                          </div>
                        ) : (
                          <span>Paciente {record.patientId}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-700 hidden sm:table-cell">
                        {record.competence}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        {formatCurrency(record.amount)}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {formatDate(record.dueDate)}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          record.status === 'Pago'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.status === 'Vencido'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {record.status === 'Pago' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {record.status === 'Vencido' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {record.status === 'Em aberto' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {record.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 hidden md:table-cell">
                        {record.status === 'Pago' ? (
                          <div>
                            <span className="font-medium text-slate-800 block">
                              {record.paymentMethod || 'PIX'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Pago em {formatDate(record.paymentDate || '')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pendente</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {record.status !== 'Pago' && (
                            <button
                              onClick={() => onUpdateFinancialStatus(record.id, 'Pago', 'PIX')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Confirmar Pagamento PIX"
                            >
                              <Check className="w-3 h-3" /> Baixar PIX
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteFinancial(record.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Excluir Lançamento"
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

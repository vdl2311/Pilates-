import React, { useState } from 'react';
import { Patient, FinancialRecord, PaymentStatus, PaymentMethod } from '../types/pilates';
import { X, DollarSign, Save } from 'lucide-react';

interface FinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: FinancialRecord) => void;
  patients: Patient[];
}

export const FinancialModal: React.FC<FinancialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
}) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [amount, setAmount] = useState<number>(320.00);
  const [competence, setCompetence] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));
  const [status, setStatus] = useState<PaymentStatus>('Em aberto');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('Selecione um paciente.');
      return;
    }

    const newRecord: FinancialRecord = {
      id: `FIN_${Date.now()}`,
      patientId,
      amount: Number(amount),
      competence,
      dueDate,
      status,
      paymentDate: status === 'Pago' ? (paymentDate || new Date().toISOString().substring(0, 10)) : undefined,
      paymentMethod: status === 'Pago' ? paymentMethod : undefined,
      notes,
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden my-auto max-w-full">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm">Novo Lançamento Financeiro</h2>
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
                  {p.id} - {p.name} ({p.plan})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Competência (mês)</label>
              <input
                type="month"
                value={competence}
                onChange={e => setCompetence(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status da Cobrança</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Em aberto">Em aberto</option>
                <option value="Pago">Pago</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>
          </div>

          {status === 'Pago' && (
            <div className="grid grid-cols-2 gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Data do Pagamento</label>
                <input
                  type="date"
                  value={paymentDate || dueDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                >
                  <option value="PIX">PIX</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações</label>
            <input
              type="text"
              placeholder="Ex: Mensalidade referente ao plano mensal 2x na semana..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
              <span>Gerar Lançamento</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

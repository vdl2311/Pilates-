import React, { useState, useEffect } from 'react';
import { Patient, PatientStatus, PlanType, WeekDay } from '../types/pilates';
import { calculateAge, generateNextPatientCode } from '../utils/helpers';
import { X, User, Save, Phone, Calendar, Clock, MapPin, Shield } from 'lucide-react';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  existingPatient?: Patient | null;
  allPatients: Patient[];
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingPatient,
  allPatients,
}) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    photo: '',
    cpf: '',
    birthDate: '1990-01-01',
    gender: 'Feminino',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    emergencyContact: { name: '', phone: '', relation: '' },
    instructor: 'Prof. Ana Paula Santos',
    plan: 'Mensal (2x/sem)',
    weekDays: ['Segunda', 'Quarta'],
    classTime: '08:00',
    enrollmentDate: new Date().toISOString().substring(0, 10),
    status: 'Ativo',
    notes: '',
  });

  useEffect(() => {
    if (existingPatient) {
      setFormData({ ...existingPatient });
    } else {
      setFormData({
        id: generateNextPatientCode(allPatients),
        name: '',
        photo: '',
        cpf: '',
        birthDate: '1990-01-01',
        gender: 'Feminino',
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        emergencyContact: { name: '', phone: '', relation: '' },
        instructor: 'Prof. Ana Paula Santos',
        plan: 'Mensal (2x/sem)',
        weekDays: ['Segunda', 'Quarta'],
        classTime: '08:00',
        enrollmentDate: new Date().toISOString().substring(0, 10),
        status: 'Ativo',
        notes: '',
      });
    }
  }, [existingPatient, isOpen, allPatients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf) {
      alert('Por favor, preencha o Nome e o CPF do paciente.');
      return;
    }

    const age = calculateAge(formData.birthDate || '');
    const patientToSave: Patient = {
      id: formData.id || generateNextPatientCode(allPatients),
      name: formData.name || '',
      photo: formData.photo || '',
      cpf: formData.cpf || '',
      birthDate: formData.birthDate || '1990-01-01',
      age,
      gender: (formData.gender as any) || 'Feminino',
      phone: formData.phone || '',
      whatsapp: formData.whatsapp || (formData.phone ? formData.phone.replace(/\D/g, '') : ''),
      email: formData.email || '',
      address: formData.address || '',
      emergencyContact: formData.emergencyContact || { name: '', phone: '', relation: '' },
      instructor: formData.instructor || 'Prof. Ana Paula Santos',
      plan: (formData.plan as PlanType) || 'Mensal (2x/sem)',
      weekDays: formData.weekDays || ['Segunda', 'Quarta'],
      classTime: formData.classTime || '08:00',
      enrollmentDate: formData.enrollmentDate || new Date().toISOString().substring(0, 10),
      status: (formData.status as PatientStatus) || 'Ativo',
      notes: formData.notes || '',
    };

    onSave(patientToSave);
    onClose();
  };

  const handleWeekDayToggle = (day: WeekDay) => {
    const current = formData.weekDays || [];
    if (current.includes(day)) {
      setFormData({ ...formData, weekDays: current.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, weekDays: [...current, day] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 overflow-hidden my-auto max-w-full">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-5 h-5 text-blue-400 shrink-0" />
            <h2 className="font-bold text-sm sm:text-base truncate">
              {existingPatient ? `Editar Paciente (${existingPatient.id})` : `Cadastrar Novo Paciente (${formData.id})`}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* Basic Info Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>1. Dados Pessoais</span>
              <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                Código: {formData.id}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Silva Souza"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CPF *</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpf || ''}
                  onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sexo</label>
                <select
                  value={formData.gender || 'Feminino'}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL da Foto (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={formData.photo || ''}
                  onChange={e => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">2. Contatos & Endereço</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="paciente@email.com"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Rua, número, bairro, cidade - UF"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contato de Emergência (Nome)</label>
                <input
                  type="text"
                  placeholder="Ex: Ricardo (Esposo)"
                  value={formData.emergencyContact?.name || ''}
                  onChange={e => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact!, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefone de Emergência</label>
                <input
                  type="text"
                  placeholder="(11) 98888-1111"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={e => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact!, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Plan & Schedule Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">3. Plano & Horários de Pilates</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professor Responsável</label>
                <select
                  value={formData.instructor || 'Prof. Ana Paula Santos'}
                  onChange={e => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Prof. Ana Paula Santos">Prof. Ana Paula Santos</option>
                  <option value="Prof. Carlos Eduardo">Prof. Carlos Eduardo</option>
                  <option value="Prof. Juliana Lima">Prof. Juliana Lima</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plano Contratado</label>
                <select
                  value={formData.plan || 'Mensal (2x/sem)'}
                  onChange={e => setFormData({ ...formData, plan: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mensal (1x/sem)">Mensal (1x/semana)</option>
                  <option value="Mensal (2x/sem)">Mensal (2x/semana)</option>
                  <option value="Mensal (3x/sem)">Mensal (3x/semana)</option>
                  <option value="Trimestral (2x/sem)">Trimestral (2x/semana)</option>
                  <option value="Semestral (2x/sem)">Semestral (2x/semana)</option>
                  <option value="Personal Pilates">Personal Pilates</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Horário das Aulas</label>
                <input
                  type="text"
                  placeholder="Ex: 08:00 ou 18:30"
                  value={formData.classTime || '08:00'}
                  onChange={e => setFormData({ ...formData, classTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status da Matrícula</label>
                <select
                  value={formData.status || 'Ativo'}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Weekday selection */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Dias da Semana das Aulas</label>
                <div className="flex flex-wrap gap-2">
                  {(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as WeekDay[]).map(day => {
                    const selected = formData.weekDays?.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleWeekDayToggle(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Observações Gerais</label>
                <textarea
                  rows={2}
                  placeholder="Observações posturais, horários de preferência..."
                  value={formData.notes || ''}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{existingPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export type PatientStatus = 'Ativo' | 'Pausado' | 'Inativo';

export type PlanType = 
  | 'Mensal (1x/sem)' 
  | 'Mensal (2x/sem)' 
  | 'Mensal (3x/sem)' 
  | 'Trimestral (2x/sem)' 
  | 'Semestral (2x/sem)' 
  | 'Personal Pilates';

export type WeekDay = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface Patient {
  id: string; // P0001, P0002...
  name: string;
  photo?: string;
  cpf: string;
  birthDate: string; // YYYY-MM-DD
  age: number; // Calculated
  gender: 'Feminino' | 'Masculino' | 'Outro';
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  emergencyContact: EmergencyContact;
  instructor: string;
  plan: PlanType;
  weekDays: WeekDay[];
  classTime: string; // e.g. "08:00"
  enrollmentDate: string; // YYYY-MM-DD
  status: PatientStatus;
  notes?: string;
}

export type AttendanceStatus = 'Presente' | 'Falta Justificada' | 'Falta Não Justificada' | 'Reposição';

export interface Attendance {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:00"
  className: string; // e.g. "Pilates Studio / solo"
  status: AttendanceStatus;
  replacementUsed: boolean;
  replacementNotes?: string;
}

export type PaymentStatus = 'Pago' | 'Em aberto' | 'Vencido';
export type PaymentMethod = 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Outros';

export interface FinancialRecord {
  id: string;
  patientId: string;
  amount: number;
  competence: string; // "YYYY-MM" or "Agosto/2026"
  dueDate: string; // YYYY-MM-DD
  status: PaymentStatus;
  paymentDate?: string; // YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  receiptUrl?: string;
  notes?: string;
}

export interface Assessment {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  evaluator: string;
  objectives: string;
  restrictions: string;
  notes: string;
  nextReevaluationDate?: string;
}

export interface Evolution {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time?: string;
  instructor: string;
  evolutionNotes: string;
  exercisesPerformed: string;
  observations?: string;
}

export interface QuickFilterOptions {
  searchQuery: string;
  weekDay: string;
  time: string;
  patientId: string;
  financialStatus: string;
}

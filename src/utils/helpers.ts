import { Patient, Attendance, FinancialRecord } from '../types/pilates';

/**
 * Calculates age based on a YYYY-MM-DD birthdate string
 */
export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
}

/**
 * Formats YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Formats numeric value to Brazilian Real (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formats CPF string (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Generates next code P0001, P0002...
 */
export function generateNextPatientCode(existingPatients: Patient[]): string {
  if (!existingPatients || existingPatients.length === 0) return 'P0001';
  const numbers = existingPatients
    .map(p => {
      const match = p.id.match(/^P(\d+)$/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n));

  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNum = maxNum + 1;
  return `P${nextNum.toString().padStart(4, '0')}`;
}

/**
 * Calculates attendance statistics for a given patient
 */
export function getPatientAttendanceStats(patientId: string, attendances: Attendance[]) {
  const patientRecords = attendances.filter(a => a.patientId === patientId);
  const totalPresences = patientRecords.filter(a => a.status === 'Presente').length;
  const totalJustifiedAbsences = patientRecords.filter(a => a.status === 'Falta Justificada').length;
  const totalUnjustifiedAbsences = patientRecords.filter(a => a.status === 'Falta Não Justificada').length;
  const totalAbsences = totalJustifiedAbsences + totalUnjustifiedAbsences;
  
  // Replacements available = Justified absences minus replacements already marked as used
  const replacementsUsed = patientRecords.filter(a => a.status === 'Reposição' || a.replacementUsed).length;
  const replacementsAvailable = Math.max(0, totalJustifiedAbsences - replacementsUsed);

  return {
    totalPresences,
    totalAbsences,
    totalJustifiedAbsences,
    totalUnjustifiedAbsences,
    replacementsAvailable,
    replacementsUsed,
    totalRecords: patientRecords.length,
  };
}

/**
 * Checks if a patient has a birthday in the current month
 */
export function isBirthdayThisMonth(birthDateStr: string): boolean {
  if (!birthDateStr) return false;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  return birthDate.getMonth() === today.getMonth();
}

/**
 * Checks if a financial record is overdue
 */
export function checkFinancialStatus(record: FinancialRecord): 'Pago' | 'Em aberto' | 'Vencido' {
  if (record.status === 'Pago') return 'Pago';
  const today = new Date().toISOString().split('T')[0];
  if (record.dueDate < today) {
    return 'Vencido';
  }
  return 'Em aberto';
}

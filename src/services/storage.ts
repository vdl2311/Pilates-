import { Patient, Attendance, FinancialRecord, Assessment, Evolution } from '../types/pilates';
import { 
  INITIAL_PATIENTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_FINANCIAL, 
  INITIAL_ASSESSMENTS, 
  INITIAL_EVOLUTIONS 
} from '../data/initialData';

const STORAGE_KEYS = {
  PATIENTS: 'pilates_app_patients_v1',
  ATTENDANCE: 'pilates_app_attendance_v1',
  FINANCIAL: 'pilates_app_financial_v1',
  ASSESSMENTS: 'pilates_app_assessments_v1',
  EVOLUTIONS: 'pilates_app_evolutions_v1',
};

export const storageService = {
  // --- Patients ---
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  },
  savePatients(patients: Patient[]): void {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  },

  // --- Attendance ---
  getAttendance(): Attendance[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },
  saveAttendance(attendance: Attendance[]): void {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  },

  // --- Financial ---
  getFinancial(): FinancialRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FINANCIAL);
      return data ? JSON.parse(data) : INITIAL_FINANCIAL;
    } catch {
      return INITIAL_FINANCIAL;
    }
  },
  saveFinancial(financial: FinancialRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.FINANCIAL, JSON.stringify(financial));
  },

  // --- Assessments ---
  getAssessments(): Assessment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return data ? JSON.parse(data) : INITIAL_ASSESSMENTS;
    } catch {
      return INITIAL_ASSESSMENTS;
    }
  },
  saveAssessments(assessments: Assessment[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  },

  // --- Evolutions ---
  getEvolutions(): Evolution[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVOLUTIONS);
      return data ? JSON.parse(data) : INITIAL_EVOLUTIONS;
    } catch {
      return INITIAL_EVOLUTIONS;
    }
  },
  saveEvolutions(evolutions: Evolution[]): void {
    localStorage.setItem(STORAGE_KEYS.EVOLUTIONS, JSON.stringify(evolutions));
  },

  // --- Reset to Demo Data ---
  resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.FINANCIAL, JSON.stringify(INITIAL_FINANCIAL));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
    localStorage.setItem(STORAGE_KEYS.EVOLUTIONS, JSON.stringify(INITIAL_EVOLUTIONS));
  }
};

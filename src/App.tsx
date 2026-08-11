import React, { useState, useEffect } from 'react';
import { Patient, Attendance, FinancialRecord, Assessment, Evolution, PaymentStatus } from './types/pilates';
import { storageService } from './services/storage';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { AttendanceView } from './components/AttendanceView';
import { FinancialView } from './components/FinancialView';
import { AssessmentsView } from './components/AssessmentsView';
import { EvolutionView } from './components/EvolutionView';
import { StudentPortalView } from './components/StudentPortalView';

import { PatientModal } from './components/PatientModal';
import { AttendanceModal } from './components/AttendanceModal';
import { FinancialModal } from './components/FinancialModal';
import { AssessmentModal } from './components/AssessmentModal';
import { EvolutionModal } from './components/EvolutionModal';
import { PatientDetailsModal } from './components/PatientDetailsModal';

export default function App() {
  // Primary persistent state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [financial, setFinancial] = useState<FinancialRecord[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('P0001');

  // Modal open states
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDetailPatient, setSelectedDetailPatient] = useState<Patient | null>(null);

  // Load initial data on mount
  useEffect(() => {
    setPatients(storageService.getPatients());
    setAttendance(storageService.getAttendance());
    setFinancial(storageService.getFinancial());
    setAssessments(storageService.getAssessments());
    setEvolutions(storageService.getEvolutions());
  }, []);

  // Sync helpers to state + storage
  const updatePatientsState = (newPatients: Patient[]) => {
    setPatients(newPatients);
    storageService.savePatients(newPatients);
  };

  const updateAttendanceState = (newAttendance: Attendance[]) => {
    setAttendance(newAttendance);
    storageService.saveAttendance(newAttendance);
  };

  const updateFinancialState = (newFinancial: FinancialRecord[]) => {
    setFinancial(newFinancial);
    storageService.saveFinancial(newFinancial);
  };

  const updateAssessmentsState = (newAssessments: Assessment[]) => {
    setAssessments(newAssessments);
    storageService.saveAssessments(newAssessments);
  };

  const updateEvolutionsState = (newEvolutions: Evolution[]) => {
    setEvolutions(newEvolutions);
    storageService.saveEvolutions(newEvolutions);
  };

  // --- Handlers ---
  const handleSavePatient = (patient: Patient) => {
    const exists = patients.some(p => p.id === patient.id);
    let updated: Patient[];
    if (exists) {
      updated = patients.map(p => (p.id === patient.id ? patient : p));
    } else {
      updated = [patient, ...patients];
    }
    updatePatientsState(updated);
  };

  const handleDeletePatient = (patientId: string) => {
    const updated = patients.filter(p => p.id !== patientId);
    updatePatientsState(updated);
  };

  const handleSaveAttendance = (newRecord: Attendance) => {
    const updated = [newRecord, ...attendance];
    updateAttendanceState(updated);
  };

  const handleDeleteAttendance = (id: string) => {
    const updated = attendance.filter(a => a.id !== id);
    updateAttendanceState(updated);
  };

  const handleSaveFinancial = (newRecord: FinancialRecord) => {
    const updated = [newRecord, ...financial];
    updateFinancialState(updated);
  };

  const handleUpdateFinancialStatus = (recordId: string, status: PaymentStatus, method?: any) => {
    const updated = financial.map(f => {
      if (f.id === recordId) {
        return {
          ...f,
          status,
          paymentDate: status === 'Pago' ? new Date().toISOString().substring(0, 10) : f.paymentDate,
          paymentMethod: status === 'Pago' ? (method || 'PIX') : f.paymentMethod,
        };
      }
      return f;
    });
    updateFinancialState(updated);
  };

  const handleDeleteFinancial = (recordId: string) => {
    const updated = financial.filter(f => f.id !== recordId);
    updateFinancialState(updated);
  };

  const handleSaveAssessment = (newAssessment: Assessment) => {
    const updated = [newAssessment, ...assessments];
    updateAssessmentsState(updated);
  };

  const handleDeleteAssessment = (id: string) => {
    const updated = assessments.filter(a => a.id !== id);
    updateAssessmentsState(updated);
  };

  const handleSaveEvolution = (newEvolution: Evolution) => {
    const updated = [newEvolution, ...evolutions];
    updateEvolutionsState(updated);
  };

  const handleDeleteEvolution = (id: string) => {
    const updated = evolutions.filter(e => e.id !== id);
    updateEvolutionsState(updated);
  };

  const handleResetDemoData = () => {
    if (confirm('Deseja restaurar todos os dados para a versão de demonstração da clínica?')) {
      storageService.resetToDemoData();
      setPatients(storageService.getPatients());
      setAttendance(storageService.getAttendance());
      setFinancial(storageService.getFinancial());
      setAssessments(storageService.getAssessments());
      setEvolutions(storageService.getEvolutions());
    }
  };

  const handleOpenPatientDetails = (patient: Patient) => {
    setSelectedDetailPatient(patient);
    setIsDetailsModalOpen(true);
  };

  // Pending financial items count for badge
  const pendingFinancialCount = financial.filter(f => f.status === 'Em aberto' || f.status === 'Vencido').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased w-full max-w-full overflow-x-hidden">
      
      {/* Top Header */}
      <Header
        patients={patients}
        activeView={activeTab}
        setActiveView={setActiveTab}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        onSelectPatientDetails={handleOpenPatientDetails}
        onResetDemoData={handleResetDemoData}
      />

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingInvoicesCount={pendingFinancialCount}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            attendance={attendance}
            financial={financial}
            onOpenNewPatient={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onOpenNewAttendance={() => setIsAttendanceModalOpen(true)}
            onOpenNewFinancial={() => setIsFinancialModalOpen(true)}
            onOpenNewAssessment={() => setIsAssessmentModalOpen(true)}
            onOpenNewEvolution={() => setIsEvolutionModalOpen(true)}
            onSelectPatient={handleOpenPatientDetails}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'pacientes' && (
          <PatientsView
            patients={patients}
            attendance={attendance}
            financial={financial}
            onOpenNewPatient={() => {
              setEditingPatient(null);
              setIsPatientModalOpen(true);
            }}
            onEditPatient={p => {
              setEditingPatient(p);
              setIsPatientModalOpen(true);
            }}
            onDeletePatient={handleDeletePatient}
            onSelectPatientDetails={handleOpenPatientDetails}
          />
        )}

        {activeTab === 'presenca' && (
          <AttendanceView
            patients={patients}
            attendance={attendance}
            onOpenNewAttendance={() => setIsAttendanceModalOpen(true)}
            onDeleteAttendance={handleDeleteAttendance}
          />
        )}

        {activeTab === 'financeiro' && (
          <FinancialView
            patients={patients}
            financial={financial}
            onOpenNewFinancial={() => setIsFinancialModalOpen(true)}
            onUpdateFinancialStatus={handleUpdateFinancialStatus}
            onDeleteFinancial={handleDeleteFinancial}
          />
        )}

        {activeTab === 'avaliacoes' && (
          <AssessmentsView
            patients={patients}
            assessments={assessments}
            onOpenNewAssessment={() => setIsAssessmentModalOpen(true)}
            onDeleteAssessment={handleDeleteAssessment}
          />
        )}

        {activeTab === 'evolucao' && (
          <EvolutionView
            patients={patients}
            evolutions={evolutions}
            onOpenNewEvolution={() => setIsEvolutionModalOpen(true)}
            onDeleteEvolution={handleDeleteEvolution}
          />
        )}

        {activeTab === 'portal' && (
          <StudentPortalView
            patients={patients}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            attendance={attendance}
            financial={financial}
            assessments={assessments}
            evolutions={evolutions}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sistema de Administração para Clínica de Pilates • MVP Profissional</span>
          <span>© 2026 PilatesGestão. Todos os direitos reservados.</span>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        existingPatient={editingPatient}
        allPatients={patients}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSave={handleSaveAttendance}
        patients={patients}
      />

      <FinancialModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        onSave={handleSaveFinancial}
        patients={patients}
      />

      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onSave={handleSaveAssessment}
        patients={patients}
      />

      <EvolutionModal
        isOpen={isEvolutionModalOpen}
        onClose={() => setIsEvolutionModalOpen(false)}
        onSave={handleSaveEvolution}
        patients={patients}
      />

      <PatientDetailsModal
        patient={selectedDetailPatient}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        attendance={attendance}
        financial={financial}
        assessments={assessments}
        evolutions={evolutions}
        onEditPatient={p => {
          setEditingPatient(p);
          setIsPatientModalOpen(true);
        }}
      />

    </div>
  );
}

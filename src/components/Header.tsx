import React, { useState } from 'react';
import { Patient } from '../types/pilates';
import { 
  Activity, 
  Search, 
  UserCheck, 
  RotateCcw, 
  User, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  patients: Patient[];
  activeView: string;
  setActiveView: (view: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  onSelectPatientDetails: (patient: Patient) => void;
  onResetDemoData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patients,
  activeView,
  setActiveView,
  selectedStudentId,
  setSelectedStudentId,
  onSelectPatientDetails,
  onResetDemoData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filter patients for quick search bar
  const searchResults = searchQuery.trim()
    ? patients.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.cpf.includes(searchQuery) ||
          p.phone.includes(searchQuery)
      )
    : [];

  const handleSelectSearchResult = (patient: Patient) => {
    onSelectPatientDetails(patient);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Clinic Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight truncate">PilatesGestão</span>
                <span className="hidden sm:inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200 shrink-0">
                  MVP Clínica
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block truncate">Sistema Integrado de Gestão & Alunos</p>
            </div>
          </div>

          {/* Quick Search Bar (Receptionist Tool) */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Busca rápida (Nome, P0001, CPF)..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Auto-complete Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50 divide-y divide-slate-100"
                onMouseLeave={() => setShowSearchResults(false)}
              >
                {searchResults.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectSearchResult(patient)}
                    className="w-full text-left p-3 hover:bg-blue-50/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {patient.photo ? (
                        <img 
                          src={patient.photo} 
                          alt={patient.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {patient.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-700">
                            {patient.name}
                          </span>
                          <span className="text-xs bg-slate-100 font-mono text-slate-600 px-1.5 py-0.5 rounded">
                            {patient.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {patient.plan} • {patient.classTime}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      patient.status === 'Ativo' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : patient.status === 'Pausado' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {patient.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Controls: View Switcher (Admin vs Student) & Reset */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* View Mode Selector */}
            <div className="bg-slate-100 p-0.5 sm:p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  activeView !== 'portal'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Administração</span>
                <span className="sm:hidden">Admin</span>
              </button>

              <button
                onClick={() => setActiveView('portal')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  activeView === 'portal'
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal do Aluno</span>
                <span className="sm:hidden">Aluno</span>
              </button>
            </div>

            {/* Student Picker Quick Selector when in Portal View */}
            {activeView === 'portal' && (
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="bg-white border border-blue-300 text-slate-800 text-xs font-medium rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[100px] sm:max-w-none truncate"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDemoData}
              title="Restaurar dados demonstrativos da clínica"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

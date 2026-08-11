import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  DollarSign, 
  ClipboardList, 
  TrendingUp, 
  GraduationCap,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingInvoicesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingInvoicesCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'presenca', label: 'Controle de Presença', icon: CalendarCheck },
    { 
      id: 'financeiro', 
      label: 'Financeiro', 
      icon: DollarSign,
      badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : null 
    },
    { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardList },
    { id: 'evolucao', label: 'Evolução', icon: TrendingUp },
    { id: 'portal', label: 'Área do Aluno', icon: GraduationCap, highlight: true },
  ];

  const activeItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const ActiveIcon = activeItem.icon;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-slate-300 shadow-md sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Header Bar with Hamburger Toggle */}
        <div className="md:hidden flex items-center justify-between py-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Navegação:</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
              activeItem.highlight ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
            }`}>
              <ActiveIcon className="w-3.5 h-3.5 text-blue-300" />
              <span>{activeItem.label}</span>
              {activeItem.badge && (
                <span className="ml-1 bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full">
                  {activeItem.badge}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            aria-expanded={isMobileMenuOpen}
            aria-label="Alternar Menu de Navegação"
          >
            {isMobileMenuOpen ? (
              <>
                <X className="w-4 h-4 text-rose-400" />
                <span>Fechar</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-blue-400" />
                <span>Menu</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1.5 border-b border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                    isActive
                      ? item.highlight
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-blue-800 text-white shadow-xs'
                      : item.highlight
                      ? 'bg-blue-950/80 text-blue-200 hover:bg-blue-900 border border-blue-700/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {item.badge} pendente(s)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop / Tablet Horizontal Bar */}
        <div className="hidden md:flex items-center overflow-x-auto no-scrollbar py-2 gap-1 sm:gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? item.highlight
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/30'
                      : 'bg-blue-800 text-white shadow-xs'
                    : item.highlight
                    ? 'bg-blue-900/60 text-blue-200 hover:bg-blue-800 hover:text-white border border-blue-700/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
};


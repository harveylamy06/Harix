import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginFlow } from './components/LoginFlow';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { SchoolAdminDashboard } from './components/dashboards/SchoolAdminDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';

const MainAppView: React.FC = () => {
  const { currentUser } = useApp();
  const [showLoginFlow, setShowLoginFlow] = useState<boolean>(false);

  // If user is not logged in or explicitly requested the multi-step login flow modal
  if (!currentUser || showLoginFlow) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Navbar onOpenLogin={() => setShowLoginFlow(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <LoginFlow onClose={currentUser ? () => setShowLoginFlow(false) : undefined} />
        </main>
        <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
          EduConnect • Plateforme Éducative & de Gestion Scolaire Sécurisée
        </footer>
      </div>
    );
  }

  // Render role-specific dashboard with strict permission scaffolding
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'school_admin':
        return <SchoolAdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Profil non configuré. Veuillez vous reconnecter.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar onOpenLogin={() => setShowLoginFlow(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {renderDashboard()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EduConnect © 2026 • Système de Gouvernance Scolaire Décentralisé & Rôles Dédiés</span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>2ème à 6ème Année</span>
            <span>•</span>
            <span>Alliance Inter-Écoles 6ème</span>
            <span>•</span>
            <span>Contrôle Titulaire & Direction</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppView />
    </AppProvider>
  );
}

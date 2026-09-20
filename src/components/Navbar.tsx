import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  LogOut,
  Sparkles,
  ChevronDown,
  RotateCcw,
  BookOpen,
  School as SchoolIcon,
  Globe2
} from 'lucide-react';
import { Role } from '../types';

export const Navbar: React.FC<{ onOpenLogin?: () => void }> = ({ onOpenLogin }) => {
  const {
    currentUser,
    currentSchool,
    schools,
    classes,
    teachers,
    parents,
    students,
    superAdmins,
    schoolAdmins,
    selectedChild,
    setSelectedChildId,
    loginDirectly,
    logout,
    resetToDefaultData
  } = useApp();

  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'super_admin':
        return {
          label: 'Super Administrateur',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: ShieldAlert
        };
      case 'school_admin':
        return {
          label: 'Administrateur (Dirigeant)',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Building2
        };
      case 'teacher':
        return {
          label: 'Professeur',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: GraduationCap
        };
      case 'parent':
        return {
          label: 'Parent d’Élève',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Users
        };
      case 'student':
        return {
          label: 'Élève',
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: UserCheck
        };
    }
  };

  const badge = currentUser ? getRoleBadge(currentUser.role) : null;
  const RoleIcon = badge ? badge.icon : null;

  // Parent's children list
  const parentChildren = currentUser?.role === 'parent'
    ? students.filter(s => (currentUser as any).childrenIds?.includes(s.id))
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Quick Demo Role Switcher Strip */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Accès Rapide Démo :</span>
          <span className="text-slate-400 hidden sm:inline">Testez immédiatement chaque rôle et ses droits exclusifs</span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          <button
            id="demo-btn-superadmin"
            onClick={() => loginDirectly(superAdmins[0])}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentUser?.role === 'super_admin'
                ? 'bg-purple-600 text-white font-semibold ring-1 ring-white/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-purple-300" />
            <span>Super Admin</span>
          </button>

          <button
            id="demo-btn-dirigeant"
            onClick={() => loginDirectly(schoolAdmins[0], 'school-1')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentUser?.role === 'school_admin'
                ? 'bg-blue-600 text-white font-semibold ring-1 ring-white/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3 text-blue-300" />
            <span>Dirigeant École</span>
          </button>

          <button
            id="demo-btn-teacher6"
            onClick={() => loginDirectly(teachers[0], 'school-1')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentUser?.role === 'teacher' && (currentUser as any).titularClassId === 'class-1-6a'
                ? 'bg-emerald-600 text-white font-semibold ring-1 ring-white/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <GraduationCap className="w-3 h-3 text-emerald-300" />
            <span>Prof Titulaire 6ème (Inter-écoles)</span>
          </button>

          <button
            id="demo-btn-parent"
            onClick={() => loginDirectly(parents[0], 'school-1', 'student-1')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentUser?.role === 'parent'
                ? 'bg-amber-600 text-white font-semibold ring-1 ring-white/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Users className="w-3 h-3 text-amber-300" />
            <span>Parent (2 enfants)</span>
          </button>

          <button
            id="demo-btn-student6"
            onClick={() => loginDirectly(students[0], 'school-1', 'student-1')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentUser?.role === 'student' && (currentUser as any).gradeLevel === 6
                ? 'bg-indigo-600 text-white font-semibold ring-1 ring-white/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <UserCheck className="w-3 h-3 text-indigo-300" />
            <span>Élève 6ème (TP + Inter-écoles)</span>
          </button>

          <button
            id="demo-btn-student4"
            onClick={() => loginDirectly(students[1], 'school-1', 'student-2')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              currentUser?.role === 'student' && (currentUser as any).gradeLevel === 4
                ? 'bg-indigo-600 text-white font-semibold ring-1 ring-white/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3 text-indigo-300" />
            <span>Élève 4ème (Classe TP)</span>
          </button>

          <button
            id="demo-btn-reset"
            onClick={() => {
              if (window.confirm('Réinitialiser toutes les données de test aux valeurs initiales ?')) {
                resetToDefaultData();
              }
            }}
            title="Réinitialiser les données de démo"
            className="p-1 rounded bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-200 ml-1"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School context */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                🎓
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">EduConnect</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Portails Scolaires
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <SchoolIcon className="w-3 h-3 text-slate-400" />
                  <span>{currentSchool ? currentSchool.name : 'Tous les établissements'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right profile / auth actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Parent Child Switcher Pill */}
                {currentUser.role === 'parent' && parentChildren.length > 0 && (
                  <div className="relative">
                    <button
                      id="parent-child-dropdown-btn"
                      onClick={() => setShowChildrenDropdown(!showChildrenDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium transition"
                    >
                      <span>Enfant suivi :</span>
                      <strong className="font-semibold text-amber-950">
                        {selectedChild ? selectedChild.name : 'Sélectionner'}
                      </strong>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-800 text-[10px]">
                        {selectedChild ? `${selectedChild.gradeLevel}ème` : ''}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
                    </button>

                    {showChildrenDropdown && (
                      <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Enfants inscrits ({parentChildren.length})
                        </div>
                        {parentChildren.map(child => {
                          const childClass = classes.find(c => c.id === child.classId);
                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                setSelectedChildId(child.id);
                                setShowChildrenDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                                selectedChild?.id === child.id ? 'bg-amber-50/80 font-semibold text-amber-900' : 'text-slate-700'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-slate-900">{child.name}</p>
                                <p className="text-[11px] text-slate-500">{childClass?.name}</p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {child.gradeLevel}ème année
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Role Badge */}
                {badge && RoleIcon && (
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badge.bg}`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </div>
                )}

                {/* User Name & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{currentUser.email || currentUser.phone}</p>
                  </div>

                  <button
                    id="btn-login-flow-open"
                    onClick={onOpenLogin}
                    title="Changer d'utilisateur ou refaire le parcours de connexion"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition flex items-center gap-1"
                  >
                    <span>Portail de Connexion</span>
                  </button>

                  <button
                    id="btn-logout"
                    onClick={logout}
                    title="Se déconnecter"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="btn-login-header"
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
              >
                <SchoolIcon className="w-4 h-4" />
                <span>Se connecter</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

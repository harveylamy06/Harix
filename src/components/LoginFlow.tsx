import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  School as SchoolIcon,
  Users,
  UserCheck,
  GraduationCap,
  Building2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Search,
  Sparkles,
  Lock,
  Phone,
  Mail,
  Info,
  Layers,
  MapPin
} from 'lucide-react';
import { School, StudentUser, ParentUser } from '../types';

interface LoginFlowProps {
  onClose?: () => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onClose }) => {
  const {
    schools,
    currentSchool,
    selectSchool,
    loginAsParentByIdentifier,
    loginAsStudentByIdentifier,
    loginDirectly,
    parents,
    students,
    teachers,
    schoolAdmins,
    superAdmins,
    classes
  } = useApp();

  // Step state: 1: Select School, 2: Choose Role / Enter Credentials, 3: Parent Child Selection
  const [step, setStep] = useState<1 | 2 | 3>(currentSchool ? 2 : 1);
  const [selectedSchoolState, setSelectedSchoolState] = useState<School | null>(currentSchool || schools[0]);
  const [selectedRoleType, setSelectedRoleType] = useState<'parent' | 'student' | 'teacher' | 'school_admin' | 'super_admin'>('parent');

  // Input states
  const [parentIdentifier, setParentIdentifier] = useState('thomas.bernard@gmail.com');
  const [studentIdentifier, setStudentIdentifier] = useState('07 11 22 33 44');
  const [errorMessage, setErrorMessage] = useState('');

  // Parent path step 3: children found
  const [foundParent, setFoundParent] = useState<ParentUser | null>(null);
  const [foundChildren, setFoundChildren] = useState<StudentUser[]>([]);

  // Filter schools
  const [searchSchool, setSearchSchool] = useState('');
  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchSchool.toLowerCase()) ||
    s.city.toLowerCase().includes(searchSchool.toLowerCase()) ||
    s.code.toLowerCase().includes(searchSchool.toLowerCase())
  );

  const handleSelectSchool = (school: School) => {
    setSelectedSchoolState(school);
    selectSchool(school);
    setStep(2);
    setErrorMessage('');
  };

  // 2. Parcours Parent
  const handleParentSearch = (overrideId?: string) => {
    setErrorMessage('');
    const idToUse = overrideId || parentIdentifier;
    if (!selectedSchoolState) return;

    const result = loginAsParentByIdentifier(selectedSchoolState.id, idToUse);
    if (!result.success || !result.parent || !result.children) {
      setErrorMessage(result.message || 'Parent introuvable dans cet établissement.');
      return;
    }

    setFoundParent(result.parent);
    setFoundChildren(result.children);
    setStep(3); // Go to step 3 to choose child
  };

  const handleSelectChildAndFinish = (childId: string) => {
    if (!foundParent || !selectedSchoolState) return;
    loginDirectly(foundParent, selectedSchoolState.id, childId);
    if (onClose) onClose();
  };

  // 3. Parcours Élève
  const handleStudentLogin = (overrideId?: string) => {
    setErrorMessage('');
    const idToUse = overrideId || studentIdentifier;
    if (!selectedSchoolState) return;

    const result = loginAsStudentByIdentifier(selectedSchoolState.id, idToUse);
    if (!result.success || !result.student) {
      setErrorMessage(result.message || 'Élève introuvable dans cet établissement.');
      return;
    }

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">
              🎓
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Espace de Connexion Sécurisé</h2>
              <p className="text-xs text-slate-300">
                {step === 1 && 'Étape 1 : Sélection de l’établissement scolaire'}
                {step === 2 && `Étape 2 : Identification sur ${selectedSchoolState?.name}`}
                {step === 3 && 'Étape 3 : Sélection de l’enfant inscrit'}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-medium"
            >
              ✕
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'font-bold text-blue-700' : 'text-slate-600'}>
              Choix de l’école
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-300"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 2 ? 'bg-blue-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'font-bold text-blue-700' : 'text-slate-600'}>
              Profil & Identifiant
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-300"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'font-bold text-blue-700' : 'text-slate-600'}>
              Sélection enfant
            </span>
          </div>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= STEP 1 : ÉTAPE COMMUNE ================= */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">Consultez la liste des écoles disponibles</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sélectionnez votre établissement scolaire pour accéder au portail dédié.
                </p>

                <div className="relative mt-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchSchool}
                    onChange={e => setSearchSchool(e.target.value)}
                    placeholder="Rechercher par nom d'école ou ville..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {filteredSchools.map(school => (
                  <div
                    key={school.id}
                    onClick={() => handleSelectSchool(school)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                        {school.logoBadge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">{school.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {school.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{school.city} • {school.address}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Dirigeant : <strong className="text-slate-600 font-medium">{school.directorName}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      id={`btn-select-school-${school.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold group-hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Sélectionner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 2 : PARCOURS PAR RÔLE ================= */}
          {step === 2 && selectedSchoolState && (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSchoolState.logoBadge}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedSchoolState.name}</h3>
                    <p className="text-xs text-slate-500">{selectedSchoolState.city}</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Changer d'établissement</span>
                </button>
              </div>

              {/* Role Type Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
                <button
                  id="tab-role-parent"
                  onClick={() => { setSelectedRoleType('parent'); setErrorMessage(''); }}
                  className={`py-2 px-2 rounded-lg transition flex flex-col items-center gap-1 ${
                    selectedRoleType === 'parent'
                      ? 'bg-white text-amber-900 shadow-xs ring-1 ring-amber-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Parent</span>
                </button>

                <button
                  id="tab-role-student"
                  onClick={() => { setSelectedRoleType('student'); setErrorMessage(''); }}
                  className={`py-2 px-2 rounded-lg transition flex flex-col items-center gap-1 ${
                    selectedRoleType === 'student'
                      ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-indigo-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Élève</span>
                </button>

                <button
                  id="tab-role-teacher"
                  onClick={() => { setSelectedRoleType('teacher'); setErrorMessage(''); }}
                  className={`py-2 px-2 rounded-lg transition flex flex-col items-center gap-1 ${
                    selectedRoleType === 'teacher'
                      ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Professeur</span>
                </button>

                <button
                  id="tab-role-admin"
                  onClick={() => { setSelectedRoleType('school_admin'); setErrorMessage(''); }}
                  className={`py-2 px-2 rounded-lg transition flex flex-col items-center gap-1 ${
                    selectedRoleType === 'school_admin'
                      ? 'bg-white text-blue-900 shadow-xs ring-1 ring-blue-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Dirigeant</span>
                </button>

                <button
                  id="tab-role-superadmin"
                  onClick={() => { setSelectedRoleType('super_admin'); setErrorMessage(''); }}
                  className={`py-2 px-2 rounded-lg transition flex flex-col items-center gap-1 ${
                    selectedRoleType === 'super_admin'
                      ? 'bg-white text-purple-900 shadow-xs ring-1 ring-purple-400'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Super Admin</span>
                </button>
              </div>

              {/* 2. PARCOURS PARENT CONTENT */}
              {selectedRoleType === 'parent' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                    <strong className="font-semibold block mb-1">Parcours Parent d’Élève :</strong>
                    Saisissez votre numéro de téléphone ou votre adresse e-mail. La liste de vos enfants inscrits dans cet établissement s'affichera pour sélection.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Numéro de téléphone ou Adresse e-mail du parent :
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="input-parent-identifier"
                        type="text"
                        value={parentIdentifier}
                        onChange={e => setParentIdentifier(e.target.value)}
                        placeholder="Ex: thomas.bernard@gmail.com ou 06 55 44 33 22"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Demo presets for Parent */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      Comptes parents préenregistrés pour {selectedSchoolState.name} :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {parents.filter(p => p.schoolId === selectedSchoolState.id).map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setParentIdentifier(p.email);
                            handleParentSearch(p.email);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 text-xs font-medium transition flex items-center gap-1.5"
                        >
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-400">({p.childrenIds.length} enfant(s))</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    id="btn-parent-search"
                    onClick={() => handleParentSearch()}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Afficher mes enfants inscrits</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 3. PARCOURS ÉLÈVE CONTENT */}
              {selectedRoleType === 'student' && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 leading-relaxed">
                    <strong className="font-semibold block mb-1">Parcours Élève (De la 2ème à la 6ème année) :</strong>
                    L’élève saisit son identifiant et accède <strong>uniquement à la partie Classe</strong> pour consulter ses travaux pratiques (TP).
                    <div className="mt-1 text-[11px] text-indigo-700 font-medium">
                      💡 <strong>Spécificité 6ème année :</strong> Les élèves de 6ème ont également accès aux groupes inter-écoles créés par leur professeur titulaire.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Numéro de téléphone ou Adresse e-mail ou Matricule de l'élève :
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="input-student-identifier"
                        type="text"
                        value={studentIdentifier}
                        onChange={e => setStudentIdentifier(e.target.value)}
                        placeholder="Ex: 07 11 22 33 44 ou lucas.bernard@eleve.st-exupery.edu"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Demo presets for Student */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      Élèves disponibles pour test sur cet établissement :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {students.filter(s => s.schoolId === selectedSchoolState.id).map(st => {
                        const stClass = classes.find(c => c.id === st.classId);
                        return (
                          <button
                            key={st.id}
                            onClick={() => {
                              setStudentIdentifier(st.phone);
                              handleStudentLogin(st.phone);
                            }}
                            className="p-2 text-left rounded-lg bg-white border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/50 transition text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">{st.name}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                st.gradeLevel === 6 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {st.gradeLevel}ème année {st.gradeLevel === 6 && '★ Inter-écoles'}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{stClass?.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    id="btn-student-login"
                    onClick={() => handleStudentLogin()}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Accéder à mon espace Classe (TPs)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* PROFESSEUR LOGIN */}
              {selectedRoleType === 'teacher' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                    <strong className="font-semibold block mb-1">Règles Spécifiques Professeurs :</strong>
                    Le professeur titulaire possède des droits spécifiques d'écriture pour les <strong>Progrès</strong>, les <strong>Points</strong> et les <strong>Groupes Inter-Écoles (6ème)</strong>.
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Sélectionnez votre profil enseignant pour vous connecter :
                    </span>
                    {teachers.filter(t => t.schoolId === selectedSchoolState.id).map(teacher => {
                      const titularClass = teacher.titularClassId ? classes.find(c => c.id === teacher.titularClassId) : null;
                      return (
                        <div
                          key={teacher.id}
                          onClick={() => {
                            loginDirectly(teacher, selectedSchoolState.id);
                            if (onClose) onClose();
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">{teacher.name}</h4>
                              {titularClass ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  ★ Titulaire {titularClass.name}
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  Enseignant
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Discipline : {teacher.subject}</p>
                          </div>

                          <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold group-hover:bg-emerald-700 transition">
                            Se connecter
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DIRIGEANT / SCHOOL ADMIN */}
              {selectedRoleType === 'school_admin' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                    <strong className="font-semibold block mb-1">Administrateur (Dirigeant de l'école) :</strong>
                    Gère uniquement son établissement. Droits exclusifs : publication dans <strong>Communication</strong>, gestion de la zone de <strong>Contact Prof + Dirigeant</strong>, et du <strong>Groupe de l'école</strong>.
                  </div>

                  {schoolAdmins.filter(a => a.schoolId === selectedSchoolState.id).map(admin => (
                    <div
                      key={admin.id}
                      onClick={() => {
                        loginDirectly(admin, selectedSchoolState.id);
                        if (onClose) onClose();
                      }}
                      className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-blue-950">{admin.name}</h4>
                        <p className="text-xs text-blue-800">{admin.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{admin.email} • {admin.phone}</p>
                      </div>

                      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-xs">
                        Connexion Dirigeant
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SUPER ADMIN */}
              {selectedRoleType === 'super_admin' && (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
                    <strong className="font-semibold block mb-1">Super Administrateur (Vous) :</strong>
                    Contrôle total et absolu de l'ensemble de la plateforme. Inscription des dirigeants d'école et des enseignants, gestion multi-établissements.
                  </div>

                  {superAdmins.map(admin => (
                    <div
                      key={admin.id}
                      onClick={() => {
                        loginDirectly(admin, selectedSchoolState.id);
                        if (onClose) onClose();
                      }}
                      className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-purple-950">{admin.name}</h4>
                        <p className="text-xs text-purple-800">Supervision Globale de la Plateforme</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{admin.email}</p>
                      </div>

                      <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition shadow-xs">
                        Connexion Super Admin
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3 : SÉLECTION DE L'ENFANT PAR LE PARENT ================= */}
          {step === 3 && foundParent && selectedSchoolState && (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Bienvenue, {foundParent.name}</h3>
                  <p className="text-xs text-slate-500">
                    Voici la liste de vos enfants inscrits au sein de {selectedSchoolState.name}.
                  </p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 mb-4">
                <strong>Sélectionnez l’enfant concerné</strong> pour accéder à son tableau de bord : Communication, Progrès de l’élève, Points de l’élève et Contacts.
              </div>

              <div className="space-y-3">
                {foundChildren.map(child => {
                  const childClass = classes.find(c => c.id === child.classId);
                  return (
                    <div
                      key={child.id}
                      onClick={() => handleSelectChildAndFinish(child.id)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-bold flex items-center justify-center text-lg">
                          👦
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-950">{child.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {child.gradeLevel}ème année
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Classe : <strong className="text-slate-700">{childClass?.name}</strong> • Titulaire : {childClass?.titularTeacherName}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Matricule : {child.matricule}
                          </p>
                        </div>
                      </div>

                      <button
                        id={`btn-parent-select-child-${child.id}`}
                        className="px-4 py-2 rounded-xl bg-amber-600 group-hover:bg-amber-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Consulter son dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

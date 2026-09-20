import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Building2,
  GraduationCap,
  Users,
  PlusCircle,
  CheckCircle2,
  Search,
  Globe2,
  Layers,
  School as SchoolIcon,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { School, TeacherUser } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const {
    schools,
    classes,
    schoolAdmins,
    teachers,
    students,
    parents,
    interSchoolGroups,
    registerSchool,
    registerTeacherByAdmin
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'teachers' | 'inter_school'>('overview');
  
  // New School Form Modal
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    logoBadge: '🏫',
    foundedYear: 2026,
    directorName: '',
    directorEmail: '',
    directorPhone: '',
    directorTitle: 'Directeur Général'
  });

  // New Teacher Form Modal
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    schoolId: schools[0]?.id || '',
    subject: 'Sciences & Mathématiques',
    assignedClassId: '',
    isTitular: false
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolForm.name || !schoolForm.directorName || !schoolForm.directorEmail) {
      setStatusMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires de l’école et du dirigeant.' });
      return;
    }

    const res = registerSchool(
      {
        name: schoolForm.name,
        code: schoolForm.code || `ECOLE-${Math.floor(1000 + Math.random() * 9000)}`,
        city: schoolForm.city || 'Paris',
        address: schoolForm.address || 'Adresse principale',
        phone: schoolForm.phone || '01 00 00 00 00',
        email: schoolForm.email || 'direction@nouvelle-ecole.edu',
        logoBadge: schoolForm.logoBadge,
        foundedYear: Number(schoolForm.foundedYear) || 2026,
        directorName: schoolForm.directorName,
        directorEmail: schoolForm.directorEmail,
        directorPhone: schoolForm.directorPhone
      },
      {
        name: schoolForm.directorName,
        email: schoolForm.directorEmail,
        phone: schoolForm.directorPhone,
        title: schoolForm.directorTitle
      }
    );

    setStatusMessage({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowAddSchool(false);
      setSchoolForm({
        name: '',
        code: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        logoBadge: '🏫',
        foundedYear: 2026,
        directorName: '',
        directorEmail: '',
        directorPhone: '',
        directorTitle: 'Directeur Général'
      });
    }
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.email || !teacherForm.schoolId) {
      setStatusMessage({ type: 'error', text: 'Veuillez renseigner le nom, l’email et l’école de l’enseignant.' });
      return;
    }

    const res = registerTeacherByAdmin({
      name: teacherForm.name,
      email: teacherForm.email,
      phone: teacherForm.phone || '06 00 00 00 00',
      schoolId: teacherForm.schoolId,
      subject: teacherForm.subject,
      assignedClassIds: teacherForm.assignedClassId ? [teacherForm.assignedClassId] : [],
      titularClassId: teacherForm.isTitular && teacherForm.assignedClassId ? teacherForm.assignedClassId : undefined
    });

    setStatusMessage({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowAddTeacher(false);
      setTeacherForm({
        name: '',
        email: '',
        phone: '',
        schoolId: schools[0]?.id || '',
        subject: 'Sciences & Mathématiques',
        assignedClassId: '',
        isTitular: false
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 shadow-md border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Console Super Administrateur</h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[11px] font-semibold">
                  Contrôle Total & Absolu
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1 max-w-2xl">
                Vous disposez des pleins pouvoirs sur l'ensemble de la plateforme. Vous gérez l'inscription des dirigeants d'école (Administrateurs), des enseignants et la supervision inter-établissements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-school"
              onClick={() => { setShowAddSchool(true); setStatusMessage(null); }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Inscrire une École & Dirigeant</span>
            </button>

            <button
              id="btn-add-teacher"
              onClick={() => { setShowAddTeacher(true); setStatusMessage(null); }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Inscrire un Enseignant</span>
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-purple-700/50 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-purple-300 block text-[11px]">Établissements Actifs</span>
            <strong className="text-xl font-extrabold text-white">{schools.length}</strong>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-purple-300 block text-[11px]">Dirigeants d'Écoles</span>
            <strong className="text-xl font-extrabold text-white">{schoolAdmins.length}</strong>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-purple-300 block text-[11px]">Enseignants Enregistrés</span>
            <strong className="text-xl font-extrabold text-white">{teachers.length}</strong>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-purple-300 block text-[11px]">Élèves Inscrits (2e - 6e)</span>
            <strong className="text-xl font-extrabold text-white">{students.length}</strong>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Vue d'ensemble des Écoles ({schools.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'teachers'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Gestion des Enseignants & Titulaires ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab('inter_school')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'inter_school'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Groupes Inter-Écoles (6ème Année) ({interSchoolGroups.length})
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & SCHOOLS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schools.map(school => {
            const schoolDirector = schoolAdmins.find(a => a.schoolId === school.id);
            const schoolTeachers = teachers.filter(t => t.schoolId === school.id);
            const schoolStudents = students.filter(s => s.schoolId === school.id);
            const schoolClasses = classes.filter(c => c.schoolId === school.id);

            return (
              <div key={school.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl">
                      {school.logoBadge}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{school.name}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {school.code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Dirigeant(e) :</span>
                    <strong className="text-slate-800 font-semibold">{school.directorName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Contact Direction :</span>
                    <span className="text-slate-700">{school.directorEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Ville :</span>
                    <span className="text-slate-700">{school.city}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-400 text-[10px] block">Classes</span>
                    <strong className="font-bold text-slate-800">{schoolClasses.length}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-400 text-[10px] block">Profs</span>
                    <strong className="font-bold text-slate-800">{schoolTeachers.length}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-400 text-[10px] block">Élèves</span>
                    <strong className="font-bold text-slate-800">{schoolStudents.length}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TEACHERS MANAGEMENT */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registre des Enseignants de la Plateforme</h3>
              <p className="text-xs text-slate-500">Inscrits et habilités par le Super Administrateur</p>
            </div>
            <button
              onClick={() => setShowAddTeacher(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nouvel Enseignant</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Professeur</th>
                  <th className="py-3 px-4">Établissement</th>
                  <th className="py-3 px-4">Matière / Spécialité</th>
                  <th className="py-3 px-4">Statut Titulaire</th>
                  <th className="py-3 px-4">Coordonnées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map(t => {
                  const sch = schools.find(s => s.id === t.schoolId);
                  const titularClass = t.titularClassId ? classes.find(c => c.id === t.titularClassId) : null;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{t.name}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>{sch?.logoBadge}</span>
                          <span className="font-medium">{sch?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{t.subject}</td>
                      <td className="py-3 px-4">
                        {titularClass ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>Titulaire {titularClass.name}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Enseignant associé</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{t.email}</div>
                        <div className="text-[11px] text-slate-400">{t.phone}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INTER-SCHOOL GROUPS */}
      {activeTab === 'inter_school' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900">
            <strong className="font-bold block mb-1">Supervision des Groupes Inter-Écoles (Spécificité 6ème Année) :</strong>
            Les groupes inter-écoles réunissent des classes de différents établissements pour des projets communs.
            Bien que le Super Administrateur en ait la supervision globale, <em>"la création et la gestion de ces groupes et classes restent sous le contrôle exclusif de leur professeur titulaire."</em>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interSchoolGroups.map(group => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                    Cycle 6ème Année • Réseau Partenaire
                  </span>
                  <span className="text-[11px] text-slate-400">Créé le {group.createdAt}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{group.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{group.description}</p>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="text-slate-700">
                    <span className="text-slate-400 font-medium">Professeur Titulaire Initiateur : </span>
                    <strong>{group.leadTeacherName}</strong> ({group.leadSchoolName})
                  </div>
                  <div className="text-slate-700">
                    <span className="text-slate-400 font-medium">Thème : </span>
                    <span>{group.theme}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Classes Participantes ({group.participatingClasses.length}) :
                  </span>
                  <div className="space-y-1.5">
                    {group.participatingClasses.map((cls, idx) => (
                      <div key={idx} className="p-2 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-slate-900">{cls.className}</strong>
                          <span className="text-slate-500 block text-[11px]">{cls.schoolName}</span>
                        </div>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Titulaire : {cls.titularTeacherName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD SCHOOL & DIRECTOR */}
      {showAddSchool && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Inscrire un Établissement & son Dirigeant</h3>
              </div>
              <button onClick={() => setShowAddSchool(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Nom de l'Établissement *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.name}
                    onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })}
                    placeholder="Ex: Collège International Victor Hugo"
                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Code Établissement</label>
                  <input
                    type="text"
                    value={schoolForm.code}
                    onChange={e => setSchoolForm({ ...schoolForm, code: e.target.value })}
                    placeholder="Ex: HUGO-75004"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ville</label>
                  <input
                    type="text"
                    value={schoolForm.city}
                    onChange={e => setSchoolForm({ ...schoolForm, city: e.target.value })}
                    placeholder="Ex: Paris"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Adresse Complète</label>
                  <input
                    type="text"
                    value={schoolForm.address}
                    onChange={e => setSchoolForm({ ...schoolForm, address: e.target.value })}
                    placeholder="Ex: 12 Rue des Écoles"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-purple-900 mb-2">Informations du Dirigeant (Administrateur d'École)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Nom complet du Dirigeant *</label>
                    <input
                      type="text"
                      required
                      value={schoolForm.directorName}
                      onChange={e => setSchoolForm({ ...schoolForm, directorName: e.target.value })}
                      placeholder="Ex: Madame Hélène Mercier"
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Officiel *</label>
                    <input
                      type="email"
                      required
                      value={schoolForm.directorEmail}
                      onChange={e => setSchoolForm({ ...schoolForm, directorEmail: e.target.value })}
                      placeholder="direction@victor-hugo.edu"
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Téléphone de Direction</label>
                    <input
                      type="text"
                      value={schoolForm.directorPhone}
                      onChange={e => setSchoolForm({ ...schoolForm, directorPhone: e.target.value })}
                      placeholder="06 01 02 03 04"
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSchool(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
                >
                  Valider l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TEACHER */}
      {showAddTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Inscrire un Nouvel Enseignant</h3>
              </div>
              <button onClick={() => setShowAddTeacher(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom complet du Professeur *</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="Ex: Paul Martin"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Académique *</label>
                  <input
                    type="email"
                    required
                    value={teacherForm.email}
                    onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    placeholder="paul.martin@academie.edu"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={teacherForm.phone}
                    onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Établissement d'Affectation *</label>
                <select
                  value={teacherForm.schoolId}
                  onChange={e => setTeacherForm({ ...teacherForm, schoolId: e.target.value, assignedClassId: '' })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Discipline Enseignée</label>
                <input
                  type="text"
                  value={teacherForm.subject}
                  onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                  placeholder="Ex: Sciences Physiques, Français, etc."
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Classe Assignée</label>
                <select
                  value={teacherForm.assignedClassId}
                  onChange={e => setTeacherForm({ ...teacherForm, assignedClassId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                >
                  <option value="">-- Aucune classe spécifique --</option>
                  {classes.filter(c => c.schoolId === teacherForm.schoolId).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.gradeLevel}ème année)</option>
                  ))}
                </select>
              </div>

              {teacherForm.assignedClassId && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={teacherForm.isTitular}
                      onChange={e => setTeacherForm({ ...teacherForm, isTitular: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-bold text-purple-950">
                      Nommer ce professeur comme TITULAIRE de cette classe
                    </span>
                  </label>
                  <p className="text-[11px] text-purple-800 mt-1 pl-5">
                    Le titulaire possède les droits exclusifs d'inscription pour le <strong>Progrès de l'élève</strong>, les <strong>Points</strong> et les <strong>Groupes inter-écoles (6ème)</strong>.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
                >
                  Enregistrer l'Enseignant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

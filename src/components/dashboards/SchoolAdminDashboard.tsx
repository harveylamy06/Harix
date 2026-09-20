import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Megaphone,
  PhoneCall,
  Users2,
  GraduationCap,
  Users,
  PlusCircle,
  AlertCircle,
  Clock,
  Pin,
  Heart,
  Trash2,
  Send,
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { SchoolAdminUser } from '../../types';

export const SchoolAdminDashboard: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    schools,
    classes,
    teachers,
    students,
    parents,
    communications,
    contactChannels,
    schoolGroupPosts,
    publishCommunication,
    deleteCommunication,
    addContactChannel,
    deleteContactChannel,
    publishSchoolGroupPost,
    registerStudentByAdmin
  } = useApp();

  const [activeTab, setActiveTab] = useState<'communication' | 'contacts' | 'community' | 'students'>('communication');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Target school is either current user's school or selected school
  const mySchoolId = (currentUser as SchoolAdminUser)?.schoolId || currentSchool?.id || 'school-1';
  const mySchool = schools.find(s => s.id === mySchoolId) || schools[0];

  // Filtered data for this school only ("Gère uniquement son établissement")
  const schoolCommunications = communications.filter(c => c.schoolId === mySchoolId);
  const schoolContacts = contactChannels.filter(c => c.schoolId === mySchoolId);
  const schoolPosts = schoolGroupPosts.filter(p => p.schoolId === mySchoolId);
  const schoolTeachers = teachers.filter(t => t.schoolId === mySchoolId);
  const schoolStudents = students.filter(s => s.schoolId === mySchoolId);
  const schoolParents = parents.filter(p => p.schoolId === mySchoolId);
  const schoolClasses = classes.filter(c => c.schoolId === mySchoolId);

  // Communication Form Modal
  const [showCommModal, setShowCommModal] = useState(false);
  const [commForm, setCommForm] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
    targetAudience: 'all' as 'all' | 'parents' | 'teachers' | 'students'
  });

  // Contact Form Modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    category: 'direction' as 'direction' | 'enseignant_titulaire' | 'secretariat' | 'urgence',
    title: '',
    contactPerson: '',
    email: '',
    phone: '',
    availabilityHours: '',
    location: '',
    guidelines: ''
  });

  // School Group Post Modal
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityForm, setCommunityForm] = useState({
    title: '',
    body: '',
    category: 'Vie Scolaire' as 'Événement' | 'Projet Éducatif' | 'Vie Scolaire' | 'Annonce',
    isPinned: false
  });

  // Student Registration Modal
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    classId: schoolClasses[0]?.id || '',
    gradeLevel: schoolClasses[0]?.gradeLevel || 6,
    matricule: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  });

  // Handlers
  const handlePublishComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commForm.title || !commForm.content) {
      setFeedback({ type: 'error', text: 'Veuillez saisir un titre et un contenu pour le message.' });
      return;
    }
    const res = publishCommunication(commForm);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowCommModal(false);
      setCommForm({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.title || !contactForm.contactPerson) {
      setFeedback({ type: 'error', text: 'Veuillez renseigner au moins le titre et le nom du contact.' });
      return;
    }
    const res = addContactChannel(contactForm);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowContactModal(false);
      setContactForm({
        category: 'direction',
        title: '',
        contactPerson: '',
        email: '',
        phone: '',
        availabilityHours: '',
        location: '',
        guidelines: ''
      });
    }
  };

  const handlePublishCommunityPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityForm.title || !communityForm.body) {
      setFeedback({ type: 'error', text: 'Veuillez remplir le titre et le texte de l’actualité.' });
      return;
    }
    const res = publishSchoolGroupPost(communityForm);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowCommunityModal(false);
      setCommunityForm({ title: '', body: '', category: 'Vie Scolaire', isPinned: false });
    }
  };

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.classId) {
      setFeedback({ type: 'error', text: 'Veuillez saisir le nom de l’élève et choisir sa classe.' });
      return;
    }
    const selectedCls = schoolClasses.find(c => c.id === studentForm.classId);
    const grade = selectedCls ? selectedCls.gradeLevel : studentForm.gradeLevel;

    const res = registerStudentByAdmin(
      {
        name: studentForm.name,
        email: studentForm.email || `${studentForm.name.toLowerCase().replace(/\s+/g, '.')}@eleve.${mySchool.code.toLowerCase()}.edu`,
        phone: studentForm.phone || '07 00 00 00 00',
        schoolId: mySchoolId,
        classId: studentForm.classId,
        gradeLevel: grade,
        parentId: '',
        matricule: studentForm.matricule || `${mySchool.code}-${grade}A-${Math.floor(10 + Math.random() * 89)}`
      },
      studentForm.parentName
        ? {
            name: studentForm.parentName,
            email: studentForm.parentEmail || `${studentForm.parentName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
            phone: studentForm.parentPhone || '06 00 00 00 00'
          }
        : undefined
    );

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowStudentModal(false);
      setStudentForm({
        name: '',
        email: '',
        phone: '',
        classId: schoolClasses[0]?.id || '',
        gradeLevel: schoolClasses[0]?.gradeLevel || 6,
        matricule: '',
        parentName: '',
        parentEmail: '',
        parentPhone: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-sky-950 to-slate-900 text-white p-6 shadow-md border border-blue-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Portail Direction & Administration</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-semibold">
                  Dirigeant d'École
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Établissement : <strong className="text-white font-semibold">{mySchool.name}</strong> ({mySchool.city})
                • Gestion exclusive des professeurs, parents et élèves de votre école.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-admin-publish-comm"
              onClick={() => { setShowCommModal(true); setFeedback(null); }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>Publier Communication</span>
            </button>

            <button
              id="btn-admin-add-student"
              onClick={() => { setShowStudentModal(true); setFeedback(null); }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Inscrire Élève & Parent</span>
            </button>
          </div>
        </div>

        {/* School KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-blue-800/60 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-blue-300 block text-[11px]">Enseignants de l'École</span>
            <strong className="text-xl font-extrabold text-white">{schoolTeachers.length}</strong>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-blue-300 block text-[11px]">Élèves Inscrits (2e - 6e)</span>
            <strong className="text-xl font-extrabold text-white">{schoolStudents.length}</strong>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-blue-300 block text-[11px]">Familles & Parents</span>
            <strong className="text-xl font-extrabold text-white">{schoolParents.length}</strong>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-blue-300 block text-[11px]">Classes de l'École</span>
            <strong className="text-xl font-extrabold text-white">{schoolClasses.length}</strong>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4 text-xs font-semibold">
          <button
            id="tab-admin-comm"
            onClick={() => setActiveTab('communication')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'communication'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Communication Officielle (Droit Exclusif) ({schoolCommunications.length})</span>
          </button>

          <button
            id="tab-admin-contacts"
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact Prof + Dirigeant (Géré par Dirigeant) ({schoolContacts.length})</span>
          </button>

          <button
            id="tab-admin-community"
            onClick={() => setActiveTab('community')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>Groupe de l'école ({schoolPosts.length})</span>
          </button>

          <button
            id="tab-admin-students"
            onClick={() => setActiveTab('students')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Élèves & Parents de l'Établissement ({schoolStudents.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: COMMUNICATION (SEUL LE DIRIGEANT PUBLIE) ================= */}
      {activeTab === 'communication' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Règle de gouvernance :</strong> Seul l'Administrateur (dirigeant) a le droit de publier des messages dans la section Communication. Les parents, enseignants et élèves y ont un accès en lecture.
              </span>
            </div>
            <button
              onClick={() => setShowCommModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shrink-0 ml-2"
            >
              + Nouveau Message
            </button>
          </div>

          <div className="space-y-3">
            {schoolCommunications.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Aucun message officiel publié pour le moment.
              </div>
            ) : (
              schoolCommunications.map(comm => (
                <div key={comm.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            comm.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : comm.priority === 'important'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {comm.priority.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          Diffusé à : {comm.targetAudience === 'all' ? 'Toute la communauté' : comm.targetAudience}
                        </span>
                        <span className="text-[11px] text-slate-400">• {comm.publishedAt}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 mt-2">{comm.title}</h3>
                    </div>

                    <button
                      onClick={() => deleteCommunication(comm.id)}
                      title="Supprimer ce message officiel"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {comm.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Auteur certifié : <strong className="text-slate-700">{comm.authorName}</strong> ({comm.authorRole})</span>
                    <span className="text-emerald-700 font-medium">✓ Visible par les familles & élèves</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CONTACT PROF + DIRIGEANT (GÉRÉ EXCLUSIVEMENT PAR DIRIGEANT) ================= */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Règle de gouvernance :</strong> Zone de contact Prof + Dirigeant gérée exclusivement par l'Administrateur. Vous définissez les canaux officiels, permanences et coordonnées accessibles aux parents.
              </span>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shrink-0 ml-2"
            >
              + Configurer un Canal de Contact
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schoolContacts.map(contact => (
              <div key={contact.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {contact.category.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-2">{contact.title}</h4>
                      <p className="text-xs text-slate-600 font-medium">{contact.contactPerson}</p>
                    </div>

                    <button
                      onClick={() => deleteContactChannel(contact.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div><strong>Email :</strong> {contact.email}</div>
                    <div><strong>Téléphone :</strong> {contact.phone}</div>
                    <div><strong>Permanences :</strong> {contact.availabilityHours}</div>
                    <div><strong>Lieu / Bureau :</strong> {contact.location}</div>
                  </div>

                  {contact.guidelines && (
                    <p className="text-[11px] text-slate-500 italic mt-2.5">
                      Instructions aux familles : {contact.guidelines}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Configuration validée</span>
                  <span className="text-blue-600 font-medium">Actif sur portail parents</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: GROUPE DE L'ÉCOLE (ESPACE COMMUNAUTAIRE) ================= */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Règle de gouvernance :</strong> Groupe de l'école : Espace communautaire officiel géré et modéré par l'Administrateur.
              </span>
            </div>
            <button
              onClick={() => setShowCommunityModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shrink-0 ml-2"
            >
              + Publier dans le Groupe
            </button>
          </div>

          <div className="space-y-3">
            {schoolPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                    {post.isPinned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Épinglé
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {post.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-full">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{post.likesCount} mentions j'aime</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2">{post.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{post.body}</p>
                <div className="mt-3 text-[11px] text-slate-400">
                  Modéré et validé par : <strong className="text-slate-700">{post.authorName}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ÉLÈVES & PARENTS ================= */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Effectifs de l'Établissement</h3>
              <p className="text-xs text-slate-500">Classes de la 2ème à la 6ème année et comptes parents associés</p>
            </div>
            <button
              onClick={() => setShowStudentModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Inscrire un Élève</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Classe & Niveau</th>
                  <th className="py-3 px-4">Professeur Titulaire</th>
                  <th className="py-3 px-4">Parent Référent</th>
                  <th className="py-3 px-4">Matricule & Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolStudents.map(st => {
                  const cls = classes.find(c => c.id === st.classId);
                  const parent = parents.find(p => p.id === st.parentId);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{cls?.name}</div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          st.gradeLevel === 6 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.gradeLevel}ème année {st.gradeLevel === 6 && '★ Inter-écoles'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {cls?.titularTeacherName || 'Non assigné'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{parent?.name || 'Non rattaché'}</div>
                        <div className="text-[11px] text-slate-400">{parent?.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                          {st.matricule}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{st.phone}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH COMMUNICATION */}
      {showCommModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Publier une Communication Officielle</h3>
              </div>
              <button onClick={() => setShowCommModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishComm} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Titre de la Communication *</label>
                <input
                  type="text"
                  required
                  value={commForm.title}
                  onChange={e => setCommForm({ ...commForm, title: e.target.value })}
                  placeholder="Ex: Organisation des épreuves trimestrielles & calendrier"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Niveau d'Urgence / Priorité</label>
                  <select
                    value={commForm.priority}
                    onChange={e => setCommForm({ ...commForm, priority: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="normal">Normale</option>
                    <option value="important">Importante</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Public Cible</label>
                  <select
                    value={commForm.targetAudience}
                    onChange={e => setCommForm({ ...commForm, targetAudience: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="all">Toute la communauté (Tous)</option>
                    <option value="parents">Parents uniquement</option>
                    <option value="teachers">Professeurs uniquement</option>
                    <option value="students">Élèves uniquement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contenu Officiel du Message *</label>
                <textarea
                  required
                  rows={4}
                  value={commForm.content}
                  onChange={e => setCommForm({ ...commForm, content: e.target.value })}
                  placeholder="Rédigez la communication officielle de la direction..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900">
                Ce message portera votre signature officielle : <strong>{currentUser?.name}</strong> (Administrateur Dirigeant).
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCommModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Diffuser la Communication</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTACT CHANNEL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Configurer un Canal de Contact Officiel</h3>
              </div>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catégorie</label>
                <select
                  value={contactForm.category}
                  onChange={e => setContactForm({ ...contactForm, category: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                >
                  <option value="direction">Direction Générale</option>
                  <option value="enseignant_titulaire">Pôle Professeurs Titulaires</option>
                  <option value="secretariat">Secrétariat & Vie Scolaire</option>
                  <option value="urgence">Permanence & Urgence</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Intitulé du Service / Poste *</label>
                <input
                  type="text"
                  required
                  value={contactForm.title}
                  onChange={e => setContactForm({ ...contactForm, title: e.target.value })}
                  placeholder="Ex: Accueil Direction Pédagogique"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Personne Référente *</label>
                <input
                  type="text"
                  required
                  value={contactForm.contactPerson}
                  onChange={e => setContactForm({ ...contactForm, contactPerson: e.target.value })}
                  placeholder="Ex: Mme Claire Morel (Directrice)"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="contact@ecole.edu"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="01 23 45 67 89"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Horaires d'Ouverture / Permanences</label>
                <input
                  type="text"
                  value={contactForm.availabilityHours}
                  onChange={e => setContactForm({ ...contactForm, availabilityHours: e.target.value })}
                  placeholder="Ex: Lundi au Vendredi : 08h30 - 12h00 | 14h00 - 17h30"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Localisation / Bureau</label>
                <input
                  type="text"
                  value={contactForm.location}
                  onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                  placeholder="Ex: Bâtiment A, Bureau 101"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Enregistrer Canal de Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COMMUNITY POST */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Publier dans le Groupe de l'École</h3>
              </div>
              <button onClick={() => setShowCommunityModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishCommunityPost} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Titre de l'Actualité *</label>
                <input
                  type="text"
                  required
                  value={communityForm.title}
                  onChange={e => setCommunityForm({ ...communityForm, title: e.target.value })}
                  placeholder="Ex: Exposition des projets scientifiques de nos élèves"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Catégorie</label>
                  <select
                    value={communityForm.category}
                    onChange={e => setCommunityForm({ ...communityForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="Vie Scolaire">Vie Scolaire</option>
                    <option value="Projet Éducatif">Projet Éducatif</option>
                    <option value="Événement">Événement</option>
                    <option value="Annonce">Annonce Communautaire</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={communityForm.isPinned}
                      onChange={e => setCommunityForm({ ...communityForm, isPinned: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Épingler en haut</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Texte de la Publication *</label>
                <textarea
                  required
                  rows={4}
                  value={communityForm.body}
                  onChange={e => setCommunityForm({ ...communityForm, body: e.target.value })}
                  placeholder="Partagez les actualités de la vie scolaire..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCommunityModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER STUDENT & PARENT */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Inscrire un Élève & son Parent</h3>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom et Prénom de l'Élève *</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Ex: Maxime Girard"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Classe d'Affectation *</label>
                  <select
                    value={studentForm.classId}
                    onChange={e => {
                      const cls = schoolClasses.find(c => c.id === e.target.value);
                      setStudentForm({
                        ...studentForm,
                        classId: e.target.value,
                        gradeLevel: cls ? cls.gradeLevel : 6
                      });
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    {schoolClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.gradeLevel}ème année)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Téléphone de l'Élève</label>
                  <input
                    type="text"
                    value={studentForm.phone}
                    onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                    placeholder="07 00 11 22 33"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Parent / Responsable Légal Référent</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Nom du Parent</label>
                    <input
                      type="text"
                      value={studentForm.parentName}
                      onChange={e => setStudentForm({ ...studentForm, parentName: e.target.value })}
                      placeholder="Ex: Carole Girard"
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email du Parent</label>
                    <input
                      type="email"
                      value={studentForm.parentEmail}
                      onChange={e => setStudentForm({ ...studentForm, parentEmail: e.target.value })}
                      placeholder="carole.girard@email.fr"
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Téléphone du Parent</label>
                    <input
                      type="text"
                      value={studentForm.parentPhone}
                      onChange={e => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                      placeholder="06 55 66 77 88"
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Inscrire l'Élève
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

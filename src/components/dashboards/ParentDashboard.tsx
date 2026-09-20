import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Megaphone,
  Award,
  TrendingUp,
  PhoneCall,
  School as SchoolIcon,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { ParentUser, StudentUser } from '../../types';
import { ParentDailyLifePanel } from '../daily_life/ParentDailyLifePanel';

export const ParentDashboard: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    students,
    classes,
    teachers,
    communications,
    progressEvaluations,
    cardSignatures,
    disciplinarySanctions,
    parentInvitations,
    grades,
    contactChannels,
    selectedChild,
    setSelectedChildId
  } = useApp();

  const parent = currentUser as ParentUser;
  const [activeTab, setActiveTab] = useState<'communication' | 'progress' | 'points' | 'contacts'>('communication');

  // Find all children belonging to this parent in current school
  const myChildren = students.filter(s => parent?.childrenIds?.includes(s.id));
  const activeChild = selectedChild || myChildren[0];

  // Active child's class and titular teacher
  const childClass = activeChild ? classes.find(c => c.id === activeChild.classId) : null;
  const childSchoolId = activeChild ? activeChild.schoolId : (currentSchool?.id || 'school-1');

  // Filtered data for this child
  const childCommunications = communications.filter(c => c.schoolId === childSchoolId && (c.targetAudience === 'all' || c.targetAudience === 'parents'));
  const childProgress = activeChild ? progressEvaluations.filter(p => p.studentId === activeChild.id) : [];
  const childGrades = activeChild ? grades.filter(g => g.studentId === activeChild.id) : [];
  const childContacts = contactChannels.filter(c => c.schoolId === childSchoolId);

  // Calculate student average
  const totalWeightedScore = childGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 20 * g.coefficient, 0);
  const totalCoefficients = childGrades.reduce((acc, g) => acc + g.coefficient, 0);
  const averageGrade = totalCoefficients > 0 ? (totalWeightedScore / totalCoefficients).toFixed(2) : 'N/A';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white p-6 shadow-md border border-amber-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Espace Famille & Parent d'Élève</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 text-[11px] font-semibold">
                  Accès Restreint Sécurisé
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-1">
                Parent référent : <strong className="text-white">{parent?.name}</strong> • {currentSchool?.name}
              </p>
            </div>
          </div>

          {/* Child Switcher if multiple children */}
          {myChildren.length > 1 && (
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
              <span className="text-xs text-amber-200 font-semibold block mb-1">
                Consulter le dossier de :
              </span>
              <div className="flex gap-2">
                {myChildren.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeChild?.id === child.id
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-black/30 hover:bg-black/50 text-slate-200'
                    }`}
                  >
                    <span>{child.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                      {child.gradeLevel}ème
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Child Details Strip */}
        {activeChild && (
          <div className="mt-5 pt-4 border-t border-amber-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs">
                👦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">{activeChild.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-300/30 text-amber-200 text-[10px] font-semibold">
                    {activeChild.gradeLevel}ème année {activeChild.gradeLevel === 6 && '(Cycle Sup)'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-200">
                  Classe : <strong className="text-white">{childClass?.name}</strong> • Salle : {childClass?.roomNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-amber-100">
              <div>
                <span className="text-amber-300/80 text-[10px] block">Professeur Titulaire</span>
                <strong className="text-white font-semibold">{childClass?.titularTeacherName}</strong>
              </div>
              <div className="border-l border-amber-700/60 pl-4">
                <span className="text-amber-300/80 text-[10px] block">Moyenne Trimestre</span>
                <strong className="text-lg font-black text-amber-300">{averageGrade} / 20</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Main Functional Tabs specified by prompt: Communication, Progrès, Points, Contacts */}
      {(() => {
        const childCards = cardSignatures.filter(c => c.studentId === activeChild?.id && c.status !== 'SIGNEE');
        const childSanctions = disciplinarySanctions.filter(s => s.studentId === activeChild?.id && !s.acknowledgedByParent);
        const childInvitations = parentInvitations.filter(i => i.studentId === activeChild?.id && i.status === 'ENVOYEE');
        const totalAlerts = childCards.length + childSanctions.length + childInvitations.length;

        return (
          <div className="border-b border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 text-xs font-semibold gap-2">
              <button
                id="tab-parent-comm"
                onClick={() => setActiveTab('communication')}
                className={`pb-3 border-b-2 transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'communication'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>1. Communication ({childCommunications.length})</span>
              </button>

              <button
                id="tab-parent-progress"
                onClick={() => setActiveTab('progress')}
                className={`pb-3 border-b-2 transition flex items-center justify-center gap-1.5 relative ${
                  activeTab === 'progress'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>2. Progrès & Vie Scolaire</span>
                {totalAlerts > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold animate-pulse">
                    {totalAlerts}
                  </span>
                )}
              </button>

              <button
                id="tab-parent-points"
                onClick={() => setActiveTab('points')}
                className={`pb-3 border-b-2 transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'points'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>3. Points & Notes ({childGrades.length})</span>
              </button>

              <button
                id="tab-parent-contacts"
                onClick={() => setActiveTab('contacts')}
                className={`pb-3 border-b-2 transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'contacts'
                    ? 'border-amber-600 text-amber-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>4. Contact Prof + Dirigeant ({childContacts.length})</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* ================= ZONE 1 : COMMUNICATION ================= */}
      {activeTab === 'communication' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
            <div>
              <strong>Communication de l'établissement :</strong> Messages officiels publiés exclusivement par l'Administrateur (dirigeant de l'école).
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
              Canal Officiel Direction
            </span>
          </div>

          <div className="space-y-3">
            {childCommunications.map(comm => (
              <div key={comm.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
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
                  <span className="text-[11px] text-slate-400">• {comm.publishedAt}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{comm.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {comm.content}
                </p>

                <div className="mt-3 text-[11px] text-slate-400">
                  Signé : <strong className="text-slate-700">{comm.authorName}</strong> ({comm.authorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ZONE 2 : PROGRÈS DE L'ÉLÈVE ================= */}
      {activeTab === 'progress' && activeChild && (
        <div className="space-y-6">
          {/* Daily Life Live Tracking (Signature de la carte, Conduite au jour le jour, Absences & retards, Invitations parents, Sanctions disciplinaires) */}
          <ParentDailyLifePanel child={activeChild} />

          {/* Qualitative Bilans / Observations */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950">
              <strong>Bilans Pédagogiques Trimestriels :</strong> Conformément aux règles de l'établissement, <em>"seul le professeur titulaire de la classe peut y inscrire les évaluations et suivis"</em> pour {activeChild.name}.
            </div>

            <div className="space-y-3">
              {childProgress.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  Aucun bilan pédagogique consigné pour l'instant pour cet enfant.
                </div>
              ) : (
                childProgress.map(prog => (
                  <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{prog.domain}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prog.rating === 'Remarquable'
                              ? 'bg-purple-100 text-purple-800'
                              : prog.rating === 'Très satisfaisant'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {prog.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{prog.date}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed mb-2.5">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-1">
                        Observation du professeur titulaire :
                      </span>
                      {prog.observation}
                    </div>

                    {prog.recommendation && (
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                        <strong>Conseil pour la famille :</strong> {prog.recommendation}
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Certifié par : <strong>{prog.teacherName}</strong></span>
                      <span className="text-emerald-700 font-medium">✓ Évaluation Titulaire</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ZONE 3 : POINTS DE L'ÉLÈVE ================= */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Points & Bulletin de Notes</h3>
              <p className="text-xs text-slate-500">Relevé détaillé des devoirs et évaluations de {activeChild?.name}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] text-amber-800 font-semibold block">Moyenne Générale</span>
              <strong className="text-lg font-black text-amber-950">{averageGrade} / 20</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Matière</th>
                  <th className="py-3 px-4">Évaluation / Contrôle</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Points Obtenus</th>
                  <th className="py-3 px-4 text-center">Coefficient</th>
                  <th className="py-3 px-4">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {childGrades.map(grade => {
                  const percentage = (grade.score / grade.maxScore) * 100;
                  return (
                    <tr key={grade.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{grade.subject}</td>
                      <td className="py-3 px-4 text-slate-700">{grade.evaluationTitle}</td>
                      <td className="py-3 px-4 text-slate-500">{grade.date}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-extrabold text-sm px-2.5 py-0.5 rounded-lg ${
                            percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {grade.score} / {grade.maxScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-600">x{grade.coefficient}</td>
                      <td className="py-3 px-4 text-slate-500 italic">{grade.comment || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ZONE 4 : CONTACT PROF + DIRIGEANT ================= */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950">
            <strong>Canaux de Contact Officiels :</strong> Zone de contact gérée exclusivement par l'Administrateur pour communiquer de manière encadrée avec la direction et le corps enseignant.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childContacts.map(contact => (
              <div key={contact.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                    {contact.category.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">{contact.title}</h4>
                  <p className="text-xs text-slate-600 font-medium">{contact.contactPerson}</p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.availabilityHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.location}</span>
                    </div>
                  </div>

                  {contact.guidelines && (
                    <p className="text-[11px] text-slate-500 italic mt-2.5">
                      Modalités : {contact.guidelines}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">✓ Canal officiel vérifié</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                  >
                    Envoyer un courriel
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

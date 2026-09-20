import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  PlusCircle,
  Lock,
  Globe2,
  Send,
  Sparkles,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Clock,
  Check,
  Building2
} from 'lucide-react';
import { TeacherUser, StudentUser, AssignmentTP } from '../../types';
import { TeacherDailyLifePanel } from '../daily_life/TeacherDailyLifePanel';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    schools,
    classes,
    students,
    progressEvaluations,
    grades,
    assignments,
    interSchoolGroups,
    addProgressEvaluation,
    addGrade,
    createAssignmentTP,
    gradeTP,
    createInterSchoolGroup,
    addProjectToInterSchoolGroup
  } = useApp();

  const teacher = currentUser as TeacherUser;
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Find classes the teacher manages or is titular of
  const teacherClasses = classes.filter(c =>
    isSuperAdmin ||
    c.titularTeacherId === teacher?.id ||
    teacher?.assignedClassIds?.includes(c.id) ||
    c.schoolId === teacher?.schoolId
  );

  const [selectedClassId, setSelectedClassId] = useState<string>(
    teacher?.titularClassId || teacherClasses[0]?.id || 'class-1-6a'
  );

  const selectedClass = classes.find(c => c.id === selectedClassId) || teacherClasses[0];
  const isTitularOfSelectedClass = isSuperAdmin || (teacher?.titularClassId === selectedClass?.id);
  const is6thGrade = selectedClass?.gradeLevel === 6;

  const [activeTab, setActiveTab] = useState<'progress' | 'points' | 'tps' | 'inter_school'>('progress');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Students in selected class
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // 1. Progress Form Modal / Drawer
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressForm, setProgressForm] = useState({
    studentId: classStudents[0]?.id || '',
    domain: 'Mathématiques & Raisonnement',
    rating: 'Très satisfaisant' as 'Remarquable' | 'Très satisfaisant' | 'En progrès' | 'Besoin de soutien',
    observation: '',
    recommendation: ''
  });

  // 2. Points Form Modal
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    studentId: classStudents[0]?.id || '',
    subject: teacher?.subject || 'Sciences',
    evaluationTitle: '',
    score: 16,
    maxScore: 20,
    coefficient: 1.5,
    term: 'Trimestre 1' as 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3',
    comment: ''
  });

  // 3. Assignment TP Form Modal
  const [showTPModal, setShowTPModal] = useState(false);
  const [tpForm, setTpForm] = useState({
    title: '',
    subject: teacher?.subject || 'Sciences',
    instructions: '',
    dueDate: '2026-10-05',
    isInterSchool: false,
    interSchoolGroupId: ''
  });

  // Grading TP Modal
  const [gradingTP, setGradingTP] = useState<{ tpId: string; sub: AssignmentTP['submissions'][0] } | null>(null);
  const [gradeTPScore, setGradeTPScore] = useState<number>(18);
  const [gradeTPComment, setGradeTPComment] = useState<string>('');

  // 4. Inter-School Group Modal (Spécificité 6ème)
  const [showInterGroupModal, setShowInterGroupModal] = useState(false);
  const [interGroupForm, setInterGroupForm] = useState({
    name: '',
    theme: 'Sciences, Environnement & Transition Écologique',
    description: '',
    partnerClassIds: [] as string[]
  });

  // Other 6th grade classes from different schools
  const other6thClasses = classes.filter(c => c.gradeLevel === 6 && c.id !== selectedClassId);

  // Handlers
  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressForm.studentId || !progressForm.observation) {
      setFeedback({ type: 'error', text: 'Veuillez sélectionner un élève et rédiger l’observation.' });
      return;
    }

    const res = addProgressEvaluation({
      studentId: progressForm.studentId,
      classId: selectedClassId,
      domain: progressForm.domain,
      rating: progressForm.rating,
      observation: progressForm.observation,
      recommendation: progressForm.recommendation
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowProgressModal(false);
      setProgressForm({
        studentId: classStudents[0]?.id || '',
        domain: 'Mathématiques & Raisonnement',
        rating: 'Très satisfaisant',
        observation: '',
        recommendation: ''
      });
    }
  };

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeForm.studentId || !gradeForm.evaluationTitle) {
      setFeedback({ type: 'error', text: 'Veuillez sélectionner l’élève et renseigner l’intitulé du contrôle.' });
      return;
    }

    const res = addGrade({
      studentId: gradeForm.studentId,
      classId: selectedClassId,
      subject: gradeForm.subject,
      evaluationTitle: gradeForm.evaluationTitle,
      score: Number(gradeForm.score),
      maxScore: Number(gradeForm.maxScore),
      coefficient: Number(gradeForm.coefficient),
      term: gradeForm.term,
      comment: gradeForm.comment
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowGradeModal(false);
      setGradeForm({
        studentId: classStudents[0]?.id || '',
        subject: teacher?.subject || 'Sciences',
        evaluationTitle: '',
        score: 16,
        maxScore: 20,
        coefficient: 1.5,
        term: 'Trimestre 1',
        comment: ''
      });
    }
  };

  const handleCreateTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpForm.title || !tpForm.instructions) {
      setFeedback({ type: 'error', text: 'Veuillez renseigner le titre et les consignes du TP.' });
      return;
    }

    const res = createAssignmentTP({
      classId: selectedClassId,
      subject: tpForm.subject,
      title: tpForm.title,
      instructions: tpForm.instructions,
      dueDate: tpForm.dueDate,
      interSchoolGroupId: tpForm.isInterSchool && tpForm.interSchoolGroupId ? tpForm.interSchoolGroupId : undefined
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowTPModal(false);
      setTpForm({
        title: '',
        subject: teacher?.subject || 'Sciences',
        instructions: '',
        dueDate: '2026-10-05',
        isInterSchool: false,
        interSchoolGroupId: ''
      });
    }
  };

  const handleSaveGradeTP = () => {
    if (!gradingTP) return;
    const res = gradeTP(gradingTP.tpId, gradingTP.sub.studentId, gradeTPScore, gradeTPComment);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    setGradingTP(null);
    setGradeTPComment('');
  };

  const handleCreateInterGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interGroupForm.name || !interGroupForm.description) {
      setFeedback({ type: 'error', text: 'Veuillez remplir le nom et la description du groupe inter-écoles.' });
      return;
    }

    const res = createInterSchoolGroup({
      name: interGroupForm.name,
      description: interGroupForm.description,
      theme: interGroupForm.theme,
      partnerClassIds: interGroupForm.partnerClassIds
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setShowInterGroupModal(false);
      setInterGroupForm({
        name: '',
        theme: 'Sciences, Environnement & Transition Écologique',
        description: '',
        partnerClassIds: []
      });
    }
  };

  // Data for current class
  const classProgress = progressEvaluations.filter(p => p.classId === selectedClassId);
  const classGrades = grades.filter(g => g.classId === selectedClassId);
  const classTPs = assignments.filter(a => a.classId === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 shadow-md border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Espace Enseignant & Titulaire</h1>
                {isTitularOfSelectedClass ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Titulaire de Classe (Droits d'écriture exclusifs)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[11px] font-medium">
                    Professeur Associé
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Professeur : <strong className="text-white">{currentUser?.name}</strong> • Discipline : {teacher?.subject}
              </p>
            </div>
          </div>

          {/* Class Switcher for teacher */}
          <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center gap-2">
            <span className="text-xs text-emerald-200 font-medium">Classe active :</span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {teacherClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.gradeLevel}ème année) {c.id === teacher?.titularClassId ? '★ Titulaire' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info rule summary */}
        <div className="mt-4 pt-4 border-t border-emerald-800/60 text-xs text-emerald-100/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Classe suivie : <strong>{selectedClass?.name}</strong> ({classStudents.length} élèves inscrits)
            </span>
          </div>

          {is6thGrade && (
            <div className="bg-purple-950/60 border border-purple-400/40 text-purple-200 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-purple-300" />
              <span>
                Classe de 6ème : Habilité à piloter les Groupes Inter-Écoles (création & TPs partagés)
              </span>
            </div>
          )}
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
        <div className="flex gap-4 text-xs font-semibold overflow-x-auto">
          <button
            id="tab-teacher-progress"
            onClick={() => setActiveTab('progress')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Progrès de l'Élève & Vie Scolaire Quotidienne (Alimenté chaque jour)</span>
          </button>

          <button
            id="tab-teacher-points"
            onClick={() => setActiveTab('points')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'points'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Points & Notes ({classGrades.length})</span>
          </button>

          <button
            id="tab-teacher-tps"
            onClick={() => setActiveTab('tps')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tps'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Travaux Pratiques (TP) & Dépôts ({classTPs.length})</span>
          </button>

          {is6thGrade && (
            <button
              id="tab-teacher-interschool"
              onClick={() => setActiveTab('inter_school')}
              className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'inter_school'
                  ? 'border-purple-600 text-purple-700 font-bold'
                  : 'border-transparent text-purple-600/80 hover:text-purple-900'
              }`}
            >
              <Globe2 className="w-4 h-4 text-purple-600" />
              <span>Groupes Inter-Écoles (Spécificité 6ème) ★</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: PROGRÈS DE L'ÉLÈVE & VIE SCOLAIRE ================= */}
      {activeTab === 'progress' && selectedClass && (
        <div className="space-y-6">
          {/* Daily Life Live Tracking Panel */}
          <TeacherDailyLifePanel
            selectedClass={selectedClass}
            classStudents={classStudents}
            isTitular={isTitularOfSelectedClass}
          />

          {/* Qualitative Bilans / Observations */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Bilans Pédagogiques & Compétences :</strong> Seul le professeur titulaire de la classe peut y inscrire les évaluations et recommandations générales.
                  {isTitularOfSelectedClass ? (
                    <span className="text-emerald-700 font-bold ml-1">
                      ✓ Vous êtes titulaire de {selectedClass?.name}.
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold ml-1">
                      ⚠️ Accès en consultation pour les enseignants non titulaires.
                    </span>
                  )}
                </span>
              </div>

              {isTitularOfSelectedClass && (
                <button
                  id="btn-add-progress-eval"
                  onClick={() => {
                    setProgressForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
                    setShowProgressModal(true);
                    setFeedback(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shrink-0 ml-2 shadow-xs"
                >
                  + Inscrire un Bilan Pédagogique
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classProgress.length === 0 ? (
                <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  Aucun bilan pédagogique enregistré pour cette classe.
                </div>
              ) : (
                classProgress.map(prog => {
                  const st = students.find(s => s.id === prog.studentId);
                  return (
                    <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-slate-900">{st?.name}</strong>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {prog.domain}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{prog.date}</span>
                        </div>

                        <div className="mb-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prog.rating === 'Remarquable'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : prog.rating === 'Très satisfaisant'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : prog.rating === 'En progrès'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            Évaluation : {prog.rating}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                            <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-1">
                              Observation du titulaire :
                            </span>
                            {prog.observation}
                          </div>

                          {prog.recommendation && (
                            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-900 text-[11px]">
                              <strong>Recommandation pédagogique :</strong> {prog.recommendation}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Rédigé par : <strong>{prog.teacherName}</strong></span>
                        <span className="text-emerald-700 font-medium">✓ Dossier élève certifié</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: POINTS DE L'ÉLÈVE ================= */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Points & Notes des Élèves</h3>
              <p className="text-xs text-slate-500">Section dédiée au suivi des notes d'évaluations et devoirs</p>
            </div>
            <button
              id="btn-add-grade"
              onClick={() => {
                setGradeForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
                setShowGradeModal(true);
                setFeedback(null);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Saisir une Note</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Matière & Épreuve</th>
                  <th className="py-3 px-4">Trimestre</th>
                  <th className="py-3 px-4 text-center">Points obtenus</th>
                  <th className="py-3 px-4 text-center">Coefficient</th>
                  <th className="py-3 px-4">Commentaire Enseignant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Aucune note enregistrée pour cette classe.
                    </td>
                  </tr>
                ) : (
                  classGrades.map(grade => {
                    const st = students.find(s => s.id === grade.studentId);
                    const percentage = (grade.score / grade.maxScore) * 100;
                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{st?.name}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{grade.subject}</div>
                          <div className="text-[11px] text-slate-500">{grade.evaluationTitle}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{grade.term}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block font-extrabold text-sm px-2.5 py-0.5 rounded-lg ${
                              percentage >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : percentage >= 60
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {grade.score} / {grade.maxScore}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-slate-600">x{grade.coefficient}</td>
                        <td className="py-3 px-4 text-slate-500 italic">{grade.comment || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRAVAUX PRATIQUES (TP) ================= */}
      {activeTab === 'tps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Travaux Pratiques (TP) de la Classe</h3>
              <p className="text-xs text-slate-500">Les élèves accèdent à cette section pour recevoir et consulter leurs TPs</p>
            </div>
            <button
              id="btn-create-tp"
              onClick={() => { setShowTPModal(true); setFeedback(null); }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Créer un TP</span>
            </button>
          </div>

          <div className="space-y-4">
            {classTPs.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Aucun Travail Pratique (TP) actif pour cette classe.
              </div>
            ) : (
              classTPs.map(tp => {
                const completedCount = tp.submissions.filter(s => s.status === 'RENDU' || s.status === 'CORRIGE').length;
                const isInter = Boolean(tp.interSchoolGroupId);
                return (
                  <div key={tp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {tp.subject}
                          </span>
                          {isInter && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Globe2 className="w-3 h-3" /> TP Inter-Écoles (6ème)
                            </span>
                          )}
                          <span className="text-xs text-slate-400">• Échéance : {tp.dueDate}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-2">{tp.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Remises : <strong>{completedCount} / {tp.submissions.length}</strong>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {tp.instructions}
                    </p>

                    {/* Student submissions list */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                        Suivi des remises des élèves :
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tp.submissions.map(sub => (
                          <div
                            key={sub.studentId}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                          >
                            <div>
                              <strong className="text-slate-900">{sub.studentName}</strong>
                              <div className="text-[11px] text-slate-500">
                                {sub.status === 'A_FAIRE' && <span className="text-amber-600">En attente de dépôt</span>}
                                {sub.status === 'RENDU' && <span className="text-blue-600 font-semibold">Rendu le {sub.submittedAt}</span>}
                                {sub.status === 'CORRIGE' && (
                                  <span className="text-emerald-700 font-bold">
                                    Corrigé : {sub.grade}/20
                                  </span>
                                )}
                              </div>
                            </div>

                            {sub.status === 'RENDU' && (
                              <button
                                onClick={() => {
                                  setGradingTP({ tpId: tp.id, sub });
                                  setGradeTPScore(sub.grade || 18);
                                  setGradeTPComment(sub.teacherFeedback || '');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold"
                              >
                                Noter / Corriger
                              </button>
                            )}

                            {sub.status === 'CORRIGE' && (
                              <button
                                onClick={() => {
                                  setGradingTP({ tpId: tp.id, sub });
                                  setGradeTPScore(sub.grade || 18);
                                  setGradeTPComment(sub.teacherFeedback || '');
                                }}
                                className="text-slate-400 hover:text-slate-700 text-[11px] underline"
                              >
                                Modifier note
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: GROUPES INTER-ÉCOLES (SPÉCIFICITÉ 6ÈME ANNÉE) ================= */}
      {is6thGrade && activeTab === 'inter_school' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Globe2 className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-sm block mb-1">
                  Spécificité 6ème année : Groupes Inter-Écoles
                </strong>
                <p className="text-xs text-purple-900 leading-relaxed">
                  Les élèves de 6ème année peuvent faire partie de groupes inter-écoles combinant plusieurs classes de différents établissements.
                  <strong> Règle stricte :</strong> La création et la gestion de ces groupes et classes restent sous le <em>contrôle exclusif de leur professeur titulaire</em>.
                </p>
              </div>
            </div>

            {isTitularOfSelectedClass && (
              <button
                id="btn-create-inter-group"
                onClick={() => { setShowInterGroupModal(true); setFeedback(null); }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shrink-0 ml-3 shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Créer un Groupe Inter-Écoles</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interSchoolGroups.map(group => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Alliance Inter-Écoles 6ème
                  </span>
                  <span className="text-[11px] text-slate-400">Fondé le {group.createdAt}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{group.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{group.description}</p>

                <div className="mt-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                    Contrôle Pédagogique Titulaire :
                  </span>
                  <div className="text-purple-950 font-medium">
                    Pilote Titulaire : <strong>{group.leadTeacherName}</strong> ({group.leadSchoolName})
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Établissements & Classes associées :
                  </span>
                  <div className="space-y-1">
                    {group.participatingClasses.map((cls, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-slate-800">{cls.className}</strong>
                          <span className="text-slate-500 text-[11px] block">{cls.schoolName}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                          {cls.titularTeacherName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Projets Partagés Collaboratifs :
                  </span>
                  {group.sharedProjects.map(proj => (
                    <div key={proj.id} className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs mt-1">
                      <div className="flex items-center justify-between font-bold text-indigo-950">
                        <span>{proj.title}</span>
                        <span className="text-[10px] font-normal text-indigo-700">Échéance : {proj.deadline}</span>
                      </div>
                      <p className="text-[11px] text-indigo-800 mt-0.5">{proj.objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD PROGRESS EVALUATION */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Inscrire une Évaluation de Progrès</h3>
              </div>
              <button onClick={() => setShowProgressModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProgress} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Élève de la classe *</label>
                <select
                  value={progressForm.studentId}
                  onChange={e => setProgressForm({ ...progressForm, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.matricule})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Domaine d'Évaluation</label>
                  <input
                    type="text"
                    value={progressForm.domain}
                    onChange={e => setProgressForm({ ...progressForm, domain: e.target.value })}
                    placeholder="Ex: Mathématiques, Autonomie, Rigueur"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Niveau d'Appréciation</label>
                  <select
                    value={progressForm.rating}
                    onChange={e => setProgressForm({ ...progressForm, rating: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="Remarquable">Remarquable</option>
                    <option value="Très satisfaisant">Très satisfaisant</option>
                    <option value="En progrès">En progrès</option>
                    <option value="Besoin de soutien">Besoin de soutien</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observations Détaillées du Titulaire *</label>
                <textarea
                  required
                  rows={3}
                  value={progressForm.observation}
                  onChange={e => setProgressForm({ ...progressForm, observation: e.target.value })}
                  placeholder="Décrivez les progrès, attitudes et acquis constatés..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recommandations Pédagogiques pour l'Élève & Famille</label>
                <textarea
                  rows={2}
                  value={progressForm.recommendation}
                  onChange={e => setProgressForm({ ...progressForm, recommendation: e.target.value })}
                  placeholder="Conseils de travail et axes d'approfondissement..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Enregistrer l'Évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GRADE */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Saisir une Note d'Évaluation</h3>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Élève *</label>
                <select
                  value={gradeForm.studentId}
                  onChange={e => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.matricule})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Matière</label>
                  <input
                    type="text"
                    value={gradeForm.subject}
                    onChange={e => setGradeForm({ ...gradeForm, subject: e.target.value })}
                    placeholder="Ex: Mathématiques"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Période / Trimestre</label>
                  <select
                    value={gradeForm.term}
                    onChange={e => setGradeForm({ ...gradeForm, term: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="Trimestre 1">Trimestre 1</option>
                    <option value="Trimestre 2">Trimestre 2</option>
                    <option value="Trimestre 3">Trimestre 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Intitulé du Devoir / Contrôle *</label>
                <input
                  type="text"
                  required
                  value={gradeForm.evaluationTitle}
                  onChange={e => setGradeForm({ ...gradeForm, evaluationTitle: e.target.value })}
                  placeholder="Ex: Contrôle Surveillé N°2 : Trigonométrie"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Note Obtenue *</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max={gradeForm.maxScore}
                    value={gradeForm.score}
                    onChange={e => setGradeForm({ ...gradeForm, score: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Barème (/20)</label>
                  <input
                    type="number"
                    value={gradeForm.maxScore}
                    onChange={e => setGradeForm({ ...gradeForm, maxScore: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Coefficient</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={gradeForm.coefficient}
                    onChange={e => setGradeForm({ ...gradeForm, coefficient: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Commentaire sur la Copie</label>
                <input
                  type="text"
                  value={gradeForm.comment}
                  onChange={e => setGradeForm({ ...gradeForm, comment: e.target.value })}
                  placeholder="Ex: Très bon travail, rigueur appréciée."
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Enregistrer la Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE TP */}
      {showTPModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Créer un Travail Pratique (TP)</h3>
              </div>
              <button onClick={() => setShowTPModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTP} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Titre du TP *</label>
                <input
                  type="text"
                  required
                  value={tpForm.title}
                  onChange={e => setTpForm({ ...tpForm, title: e.target.value })}
                  placeholder="Ex: TP N°3 : Décomposition de la lumière et prisme optique"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Matière</label>
                  <input
                    type="text"
                    value={tpForm.subject}
                    onChange={e => setTpForm({ ...tpForm, subject: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date Limite de Dépôt</label>
                  <input
                    type="date"
                    value={tpForm.dueDate}
                    onChange={e => setTpForm({ ...tpForm, dueDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Consignes et Protocoles pour l'Élève *</label>
                <textarea
                  required
                  rows={4}
                  value={tpForm.instructions}
                  onChange={e => setTpForm({ ...tpForm, instructions: e.target.value })}
                  placeholder="Décrivez les étapes à réaliser, les questions à traiter et les modalités de dépôt..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 whitespace-pre-line"
                />
              </div>

              {is6thGrade && interSchoolGroups.length > 0 && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-purple-950">
                    <input
                      type="checkbox"
                      checked={tpForm.isInterSchool}
                      onChange={e => setTpForm({ ...tpForm, isInterSchool: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Partager ce TP dans le cadre d'un Groupe Inter-Écoles</span>
                  </label>

                  {tpForm.isInterSchool && (
                    <div className="mt-2 pl-5">
                      <select
                        value={tpForm.interSchoolGroupId}
                        onChange={e => setTpForm({ ...tpForm, interSchoolGroupId: e.target.value })}
                        className="w-full p-2 rounded-lg border border-purple-300 bg-white"
                      >
                        <option value="">Sélectionner le groupe partenaire</option>
                        {interSchoolGroups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTPModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Diffuser le TP aux Élèves
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE STUDENT TP SUBMISSION */}
      {gradingTP && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 my-6 text-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Évaluer le Travail Pratique</h3>
            <p className="text-slate-500 mb-3">Élève : <strong>{gradingTP.sub.studentName}</strong></p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-1">
                Dépôt de l'élève ({gradingTP.sub.submittedAt}) :
              </span>
              <p className="text-slate-800">{gradingTP.sub.fileOrResponse || 'Travail remis sans note textuelle.'}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Note Attribuée (/20) *</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={gradeTPScore}
                  onChange={e => setGradeTPScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Appréciation et Conseils de l'Enseignant</label>
                <textarea
                  rows={3}
                  value={gradeTPComment}
                  onChange={e => setGradeTPComment(e.target.value)}
                  placeholder="Points forts, corrections à apporter..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setGradingTP(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium"
              >
                Fermer
              </button>
              <button
                onClick={handleSaveGradeTP}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Valider la Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INTER-SCHOOL GROUP (SPÉCIFICITÉ 6ÈME) */}
      {showInterGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Créer un Groupe Inter-Écoles (6ème)</h3>
              </div>
              <button onClick={() => setShowInterGroupModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInterGroup} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-950">
                <strong>Autorité Titulaire :</strong> Vous créez ce réseau collaboratif au titre de professeur titulaire de {selectedClass?.name}. Vous sélectionnerez les classes d'autres écoles invitées.
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom du Groupe Inter-Écoles *</label>
                <input
                  type="text"
                  required
                  value={interGroupForm.name}
                  onChange={e => setInterGroupForm({ ...interGroupForm, name: e.target.value })}
                  placeholder="Ex: Réseau 6ème : Sciences & Climat Inter-Collèges"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Thématique Fédératrice</label>
                <input
                  type="text"
                  value={interGroupForm.theme}
                  onChange={e => setInterGroupForm({ ...interGroupForm, theme: e.target.value })}
                  placeholder="Ex: Biodiversité, Mathématiques Appliquées, Littérature"
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description des Objectifs Pédagogiques *</label>
                <textarea
                  required
                  rows={3}
                  value={interGroupForm.description}
                  onChange={e => setInterGroupForm({ ...interGroupForm, description: e.target.value })}
                  placeholder="Décrivez la synergie et les travaux qui seront menés en commun..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Classes Partenaires de 6ème à associer :
                </label>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {other6thClasses.map(c => {
                    const sch = schools.find(s => s.id === c.schoolId);
                    const isChecked = interGroupForm.partnerClassIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="p-2 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setInterGroupForm({
                                  ...interGroupForm,
                                  partnerClassIds: [...interGroupForm.partnerClassIds, c.id]
                                });
                              } else {
                                setInterGroupForm({
                                  ...interGroupForm,
                                  partnerClassIds: interGroupForm.partnerClassIds.filter(id => id !== c.id)
                                });
                              }
                            }}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <div>
                            <strong className="text-slate-900">{c.name}</strong>
                            <span className="text-slate-500 text-[11px] block">{sch?.name} ({sch?.city})</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-medium">Titulaire : {c.titularTeacherName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterGroupModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
                >
                  Créer le Groupe Inter-Écoles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Award,
  TrendingUp,
  Megaphone,
  Globe2,
  CheckCircle2,
  UploadCloud,
  FileText,
  Clock,
  Send,
  Sparkles,
  AlertCircle,
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { StudentUser } from '../../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentSchool,
    classes,
    teachers,
    assignments,
    progressEvaluations,
    grades,
    communications,
    interSchoolGroups,
    cardSignatures,
    conductRecords,
    attendanceRecords,
    disciplinarySanctions,
    submitTP
  } = useApp();

  const student = currentUser as StudentUser;
  const myClass = classes.find(c => c.id === student?.classId);
  const is6thGrade = student?.gradeLevel === 6;

  const [activeTab, setActiveTab] = useState<'tps' | 'points' | 'progress' | 'comm' | 'inter_school'>('tps');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Student's assignments
  const myAssignments = assignments.filter(a => a.classId === student?.classId);
  const myProgress = progressEvaluations.filter(p => p.studentId === student?.id);
  const myGrades = grades.filter(g => g.studentId === student?.id);
  const myCommunications = communications.filter(
    c => c.schoolId === student?.schoolId && (c.targetAudience === 'all' || c.targetAudience === 'students')
  );

  // Inter-school groups the student's class participates in (6th grade)
  const myInterGroups = interSchoolGroups.filter(g =>
    g.participatingClasses.some(pc => pc.classId === student?.classId)
  );

  // Modal to submit a TP
  const [submittingTPId, setSubmittingTPId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState<string>('');

  const handleSendSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTPId || !submissionContent) {
      setFeedback({ type: 'error', text: 'Veuillez saisir votre réponse ou le lien de votre devoir.' });
      return;
    }

    const res = submitTP(submittingTPId, submissionContent);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setSubmittingTPId(null);
      setSubmissionContent('');
    }
  };

  // Average calculation
  const totalWeightedScore = myGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 20 * g.coefficient, 0);
  const totalCoefficients = myGrades.reduce((acc, g) => acc + g.coefficient, 0);
  const averageGrade = totalCoefficients > 0 ? (totalWeightedScore / totalCoefficients).toFixed(2) : '16.5';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-sky-950 to-slate-900 text-white p-6 shadow-md border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Portail Élève</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[11px] font-semibold">
                  {student?.gradeLevel}ème Année {is6thGrade && '★ Cycle Approfondi'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                Élève : <strong className="text-white">{student?.name}</strong> (Matricule: {student?.matricule})
                • Classe : {myClass?.name} ({currentSchool?.name})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/15 text-xs">
            <div>
              <span className="text-indigo-300 text-[10px] block">Professeur Titulaire</span>
              <strong className="text-white">{myClass?.titularTeacherName}</strong>
            </div>
            <div className="border-l border-indigo-700/60 pl-3">
              <span className="text-indigo-300 text-[10px] block">Moyenne Générale</span>
              <strong className="text-base font-extrabold text-amber-300">{averageGrade} / 20</strong>
            </div>
          </div>
        </div>

        {is6thGrade && (
          <div className="mt-4 pt-3 border-t border-indigo-800/60 text-xs text-indigo-200 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-300 shrink-0" />
            <span>
              <strong>Spécificité 6ème année :</strong> Vous faites partie d'alliances inter-écoles coordonnées par votre professeur titulaire.
            </span>
          </div>
        )}
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

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4 text-xs font-semibold overflow-x-auto pb-1">
          <button
            id="tab-student-tps"
            onClick={() => setActiveTab('tps')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tps'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mes Travaux Pratiques (TP) ({myAssignments.length})</span>
          </button>

          <button
            id="tab-student-points"
            onClick={() => setActiveTab('points')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'points'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Mes Points & Notes ({myGrades.length})</span>
          </button>

          <button
            id="tab-student-progress"
            onClick={() => setActiveTab('progress')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Mon Suivi de Progrès ({myProgress.length})</span>
          </button>

          <button
            id="tab-student-comm"
            onClick={() => setActiveTab('comm')}
            className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'comm'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Communications ({myCommunications.length})</span>
          </button>

          {is6thGrade && (
            <button
              id="tab-student-inter"
              onClick={() => setActiveTab('inter_school')}
              className={`pb-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'inter_school'
                  ? 'border-purple-600 text-purple-700 font-bold'
                : 'border-transparent text-purple-600 hover:text-purple-900'
              }`}
            >
              <Globe2 className="w-4 h-4 text-purple-600" />
              <span>Groupe Inter-Écoles (6ème) ({myInterGroups.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: TRAVAUX PRATIQUES (TP) ================= */}
      {activeTab === 'tps' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center justify-between">
            <span>
              <strong>Espace Travaux Pratiques (TP) :</strong> Consultez les protocoles fournis par vos professeurs, soumettez vos travaux avant la date limite et consultez vos corrections.
            </span>
          </div>

          <div className="space-y-4">
            {myAssignments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                Aucun Travail Pratique (TP) assigné à votre classe pour le moment.
              </div>
            ) : (
              myAssignments.map(tp => {
                const mySub = tp.submissions.find(s => s.studentId === student?.id);
                const isInter = Boolean(tp.interSchoolGroupId);

                return (
                  <div key={tp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            {tp.subject}
                          </span>
                          {isInter && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Globe2 className="w-3 h-3" /> TP Inter-Écoles 6ème
                            </span>
                          )}
                          <span className="text-xs text-slate-400">• À rendre pour le : <strong>{tp.dueDate}</strong></span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 mt-2">{tp.title}</h3>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {(!mySub || mySub.status === 'A_FAIRE') && (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                            À faire & déposer
                          </span>
                        )}
                        {mySub?.status === 'RENDU' && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
                            Rendu • En attente de correction
                          </span>
                        )}
                        {mySub?.status === 'CORRIGE' && (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                            Corrigé : {mySub.grade} / 20
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Consignes du professeur ({tp.teacherName}) :
                      </span>
                      {tp.instructions}
                    </div>

                    {/* Submission state */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      {mySub?.status === 'CORRIGE' ? (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 w-full">
                          <div className="flex items-center justify-between font-bold">
                            <span>Note obtenue : {mySub.grade} / 20</span>
                            <span className="text-xs font-normal">Corrigé par {tp.teacherName}</span>
                          </div>
                          <p className="mt-1 text-emerald-900 italic">
                            Appréciation : "{mySub.teacherFeedback}"
                          </p>
                        </div>
                      ) : mySub?.status === 'RENDU' ? (
                        <div className="flex items-center justify-between w-full text-slate-600">
                          <div>
                            <span className="text-emerald-700 font-semibold">✓ Devoir transmis le {mySub.submittedAt}</span>
                            <p className="text-[11px] text-slate-400 truncate max-w-md">Contenu : {mySub.fileOrResponse}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSubmittingTPId(tp.id);
                              setSubmissionContent(mySub.fileOrResponse || '');
                            }}
                            className="text-xs text-blue-600 font-semibold hover:underline"
                          >
                            Mettre à jour le travail
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-amber-700">Vous n'avez pas encore rendu ce devoir.</span>
                          <button
                            id={`btn-submit-tp-${tp.id}`}
                            onClick={() => {
                              setSubmittingTPId(tp.id);
                              setSubmissionContent('');
                              setFeedback(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>Déposer mon TP</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MES POINTS & NOTES ================= */}
      {activeTab === 'points' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Matière</th>
                  <th className="py-3 px-4">Évaluation / Contrôle</th>
                  <th className="py-3 px-4">Trimestre</th>
                  <th className="py-3 px-4 text-center">Points obtenus</th>
                  <th className="py-3 px-4 text-center">Coefficient</th>
                  <th className="py-3 px-4">Appréciation de l'Enseignant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myGrades.map(grade => {
                  const pct = (grade.score / grade.maxScore) * 100;
                  return (
                    <tr key={grade.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{grade.subject}</td>
                      <td className="py-3 px-4 text-slate-800">{grade.evaluationTitle}</td>
                      <td className="py-3 px-4 text-slate-500">{grade.term}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-extrabold text-sm px-2.5 py-0.5 rounded-lg ${
                            pct >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {grade.score} / {grade.maxScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">x{grade.coefficient}</td>
                      <td className="py-3 px-4 text-slate-500 italic">{grade.comment || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: MON SUIVI DE PROGRÈS & VIE SCOLAIRE ================= */}
      {activeTab === 'progress' && (() => {
        const studentCards = cardSignatures.filter(c => c.studentId === student?.id);
        const studentConduct = conductRecords.filter(c => c.studentId === student?.id);
        const studentAttendance = attendanceRecords.filter(a => a.studentId === student?.id);
        const studentSanctions = disciplinarySanctions.filter(s => s.studentId === student?.id);

        return (
          <div className="space-y-6">
            {/* Daily Life Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Vie Scolaire Quotidienne (Alimenté par votre titulaire {myClass?.titularTeacherName})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Signature de la carte, suivi de la conduite, absences et avertissements
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Carte scolaire */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Carte Scolaire</span>
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  {studentCards.length > 0 ? (
                    <div>
                      <p className="text-slate-600">Dernier contrôle : {studentCards[0].date}</p>
                      <span className={`inline-block mt-1 font-bold text-[10px] px-2 py-0.5 rounded-md ${
                        studentCards[0].status === 'SIGNEE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {studentCards[0].status === 'SIGNEE' ? 'Signée par parents ✓' : 'À faire signer ⚠️'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-slate-400">Aucun contrôle consigné.</p>
                  )}
                </div>

                {/* Dernier bilan conduite */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Conduite du Jour</span>
                    <Award className="w-4 h-4 text-teal-600" />
                  </div>
                  {studentConduct.length > 0 ? (
                    <div>
                      <p className="text-slate-600">Appréciation : <strong>{studentConduct[0].rating}</strong></p>
                      <p className="text-slate-500 text-[11px] truncate">{studentConduct[0].observation}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400">Aucun relevé récent.</p>
                  )}
                </div>

                {/* Absences */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Assiduité</span>
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <p className="text-slate-600">
                    Total absences : <strong>{studentAttendance.filter(a => a.type !== 'retard').length}</strong>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Retards : {studentAttendance.filter(a => a.type === 'retard').length}
                  </p>
                </div>
              </div>

              {/* Sanctions if any */}
              {studentSanctions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <strong>Avis Disciplinaire : {studentSanctions[0].sanctionType.replace(/_/g, ' ')}</strong>
                  </div>
                  <p className="text-rose-900">{studentSanctions[0].reason}</p>
                </div>
              )}
            </div>

            {/* Qualitative Bilans / Competences */}
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                <strong>Certifié par le titulaire :</strong> Évaluations qualitatives et bilans de compétences renseignés exclusivement par votre professeur titulaire (<strong>{myClass?.titularTeacherName}</strong>).
              </div>

              {myProgress.map(prog => (
                <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{prog.domain}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {prog.rating}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{prog.date}</span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {prog.observation}
                  </p>

                  {prog.recommendation && (
                    <div className="mt-2.5 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                      <strong>Piste de perfectionnement :</strong> {prog.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ================= TAB 4: COMMUNICATIONS DIRECTION ================= */}
      {activeTab === 'comm' && (
        <div className="space-y-3">
          {myCommunications.map(comm => (
            <div key={comm.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {comm.priority.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">• {comm.publishedAt}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{comm.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {comm.content}
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                Diffusé par : <strong>{comm.authorName}</strong> ({comm.authorRole})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 5: GROUPES INTER-ÉCOLES (SPÉCIFICITÉ 6ÈME) ================= */}
      {is6thGrade && activeTab === 'inter_school' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950">
            <strong>Spécificité 6ème année :</strong> Vous faites partie d'une alliance inter-écoles regroupant des élèves d'autres établissements scolaires, sous la tutelle de votre professeur titulaire.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myInterGroups.map(group => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Alliance Inter-Écoles 6ème
                  </span>
                  <span className="text-xs text-slate-400">Fondé le {group.createdAt}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{group.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{group.description}</p>

                <div className="mt-3 p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-950">
                  <span className="text-[10px] font-bold uppercase block text-purple-700 mb-1">
                    Professeur Titulaire Coordinateur :
                  </span>
                  <strong>{group.leadTeacherName}</strong> ({group.leadSchoolName})
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Établissements partenaires :
                  </span>
                  <div className="space-y-1">
                    {group.participatingClasses.map((pc, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between border border-slate-100">
                        <span className="font-semibold text-slate-800">{pc.className}</span>
                        <span className="text-slate-500 text-[11px]">{pc.schoolName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Projets en cours :
                  </span>
                  {group.sharedProjects.map(proj => (
                    <div key={proj.id} className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs mt-1">
                      <div className="flex items-center justify-between font-bold text-indigo-950">
                        <span>{proj.title}</span>
                        <span className="text-[10px] text-indigo-600 font-normal">Date : {proj.deadline}</span>
                      </div>
                      <p className="text-[11px] text-indigo-900 mt-0.5">{proj.objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT TP */}
      {submittingTPId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 my-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Déposer mon Travail Pratique</h3>
              </div>
              <button onClick={() => setSubmittingTPId(null)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendSubmission} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Réponse textuelle, lien ou compte-rendu du TP *
                </label>
                <textarea
                  required
                  rows={4}
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
                  placeholder="Rédigez votre compte-rendu, réponses aux questions, ou collez le lien de votre fichier..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                Votre travail sera transmis directement à votre professeur pour correction et notation.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmittingTPId(null)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer mon Devoir</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

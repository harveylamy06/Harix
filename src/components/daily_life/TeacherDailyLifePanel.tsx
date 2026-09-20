import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClassGroup,
  StudentUser,
  TeacherUser,
  CardSignatureRecord,
  ConductRecord,
  AttendanceRecord,
  ParentInvitation,
  DisciplinarySanction
} from '../../types';
import {
  FileCheck,
  Award,
  Clock,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Filter,
  UserCheck,
  AlertTriangle,
  Send,
  X,
  Lock,
  Search,
  MessageSquare
} from 'lucide-react';

interface TeacherDailyLifePanelProps {
  selectedClass: ClassGroup;
  classStudents: StudentUser[];
  isTitular: boolean;
}

export const TeacherDailyLifePanel: React.FC<TeacherDailyLifePanelProps> = ({
  selectedClass,
  classStudents,
  isTitular
}) => {
  const {
    currentUser,
    cardSignatures,
    conductRecords,
    attendanceRecords,
    parentInvitations,
    disciplinarySanctions,
    recordCardSignature,
    recordDailyConduct,
    recordAttendance,
    createParentInvitation,
    issueDisciplinarySanction
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'carte' | 'conduite' | 'absences' | 'invitations' | 'sanctions'
  >('carte');

  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<
    'carte' | 'conduite' | 'absences' | 'invitation' | 'sanction' | null
  >(null);

  // Forms state
  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const [cardForm, setCardForm] = useState({
    studentId: classStudents[0]?.id || '',
    periodType: 'hebdomadaire' as 'quotidienne' | 'hebdomadaire',
    weekLabel: 'Semaine 3 (Trimestre 1)',
    status: 'SIGNEE' as 'SIGNEE' | 'NON_SIGNEE_RAPPEL' | 'EN_ATTENTE',
    isCardPresented: true,
    titularTeacherNote: 'Carte scolaire contrôlée et visée.'
  });

  const [conductForm, setConductForm] = useState({
    studentId: classStudents[0]?.id || '',
    date: todayStr,
    rating: 'Très bonne' as 'Exemplaire' | 'Très bonne' | 'Bonne' | 'Bavardages / Agitation' | 'Manque de travail / Oubli matériel' | 'Avertissement verbal',
    score: 5,
    observation: 'Comportement sérieux et participatif en classe ce jour.',
    encouragementOrWarning: 'Poursuivre dans cette attitude exemplaire.'
  });

  const [attendanceForm, setAttendanceForm] = useState({
    studentId: classStudents[0]?.id || '',
    date: todayStr,
    type: 'absence_journee' as 'absence_journee' | 'absence_demi_journee' | 'retard',
    delayMinutes: 15,
    status: 'injustifiee' as 'justifiee' | 'injustifiee' | 'en_attente_justificatif',
    reason: 'Absence constatée à l’appel.',
    certificateProvided: false
  });

  const [invitationForm, setInvitationForm] = useState({
    studentId: classStudents[0]?.id || '',
    meetingDate: '2026-10-05',
    meetingTime: '16:30',
    location: 'Bureau du Titulaire (Salle 104) ou Visio',
    reason: 'Point d’étape trimestriel sur le rythme d’apprentissage et la vie de classe.'
  });

  const [sanctionForm, setSanctionForm] = useState({
    studentId: classStudents[0]?.id || '',
    sanctionType: 'exclusion_temporaire' as 'exclusion_temporaire' | 'exclusion_definitive' | 'retenue_officielle' | 'avertissement_solennel',
    durationDays: 2,
    effectiveStartDate: '2026-10-01',
    effectiveEndDate: '2026-10-02',
    gravityLevel: 'grave' as 'grave' | 'tres_grave' | 'critique',
    reason: 'Non-respect persistant du règlement intérieur malgré mises en garde répétées.'
  });

  // Filtered lists for this class
  const classCardSignatures = cardSignatures
    .filter(c => c.classId === selectedClass.id)
    .filter(c => (selectedStudentFilter === 'all' ? true : c.studentId === selectedStudentFilter));

  const classConductRecords = conductRecords
    .filter(c => c.classId === selectedClass.id)
    .filter(c => (selectedStudentFilter === 'all' ? true : c.studentId === selectedStudentFilter));

  const classAttendanceRecords = attendanceRecords
    .filter(c => c.classId === selectedClass.id)
    .filter(c => (selectedStudentFilter === 'all' ? true : c.studentId === selectedStudentFilter));

  const classParentInvitations = parentInvitations
    .filter(c => c.classId === selectedClass.id)
    .filter(c => (selectedStudentFilter === 'all' ? true : c.studentId === selectedStudentFilter));

  const classDisciplinarySanctions = disciplinarySanctions
    .filter(c => c.classId === selectedClass.id)
    .filter(c => (selectedStudentFilter === 'all' ? true : c.studentId === selectedStudentFilter));

  // Handlers
  const handleSaveCardSignature = (e: React.FormEvent) => {
    e.preventDefault();
    const st = classStudents.find(s => s.id === cardForm.studentId);
    if (!st) return;

    const res = recordCardSignature({
      studentId: cardForm.studentId,
      classId: selectedClass.id,
      schoolId: selectedClass.schoolId,
      date: todayStr,
      periodType: cardForm.periodType,
      weekLabel: cardForm.weekLabel,
      status: cardForm.status,
      signedByParentName: cardForm.status === 'SIGNEE' ? 'Parent Titulaire (Visé)' : undefined,
      isCardPresented: cardForm.isCardPresented,
      titularTeacherNote: cardForm.titularTeacherNote
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setActiveModal(null);
  };

  const handleSaveConduct = (e: React.FormEvent) => {
    e.preventDefault();
    const res = recordDailyConduct({
      studentId: conductForm.studentId,
      classId: selectedClass.id,
      schoolId: selectedClass.schoolId,
      date: conductForm.date,
      rating: conductForm.rating,
      score: Number(conductForm.score),
      observation: conductForm.observation,
      encouragementOrWarning: conductForm.encouragementOrWarning
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setActiveModal(null);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const res = recordAttendance({
      studentId: attendanceForm.studentId,
      classId: selectedClass.id,
      schoolId: selectedClass.schoolId,
      date: attendanceForm.date,
      type: attendanceForm.type,
      delayMinutes: attendanceForm.type === 'retard' ? Number(attendanceForm.delayMinutes) : undefined,
      status: attendanceForm.status,
      reason: attendanceForm.reason,
      certificateProvided: attendanceForm.certificateProvided
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setActiveModal(null);
  };

  const handleSaveInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createParentInvitation({
      studentId: invitationForm.studentId,
      classId: selectedClass.id,
      schoolId: selectedClass.schoolId,
      meetingDate: invitationForm.meetingDate,
      meetingTime: invitationForm.meetingTime,
      location: invitationForm.location,
      reason: invitationForm.reason,
      sentByRole: 'Professeur Titulaire'
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setActiveModal(null);
  };

  const handleSaveSanction = (e: React.FormEvent) => {
    e.preventDefault();
    const res = issueDisciplinarySanction({
      studentId: sanctionForm.studentId,
      classId: selectedClass.id,
      schoolId: selectedClass.schoolId,
      sanctionType: sanctionForm.sanctionType,
      durationDays: sanctionForm.sanctionType === 'exclusion_temporaire' ? Number(sanctionForm.durationDays) : undefined,
      effectiveStartDate: sanctionForm.effectiveStartDate,
      effectiveEndDate: sanctionForm.sanctionType === 'exclusion_temporaire' ? sanctionForm.effectiveEndDate : undefined,
      gravityLevel: sanctionForm.gravityLevel,
      reason: sanctionForm.reason,
      issuedByRole: 'Professeur Titulaire'
    });

    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setActiveModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Titular Role Check */}
      <div className="bg-emerald-900/10 border border-emerald-300/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-emerald-950">
              Vie Scolaire Quotidienne (Alimenté chaque jour par le professeur titulaire)
            </h2>
            <span className="text-[10px] uppercase font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
              Classe : {selectedClass.name}
            </span>
          </div>
          <p className="text-xs text-emerald-800/80 mt-1">
            Alimentez chaque jour le suivi en temps réel pour les parents : signatures des cartes, suivi de la conduite, absences et retards, convocations de rendez-vous et billets de sanctions.
          </p>
        </div>

        {/* Titular Badge */}
        <div className="shrink-0">
          {isTitular ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
              <UserCheck className="w-4 h-4" />
              <span>Titulaire Officiel • Droits d'Écriture Actifs</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Lecture Seule (Réservé au Titulaire)</span>
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
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter by Student & Categories */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Module Sub-tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeCategory === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Vue Synthétique
          </button>

          <button
            onClick={() => setActiveCategory('carte')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'carte'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>1. Signature Carte ({classCardSignatures.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('conduite')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'conduite'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>2. Suivi Conduite ({classConductRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('absences')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'absences'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>3. Absences & Retards ({classAttendanceRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('invitations')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'invitations'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>4. Invitations Parents ({classParentInvitations.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('sanctions')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeCategory === 'sanctions'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>5. Sanctions Disciplinaires ({classDisciplinarySanctions.length})</span>
          </button>
        </div>

        {/* Filter by Student */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStudentFilter}
            onChange={e => setSelectedStudentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tous les élèves ({classStudents.length})</option>
            {classStudents.map(st => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.matricule})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons for Titular */}
      {isTitular && (
        <div className="flex flex-wrap items-center gap-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200/80">
          <span className="text-xs font-bold text-emerald-950 mr-2 flex items-center gap-1">
            <span>Saisie quotidienne titulaire :</span>
          </span>

          <button
            onClick={() => {
              setCardForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
              setActiveModal('carte');
              setFeedback(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ 1. Contrôle Carte Scolaire</span>
          </button>

          <button
            onClick={() => {
              setConductForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
              setActiveModal('conduite');
              setFeedback(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ 2. Évaluer Conduite du Jour</span>
          </button>

          <button
            onClick={() => {
              setAttendanceForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
              setActiveModal('absences');
              setFeedback(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ 3. Pointer Absence / Retard</span>
          </button>

          <button
            onClick={() => {
              setInvitationForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
              setActiveModal('invitation');
              setFeedback(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ 4. Convoquer Parent (Rendez-vous)</span>
          </button>

          <button
            onClick={() => {
              setSanctionForm(prev => ({ ...prev, studentId: classStudents[0]?.id || '' }));
              setActiveModal('sanction');
              setFeedback(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ 5. Délivrer Billet de Sanction</span>
          </button>
        </div>
      )}

      {/* ================= 1. SECTION SIGNATURE DE LA CARTE ================= */}
      {(activeCategory === 'all' || activeCategory === 'carte') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  1. Signature de la Carte Scolaire
                </h3>
                <p className="text-xs text-slate-500">
                  Notification quotidienne ou hebdomadaire indiquant aux parents si la carte scolaire a été signée.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {classCardSignatures.length} enregistrements
            </span>
          </div>

          {classCardSignatures.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucun contrôle de signature de carte consigné pour cette sélection.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classCardSignatures.map(card => {
                const st = classStudents.find(s => s.id === card.studentId);
                return (
                  <div
                    key={card.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      card.status === 'SIGNEE'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : card.status === 'EN_ATTENTE'
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-sm font-bold text-slate-900">{st?.name}</strong>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            card.status === 'SIGNEE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : card.status === 'EN_ATTENTE'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {card.status === 'SIGNEE' ? 'Signée ✓' : card.status === 'EN_ATTENTE' ? 'En attente ⏳' : 'Non signée ⚠️'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-semibold mb-1">
                        Période : {card.weekLabel || card.periodType} • Contrôle du {card.date}
                      </p>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p>Carte physique présentée au titulaire : <strong>{card.isCardPresented ? 'Oui' : 'Non'}</strong></p>
                        {card.titularTeacherNote && (
                          <p className="italic bg-white/70 p-1.5 rounded-md border border-slate-200/60">
                            Note titulaire : « {card.titularTeacherNote} »
                          </p>
                        )}
                        {card.signedByParentName && (
                          <p className="text-emerald-800 font-medium text-[11px]">
                            Signée par : {card.signedByParentName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 2. SECTION SUIVI DE LA CONDUITE ================= */}
      {(activeCategory === 'all' || activeCategory === 'conduite') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  2. Suivi de la Conduite (Au jour le jour)
                </h3>
                <p className="text-xs text-slate-500">
                  Évaluation quotidienne du comportement de l'élève au jour le jour pour les parents.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {classConductRecords.length} fiches
            </span>
          </div>

          {classConductRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucun bilan de conduite enregistré pour cette sélection.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classConductRecords.map(cond => {
                const st = classStudents.find(s => s.id === cond.studentId);
                return (
                  <div key={cond.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-slate-900">{st?.name}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cond.rating === 'Exemplaire' || cond.rating === 'Très bonne'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : cond.rating === 'Bonne'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {cond.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Date : {cond.date}</span>
                      <span className="font-bold text-slate-700">Note : {cond.score}/5</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200/70">
                      <strong>Observation :</strong> {cond.observation}
                    </p>

                    {cond.encouragementOrWarning && (
                      <p className="text-xs text-teal-900 font-medium bg-teal-50/60 p-2 rounded-lg border border-teal-200/60">
                        <strong>Recommandation :</strong> {cond.encouragementOrWarning}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. SECTION ABSENCES ET RETARDS ================= */}
      {(activeCategory === 'all' || activeCategory === 'absences') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  3. Absences et Retards
                </h3>
                <p className="text-xs text-slate-500">
                  Historique précis des jours où l'élève a raté l'école ou est arrivé en retard.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {classAttendanceRecords.length} pointages
            </span>
          </div>

          {classAttendanceRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucune absence ni retard consigné. Assiduité parfaite !
            </div>
          ) : (
            <div className="space-y-2.5">
              {classAttendanceRecords.map(att => {
                const st = classStudents.find(s => s.id === att.studentId);
                return (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900">{st?.name}</strong>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            att.type !== 'retard'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {att.type === 'retard' ? `Retard (${att.delayMinutes || 15} min)` : att.type === 'absence_demi_journee' ? 'Demi-journée' : 'Journée complète'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            att.status === 'justifiee'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.status === 'justifiee' ? 'Justifiée' : 'Injustifiée'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1">
                        <span>Date : {att.date} • Motif : <em>{att.reason}</em></span>
                        {att.parentJustificationNote && (
                          <p className="text-emerald-800 text-[11px] font-semibold mt-0.5">
                            Justificatif parent : « {att.parentJustificationNote} »
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 shrink-0">
                      Par : {att.recordedByTeacherName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. SECTION INVITATIONS DES PARENTS ================= */}
      {(activeCategory === 'all' || activeCategory === 'invitations') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  4. Invitations des Parents (Convocations Officielles)
                </h3>
                <p className="text-xs text-slate-500">
                  Convocation officielle envoyée par l'école / le titulaire pour un rendez-vous avec les parents.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {classParentInvitations.length} convocations
            </span>
          </div>

          {classParentInvitations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucune convocation officielle de rendez-vous parent en cours.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classParentInvitations.map(inv => {
                const st = classStudents.find(s => s.id === inv.studentId);
                return (
                  <div key={inv.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-slate-900">{st?.name}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === 'CONFIRMEE_PAR_PARENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'REPORTEE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {inv.status === 'CONFIRMEE_PAR_PARENT' ? 'Présence confirmée' : inv.status === 'REPORTEE' ? 'Report sollicité' : 'Envoyée'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-semibold">
                      Rendez-vous fixé au : <strong>{inv.meetingDate} à {inv.meetingTime}</strong>
                    </p>

                    <p className="text-xs text-slate-600">
                      Lieu : {inv.location}
                    </p>

                    <p className="text-xs bg-white p-2 rounded-lg border border-amber-200/80 text-slate-700">
                      <strong>Motif officiel :</strong> {inv.reason}
                    </p>

                    {inv.parentResponseNote && (
                      <p className="text-xs text-amber-900 bg-amber-100/60 p-1.5 rounded-md">
                        <strong>Réponse des parents :</strong> « {inv.parentResponseNote} »
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. SECTION SANCTIONS DISCIPLINAIRES ================= */}
      {(activeCategory === 'all' || activeCategory === 'sanctions') && (
        <div className="bg-white rounded-2xl border-2 border-rose-300 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  5. Sanctions Disciplinaires (Billet d'Exclusion Temporaire ou Définitive)
                </h3>
                <p className="text-xs text-slate-500">
                  Notification immédiate en cas de billet d'exclusion temporaire ou définitive.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
              {classDisciplinarySanctions.length} billets
            </span>
          </div>

          {classDisciplinarySanctions.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-800 bg-emerald-50 rounded-xl font-medium">
              Aucune sanction disciplinaire consignée pour cette sélection.
            </div>
          ) : (
            <div className="space-y-3">
              {classDisciplinarySanctions.map(sanc => {
                const st = classStudents.find(s => s.id === sanc.studentId);
                return (
                  <div key={sanc.id} className="p-4 rounded-xl border border-rose-300 bg-rose-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900">{st?.name}</strong>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-600 text-white">
                          {sanc.sanctionType.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sanc.acknowledgedByParent
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {sanc.acknowledgedByParent ? 'Accusé réception parent ✓' : 'Accusé réception requis ⚠️'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-rose-200">
                      <strong>Motif officiel circonstancié :</strong> {sanc.reason}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Prise d'effet : Du {sanc.effectiveStartDate}
                        {sanc.effectiveEndDate ? ` au ${sanc.effectiveEndDate}` : ''}
                        {sanc.durationDays ? ` (${sanc.durationDays} jour${sanc.durationDays > 1 ? 's' : ''})` : ''}
                      </span>
                      <span>Délivré par : {sanc.issuedByName}</span>
                    </div>

                    {sanc.parentAcknowledgmentNote && (
                      <div className="text-xs bg-slate-100 p-2 rounded-lg text-slate-700">
                        <strong>Accusé de réception des parents :</strong> « {sanc.parentAcknowledgmentNote} »
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= MODALS DE SAISIE DU TITULAIRE ================= */}

      {/* 1. Modal Contrôle Carte Scolaire */}
      {activeModal === 'carte' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Contrôle de Signature de Carte</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCardSignature} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève concerné</label>
                <select
                  value={cardForm.studentId}
                  onChange={e => setCardForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fréquence</label>
                  <select
                    value={cardForm.periodType}
                    onChange={e => setCardForm(prev => ({ ...prev, periodType: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="hebdomadaire">Hebdomadaire</option>
                    <option value="quotidienne">Quotidienne</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Statut signature</label>
                  <select
                    value={cardForm.status}
                    onChange={e => setCardForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="SIGNEE">Signée par les parents ✓</option>
                    <option value="NON_SIGNEE_RAPPEL">Non signée (Rappel) ⚠️</option>
                    <option value="EN_ATTENTE">En attente de signature ⏳</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Intitulé de période</label>
                <input
                  type="text"
                  value={cardForm.weekLabel}
                  onChange={e => setCardForm(prev => ({ ...prev, weekLabel: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  placeholder="Ex: Semaine 3 (Trimestre 1)"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={cardForm.isCardPresented}
                  onChange={e => setCardForm(prev => ({ ...prev, isCardPresented: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 font-medium">Carte physique présentée au titulaire</span>
              </label>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observation titulaire</label>
                <textarea
                  value={cardForm.titularTeacherNote}
                  onChange={e => setCardForm(prev => ({ ...prev, titularTeacherNote: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Enregistrer le contrôle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Évaluation Conduite du Jour */}
      {activeModal === 'conduite' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-sm">Évaluation Conduite au Jour le Jour</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève concerné</label>
                <select
                  value={conductForm.studentId}
                  onChange={e => setConductForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Appréciation globale</label>
                  <select
                    value={conductForm.rating}
                    onChange={e => setConductForm(prev => ({ ...prev, rating: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="Exemplaire">Exemplaire</option>
                    <option value="Très bonne">Très bonne</option>
                    <option value="Bonne">Bonne</option>
                    <option value="Bavardages / Agitation">Bavardages / Agitation</option>
                    <option value="Manque de travail / Oubli matériel">Manque de travail / Oubli matériel</option>
                    <option value="Avertissement verbal">Avertissement verbal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Note de tenue (/5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={conductForm.score}
                    onChange={e => setConductForm(prev => ({ ...prev, score: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observation circonstanciée</label>
                <textarea
                  value={conductForm.observation}
                  onChange={e => setConductForm(prev => ({ ...prev, observation: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recommandation pour la famille</label>
                <textarea
                  value={conductForm.encouragementOrWarning}
                  onChange={e => setConductForm(prev => ({ ...prev, encouragementOrWarning: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Enregistrer l'évaluation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Pointage Absence / Retard */}
      {activeModal === 'absences' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">Pointage Absence ou Retard</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève concerné</label>
                <select
                  value={attendanceForm.studentId}
                  onChange={e => setAttendanceForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type d'événement</label>
                  <select
                    value={attendanceForm.type}
                    onChange={e => setAttendanceForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="absence_journee">Absence (Journée)</option>
                    <option value="absence_demi_journee">Absence (Demi-journée)</option>
                    <option value="retard">Retard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Statut justification</label>
                  <select
                    value={attendanceForm.status}
                    onChange={e => setAttendanceForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="injustifiee">Injustifiée</option>
                    <option value="justifiee">Justifiée</option>
                    <option value="en_attente_justificatif">En attente justificatif</option>
                  </select>
                </div>
              </div>

              {attendanceForm.type === 'retard' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Minutes de retard</label>
                  <input
                    type="number"
                    value={attendanceForm.delayMinutes}
                    onChange={e => setAttendanceForm(prev => ({ ...prev, delayMinutes: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif relevé</label>
                <textarea
                  value={attendanceForm.reason}
                  onChange={e => setAttendanceForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Enregistrer le pointage</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Convocation Parent */}
      {activeModal === 'invitation' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm">Convocation Officielle des Parents</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvitation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève concerné</label>
                <select
                  value={invitationForm.studentId}
                  onChange={e => setInvitationForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date du RDV</label>
                  <input
                    type="date"
                    value={invitationForm.meetingDate}
                    onChange={e => setInvitationForm(prev => ({ ...prev, meetingDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Heure</label>
                  <input
                    type="text"
                    value={invitationForm.meetingTime}
                    onChange={e => setInvitationForm(prev => ({ ...prev, meetingTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    placeholder="16:30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lieu de réception</label>
                <input
                  type="text"
                  value={invitationForm.location}
                  onChange={e => setInvitationForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif officiel du rendez-vous</label>
                <textarea
                  value={invitationForm.reason}
                  onChange={e => setInvitationForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmettre la convocation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Billet de Sanction Disciplinaire */}
      {activeModal === 'sanction' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
                <h3 className="font-bold text-slate-900 text-sm">Billet de Sanction Disciplinaire</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSanction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Élève sanctionné</label>
                <select
                  value={sanctionForm.studentId}
                  onChange={e => setSanctionForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {classStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nature de la sanction</label>
                  <select
                    value={sanctionForm.sanctionType}
                    onChange={e => setSanctionForm(prev => ({ ...prev, sanctionType: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="exclusion_temporaire">Exclusion Temporaire</option>
                    <option value="exclusion_definitive">Exclusion Définitive</option>
                    <option value="retenue_officielle">Retenue Officielle</option>
                    <option value="avertissement_solennel">Avertissement Solennel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gravité</label>
                  <select
                    value={sanctionForm.gravityLevel}
                    onChange={e => setSanctionForm(prev => ({ ...prev, gravityLevel: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="grave">Grave</option>
                    <option value="tres_grave">Très grave</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>
              </div>

              {sanctionForm.sanctionType === 'exclusion_temporaire' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre de jours d'exclusion</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={sanctionForm.durationDays}
                    onChange={e => setSanctionForm(prev => ({ ...prev, durationDays: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date d'effet début</label>
                  <input
                    type="date"
                    value={sanctionForm.effectiveStartDate}
                    onChange={e => setSanctionForm(prev => ({ ...prev, effectiveStartDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date fin</label>
                  <input
                    type="date"
                    value={sanctionForm.effectiveEndDate}
                    onChange={e => setSanctionForm(prev => ({ ...prev, effectiveEndDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif officiel circonstancié</label>
                <textarea
                  value={sanctionForm.reason}
                  onChange={e => setSanctionForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Délivrer le billet de sanction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

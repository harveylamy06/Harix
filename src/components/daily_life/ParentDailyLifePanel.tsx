import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentUser } from '../../types';
import {
  FileCheck,
  Clock,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  PenTool,
  Check,
  Send,
  MessageSquare,
  Award,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

interface ParentDailyLifePanelProps {
  child: StudentUser;
}

export const ParentDailyLifePanel: React.FC<ParentDailyLifePanelProps> = ({ child }) => {
  const {
    currentUser,
    cardSignatures,
    conductRecords,
    attendanceRecords,
    parentInvitations,
    disciplinarySanctions,
    signSchoolCard,
    respondToParentInvitation,
    acknowledgeDisciplinarySanction,
    justifyAttendance
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'carte' | 'conduite' | 'absences' | 'invitations' | 'sanctions'
  >('all');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal interaction state
  const [signingCardId, setSigningCardId] = useState<string | null>(null);
  const [respondingInvId, setRespondingInvId] = useState<string | null>(null);
  const [responseType, setResponseType] = useState<'CONFIRMEE_PAR_PARENT' | 'REPORTEE'>('CONFIRMEE_PAR_PARENT');
  const [invitationNote, setInvitationNote] = useState<string>('');

  const [acknowledgingSanctionId, setAcknowledgingSanctionId] = useState<string | null>(null);
  const [sanctionNote, setSanctionNote] = useState<string>('');

  const [justifyingAttendanceId, setJustifyingAttendanceId] = useState<string | null>(null);
  const [attendanceJustification, setAttendanceJustification] = useState<string>('');

  // Child's specific data
  const myCards = cardSignatures.filter(c => c.studentId === child.id);
  const myConduct = conductRecords.filter(c => c.studentId === child.id);
  const myAttendance = attendanceRecords.filter(a => a.studentId === child.id);
  const myInvitations = parentInvitations.filter(i => i.studentId === child.id);
  const mySanctions = disciplinarySanctions.filter(s => s.studentId === child.id);

  // Urgent alerts
  const unsignedCards = myCards.filter(c => c.status !== 'SIGNEE');
  const pendingInvitations = myInvitations.filter(i => i.status === 'ENVOYEE');
  const unacknowledgedSanctions = mySanctions.filter(s => !s.acknowledgedByParent);
  const unjustifiedAttendance = myAttendance.filter(a => a.status === 'injustifiee' || a.status === 'en_attente_justificatif');

  // Handle Card Signature
  const handleConfirmCardSignature = (cardId: string) => {
    const parentName = currentUser?.name || 'Parent Responsable';
    const res = signSchoolCard(cardId, parentName);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    setSigningCardId(null);
  };

  // Handle Invitation Response
  const handleSendInvitationResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingInvId) return;
    const res = respondToParentInvitation(respondingInvId, responseType, invitationNote);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    setRespondingInvId(null);
    setInvitationNote('');
  };

  // Handle Sanction Acknowledgment
  const handleConfirmSanctionAcknowledgment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledgingSanctionId) return;
    const res = acknowledgeDisciplinarySanction(acknowledgingSanctionId, sanctionNote);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    setAcknowledgingSanctionId(null);
    setSanctionNote('');
  };

  // Handle Attendance Justification
  const handleSendAttendanceJustification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justifyingAttendanceId || !attendanceJustification) return;
    const res = justifyAttendance(justifyingAttendanceId, attendanceJustification);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    setJustifyingAttendanceId(null);
    setAttendanceJustification('');
  };

  return (
    <div className="space-y-5">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-amber-900/10 via-amber-800/10 to-emerald-900/10 border border-amber-300/60 rounded-2xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-amber-950">
              Vie Scolaire Quotidienne en Temps Réel : {child.name}
            </h2>
            <span className="text-[10px] uppercase font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
              Alimenté chaque jour par le professeur titulaire
            </span>
          </div>
          <p className="text-xs text-amber-900/80 mt-1">
            Suivi officiel des signatures de cartes, appréciations journalières de conduite, absences et retards, convocations officielles et notifications immédiates de sanctions.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          {unsignedCards.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1 animate-pulse">
              <FileCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>{unsignedCards.length} Carte à signer</span>
            </span>
          )}
          {unacknowledgedSanctions.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-bold flex items-center gap-1 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>{unacknowledgedSanctions.length} Sanction à viser</span>
            </span>
          )}
          {pendingInvitations.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-300 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>{pendingInvitations.length} Rendez-vous école</span>
            </span>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Immediate Notification Alert Banner for Sanctions if any unacknowledged */}
      {unacknowledgedSanctions.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-xs text-rose-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <strong className="text-sm font-extrabold text-rose-900 block">
                Notification Immédiate : Billet de sanction disciplinaire en attente d'accusé de réception
              </strong>
              <p className="mt-0.5 text-rose-800">
                L'établissement a délivré un avis officiel pour {child.name}. Conformément au règlement intérieur, vous devez obligatoirement en accuser réception formelle.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveCategory('sanctions');
              setAcknowledgingSanctionId(unacknowledgedSanctions[0].id);
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 shadow-xs flex items-center gap-1.5 transition"
          >
            <PenTool className="w-4 h-4" />
            <span>Consulter & Accuser Réception</span>
          </button>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl transition ${
            activeCategory === 'all'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Vue Globale
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
          <span>1. Signature Carte ({myCards.length})</span>
          {unsignedCards.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
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
          <span>2. Conduite Quotidienne ({myConduct.length})</span>
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
          <span>3. Absences & Retards ({myAttendance.length})</span>
          {unjustifiedAttendance.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          )}
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
          <span>4. Convocations Parents ({myInvitations.length})</span>
          {pendingInvitations.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          )}
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
          <span>5. Sanctions Disciplinaires ({mySanctions.length})</span>
          {unacknowledgedSanctions.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* ================= 1. SIGNATURE DE LA CARTE ================= */}
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
                  Notification quotidienne ou hebdomadaire indiquant si la carte scolaire a été signée.
                </p>
              </div>
            </div>
          </div>

          {myCards.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucun contrôle de carte scolaire enregistré pour l'instant.
            </div>
          ) : (
            <div className="space-y-3">
              {myCards.map(card => (
                <div
                  key={card.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    card.status === 'SIGNEE'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : card.status === 'EN_ATTENTE'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{card.weekLabel || card.periodType}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          card.status === 'SIGNEE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : card.status === 'EN_ATTENTE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {card.status === 'SIGNEE' ? 'Signée ✓' : card.status === 'EN_ATTENTE' ? 'En attente de signature parentale ⏳' : 'Rappel : Non signée ⚠️'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1.5 space-y-0.5">
                      <p>
                        Contrôlé le <strong>{card.date}</strong> (Fréquence : {card.periodType}) • Carte physique présentée : {card.isCardPresented ? 'Oui' : 'Non'}
                      </p>
                      {card.titularTeacherNote && (
                        <p className="text-slate-700 italic">
                          Observation du professeur : « {card.titularTeacherNote} »
                        </p>
                      )}
                      {card.signedByParentName && (
                        <p className="text-emerald-800 font-semibold">
                          Signée par {card.signedByParentName} le {card.signedAt ? new Date(card.signedAt).toLocaleDateString('fr-FR') : card.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {card.status !== 'SIGNEE' && (
                    <button
                      onClick={() => handleConfirmCardSignature(card.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 shadow-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>✍️ Signer numériquement la carte</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 2. SUIVI DE LA CONDUITE ================= */}
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
                  Évaluation quotidienne du comportement de l'élève par le professeur titulaire.
                </p>
              </div>
            </div>
          </div>

          {myConduct.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucune évaluation de conduite quotidienne enregistrée pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myConduct.map(cond => (
                <div key={cond.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Date : {cond.date}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        cond.rating === 'Exemplaire' || cond.rating === 'Très bonne'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : cond.rating === 'Bonne'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {cond.rating}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <strong>Observation :</strong> {cond.observation}
                  </p>

                  {cond.encouragementOrWarning && (
                    <p className="text-xs text-teal-900 font-medium bg-teal-50/60 p-2 rounded-lg border border-teal-200/60">
                      <strong>Recommandation :</strong> {cond.encouragementOrWarning}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Par : {cond.teacherName}</span>
                    {cond.score !== undefined && (
                      <span className="font-bold text-slate-700">Note : {cond.score}/5</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. ABSENCES ET RETARDS ================= */}
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
          </div>

          {myAttendance.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Parfait ! Aucune absence ni retard constaté.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myAttendance.map(att => (
                <div
                  key={att.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Le {att.date}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          att.type !== 'retard'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {att.type !== 'retard' ? 'Absence' : `Retard (${att.delayMinutes || 15} min)`}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          att.status === 'justifiee'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {att.status === 'justifiee' ? 'Justifiée ✓' : 'Injustifiée ⚠️'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Motif relevé :</strong> {att.reason}
                    </p>

                    {att.parentJustificationNote && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1">
                        <strong>Votre justificatif transmis :</strong> « {att.parentJustificationNote} »
                      </div>
                    )}
                  </div>

                  {att.status !== 'justifiee' && (
                    <button
                      onClick={() => setJustifyingAttendanceId(att.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shrink-0 shadow-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Transmettre un justificatif</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. INVITATIONS DES PARENTS ================= */}
      {(activeCategory === 'all' || activeCategory === 'invitations') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  4. Invitations et Convocations Officielles des Parents
                </h3>
                <p className="text-xs text-slate-500">
                  Convocation officielle envoyée par l'école pour un rendez-vous avec le titulaire ou la direction.
                </p>
              </div>
            </div>
          </div>

          {myInvitations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Aucune convocation de rendez-vous en cours.
            </div>
          ) : (
            <div className="space-y-3">
              {myInvitations.map(inv => (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-slate-900">
                        Rendez-vous : {inv.meetingDate} à {inv.meetingTime}
                      </strong>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          inv.status === 'CONFIRMEE_PAR_PARENT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : inv.status === 'REPORTEE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {inv.status === 'CONFIRMEE_PAR_PARENT'
                          ? 'Présence Confirmée ✓'
                          : inv.status === 'REPORTEE'
                          ? 'Demande de report transmise'
                          : 'En attente de votre réponse'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">
                      <strong>Lieu :</strong> {inv.location} • <strong>Émis par :</strong> {inv.sentByName}
                    </p>

                    <p className="text-xs text-slate-800 bg-white p-2 rounded-lg border border-amber-100">
                      <strong>Motif officiel :</strong> {inv.reason}
                    </p>

                    {inv.parentResponseNote && (
                      <p className="text-xs text-amber-900 bg-amber-100/70 p-1.5 rounded-lg">
                        <strong>Votre note :</strong> « {inv.parentResponseNote} »
                      </p>
                    )}
                  </div>

                  {inv.status === 'ENVOYEE' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setRespondingInvId(inv.id);
                          setResponseType('CONFIRMEE_PAR_PARENT');
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirmer ma présence</span>
                      </button>
                      <button
                        onClick={() => {
                          setRespondingInvId(inv.id);
                          setResponseType('REPORTEE');
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Demander un report</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. SANCTIONS DISCIPLINAIRES ================= */}
      {(activeCategory === 'all' || activeCategory === 'sanctions') && (
        <div className="bg-white rounded-2xl border-2 border-rose-300 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  5. Sanctions Disciplinaires (Billet d'Exclusion ou Avertissement)
                </h3>
                <p className="text-xs text-slate-500">
                  Notification immédiate en cas de billet d'exclusion temporaire ou définitive.
                </p>
              </div>
            </div>
          </div>

          {mySanctions.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-800 bg-emerald-50 rounded-xl font-medium border border-emerald-200">
              Aucune sanction disciplinaire. Conduite exemplaire et respect des règles scolaires.
            </div>
          ) : (
            <div className="space-y-3">
              {mySanctions.map(sanc => (
                <div
                  key={sanc.id}
                  className="p-4.5 rounded-xl border-2 border-rose-400 bg-rose-50/50 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-rose-700 text-white shadow-xs">
                        {sanc.sanctionType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Période : Du {sanc.effectiveStartDate}
                        {sanc.effectiveEndDate ? ` au ${sanc.effectiveEndDate}` : ''}
                        {sanc.durationDays ? ` (${sanc.durationDays} jour${sanc.durationDays > 1 ? 's' : ''})` : ''}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        sanc.acknowledgedByParent
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-600 text-white animate-pulse'
                      }`}
                    >
                      {sanc.acknowledgedByParent ? 'Accusé de réception validé ✓' : 'Accusé de réception obligatoire requis ⚠️'}
                    </span>
                  </div>

                  <div className="text-xs bg-white p-3 rounded-xl border border-rose-200 space-y-1">
                    <p className="text-slate-700">
                      <strong>Motif officiel circonstancié :</strong> {sanc.reason}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Délivré par : {sanc.issuedByName} • Date : {new Date(sanc.issuedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {sanc.acknowledgedByParent && sanc.parentAcknowledgmentNote && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                      <strong>Votre accusé de réception :</strong> « {sanc.parentAcknowledgmentNote} » (signé le {sanc.acknowledgedAt ? new Date(sanc.acknowledgedAt).toLocaleDateString('fr-FR') : 'ce jour'})
                    </div>
                  )}

                  {!sanc.acknowledgedByParent && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setAcknowledgingSanctionId(sanc.id)}
                        className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                      >
                        <PenTool className="w-4 h-4" />
                        <span>📋 Accuser réception formelle du billet</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODALS D'INTERACTION PARENT ================= */}

      {/* Modal Accuser réception Sanction */}
      {acknowledgingSanctionId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
                <h3 className="font-bold text-slate-900 text-sm">Accusé de Réception de la Sanction</h3>
              </div>
              <button onClick={() => setAcknowledgingSanctionId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSanctionAcknowledgment} className="space-y-4 text-xs">
              <p className="text-slate-600">
                En confirmant, vous attestez avoir pris connaissance officielle de ce billet disciplinaire concernant votre enfant <strong>{child.name}</strong>.
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Note ou commentaire du parent (facultatif)
                </label>
                <textarea
                  value={sanctionNote}
                  onChange={e => setSanctionNote(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Ex: Bien pris en compte, nous prenons les mesures nécessaires à la maison..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setAcknowledgingSanctionId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmer l'accusé de réception</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Répondre Invitation Parent */}
      {respondingInvId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {responseType === 'CONFIRMEE_PAR_PARENT' ? 'Confirmation de Présence' : 'Demande de Report'}
                </h3>
              </div>
              <button onClick={() => setRespondingInvId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvitationResponse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Votre réponse</label>
                <select
                  value={responseType}
                  onChange={e => setResponseType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="CONFIRMEE_PAR_PARENT">Je confirme ma présence au rendez-vous ✓</option>
                  <option value="REPORTEE">Je sollicite un report de date / heure</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Message ou proposition de créneau (si report)
                </label>
                <textarea
                  value={invitationNote}
                  onChange={e => setInvitationNote(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  placeholder="Ex: Merci pour l'invitation, je serai présent..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setRespondingInvId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmettre ma réponse</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Justifier Absence */}
      {justifyingAttendanceId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">Transmettre un Justificatif Parental</h3>
              </div>
              <button onClick={() => setJustifyingAttendanceId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendAttendanceJustification} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Motif et explication de l'absence / retard
                </label>
                <textarea
                  value={attendanceJustification}
                  onChange={e => setAttendanceJustification(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  placeholder="Ex: Rendez-vous médical certifié par le docteur, certificat transmis par carnet..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setJustifyingAttendanceId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Enregistrer le justificatif</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

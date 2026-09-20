export type Role = 'super_admin' | 'school_admin' | 'teacher' | 'parent' | 'student';

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logoBadge: string;
  directorName: string;
  directorEmail: string;
  directorPhone: string;
  foundedYear: number;
}

export interface ClassGroup {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: number; // 2, 3, 4, 5, 6 (2ème à 6ème année)
  titularTeacherId: string;
  titularTeacherName: string;
  roomNumber: string;
}

export interface UserBase {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
}

export interface SuperAdminUser extends UserBase {
  role: 'super_admin';
}

export interface SchoolAdminUser extends UserBase {
  role: 'school_admin';
  schoolId: string;
  title: string;
}

export interface TeacherUser extends UserBase {
  role: 'teacher';
  schoolId: string;
  subject: string;
  assignedClassIds: string[];
  titularClassId?: string; // Classe dont il est titulaire (droit spécifique d'écriture)
}

export interface ParentUser extends UserBase {
  role: 'parent';
  schoolId: string;
  childrenIds: string[]; // Liste des IDs de ses enfants
}

export interface StudentUser extends UserBase {
  role: 'student';
  schoolId: string;
  classId: string;
  gradeLevel: number; // 2 to 6
  parentId: string;
  matricule: string;
}

export type AppUser = SuperAdminUser | SchoolAdminUser | TeacherUser | ParentUser | StudentUser;

// Communication (Exclusivement publié par l'Administrateur Dirigeant)
export interface CommunicationPost {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: 'Administrateur (Dirigeant)';
  publishedAt: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: 'all' | 'parents' | 'teachers' | 'students';
}

// Progrès de l'élève (Alimenté chaque jour par le Professeur Titulaire pour le suivi des parents en temps réel)
// Regroupe : Signature de la carte, Suivi de la conduite, Absences & retards, Invitations des parents, Sanctions disciplinaires
export interface ProgressEvaluation {
  id: string;
  studentId: string;
  classId: string;
  teacherId: string;
  teacherName: string;
  date: string;
  domain: string; // Ex: "Mathématiques", "Expression écrite", "Autonomie", "Comportement"
  rating: 'Remarquable' | 'Très satisfaisant' | 'En progrès' | 'Besoin de soutien';
  observation: string;
  recommendation: string;
}

// 1. Signature de la carte : Notification quotidienne ou hebdomadaire indiquant si la carte scolaire a été signée
export interface CardSignatureRecord {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  date: string;
  periodType: 'quotidienne' | 'hebdomadaire';
  weekLabel?: string;
  status: 'SIGNEE' | 'EN_ATTENTE' | 'NON_SIGNEE_RAPPEL';
  signedByParentName?: string;
  signedAt?: string;
  titularTeacherNote?: string;
  isCardPresented: boolean; // Présentation de la carte physique au titulaire
}

// 2. Suivi de la conduite : Évaluation du comportement de l'élève au jour le jour
export interface ConductRecord {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  date: string;
  teacherId: string;
  teacherName: string;
  rating: 'Exemplaire' | 'Très bonne' | 'Bonne' | 'Bavardages / Agitation' | 'Manque de travail / Oubli matériel' | 'Avertissement verbal';
  score: number; // Ex: 5/5, 4/5, 2/5
  observation: string;
  encouragementOrWarning?: string;
}

// 3. Absences et retards : Historique précis des jours où l'élève a raté l'école
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  date: string;
  type: 'absence_journee' | 'absence_demi_journee' | 'retard';
  delayMinutes?: number;
  status: 'justifiee' | 'injustifiee' | 'en_attente_justificatif';
  reason: string;
  certificateProvided: boolean;
  recordedByTeacherName: string;
  parentJustificationNote?: string;
}

// 4. Invitations des parents : Convocation officielle envoyée par l'école pour un rendez-vous
export interface ParentInvitation {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  dateInvitation: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  reason: string; // Motif officiel
  sentByRole: 'Professeur Titulaire' | 'Direction / École';
  sentByName: string;
  status: 'ENVOYEE' | 'CONFIRMEE_PAR_PARENT' | 'REPORTEE' | 'REALISEE';
  parentResponseNote?: string;
  reportSummary?: string;
}

// 5. Sanctions disciplinaires : Notification immédiate en cas de billet d'exclusion temporaire ou définitive
export interface DisciplinarySanction {
  id: string;
  studentId: string;
  classId: string;
  schoolId: string;
  sanctionType: 'exclusion_temporaire' | 'exclusion_definitive' | 'retenue_officielle' | 'avertissement_solennel';
  durationDays?: number; // Pour exclusion temporaire
  effectiveStartDate: string;
  effectiveEndDate?: string;
  gravityLevel: 'grave' | 'tres_grave' | 'critique';
  reason: string;
  issuedByRole: 'Professeur Titulaire' | 'Direction / École';
  issuedByName: string;
  issuedAt: string;
  acknowledgedByParent: boolean;
  acknowledgedAt?: string;
  parentAcknowledgmentNote?: string;
}

// Points de l'élève (Notes saisies par le professeur titulaire)
export interface StudentGrade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  evaluationTitle: string;
  score: number;
  maxScore: number;
  coefficient: number;
  term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3';
  date: string;
  comment?: string;
}

// Zone de Contact Prof + Dirigeant (Gérée exclusivement par l'Administrateur)
export interface ContactInfoChannel {
  id: string;
  schoolId: string;
  category: 'direction' | 'enseignant_titulaire' | 'secretariat' | 'urgence';
  title: string;
  contactPerson: string;
  email: string;
  phone: string;
  availabilityHours: string;
  location: string;
  guidelines: string;
}

// Groupe de l'école (Espace communautaire géré par l'Administrateur)
export interface SchoolCommunityPost {
  id: string;
  schoolId: string;
  title: string;
  body: string;
  category: 'Événement' | 'Projet Éducatif' | 'Vie Scolaire' | 'Annonce';
  authorName: string;
  date: string;
  isPinned: boolean;
  likesCount: number;
}

// Travaux Pratiques (TP) pour la classe
export interface AssignmentTP {
  id: string;
  classId: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  title: string;
  instructions: string;
  assignedDate: string;
  dueDate: string;
  interSchoolGroupId?: string; // S'il s'agit d'un TP partagé inter-écoles (6ème)
  submissions: {
    studentId: string;
    studentName: string;
    submittedAt?: string;
    status: 'A_FAIRE' | 'RENDU' | 'CORRIGE';
    fileOrResponse?: string;
    grade?: number;
    teacherFeedback?: string;
  }[];
}

// Groupes Inter-Écoles (Spécificité 6ème année - Création et gestion exclusives par le Professeur Titulaire)
export interface InterSchoolGroup {
  id: string;
  name: string;
  description: string;
  theme: string;
  gradeLevel: 6; // Spécifique aux 6èmes
  leadTeacherId: string;
  leadTeacherName: string;
  leadSchoolName: string;
  createdAt: string;
  participatingClasses: {
    schoolId: string;
    schoolName: string;
    classId: string;
    className: string;
    titularTeacherName: string;
  }[];
  sharedProjects: {
    id: string;
    title: string;
    subject: string;
    objective: string;
    deadline: string;
  }[];
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  School,
  ClassGroup,
  AppUser,
  SuperAdminUser,
  SchoolAdminUser,
  TeacherUser,
  ParentUser,
  StudentUser,
  CommunicationPost,
  ProgressEvaluation,
  CardSignatureRecord,
  ConductRecord,
  AttendanceRecord,
  ParentInvitation,
  DisciplinarySanction,
  StudentGrade,
  ContactInfoChannel,
  SchoolCommunityPost,
  AssignmentTP,
  InterSchoolGroup
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_CLASSES,
  INITIAL_SUPER_ADMINS,
  INITIAL_SCHOOL_ADMINS,
  INITIAL_TEACHERS,
  INITIAL_PARENTS,
  INITIAL_STUDENTS,
  INITIAL_COMMUNICATIONS,
  INITIAL_PROGRESS_EVALUATIONS,
  INITIAL_CARD_SIGNATURES,
  INITIAL_CONDUCT_RECORDS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_PARENT_INVITATIONS,
  INITIAL_DISCIPLINARY_SANCTIONS,
  INITIAL_GRADES,
  INITIAL_CONTACT_CHANNELS,
  INITIAL_SCHOOL_GROUP_POSTS,
  INITIAL_ASSIGNMENT_TPS,
  INITIAL_INTER_SCHOOL_GROUPS
} from '../data/initialData';

interface AppContextType {
  // Data
  schools: School[];
  classes: ClassGroup[];
  superAdmins: SuperAdminUser[];
  schoolAdmins: SchoolAdminUser[];
  teachers: TeacherUser[];
  parents: ParentUser[];
  students: StudentUser[];
  communications: CommunicationPost[];
  progressEvaluations: ProgressEvaluation[];
  cardSignatures: CardSignatureRecord[];
  conductRecords: ConductRecord[];
  attendanceRecords: AttendanceRecord[];
  parentInvitations: ParentInvitation[];
  disciplinarySanctions: DisciplinarySanction[];
  grades: StudentGrade[];
  contactChannels: ContactInfoChannel[];
  schoolGroupPosts: SchoolCommunityPost[];
  assignments: AssignmentTP[];
  interSchoolGroups: InterSchoolGroup[];

  // Session
  currentUser: AppUser | null;
  currentSchool: School | null;
  selectedChild: StudentUser | null;
  selectedChildId: string | null;

  // Actions
  selectSchool: (school: School | null) => void;
  setSelectedChildId: (childId: string | null) => void;
  loginAsParentByIdentifier: (schoolId: string, identifier: string) => { success: boolean; parent?: ParentUser; children?: StudentUser[]; message?: string };
  loginAsStudentByIdentifier: (schoolId: string, identifier: string) => { success: boolean; student?: StudentUser; message?: string };
  loginDirectly: (user: AppUser, schoolId?: string, childId?: string) => void;
  logout: () => void;

  // Role-guarded Actions
  publishCommunication: (data: { title: string; content: string; priority: 'normal' | 'important' | 'urgent'; targetAudience: 'all' | 'parents' | 'teachers' | 'students' }) => { success: boolean; message: string };
  deleteCommunication: (id: string) => void;
  
  // Progrès de l'élève & Vie Scolaire Quotidienne (Alimenté chaque jour par le Professeur Titulaire)
  addProgressEvaluation: (data: { studentId: string; classId: string; domain: string; rating: 'Remarquable' | 'Très satisfaisant' | 'En progrès' | 'Besoin de soutien'; observation: string; recommendation: string }) => { success: boolean; message: string };
  recordCardSignature: (data: Omit<CardSignatureRecord, 'id'>) => { success: boolean; message: string };
  recordDailyConduct: (data: Omit<ConductRecord, 'id' | 'teacherId' | 'teacherName'>) => { success: boolean; message: string };
  recordAttendance: (data: Omit<AttendanceRecord, 'id' | 'recordedByTeacherName'>) => { success: boolean; message: string };
  createParentInvitation: (data: Omit<ParentInvitation, 'id' | 'dateInvitation' | 'status' | 'sentByName'>) => { success: boolean; message: string };
  issueDisciplinarySanction: (data: Omit<DisciplinarySanction, 'id' | 'issuedAt' | 'acknowledgedByParent' | 'issuedByName'>) => { success: boolean; message: string };

  // Actions d'interaction Parent (Signature carte, accusé de réception, justification)
  signSchoolCard: (cardId: string, parentName: string) => { success: boolean; message: string };
  respondToParentInvitation: (invitationId: string, response: 'CONFIRMEE_PAR_PARENT' | 'REPORTEE', note?: string) => { success: boolean; message: string };
  acknowledgeDisciplinarySanction: (sanctionId: string, note?: string) => { success: boolean; message: string };
  justifyAttendance: (attendanceId: string, justification: string) => { success: boolean; message: string };
  
  addGrade: (data: { studentId: string; classId: string; subject: string; evaluationTitle: string; score: number; maxScore: number; coefficient: number; term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3'; comment?: string }) => { success: boolean; message: string };
  
  createAssignmentTP: (data: { classId: string; subject: string; title: string; instructions: string; dueDate: string; interSchoolGroupId?: string }) => { success: boolean; message: string };
  submitTP: (tpId: string, responseText: string) => { success: boolean; message: string };
  gradeTP: (tpId: string, studentId: string, grade: number, teacherFeedback: string) => { success: boolean; message: string };

  createInterSchoolGroup: (data: { name: string; description: string; theme: string; partnerClassIds: string[] }) => { success: boolean; message: string };
  addProjectToInterSchoolGroup: (groupId: string, project: { title: string; subject: string; objective: string; deadline: string }) => { success: boolean; message: string };

  addContactChannel: (data: Omit<ContactInfoChannel, 'id' | 'schoolId'>) => { success: boolean; message: string };
  updateContactChannel: (channel: ContactInfoChannel) => { success: boolean; message: string };
  deleteContactChannel: (id: string) => void;

  publishSchoolGroupPost: (data: { title: string; body: string; category: 'Événement' | 'Projet Éducatif' | 'Vie Scolaire' | 'Annonce'; isPinned: boolean }) => { success: boolean; message: string };
  likeSchoolGroupPost: (id: string) => void;

  // Super Admin specific
  registerSchool: (school: Omit<School, 'id'>, director: { name: string; email: string; phone: string; title: string }) => { success: boolean; message: string };
  registerTeacherByAdmin: (teacher: Omit<TeacherUser, 'id' | 'role'>) => { success: boolean; message: string };
  registerStudentByAdmin: (student: Omit<StudentUser, 'id' | 'role'>, parentData?: { name: string; email: string; phone: string }) => { success: boolean; message: string };

  // Utilities
  resetToDefaultData: () => void;
  getStudentById: (id: string) => StudentUser | undefined;
  getClassById: (id: string) => ClassGroup | undefined;
  getSchoolById: (id: string) => School | undefined;
  getParentById: (id: string) => ParentUser | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'educonnect_school_platform_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schools`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });

  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [superAdmins, setSuperAdmins] = useState<SuperAdminUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_superAdmins`);
    return saved ? JSON.parse(saved) : INITIAL_SUPER_ADMINS;
  });

  const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdminUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schoolAdmins`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_ADMINS;
  });

  const [teachers, setTeachers] = useState<TeacherUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teachers`);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [parents, setParents] = useState<ParentUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_parents`);
    return saved ? JSON.parse(saved) : INITIAL_PARENTS;
  });

  const [students, setStudents] = useState<StudentUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [communications, setCommunications] = useState<CommunicationPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_communications`);
    return saved ? JSON.parse(saved) : INITIAL_COMMUNICATIONS;
  });

  const [progressEvaluations, setProgressEvaluations] = useState<ProgressEvaluation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_progressEvaluations`);
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS_EVALUATIONS;
  });

  const [cardSignatures, setCardSignatures] = useState<CardSignatureRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cardSignatures`);
    return saved ? JSON.parse(saved) : INITIAL_CARD_SIGNATURES;
  });

  const [conductRecords, setConductRecords] = useState<ConductRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_conductRecords`);
    return saved ? JSON.parse(saved) : INITIAL_CONDUCT_RECORDS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendanceRecords`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [parentInvitations, setParentInvitations] = useState<ParentInvitation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_parentInvitations`);
    return saved ? JSON.parse(saved) : INITIAL_PARENT_INVITATIONS;
  });

  const [disciplinarySanctions, setDisciplinarySanctions] = useState<DisciplinarySanction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_disciplinarySanctions`);
    return saved ? JSON.parse(saved) : INITIAL_DISCIPLINARY_SANCTIONS;
  });

  const [grades, setGrades] = useState<StudentGrade[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_grades`);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [contactChannels, setContactChannels] = useState<ContactInfoChannel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contactChannels`);
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_CHANNELS;
  });

  const [schoolGroupPosts, setSchoolGroupPosts] = useState<SchoolCommunityPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schoolGroupPosts`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_GROUP_POSTS;
  });

  const [assignments, setAssignments] = useState<AssignmentTP[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENT_TPS;
  });

  const [interSchoolGroups, setInterSchoolGroups] = useState<InterSchoolGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_interSchoolGroups`);
    return saved ? JSON.parse(saved) : INITIAL_INTER_SCHOOL_GROUPS;
  });

  // Active Session State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : INITIAL_SUPER_ADMINS[0]; // Super Admin logged in by default with immediate switcher
  });

  const [currentSchool, setCurrentSchool] = useState<School | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentSchool`);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS[0];
  });

  const [selectedChildId, setSelectedChildId] = useState<string | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selectedChildId`);
    return saved ? saved : 'student-1'; // Default Lucas Bernard
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_schools`, JSON.stringify(schools));
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
    localStorage.setItem(`${STORAGE_KEY}_superAdmins`, JSON.stringify(superAdmins));
    localStorage.setItem(`${STORAGE_KEY}_schoolAdmins`, JSON.stringify(schoolAdmins));
    localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
    localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(parents));
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    localStorage.setItem(`${STORAGE_KEY}_communications`, JSON.stringify(communications));
    localStorage.setItem(`${STORAGE_KEY}_progressEvaluations`, JSON.stringify(progressEvaluations));
    localStorage.setItem(`${STORAGE_KEY}_cardSignatures`, JSON.stringify(cardSignatures));
    localStorage.setItem(`${STORAGE_KEY}_conductRecords`, JSON.stringify(conductRecords));
    localStorage.setItem(`${STORAGE_KEY}_attendanceRecords`, JSON.stringify(attendanceRecords));
    localStorage.setItem(`${STORAGE_KEY}_parentInvitations`, JSON.stringify(parentInvitations));
    localStorage.setItem(`${STORAGE_KEY}_disciplinarySanctions`, JSON.stringify(disciplinarySanctions));
    localStorage.setItem(`${STORAGE_KEY}_grades`, JSON.stringify(grades));
    localStorage.setItem(`${STORAGE_KEY}_contactChannels`, JSON.stringify(contactChannels));
    localStorage.setItem(`${STORAGE_KEY}_schoolGroupPosts`, JSON.stringify(schoolGroupPosts));
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
    localStorage.setItem(`${STORAGE_KEY}_interSchoolGroups`, JSON.stringify(interSchoolGroups));
  }, [
    schools, classes, superAdmins, schoolAdmins, teachers, parents, students,
    communications, progressEvaluations, cardSignatures, conductRecords, attendanceRecords, parentInvitations, disciplinarySanctions,
    grades, contactChannels, schoolGroupPosts, assignments, interSchoolGroups
  ]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentSchool) {
      localStorage.setItem(`${STORAGE_KEY}_currentSchool`, JSON.stringify(currentSchool));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_currentSchool`);
    }
  }, [currentSchool]);

  useEffect(() => {
    if (selectedChildId) {
      localStorage.setItem(`${STORAGE_KEY}_selectedChildId`, selectedChildId);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_selectedChildId`);
    }
  }, [selectedChildId]);

  const selectSchool = (school: School | null) => {
    setCurrentSchool(school);
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);
  const getClassById = (id: string) => classes.find(c => c.id === id);
  const getSchoolById = (id: string) => schools.find(s => s.id === id);
  const getParentById = (id: string) => parents.find(p => p.id === id);

  const selectedChild = selectedChildId ? getStudentById(selectedChildId) || null : null;

  // Parcours Parent : Saisie téléphone ou email -> liste des enfants
  const loginAsParentByIdentifier = (schoolId: string, identifier: string) => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    const parent = parents.find(p => {
      const matchSchool = p.schoolId === schoolId;
      const matchEmail = p.email.toLowerCase() === cleanId;
      const matchPhone = p.phone.replace(/\s+/g, '') === cleanId || p.phone.replace(/\s+/g, '').endsWith(cleanId.slice(-8));
      return matchSchool && (matchEmail || matchPhone);
    });

    if (!parent) {
      return {
        success: false,
        message: 'Aucun compte Parent trouvé pour cet identifiant dans cet établissement.'
      };
    }

    const parentChildren = students.filter(s => parent.childrenIds.includes(s.id));
    
    // Connect user and set default active child
    setCurrentUser(parent);
    const targetSchool = schools.find(s => s.id === schoolId) || null;
    setCurrentSchool(targetSchool);
    if (parentChildren.length > 0) {
      setSelectedChildId(parentChildren[0].id);
    }

    return {
      success: true,
      parent,
      children: parentChildren
    };
  };

  // Parcours Élève (2ème à 6ème année) : Saisie téléphone ou email -> Accès Classe & TPs
  const loginAsStudentByIdentifier = (schoolId: string, identifier: string) => {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    const student = students.find(s => {
      const matchSchool = s.schoolId === schoolId;
      const matchEmail = s.email.toLowerCase() === cleanId;
      const matchPhone = s.phone.replace(/\s+/g, '') === cleanId || s.phone.replace(/\s+/g, '').endsWith(cleanId.slice(-8));
      const matchMatricule = s.matricule.toLowerCase() === cleanId;
      return matchSchool && (matchEmail || matchPhone || matchMatricule);
    });

    if (!student) {
      return {
        success: false,
        message: 'Aucun compte Élève trouvé avec cet e-mail, téléphone ou matricule dans cet établissement.'
      };
    }

    setCurrentUser(student);
    const targetSchool = schools.find(s => s.id === schoolId) || null;
    setCurrentSchool(targetSchool);
    setSelectedChildId(student.id);

    return {
      success: true,
      student
    };
  };

  const loginDirectly = (user: AppUser, schoolId?: string, childId?: string) => {
    setCurrentUser(user);
    if (schoolId) {
      const school = schools.find(s => s.id === schoolId) || null;
      setCurrentSchool(school);
    } else if ('schoolId' in user && user.schoolId) {
      const school = schools.find(s => s.id === user.schoolId) || null;
      setCurrentSchool(school);
    }
    if (childId) {
      setSelectedChildId(childId);
    } else if (user.role === 'parent' && user.childrenIds.length > 0) {
      setSelectedChildId(user.childrenIds[0]);
    } else if (user.role === 'student') {
      setSelectedChildId(user.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // 1. Communication : Seul l'Administrateur (dirigeant) a le droit d'y publier des messages
  const publishCommunication = (data: {
    title: string;
    content: string;
    priority: 'normal' | 'important' | 'urgent';
    targetAudience: 'all' | 'parents' | 'teachers' | 'students';
  }) => {
    if (!currentUser || (currentUser.role !== 'school_admin' && currentUser.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Accès refusé : Seul l’Administrateur (dirigeant de l’école) a le droit de publier des messages dans la section Communication.'
      };
    }

    const schoolId = (currentUser as SchoolAdminUser).schoolId || currentSchool?.id || 'school-1';
    const newPost: CommunicationPost = {
      id: `comm-${Date.now()}`,
      schoolId,
      title: data.title,
      content: data.content,
      authorName: currentUser.name,
      authorRole: 'Administrateur (Dirigeant)',
      publishedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      priority: data.priority,
      targetAudience: data.targetAudience
    };

    setCommunications(prev => [newPost, ...prev]);
    return { success: true, message: 'Message de communication officiel publié avec succès.' };
  };

  const deleteCommunication = (id: string) => {
    setCommunications(prev => prev.filter(c => c.id !== id));
  };

  // 2. Progrès de l'élève : Seul le professeur titulaire de la classe peut y inscrire les évaluations et suivis
  const addProgressEvaluation = (data: {
    studentId: string;
    classId: string;
    domain: string;
    rating: 'Remarquable' | 'Très satisfaisant' | 'En progrès' | 'Besoin de soutien';
    observation: string;
    recommendation: string;
  }) => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter.' };

    const isSuperAdmin = currentUser.role === 'super_admin';
    const isTeacher = currentUser.role === 'teacher';
    const isTitular = isTeacher && (currentUser as TeacherUser).titularClassId === data.classId;

    if (!isSuperAdmin && (!isTeacher || !isTitular)) {
      return {
        success: false,
        message: 'Accès restreint : Seul le professeur TITULAIRE de cette classe a le droit d’inscrire des évaluations de progrès pour cet élève.'
      };
    }

    const targetClass = classes.find(c => c.id === data.classId);
    const newProg: ProgressEvaluation = {
      id: `prog-${Date.now()}`,
      studentId: data.studentId,
      classId: data.classId,
      teacherId: currentUser.id,
      teacherName: `${currentUser.name} (Professeur Titulaire ${targetClass ? targetClass.name : ''})`,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      domain: data.domain,
      rating: data.rating,
      observation: data.observation,
      recommendation: data.recommendation
    };

    setProgressEvaluations(prev => [newProg, ...prev]);
    return { success: true, message: 'Évaluation et suivi pédagogique enregistrés dans le dossier de l’élève.' };
  };

  // 2a. Signature de la carte : Notification quotidienne ou hebdomadaire indiquant si la carte scolaire a été signée
  const recordCardSignature = (data: Omit<CardSignatureRecord, 'id'>) => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter.' };
    const isSuperAdmin = currentUser.role === 'super_admin';
    const isTeacher = currentUser.role === 'teacher';
    const isTitular = isTeacher && (currentUser as TeacherUser).titularClassId === data.classId;

    if (!isSuperAdmin && (!isTeacher || !isTitular)) {
      return {
        success: false,
        message: 'Accès restreint : Seul le professeur TITULAIRE de cette classe a le droit d’enregistrer le contrôle de signature de la carte scolaire.'
      };
    }

    const newRecord: CardSignatureRecord = {
      id: `card-${Date.now()}`,
      ...data
    };

    setCardSignatures(prev => [newRecord, ...prev]);
    return { success: true, message: 'Contrôle de signature de la carte scolaire enregistré avec succès.' };
  };

  // 2b. Suivi de la conduite : Évaluation du comportement de l'élève au jour le jour
  const recordDailyConduct = (data: Omit<ConductRecord, 'id' | 'teacherId' | 'teacherName'>) => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter.' };
    const isSuperAdmin = currentUser.role === 'super_admin';
    const isTeacher = currentUser.role === 'teacher';
    const isTitular = isTeacher && (currentUser as TeacherUser).titularClassId === data.classId;

    if (!isSuperAdmin && (!isTeacher || !isTitular)) {
      return {
        success: false,
        message: 'Accès restreint : Seul le professeur TITULAIRE de cette classe peut évaluer la conduite quotidienne de l’élève.'
      };
    }

    const newRecord: ConductRecord = {
      id: `cond-${Date.now()}`,
      ...data,
      teacherId: currentUser.id,
      teacherName: `${currentUser.name} (Professeur Titulaire)`
    };

    setConductRecords(prev => [newRecord, ...prev]);
    return { success: true, message: 'Suivi quotidien de la conduite consigné dans le carnet de l’élève.' };
  };

  // 2c. Absences et retards : Historique précis des jours où l'élève a raté l'école ou est arrivé en retard
  const recordAttendance = (data: Omit<AttendanceRecord, 'id' | 'recordedByTeacherName'>) => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter.' };
    const isSuperAdmin = currentUser.role === 'super_admin';
    const isTeacher = currentUser.role === 'teacher';
    const isSchoolAdmin = currentUser.role === 'school_admin';
    const isTitular = isTeacher && (currentUser as TeacherUser).titularClassId === data.classId;

    if (!isSuperAdmin && !isSchoolAdmin && (!isTeacher || !isTitular)) {
      return {
        success: false,
        message: 'Accès restreint : Seul le professeur titulaire de la classe ou la direction scolaire peut saisir une absence ou un retard.'
      };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      ...data,
      recordedByTeacherName: `${currentUser.name} (${isSchoolAdmin ? 'Direction' : 'Professeur Titulaire'})`
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    return { success: true, message: `${data.type === 'retard' ? 'Retard' : 'Absence'} consigné(e) avec succès.` };
  };

  // 2d. Invitations des parents : Convocation officielle envoyée par l'école / titulaire pour un rendez-vous
  const createParentInvitation = (data: Omit<ParentInvitation, 'id' | 'dateInvitation' | 'status' | 'sentByName'>) => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter.' };
    const isSuperAdmin = currentUser.role === 'super_admin';
    const isTeacher = currentUser.role === 'teacher';
    const isSchoolAdmin = currentUser.role === 'school_admin';
    const isTitular = isTeacher && (currentUser as TeacherUser).titularClassId === data.classId;

    if (!isSuperAdmin && !isSchoolAdmin && (!isTeacher || !isTitular)) {
      return {
        success: false,
        message: 'Accès restreint : Seul le professeur titulaire ou la direction peut émettre une convocation officielle pour un rendez-vous parent.'
      };
    }

    const newInv: ParentInvitation = {
      id: `inv-${Date.now()}`,
      ...data,
      dateInvitation: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      sentByName: currentUser.name,
      status: 'ENVOYEE'
    };

    setParentInvitations(prev => [newInv, ...prev]);
    return { success: true, message: 'Convocation officielle transmise immédiatement aux parents.' };
  };

  // 2e. Sanctions disciplinaires : Notification immédiate en cas de billet d'exclusion temporaire ou définitive
  const issueDisciplinarySanction = (data: Omit<DisciplinarySanction, 'id' | 'issuedAt' | 'acknowledgedByParent' | 'issuedByName'>) => {
    if (!currentUser) return { success: false, message: 'Veuillez vous connecter.' };
    const isSuperAdmin = currentUser.role === 'super_admin';
    const isTeacher = currentUser.role === 'teacher';
    const isSchoolAdmin = currentUser.role === 'school_admin';
    const isTitular = isTeacher && (currentUser as TeacherUser).titularClassId === data.classId;

    if (!isSuperAdmin && !isSchoolAdmin && (!isTeacher || !isTitular)) {
      return {
        success: false,
        message: 'Accès restreint : Seul le professeur titulaire de la classe ou la direction peut délivrer un billet de sanction disciplinaire.'
      };
    }

    const newSanc: DisciplinarySanction = {
      id: `sanc-${Date.now()}`,
      ...data,
      issuedByName: `${currentUser.name} (${isSchoolAdmin ? 'Direction' : 'Professeur Titulaire'})`,
      issuedAt: new Date().toISOString(),
      acknowledgedByParent: false
    };

    setDisciplinarySanctions(prev => [newSanc, ...prev]);
    return { success: true, message: 'Billet de sanction disciplinaire émis. Notification immédiate envoyée à la famille.' };
  };

  // Interactions Parent
  const signSchoolCard = (cardId: string, parentName: string) => {
    setCardSignatures(prev =>
      prev.map(c =>
        c.id === cardId
          ? {
              ...c,
              status: 'SIGNEE',
              signedByParentName: parentName,
              signedAt: new Date().toISOString()
            }
          : c
      )
    );
    return { success: true, message: 'Votre signature a été apposée avec succès sur la carte scolaire.' };
  };

  const respondToParentInvitation = (invitationId: string, response: 'CONFIRMEE_PAR_PARENT' | 'REPORTEE', note?: string) => {
    setParentInvitations(prev =>
      prev.map(inv =>
        inv.id === invitationId
          ? {
              ...inv,
              status: response,
              parentResponseNote: note || (response === 'CONFIRMEE_PAR_PARENT' ? 'Présence confirmée par le parent.' : 'Demande de report transmise à l’école.')
            }
          : inv
      )
    );
    return { success: true, message: response === 'CONFIRMEE_PAR_PARENT' ? 'Votre présence a été confirmée.' : 'Votre demande a été transmise.' };
  };

  const acknowledgeDisciplinarySanction = (sanctionId: string, note?: string) => {
    setDisciplinarySanctions(prev =>
      prev.map(s =>
        s.id === sanctionId
          ? {
              ...s,
              acknowledgedByParent: true,
              acknowledgedAt: new Date().toISOString(),
              parentAcknowledgmentNote: note || 'Pris en compte par les parents.'
            }
          : s
      )
    );
    return { success: true, message: 'Accusé de réception formellement consigné pour cette sanction.' };
  };

  const justifyAttendance = (attendanceId: string, justification: string) => {
    setAttendanceRecords(prev =>
      prev.map(att =>
        att.id === attendanceId
          ? {
              ...att,
              status: 'justifiee',
              certificateProvided: true,
              parentJustificationNote: justification
            }
          : att
      )
    );
    return { success: true, message: 'Justificatif parental transmis et enregistré avec succès.' };
  };

  // 3. Points de l'élève (Notes)
  const addGrade = (data: {
    studentId: string;
    classId: string;
    subject: string;
    evaluationTitle: string;
    score: number;
    maxScore: number;
    coefficient: number;
    term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3';
    comment?: string;
  }) => {
    if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Seul le corps professoral habilité peut saisir les notes et points des élèves.'
      };
    }

    const newGrade: StudentGrade = {
      id: `grade-${Date.now()}`,
      studentId: data.studentId,
      classId: data.classId,
      subject: data.subject,
      evaluationTitle: data.evaluationTitle,
      score: data.score,
      maxScore: data.maxScore,
      coefficient: data.coefficient,
      term: data.term,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      comment: data.comment
    };

    setGrades(prev => [newGrade, ...prev]);
    return { success: true, message: 'Note et points de l’élève ajoutés au bulletin.' };
  };

  // 4. Classe & Travaux Pratiques (TP)
  const createAssignmentTP = (data: {
    classId: string;
    subject: string;
    title: string;
    instructions: string;
    dueDate: string;
    interSchoolGroupId?: string;
  }) => {
    if (!currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'super_admin')) {
      return { success: false, message: 'Seuls les enseignants peuvent créer des Travaux Pratiques (TP).' };
    }

    const targetClass = classes.find(c => c.id === data.classId);
    const schoolId = targetClass ? targetClass.schoolId : (currentSchool?.id || 'school-1');

    // Pre-create student submission entries for the class
    const classStudents = students.filter(s => s.classId === data.classId);
    const initialSubmissions = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      status: 'A_FAIRE' as const
    }));

    const newTP: AssignmentTP = {
      id: `tp-${Date.now()}`,
      classId: data.classId,
      schoolId,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      subject: data.subject,
      title: data.title,
      instructions: data.instructions,
      assignedDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      dueDate: data.dueDate,
      interSchoolGroupId: data.interSchoolGroupId,
      submissions: initialSubmissions
    };

    setAssignments(prev => [newTP, ...prev]);
    return { success: true, message: 'Travail Pratique (TP) publié avec succès pour la classe.' };
  };

  const submitTP = (tpId: string, responseText: string) => {
    if (!currentUser) return { success: false, message: 'Connexion requise.' };

    const studentId = currentUser.role === 'student' ? currentUser.id : selectedChildId;
    if (!studentId) return { success: false, message: 'Identifiant élève introuvable.' };

    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : currentUser.name;

    setAssignments(prev => prev.map(tp => {
      if (tp.id !== tpId) return tp;
      const existingSubIndex = tp.submissions.findIndex(s => s.studentId === studentId);
      const updatedSub = {
        studentId,
        studentName,
        submittedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'RENDU' as const,
        fileOrResponse: responseText
      };

      let newSubs = [...tp.submissions];
      if (existingSubIndex >= 0) {
        newSubs[existingSubIndex] = { ...newSubs[existingSubIndex], ...updatedSub };
      } else {
        newSubs.push(updatedSub);
      }
      return { ...tp, submissions: newSubs };
    }));

    return { success: true, message: 'Votre travail pratique (TP) a été transmis au professeur.' };
  };

  const gradeTP = (tpId: string, studentId: string, grade: number, teacherFeedback: string) => {
    setAssignments(prev => prev.map(tp => {
      if (tp.id !== tpId) return tp;
      const newSubs = tp.submissions.map(sub => {
        if (sub.studentId !== studentId) return sub;
        return {
          ...sub,
          status: 'CORRIGE' as const,
          grade,
          teacherFeedback
        };
      });
      return { ...tp, submissions: newSubs };
    }));
    return { success: true, message: 'Notation et commentaires du TP enregistrés.' };
  };

  // 5. Spécificité 6ème année : Groupes Inter-Écoles (Création et gestion exclusives par le professeur titulaire de 6ème)
  const createInterSchoolGroup = (data: {
    name: string;
    description: string;
    theme: string;
    partnerClassIds: string[];
  }) => {
    if (!currentUser) return { success: false, message: 'Connexion requise.' };

    const isTeacher = currentUser.role === 'teacher';
    const teacher = isTeacher ? (currentUser as TeacherUser) : null;
    const isSuperAdmin = currentUser.role === 'super_admin';

    // Verify if teacher is titular of a 6th grade class
    const titularClass = teacher && teacher.titularClassId ? classes.find(c => c.id === teacher.titularClassId) : null;
    const is6thGradeTitular = titularClass && titularClass.gradeLevel === 6;

    if (!isSuperAdmin && (!teacher || !is6thGradeTitular)) {
      return {
        success: false,
        message: 'Règle stricte : Seul un professeur TITULAIRE d’une classe de 6ème année a le droit de créer et gérer des groupes inter-écoles.'
      };
    }

    // Lead class
    const leadClass = titularClass || classes.find(c => c.gradeLevel === 6)!;
    const leadSchool = schools.find(s => s.id === leadClass.schoolId)!;

    // Participating classes
    const participating: InterSchoolGroup['participatingClasses'] = [
      {
        schoolId: leadSchool.id,
        schoolName: leadSchool.name,
        classId: leadClass.id,
        className: leadClass.name,
        titularTeacherName: currentUser.name
      }
    ];

    // Add selected partner classes from other schools
    data.partnerClassIds.forEach(cid => {
      const cls = classes.find(c => c.id === cid);
      if (cls && cls.id !== leadClass.id) {
        const sch = schools.find(s => s.id === cls.schoolId);
        participating.push({
          schoolId: sch ? sch.id : 'school-partner',
          schoolName: sch ? sch.name : 'Établissement Partenaire',
          classId: cls.id,
          className: cls.name,
          titularTeacherName: cls.titularTeacherName
        });
      }
    });

    const newGroup: InterSchoolGroup = {
      id: `inter-group-${Date.now()}`,
      name: data.name,
      description: data.description,
      theme: data.theme,
      gradeLevel: 6,
      leadTeacherId: currentUser.id,
      leadTeacherName: currentUser.name,
      leadSchoolName: leadSchool.name,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      participatingClasses: participating,
      sharedProjects: [
        {
          id: `proj-${Date.now()}`,
          title: `Lancement du projet collaboratif : ${data.name}`,
          subject: data.theme,
          objective: 'Coordination pédagogique entre les classes partenaires de 6ème.',
          deadline: 'Fin de période'
        }
      ]
    };

    setInterSchoolGroups(prev => [newGroup, ...prev]);
    return { success: true, message: 'Groupe inter-écoles de 6ème créé avec succès sous votre autorité de titulaire.' };
  };

  const addProjectToInterSchoolGroup = (groupId: string, project: { title: string; subject: string; objective: string; deadline: string }) => {
    setInterSchoolGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        sharedProjects: [
          ...grp.sharedProjects,
          {
            id: `proj-${Date.now()}`,
            ...project
          }
        ]
      };
    }));
    return { success: true, message: 'Nouveau projet inter-écoles ajouté au groupe.' };
  };

  // 6. Contact Prof + Dirigeant : Zone de contact gérée exclusivement par l'Administrateur
  const addContactChannel = (data: Omit<ContactInfoChannel, 'id' | 'schoolId'>) => {
    if (!currentUser || (currentUser.role !== 'school_admin' && currentUser.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Accès refusé : La zone de contact Prof + Dirigeant est gérée exclusivement par l’Administrateur de l’établissement.'
      };
    }

    const schoolId = (currentUser as SchoolAdminUser).schoolId || currentSchool?.id || 'school-1';
    const newChan: ContactInfoChannel = {
      id: `contact-${Date.now()}`,
      schoolId,
      ...data
    };

    setContactChannels(prev => [...prev, newChan]);
    return { success: true, message: 'Canal de contact officiel configuré avec succès.' };
  };

  const updateContactChannel = (channel: ContactInfoChannel) => {
    if (!currentUser || (currentUser.role !== 'school_admin' && currentUser.role !== 'super_admin')) {
      return { success: false, message: 'Modification réservée à l’Administrateur.' };
    }
    setContactChannels(prev => prev.map(c => c.id === channel.id ? channel : c));
    return { success: true, message: 'Coordonnées de contact mises à jour.' };
  };

  const deleteContactChannel = (id: string) => {
    setContactChannels(prev => prev.filter(c => c.id !== id));
  };

  // 7. Groupe de l'école : Espace communautaire géré par l'Administrateur
  const publishSchoolGroupPost = (data: {
    title: string;
    body: string;
    category: 'Événement' | 'Projet Éducatif' | 'Vie Scolaire' | 'Annonce';
    isPinned: boolean;
  }) => {
    if (!currentUser || (currentUser.role !== 'school_admin' && currentUser.role !== 'super_admin')) {
      return {
        success: false,
        message: 'Accès refusé : Le Groupe de l’école est un espace officiel administré et modéré exclusivement par la Direction.'
      };
    }

    const schoolId = (currentUser as SchoolAdminUser).schoolId || currentSchool?.id || 'school-1';
    const newPost: SchoolCommunityPost = {
      id: `post-${Date.now()}`,
      schoolId,
      title: data.title,
      body: data.body,
      category: data.category,
      authorName: currentUser.name,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      isPinned: data.isPinned,
      likesCount: 0
    };

    setSchoolGroupPosts(prev => [newPost, ...prev]);
    return { success: true, message: 'Publication enregistrée dans le Groupe de l’école.' };
  };

  const likeSchoolGroupPost = (id: string) => {
    setSchoolGroupPosts(prev => prev.map(p => p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p));
  };

  // 8. Super Administrateur : Inscription des dirigeants d'école et des enseignants
  const registerSchool = (schoolData: Omit<School, 'id'>, directorData: { name: string; email: string; phone: string; title: string }) => {
    if (!currentUser || currentUser.role !== 'super_admin') {
      return {
        success: false,
        message: 'Seul le Super Administrateur a le pouvoir d’inscrire un nouvel établissement et son dirigeant.'
      };
    }

    const newSchoolId = `school-${Date.now()}`;
    const newSchool: School = {
      ...schoolData,
      id: newSchoolId,
      directorName: directorData.name,
      directorEmail: directorData.email,
      directorPhone: directorData.phone
    };

    const newDirector: SchoolAdminUser = {
      id: `admin-school-${Date.now()}`,
      name: directorData.name,
      email: directorData.email,
      phone: directorData.phone,
      role: 'school_admin',
      schoolId: newSchoolId,
      title: directorData.title || 'Directeur d’Établissement'
    };

    setSchools(prev => [...prev, newSchool]);
    setSchoolAdmins(prev => [...prev, newDirector]);

    return { success: true, message: `Établissement "${newSchool.name}" et Dirigeant "${directorData.name}" enregistrés avec succès.` };
  };

  const registerTeacherByAdmin = (teacherData: Omit<TeacherUser, 'id' | 'role'>) => {
    if (!currentUser || (currentUser.role !== 'super_admin' && currentUser.role !== 'school_admin')) {
      return { success: false, message: 'Seuls le Super Administrateur et le Dirigeant d’établissement peuvent inscrire un enseignant.' };
    }

    const newTeacher: TeacherUser = {
      ...teacherData,
      id: `teacher-${Date.now()}`,
      role: 'teacher'
    };

    setTeachers(prev => [...prev, newTeacher]);

    // If titular assigned, update the class
    if (teacherData.titularClassId) {
      setClasses(prev => prev.map(c => {
        if (c.id === teacherData.titularClassId) {
          return {
            ...c,
            titularTeacherId: newTeacher.id,
            titularTeacherName: newTeacher.name
          };
        }
        return c;
      }));
    }

    return { success: true, message: `Professeur ${newTeacher.name} inscrit avec succès.` };
  };

  const registerStudentByAdmin = (studentData: Omit<StudentUser, 'id' | 'role'>, parentData?: { name: string; email: string; phone: string }) => {
    const studentId = `student-${Date.now()}`;
    let parentId = studentData.parentId;

    if (parentData && parentData.email) {
      let existingParent = parents.find(p => p.email.toLowerCase() === parentData.email.toLowerCase());
      if (existingParent) {
        parentId = existingParent.id;
        setParents(prev => prev.map(p => p.id === existingParent.id ? { ...p, childrenIds: [...p.childrenIds, studentId] } : p));
      } else {
        const newParentId = `parent-${Date.now()}`;
        const newParent: ParentUser = {
          id: newParentId,
          name: parentData.name,
          email: parentData.email,
          phone: parentData.phone,
          role: 'parent',
          schoolId: studentData.schoolId,
          childrenIds: [studentId]
        };
        parentId = newParentId;
        setParents(prev => [...prev, newParent]);
      }
    }

    const newStudent: StudentUser = {
      ...studentData,
      id: studentId,
      parentId,
      role: 'student'
    };

    setStudents(prev => [...prev, newStudent]);
    return { success: true, message: `Élève ${newStudent.name} inscrit avec succès dans sa classe.` };
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_schools`);
    localStorage.removeItem(`${STORAGE_KEY}_classes`);
    localStorage.removeItem(`${STORAGE_KEY}_superAdmins`);
    localStorage.removeItem(`${STORAGE_KEY}_schoolAdmins`);
    localStorage.removeItem(`${STORAGE_KEY}_teachers`);
    localStorage.removeItem(`${STORAGE_KEY}_parents`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_communications`);
    localStorage.removeItem(`${STORAGE_KEY}_progressEvaluations`);
    localStorage.removeItem(`${STORAGE_KEY}_cardSignatures`);
    localStorage.removeItem(`${STORAGE_KEY}_conductRecords`);
    localStorage.removeItem(`${STORAGE_KEY}_attendanceRecords`);
    localStorage.removeItem(`${STORAGE_KEY}_parentInvitations`);
    localStorage.removeItem(`${STORAGE_KEY}_disciplinarySanctions`);
    localStorage.removeItem(`${STORAGE_KEY}_grades`);
    localStorage.removeItem(`${STORAGE_KEY}_contactChannels`);
    localStorage.removeItem(`${STORAGE_KEY}_schoolGroupPosts`);
    localStorage.removeItem(`${STORAGE_KEY}_assignments`);
    localStorage.removeItem(`${STORAGE_KEY}_interSchoolGroups`);
    localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    localStorage.removeItem(`${STORAGE_KEY}_currentSchool`);
    localStorage.removeItem(`${STORAGE_KEY}_selectedChildId`);

    setSchools(INITIAL_SCHOOLS);
    setClasses(INITIAL_CLASSES);
    setSuperAdmins(INITIAL_SUPER_ADMINS);
    setSchoolAdmins(INITIAL_SCHOOL_ADMINS);
    setTeachers(INITIAL_TEACHERS);
    setParents(INITIAL_PARENTS);
    setStudents(INITIAL_STUDENTS);
    setCommunications(INITIAL_COMMUNICATIONS);
    setProgressEvaluations(INITIAL_PROGRESS_EVALUATIONS);
    setCardSignatures(INITIAL_CARD_SIGNATURES);
    setConductRecords(INITIAL_CONDUCT_RECORDS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setParentInvitations(INITIAL_PARENT_INVITATIONS);
    setDisciplinarySanctions(INITIAL_DISCIPLINARY_SANCTIONS);
    setGrades(INITIAL_GRADES);
    setContactChannels(INITIAL_CONTACT_CHANNELS);
    setSchoolGroupPosts(INITIAL_SCHOOL_GROUP_POSTS);
    setAssignments(INITIAL_ASSIGNMENT_TPS);
    setInterSchoolGroups(INITIAL_INTER_SCHOOL_GROUPS);

    setCurrentUser(INITIAL_SUPER_ADMINS[0]);
    setCurrentSchool(INITIAL_SCHOOLS[0]);
    setSelectedChildId('student-1');
  };

  return (
    <AppContext.Provider
      value={{
        schools,
        classes,
        superAdmins,
        schoolAdmins,
        teachers,
        parents,
        students,
        communications,
        progressEvaluations,
        cardSignatures,
        conductRecords,
        attendanceRecords,
        parentInvitations,
        disciplinarySanctions,
        grades,
        contactChannels,
        schoolGroupPosts,
        assignments,
        interSchoolGroups,
        currentUser,
        currentSchool,
        selectedChild,
        selectedChildId,
        selectSchool,
        setSelectedChildId,
        loginAsParentByIdentifier,
        loginAsStudentByIdentifier,
        loginDirectly,
        logout,
        publishCommunication,
        deleteCommunication,
        addProgressEvaluation,
        recordCardSignature,
        recordDailyConduct,
        recordAttendance,
        createParentInvitation,
        issueDisciplinarySanction,
        signSchoolCard,
        respondToParentInvitation,
        acknowledgeDisciplinarySanction,
        justifyAttendance,
        addGrade,
        createAssignmentTP,
        submitTP,
        gradeTP,
        createInterSchoolGroup,
        addProjectToInterSchoolGroup,
        addContactChannel,
        updateContactChannel,
        deleteContactChannel,
        publishSchoolGroupPost,
        likeSchoolGroupPost,
        registerSchool,
        registerTeacherByAdmin,
        registerStudentByAdmin,
        resetToDefaultData,
        getStudentById,
        getClassById,
        getSchoolById,
        getParentById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

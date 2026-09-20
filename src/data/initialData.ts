import {
  School,
  ClassGroup,
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

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Institution Saint-Exupéry',
    code: 'STEX-75015',
    city: 'Paris (15e)',
    address: '14 Rue Saint-Exupéry, 75015 Paris',
    phone: '01 45 78 90 00',
    email: 'contact@st-exupery.edu',
    logoBadge: '🏫',
    directorName: 'Claire Morel',
    directorEmail: 'dirigeant@st-exupery.edu',
    directorPhone: '06 11 22 33 44',
    foundedYear: 1988
  },
  {
    id: 'school-2',
    name: 'Groupe Scolaire Les Palmiers',
    code: 'PALM-06000',
    city: 'Nice',
    address: '28 Promenade des Arts, 06000 Nice',
    phone: '04 93 88 12 34',
    email: 'direction@lespalmiers.edu',
    logoBadge: '🌴',
    directorName: 'Marc Benali',
    directorEmail: 'direction@lespalmiers.edu',
    directorPhone: '06 22 33 44 55',
    foundedYear: 2004
  },
  {
    id: 'school-3',
    name: 'Complexe Éducatif Lumière',
    code: 'LUMI-69007',
    city: 'Lyon (7e)',
    address: '8 Place Jean Macé, 69007 Lyon',
    phone: '04 72 71 50 50',
    email: 'admin@ecole-lumiere.edu',
    logoBadge: '✨',
    directorName: 'Valérie Chardin',
    directorEmail: 'direction@ecole-lumiere.edu',
    directorPhone: '06 33 44 55 66',
    foundedYear: 1995
  }
];

export const INITIAL_CLASSES: ClassGroup[] = [
  // École 1 : Saint-Exupéry
  {
    id: 'class-1-2a',
    schoolId: 'school-1',
    name: 'Classe 2ème Année A',
    gradeLevel: 2,
    titularTeacherId: 'teacher-4',
    titularTeacherName: 'Hélène Dubois',
    roomNumber: 'Bât A - Salle 102'
  },
  {
    id: 'class-1-3a',
    schoolId: 'school-1',
    name: 'Classe 3ème Année A',
    gradeLevel: 3,
    titularTeacherId: 'teacher-5',
    titularTeacherName: 'Olivier Marchand',
    roomNumber: 'Bât A - Salle 105'
  },
  {
    id: 'class-1-4b',
    schoolId: 'school-1',
    name: 'Classe 4ème Année B',
    gradeLevel: 4,
    titularTeacherId: 'teacher-2',
    titularTeacherName: 'Sophie Martin',
    roomNumber: 'Bât B - Salle 204'
  },
  {
    id: 'class-1-5a',
    schoolId: 'school-1',
    name: 'Classe 5ème Année A',
    gradeLevel: 5,
    titularTeacherId: 'teacher-6',
    titularTeacherName: 'David Bernard',
    roomNumber: 'Bât B - Salle 208'
  },
  {
    id: 'class-1-6a',
    schoolId: 'school-1',
    name: 'Classe 6ème Année A (Cycle Sup)',
    gradeLevel: 6,
    titularTeacherId: 'teacher-1',
    titularTeacherName: 'Jean Vallier',
    roomNumber: 'Bât C - Salle Laboratoire 301'
  },
  // École 2 : Les Palmiers
  {
    id: 'class-2-6b',
    schoolId: 'school-2',
    name: 'Classe 6ème Année B',
    gradeLevel: 6,
    titularTeacherId: 'teacher-3',
    titularTeacherName: 'Pierre Lefèvre',
    roomNumber: 'Aile Nord - Salle 12'
  }
];

export const INITIAL_SUPER_ADMINS: SuperAdminUser[] = [
  {
    id: 'super-admin-1',
    name: 'Alexandre Dupont (Super Admin)',
    email: 'superadmin@educonnect.org',
    phone: '01 40 00 00 01',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SCHOOL_ADMINS: SchoolAdminUser[] = [
  {
    id: 'admin-school-1',
    name: 'Claire Morel',
    email: 'dirigeant@st-exupery.edu',
    phone: '06 11 22 33 44',
    role: 'school_admin',
    schoolId: 'school-1',
    title: 'Directrice Générale de l’Établissement'
  },
  {
    id: 'admin-school-2',
    name: 'Marc Benali',
    email: 'direction@lespalmiers.edu',
    phone: '06 22 33 44 55',
    role: 'school_admin',
    schoolId: 'school-2',
    title: 'Chef d’Établissement'
  },
  {
    id: 'admin-school-3',
    name: 'Valérie Chardin',
    email: 'direction@ecole-lumiere.edu',
    phone: '06 33 44 55 66',
    role: 'school_admin',
    schoolId: 'school-3',
    title: 'Proviseur & Dirigeante'
  }
];

export const INITIAL_TEACHERS: TeacherUser[] = [
  {
    id: 'teacher-1',
    name: 'Jean Vallier',
    email: 'jean.vallier@st-exupery.edu',
    phone: '06 91 12 23 34',
    role: 'teacher',
    schoolId: 'school-1',
    subject: 'Mathématiques & Sciences Expérimentales',
    assignedClassIds: ['class-1-6a'],
    titularClassId: 'class-1-6a' // Professeur titulaire de 6ème A
  },
  {
    id: 'teacher-2',
    name: 'Sophie Martin',
    email: 'sophie.martin@st-exupery.edu',
    phone: '06 92 23 34 45',
    role: 'teacher',
    schoolId: 'school-1',
    subject: 'Lettres, Histoire & Géographie',
    assignedClassIds: ['class-1-4b'],
    titularClassId: 'class-1-4b' // Professeur titulaire de 4ème B
  },
  {
    id: 'teacher-3',
    name: 'Pierre Lefèvre',
    email: 'pierre.lefevre@lespalmiers.edu',
    phone: '06 93 34 45 56',
    role: 'teacher',
    schoolId: 'school-2',
    subject: 'Sciences Naturelles & Robotique',
    assignedClassIds: ['class-2-6b'],
    titularClassId: 'class-2-6b' // Titulaire 6ème B aux Palmiers
  },
  {
    id: 'teacher-4',
    name: 'Hélène Dubois',
    email: 'helene.dubois@st-exupery.edu',
    phone: '06 94 45 56 67',
    role: 'teacher',
    schoolId: 'school-1',
    subject: 'Fondamentaux & Éveil',
    assignedClassIds: ['class-1-2a'],
    titularClassId: 'class-1-2a' // Titulaire 2ème A
  },
  {
    id: 'teacher-5',
    name: 'Olivier Marchand',
    email: 'olivier.marchand@st-exupery.edu',
    phone: '06 95 56 67 78',
    role: 'teacher',
    schoolId: 'school-1',
    subject: 'Sciences & Découverte',
    assignedClassIds: ['class-1-3a'],
    titularClassId: 'class-1-3a'
  },
  {
    id: 'teacher-6',
    name: 'David Bernard',
    email: 'david.bernard@st-exupery.edu',
    phone: '06 96 67 78 89',
    role: 'teacher',
    schoolId: 'school-1',
    subject: 'Mathématiques Appliquées',
    assignedClassIds: ['class-1-5a'],
    titularClassId: 'class-1-5a'
  }
];

export const INITIAL_PARENTS: ParentUser[] = [
  {
    id: 'parent-1',
    name: 'Thomas Bernard',
    email: 'thomas.bernard@gmail.com',
    phone: '06 55 44 33 22',
    role: 'parent',
    schoolId: 'school-1',
    childrenIds: ['student-1', 'student-2'] // 2 enfants : Lucas (6ème) et Léa (4ème)
  },
  {
    id: 'parent-2',
    name: 'Amina Khelif',
    email: 'amina.khelif@outlook.fr',
    phone: '06 77 88 99 00',
    role: 'parent',
    schoolId: 'school-1',
    childrenIds: ['student-3'] // Ryan (3ème)
  },
  {
    id: 'parent-3',
    name: 'Nathalie Bensaid',
    email: 'nathalie.bensaid@yahoo.fr',
    phone: '06 88 99 00 11',
    role: 'parent',
    schoolId: 'school-2',
    childrenIds: ['student-4'] // Sarah (6ème aux Palmiers)
  },
  {
    id: 'parent-4',
    name: 'Guillaume Roux',
    email: 'guillaume.roux@free.fr',
    phone: '06 44 33 22 11',
    role: 'parent',
    schoolId: 'school-1',
    childrenIds: ['student-5'] // Arthur (2ème)
  }
];

export const INITIAL_STUDENTS: StudentUser[] = [
  {
    id: 'student-1',
    name: 'Lucas Bernard',
    email: 'lucas.bernard@eleve.st-exupery.edu',
    phone: '07 11 22 33 44',
    role: 'student',
    schoolId: 'school-1',
    classId: 'class-1-6a',
    gradeLevel: 6,
    parentId: 'parent-1',
    matricule: 'STEX-6A-01'
  },
  {
    id: 'student-2',
    name: 'Léa Bernard',
    email: 'lea.bernard@eleve.st-exupery.edu',
    phone: '07 22 33 44 55',
    role: 'student',
    schoolId: 'school-1',
    classId: 'class-1-4b',
    gradeLevel: 4,
    parentId: 'parent-1',
    matricule: 'STEX-4B-04'
  },
  {
    id: 'student-3',
    name: 'Ryan Khelif',
    email: 'ryan.khelif@eleve.st-exupery.edu',
    phone: '07 33 44 55 66',
    role: 'student',
    schoolId: 'school-1',
    classId: 'class-1-3a',
    gradeLevel: 3,
    parentId: 'parent-2',
    matricule: 'STEX-3A-09'
  },
  {
    id: 'student-4',
    name: 'Sarah Bensaid',
    email: 'sarah.bensaid@eleve.lespalmiers.edu',
    phone: '07 44 55 66 77',
    role: 'student',
    schoolId: 'school-2',
    classId: 'class-2-6b',
    gradeLevel: 6,
    parentId: 'parent-3',
    matricule: 'PALM-6B-02'
  },
  {
    id: 'student-5',
    name: 'Arthur Roux',
    email: 'arthur.roux@eleve.st-exupery.edu',
    phone: '07 55 66 77 88',
    role: 'student',
    schoolId: 'school-1',
    classId: 'class-1-2a',
    gradeLevel: 2,
    parentId: 'parent-4',
    matricule: 'STEX-2A-14'
  },
  {
    id: 'student-6',
    name: 'Inès Chevalier',
    email: 'ines.chevalier@eleve.st-exupery.edu',
    phone: '07 66 77 88 99',
    role: 'student',
    schoolId: 'school-1',
    classId: 'class-1-6a',
    gradeLevel: 6,
    parentId: 'parent-1',
    matricule: 'STEX-6A-02'
  }
];

export const INITIAL_COMMUNICATIONS: CommunicationPost[] = [
  {
    id: 'comm-1',
    schoolId: 'school-1',
    title: 'Circulaire Officielle : Calendrier du 1er Trimestre & Réunion des Parents',
    content: 'Chers parents et membres de la communauté éducative, l’établissement organise sa réunion plénière d’orientation le vendredi 24 octobre à 18h00 dans l’auditorium principal. Les professeurs titulaires accueilleront les familles pour faire le point sur la rentrée.',
    authorName: 'Claire Morel',
    authorRole: 'Administrateur (Dirigeant)',
    publishedAt: '15 Septembre 2026',
    priority: 'important',
    targetAudience: 'all'
  },
  {
    id: 'comm-2',
    schoolId: 'school-1',
    title: 'Protocole Sanitaire & Charte Numérique des Élèves',
    content: 'La charte d’utilisation des outils numériques a été actualisée pour l’ensemble des niveaux, de la 2ème à la 6ème année. Merci de veiller à la consultation régulière des travaux pratiques (TP) et des avis de direction.',
    authorName: 'Claire Morel',
    authorRole: 'Administrateur (Dirigeant)',
    publishedAt: '08 Septembre 2026',
    priority: 'normal',
    targetAudience: 'parents'
  },
  {
    id: 'comm-3',
    schoolId: 'school-2',
    title: 'Ouverture du Laboratoire Numérique Inter-Écoles',
    content: 'Nous sommes ravis d’annoncer le partenariat pédagogique inter-écoles pour nos classes de 6ème année. Nos professeurs titulaires coordonnent les premiers groupes d’échanges inter-établissements.',
    authorName: 'Marc Benali',
    authorRole: 'Administrateur (Dirigeant)',
    publishedAt: '12 Septembre 2026',
    priority: 'important',
    targetAudience: 'all'
  }
];

export const INITIAL_PROGRESS_EVALUATIONS: ProgressEvaluation[] = [
  // Évaluations pour Lucas Bernard (6ème A - Saint-Exupéry) par son titulaire Jean Vallier
  {
    id: 'prog-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    date: '18 Septembre 2026',
    domain: 'Mathématiques & Raisonnement Logique',
    rating: 'Remarquable',
    observation: 'Lucas fait preuve d’une excellente intuition mathématique. Ses démonstrations sont claires et structurées.',
    recommendation: 'Poursuivre sur cette dynamique et approfondir les défis de modélisation scientifique.'
  },
  {
    id: 'prog-2',
    studentId: 'student-1',
    classId: 'class-1-6a',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    date: '10 Septembre 2026',
    domain: 'Comportement & Participation Collective',
    rating: 'Très satisfaisant',
    observation: 'Élève moteur lors des travaux d’équipe. Lucas écoute ses camarades et prend des initiatives constructives.',
    recommendation: 'Encourager la prise de parole pour guider ses pairs lors des TPs collaboratifs.'
  },
  // Évaluations pour Léa Bernard (4ème B) par sa titulaire Sophie Martin
  {
    id: 'prog-3',
    studentId: 'student-2',
    classId: 'class-1-4b',
    teacherId: 'teacher-2',
    teacherName: 'Sophie Martin (Professeur Titulaire)',
    date: '16 Septembre 2026',
    domain: 'Expression Écrite & Vocabulaire',
    rating: 'Remarquable',
    observation: 'Richesse d’analyse et style soigné. Léa structure ses récits avec finesse et pertinence.',
    recommendation: 'Continuer les lectures conseillées pour diversifier le registre littéraire.'
  },
  {
    id: 'prog-4',
    studentId: 'student-2',
    classId: 'class-1-4b',
    teacherId: 'teacher-2',
    teacherName: 'Sophie Martin (Professeur Titulaire)',
    date: '09 Septembre 2026',
    domain: 'Assiduité & Organisation du Travail',
    rating: 'Très satisfaisant',
    observation: 'Cahier toujours impeccable, devoirs rendus dans les délais impartis.',
    recommendation: 'Maintenir ce sérieux exemplaire tout au long du cycle.'
  }
];

// 1. Signature de la carte (Notification quotidienne/hebdomadaire)
export const INITIAL_CARD_SIGNATURES: CardSignatureRecord[] = [
  {
    id: 'card-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-20',
    periodType: 'hebdomadaire',
    weekLabel: 'Semaine 3 (15 au 20 Septembre 2026)',
    status: 'SIGNEE',
    signedByParentName: 'Antoine Bernard',
    signedAt: '2026-09-20T07:45:00Z',
    titularTeacherNote: 'Carte scolaire présentée et visée le vendredi soir.',
    isCardPresented: true
  },
  {
    id: 'card-2',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-13',
    periodType: 'hebdomadaire',
    weekLabel: 'Semaine 2 (08 au 13 Septembre 2026)',
    status: 'SIGNEE',
    signedByParentName: 'Antoine Bernard',
    signedAt: '2026-09-13T18:20:00Z',
    titularTeacherNote: 'Signature parentale validée.',
    isCardPresented: true
  },
  {
    id: 'card-3',
    studentId: 'student-2',
    classId: 'class-1-4b',
    schoolId: 'school-1',
    date: '2026-09-20',
    periodType: 'hebdomadaire',
    weekLabel: 'Semaine 3 (15 au 20 Septembre 2026)',
    status: 'EN_ATTENTE',
    titularTeacherNote: 'À signer ce week-end par les parents et à rapporter lundi matin.',
    isCardPresented: true
  }
];

// 2. Suivi de la conduite (Évaluation au jour le jour)
export const INITIAL_CONDUCT_RECORDS: ConductRecord[] = [
  {
    id: 'cond-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-19',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    rating: 'Exemplaire',
    score: 5,
    observation: 'Attitude très positive, entraide naturelle envers ses camarades lors de la séance d’exercices.',
    encouragementOrWarning: 'Félicitations pour cet esprit de groupe remarquable.'
  },
  {
    id: 'cond-2',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-18',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    rating: 'Très bonne',
    score: 4.5,
    observation: 'Bonne concentration et participation active aux échanges scientifiques.',
    encouragementOrWarning: 'Très bonne régularité dans l’effort.'
  },
  {
    id: 'cond-3',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-16',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    rating: 'Bavardages / Agitation',
    score: 3,
    observation: 'Quelques dissipations en début d’après-midi avec son voisin de table. Recadrage rapide et efficace.',
    encouragementOrWarning: 'Maintenir la vigilance sur l’écoute dès la sonnerie.'
  },
  {
    id: 'cond-4',
    studentId: 'student-2',
    classId: 'class-1-4b',
    schoolId: 'school-1',
    date: '2026-09-19',
    teacherId: 'teacher-2',
    teacherName: 'Sophie Martin (Professeur Titulaire)',
    rating: 'Exemplaire',
    score: 5,
    observation: 'Comportement irréprochable et investissement constant tout au long de la semaine.',
    encouragementOrWarning: 'Bravo pour la tenue exemplaire.'
  }
];

// 3. Absences et retards (Historique précis des jours manqués ou retards)
export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-17',
    type: 'retard',
    delayMinutes: 15,
    status: 'justifiee',
    reason: 'Incident de transport sur la ligne de bus scolaire.',
    certificateProvided: true,
    recordedByTeacherName: 'Jean Vallier (Professeur Titulaire)',
    parentJustificationNote: 'Billet de retard transport validé et contresigné.'
  },
  {
    id: 'att-2',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    date: '2026-09-11',
    type: 'absence_demi_journee',
    status: 'justifiee',
    reason: 'Rendez-vous médical spécialisé (ophtalmologie).',
    certificateProvided: true,
    recordedByTeacherName: 'Jean Vallier (Professeur Titulaire)',
    parentJustificationNote: 'Certificat médical déposé au secrétariat.'
  },
  {
    id: 'att-3',
    studentId: 'student-2',
    classId: 'class-1-4b',
    schoolId: 'school-1',
    date: '2026-09-15',
    type: 'retard',
    delayMinutes: 10,
    status: 'justifiee',
    reason: 'Retard matinal exceptionnel.',
    certificateProvided: true,
    recordedByTeacherName: 'Sophie Martin (Professeur Titulaire)',
    parentJustificationNote: 'Mot du parent reçu sur carnet.'
  }
];

// 4. Invitations des parents (Convocation officielle pour rendez-vous)
export const INITIAL_PARENT_INVITATIONS: ParentInvitation[] = [
  {
    id: 'inv-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    dateInvitation: '2026-09-18',
    meetingDate: '2026-09-25',
    meetingTime: '17h15',
    location: 'Bureau du Professeur Titulaire (Bâtiment C - Salle 301)',
    reason: 'Point d’étape trimestriel et présentation des projets inter-écoles de 6ème.',
    sentByRole: 'Professeur Titulaire',
    sentByName: 'Jean Vallier',
    status: 'CONFIRMEE_PAR_PARENT',
    parentResponseNote: 'Confirmé. Nous serons présents à 17h15 avec plaisir.',
    reportSummary: 'Rendez-vous préparatoire aux échéances du trimestre.'
  },
  {
    id: 'inv-2',
    studentId: 'student-2',
    classId: 'class-1-4b',
    schoolId: 'school-1',
    dateInvitation: '2026-09-19',
    meetingDate: '2026-09-29',
    meetingTime: '16h45',
    location: 'Salle des Professeurs - Pôle Pédagogique',
    reason: 'Bilan d’intégration de rentrée et suivi des cours de langues vivantes.',
    sentByRole: 'Professeur Titulaire',
    sentByName: 'Sophie Martin',
    status: 'ENVOYEE'
  }
];

// 5. Sanctions disciplinaires (Notification immédiate de billet d'exclusion temporaire ou définitive)
export const INITIAL_DISCIPLINARY_SANCTIONS: DisciplinarySanction[] = [
  {
    id: 'sanc-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    sanctionType: 'avertissement_solennel',
    effectiveStartDate: '2026-09-16',
    gravityLevel: 'grave',
    reason: 'Rappel solennel au règlement intérieur suite à l’utilisation d’un appareil mobile non autorisé en interclasse.',
    issuedByRole: 'Professeur Titulaire',
    issuedByName: 'Jean Vallier (Professeur Titulaire)',
    issuedAt: '2026-09-16T15:30:00Z',
    acknowledgedByParent: true,
    acknowledgedAt: '2026-09-16T19:10:00Z',
    parentAcknowledgmentNote: 'Bien pris en compte par la famille. Recadrage effectué à la maison.'
  }
];

export const INITIAL_GRADES: StudentGrade[] = [
  // Notes de Lucas Bernard (6ème A)
  {
    id: 'grade-1',
    studentId: 'student-1',
    classId: 'class-1-6a',
    subject: 'Mathématiques',
    evaluationTitle: 'Devoir Surveillé N°1 : Fractions & Géométrie Plane',
    score: 18.5,
    maxScore: 20,
    coefficient: 2,
    term: 'Trimestre 1',
    date: '17 Septembre 2026',
    comment: 'Excellente copie. Démarche rigoureuse.'
  },
  {
    id: 'grade-2',
    studentId: 'student-1',
    classId: 'class-1-6a',
    subject: 'Sciences & Technologie',
    evaluationTitle: 'TP N°1 : Masse volumique et états de la matière',
    score: 19,
    maxScore: 20,
    coefficient: 1.5,
    term: 'Trimestre 1',
    date: '14 Septembre 2026',
    comment: 'Compte-rendu expérimental de très grande qualité.'
  },
  {
    id: 'grade-3',
    studentId: 'student-1',
    classId: 'class-1-6a',
    subject: 'Français',
    evaluationTitle: 'Contrôle de lecture et synthèse littéraire',
    score: 16.5,
    maxScore: 20,
    coefficient: 2,
    term: 'Trimestre 1',
    date: '11 Septembre 2026',
    comment: 'Bonne argumentation, orthographe soignée.'
  },
  // Notes de Léa Bernard (4ème B)
  {
    id: 'grade-4',
    studentId: 'student-2',
    classId: 'class-1-4b',
    subject: 'Français',
    evaluationTitle: 'Rédaction descriptive & figures de style',
    score: 17.5,
    maxScore: 20,
    coefficient: 2,
    term: 'Trimestre 1',
    date: '15 Septembre 2026',
    comment: 'Remarquable créativité.'
  },
  {
    id: 'grade-5',
    studentId: 'student-2',
    classId: 'class-1-4b',
    subject: 'Histoire & Géographie',
    evaluationTitle: 'Évaluation cartographique du bassin méditerranéen',
    score: 16,
    maxScore: 20,
    coefficient: 1,
    term: 'Trimestre 1',
    date: '12 Septembre 2026',
    comment: 'Repères historiques bien maîtrisés.'
  }
];

export const INITIAL_CONTACT_CHANNELS: ContactInfoChannel[] = [
  {
    id: 'contact-1',
    schoolId: 'school-1',
    category: 'direction',
    title: 'Direction Générale de l’Établissement',
    contactPerson: 'Mme Claire Morel (Directrice)',
    email: 'dirigeant@st-exupery.edu',
    phone: '01 45 78 90 01',
    availabilityHours: 'Lundi au Vendredi : 08h30 - 12h00 | 14h00 - 17h30',
    location: 'Bâtiment Administratif, Bureau 101',
    guidelines: 'Rendez-vous réservés aux démarches institutionnelles, bourses ou demandes administratives d’admission.'
  },
  {
    id: 'contact-2',
    schoolId: 'school-1',
    category: 'enseignant_titulaire',
    title: 'Pôle Professeurs Titulaires (Prise de contact officielle)',
    contactPerson: 'Coordination Pédagogique - Titulaires de Classe',
    email: 'titulaires@st-exupery.edu',
    phone: '01 45 78 90 05',
    availabilityHours: 'Permanences selon planning de classe (Mercredi matin et Vendredi après-midi)',
    location: 'Salle des Enseignants - Bâtiment Central',
    guidelines: 'Canal officiel régulé par la direction pour solliciter un entretien avec le professeur titulaire de votre enfant.'
  },
  {
    id: 'contact-3',
    schoolId: 'school-1',
    category: 'secretariat',
    title: 'Secrétariat Général & Vie Scolaire',
    contactPerson: 'M. Thomas Lemoine (Responsable Vie Scolaire)',
    email: 'viescolaire@st-exupery.edu',
    phone: '01 45 78 90 10',
    availabilityHours: 'En continu de 07h45 à 18h15 les jours de classe',
    location: 'Accueil Principal - Guichet Unique',
    guidelines: 'Pour toute déclaration d’absence, retard, certificat médical ou carnet de correspondance.'
  },
  {
    id: 'contact-4',
    schoolId: 'school-2',
    category: 'direction',
    title: 'Direction - Les Palmiers',
    contactPerson: 'M. Marc Benali',
    email: 'direction@lespalmiers.edu',
    phone: '04 93 88 12 35',
    availabilityHours: 'Mardi & Jeudi : 14h00 - 17h00',
    location: 'Bureau de Direction',
    guidelines: 'Permanence sur rendez-vous téléphonique préalable.'
  }
];

export const INITIAL_SCHOOL_GROUP_POSTS: SchoolCommunityPost[] = [
  {
    id: 'post-1',
    schoolId: 'school-1',
    title: 'Grand Forum des Sciences 2026 : Appel aux Projets de Classe',
    body: 'Le conseil d’établissement prépare l’exposition annuelle des travaux scientifiques. Toutes les classes de la 2ème à la 6ème année sont invitées à exposer leurs expériences menées sous l’égide de leurs professeurs.',
    category: 'Projet Éducatif',
    authorName: 'Claire Morel (Directrice)',
    date: '17 Septembre 2026',
    isPinned: true,
    likesCount: 38
  },
  {
    id: 'post-2',
    schoolId: 'school-1',
    title: 'Club Robotique & Initiation Informatique du Mercredi',
    body: 'Le club débutera ses activités le mercredi 1er octobre. Les inscriptions sont coordonnées par la direction scolaire. Ouvert en priorité aux élèves du cycle 3 (5ème et 6ème année).',
    category: 'Vie Scolaire',
    authorName: 'Claire Morel (Directrice)',
    date: '13 Septembre 2026',
    isPinned: false,
    likesCount: 24
  }
];

export const INITIAL_ASSIGNMENT_TPS: AssignmentTP[] = [
  {
    id: 'tp-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    subject: 'Sciences Expérimentales',
    title: 'TP N°2 : Détermination expérimentale de la flottabilité et masse volumique',
    instructions: '1. Télécharger la grille de relevé de mesures.\n2. Réaliser les trois immersions en éprouvette graduée.\n3. Noter les volumes déplacés en millilitres.\n4. Rédiger l’interprétation physique dans le formulaire de dépôt.',
    assignedDate: '16 Septembre 2026',
    dueDate: '25 Septembre 2026',
    submissions: [
      {
        studentId: 'student-1',
        studentName: 'Lucas Bernard',
        submittedAt: '18 Septembre 2026 à 16:45',
        status: 'RENDU',
        fileOrResponse: 'Rapport_TP2_LucasBernard.pdf - Résultats conformes aux prédictions théoriques.',
        grade: 19,
        teacherFeedback: 'Très rigoureux, mesures cohérentes et graphique parfait.'
      },
      {
        studentId: 'student-6',
        studentName: 'Inès Chevalier',
        status: 'A_FAIRE'
      }
    ]
  },
  {
    id: 'tp-2',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire)',
    subject: 'Mathématiques Appliquées',
    title: 'TP Numérique : Construction de polygones réguliers sur GeoGebra',
    instructions: 'À partir des théorèmes vus en classe, construire un hexagone régulier puis mesurer les diagonales. Déposer la capture d’écran annotée.',
    assignedDate: '18 Septembre 2026',
    dueDate: '28 Septembre 2026',
    submissions: [
      {
        studentId: 'student-1',
        studentName: 'Lucas Bernard',
        status: 'A_FAIRE'
      }
    ]
  },
  {
    id: 'tp-3',
    classId: 'class-1-4b',
    schoolId: 'school-1',
    teacherId: 'teacher-2',
    teacherName: 'Sophie Martin (Professeur Titulaire)',
    subject: 'Français',
    title: 'TP d’Écriture : Journal de bord d’un voyageur du XIXe siècle',
    instructions: 'Rédiger une page de carnet en utilisant les cinq sens pour décrire un port maritime. Longueur minimale : 250 mots.',
    assignedDate: '15 Septembre 2026',
    dueDate: '23 Septembre 2026',
    submissions: [
      {
        studentId: 'student-2',
        studentName: 'Léa Bernard',
        submittedAt: '17 Septembre 2026 à 18:20',
        status: 'RENDU',
        fileOrResponse: 'Journal_de_bord_Lea_Bernard.docx',
        grade: 18,
        teacherFeedback: 'Style remarquable et évocateur !'
      }
    ]
  },
  // TP Partagé Inter-Écoles (Spécificité 6ème année)
  {
    id: 'tp-inter-1',
    classId: 'class-1-6a',
    schoolId: 'school-1',
    teacherId: 'teacher-1',
    teacherName: 'Jean Vallier (Professeur Titulaire 6ème A)',
    subject: 'Projet Inter-Écoles Sciences & Environnement',
    title: 'TP Inter-Écoles 6ème : Cartographie des microclimats urbains',
    instructions: 'Projet collaboratif entre la 6ème A (Saint-Exupéry) et la 6ème B (Les Palmiers). Relevez la température à midi dans votre cour d’école et partagez vos données avec les élèves partenaires.',
    assignedDate: '17 Septembre 2026',
    dueDate: '30 Septembre 2026',
    interSchoolGroupId: 'inter-group-1',
    submissions: [
      {
        studentId: 'student-1',
        studentName: 'Lucas Bernard',
        submittedAt: '18 Septembre 2026 à 14:10',
        status: 'RENDU',
        fileOrResponse: 'Relevé_SaintExupery_CourNord_21.4C.csv'
      },
      {
        studentId: 'student-4',
        studentName: 'Sarah Bensaid',
        status: 'A_FAIRE'
      }
    ]
  }
];

// Spécificité 6ème année : Groupes Inter-Écoles
// Création et gestion sous le contrôle exclusif du professeur titulaire de 6ème
export const INITIAL_INTER_SCHOOL_GROUPS: InterSchoolGroup[] = [
  {
    id: 'inter-group-1',
    name: 'Alliance 6ème : Sciences & Climat Inter-Collèges',
    description: 'Réseau collaboratif inter-établissements réunissant les élèves de 6ème de Paris et de Nice pour des projets scientifiques croisés.',
    theme: 'Transition écologique, météorologie & sciences physiques',
    gradeLevel: 6,
    leadTeacherId: 'teacher-1',
    leadTeacherName: 'Jean Vallier',
    leadSchoolName: 'Institution Saint-Exupéry',
    createdAt: '10 Septembre 2026',
    participatingClasses: [
      {
        schoolId: 'school-1',
        schoolName: 'Institution Saint-Exupéry (Paris 15e)',
        classId: 'class-1-6a',
        className: 'Classe 6ème Année A',
        titularTeacherName: 'Jean Vallier'
      },
      {
        schoolId: 'school-2',
        schoolName: 'Groupe Scolaire Les Palmiers (Nice)',
        classId: 'class-2-6b',
        className: 'Classe 6ème Année B',
        titularTeacherName: 'Pierre Lefèvre'
      }
    ],
    sharedProjects: [
      {
        id: 'proj-1',
        title: 'Observatoire Météorologique Partagé Paris-Nice',
        subject: 'Sciences & Géographie',
        objective: 'Comparer les séries temporelles de température et d’ensoleillement entre les deux établissements partenaires.',
        deadline: '15 Octobre 2026'
      },
      {
        id: 'proj-2',
        title: 'Défi Calcul Mental & Algorithmes en Direct',
        subject: 'Mathématiques Inter-Classes',
        objective: 'Tournoi inter-établissements par équipes mixtes.',
        deadline: '10 Novembre 2026'
      }
    ]
  }
];

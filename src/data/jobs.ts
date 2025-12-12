// src/data/jobs.ts
// Centralized job data for all job-related screens

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: number;
  salaryPeriod: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
  experience: string;
  category: 'government' | 'private';
  tags: string[];
  isUrgent?: boolean;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  deadline: string;
  postedDate: string;
}

export const governmentJobs: Job[] = [
  {
    id: 'gov-1',
    title: 'Cyber Security Analyst',
    department: 'Ministry of Interior',
    location: 'Banjul',
    salary: 25000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '5+ Years',
    category: 'government',
    tags: ['Full Time', 'Banjul', 'IT Security'],
    isUrgent: true,
    icon: 'shield',
    iconBgColor: '#FEF3C7',
    iconColor: '#B45309',
    description: 'We are looking for a skilled Cyber Security Analyst to protect government systems and data from cyber threats. The ideal candidate will have extensive experience in threat detection, incident response, and security infrastructure management.',
    requirements: [
      'Bachelor\'s degree in Computer Science, Cybersecurity, or related field',
      'Minimum 5 years of experience in cybersecurity',
      'Certifications such as CISSP, CEH, or CompTIA Security+',
      'Experience with SIEM tools and threat intelligence platforms',
      'Strong knowledge of network security protocols'
    ],
    responsibilities: [
      'Monitor government networks for security breaches',
      'Investigate security incidents and provide detailed reports',
      'Implement security measures and protocols',
      'Conduct vulnerability assessments and penetration testing',
      'Train staff on security best practices'
    ],
    benefits: [
      'Competitive government salary',
      'Health insurance coverage',
      'Pension scheme',
      'Professional development opportunities',
      '30 days annual leave'
    ],
    deadline: '2025-01-15',
    postedDate: '2024-12-01'
  },
  {
    id: 'gov-2',
    title: 'Public Health Nurse',
    department: 'Ministry of Health',
    location: 'Serrekunda',
    salary: 18000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '3+ Years',
    category: 'government',
    tags: ['Full Time', 'Serrekunda', '3+ Years Exp'],
    isUrgent: false,
    icon: 'medical',
    iconBgColor: '#DBEAFE',
    iconColor: '#2563EB',
    description: 'Join our healthcare team as a Public Health Nurse. You will be responsible for providing community health services, conducting health education programs, and ensuring quality patient care.',
    requirements: [
      'Registered Nurse with valid license',
      'Bachelor\'s degree in Nursing',
      'Minimum 3 years of nursing experience',
      'Experience in public health settings preferred',
      'Strong communication and interpersonal skills'
    ],
    responsibilities: [
      'Provide nursing care to patients in community settings',
      'Conduct health education and awareness programs',
      'Administer vaccinations and immunizations',
      'Maintain accurate patient records',
      'Collaborate with healthcare teams'
    ],
    benefits: [
      'Government salary scale',
      'Medical benefits',
      'Housing allowance',
      'Training opportunities',
      'Job security'
    ],
    deadline: '2025-01-30',
    postedDate: '2024-12-05'
  },
  {
    id: 'gov-3',
    title: 'Forest Ranger',
    department: 'Dept. of Forestry',
    location: 'Brikama',
    salary: 12500,
    salaryPeriod: 'month',
    type: 'Contract',
    experience: '2+ Years',
    category: 'government',
    tags: ['Contract', 'Brikama', 'Field Work'],
    isUrgent: false,
    icon: 'tree',
    iconBgColor: '#D1FAE5',
    iconColor: '#059669',
    description: 'Protect and manage our national forest reserves. This role involves patrolling forest areas, preventing illegal logging, and participating in conservation efforts.',
    requirements: [
      'Diploma in Forestry, Environmental Science, or related field',
      'Physical fitness for field work',
      'Knowledge of local flora and fauna',
      'Valid driver\'s license',
      'Ability to work in remote areas'
    ],
    responsibilities: [
      'Patrol assigned forest areas regularly',
      'Report and prevent illegal logging activities',
      'Assist in tree planting and reforestation projects',
      'Monitor wildlife and report unusual activities',
      'Educate communities on forest conservation'
    ],
    benefits: [
      'Field allowance',
      'Uniform provided',
      'Transportation allowance',
      'Performance bonuses',
      'Contract renewal based on performance'
    ],
    deadline: '2025-02-15',
    postedDate: '2024-12-03'
  },
  {
    id: 'gov-4',
    title: 'Tax Collection Officer',
    department: 'Gambia Revenue Authority',
    location: 'Banjul',
    salary: 22000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '3+ Years',
    category: 'government',
    tags: ['Full Time', 'Banjul', 'Finance'],
    isUrgent: false,
    icon: 'bank',
    iconBgColor: '#F3F4F6',
    iconColor: '#4B5563',
    description: 'Join the Gambia Revenue Authority as a Tax Collection Officer. You will be responsible for ensuring tax compliance, processing tax returns, and providing guidance to taxpayers.',
    requirements: [
      'Bachelor\'s degree in Accounting, Finance, or Economics',
      'Minimum 3 years experience in taxation or finance',
      'Knowledge of tax laws and regulations',
      'Proficiency in accounting software',
      'Excellent analytical skills'
    ],
    responsibilities: [
      'Process tax returns and assessments',
      'Conduct tax audits and investigations',
      'Provide guidance to taxpayers on compliance',
      'Collect outstanding taxes and penalties',
      'Maintain accurate records and reports'
    ],
    benefits: [
      'Competitive salary',
      'Performance bonuses',
      'Health insurance',
      'Pension plan',
      'Career advancement opportunities'
    ],
    deadline: '2025-01-20',
    postedDate: '2024-12-02'
  },
  {
    id: 'gov-5',
    title: 'Primary School Teacher',
    department: 'Ministry of Education',
    location: 'Basse',
    salary: 15000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '2+ Years',
    category: 'government',
    tags: ['Full Time', 'Basse', 'Education'],
    isUrgent: false,
    icon: 'education',
    iconBgColor: '#FEE2E2',
    iconColor: '#DC2626',
    description: 'Shape the future of Gambian children as a Primary School Teacher. We are looking for passionate educators to teach and inspire young learners.',
    requirements: [
      'Teaching certificate or diploma in Education',
      'Minimum 2 years teaching experience',
      'Strong knowledge of primary curriculum',
      'Patience and creativity in teaching',
      'Good communication skills'
    ],
    responsibilities: [
      'Teach assigned subjects to primary students',
      'Prepare lesson plans and teaching materials',
      'Assess and evaluate student progress',
      'Maintain classroom discipline',
      'Participate in school activities and meetings'
    ],
    benefits: [
      'Government teacher salary',
      'Housing assistance for rural postings',
      'Annual leave during school holidays',
      'Professional development training',
      'Pension scheme'
    ],
    deadline: '2025-02-01',
    postedDate: '2024-12-04'
  }
];

export const privateJobs: Job[] = [
  {
    id: 'priv-1',
    title: 'Software Developer',
    department: 'TechGambia Solutions',
    location: 'Banjul',
    salary: 35000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '3+ Years',
    category: 'private',
    tags: ['Full Time', 'Banjul', 'Remote Option'],
    isUrgent: true,
    icon: 'code',
    iconBgColor: '#E0E7FF',
    iconColor: '#4F46E5',
    description: 'Join our dynamic tech team as a Software Developer. Work on cutting-edge projects and help build digital solutions for businesses across Africa.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Minimum 3 years of software development experience',
      'Proficiency in JavaScript, React, and Node.js',
      'Experience with cloud platforms (AWS/GCP)',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Develop and maintain web and mobile applications',
      'Write clean, efficient, and well-documented code',
      'Collaborate with design and product teams',
      'Participate in code reviews',
      'Mentor junior developers'
    ],
    benefits: [
      'Competitive salary package',
      'Remote work options',
      'Health insurance',
      'Annual performance bonus',
      'Learning and development budget'
    ],
    deadline: '2025-01-10',
    postedDate: '2024-12-01'
  },
  {
    id: 'priv-2',
    title: 'Marketing Manager',
    department: 'Gambia Telecom Ltd',
    location: 'Serrekunda',
    salary: 28000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '5+ Years',
    category: 'private',
    tags: ['Full Time', 'Serrekunda', 'Marketing'],
    isUrgent: false,
    icon: 'megaphone',
    iconBgColor: '#FCE7F3',
    iconColor: '#DB2777',
    description: 'Lead our marketing efforts and drive brand growth. We are looking for a creative and strategic Marketing Manager to expand our market presence.',
    requirements: [
      'Bachelor\'s degree in Marketing, Business, or related field',
      'Minimum 5 years marketing experience',
      'Proven track record in brand management',
      'Experience with digital marketing',
      'Strong leadership skills'
    ],
    responsibilities: [
      'Develop and execute marketing strategies',
      'Manage marketing budget and campaigns',
      'Lead and mentor marketing team',
      'Analyze market trends and competitors',
      'Build relationships with media and partners'
    ],
    benefits: [
      'Attractive salary package',
      'Company car',
      'Performance bonuses',
      'Health coverage',
      'Professional development'
    ],
    deadline: '2025-01-25',
    postedDate: '2024-12-03'
  },
  {
    id: 'priv-3',
    title: 'Accountant',
    department: 'Standard Chartered Bank',
    location: 'Banjul',
    salary: 32000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '4+ Years',
    category: 'private',
    tags: ['Full Time', 'Banjul', 'Banking'],
    isUrgent: false,
    icon: 'calculator',
    iconBgColor: '#FEF9C3',
    iconColor: '#CA8A04',
    description: 'Join our finance team as an Accountant. You will manage financial records, prepare reports, and ensure compliance with banking regulations.',
    requirements: [
      'Bachelor\'s degree in Accounting or Finance',
      'ACCA or CPA certification preferred',
      'Minimum 4 years accounting experience',
      'Knowledge of banking regulations',
      'Proficiency in accounting software'
    ],
    responsibilities: [
      'Manage daily accounting operations',
      'Prepare financial statements and reports',
      'Ensure regulatory compliance',
      'Conduct internal audits',
      'Assist with budget planning'
    ],
    benefits: [
      'Banking sector salary',
      'Comprehensive health insurance',
      'Pension scheme',
      'Annual bonus',
      'Staff loan facilities'
    ],
    deadline: '2025-02-10',
    postedDate: '2024-12-02'
  },
  {
    id: 'priv-4',
    title: 'Hotel Manager',
    department: 'Senegambia Beach Hotel',
    location: 'Kololi',
    salary: 40000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '7+ Years',
    category: 'private',
    tags: ['Full Time', 'Kololi', 'Hospitality'],
    isUrgent: true,
    icon: 'hotel',
    iconBgColor: '#CFFAFE',
    iconColor: '#0891B2',
    description: 'Lead our luxury beach resort as Hotel Manager. We are seeking an experienced hospitality professional to ensure excellent guest experiences.',
    requirements: [
      'Degree in Hospitality Management',
      'Minimum 7 years hotel management experience',
      'Experience in luxury hotel operations',
      'Fluency in English; French is a plus',
      'Strong leadership and guest relations skills'
    ],
    responsibilities: [
      'Oversee all hotel operations',
      'Manage staff and department heads',
      'Ensure high guest satisfaction',
      'Handle budgets and P&L',
      'Implement service standards'
    ],
    benefits: [
      'Executive salary package',
      'Accommodation provided',
      'Meals on duty',
      'Health insurance',
      'Annual international training'
    ],
    deadline: '2025-01-05',
    postedDate: '2024-11-28'
  },
  {
    id: 'priv-5',
    title: 'Sales Representative',
    department: 'Coca-Cola Gambia',
    location: 'Multiple Locations',
    salary: 20000,
    salaryPeriod: 'month',
    type: 'Full Time',
    experience: '1+ Years',
    category: 'private',
    tags: ['Full Time', 'Field Work', 'Sales'],
    isUrgent: false,
    icon: 'cart',
    iconBgColor: '#FEE2E2',
    iconColor: '#EF4444',
    description: 'Join our sales team and help distribute Coca-Cola products across The Gambia. Great opportunity for energetic individuals who love sales.',
    requirements: [
      'Diploma or higher education',
      'Minimum 1 year sales experience',
      'Valid driver\'s license',
      'Good communication skills',
      'Self-motivated and target-driven'
    ],
    responsibilities: [
      'Visit retail outlets and customers',
      'Achieve monthly sales targets',
      'Build customer relationships',
      'Collect payments and orders',
      'Report market intelligence'
    ],
    benefits: [
      'Base salary plus commissions',
      'Company motorcycle',
      'Fuel allowance',
      'Sales incentives',
      'Career growth opportunities'
    ],
    deadline: '2025-01-30',
    postedDate: '2024-12-05'
  }
];

export const getAllJobs = (): Job[] => [...governmentJobs, ...privateJobs];

export const getJobById = (id: string): Job | undefined => {
  return getAllJobs().find(job => job.id === id);
};

export const getJobsByCategory = (category: 'government' | 'private'): Job[] => {
  return category === 'government' ? governmentJobs : privateJobs;
};

export const getUrgentJobs = (): Job[] => {
  return getAllJobs().filter(job => job.isUrgent);
};

export const searchJobs = (query: string, category?: 'government' | 'private'): Job[] => {
  const jobs = category ? getJobsByCategory(category) : getAllJobs();
  const lowerQuery = query.toLowerCase();
  
  return jobs.filter(job => 
    job.title.toLowerCase().includes(lowerQuery) ||
    job.department.toLowerCase().includes(lowerQuery) ||
    job.location.toLowerCase().includes(lowerQuery) ||
    job.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

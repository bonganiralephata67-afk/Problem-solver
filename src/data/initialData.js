// Initial Static Categories, Topics, and Initial Demo State
// Exactly adheres to all categories, subcategories and requirements in the specification.

export const INITIAL_CATEGORIES = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Education and School Subjects',
    slug: 'education',
    description: 'Tutoring and academic guidance for school and university subjects.',
    icon: 'GraduationCap',
    display_order: 1,
    is_active: true,
    has_education_level: true,
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Career Advice',
    slug: 'career-advice',
    description: 'Career choices, university admissions, CV reviews, and career transitions.',
    icon: 'Briefcase',
    display_order: 2,
    is_active: true,
    has_education_level: false,
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'Entrepreneurship and Business',
    slug: 'entrepreneurship',
    description: 'Starting up, validation, business registration, funding, and growth.',
    icon: 'TrendingUp',
    display_order: 3,
    is_active: true,
    has_education_level: false,
  },
  {
    id: '11111111-0000-0000-0000-000000000004',
    name: 'Business Analysis',
    slug: 'business-analysis',
    description: 'Requirements gathering, process mapping, user stories, and BA tools.',
    icon: 'FileText',
    display_order: 4,
    is_active: true,
    has_education_level: false,
  },
  {
    id: '11111111-0000-0000-0000-000000000005',
    name: 'Product Design',
    slug: 'product-design',
    description: 'UI/UX design, Figma, portfolio reviews, and user research.',
    icon: 'Palette',
    display_order: 5,
    is_active: true,
    has_education_level: false,
  },
  {
    id: '11111111-0000-0000-0000-000000000006',
    name: 'Software Development and Technology',
    slug: 'software-development',
    description: 'Coding, web/mobile development, algorithms, and tech career advice.',
    icon: 'Code',
    display_order: 6,
    is_active: true,
    has_education_level: false,
  },
  {
    id: '11111111-0000-0000-0000-000000000007',
    name: 'Product Management',
    slug: 'product-management',
    description: 'Product strategy, discovery, roadmaps, and feature prioritization.',
    icon: 'Compass',
    display_order: 7,
    is_active: true,
    has_education_level: false,
  },
  {
    id: '11111111-0000-0000-0000-000000000008',
    name: 'Other Professional Guidance',
    slug: 'other',
    description: 'Custom consultations and specialized questions routed to our support team.',
    icon: 'HelpCircle',
    display_order: 8,
    is_active: true,
    has_education_level: false,
  },
];

export const EDUCATION_LEVELS = [
  'Grade 8–9',
  'Grade 10–11',
  'Grade 12',
  'College or university',
  'Other',
];

export const INITIAL_TOPICS = [
  // 1. Education
  { id: '22222222-0001-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000001', name: 'Mathematics', slug: 'mathematics' },
  { id: '22222222-0001-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000001', name: 'Physical Sciences', slug: 'physical-sciences' },
  { id: '22222222-0001-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000001', name: 'Life Sciences', slug: 'life-sciences' },
  { id: '22222222-0001-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000001', name: 'Accounting', slug: 'accounting' },
  { id: '22222222-0001-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000001', name: 'Economics', slug: 'economics' },
  { id: '22222222-0001-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000001', name: 'Business Studies', slug: 'business-studies' },
  { id: '22222222-0001-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000001', name: 'English', slug: 'english' },
  { id: '22222222-0001-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000001', name: 'Other School Subjects', slug: 'other-school-subjects' },

  // 2. Career Advice
  { id: '22222222-0002-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000002', name: 'Grade 9 Subject Choices', slug: 'grade-9-choices' },
  { id: '22222222-0002-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000002', name: 'Grade 10–12 Career Guidance', slug: 'grade-10-12-guidance' },
  { id: '22222222-0002-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000002', name: 'Choosing a University or College Course', slug: 'choosing-course' },
  { id: '22222222-0002-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000002', name: 'Applying to Universities or Colleges', slug: 'applying-universities' },
  { id: '22222222-0002-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000002', name: 'CV and Job Applications', slug: 'cv-job-applications' },
  { id: '22222222-0002-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000002', name: 'Interview Preparation', slug: 'interview-prep' },
  { id: '22222222-0002-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000002', name: 'Career Change', slug: 'career-change' },
  { id: '22222222-0002-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000002', name: 'Transitioning into Technology', slug: 'transitioning-into-tech' },
  { id: '22222222-0002-0000-0000-000000000009', category_id: '11111111-0000-0000-0000-000000000002', name: 'Transitioning into Product Design', slug: 'transitioning-into-product-design' },
  { id: '22222222-0002-0000-0000-000000000010', category_id: '11111111-0000-0000-0000-000000000002', name: 'Transitioning into Software Development', slug: 'transitioning-into-software-dev' },
  { id: '22222222-0002-0000-0000-000000000011', category_id: '11111111-0000-0000-0000-000000000002', name: 'Professional Growth', slug: 'professional-growth' },
  { id: '22222222-0002-0000-0000-000000000012', category_id: '11111111-0000-0000-0000-000000000002', name: 'Other Career Questions', slug: 'other-career-questions' },

  // 3. Entrepreneurship
  { id: '22222222-0003-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000003', name: 'Starting a Business', slug: 'starting-a-business' },
  { id: '22222222-0003-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000003', name: 'Business Ideas and Validation', slug: 'ideas-validation' },
  { id: '22222222-0003-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000003', name: 'Business Registration', slug: 'business-registration' },
  { id: '22222222-0003-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000003', name: 'Business Planning', slug: 'business-planning' },
  { id: '22222222-0003-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000003', name: 'Applying for Business Funding', slug: 'business-funding' },
  { id: '22222222-0003-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000003', name: 'Finding Customers', slug: 'finding-customers' },
  { id: '22222222-0003-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000003', name: 'Marketing and Sales', slug: 'marketing-sales' },
  { id: '22222222-0003-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000003', name: 'Financial Planning', slug: 'financial-planning' },
  { id: '22222222-0003-0000-0000-000000000009', category_id: '11111111-0000-0000-0000-000000000003', name: 'Growing a Business', slug: 'growing-business' },
  { id: '22222222-0003-0000-0000-000000000010', category_id: '11111111-0000-0000-0000-000000000003', name: 'Other Business Questions', slug: 'other-business-questions' },

  // 4. Business Analysis
  { id: '22222222-0004-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000004', name: 'Understanding Business Analysis', slug: 'understanding-ba' },
  { id: '22222222-0004-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000004', name: 'Becoming a Business Analyst', slug: 'becoming-a-ba' },
  { id: '22222222-0004-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000004', name: 'Business Requirements', slug: 'business-requirements' },
  { id: '22222222-0004-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000004', name: 'Requirements Gathering', slug: 'requirements-gathering' },
  { id: '22222222-0004-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000004', name: 'Business Process Mapping', slug: 'process-mapping' },
  { id: '22222222-0004-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000004', name: 'User Stories and Acceptance Criteria', slug: 'user-stories-ac' },
  { id: '22222222-0004-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000004', name: 'Business Analysis Tools', slug: 'ba-tools' },
  { id: '22222222-0004-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000004', name: 'Business Analyst CV and Interview Preparation', slug: 'ba-cv-interview' },
  { id: '22222222-0004-0000-0000-000000000009', category_id: '11111111-0000-0000-0000-000000000004', name: 'Transitioning into Business Analysis', slug: 'transitioning-into-ba' },
  { id: '22222222-0004-0000-0000-000000000010', category_id: '11111111-0000-0000-0000-000000000004', name: 'Other Business Analysis Questions', slug: 'other-ba-questions' },

  // 5. Product Design
  { id: '22222222-0005-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000005', name: 'Learning Product Design', slug: 'learning-product-design' },
  { id: '22222222-0005-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000005', name: 'UI/UX Design', slug: 'ui-ux-design' },
  { id: '22222222-0005-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000005', name: 'User Research', slug: 'user-research' },
  { id: '22222222-0005-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000005', name: 'User Flows and Wireframes', slug: 'flows-wireframes' },
  { id: '22222222-0005-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000005', name: 'Figma and Design Systems', slug: 'figma-design-systems' },
  { id: '22222222-0005-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000005', name: 'Portfolio Review', slug: 'portfolio-review' },
  { id: '22222222-0005-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000005', name: 'Product Design Interviews', slug: 'design-interviews' },
  { id: '22222222-0005-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000005', name: 'Transitioning into Product Design', slug: 'transitioning-into-design' },
  { id: '22222222-0005-0000-0000-000000000009', category_id: '11111111-0000-0000-0000-000000000005', name: 'Design Thinking', slug: 'design-thinking' },
  { id: '22222222-0005-0000-0000-000000000010', category_id: '11111111-0000-0000-0000-000000000005', name: 'Product Discovery', slug: 'product-discovery' },
  { id: '22222222-0005-0000-0000-000000000011', category_id: '11111111-0000-0000-0000-000000000005', name: 'Other Product Design Questions', slug: 'other-design-questions' },

  // 6. Software Development
  { id: '22222222-0006-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000006', name: 'Learning to Code', slug: 'learning-to-code' },
  { id: '22222222-0006-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000006', name: 'Frontend Development', slug: 'frontend-development' },
  { id: '22222222-0006-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000006', name: 'Backend Development', slug: 'backend-development' },
  { id: '22222222-0006-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000006', name: 'Web Development', slug: 'web-development' },
  { id: '22222222-0006-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000006', name: 'Mobile App Development', slug: 'mobile-app-dev' },
  { id: '22222222-0006-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000006', name: 'Programming Fundamentals', slug: 'programming-fundamentals' },
  { id: '22222222-0006-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000006', name: 'Software Developer Career Advice', slug: 'dev-career-advice' },
  { id: '22222222-0006-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000006', name: 'Coding Portfolio Review', slug: 'code-portfolio-review' },
  { id: '22222222-0006-0000-0000-000000000009', category_id: '11111111-0000-0000-0000-000000000006', name: 'AI and Technology', slug: 'ai-and-technology' },
  { id: '22222222-0006-0000-0000-000000000010', category_id: '11111111-0000-0000-0000-000000000006', name: 'Other Technology Questions', slug: 'other-tech-questions' },

  // 7. Product Management
  { id: '22222222-0007-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000007', name: 'Becoming a Product Manager', slug: 'becoming-a-pm' },
  { id: '22222222-0007-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000007', name: 'Product Discovery', slug: 'pm-product-discovery' },
  { id: '22222222-0007-0000-0000-000000000003', category_id: '11111111-0000-0000-0000-000000000007', name: 'Product Strategy', slug: 'product-strategy' },
  { id: '22222222-0007-0000-0000-000000000004', category_id: '11111111-0000-0000-0000-000000000007', name: 'Roadmaps and Prioritisation', slug: 'roadmaps-prioritisation' },
  { id: '22222222-0007-0000-0000-000000000005', category_id: '11111111-0000-0000-0000-000000000007', name: 'Product Requirements', slug: 'product-requirements' },
  { id: '22222222-0007-0000-0000-000000000006', category_id: '11111111-0000-0000-0000-000000000007', name: 'Product Analytics and KPIs', slug: 'product-analytics' },
  { id: '22222222-0007-0000-0000-000000000007', category_id: '11111111-0000-0000-0000-000000000007', name: 'Product Management Interviews', slug: 'pm-interviews' },
  { id: '22222222-0007-0000-0000-000000000008', category_id: '11111111-0000-0000-0000-000000000007', name: 'Transitioning into Product Management', slug: 'transitioning-into-pm' },
  { id: '22222222-0007-0000-0000-000000000009', category_id: '11111111-0000-0000-0000-000000000007', name: 'Other Product Management Questions', slug: 'other-pm-questions' },

  // 8. Other
  { id: '22222222-0008-0000-0000-000000000001', category_id: '11111111-0000-0000-0000-000000000008', name: 'General Inquiries', slug: 'general-inquiries' },
  { id: '22222222-0008-0000-0000-000000000002', category_id: '11111111-0000-0000-0000-000000000008', name: 'Custom Consultation', slug: 'custom-consultation' },
];

export const DEMO_USERS = [
  {
    id: '33333333-0000-0000-0000-000000000004',
    email: 'sipho.student@seeker.org',
    full_name: 'Sipho Ndlovu',
    role: 'seeker',
    avatar_url: null,
  },
  {
    id: '33333333-0000-0000-0000-000000000002',
    email: 'thabo.maths@expert.org',
    full_name: 'Thabo Mokoena',
    role: 'expert',
    expert_profile_id: '44444444-0000-0000-0000-000000000001',
    headline: 'Senior Mathematics Educator & Matric Specialist',
    bio: 'Over 10 years experience helping Grade 10-12 learners master algebra, calculus, and geometry with confidence.',
    topics: [
      '22222222-0001-0000-0000-000000000001', // Mathematics
      '22222222-0001-0000-0000-000000000002', // Physical Sciences
    ],
    education_levels: ['Grade 10–11', 'Grade 12', 'College or university'],
    is_available: true,
    approval_status: 'approved',
  },
  {
    id: '33333333-0000-0000-0000-000000000003',
    email: 'sarah.design@expert.org',
    full_name: 'Sarah Jenkins',
    role: 'expert',
    expert_profile_id: '44444444-0000-0000-0000-000000000002',
    headline: 'Staff Product Designer & Design Mentor',
    bio: 'Design leader specializing in Design Systems, Figma, and portfolio interview preparation for aspiring designers.',
    topics: [
      '22222222-0005-0000-0000-000000000006', // Portfolio Review
      '22222222-0005-0000-0000-000000000005', // Figma and Design Systems
      '22222222-0005-0000-0000-000000000002', // UI/UX Design
    ],
    education_levels: ['College or university', 'Other'],
    is_available: true,
    approval_status: 'approved',
  },
  {
    id: '33333333-0000-0000-0000-000000000005',
    email: 'lerato.career@expert.org',
    full_name: 'Lerato Dlamini',
    role: 'expert',
    expert_profile_id: '44444444-0000-0000-0000-000000000003',
    headline: 'Certified Career Coach & Tech Transition Advisor',
    bio: 'Helping non-tech professionals transition into software development, product management, and high-impact careers.',
    topics: [
      '22222222-0002-0000-0000-000000000010', // Transitioning into Software Development
      '22222222-0002-0000-0000-000000000008', // Transitioning into Technology
      '22222222-0002-0000-0000-000000000005', // CV and Job Applications
    ],
    education_levels: ['College or university', 'Other'],
    is_available: true,
    approval_status: 'approved',
  },
  {
    id: '33333333-0000-0000-0000-000000000001',
    email: 'admin@theproblemsolvers.org',
    full_name: 'Admin Support Team',
    role: 'admin',
    avatar_url: null,
  },
];

export const INITIAL_HELP_REQUESTS = [
  {
    id: '55555555-0000-0000-0000-000000000001',
    seeker_id: '33333333-0000-0000-0000-000000000004',
    seeker_name: 'Sipho Ndlovu',
    seeker_email: 'sipho.student@seeker.org',
    category_id: '11111111-0000-0000-0000-000000000001', // Education
    topic_id: '22222222-0001-0000-0000-000000000001',    // Mathematics
    education_level: 'Grade 12',
    inquiry: "I'm in Grade 12 and need help understanding algebra and functions before my matric mock exams.",
    preferred_session_type: 'video_meeting',
    status: 'submitted', // Open, waiting for Math expert (Thabo)
    assigned_expert_id: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: '55555555-0000-0000-0000-000000000002',
    seeker_id: '33333333-0000-0000-0000-000000000004',
    seeker_name: 'Sipho Ndlovu',
    seeker_email: 'sipho.student@seeker.org',
    category_id: '11111111-0000-0000-0000-000000000005', // Product Design
    topic_id: '22222222-0005-0000-0000-000000000006',    // Portfolio Review
    education_level: 'College or university',
    inquiry: 'I have a junior UI design portfolio with 2 case studies and need help improving my presentation before interviews.',
    preferred_session_type: 'chat',
    status: 'expert_accepted',
    assigned_expert_id: '44444444-0000-0000-0000-000000000002', // Sarah Jenkins
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_CONVERSATIONS = [
  {
    id: '66666666-0000-0000-0000-000000000001',
    request_id: '55555555-0000-0000-0000-000000000002',
    seeker_id: '33333333-0000-0000-0000-000000000004',
    expert_id: '33333333-0000-0000-0000-000000000003', // Sarah's user profile ID
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const INITIAL_MESSAGES = [
  {
    id: '77777777-0000-0000-0000-000000000001',
    conversation_id: '66666666-0000-0000-0000-000000000001',
    sender_id: '33333333-0000-0000-0000-000000000003', // Sarah
    content: "Hi Sipho! I've accepted your request regarding your Portfolio Review. Send over a link to your Figma or website whenever you are ready!",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    is_read: true,
  },
  {
    id: '77777777-0000-0000-0000-000000000002',
    conversation_id: '66666666-0000-0000-0000-000000000001',
    sender_id: '33333333-0000-0000-0000-000000000004', // Sipho
    content: "Thank you so much Sarah! I really appreciate it. Can we also schedule a short 20-minute video session to walk through it?",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    is_read: true,
  },
];

export const INITIAL_APPOINTMENTS = [
  {
    id: '88888888-0000-0000-0000-000000000001',
    request_id: '55555555-0000-0000-0000-000000000002',
    conversation_id: '66666666-0000-0000-0000-000000000001',
    seeker_id: '33333333-0000-0000-0000-000000000004',
    expert_id: '44444444-0000-0000-0000-000000000002',
    proposed_date: '2026-10-20',
    proposed_time: '15:00',
    session_type: 'video_meeting',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmed',
    note: 'Portfolio walkthrough and case study review',
  },
];

export const INITIAL_EXPERT_APPLICATIONS = [
  {
    id: '99999999-0000-0000-0000-000000000001',
    user_id: '33333333-0000-0000-0000-000000000006',
    full_name: 'David Khumalo',
    email: 'david.dev@expert.org',
    headline: 'Senior Fullstack Engineer & Tech Mentor',
    bio: 'Passionate about mentoring junior developers in React, Node.js, and breaking into tech.',
    categories_requested: ['11111111-0000-0000-0000-000000000006'],
    topics_requested: [
      '22222222-0006-0000-0000-000000000002', // Frontend Development
      '22222222-0006-0000-0000-000000000004', // Web Development
    ],
    session_types: ['chat', 'video_meeting'],
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export const INITIAL_SUPPORT_INQUIRIES = [
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    name: 'Kagiso Tlhabi',
    email: 'kagiso@example.com',
    subject: 'Question regarding Grade 12 tutoring availability',
    message: 'Hello, are mathematics sessions conducted over video call or only chat?',
    status: 'open',
    response: null,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

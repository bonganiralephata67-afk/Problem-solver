-- Migration 004: Seed Data
-- Initial Categories and Topics for The Problem Solvers

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, description, icon, display_order, is_active)
VALUES 
    ('11111111-0000-0000-0000-000000000001', 'Education and School Subjects', 'education', 'Tutoring and academic guidance for high school and university students.', 'GraduationCap', 1, true),
    ('11111111-0000-0000-0000-000000000002', 'Career Advice', 'career-advice', 'Career planning, CV reviews, job interviews, and industry transitions.', 'Briefcase', 2, true),
    ('11111111-0000-0000-0000-000000000003', 'Entrepreneurship and Business', 'entrepreneurship', 'Starting up, business planning, funding applications, and sales growth.', 'TrendingUp', 3, true),
    ('11111111-0000-0000-0000-000000000004', 'Business Analysis', 'business-analysis', 'Requirements gathering, process mapping, user stories, and BA tools.', 'FileText', 4, true),
    ('11111111-0000-0000-0000-000000000005', 'Product Design', 'product-design', 'UI/UX design, Figma, portfolio reviews, and user research.', 'Palette', 5, true),
    ('11111111-0000-0000-0000-000000000006', 'Software Development and Technology', 'software-development', 'Coding, frontend/backend engineering, app development, and tech architecture.', 'Code', 6, true),
    ('11111111-0000-0000-0000-000000000007', 'Product Management', 'product-management', 'Product strategy, discovery, roadmaps, and feature prioritization.', 'Compass', 7, true),
    ('11111111-0000-0000-0000-000000000008', 'Other Professional Guidance', 'other', 'Specialized advice and custom inquiries.', 'HelpCircle', 8, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Insert Topics for Education
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Mathematics', 'mathematics', 'Pure Maths, Calculus, Algebra, and Geometry', 1, true),
    ('22222222-0001-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Physical Sciences', 'physical-sciences', 'Physics and Chemistry concepts and exam prep', 2, true),
    ('22222222-0001-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Life Sciences', 'life-sciences', 'Biology and environmental sciences', 3, true),
    ('22222222-0001-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'Accounting', 'accounting', 'Financial accounting, balance sheets, and ledgers', 4, true),
    ('22222222-0001-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', 'Economics', 'economics', 'Micro and Macro economics', 5, true),
    ('22222222-0001-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', 'Business Studies', 'business-studies', 'Business environment, operations, and ethics', 6, true),
    ('22222222-0001-0000-0000-000000000007', '11111111-0000-0000-0000-000000000001', 'English', 'english', 'Grammar, literature, comprehension, and essays', 7, true),
    ('22222222-0001-0000-0000-000000000008', '11111111-0000-0000-0000-000000000001', 'Other School Subjects', 'other-school-subjects', 'Geography, History, and elective subjects', 8, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Topics for Career Advice
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 'Grade 9 Subject Choices', 'grade-9-choices', 'Choosing the right high school subjects for your future', 1, true),
    ('22222222-0002-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'Grade 10–12 Career Guidance', 'grade-10-12-guidance', 'Exploring university and college pathways', 2, true),
    ('22222222-0002-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'Choosing a University or College Course', 'choosing-course', 'Degree selection and admission criteria guidance', 3, true),
    ('22222222-0002-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Applying to Universities or Colleges', 'applying-universities', 'Application deadlines, requirements, and procedures', 4, true),
    ('22222222-0002-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'CV and Job Applications', 'cv-job-applications', 'Resume formatting, ATS optimization, and cover letters', 5, true),
    ('22222222-0002-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', 'Interview Preparation', 'interview-prep', 'Mock interviews, behavioral and technical answers', 6, true),
    ('22222222-0002-0000-0000-000000000007', '11111111-0000-0000-0000-000000000002', 'Career Change', 'career-change', 'Navigating career pivoting into new industries', 7, true),
    ('22222222-0002-0000-0000-000000000008', '11111111-0000-0000-0000-000000000002', 'Transitioning into Technology', 'transitioning-into-tech', 'Roadmaps for entering the tech ecosystem', 8, true),
    ('22222222-0002-0000-0000-000000000009', '11111111-0000-0000-0000-000000000002', 'Transitioning into Product Design', 'transitioning-into-product-design', 'Steps to becoming a UI/UX designer', 9, true),
    ('22222222-0002-0000-0000-000000000010', '11111111-0000-0000-0000-000000000002', 'Transitioning into Software Development', 'transitioning-into-software-dev', 'From beginner or non-coder to developer', 10, true),
    ('22222222-0002-0000-0000-000000000011', '11111111-0000-0000-0000-000000000002', 'Professional Growth', 'professional-growth', 'Promotion strategies and workplace leadership', 11, true),
    ('22222222-0002-0000-0000-000000000012', '11111111-0000-0000-0000-000000000002', 'Other Career Questions', 'other-career-questions', 'General career mentorship', 12, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Topics for Entrepreneurship and Business
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 'Starting a Business', 'starting-a-business', 'Foundational steps and company registration', 1, true),
    ('22222222-0003-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', 'Business Ideas and Validation', 'ideas-validation', 'Testing market demand and value propositions', 2, true),
    ('22222222-0003-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', 'Business Registration', 'business-registration', 'Legal forms, compliance, and SARS / Tax', 3, true),
    ('22222222-0003-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', 'Business Planning', 'business-planning', 'Writing effective business plans and models', 4, true),
    ('22222222-0003-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', 'Applying for Business Funding', 'business-funding', 'Grants, angel investment, loan preparation, and required documents', 5, true),
    ('22222222-0003-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003', 'Finding Customers', 'finding-customers', 'Lead generation and early traction', 6, true),
    ('22222222-0003-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', 'Marketing and Sales', 'marketing-sales', 'Digital marketing, sales outreach, and conversions', 7, true),
    ('22222222-0003-0000-0000-000000000008', '11111111-0000-0000-0000-000000000003', 'Financial Planning', 'financial-planning', 'Cash flow management, pricing, and projections', 8, true),
    ('22222222-0003-0000-0000-000000000009', '11111111-0000-0000-0000-000000000003', 'Growing a Business', 'growing-business', 'Scaling operations and hiring staff', 9, true),
    ('22222222-0003-0000-0000-000000000010', '11111111-0000-0000-0000-000000000003', 'Other Business Questions', 'other-business-questions', 'General startup and commercial advice', 10, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Topics for Business Analysis
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 'Understanding Business Analysis', 'understanding-ba', 'Core responsibilities and BA fundamentals', 1, true),
    ('22222222-0004-0000-0000-000000000002', '11111111-0000-0000-0000-000000000004', 'Becoming a Business Analyst', 'becoming-a-ba', 'Roadmaps, certifications, and essential skills', 2, true),
    ('22222222-0004-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004', 'Business Requirements', 'business-requirements', 'BRD drafting and stakeholder management', 3, true),
    ('22222222-0004-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'Requirements Gathering', 'requirements-gathering', 'Interviewing stakeholders and workshop facilitation', 4, true),
    ('22222222-0004-0000-0000-000000000005', '11111111-0000-0000-0000-000000000004', 'Business Process Mapping', 'process-mapping', 'BPMN, flowcharts, and swimlane diagrams', 5, true),
    ('22222222-0004-0000-0000-000000000006', '11111111-0000-0000-0000-000000000004', 'User Stories and Acceptance Criteria', 'user-stories-ac', 'Agile user story formulation and Given-When-Then criteria', 6, true),
    ('22222222-0004-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004', 'Business Analysis Tools', 'ba-tools', 'Jira, Confluence, Visio, and Lucidchart', 7, true),
    ('22222222-0004-0000-0000-000000000008', '11111111-0000-0000-0000-000000000004', 'Business Analyst CV and Interview Preparation', 'ba-cv-interview', 'Resume review and scenario question preparation', 8, true),
    ('22222222-0004-0000-0000-000000000009', '11111111-0000-0000-0000-000000000004', 'Transitioning into Business Analysis', 'transitioning-into-ba', 'Leveraging domain experience to enter BA roles', 9, true),
    ('22222222-0004-0000-0000-000000000010', '11111111-0000-0000-0000-000000000004', 'Other Business Analysis Questions', 'other-ba-questions', 'Advanced BA scenarios', 10, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Topics for Product Design
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000005', 'Learning Product Design', 'learning-product-design', 'Foundations of UI and UX design', 1, true),
    ('22222222-0005-0000-0000-000000000002', '11111111-0000-0000-0000-000000000005', 'UI/UX Design', 'ui-ux-design', 'Visual hierarchy, typography, colors, and layout', 2, true),
    ('22222222-0005-0000-0000-000000000003', '11111111-0000-0000-0000-000000000005', 'User Research', 'user-research', 'Interviews, personas, surveys, and usability testing', 3, true),
    ('22222222-0005-0000-0000-000000000004', '11111111-0000-0000-0000-000000000005', 'User Flows and Wireframes', 'flows-wireframes', 'Information architecture and low-fidelity prototyping', 4, true),
    ('22222222-0005-0000-0000-000000000005', '11111111-0000-0000-0000-000000000005', 'Figma and Design Systems', 'figma-design-systems', 'Auto-layout, components, variables, and design tokens', 5, true),
    ('22222222-0005-0000-0000-000000000006', '11111111-0000-0000-0000-000000000005', 'Portfolio Review', 'portfolio-review', 'Critique and improvement of case studies', 6, true),
    ('22222222-0005-0000-0000-000000000007', '11111111-0000-0000-0000-000000000005', 'Product Design Interviews', 'design-interviews', 'App critiques and whiteboard design challenges', 7, true),
    ('22222222-0005-0000-0000-000000000008', '11111111-0000-0000-0000-000000000005', 'Transitioning into Product Design', 'transitioning-into-design', 'Steps to build a portfolio from scratch', 8, true),
    ('22222222-0005-0000-0000-000000000009', '11111111-0000-0000-0000-000000000005', 'Design Thinking', 'design-thinking', 'Empathize, Define, Ideate, Prototype, and Test', 9, true),
    ('22222222-0005-0000-0000-000000000010', '11111111-0000-0000-0000-000000000005', 'Product Discovery', 'product-discovery', 'Problem framing and solution exploration', 10, true),
    ('22222222-0005-0000-0000-000000000011', '11111111-0000-0000-0000-000000000005', 'Other Product Design Questions', 'other-design-questions', 'General design guidance', 11, true)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Topics for Software Development
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0006-0000-0000-000000000001', '11111111-0000-0000-0000-000000000006', 'Learning to Code', 'learning-to-code', 'First programming languages and study plans', 1, true),
    ('22222222-0006-0000-0000-000000000002', '11111111-0000-0000-0000-000000000006', 'Frontend Development', 'frontend-development', 'HTML, CSS, JavaScript, React, and Vue', 2, true),
    ('22222222-0006-0000-0000-000000000003', '11111111-0000-0000-0000-000000000006', 'Backend Development', 'backend-development', 'Node.js, Python, APIs, and databases', 3, true),
    ('22222222-0006-0000-0000-000000000004', '11111111-0000-0000-0000-000000000006', 'Web Development', 'web-development', 'Full-stack web architecture and deployment', 4, true),
    ('22222222-0006-0000-0000-000000000005', '11111111-0000-0000-0000-000000000006', 'Mobile App Development', 'mobile-app-dev', 'React Native, Flutter, iOS, and Android', 5, true),
    ('22222222-0006-0000-0000-000000000006', '11111111-0000-0000-0000-000000000006', 'Programming Fundamentals', 'programming-fundamentals', 'Algorithms, data structures, and clean code', 6, true),
    ('22222222-0006-0000-0000-000000000007', '11111111-0000-0000-0000-000000000006', 'Software Developer Career Advice', 'dev-career-advice', 'Breaking into tech and engineering ladders', 7, true),
    ('22222222-0006-0000-0000-000000000008', '11111111-0000-0000-0000-000000000006', 'Coding Portfolio Review', 'code-portfolio-review', 'GitHub reviews and project case studies', 8, true),
    ('22222222-0006-0000-0000-000000000009', '11111111-0000-0000-0000-000000000006', 'AI and Technology', 'ai-and-technology', 'LLMs, AI integration, and prompt engineering', 9, true),
    ('22222222-0006-0000-0000-000000000010', '11111111-0000-0000-0000-000000000006', 'Other Technology Questions', 'other-tech-questions', 'DevOps, cloud, and system design', 10, true)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Topics for Product Management
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0007-0000-0000-000000000001', '11111111-0000-0000-0000-000000000007', 'Becoming a Product Manager', 'becoming-a-pm', 'Core skills, APM programs, and transitioning', 1, true),
    ('22222222-0007-0000-0000-000000000002', '11111111-0000-0000-0000-000000000007', 'Product Discovery', 'pm-product-discovery', 'Customer validation and opportunity solution trees', 2, true),
    ('22222222-0007-0000-0000-000000000003', '11111111-0000-0000-0000-000000000007', 'Product Strategy', 'product-strategy', 'Vision, market positioning, and moat', 3, true),
    ('22222222-0007-0000-0000-000000000004', '11111111-0000-0000-0000-000000000007', 'Roadmaps and Prioritisation', 'roadmaps-prioritisation', 'RICE scoring, now-next-later roadmaps', 4, true),
    ('22222222-0007-0000-0000-000000000005', '11111111-0000-0000-0000-000000000007', 'Product Requirements', 'product-requirements', 'PRDs, specs, and engineering collaboration', 5, true),
    ('22222222-0007-0000-0000-000000000006', '11111111-0000-0000-0000-000000000007', 'Product Analytics and KPIs', 'product-analytics', 'Cohort retention, churn, and north star metrics', 6, true),
    ('22222222-0007-0000-0000-000000000007', '11111111-0000-0000-0000-000000000007', 'Product Management Interviews', 'pm-interviews', 'Product design questions, analytics, and execution', 7, true),
    ('22222222-0007-0000-0000-000000000008', '11111111-0000-0000-0000-000000000007', 'Transitioning into Product Management', 'transitioning-into-pm', 'Pivoting from tech, design, or marketing', 8, true),
    ('22222222-0007-0000-0000-000000000009', '11111111-0000-0000-0000-000000000007', 'Other Product Management Questions', 'other-pm-questions', 'General product advisory', 9, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Topics for Other
INSERT INTO topics (id, category_id, name, slug, description, display_order, is_active)
VALUES
    ('22222222-0008-0000-0000-000000000001', '11111111-0000-0000-0000-000000000008', 'General Inquiries', 'general-inquiries', 'Custom inquiry or multi-disciplinary questions', 1, true),
    ('22222222-0008-0000-0000-000000000002', '11111111-0000-0000-0000-000000000008', 'Custom Consultation', 'custom-consultation', 'Support queue for specialized review', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 10. Sample Demo Profiles & Accounts
INSERT INTO profiles (id, email, full_name, role)
VALUES
    ('33333333-0000-0000-0000-000000000001', 'admin@theproblemsolvers.org', 'Admin Support Team', 'admin'),
    ('33333333-0000-0000-0000-000000000002', 'thabo.maths@expert.org', 'Thabo Mokoena', 'expert'),
    ('33333333-0000-0000-0000-000000000003', 'sarah.design@expert.org', 'Sarah Jenkins', 'expert'),
    ('33333333-0000-0000-0000-000000000004', 'sipho.student@seeker.org', 'Sipho Ndlovu', 'seeker'),
    ('33333333-0000-0000-0000-000000000005', 'lerato.career@expert.org', 'Lerato Dlamini', 'expert')
ON CONFLICT (id) DO NOTHING;

-- Sample Expert Profiles
INSERT INTO expert_profiles (id, user_id, headline, bio, experience_years, education_levels, session_types, is_available, approval_status, rating)
VALUES
    ('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000002', 'Senior Mathematics Educator & Matric Specialist', 'Over 10 years experience helping Grade 10-12 learners master algebra, calculus, and geometry with confidence.', 10, ARRAY['Grade 10–11', 'Grade 12', 'College or university'], ARRAY['chat', 'video_meeting'], true, 'approved', 4.95),
    ('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', 'Staff Product Designer & Design Mentor', 'Design leader specializing in Design Systems, Figma, and portfolio interview preparation for aspiring designers.', 8, ARRAY['College or university', 'Other'], ARRAY['chat', 'video_meeting'], true, 'approved', 4.98),
    ('44444444-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000005', 'Certified Career Coach & Tech Transition Advisor', 'Helping non-tech professionals transition into software development, product management, and high-impact careers.', 7, ARRAY['College or university', 'Other'], ARRAY['chat', 'video_meeting'], true, 'approved', 4.90)
ON CONFLICT (id) DO NOTHING;

-- Sample Expert Topics mapping
-- Thabo: Mathematics, Physical Sciences
INSERT INTO expert_topics (expert_id, topic_id, is_approved)
VALUES
    ('44444444-0000-0000-0000-000000000001', '22222222-0001-0000-0000-000000000001', true),
    ('44444444-0000-0000-0000-000000000001', '22222222-0001-0000-0000-000000000002', true)
ON CONFLICT (expert_id, topic_id) DO NOTHING;

-- Sarah: Portfolio Review, Figma & Design Systems, UI/UX Design
INSERT INTO expert_topics (expert_id, topic_id, is_approved)
VALUES
    ('44444444-0000-0000-0000-000000000002', '22222222-0005-0000-0000-000000000006', true),
    ('44444444-0000-0000-0000-000000000002', '22222222-0005-0000-0000-000000000005', true),
    ('44444444-0000-0000-0000-000000000002', '22222222-0005-0000-0000-000000000002', true)
ON CONFLICT (expert_id, topic_id) DO NOTHING;

-- Lerato: Transitioning into Software Development, Transitioning into Technology, CV and Job Applications
INSERT INTO expert_topics (expert_id, topic_id, is_approved)
VALUES
    ('44444444-0000-0000-0000-000000000003', '22222222-0002-0000-0000-000000000010', true),
    ('44444444-0000-0000-0000-000000000003', '22222222-0002-0000-0000-000000000008', true),
    ('44444444-0000-0000-0000-000000000003', '22222222-0002-0000-0000-000000000005', true)
ON CONFLICT (expert_id, topic_id) DO NOTHING;

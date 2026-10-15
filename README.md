# The Problem Solvers — Simple Expert-Matching Platform

**The Problem Solvers** is a full-stack, responsive web application connecting people who need help with suitable, verified experts, mentors, lecturers, and professionals. 

Operating similarly to on-demand ride platforms (like Bolt for expertise), a user submits a question, the platform automatically routes it to matching available experts, an eligible expert accepts it atomically, and the two participants communicate via real-time consultation chat or schedule an online meeting.

---

## 🌟 Key Features

1. **Category & Topic-Based Routing Engine**:
   - Requests are never blindly broadcast to all mentors.
   - Strict matching on Category + Subcategory Topic + Education Level (e.g., Grade 12 Pure Mathematics -> Grade 12 Math tutors).
   - Only approved and currently available (`is_available = true`) experts receive matching requests.

2. **Atomic Race-Condition Protection**:
   - Secure PostgreSQL database logic (`accept_help_request` with `FOR UPDATE` row lock) guarantees that when two experts click "Accept" simultaneously, the database assigns it to exactly one mentor.
   - The second expert receives: *"This request has already been accepted by another expert."*

3. **Step-by-Step "Get Help" Wizard (`/get-help`)**:
   - **Step 1:** User details (Name and email validation; no unnecessary phone numbers).
   - **Step 2:** Area selection with large interactive cards, dynamic subcategory pills, and education level selector.
   - **Step 3:** Question explanation with character limits and preferred consultation format (Chat, Video, Voice Call).
   - **Step 4:** Clear review summary and duplicate submission prevention.

4. **Help Seeker Dashboard (`/my-requests`)**:
   - Plain-language statuses: `Submitted`, `Finding an Expert`, `Expert Accepted`, `Meeting Scheduled`, `Completed`, `Cancelled`.
   - Contact privacy protection: email addresses are kept private prior to assignment.
   - Direct consultation chat drawer and meeting scheduling.

5. **Expert Dashboard (`/expert/dashboard`)**:
   - Real-time availability toggle (Available / Offline).
   - Tabbed view: **New Matching Requests**, **Accepted Requests**, and **Upcoming Meetings**.
   - One-click request acceptance and instant chat initiation.

6. **Expert Registration & Review Queue (`/expert/register`)**:
   - Multi-category and subcategory selection.
   - Session format preferences and qualification bio.
   - Pending approval barrier: unapproved experts cannot receive or accept live requests until an admin verifies their profile.

7. **In-App Automated Support Bot ("Need Help?")**:
   - Floating assistance button on all main pages.
   - Interactive FAQ options with step-by-step guidance and deep navigation links.
   - Support ticket submission form that feeds directly into the administrator support queue.

8. **Support Administrator Portal (`/admin`)**:
   - Restricted to authorized administrators.
   - Tabs: **Expert Applications** (Approve / Reject), **Requests Queue** (Filter unassigned), **Categories & Topics Management** (Add/toggle categories without code changes), **Support Inquiries** (Review and reply), **User Directory**, and **Audit Logs**.

---

## 🛠️ Technology Stack

- **Frontend**: React (ES6+), React Router v7, Lucide React icons
- **Build Tool**: Vite
- **Styling**: Vanilla CSS3 with custom design tokens, responsive flex/grid layouts, glassmorphism, and micro-animations
- **Database & Auth**: PostgreSQL via Supabase with Row Level Security (RLS)
- **Deployment**: Netlify Free (configured with SPA redirect in `netlify.toml`)
- **Testing**: Node.js Automated Test Suite (`tests/routing_and_workflow.test.js`)

---

## 📋 Getting Started & Local Development

### 1. Install Dependencies

Ensure you have Node.js (v18+ or v20+) installed. In the project root directory, run:

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

If connecting to your Supabase project, edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Note on Sandbox Demo Mode**: If no Supabase credentials are provided, the application automatically launches in **Interactive Sandbox Demo Mode**. All routing algorithms, atomic acceptance locks, chat, and admin approvals operate fully in-memory and in local storage, complete with quick persona switching between Seekers, Math Experts, Design Mentors, and Administrators!

### 3. Run the Development Server

Start the local Vite dev server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173` (or the port displayed in your terminal).

### 4. Run the Automated Test Suite

To verify all category routing scenarios, atomic concurrency locks, availability checks, and meeting workflows, run:

```bash
npm test
```

### 5. Build for Production

```bash
npm run build
```

This compiles optimized client bundles into the `dist/` directory.

---

## 🗄️ Setting Up Supabase Database (Free Version)

1. Create a free account at [https://supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Execute the SQL migration files located in the `supabase/migrations/` directory in sequence:
   - `001_initial_schema.sql` — Creates all 14 database tables (`profiles`, `categories`, `topics`, `expert_profiles`, `expert_topics`, `expert_applications`, `help_requests`, `request_assignments`, `conversations`, `messages`, `appointments`, `notifications`, `support_inquiries`, `audit_logs`).
   - `002_row_level_security.sql` — Sets up Row Level Security (RLS) policies protecting seeker privacy and restricting admin endpoints.
   - `003_functions_and_triggers.sql` — Installs the atomic `accept_help_request` PL/pgSQL function with `FOR UPDATE` row-level concurrency lock.
   - `004_seed_data.sql` — Seeds all initial categories, subcategories, and verified demo accounts.
4. Go to **Project Settings > API** in your Supabase dashboard and copy your:
   - `Project URL`
   - `anon public key`
5. Paste these into your `.env` file.

---

## 🧪 Testing the Request-Routing Process

You can test the entire workflow in under 2 minutes:

1. **Submit a Request**:
   - Open `/get-help`.
   - Step 1: Enter your name (e.g., Sipho) and email (`sipho.student@seeker.org`).
   - Step 2: Choose **Education and School Subjects**, select **Mathematics**, and pick **Grade 12**.
   - Step 3: Type your question (e.g., *"Need help with Grade 12 Calculus and differentiation proofs"*).
   - Step 4: Click **Submit Request**.
2. **Verify Target Routing**:
   - Switch active persona to **Thabo Mokoena (EXPERT)** using the top banner dropdown.
   - Go to `/expert/dashboard`.
   - The Grade 12 Mathematics request appears under **New Matching Requests**!
   - Switch persona to **Sarah Jenkins (Product Design Expert)**. Verify the Mathematics request does **NOT** appear in Sarah's dashboard.
3. **Accept Request**:
   - As Thabo, click **View Request** and click **Accept Request**.
   - The request status transitions to `Expert Accepted` and moves to **Accepted Requests**.
4. **Chat & Meeting**:
   - Click **Open Chat** to converse directly with the seeker.
   - Click **Schedule Meeting** to propose an external Google Meet / Zoom session.
5. **Admin Operations**:
   - Switch persona to **Admin Support Team**.
   - Navigate to `/admin`.
   - Review pending expert applications, manage category active states, and reply to support inquiries.

---

## 🚀 Deployment Instructions

### Deploy to Netlify Free

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of The Problem Solvers"
   git remote add origin https://github.com/your-username/the-problem-solvers.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [https://app.netlify.com](https://app.netlify.com) using your GitHub account.
3. Click **Add new site > Import an existing project > GitHub**.
4. Select your `the-problem-solvers` repository.
5. Set the build configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Under **Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy site**.
8. Single-Page Application (SPA) routing is handled automatically via `netlify.toml`.

---

## 📄 License & Attribution

Built with care for **The Problem Solvers** — helping people connect with the right person when they need guidance.

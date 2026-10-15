# Supabase Database Setup for The Problem Solvers

This folder contains the complete SQL migrations, Row Level Security (RLS) rules, backend functions, and initial seed data for **The Problem Solvers**.

## Quick Setup via Supabase Web Dashboard (Easiest)

1. Go to [https://supabase.com](https://supabase.com) and create a free account & project.
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Run the migrations in numerical order:
   - `migrations/001_initial_schema.sql` (Creates all 14 tables, indexes, constraints)
   - `migrations/002_row_level_security.sql` (Enforces RLS policies for seekers, experts, and admins)
   - `migrations/003_functions_and_triggers.sql` (Creates atomic `accept_help_request` and triggers)
   - `migrations/004_seed_data.sql` (Populates all categories, topics, and initial expert records)
4. Grab your project credentials from **Project Settings > API**:
   - `Project URL` -> `VITE_SUPABASE_URL`
   - `anon public key` -> `VITE_SUPABASE_ANON_KEY`
5. Place them into your `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

## Concurrency & Atomicity Guarantee

The database function `accept_help_request(p_request_id, p_expert_id)` executes with `FOR UPDATE` row-level locking on the `help_requests` table.
When two experts attempt to click "Accept" simultaneously on the same request:
- The first transaction acquires the lock and transitions the status to `expert_accepted`.
- The second transaction receives the exact error response required:
  `"This request has already been accepted by another expert."`

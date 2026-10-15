-- Migration 002: Row Level Security (RLS) Policies
-- The Problem Solvers - Expert Matching Platform

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checking
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_approved_expert()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM expert_profiles 
        WHERE user_id = auth.uid() AND approval_status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
ON profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update own profile (excluding role)"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Prevents self-escalation to admin
);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins full access to profiles"
ON profiles FOR ALL TO authenticated
USING (is_admin());

-- 2. Categories & Topics (Public read, admin write)
CREATE POLICY "Categories viewable by everyone"
ON categories FOR SELECT TO authenticated, anon
USING (is_active = true OR is_admin());

CREATE POLICY "Admins can modify categories"
ON categories FOR ALL TO authenticated
USING (is_admin());

CREATE POLICY "Topics viewable by everyone"
ON topics FOR SELECT TO authenticated, anon
USING (is_active = true OR is_admin());

CREATE POLICY "Admins can modify topics"
ON topics FOR ALL TO authenticated
USING (is_admin());

-- 3. Expert Profiles
CREATE POLICY "Approved expert profiles are viewable by everyone"
ON expert_profiles FOR SELECT TO authenticated, anon
USING (approval_status = 'approved' OR user_id = auth.uid() OR is_admin());

CREATE POLICY "Experts can update own profile"
ON expert_profiles FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
    user_id = auth.uid() 
    AND approval_status = (SELECT approval_status FROM expert_profiles WHERE user_id = auth.uid()) -- cannot self-approve
);

CREATE POLICY "Admins can manage expert profiles"
ON expert_profiles FOR ALL TO authenticated
USING (is_admin());

-- 4. Expert Topics
CREATE POLICY "View expert topics"
ON expert_topics FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "Experts can manage own topics"
ON expert_topics FOR ALL TO authenticated
USING (
    expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
    OR is_admin()
);

-- 5. Expert Applications
CREATE POLICY "Users can view own application"
ON expert_applications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can submit own application"
ON expert_applications FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can review applications"
ON expert_applications FOR ALL TO authenticated
USING (is_admin());

-- 6. Help Requests
-- Anyone (even anonymous or seekers) can insert requests
CREATE POLICY "Anyone can submit help requests"
ON help_requests FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- Seekers can view their own requests
-- Eligible approved experts can view open matching requests
-- Assigned experts can view their assigned requests
-- Admins can view all
CREATE POLICY "Help requests select policy"
ON help_requests FOR SELECT TO authenticated, anon
USING (
    seeker_id = auth.uid()
    OR (
        -- Approved experts can see unassigned requests matching their topics
        is_approved_expert() 
        AND status IN ('submitted', 'finding_expert')
        AND topic_id IN (
            SELECT et.topic_id 
            FROM expert_topics et
            JOIN expert_profiles ep ON ep.id = et.expert_id
            WHERE ep.user_id = auth.uid() AND ep.is_available = true
        )
    )
    OR (
        -- Assigned expert can see assigned request
        assigned_expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
    )
    OR is_admin()
);

CREATE POLICY "Seekers can update their own open requests"
ON help_requests FOR UPDATE TO authenticated
USING (seeker_id = auth.uid() OR is_admin());

-- 7. Request Assignments
CREATE POLICY "Participants and admins can view assignments"
ON request_assignments FOR SELECT TO authenticated
USING (
    expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
    OR request_id IN (SELECT id FROM help_requests WHERE seeker_id = auth.uid())
    OR is_admin()
);

-- 8. Conversations
CREATE POLICY "Only participants and admins can view conversations"
ON conversations FOR SELECT TO authenticated
USING (
    seeker_id = auth.uid() 
    OR expert_id = auth.uid() 
    OR is_admin()
);

-- 9. Messages
CREATE POLICY "Only conversation participants can view messages"
ON messages FOR SELECT TO authenticated
USING (
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE seeker_id = auth.uid() OR expert_id = auth.uid()
    )
    OR is_admin()
);

CREATE POLICY "Only conversation participants can send messages"
ON messages FOR INSERT TO authenticated
WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
        SELECT id FROM conversations 
        WHERE seeker_id = auth.uid() OR expert_id = auth.uid()
    )
);

-- 10. Appointments
CREATE POLICY "Participants can view their appointments"
ON appointments FOR SELECT TO authenticated
USING (
    seeker_id = auth.uid()
    OR expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
    OR is_admin()
);

CREATE POLICY "Participants can update appointments"
ON appointments FOR UPDATE TO authenticated
USING (
    seeker_id = auth.uid()
    OR expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
    OR is_admin()
);

CREATE POLICY "Participants can schedule appointments"
ON appointments FOR INSERT TO authenticated
WITH CHECK (
    seeker_id = auth.uid()
    OR expert_id IN (SELECT id FROM expert_profiles WHERE user_id = auth.uid())
);

-- 11. Notifications
CREATE POLICY "Users can only view their own notifications"
ON notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- 12. Support Inquiries
CREATE POLICY "Anyone can submit support inquiries"
ON support_inquiries FOR INSERT TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Users can view their own inquiries, admins see all"
ON support_inquiries FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can update support inquiries"
ON support_inquiries FOR UPDATE TO authenticated
USING (is_admin());

-- 13. Audit Logs
CREATE POLICY "Only admins can view audit logs"
ON audit_logs FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "System and admins can insert audit logs"
ON audit_logs FOR INSERT TO authenticated
WITH CHECK (is_admin() OR auth.uid() = actor_id);

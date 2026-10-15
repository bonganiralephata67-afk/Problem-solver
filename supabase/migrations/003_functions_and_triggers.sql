-- Migration 003: Database Functions and Triggers
-- The Problem Solvers - Expert Matching Platform

-- 1. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_expert_profiles_updated_at ON expert_profiles;
CREATE TRIGGER trigger_expert_profiles_updated_at
BEFORE UPDATE ON expert_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_help_requests_updated_at ON help_requests;
CREATE TRIGGER trigger_help_requests_updated_at
BEFORE UPDATE ON help_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_appointments_updated_at ON appointments;
CREATE TRIGGER trigger_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Atomic Request Acceptance Function
-- Prevents race conditions when multiple experts click accept simultaneously.
CREATE OR REPLACE FUNCTION accept_help_request(
    p_request_id UUID,
    p_expert_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_request RECORD;
    v_expert RECORD;
    v_conversation_id UUID;
    v_seeker_profile_id UUID;
    v_expert_user_id UUID;
    v_topic_name TEXT;
BEGIN
    -- Verify expert existence and approved status
    SELECT * INTO v_expert FROM expert_profiles WHERE id = p_expert_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Expert profile not found.');
    END IF;

    IF v_expert.approval_status != 'approved' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Expert account is not approved yet.');
    END IF;

    IF v_expert.is_available = false THEN
        RETURN jsonb_build_object('success', false, 'error', 'You are currently marked as unavailable.');
    END IF;

    -- Concurrency safeguard: Lock the request row
    SELECT * INTO v_request 
    FROM help_requests 
    WHERE id = p_request_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Help request not found.');
    END IF;

    -- If already accepted or assigned
    IF v_request.assigned_expert_id IS NOT NULL OR (v_request.status != 'submitted' AND v_request.status != 'finding_expert') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'This request has already been accepted by another expert.'
        );
    END IF;

    -- Update request status and assign expert
    UPDATE help_requests
    SET status = 'expert_accepted',
        assigned_expert_id = p_expert_id,
        updated_at = now()
    WHERE id = p_request_id;

    -- Record in request_assignments
    INSERT INTO request_assignments (request_id, expert_id, status)
    VALUES (p_request_id, p_expert_id, 'accepted')
    ON CONFLICT (request_id, expert_id) DO NOTHING;

    -- Prepare conversation
    v_seeker_profile_id := v_request.seeker_id;
    v_expert_user_id := v_expert.user_id;

    SELECT name INTO v_topic_name FROM topics WHERE id = v_request.topic_id;

    -- Create or fetch existing conversation
    INSERT INTO conversations (request_id, seeker_id, expert_id)
    VALUES (p_request_id, COALESCE(v_seeker_profile_id, v_expert_user_id), v_expert_user_id)
    ON CONFLICT (request_id) DO UPDATE 
    SET updated_at = now()
    RETURNING id INTO v_conversation_id;

    -- Create initial greeting message
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (
        v_conversation_id,
        v_expert_user_id,
        'Hello ' || v_request.seeker_name || '! I have accepted your request regarding ' || 
        COALESCE(v_topic_name, 'your inquiry') || '. How can I assist you?'
    );

    -- Notify help seeker if they have a registered profile
    IF v_seeker_profile_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (
            v_seeker_profile_id,
            'Expert Connected!',
            'An expert accepted your request and started a conversation.',
            'request_assigned',
            '/my-requests'
        );
    END IF;

    -- Notify expert
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
        v_expert_user_id,
        'Request Accepted',
        'You have successfully accepted the request for ' || v_request.seeker_name,
        'request_assigned',
        '/expert/dashboard'
    );

    -- Return success payload
    RETURN jsonb_build_object(
        'success', true,
        'request_id', p_request_id,
        'conversation_id', v_conversation_id,
        'message', 'Request accepted successfully.'
    );
END;
$$;

-- 3. Admin Approve Expert Application Function
CREATE OR REPLACE FUNCTION admin_approve_expert_application(
    p_application_id UUID,
    p_reviewer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_app RECORD;
    v_expert_profile_id UUID;
    v_topic_id_json JSONB;
BEGIN
    SELECT * INTO v_app FROM expert_applications WHERE id = p_application_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Application not found');
    END IF;

    -- Update application status
    UPDATE expert_applications
    SET status = 'approved',
        reviewed_by = p_reviewer_id,
        reviewed_at = now()
    WHERE id = p_application_id;

    -- Update or insert profile role to 'expert'
    UPDATE profiles
    SET role = 'expert'
    WHERE id = v_app.user_id;

    -- Create or update expert_profile
    INSERT INTO expert_profiles (
        user_id,
        headline,
        bio,
        session_types,
        approval_status,
        is_available
    )
    VALUES (
        v_app.user_id,
        v_app.headline,
        v_app.bio,
        v_app.session_types,
        'approved',
        true
    )
    ON CONFLICT (user_id) DO UPDATE
    SET approval_status = 'approved',
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        is_available = true
    RETURNING id INTO v_expert_profile_id;

    -- Populate approved topics from application JSON
    FOR v_topic_id_json IN SELECT * FROM jsonb_array_elements_text(v_app.topics_requested)
    LOOP
        INSERT INTO expert_topics (expert_id, topic_id, is_approved)
        VALUES (v_expert_profile_id, (v_topic_id_json #>> '{}')::uuid, true)
        ON CONFLICT (expert_id, topic_id) DO NOTHING;
    END LOOP;

    -- Create notification
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
        v_app.user_id,
        'Application Approved!',
        'Congratulations! Your expert application has been approved. You can now access your dashboard.',
        'application_status',
        '/expert/dashboard'
    );

    -- Log audit action
    INSERT INTO audit_logs (actor_id, action, target_type, target_id, details)
    VALUES (
        p_reviewer_id,
        'APPROVE_EXPERT',
        'expert_application',
        p_application_id::text,
        jsonb_build_object('expert_id', v_expert_profile_id, 'user_id', v_app.user_id)
    );

    RETURN jsonb_build_object('success', true, 'expert_id', v_expert_profile_id);
END;
$$;

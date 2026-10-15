import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import {
  INITIAL_CATEGORIES,
  INITIAL_TOPICS,
  INITIAL_HELP_REQUESTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_APPOINTMENTS,
  INITIAL_EXPERT_APPLICATIONS,
  INITIAL_SUPPORT_INQUIRIES,
  DEMO_USERS,
} from '../data/initialData';

const DataContext = createContext();

export function DataProvider({ children }) {
  // Local reactive state synchronized with localStorage for demo/offline resilience
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('tps_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem('tps_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [helpRequests, setHelpRequests] = useState(() => {
    const saved = localStorage.getItem('tps_help_requests');
    return saved ? JSON.parse(saved) : INITIAL_HELP_REQUESTS;
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('tps_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('tps_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('tps_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [expertApplications, setExpertApplications] = useState(() => {
    const saved = localStorage.getItem('tps_expert_applications');
    return saved ? JSON.parse(saved) : INITIAL_EXPERT_APPLICATIONS;
  });

  const [supportInquiries, setSupportInquiries] = useState(() => {
    const saved = localStorage.getItem('tps_support_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_INQUIRIES;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('tps_users_list');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('tps_audit_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: crypto.randomUUID(),
        action: 'SYSTEM_BOOT',
        target_type: 'system',
        target_id: 'app_launch',
        actor_name: 'System',
        created_at: new Date().toISOString(),
      }
    ];
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('tps_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tps_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('tps_help_requests', JSON.stringify(helpRequests));
  }, [helpRequests]);

  useEffect(() => {
    localStorage.setItem('tps_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('tps_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tps_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('tps_expert_applications', JSON.stringify(expertApplications));
  }, [expertApplications]);

  useEffect(() => {
    localStorage.setItem('tps_support_inquiries', JSON.stringify(supportInquiries));
  }, [supportInquiries]);

  useEffect(() => {
    localStorage.setItem('tps_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('tps_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Load from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const loadSupabaseData = async () => {
      try {
        const [catsRes, topsRes, reqsRes] = await Promise.all([
          supabase.from('categories').select('*').order('display_order'),
          supabase.from('topics').select('*').order('display_order'),
          supabase.from('help_requests').select('*').order('created_at', { ascending: false }),
        ]);

        if (catsRes.data && catsRes.data.length > 0) setCategories(catsRes.data);
        if (topsRes.data && topsRes.data.length > 0) setTopics(topsRes.data);
        if (reqsRes.data) setHelpRequests(reqsRes.data);
      } catch (err) {
        console.warn('Could not load live Supabase data, continuing with state:', err);
      }
    };

    loadSupabaseData();
  }, []);

  // 1. Submit Help Request
  const submitHelpRequest = async (requestData) => {
    const newRequest = {
      id: crypto.randomUUID(),
      seeker_id: requestData.seeker_id || null,
      seeker_name: requestData.seeker_name.trim(),
      seeker_email: requestData.seeker_email.trim(),
      category_id: requestData.category_id,
      topic_id: requestData.topic_id,
      education_level: requestData.education_level || null,
      inquiry: requestData.inquiry.trim(),
      preferred_session_type: requestData.preferred_session_type || 'chat',
      status: 'submitted',
      assigned_expert_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('help_requests')
          .insert(newRequest)
          .select()
          .single();
        if (error) throw error;
        setHelpRequests(prev => [data, ...prev]);
        return data;
      } catch (err) {
        console.error('Supabase insert failed, falling back to local state:', err);
      }
    }

    setHelpRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  // 2. Filter requests matching an expert (ROUTING ENGINE)
  // Strict matching rule: category + topic + education_level (if specified) + expert availability
  const getMatchingRequestsForExpert = (expertUser) => {
    if (!expertUser) return [];

    // Find expert profile from usersList or current object
    const expert = usersList.find(u => u.id === expertUser.id) || expertUser;

    // Check approval and availability
    if (expert.approval_status !== 'approved' || expert.is_available === false) {
      return [];
    }

    const expertTopicIds = expert.topics || [];
    const expertLevels = expert.education_levels || [];

    return helpRequests.filter(req => {
      // Must be unassigned and in open status
      const isOpen = req.status === 'submitted' || req.status === 'finding_expert';
      if (!isOpen || req.assigned_expert_id) return false;

      // Must explicitly match the selected topic
      const topicMatches = expertTopicIds.includes(req.topic_id);
      if (!topicMatches) return false;

      // If education level is specified on the request, verify compatibility
      if (req.education_level && expertLevels.length > 0) {
        const levelMatches = expertLevels.includes(req.education_level) || expertLevels.includes('Other');
        if (!levelMatches) return false;
      }

      return true;
    });
  };

  // 3. Get requests assigned to this expert
  const getAcceptedRequestsForExpert = (expertUser) => {
    if (!expertUser) return [];
    const expertProfileId = expertUser.expert_profile_id || expertUser.id;
    return helpRequests.filter(req => req.assigned_expert_id === expertProfileId);
  };

  // 4. Get requests for seeker
  const getRequestsForSeeker = (currentUser, email) => {
    const userEmail = (currentUser?.email || email || '').toLowerCase();
    const userId = currentUser?.id;

    return helpRequests.filter(req => {
      if (userId && req.seeker_id === userId) return true;
      if (userEmail && req.seeker_email.toLowerCase() === userEmail) return true;
      return false;
    });
  };

  // 5. ATOMIC ACCEPT REQUEST FUNCTION (Race condition protected)
  const acceptHelpRequest = async (requestId, expertUser) => {
    const expertProfileId = expertUser.expert_profile_id || expertUser.id;

    // Supabase RPC if live
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('accept_help_request', {
          p_request_id: requestId,
          p_expert_id: expertProfileId,
        });

        if (error) {
          return { success: false, error: error.message };
        }
        if (!data?.success) {
          return { success: false, error: data?.error || 'This request has already been accepted by another expert.' };
        }

        // Refresh local requests
        const { data: updatedReqs } = await supabase.from('help_requests').select('*');
        if (updatedReqs) setHelpRequests(updatedReqs);

        return { success: true, conversation_id: data.conversation_id };
      } catch (err) {
        console.warn('Supabase accept error, falling back to state lock:', err);
      }
    }

    // Local atomic check
    const currentReq = helpRequests.find(r => r.id === requestId);
    if (!currentReq) {
      return { success: false, error: 'Request not found.' };
    }

    if (currentReq.assigned_expert_id || (currentReq.status !== 'submitted' && currentReq.status !== 'finding_expert')) {
      return {
        success: false,
        error: 'This request has already been accepted by another expert.',
      };
    }

    // Update request
    const updatedRequest = {
      ...currentReq,
      status: 'expert_accepted',
      assigned_expert_id: expertProfileId,
      updated_at: new Date().toISOString(),
    };

    setHelpRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));

    // Create or retrieve conversation
    let convId = crypto.randomUUID();
    const existingConv = conversations.find(c => c.request_id === requestId);
    if (existingConv) {
      convId = existingConv.id;
    } else {
      const newConv = {
        id: convId,
        request_id: requestId,
        seeker_id: currentReq.seeker_id || 'anonymous_seeker',
        expert_id: expertUser.id,
        last_message_at: new Date().toISOString(),
      };
      setConversations(prev => [newConv, ...prev]);

      // Add welcome message
      const topic = topics.find(t => t.id === currentReq.topic_id);
      const welcomeMsg = {
        id: crypto.randomUUID(),
        conversation_id: convId,
        sender_id: expertUser.id,
        content: `Hello ${currentReq.seeker_name}! I have accepted your request regarding ${topic?.name || 'your question'}. How can I assist you today?`,
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setMessages(prev => [...prev, welcomeMsg]);
    }

    // Add audit log
    setAuditLogs(prev => [
      {
        id: crypto.randomUUID(),
        action: 'ACCEPT_REQUEST',
        target_type: 'help_request',
        target_id: requestId,
        actor_name: expertUser.full_name,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return {
      success: true,
      conversation_id: convId,
      message: 'Request accepted successfully.',
    };
  };

  // 6. Toggle Expert Availability
  const toggleExpertAvailability = (userId, isAvailable) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, is_available: isAvailable };
      }
      return u;
    }));
  };

  // 7. Register Expert Application
  const registerExpertApplication = (appData) => {
    const newApp = {
      id: crypto.randomUUID(),
      user_id: appData.user_id || crypto.randomUUID(),
      full_name: appData.full_name,
      email: appData.email,
      headline: appData.headline,
      bio: appData.bio,
      categories_requested: appData.categories_requested || [],
      topics_requested: appData.topics_requested || [],
      education_levels: appData.education_levels || [],
      session_types: appData.session_types || ['chat'],
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setExpertApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  // 8. Admin Approve Expert
  const adminApproveExpert = (appId, adminUser) => {
    const app = expertApplications.find(a => a.id === appId);
    if (!app) return { success: false, error: 'Application not found' };

    const newExpertProfileId = crypto.randomUUID();

    // Update application
    setExpertApplications(prev => prev.map(a => 
      a.id === appId ? { ...a, status: 'approved', reviewed_by: adminUser?.id, reviewed_at: new Date().toISOString() } : a
    ));

    // Create or promote user in usersList
    const newExpertUser = {
      id: app.user_id,
      email: app.email,
      full_name: app.full_name,
      role: 'expert',
      expert_profile_id: newExpertProfileId,
      headline: app.headline,
      bio: app.bio,
      topics: app.topics_requested,
      education_levels: app.education_levels,
      is_available: true,
      approval_status: 'approved',
    };

    setUsersList(prev => {
      const exists = prev.some(u => u.id === app.user_id || u.email.toLowerCase() === app.email.toLowerCase());
      if (exists) {
        return prev.map(u => (u.id === app.user_id || u.email.toLowerCase() === app.email.toLowerCase()) ? newExpertUser : u);
      }
      return [...prev, newExpertUser];
    });

    // Add Audit Log
    setAuditLogs(prev => [
      {
        id: crypto.randomUUID(),
        action: 'APPROVE_EXPERT',
        target_type: 'expert_application',
        target_id: appId,
        actor_name: adminUser?.full_name || 'Admin',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true };
  };

  // 9. Admin Reject Expert
  const adminRejectExpert = (appId, reason, adminUser) => {
    setExpertApplications(prev => prev.map(a => 
      a.id === appId ? { ...a, status: 'rejected', review_notes: reason, reviewed_by: adminUser?.id, reviewed_at: new Date().toISOString() } : a
    ));

    setAuditLogs(prev => [
      {
        id: crypto.randomUUID(),
        action: 'REJECT_EXPERT',
        target_type: 'expert_application',
        target_id: appId,
        actor_name: adminUser?.full_name || 'Admin',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true };
  };

  // 10. Chat Message actions
  const sendMessage = (conversationId, senderId, content) => {
    if (!content.trim()) return;

    const newMsg = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages(prev => [...prev, newMsg]);

    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, last_message_at: new Date().toISOString() } : c
    ));

    return newMsg;
  };

  // 11. Appointment / Meeting actions
  const scheduleMeeting = (meetingData) => {
    const newAppointment = {
      id: crypto.randomUUID(),
      request_id: meetingData.request_id,
      conversation_id: meetingData.conversation_id,
      seeker_id: meetingData.seeker_id,
      expert_id: meetingData.expert_id,
      proposed_date: meetingData.proposed_date,
      proposed_time: meetingData.proposed_time,
      session_type: meetingData.session_type || 'video_meeting',
      meeting_link: meetingData.meeting_link || 'https://meet.google.com/' + Math.random().toString(36).substring(2, 7) + '-' + Math.random().toString(36).substring(2, 6),
      status: 'confirmed',
      note: meetingData.note || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update help request status to meeting_scheduled
    setHelpRequests(prev => prev.map(r => 
      r.id === meetingData.request_id ? { ...r, status: 'meeting_scheduled' } : r
    ));

    return newAppointment;
  };

  const updateAppointmentStatus = (appointmentId, newStatus, meetingLink) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === appointmentId) {
        return {
          ...a,
          status: newStatus,
          meeting_link: meetingLink || a.meeting_link,
          updated_at: new Date().toISOString(),
        };
      }
      return a;
    }));
  };

  // 12. Support Bot / Inquiries
  const submitSupportInquiry = (inquiry) => {
    const newInquiry = {
      id: crypto.randomUUID(),
      name: inquiry.name.trim(),
      email: inquiry.email.trim(),
      subject: inquiry.subject || 'General Inquiry',
      message: inquiry.message.trim(),
      status: 'open',
      response: null,
      created_at: new Date().toISOString(),
    };

    setSupportInquiries(prev => [newInquiry, ...prev]);
    return newInquiry;
  };

  const updateSupportInquiry = (id, status, responseText) => {
    setSupportInquiries(prev => prev.map(inq => {
      if (inq.id === id) {
        return {
          ...inq,
          status,
          response: responseText || inq.response,
          resolved_at: status === 'resolved' ? new Date().toISOString() : inq.resolved_at,
        };
      }
      return inq;
    }));
  };

  // 13. Admin Category Management
  const addCategory = (categoryData) => {
    const newCat = {
      id: crypto.randomUUID(),
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryData.description || '',
      icon: categoryData.icon || 'HelpCircle',
      display_order: categories.length + 1,
      is_active: true,
      has_education_level: Boolean(categoryData.has_education_level),
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const toggleCategoryStatus = (categoryId) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, is_active: !c.is_active } : c));
  };

  const addTopic = (categoryId, topicName) => {
    const newTopic = {
      id: crypto.randomUUID(),
      category_id: categoryId,
      name: topicName,
      slug: topicName.toLowerCase().replace(/\s+/g, '-'),
    };
    setTopics(prev => [...prev, newTopic]);
    return newTopic;
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        topics,
        helpRequests,
        conversations,
        messages,
        appointments,
        expertApplications,
        supportInquiries,
        usersList,
        auditLogs,
        submitHelpRequest,
        getMatchingRequestsForExpert,
        getAcceptedRequestsForExpert,
        getRequestsForSeeker,
        acceptHelpRequest,
        toggleExpertAvailability,
        registerExpertApplication,
        adminApproveExpert,
        adminRejectExpert,
        sendMessage,
        scheduleMeeting,
        updateAppointmentStatus,
        submitSupportInquiry,
        updateSupportInquiry,
        addCategory,
        toggleCategoryStatus,
        addTopic,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ChatBox from '../components/chat/ChatBox';
import MeetingModal from '../components/meeting/MeetingModal';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  Power, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function ExpertDashboardPage() {
  const { 
    getMatchingRequestsForExpert, 
    getAcceptedRequestsForExpert, 
    acceptHelpRequest, 
    toggleExpertAvailability,
    categories, 
    topics, 
    conversations, 
    appointments,
    usersList 
  } = useData();
  const { currentUser } = useAuth();

  // Find active expert profile
  const activeExpert = usersList.find(u => u.id === currentUser?.id) || currentUser;
  const isAvailable = activeExpert?.is_available !== false;
  const isApproved = activeExpert?.approval_status === 'approved';

  // Tabs: 'matching', 'accepted', 'meetings'
  const [activeTab, setActiveTab] = useState('matching');

  // Modals
  const [inspectRequest, setInspectRequest] = useState(null);
  const [activeChatConvId, setActiveChatConvId] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Acceptance feedback state
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState('');
  const [acceptSuccessMsg, setAcceptSuccessMsg] = useState('');

  // Data queries
  const matchingRequests = getMatchingRequestsForExpert(activeExpert);
  const acceptedRequests = getAcceptedRequestsForExpert(activeExpert);
  const expertProfileId = activeExpert?.expert_profile_id || activeExpert?.id;
  const expertAppointments = appointments.filter(a => a.expert_id === expertProfileId);

  // Toggle availability
  const handleToggleAvailability = () => {
    toggleExpertAvailability(activeExpert.id, !isAvailable);
  };

  // Accept Request Handler with Concurrency Protection
  const handleAcceptRequest = async (request) => {
    setAcceptError('');
    setIsAccepting(true);

    try {
      const res = await acceptHelpRequest(request.id, activeExpert);
      if (!res.success) {
        setAcceptError(res.error || 'This request has already been accepted by another expert.');
      } else {
        setAcceptSuccessMsg('You have successfully accepted this request! You can now chat or meet.');
        setTimeout(() => {
          setInspectRequest(null);
          setAcceptSuccessMsg('');
          setActiveTab('accepted');
        }, 1200);
      }
    } catch (err) {
      setAcceptError('An unexpected error occurred while accepting this request.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleOpenChat = (request) => {
    const conv = conversations.find(c => c.request_id === request.id);
    if (conv) {
      setActiveChatConvId(conv.id);
    }
  };

  return (
    <div className="container dashboard-layout">
      {/* Top Welcome Bar */}
      <div className="dashboard-header">
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Welcome, {activeExpert?.full_name || 'Expert'}
            </h1>
            {isApproved ? (
              <span className="badge badge-approved">
                <ShieldCheck size={12} /> Approved Expert
              </span>
            ) : (
              <span className="badge badge-pending">
                <Clock size={12} /> Pending Approval
              </span>
            )}
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            {activeExpert?.headline || 'Managing incoming matching requests and guidance sessions.'}
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3">
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.5rem 1rem',
              background: isAvailable ? '#ecfdf5' : '#f1f5f9',
              border: `1px solid ${isAvailable ? '#a7f3d0' : '#cbd5e1'}`,
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span 
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isAvailable ? '#10b981' : '#94a3b8',
                display: 'inline-block',
                boxShadow: isAvailable ? '0 0 8px #10b981' : 'none',
              }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isAvailable ? '#065f46' : '#475569' }}>
              {isAvailable ? 'Available for Requests' : 'Unavailable (Offline)'}
            </span>
            <button
              onClick={handleToggleAvailability}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', height: 'auto' }}
              id="expert-availability-toggle-btn"
            >
              <Power size={12} /> {isAvailable ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        </div>
      </div>

      {/* Unapproved Warning if applicable */}
      {!isApproved && (
        <div 
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            color: '#92400e',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>
            Your expert profile is currently <strong>Pending Review</strong>. An administrator must approve your application before live requests can be accepted. You can switch to the Admin persona using the top bar to approve your account.
          </span>
        </div>
      )}

      {/* Overview Stats */}
      <div className="stats-grid">
        <div 
          className="stat-card" 
          onClick={() => setActiveTab('matching')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'matching' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="stat-tab-matching"
        >
          <div>
            <div className="stat-value" style={{ color: 'var(--color-primary-600)' }}>
              {matchingRequests.length}
            </div>
            <div className="stat-label">New Matching Requests</div>
          </div>
          <Clock size={28} style={{ color: 'var(--color-primary-400)', opacity: 0.8 }} />
        </div>

        <div 
          className="stat-card" 
          onClick={() => setActiveTab('accepted')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'accepted' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="stat-tab-accepted"
        >
          <div>
            <div className="stat-value" style={{ color: '#0d9488' }}>
              {acceptedRequests.length}
            </div>
            <div className="stat-label">Accepted Requests</div>
          </div>
          <CheckCircle2 size={28} style={{ color: '#0d9488', opacity: 0.8 }} />
        </div>

        <div 
          className="stat-card" 
          onClick={() => setActiveTab('meetings')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'meetings' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="stat-tab-meetings"
        >
          <div>
            <div className="stat-value" style={{ color: '#7c3aed' }}>
              {expertAppointments.length}
            </div>
            <div className="stat-label">Upcoming Meetings</div>
          </div>
          <Calendar size={28} style={{ color: '#7c3aed', opacity: 0.8 }} />
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value">5.0 ★</div>
            <div className="stat-label">Expert Mentorship Rating</div>
          </div>
          <ShieldCheck size={28} style={{ color: '#f59e0b', opacity: 0.8 }} />
        </div>
      </div>

      {/* Tabs Switcher */}
      <div 
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('matching')}
          style={{
            padding: '0.75rem 0.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'matching' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'matching' ? '3px solid var(--color-primary-600)' : '3px solid transparent',
          }}
          id="tab-btn-matching"
        >
          New Matching Requests ({matchingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('accepted')}
          style={{
            padding: '0.75rem 0.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'accepted' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'accepted' ? '3px solid var(--color-primary-600)' : '3px solid transparent',
          }}
          id="tab-btn-accepted"
        >
          Accepted Requests ({acceptedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          style={{
            padding: '0.75rem 0.5rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'meetings' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'meetings' ? '3px solid var(--color-primary-600)' : '3px solid transparent',
          }}
          id="tab-btn-meetings"
        >
          Upcoming Meetings ({expertAppointments.length})
        </button>
      </div>

      {/* TAB CONTENT 1: NEW MATCHING REQUESTS */}
      {activeTab === 'matching' && (
        <div className="animate-fade-in" id="matching-requests-section">
          {!isAvailable ? (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <Power size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                You are currently marked as Unavailable
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                You will not receive new matching requests while toggled off. Turn on availability when ready to accept.
              </p>
              <button onClick={handleToggleAvailability} className="btn btn-primary">
                Turn On Availability
              </button>
            </div>
          ) : matchingRequests.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }} id="no-matching-requests">
              <Clock size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No new matching requests
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
                Requests will appear here as soon as a help seeker submits a question in your approved topics. (You can submit a test request from the Get Help page to see it route here!).
              </p>
            </div>
          ) : (
            <div className="cards-list">
              {matchingRequests.map((req) => {
                const cat = categories.find(c => c.id === req.category_id);
                const top = topics.find(t => t.id === req.topic_id);

                return (
                  <div key={req.id} className="item-card" id={`expert-matching-card-${req.id}`}>
                    <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-700)', fontSize: '0.9rem' }}>
                          {cat?.name}
                        </span>
                        <span style={{ color: 'var(--color-text-dim)' }}>•</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {top?.name}
                        </span>
                        {req.education_level && (
                          <span 
                            style={{
                              fontSize: '0.75rem',
                              background: 'var(--color-bg-subtle)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            {req.education_level}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                          Prefers: <strong style={{ textTransform: 'capitalize' }}>{req.preferred_session_type?.replace('_', ' ')}</strong>
                        </span>
                        <StatusBadge status="finding_expert" />
                      </div>
                    </div>

                    <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {req.inquiry}
                    </p>

                    <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                        Submitted {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => {
                          setInspectRequest(req);
                          setAcceptError('');
                          setAcceptSuccessMsg('');
                        }}
                        className="btn btn-primary btn-sm"
                        id={`view-request-btn-${req.id}`}
                      >
                        View Request <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: ACCEPTED REQUESTS */}
      {activeTab === 'accepted' && (
        <div className="animate-fade-in" id="accepted-requests-section">
          {acceptedRequests.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <CheckCircle2 size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No accepted requests yet
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Requests you accept will appear here with active chat access.
              </p>
            </div>
          ) : (
            <div className="cards-list">
              {acceptedRequests.map((req) => {
                const cat = categories.find(c => c.id === req.category_id);
                const top = topics.find(t => t.id === req.topic_id);
                const conv = conversations.find(c => c.request_id === req.id);

                return (
                  <div key={req.id} className="item-card" id={`expert-accepted-card-${req.id}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <strong style={{ fontSize: '1rem' }}>{req.seeker_name}</strong>
                        <span style={{ color: 'var(--color-text-dim)' }}>•</span>
                        <span style={{ color: 'var(--color-primary-700)', fontWeight: 600 }}>{top?.name}</span>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.45' }}>
                      {req.inquiry}
                    </p>

                    <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                        Category: {cat?.name}
                      </span>
                      <div className="flex gap-2">
                        {conv && (
                          <button
                            onClick={() => handleOpenChat(req)}
                            className="btn btn-primary btn-sm"
                            id={`expert-chat-btn-${req.id}`}
                          >
                            <MessageSquare size={14} /> Open Chat
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setInspectRequest(req);
                            setIsMeetingModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          <Calendar size={14} /> Schedule Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: UPCOMING MEETINGS */}
      {activeTab === 'meetings' && (
        <div className="animate-fade-in" id="meetings-section">
          {expertAppointments.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <Calendar size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No scheduled meetings yet
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Appointments arranged between you and seekers will appear here with call links.
              </p>
            </div>
          ) : (
            <div className="cards-list">
              {expertAppointments.map((appt) => {
                const req = acceptedRequests.find(r => r.id === appt.request_id);
                return (
                  <div key={appt.id} className="item-card">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} style={{ color: '#7c3aed' }} />
                        <strong>Meeting with {req?.seeker_name || 'Seeker'}</strong>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>

                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <div><strong>Date:</strong> {appt.proposed_date}</div>
                      <div><strong>Time:</strong> {appt.proposed_time}</div>
                      <div><strong>Format:</strong> {appt.session_type?.replace('_', ' ')}</div>
                    </div>

                    {appt.note && (
                      <div style={{ fontSize: '0.85rem', background: 'var(--color-bg-subtle)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                        Note: {appt.note}
                      </div>
                    )}

                    {appt.meeting_link && (
                      <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Meeting Room Link</span>
                        <a
                          href={appt.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Join Call <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* INSPECT & ACCEPT REQUEST MODAL */}
      {inspectRequest && !activeChatConvId && !isMeetingModalOpen && (
        <Modal
          isOpen={Boolean(inspectRequest)}
          onClose={() => setInspectRequest(null)}
          title="Matching Help Request"
          footer={
            inspectRequest.assigned_expert_id ? (
              <button className="btn btn-secondary" onClick={() => setInspectRequest(null)}>
                Close
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setInspectRequest(null)} 
                  disabled={isAccepting}
                >
                  Decline
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAcceptRequest(inspectRequest)}
                  disabled={isAccepting || !isApproved}
                  id="modal-accept-request-btn"
                >
                  <CheckCircle2 size={16} />
                  {isAccepting ? 'Accepting...' : 'Accept Request'}
                </button>
              </div>
            )
          }
        >
          <div className="flex flex-col gap-3">
            {acceptError && (
              <div 
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                id="accept-request-error-alert"
              >
                <AlertCircle size={18} />
                <span>{acceptError}</span>
              </div>
            )}

            {acceptSuccessMsg && (
              <div 
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{acceptSuccessMsg}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Help Seeker</span>
              <strong>{inspectRequest.seeker_name}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Category</span>
              <strong>{categories.find(c => c.id === inspectRequest.category_id)?.name}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Topic</span>
              <strong>{topics.find(t => t.id === inspectRequest.topic_id)?.name}</strong>
            </div>

            {inspectRequest.education_level && (
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--color-text-muted)' }}>Education Level</span>
                <strong>{inspectRequest.education_level}</strong>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Preferred Session Format</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {inspectRequest.preferred_session_type?.replace('_', ' ')}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                Inquiry Description:
              </span>
              <div 
                style={{
                  background: 'var(--color-bg-subtle)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  border: '1px solid var(--color-border)',
                }}
              >
                {inspectRequest.inquiry}
              </div>
            </div>

            {!inspectRequest.assigned_expert_id && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                Clicking "Accept Request" assigns this request exclusively to you and opens a direct chat with the seeker. Concurrency checks ensure only one expert can accept.
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* Chat Modal */}
      {activeChatConvId && (
        <Modal
          isOpen={Boolean(activeChatConvId)}
          onClose={() => setActiveChatConvId(null)}
          title="Direct Consultation Chat"
          maxWidth="680px"
        >
          <ChatBox
            conversationId={activeChatConvId}
            otherParticipantName="Help Seeker"
            isOtherExpert={false}
          />
        </Modal>
      )}

      {/* Meeting Modal */}
      {isMeetingModalOpen && inspectRequest && (
        <MeetingModal
          isOpen={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
          request={inspectRequest}
          conversationId={conversations.find(c => c.request_id === inspectRequest.id)?.id}
          expert={activeExpert}
        />
      )}
    </div>
  );
}

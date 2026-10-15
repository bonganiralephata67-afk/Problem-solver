import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ChatBox from '../components/chat/ChatBox';
import MeetingModal from '../components/meeting/MeetingModal';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  ShieldCheck, 
  Clock, 
  Plus, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';

export default function SeekerDashboardPage() {
  const { 
    getRequestsForSeeker, 
    categories, 
    topics, 
    usersList, 
    conversations, 
    appointments 
  } = useData();
  const { currentUser } = useAuth();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeChatConvId, setActiveChatConvId] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Filter requests for current logged in seeker or matching email
  const userRequests = getRequestsForSeeker(currentUser);

  // Helper to get assigned expert
  const getAssignedExpert = (req) => {
    if (!req?.assigned_expert_id) return null;
    return usersList.find(
      u => u.expert_profile_id === req.assigned_expert_id || u.id === req.assigned_expert_id
    );
  };

  const handleOpenChat = (req) => {
    const conv = conversations.find(c => c.request_id === req.id);
    if (conv) {
      setActiveChatConvId(conv.id);
    }
  };

  const assignedExpert = getAssignedExpert(selectedRequest);
  const selectedCategory = categories.find(c => c.id === selectedRequest?.category_id);
  const selectedTopic = topics.find(t => t.id === selectedRequest?.topic_id);
  const reqAppointment = appointments.find(a => a.request_id === selectedRequest?.id);

  return (
    <div className="container dashboard-layout">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Help Requests</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Track your questions, connect with your assigned mentors, and schedule meetings.
          </p>
        </div>

        <Link to="/get-help" className="btn btn-primary" id="seeker-new-request-btn">
          <Plus size={16} /> Submit New Request
        </Link>
      </div>

      {/* Requests List */}
      {userRequests.length === 0 ? (
        <div 
          className="clean-card" 
          style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}
          id="seeker-empty-state"
        >
          <div 
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-50)',
              color: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Clock size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            No requests submitted yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Need help with a school subject, your career roadmap, business funding, or product design? Submit your question in just a few clicks.
          </p>
          <Link to="/get-help" className="btn btn-primary" id="empty-state-get-help-btn">
            Submit a Request <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cards-list">
          {userRequests.map((req) => {
            const cat = categories.find(c => c.id === req.category_id);
            const top = topics.find(t => t.id === req.topic_id);
            const expert = getAssignedExpert(req);
            const conv = conversations.find(c => c.request_id === req.id);
            const appt = appointments.find(a => a.request_id === req.id);
            const isAccepted = req.status === 'expert_accepted' || req.status === 'meeting_scheduled';

            return (
              <div 
                key={req.id} 
                className="item-card"
                id={`seeker-request-card-${req.id}`}
              >
                <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 800, color: 'var(--color-primary-600)', fontSize: '0.9rem' }}>
                      {cat?.name || 'Category'}
                    </span>
                    <span style={{ color: 'var(--color-text-dim)' }}>•</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {top?.name || 'Topic'}
                    </span>
                    {req.education_level && (
                      <span 
                        style={{
                          fontSize: '0.75rem',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--color-border)',
                          fontWeight: 600,
                        }}
                      >
                        {req.education_level}
                      </span>
                    )}
                  </div>

                  <StatusBadge status={req.status} />
                </div>

                {/* Inquiry text */}
                <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {req.inquiry}
                </p>

                {/* RICH ASSIGNED EXPERT CARD (Prominently displays expert information) */}
                {expert ? (
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #f0f1fe 0%, #ffffff 100%)',
                      border: '1.5px solid var(--color-primary-200)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                      boxShadow: '0 4px 12px rgba(49, 46, 203, 0.06)',
                    }}
                    id={`assigned-expert-card-${req.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        style={{
                          width: '3.25rem',
                          height: '3.25rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-primary-600)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          boxShadow: '0 4px 10px rgba(49, 46, 203, 0.3)',
                          flexShrink: 0,
                        }}
                      >
                        {expert.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong style={{ fontSize: '1.05rem', color: '#0b0f19' }}>{expert.full_name}</strong>
                          <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                            <ShieldCheck size={12} /> Verified Mentor
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: '2px' }}>
                          {expert.headline}
                        </div>
                        <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '3px', fontWeight: 700 }}>
                          <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                          <span>5.0 Rating • Active Responder</span>
                        </div>
                      </div>
                    </div>

                    {/* Primary chat action button and secondary meeting button */}
                    <div className="flex items-center gap-2">
                      {conv && (
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setActiveChatConvId(conv.id);
                          }}
                          className="btn btn-primary btn-sm"
                          id={`open-chat-btn-${req.id}`}
                        >
                          <MessageSquare size={14} /> Chat with {expert.full_name.split(' ')[0]}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsMeetingModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        id={`request-meeting-btn-${req.id}`}
                      >
                        <Calendar size={14} /> Schedule Meeting
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Waiting for expert status indicator */
                  <div 
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1.15rem',
                      fontSize: '0.85rem',
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                    }}
                  >
                    <Clock size={16} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Finding an Expert:</strong> Your request has been routed to verified mentors in {top?.name}. We will notify you as soon as an expert reviews and accepts your question.
                    </span>
                  </div>
                )}

                {/* Confirmed meeting banner */}
                {appt && (
                  <div 
                    style={{
                      background: '#f3e8ff',
                      border: '1px solid #e9d5ff',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1.15rem',
                      fontSize: '0.88rem',
                      color: '#6b21a8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        <strong>Upcoming Meeting:</strong> {appt.proposed_date} at {appt.proposed_time}
                      </span>
                    </div>
                    {appt.meeting_link && (
                      <a 
                        href={appt.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1"
                        style={{ color: '#6b21a8', fontWeight: 800 }}
                      >
                        Join Call Link <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}

                {/* Footer with date & Details button */}
                <div 
                  className="flex justify-between items-center" 
                  style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}
                >
                  <span>Submitted {new Date(req.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="flex items-center gap-1"
                    style={{ color: 'var(--color-primary-600)', fontWeight: 700 }}
                    id={`view-details-btn-${req.id}`}
                  >
                    View Full Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && !activeChatConvId && !isMeetingModalOpen && (
        <Modal
          isOpen={Boolean(selectedRequest)}
          onClose={() => setSelectedRequest(null)}
          title="Help Request Details"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Status</span>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Category</span>
              <strong>{selectedCategory?.name}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-muted)' }}>Topic</span>
              <strong>{selectedTopic?.name}</strong>
            </div>

            {selectedRequest.education_level && (
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--color-text-muted)' }}>Education Level</span>
                <strong>{selectedRequest.education_level}</strong>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                Your Question:
              </span>
              <div style={{ background: 'var(--color-bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', lineHeight: '1.5' }}>
                {selectedRequest.inquiry}
              </div>
            </div>

            {/* Assigned Expert details */}
            {assignedExpert && (
              <div 
                style={{
                  background: 'var(--color-primary-50)',
                  border: '1.5px solid var(--color-primary-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginTop: '0.75rem',
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
                  <strong style={{ fontSize: '0.95rem' }}>Assigned Expert Profile</strong>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{assignedExpert.full_name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {assignedExpert.headline}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: '1.5' }}>
                  {assignedExpert.bio}
                </p>

                <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => handleOpenChat(selectedRequest)}
                    className="btn btn-primary btn-sm"
                  >
                    <MessageSquare size={14} /> Open Chat
                  </button>
                  <button
                    onClick={() => setIsMeetingModalOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Calendar size={14} /> Schedule Meeting
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* CHAT MODAL */}
      {activeChatConvId && selectedRequest && (
        <Modal
          isOpen={Boolean(activeChatConvId)}
          onClose={() => setActiveChatConvId(null)}
          title={`Chat with ${assignedExpert?.full_name || 'Mentor'}`}
          maxWidth="680px"
        >
          <ChatBox
            conversationId={activeChatConvId}
            otherParticipantName={assignedExpert?.full_name}
            isOtherExpert={true}
          />
        </Modal>
      )}

      {/* MEETING MODAL */}
      {isMeetingModalOpen && selectedRequest && (
        <MeetingModal
          isOpen={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
          request={selectedRequest}
          conversationId={conversations.find(c => c.request_id === selectedRequest.id)?.id}
          expert={assignedExpert}
        />
      )}
    </div>
  );
}

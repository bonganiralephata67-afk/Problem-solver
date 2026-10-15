import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Video, FileText, CheckCircle, ExternalLink } from 'lucide-react';

export default function MeetingModal({ isOpen, onClose, request, conversationId, expert }) {
  const { scheduleMeeting } = useData();
  const { currentUser } = useAuth();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('14:00');
  const [sessionType, setSessionType] = useState('video_meeting');
  const [note, setNote] = useState('');
  const [externalLink, setExternalLink] = useState('https://meet.google.com/abc-tps-demo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppointment, setSuccessAppointment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time) return;

    setIsSubmitting(true);
    try {
      const appt = scheduleMeeting({
        request_id: request.id,
        conversation_id: conversationId,
        seeker_id: currentUser?.id || request.seeker_id || 'anonymous_seeker',
        expert_id: expert?.expert_profile_id || expert?.id || request.assigned_expert_id,
        proposed_date: date,
        proposed_time: time,
        session_type: sessionType,
        meeting_link: externalLink,
        note: note.trim(),
      });
      setSuccessAppointment(appt);
    } catch (err) {
      console.error('Error scheduling meeting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setSuccessAppointment(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDone}
      title={successAppointment ? "Meeting Confirmed" : "Request a Meeting with Expert"}
      footer={
        successAppointment ? (
          <button className="btn btn-primary" onClick={handleDone} id="meeting-modal-done-btn">
            Done
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              id="meeting-modal-submit-btn"
            >
              <Calendar size={16} />
              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </button>
          </div>
        )
      }
    >
      {successAppointment ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }} className="animate-fade-in">
          <div 
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <CheckCircle size={32} />
          </div>

          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Session Successfully Scheduled!
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Your appointment has been confirmed with {expert?.full_name || 'your expert'}. Both participants can use the agreed meeting link below.
          </p>

          <div 
            style={{
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.9rem',
            }}
          >
            <div><strong>Date:</strong> {successAppointment.proposed_date}</div>
            <div><strong>Time:</strong> {successAppointment.proposed_time}</div>
            <div><strong>Format:</strong> {successAppointment.session_type === 'video_meeting' ? 'Video Meeting (External Link)' : 'Online Audio Call'}</div>
            {successAppointment.meeting_link && (
              <div className="flex items-center gap-1" style={{ marginTop: '0.25rem' }}>
                <strong>Link:</strong>{' '}
                <a 
                  href={successAppointment.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {successAppointment.meeting_link} <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Choose a date and time for your guidance session. For this release, meetings use an agreed external meeting link (e.g. Google Meet or Zoom).
          </p>

          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                id="meeting-date-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Time</label>
              <input
                type="time"
                required
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                id="meeting-time-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Session Format</label>
            <select
              className="form-select"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              id="meeting-session-type-select"
            >
              <option value="video_meeting">Video Meeting (Google Meet / Zoom link)</option>
              <option value="online_call">Online Voice Call</option>
              <option value="chat">In-App Chat Consultation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">External Meeting Link</label>
            <input
              type="url"
              className="form-input"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="e.g. https://meet.google.com/xyz-abcd-efg"
              id="meeting-external-link-input"
            />
            <span className="form-hint">Paste your Google Meet, Zoom, or Teams URL.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Optional Agenda or Discussion Topics</label>
            <textarea
              rows={2}
              className="form-textarea"
              style={{ minHeight: '70px' }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Specific math questions from chapter 3, or review of portfolio case study 1"
              id="meeting-note-input"
            />
          </div>
        </form>
      )}
    </Modal>
  );
}

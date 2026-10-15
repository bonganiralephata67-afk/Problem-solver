import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import StatusBadge from '../components/common/StatusBadge';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export default function RequestSubmittedPage() {
  const { requestId } = useParams();
  const { helpRequests, categories, topics } = useData();

  const request = helpRequests.find(r => r.id === requestId);
  const category = categories.find(c => c.id === request?.category_id);
  const topic = topics.find(t => t.id === request?.topic_id);

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      <div 
        className="glass-panel" 
        style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}
        id="request-submitted-container"
      >
        <div 
          style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '50%',
            background: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
          }}
        >
          <CheckCircle2 size={40} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Your request has been submitted.
        </h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          We'll send it to suitable experts who can help with your question. You can track your request here.
        </p>

        {request ? (
          <div 
            style={{
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '2rem',
              fontSize: '0.9rem',
            }}
          >
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-dim)' }}>Reference ID</span>
              <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                {request.id.substring(0, 13)}...
              </code>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-dim)' }}>Status</span>
              <StatusBadge status={request.status} />
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-dim)' }}>Category</span>
              <strong>{category?.name || 'General Guidance'}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-dim)' }}>Topic</span>
              <strong>{topic?.name || 'General Inquiry'}</strong>
            </div>

            {request.education_level && (
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--color-text-dim)' }}>Education Level</span>
                <strong>{request.education_level}</strong>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Request details loaded. Reference: <code>{requestId}</code>
          </div>
        )}

        {/* Honest expectation box */}
        <div 
          style={{
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'left',
            fontSize: '0.85rem',
            color: 'var(--color-primary-900)',
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <Clock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>What happens next?</strong>
            <p style={{ marginTop: '0.25rem', color: 'var(--color-primary-800)', lineHeight: '1.5' }}>
              We do not broadcast your email address. Only verified experts with matching credentials will see your question. As soon as an expert accepts, you will be able to message them directly.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Link to="/my-requests" className="btn btn-primary" id="track-request-btn">
            Track My Requests <ArrowRight size={16} />
          </Link>
          <Link to="/" className="btn btn-secondary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { 
  ShieldCheck, 
  Users, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  MessageSquare,
  AlertCircle,
  FolderPlus,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    expertApplications, 
    helpRequests, 
    categories, 
    topics, 
    supportInquiries, 
    usersList, 
    auditLogs,
    adminApproveExpert,
    adminRejectExpert,
    updateSupportInquiry,
    addCategory,
    toggleCategoryStatus,
    addTopic
  } = useData();
  const { currentUser } = useAuth();

  // Active section tab
  const [activeTab, setActiveTab] = useState('applications');

  // Search filter
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [requestFilter, setRequestFilter] = useState('all');

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryReply, setInquiryReply] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatHasEdu, setNewCatHasEdu] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedCatForTopic, setSelectedCatForTopic] = useState('');

  // Check admin authorization
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div 
          className="glass-panel" 
          style={{ maxWidth: '540px', margin: '0 auto', padding: '3rem 2rem' }}
          id="admin-unauthorized-alert"
        >
          <div 
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <AlertCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Access Restricted
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Only authorised administrators can access the administrative management portal. Ordinary users and experts cannot view system operations or modify platform settings.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
            Tip: Switch to the <strong>Admin Support Team</strong> persona using the top banner switcher to test administrator workflows.
          </p>
        </div>
      </div>
    );
  }

  // Filter calculations
  const pendingApps = expertApplications.filter(a => a.status === 'pending');
  const openInquiries = supportInquiries.filter(i => i.status === 'open');
  const activeRequests = helpRequests.filter(r => r.status === 'submitted' || r.status === 'finding_expert' || r.status === 'expert_accepted');
  const unassignedRequests = helpRequests.filter(r => (r.status === 'submitted' || r.status === 'finding_expert') && !r.assigned_expert_id);

  const filteredRequests = helpRequests.filter(r => {
    if (requestFilter === 'unassigned') return !r.assigned_expert_id && (r.status === 'submitted' || r.status === 'finding_expert');
    if (requestFilter === 'accepted') return r.status === 'expert_accepted' || r.status === 'meeting_scheduled';
    if (requestFilter === 'completed') return r.status === 'completed';
    return true;
  });

  const filteredUsers = usersList.filter(u => 
    u.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleApproveApp = (appId) => {
    adminApproveExpert(appId, currentUser);
    setSelectedApp(null);
  };

  const handleRejectApp = (appId) => {
    adminRejectExpert(appId, 'Application did not meet verification criteria', currentUser);
    setSelectedApp(null);
  };

  const handleSaveInquiryResponse = (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    updateSupportInquiry(selectedInquiry.id, 'resolved', inquiryReply);
    setSelectedInquiry(null);
    setInquiryReply('');
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      has_education_level: newCatHasEdu,
    });
    setNewCatName('');
    setNewCatDesc('');
    setShowAddCategoryModal(false);
  };

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim() || !selectedCatForTopic) return;
    addTopic(selectedCatForTopic, newTopicName.trim());
    setNewTopicName('');
  };

  return (
    <div className="container dashboard-layout" id="admin-portal-container">
      {/* Admin Header */}
      <div className="dashboard-header">
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-primary-600)' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Support Administrator Portal</h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Review expert applications, investigate unassigned help requests, manage categories, and reply to support inquiries.
          </p>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="stats-grid">
        <div 
          className="stat-card" 
          onClick={() => setActiveTab('applications')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'applications' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="admin-tab-apps-stat"
        >
          <div>
            <div className="stat-value" style={{ color: '#d97706' }}>{pendingApps.length}</div>
            <div className="stat-label">Pending Applications</div>
          </div>
          <Clock size={28} style={{ color: '#f59e0b', opacity: 0.8 }} />
        </div>

        <div 
          className="stat-card" 
          onClick={() => setActiveTab('requests')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'requests' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="admin-tab-reqs-stat"
        >
          <div>
            <div className="stat-value" style={{ color: 'var(--color-primary-600)' }}>{unassignedRequests.length}</div>
            <div className="stat-label">Unassigned Requests</div>
          </div>
          <HelpCircle size={28} style={{ color: 'var(--color-primary-500)', opacity: 0.8 }} />
        </div>

        <div 
          className="stat-card" 
          onClick={() => setActiveTab('support')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'support' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="admin-tab-support-stat"
        >
          <div>
            <div className="stat-value" style={{ color: '#dc2626' }}>{openInquiries.length}</div>
            <div className="stat-label">Open Support Inquiries</div>
          </div>
          <MessageSquare size={28} style={{ color: '#ef4444', opacity: 0.8 }} />
        </div>

        <div 
          className="stat-card" 
          onClick={() => setActiveTab('users')}
          style={{ cursor: 'pointer', borderColor: activeTab === 'users' ? 'var(--color-primary-500)' : 'var(--color-border)' }}
          id="admin-tab-users-stat"
        >
          <div>
            <div className="stat-value" style={{ color: '#0d9488' }}>{usersList.length}</div>
            <div className="stat-label">Registered Accounts</div>
          </div>
          <Users size={28} style={{ color: '#0d9488', opacity: 0.8 }} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div 
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'applications', label: `Expert Applications (${pendingApps.length})` },
          { id: 'requests', label: `Requests Queue (${helpRequests.length})` },
          { id: 'categories', label: `Categories & Topics (${categories.length})` },
          { id: 'support', label: `Support Inquiries (${openInquiries.length})` },
          { id: 'users', label: `Users (${usersList.length})` },
          { id: 'audit', label: `Audit Log (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === tab.id ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab.id ? '3px solid var(--color-primary-600)' : '3px solid transparent',
              whiteSpace: 'nowrap',
            }}
            id={`admin-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXPERT APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="animate-fade-in" id="admin-applications-section">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Expert Registration Queue</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
              Approve or reject expert profiles before they can receive live requests.
            </span>
          </div>

          {expertApplications.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <p>No expert applications submitted yet.</p>
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Headline</th>
                    <th>Requested Areas</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expertApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{app.full_name}</td>
                      <td>{app.email}</td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.headline}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                          {app.topics_requested?.length || 0} Topics
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="btn btn-secondary btn-sm"
                          id={`review-app-btn-${app.id}`}
                        >
                          Review Application
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <div className="animate-fade-in" id="admin-requests-section">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Platform Requests Queue</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Monitor matching health, investigate requests without an expert, and view statuses.
              </p>
            </div>

            <div className="flex gap-2">
              <select
                className="form-select"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value)}
                id="admin-request-filter-select"
              >
                <option value="all">All Requests</option>
                <option value="unassigned">Unassigned (Needs Expert)</option>
                <option value="accepted">Accepted / In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Seeker</th>
                  <th>Category</th>
                  <th>Topic</th>
                  <th>Inquiry</th>
                  <th>Status</th>
                  <th>Assigned Expert</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const cat = categories.find(c => c.id === req.category_id);
                  const top = topics.find(t => t.id === req.topic_id);
                  const expert = usersList.find(u => u.expert_profile_id === req.assigned_expert_id || u.id === req.assigned_expert_id);

                  return (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600 }}>{req.seeker_name}</td>
                      <td>{cat?.name}</td>
                      <td>{top?.name}</td>
                      <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.inquiry}
                      </td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>{expert ? expert.full_name : <span style={{ color: '#d97706', fontSize: '0.8rem' }}>Unassigned</span>}</td>
                      <td style={{ fontSize: '0.8rem' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES & TOPICS */}
      {activeTab === 'categories' && (
        <div className="animate-fade-in" id="admin-categories-section">
          <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Category & Topic Management</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Add or toggle main categories and topics dynamically without modifying frontend code.
              </p>
            </div>

            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="btn btn-primary btn-sm"
              id="admin-add-category-btn"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>

          {/* Add topic inline card */}
          <div 
            style={{
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <form onSubmit={handleCreateTopic} className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Quick Add Topic:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                value={selectedCatForTopic}
                onChange={(e) => setSelectedCatForTopic(e.target.value)}
                required
                id="admin-select-cat-for-topic"
              >
                <option value="">-- Select Parent Category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Topic name (e.g. Advanced Calculus)"
                className="form-input"
                style={{ width: '260px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                required
                id="admin-new-topic-name-input"
              />

              <button type="submit" className="btn btn-secondary btn-sm" id="admin-save-topic-btn">
                <Plus size={14} /> Save Topic
              </button>
            </form>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {categories.map((cat) => {
              const catTopics = topics.filter(t => t.category_id === cat.id);
              return (
                <div key={cat.id} className="item-card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cat.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Slug: {cat.slug}</span>
                    </div>
                    <button
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`btn btn-sm ${cat.is_active ? 'btn-secondary' : 'btn-danger'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {cat.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {cat.description || 'No description.'}
                  </p>

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>
                      Topics ({catTopics.length}):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {catTopics.map(t => (
                        <span 
                          key={t.id}
                          style={{
                            background: '#e2e8f0',
                            color: 'var(--color-text-main)',
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT INQUIRIES */}
      {activeTab === 'support' && (
        <div className="animate-fade-in" id="admin-support-section">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>In-App Support Tickets</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
              Tickets submitted through the floating "Need Help?" assistant.
            </span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User / Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {supportInquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td style={{ fontWeight: 600 }}>{inq.name}</td>
                    <td>{inq.email}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inq.message}
                    </td>
                    <td><StatusBadge status={inq.status} /></td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setInquiryReply(inq.response || '');
                        }}
                        className="btn btn-secondary btn-sm"
                        id={`respond-inquiry-btn-${inq.id}`}
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USERS */}
      {activeTab === 'users' && (
        <div className="animate-fade-in" id="admin-users-section">
          <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>User Accounts Directory</h3>

            <div className="flex items-center gap-2" style={{ width: '280px' }}>
              <Search size={16} style={{ color: 'var(--color-text-dim)' }} />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                className="form-input"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                id="admin-search-users-input"
              />
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Expert Status</th>
                  <th>Headline / Bio</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span 
                        style={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          background: u.role === 'admin' ? '#fee2e2' : u.role === 'expert' ? '#dbeafe' : '#f1f5f9',
                          color: u.role === 'admin' ? '#dc2626' : u.role === 'expert' ? '#1e40af' : '#475569',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role === 'expert' ? (
                        <StatusBadge status={u.approval_status || 'approved'} />
                      ) : (
                        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.headline || u.bio || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="animate-fade-in" id="admin-audit-section">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Administrative Audit Trail</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Tracks approvals, rejections, assignment executions, and permission events.
            </p>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Target Type</th>
                  <th>Target ID</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <code style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>
                        {log.action}
                      </code>
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.actor_name || 'Admin'}</td>
                    <td>{log.target_type}</td>
                    <td style={{ fontSize: '0.8rem' }}>{log.target_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEW APPLICATION MODAL */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={`Review Application: ${selectedApp.full_name}`}
          footer={
            selectedApp.status === 'pending' ? (
              <div className="flex gap-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRejectApp(selectedApp.id)}
                  id="admin-reject-app-btn"
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleApproveApp(selectedApp.id)}
                  id="admin-approve-app-btn"
                >
                  <CheckCircle2 size={16} /> Approve as Expert
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
                Close
              </button>
            )
          }
        >
          <div className="flex flex-col gap-3">
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Professional Headline:</span>
              <p style={{ fontWeight: 600 }}>{selectedApp.headline}</p>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Bio & Experience:</span>
              <div style={{ background: 'var(--color-bg-subtle)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {selectedApp.bio}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Requested Topics:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                {selectedApp.topics_requested?.map(topId => {
                  const top = topics.find(t => t.id === topId);
                  return (
                    <span key={topId} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {top?.name || topId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* RESPOND TO INQUIRY MODAL */}
      {selectedInquiry && (
        <Modal
          isOpen={Boolean(selectedInquiry)}
          onClose={() => setSelectedInquiry(null)}
          title={`Respond to Support Ticket: ${selectedInquiry.name}`}
          footer={
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={() => setSelectedInquiry(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveInquiryResponse} id="save-inquiry-response-btn">
                <CheckCircle2 size={16} /> Mark Resolved & Save
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>User Question:</span>
              <div style={{ background: 'var(--color-bg-subtle)', padding: '0.85rem', borderRadius: '4px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {selectedInquiry.message}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Support Response / Resolution Notes</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Enter response or resolution notes..."
                value={inquiryReply}
                onChange={(e) => setInquiryReply(e.target.value)}
                id="inquiry-response-textarea"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ADD CATEGORY MODAL */}
      {showAddCategoryModal && (
        <Modal
          isOpen={showAddCategoryModal}
          onClose={() => setShowAddCategoryModal(false)}
          title="Add New Category"
          footer={
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={() => setShowAddCategoryModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateCategory} id="save-new-category-btn">
                Create Category
              </button>
            </div>
          }
        >
          <form onSubmit={handleCreateCategory}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Data Science & Machine Learning"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                id="new-cat-name-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Python, Pandas, statistical modeling, and ML engineering"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                id="new-cat-desc-input"
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={newCatHasEdu}
                onChange={(e) => setNewCatHasEdu(e.target.checked)}
              />
              <span>Requires user education level (e.g. Grade 10-12, University)</span>
            </label>
          </form>
        </Modal>
      )}
    </div>
  );
}

import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Calendar, MessageSquare, ShieldCheck, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    className: 'badge-submitted',
    icon: Clock,
  },
  finding_expert: {
    label: 'Finding an Expert',
    className: 'badge-finding_expert',
    icon: Clock,
  },
  expert_accepted: {
    label: 'Expert Accepted',
    className: 'badge-expert_accepted',
    icon: MessageSquare,
  },
  meeting_scheduled: {
    label: 'Meeting Scheduled',
    className: 'badge-meeting_scheduled',
    icon: Calendar,
  },
  completed: {
    label: 'Completed',
    className: 'badge-completed',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'badge-cancelled',
    icon: XCircle,
  },
  pending: {
    label: 'Pending Review',
    className: 'badge-pending',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'badge-approved',
    icon: ShieldCheck,
  },
  rejected: {
    label: 'Rejected',
    className: 'badge-rejected',
    icon: AlertCircle,
  },
  open: {
    label: 'Open',
    className: 'badge-pending',
    icon: Clock,
  },
  resolved: {
    label: 'Resolved',
    className: 'badge-completed',
    icon: CheckCircle2,
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status ? status.replace(/_/g, ' ') : 'Unknown',
    className: 'badge-submitted',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
}

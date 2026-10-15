import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../data/initialData';
import { Users, Database, Sparkles } from 'lucide-react';

export default function DemoNoticeBanner() {
  const { currentUser, switchDemoPersona, isSupabaseConfigured } = useAuth();

  return (
    <div className="demo-banner">
      <div className="flex items-center gap-2">
        <span className="demo-banner-pill">
          {isSupabaseConfigured ? 'LIVE SUPABASE' : 'SANDBOX DEMO'}
        </span>
        <span style={{ opacity: 0.9 }}>
          {isSupabaseConfigured
            ? 'Connected to Supabase PostgreSQL database.'
            : 'Interactive testing mode enabled. All routing, matching, and database rules active.'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          <Users size={14} /> Active Persona:
        </span>
        <select
          value={currentUser?.id || ''}
          onChange={(e) => {
            const selected = DEMO_USERS.find(u => u.id === e.target.value);
            if (selected) switchDemoPersona(selected);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
          id="persona-switcher-select"
        >
          {DEMO_USERS.map((user) => (
            <option key={user.id} value={user.id} style={{ background: '#0f172a', color: '#ffffff' }}>
              {user.full_name} ({user.role.toUpperCase()})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

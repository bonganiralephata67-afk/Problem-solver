import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Send, Clock, User, ShieldCheck } from 'lucide-react';

export default function ChatBox({ conversationId, otherParticipantName, isOtherExpert }) {
  const { messages, sendMessage, conversations } = useData();
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Filter messages for this conversation
  const convMessages = messages.filter(m => m.conversation_id === conversationId);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(conversationId, currentUser?.id || 'anonymous_seeker', inputText);
    setInputText('');
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window" id="conversation-chat-window">
      {/* Chat header */}
      <div 
        style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'var(--color-primary-100)',
              color: 'var(--color-primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {otherParticipantName ? otherParticipantName.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {otherParticipantName || 'Participant'}
              </span>
              {isOtherExpert && (
                <ShieldCheck size={14} style={{ color: 'var(--color-accent-teal)' }} title="Approved Expert" />
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Active Conversation
            </span>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="chat-messages" id="chat-messages-container">
        {convMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-dim)' }}>
            <p>No messages yet. Send a greeting to start communicating!</p>
          </div>
        ) : (
          convMessages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}
              >
                <div style={{ lineHeight: '1.45' }}>{msg.content}</div>
                <span className="chat-timestamp" style={{ color: isMe ? 'rgba(255, 255, 255, 0.8)' : '#94a3b8' }}>
                  {formatTime(msg.created_at)}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flex: 1, padding: '0.65rem 0.85rem' }}
          id="chat-message-input"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!inputText.trim()}
          id="chat-send-btn"
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { DEMO_USERS } from '../data/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Default to the demo seeker user initially for easy testing
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tps_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USERS[0]; // Sipho Ndlovu (Seeker)
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, expert_profiles(*)')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const userObj = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          avatar_url: data.avatar_url,
          expertProfile: data.expert_profiles?.[0] || null,
        };
        setCurrentUser(userObj);
        localStorage.setItem('tps_current_user', JSON.stringify(userObj));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Demo authentication: find matching user or create temporary
      const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUser(matched);
        localStorage.setItem('tps_current_user', JSON.stringify(matched));
        return { user: matched };
      }
      // Create new demo user
      const newUser = {
        id: crypto.randomUUID(),
        email,
        full_name: email.split('@')[0],
        role: 'seeker',
      };
      setCurrentUser(newUser);
      localStorage.setItem('tps_current_user', JSON.stringify(newUser));
      return { user: newUser };
    }
  };

  const signUp = async (email, password, fullName, role = 'seeker') => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      });
      if (error) throw error;
      return data;
    } else {
      const newUser = {
        id: crypto.randomUUID(),
        email,
        full_name: fullName,
        role,
      };
      setCurrentUser(newUser);
      localStorage.setItem('tps_current_user', JSON.stringify(newUser));
      return { user: newUser };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // In demo mode, reset to guest or seeker
    const defaultUser = DEMO_USERS[0];
    setCurrentUser(defaultUser);
    localStorage.setItem('tps_current_user', JSON.stringify(defaultUser));
  };

  // Demo Persona Switcher (For quick pair-testing in UI)
  const switchDemoPersona = (user) => {
    setCurrentUser(user);
    localStorage.setItem('tps_current_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        switchDemoPersona,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

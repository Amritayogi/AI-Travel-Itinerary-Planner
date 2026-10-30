import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const DEMO_USER = {
  id: 'demo-user-777',
  email: 'alex.wanderer@example.com',
  user_metadata: {
    full_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Travel Enthusiast & Internship Reviewer',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // 1. Check local demo user storage
    const savedDemoUser = localStorage.getItem('wanderai_demo_user');
    if (savedDemoUser) {
      try {
        setUser(JSON.parse(savedDemoUser));
        setIsDemoUser(true);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('wanderai_demo_user');
      }
    }

    // 2. Check Supabase auth if enabled
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsDemoUser(false);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsDemoUser(false);
        } else if (!localStorage.getItem('wanderai_demo_user')) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setIsDemoUser(false);
      return data.user;
    } else {
      // Fallback for simulated auth if Supabase credentials are missing
      const mockUser = {
        id: `mock-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        user_metadata: {
          full_name: email.split('@')[0],
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
      };
      localStorage.setItem('wanderai_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsDemoUser(true);
      return mockUser;
    }
  };

  const signup = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      setUser(data.user);
      setIsDemoUser(false);
      return data.user;
    } else {
      const mockUser = {
        id: `mock-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        user_metadata: {
          full_name: fullName || email.split('@')[0],
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
      };
      localStorage.setItem('wanderai_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsDemoUser(true);
      return mockUser;
    }
  };

  const demoLogin = () => {
    localStorage.setItem('wanderai_demo_user', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    setIsDemoUser(true);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('wanderai_demo_user');
    setUser(null);
    setIsDemoUser(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoUser,
        isSupabaseConfigured,
        isAuthenticated: !!user,
        login,
        signup,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

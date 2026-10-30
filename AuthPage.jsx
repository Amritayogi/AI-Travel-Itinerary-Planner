import React, { useState } from 'react';
import { Compass, Sparkles, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ onNavigate }) => {
  const { login, signup, demoLogin, isSupabaseConfigured } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
      }
      onNavigate('dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-soft border border-slate-200 relative overflow-hidden">
        {/* Top subtle glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 to-cyan-400" />

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900">
            {isLoginMode ? 'Welcome Back Traveler' : 'Join WanderAI Today'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLoginMode
              ? 'Sign in to access your saved trips and personalized plans'
              : 'Create an account to start generating tailored itineraries'}
          </p>
        </div>

        {/* Evaluator Quick Access Pill */}
        <div className="mb-6 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between gap-3">
          <div className="text-left text-xs">
            <div className="font-bold text-sky-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Internship Portfolio Evaluator?</span>
            </div>
            <p className="text-sky-700 text-[11px] mt-0.5">Explore with pre-seeded demo user & trips in 1 click.</p>
          </div>
          <button
            onClick={handleDemoSignIn}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition shrink-0"
          >
            Demo Login
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isLoginMode ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {isLoginMode ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setErrorMessage('');
              }}
              className="ml-1 text-sky-600 font-bold hover:underline"
            >
              {isLoginMode ? 'Register now' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Auth engine note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {isSupabaseConfigured ? 'Secured by Supabase Auth' : 'Simulated local auth (Supabase ready)'}
          </span>
        </div>
      </div>
    </div>
  );
};

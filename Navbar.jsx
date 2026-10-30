import React, { useState } from 'react';
import { Compass, Sparkles, MapPin, Calendar, User, LogOut, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';

export const Navbar = ({ currentView, onNavigate }) => {
  const { user, logout, isDemoUser } = useAuth();
  const { backendHealth } = useTrips();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      {/* Top micro banner indicating Live Gemini or Demo Mode */}
      <div className={`py-1 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 border-b ${
        backendHealth.gemini_configured
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200'
      }`}>
        {backendHealth.gemini_configured ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connected to Live Google Gemini 1.5 API & PostgreSQL</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Running in Demo Mode (Realistic Mock AI & Local Store) • No API Keys Required</span>
          </>
        )}
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center shadow-glow text-white transform group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-navy-900">
                Wander<span className="text-sky-600">AI</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-700">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">Personalized AI Travel Planner</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button 
            onClick={() => handleNav('home')} 
            className={`hover:text-sky-600 transition-colors ${currentView === 'home' ? 'text-sky-600 font-semibold' : ''}`}
          >
            Explore
          </button>
          <a 
            href="#how-it-works" 
            onClick={(e) => {
              if (currentView !== 'home') {
                e.preventDefault();
                handleNav('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-sky-600 transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#features" 
            onClick={(e) => {
              if (currentView !== 'home') {
                e.preventDefault();
                handleNav('home');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-sky-600 transition-colors"
          >
            Features
          </a>
          {user && (
            <button 
              onClick={() => handleNav('dashboard')} 
              className={`hover:text-sky-600 transition-colors ${currentView === 'dashboard' ? 'text-sky-600 font-semibold' : ''}`}
            >
              My Dashboard
            </button>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('dashboard')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
              >
                <img
                  src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover border border-white"
                />
                <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.email.split('@')[0]}</span>
              </button>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('auth')}
              className="text-sm font-semibold text-slate-700 hover:text-sky-600 px-3 py-2 transition"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => handleNav('create')}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-glow transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>Plan New Trip</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/95 px-4 pt-2 pb-6 space-y-3">
          <button 
            onClick={() => handleNav('home')} 
            className="block w-full text-left py-2 font-medium text-slate-700 hover:text-sky-600"
          >
            Explore
          </button>
          <button 
            onClick={() => handleNav('create')} 
            className="block w-full text-left py-2 font-semibold text-sky-600"
          >
            ✨ Plan New Trip
          </button>
          {user ? (
            <>
              <button 
                onClick={() => handleNav('dashboard')} 
                className="block w-full text-left py-2 font-medium text-slate-700 hover:text-sky-600"
              >
                My Dashboard ({user.user_metadata?.full_name || 'Traveler'})
              </button>
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 font-medium text-rose-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleNav('auth')} 
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-sky-600"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
};

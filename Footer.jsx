import React from 'react';
import { Compass, Sparkles, Heart, Github, Globe, Shield, Code, ArrowUpRight } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-navy-900 text-slate-400 text-sm border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand and Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Wander<span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-sm">
              An enterprise-grade, Generative AI-powered travel planner that synthesizes hyper-personalized, day-by-day itineraries with exact budgets, tourist attractions, dining, and live navigation in seconds.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-navy-800 text-sky-300 border border-navy-700">
                ⚡ Google Gemini API
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-navy-800 text-emerald-300 border border-navy-700">
                🐘 Supabase & PostgreSQL
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-navy-800 text-indigo-300 border border-navy-700">
                🚀 FastAPI & Pydantic
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-navy-800 text-cyan-300 border border-navy-700">
                ⚛️ React & Tailwind CSS
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('create')} className="hover:text-white transition flex items-center gap-1 text-sky-400 font-medium">
                  Plan Itinerary <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition">
                  Traveler Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('auth')} className="hover:text-white transition">
                  Sign In / Demo Login
                </button>
              </li>
            </ul>
          </div>

          {/* Portfolio & Internship Metadata */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Project Scope</h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-slate-300 font-medium">
                Generative AI Internship Portfolio Project
              </p>
              <p>
                Architected to showcase full-stack AI engineering, structured output prompt design, REST API design, and modern responsive UI/UX.
              </p>
              <div className="pt-2">
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>FastAPI Swagger Docs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} WanderAI Planner. Built with precision for Generative AI Engineering portfolio.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Production Ready</span>
            <span>•</span>
            <span>Open Source Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

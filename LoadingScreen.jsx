import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, CheckCircle, Clock } from 'lucide-react';

const STEPS = [
  "Analyzing your destination, budget, and travel preferences...",
  "Prompting Google Gemini GenAI for authentic local landmarks...",
  "Synthesizing customized morning, afternoon & evening schedules...",
  "Calibrating dining spots and budget breakdown per category...",
  "Enriching attractions with Google Maps navigation links...",
  "Finalizing your personalized travel dossier..."
];

export const LoadingScreen = ({ destination }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min(100, Math.round(((currentStep + 1) / STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Animated Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 p-0.5 shadow-glow">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <Compass className="w-10 h-10 text-sky-600 animate-spin-slow" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-navy-900 mb-2">
            Crafting Your Trip to {destination || "Your Dream Destination"}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Our AI engine is assembling a tailored day-by-day travel plan based on your unique style.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-sky-600 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step List */}
          <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 text-xs transition-opacity duration-300 ${
                    isCurrent ? 'text-sky-700 font-semibold' : isDone ? 'text-slate-400 line-through' : 'text-slate-300'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : isCurrent ? (
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5 animate-pulse" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Generating structured JSON schema response</span>
          </div>
        </div>
      </div>
    </div>
  );
};

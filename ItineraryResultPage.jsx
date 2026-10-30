import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Calendar, MapPin, DollarSign, Clock, Navigation, ExternalLink, 
  Utensils, BedDouble, Car, Sun, ShieldAlert, CheckSquare, Bookmark, 
  Download, Share2, Printer, ArrowLeft, CheckCircle2, ChevronRight, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';

export const ItineraryResultPage = ({ itinerary, onBackToEdit, onShareTrip }) => {
  const { user } = useAuth();
  const { saveTrip } = useTrips();
  
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeDay = itinerary?.days?.[activeDayIndex] || itinerary?.days?.[0];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTrip(itinerary);
      setIsSaved(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      alert('Failed to save itinerary: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `WanderAI_${itinerary.destination.replace(/\s+/g, '_')}_Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!itinerary) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="text-slate-500">No active itinerary selected.</p>
        <button
          onClick={onBackToEdit}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold"
        >
          Create New Itinerary
        </button>
      </div>
    );
  }

  const { preferences, budget_breakdown, accommodation_options, transportation_options, travel_tips } = itinerary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* TOP NAVIGATION & ACTIONS TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-200 pb-5">
        <button
          onClick={onBackToEdit}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Trip Parameters</span>
        </button>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaved || isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-white border border-slate-200 hover:border-sky-500 text-slate-700 hover:text-sky-600'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved to Dashboard' : isSaving ? 'Saving...' : 'Save Itinerary'}</span>
          </button>

          <button
            onClick={() => onShareTrip(itinerary)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-sky-500 text-slate-700 hover:text-sky-600 transition shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-sky-500 text-slate-700 hover:text-sky-600 transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:border-sky-500 text-slate-700 hover:text-sky-600 transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>JSON Dossier</span>
          </button>
        </div>
      </div>

      {/* TRIP COVER BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        <div className="h-72 sm:h-96 w-full relative">
          <img
            src={itinerary.hero_image_url}
            alt={itinerary.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
        </div>

        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 text-white max-w-4xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/90 backdrop-blur-md text-white shadow">
              {itinerary.duration_days} Days / {Math.max(1, itinerary.duration_days - 1)} Nights
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
              {preferences.travel_type} Trip
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
              {preferences.travelers_count} Traveler{preferences.travelers_count > 1 ? 's' : ''}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              itinerary.demo_mode ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'
            }`}>
              {itinerary.ai_provider}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {itinerary.destination}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
            {itinerary.trip_summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-sky-200">
            <span>Depart: <strong>{preferences.departure_date}</strong> (from {itinerary.starting_city})</span>
            <span>•</span>
            <span>Return: <strong>{preferences.return_date}</strong></span>
            <span>•</span>
            <span>Budget: <strong>{preferences.total_budget} {preferences.currency}</strong></span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: ITINERARY ON LEFT, DETAILS & INSIGHTS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: DAY-BY-DAY SCHEDULE (2 COLS WIDE) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Selection Tabs */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-soft flex items-center gap-2 overflow-x-auto no-print">
            {itinerary.days?.map((day, idx) => {
              const isActive = activeDayIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>Day {day.day_number}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-sky-700 text-sky-100' : 'bg-slate-200 text-slate-600'}`}>
                    {day.date.split('-').slice(1).join('/')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Overview Header */}
          {activeDay && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider">
                      Day {activeDay.day_number} • {activeDay.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-navy-900 mt-1">
                    {activeDay.day_title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {activeDay.summary}
                  </p>
                </div>

                <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Day Cost</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    ~{activeDay.daily_budget_estimate} {preferences.currency}
                  </span>
                </div>
              </div>

              {/* TIMELINE ACTIVITIES */}
              <div className="space-y-6">
                {/* MORNING ACTIVITIES */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Morning Activities</h3>
                  </div>
                  <div className="space-y-3">
                    {activeDay.morning?.map((act, i) => (
                      <ActivityCard key={i} act={act} currency={preferences.currency} />
                    ))}
                  </div>
                </div>

                {/* AFTERNOON ACTIVITIES */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Afternoon Activities</h3>
                  </div>
                  <div className="space-y-3">
                    {activeDay.afternoon?.map((act, i) => (
                      <ActivityCard key={i} act={act} currency={preferences.currency} />
                    ))}
                  </div>
                </div>

                {/* EVENING ACTIVITIES */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Evening Activities</h3>
                  </div>
                  <div className="space-y-3">
                    {activeDay.evening?.map((act, i) => (
                      <ActivityCard key={i} act={act} currency={preferences.currency} />
                    ))}
                  </div>
                </div>

                {/* MEALS RECOMMENDATIONS */}
                {activeDay.meals && activeDay.meals.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Utensils className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Curated Dining (Tailored to {preferences.food_preference})
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeDay.meals.map((meal, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100/80 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                              {meal.meal_type}
                            </span>
                            <h4 className="text-xs font-extrabold text-navy-900 leading-tight">
                              {meal.restaurant_name}
                            </h4>
                            <span className="text-[10px] text-amber-800 font-medium block mt-0.5">
                              {meal.cuisine_type}
                            </span>
                            <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                              {meal.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-700">
                              ~{meal.estimated_cost_per_person} {preferences.currency} / person
                            </span>
                            <a
                              href={meal.google_maps_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-600 font-bold hover:underline flex items-center gap-0.5"
                            >
                              <span>Map</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BUDGET BREAKDOWN, LODGING, TRANSIT, TIPS (1 COL WIDE) */}
        <div className="space-y-6">
          {/* BUDGET BREAKDOWN CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-navy-900">Estimated Budget Breakdown</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Total: {budget_breakdown.total_budget} {budget_breakdown.currency}
              </span>
            </div>

            <div className="space-y-3">
              {budget_breakdown.categories?.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{cat.category}</span>
                    <span>{cat.amount} {budget_breakdown.currency} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{cat.notes}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Contingency Buffer:</span>
              <span className="font-extrabold text-sky-700">
                {budget_breakdown.remaining_balance} {budget_breakdown.currency}
              </span>
            </div>
          </div>

          {/* ACCOMMODATION RECOMMENDATIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BedDouble className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-navy-900">Recommended Stays</h3>
            </div>

            <div className="space-y-4">
              {accommodation_options?.map((acc, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-navy-900 text-sm leading-tight">{acc.name}</h4>
                      <span className="text-[11px] text-slate-500">{acc.hotel_type} • {acc.neighborhood}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700 shrink-0">
                      ~{acc.approx_price_per_night} {preferences.currency}/night
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {acc.highlights?.map((h, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white text-slate-600 rounded text-[10px] border border-slate-200">
                        {h}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Tip: {acc.booking_advice}
                  </p>

                  <div className="pt-1">
                    <a
                      href={acc.google_maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Find on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRANSPORTATION OPTIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Car className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-navy-900">Transit & Logistics</h3>
            </div>

            <div className="space-y-3">
              {transportation_options?.map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-navy-900">{t.mode}</div>
                  <p className="text-[11px] text-slate-600 mt-1">{t.description}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">Cost: {t.average_cost}</p>
                  <p className="text-[10px] text-sky-700 mt-1 font-medium bg-sky-50 p-1.5 rounded">
                    💡 {t.pro_tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TRAVEL TIPS & WEATHER */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-extrabold text-navy-900">Weather & Insider Tips</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900">
                <span className="font-bold block mb-1">Expected Climate</span>
                <p className="text-[11px] leading-relaxed">{travel_tips.weather_summary}</p>
              </div>

              {/* Cultural etiquette */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">Cultural Etiquette</span>
                <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  {travel_tips.cultural_etiquette?.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Packing checklist */}
              <div className="pt-2">
                <span className="font-bold text-slate-800 block mb-1">Packing Checklist</span>
                <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  {travel_tips.packing_checklist?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual activity item
const ActivityCard = ({ act, currency }) => {
  return (
    <div className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200 transition space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3" />
              {act.time_slot}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
              {act.category}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-navy-900 mt-1">
            {act.title}
          </h4>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-extrabold text-emerald-600 block">
            {act.estimated_cost === 0 ? 'Free' : `~${act.estimated_cost} ${currency}`}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {act.description}
      </p>

      {act.travel_tip && (
        <div className="p-2 bg-sky-50 rounded-xl text-[11px] text-sky-800 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
          <span><strong>Local Tip:</strong> {act.travel_tip}</span>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium truncate max-w-[200px]">
          📍 {act.location_name}
        </span>
        <a
          href={act.google_maps_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-500 text-sky-600 font-semibold text-[11px] transition shadow-2xs"
        >
          <Navigation className="w-3 h-3" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

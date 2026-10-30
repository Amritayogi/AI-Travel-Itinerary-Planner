import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageCircle, ExternalLink } from 'lucide-react';

export const ShareModal = ({ itinerary, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Create shareable url (hash link with trip ID)
  const shareUrl = `${window.location.origin}${window.location.pathname}#itinerary/${itinerary.id}`;
  const shareTitle = `My AI Travel Itinerary for ${itinerary.destination} (${itinerary.duration_days} Days)`;
  const shareSummary = `${itinerary.trip_summary}\n\nBudget: ${itinerary.budget_breakdown.total_budget} ${itinerary.preferences.currency}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`Check out my personalized AI itinerary for ${itinerary.destination} on WanderAI:\n\n${shareUrl}\n\n${shareSummary}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${shareTitle}*\n${shareSummary}\n\nView full itinerary: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900">Share Trip Itinerary</h3>
            <p className="text-xs text-slate-500">Send this plan to your travel companions</p>
          </div>
        </div>

        {/* Trip snippet card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-center gap-3">
          <img
            src={itinerary.hero_image_url}
            alt={itinerary.destination}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="text-left text-xs">
            <h4 className="font-bold text-slate-800 text-sm">{itinerary.destination}</h4>
            <p className="text-slate-500">{itinerary.duration_days} Days • {itinerary.preferences.travelers_count} Traveler(s)</p>
            <p className="text-sky-600 font-semibold mt-0.5">{itinerary.budget_breakdown.total_budget} {itinerary.preferences.currency}</p>
          </div>
        </div>

        {/* Copy Link input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Direct Share Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 select-all focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-navy-900 text-white hover:bg-navy-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleEmailShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 text-sky-700 text-xs font-semibold transition"
          >
            <Mail className="w-4 h-4 text-sky-600" />
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

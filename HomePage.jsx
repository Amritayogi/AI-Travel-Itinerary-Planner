import React, { useState, useEffect } from 'react';
import { 
  Compass, Sparkles, MapPin, Calendar, ArrowRight, ShieldCheck, 
  DollarSign, Utensils, Route, Sun, CheckCircle, Star, Search, Layers
} from 'lucide-react';
import { api } from '../lib/api';
import { useTrips } from '../context/TripContext';

export const HomePage = ({ onNavigate }) => {
  const { setPrefillData } = useTrips();
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getFeaturedDestinations();
        setFeaturedDestinations(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPrefillData({ destination: searchQuery.trim() });
      onNavigate('create');
    }
  };

  const handlePlanDestination = (dest) => {
    setPrefillData({
      destination: dest.name,
      currency: 'USD',
      travel_type: 'Couple',
      travel_interests: dest.tags || ['Sightseeing', 'Culture', 'Food'],
    });
    onNavigate('create');
  };

  const filteredDestinations = featuredDestinations.filter(d => 
    !searchQuery || 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-100/60 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Next-Gen Travel Intelligence with Google Gemini AI</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Your Journey, <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">Powered by AI</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate hours of spreadsheet planning. WanderAI generates hyper-personalized, day-by-day travel schedules calibrated to your budget, culinary tastes, and pace in seconds.
          </p>

          {/* Search bar widget */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-xl rounded-2xl bg-white border border-slate-200 p-2">
              <div className="pl-3 text-slate-400">
                <MapPin className="w-5 h-5 text-sky-600" />
              </div>
              <input
                type="text"
                placeholder="Where to? (e.g. Tokyo, Paris, Bali, Rome, Swiss Alps...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-semibold px-5 py-3 rounded-xl text-sm transition shadow-sm shrink-0"
              >
                <span>Plan Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestions Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Popular:</span>
              {['Tokyo', 'Paris', 'Bali', 'Swiss Alps', 'Rome', 'New York'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setPrefillData({ destination: city });
                    onNavigate('create');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-600 transition shadow-2xs font-medium"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-soft">
            <div>
              <div className="text-2xl font-extrabold text-navy-900">120,000+</div>
              <div className="text-xs font-medium text-slate-500">Trips Planned</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-sky-600">99.4%</div>
              <div className="text-xs font-medium text-slate-500">Budget Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-navy-900">160+</div>
              <div className="text-xs font-medium text-slate-500">Countries Covered</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">4.9 / 5.0</div>
              <div className="text-xs font-medium text-slate-500">Traveler Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Curated Inspiration</div>
            <h2 className="text-3xl font-extrabold text-navy-900">Popular Global Destinations</h2>
            <p className="text-sm text-slate-500 mt-1">Ready-to-personalize travel blueprints designed by our travel intelligence</p>
          </div>
          <button
            onClick={() => onNavigate('create')}
            className="mt-4 sm:mt-0 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            Custom Destination <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-black/20" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-navy-900 shadow">
                  {dest.avg_budget}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-medium text-sky-300">{dest.country}</span>
                  <h3 className="text-xl font-bold leading-tight">{dest.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{dest.tagline}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {dest.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Rec: {dest.recommended_days} Days</span>
                  <button
                    onClick={() => handlePlanDestination(dest)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-semibold transition duration-200"
                  >
                    <span>Plan This Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-gradient-to-b from-slate-100/70 to-white py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Intuitive Process</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-1">How WanderAI Works</h2>
            <p className="text-sm text-slate-500 mt-2">
              From an idea to a fully optimized, turnkey travel plan in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Share Preferences',
                desc: 'Input destination, dates, travelers, exact budget, preferred pace, and dining choices (Halal, Vegan, Fine Dining, Street Food).',
                icon: <Layers className="w-6 h-6 text-sky-600" />,
              },
              {
                step: '02',
                title: 'AI Synthesis',
                desc: 'Our Gemini AI engine analyzes geographical logistics, landmark opening hours, and budget splits to craft the optimal route.',
                icon: <Sparkles className="w-6 h-6 text-sky-600" />,
              },
              {
                step: '03',
                title: 'Day-by-Day Itinerary',
                desc: 'Explore morning, afternoon, and evening slots with direct Google Maps links, estimated costs, and insider local tips.',
                icon: <Calendar className="w-6 h-6 text-sky-600" />,
              },
              {
                step: '04',
                title: 'Export & Roam',
                desc: 'Export to printable PDF, share via link with friends, or save to your Supabase-powered dashboard for offline viewing.',
                icon: <Compass className="w-6 h-6 text-sky-600" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:border-sky-300 transition duration-300 relative group"
              >
                <div className="text-4xl font-black text-slate-100 absolute top-4 right-4 group-hover:text-sky-100 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Enterprise-Grade Features</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-1">Engineered for Flawless Travel</h2>
          <p className="text-sm text-slate-500 mt-2">
            Packed with advanced Generative AI features designed for modern globetrotters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
              bg: 'bg-emerald-50',
              title: 'Dynamic Budget Calibration',
              desc: 'Detailed categorical breakdown for accommodation, dining, entry fees, and transit, plus a recommended safety buffer.',
            },
            {
              icon: <Utensils className="w-5 h-5 text-amber-600" />,
              bg: 'bg-amber-50',
              title: 'Curated Dining & Food Preferences',
              desc: 'Tailored recommendations for breakfast, lunch, and dinner respecting vegan, halal, street food, or fine dining tastes.',
            },
            {
              icon: <Route className="w-5 h-5 text-sky-600" />,
              bg: 'bg-sky-50',
              title: 'Integrated Google Maps Links',
              desc: 'Every monument, gallery, and restaurant includes a direct 1-click Google Maps search link for seamless navigation on your phone.',
            },
            {
              icon: <Sun className="w-5 h-5 text-indigo-600" />,
              bg: 'bg-indigo-50',
              title: 'Weather & Packing Intelligence',
              desc: 'Climate insights, local cultural etiquette rules, and a personalized packing checklist tailored to your departure season.',
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-cyan-600" />,
              bg: 'bg-cyan-50',
              title: 'Supabase PostgreSQL Storage',
              desc: 'Persist all your itineraries securely in PostgreSQL with row-level security and access them anytime across devices.',
            },
            {
              icon: <Sparkles className="w-5 h-5 text-purple-600" />,
              bg: 'bg-purple-50',
              title: 'High-Fidelity Demo Mode',
              desc: 'Works completely out of the box with zero setup hurdles, providing realistic structured itineraries even without API keys.',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-md transition"
            >
              <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-sky-900 p-10 sm:p-16 text-center text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Experience Travel Planning Without Stress?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Generate your first comprehensive AI itinerary in under 15 seconds. Completely free to test.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('create')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-glow transition duration-200"
              >
                Plan Your Trip Now
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur transition"
              >
                Try Demo Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

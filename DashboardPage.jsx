import React, { useState } from 'react';
import { 
  Plus, Calendar, MapPin, DollarSign, Users, Trash2, ExternalLink, 
  Share2, Compass, Sparkles, FolderOpen, Heart, Eye, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { api } from '../lib/api';

export const DashboardPage = ({ onNavigate, onViewTrip, onShareTrip }) => {
  const { user, isDemoUser } = useAuth();
  const { savedTrips, deleteTrip, isLoadingSaved, setPrefillData } = useTrips();
  const [filterQuery, setFilterQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  const filteredTrips = savedTrips.filter(trip =>
    trip.destination.toLowerCase().includes(filterQuery.toLowerCase()) ||
    trip.starting_city.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalBudgetSpent = savedTrips.reduce((acc, t) => acc + (parseFloat(t.total_budget) || 0), 0);
  const totalDays = savedTrips.reduce((acc, t) => acc + (t.duration_days || 0), 0);

  const handleDelete = async (e, tripId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved itinerary?')) {
      setIsDeleting(tripId);
      try {
        await deleteTrip(tripId);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleOpenTrip = async (tripId) => {
    try {
      const fullTrip = await api.getItineraryById(tripId);
      onViewTrip(fullTrip);
    } catch (err) {
      alert('Failed to load trip: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* WELCOME BANNER & PROFILE CARD */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative circle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler'}!
                </h1>
                {isDemoUser && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Demo Mode Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {user?.user_metadata?.role || 'Personalized AI Travel Planner Dashboard'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-glow transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Trip</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="mt-8 pt-6 border-t border-navy-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-navy-800/50 rounded-2xl border border-navy-700/50">
            <div className="text-2xl font-black text-white">{savedTrips.length}</div>
            <div className="text-xs text-slate-400 font-medium">Saved Itineraries</div>
          </div>
          <div className="p-3 bg-navy-800/50 rounded-2xl border border-navy-700/50">
            <div className="text-2xl font-black text-sky-400">{totalDays}</div>
            <div className="text-xs text-slate-400 font-medium">Total Travel Days</div>
          </div>
          <div className="p-3 bg-navy-800/50 rounded-2xl border border-navy-700/50">
            <div className="text-2xl font-black text-emerald-400">
              ${totalBudgetSpent.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 font-medium">Budget Planned</div>
          </div>
          <div className="p-3 bg-navy-800/50 rounded-2xl border border-navy-700/50">
            <div className="text-2xl font-black text-amber-400">
              {new Set(savedTrips.map(t => t.destination)).size}
            </div>
            <div className="text-xs text-slate-400 font-medium">Destinations Explored</div>
          </div>
        </div>
      </div>

      {/* SAVED TRIPS SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900">Your Saved Itineraries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore, manage, and share your generated travel plans</p>
          </div>

          {/* Search filter input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search saved trips..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
            />
          </div>
        </div>

        {/* Trips Grid */}
        {isLoadingSaved ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <Compass className="w-8 h-8 animate-spin mx-auto mb-2 text-sky-600" />
            <span>Loading your saved itineraries...</span>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-900 mb-1">No trips found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              {filterQuery ? 'No saved trips match your search.' : "You haven't generated or saved any trips yet. Generate your first AI itinerary today!"}
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-xs shadow-sm hover:bg-sky-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => handleOpenTrip(trip.id)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-soft hover:shadow-lg transition duration-200 cursor-pointer flex flex-col group"
              >
                {/* Trip Card Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trip.hero_image_url}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-bold text-navy-900 shadow">
                    {trip.duration_days} Days
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] text-sky-300 font-medium">From {trip.starting_city}</span>
                    <h3 className="text-lg font-bold leading-tight">{trip.destination}</h3>
                  </div>
                </div>

                {/* Trip Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.departure_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-sky-700">
                      <DollarSign className="w-3.5 h-3.5 text-sky-500" />
                      <span>{trip.total_budget} {trip.currency}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTrip(trip.id);
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      <span>View Itinerary</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(e, trip.id);
                        }}
                        disabled={isDeleting === trip.id}
                        title="Delete Itinerary"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENTLY VIEWED & QUICK RECOMMENDATIONS */}
      <div className="bg-slate-100/70 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-navy-900">Recommended Destinations to Explore</h3>
          <p className="text-xs text-slate-500">Pick any destination to generate a customized travel schedule</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Tokyo', country: 'Japan', days: 7, budget: '$2,500' },
            { name: 'Paris', country: 'France', days: 5, budget: '$2,200' },
            { name: 'Bali', country: 'Indonesia', days: 6, budget: '$1,400' },
            { name: 'Swiss Alps', country: 'Switzerland', days: 7, budget: '$3,200' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setPrefillData({ destination: item.name });
                onNavigate('create');
              }}
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer"
            >
              <h4 className="font-bold text-navy-900 text-sm">{item.name}</h4>
              <p className="text-xs text-slate-500">{item.country} • {item.days} Days</p>
              <p className="text-xs text-sky-600 font-semibold mt-1">Est: {item.budget}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

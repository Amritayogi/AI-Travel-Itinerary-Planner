import React, { useState, useEffect } from 'react';
import { 
  Sparkles, MapPin, Calendar, Users, DollarSign, Heart, Compass, 
  Car, BedDouble, Utensils, AlertCircle, ArrowRight, Zap, Check 
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { api } from '../lib/api';

const TRAVEL_TYPES = [
  { id: 'Solo', label: 'Solo Traveler', icon: '🎒', desc: 'Independent exploration & flexibility' },
  { id: 'Couple', label: 'Couple', icon: '💑', desc: 'Romantic spots & shared memories' },
  { id: 'Family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Kid-friendly pace & spacious stays' },
  { id: 'Friends', label: 'Friends / Group', icon: '🎉', desc: 'Social outings & shared adventures' },
];

const INTERESTS = [
  { id: 'Adventure', label: 'Adventure', icon: '🧗‍♂️' },
  { id: 'Nature', label: 'Nature', icon: '🌲' },
  { id: 'Historical places', label: 'Historical places', icon: '🏛️' },
  { id: 'Food', label: 'Food & Culinary', icon: '🍜' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'Beaches', label: 'Beaches & Islands', icon: '🏖️' },
  { id: 'Culture', label: 'Culture & Arts', icon: '🎭' },
  { id: 'Relaxation', label: 'Relaxation & Spa', icon: '🧘‍♀️' },
];

const ACCOMMODATIONS = [
  'Boutique Hotels',
  'Luxury 5-Star Resorts',
  'Budget Modern Hostels',
  'Cozy Airbnbs & Apartments',
  'Eco-Lodges & Nature Cabins',
];

const TRANSPORTS = [
  'Public Transit (Metro & Buses)',
  'Rental Car & Self-Drive',
  'Walking & Biking Friendly',
  'Private Chauffeur & Taxis',
  'Balanced Mix',
];

const FOOD_PREFERENCES = [
  'Authentic Local Cuisine',
  'Local Street Food & Markets',
  'Fine Dining & Michelin Rated',
  'Vegetarian / Vegan Friendly',
  'Halal Certified Only',
  'Seafood & Coastal Specialties',
  'Casual Bistros & Cafes',
];

const PACES = [
  { id: 'Relaxed', label: 'Relaxed Pace', desc: '1-2 key highlights daily, leisurely meals' },
  { id: 'Balanced', label: 'Balanced Pace', desc: '2-3 activities daily with free exploration time' },
  { id: 'Fast-Paced', label: 'Fast-Paced Explorer', desc: 'Pack as much in as possible from dawn to dusk' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

export const CreateTripPage = ({ onItineraryGenerated, onStartGenerating }) => {
  const { prefillData, setPrefillData } = useTrips();

  // Calculate default dates (departure in 7 days, return in 12 days)
  const getDefaultDates = () => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(today.getDate() + 7);
    const ret = new Date(dep);
    ret.setDate(dep.getDate() + 5);
    return {
      dep: dep.toISOString().split('T')[0],
      ret: ret.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();

  // Form State
  const [destination, setDestination] = useState(prefillData?.destination || '');
  const [startingCity, setStartingCity] = useState(prefillData?.starting_city || 'San Francisco');
  const [departureDate, setDepartureDate] = useState(defaultDates.dep);
  const [returnDate, setReturnDate] = useState(defaultDates.ret);
  const [travelersCount, setTravelersCount] = useState(2);
  const [totalBudget, setTotalBudget] = useState(2500);
  const [currency, setCurrency] = useState(prefillData?.currency || 'USD');
  const [travelType, setTravelType] = useState(prefillData?.travel_type || 'Couple');
  const [travelInterests, setTravelInterests] = useState(
    prefillData?.travel_interests || ['Culture', 'Food', 'Historical places']
  );
  const [accommodation, setAccommodation] = useState('Boutique Hotels');
  const [transportation, setTransportation] = useState('Public Transit (Metro & Buses)');
  const [foodPreference, setFoodPreference] = useState('Authentic Local Cuisine');
  const [pacePreference, setPacePreference] = useState('Balanced');

  // Validation & Error State
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefillData) {
      if (prefillData.destination) setDestination(prefillData.destination);
      if (prefillData.travel_interests) setTravelInterests(prefillData.travel_interests);
      if (prefillData.currency) setCurrency(prefillData.currency);
      // Clear prefill so it doesn't repeatedly overwrite user input
      setPrefillData(null);
    }
  }, [prefillData, setPrefillData]);

  // Calculate duration
  const dep = new Date(departureDate);
  const ret = new Date(returnDate);
  const durationDays = isNaN(dep) || isNaN(ret) ? 1 : Math.max(1, Math.round((ret - dep) / (1000 * 60 * 60 * 24)) + 1);

  const toggleInterest = (interestId) => {
    if (travelInterests.includes(interestId)) {
      if (travelInterests.length > 1) {
        setTravelInterests(travelInterests.filter(i => i !== interestId));
      }
    } else {
      setTravelInterests([...travelInterests, interestId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!destination.trim() || destination.trim().length < 2) {
      setValidationError('Please enter a valid destination.');
      return;
    }
    if (!startingCity.trim() || startingCity.trim().length < 2) {
      setValidationError('Please enter your starting origin city.');
      return;
    }
    if (new Date(returnDate) < new Date(departureDate)) {
      setValidationError('Return date cannot be earlier than departure date.');
      return;
    }
    if (totalBudget <= 0) {
      setValidationError('Total budget must be greater than zero.');
      return;
    }
    if (travelInterests.length === 0) {
      setValidationError('Please select at least one travel interest.');
      return;
    }

    const payload = {
      destination: destination.trim(),
      starting_city: startingCity.trim(),
      departure_date: departureDate,
      return_date: returnDate,
      travelers_count: Number(travelersCount),
      total_budget: Number(totalBudget),
      currency: currency,
      travel_type: travelType,
      travel_interests: travelInterests,
      accommodation_preference: accommodation,
      transportation_preference: transportation,
      food_preference: foodPreference,
      pace_preference: pacePreference,
    };

    setIsSubmitting(true);
    onStartGenerating(destination.trim());

    try {
      const result = await api.generateItinerary(payload);
      onItineraryGenerated(result);
    } catch (err) {
      setValidationError(err.message || 'Failed to generate itinerary. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Generative AI Travel Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Craft Your Personalized Itinerary
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          Tell our AI where you're heading and how you love to travel. We'll calibrate schedules, costs, and attractions specifically for you.
        </p>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* CARD 1: DESTINATION & ORIGIN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 text-xs flex items-center justify-center font-bold">1</span>
            <span>Where & When</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Destination <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-sky-600 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo, Paris, Bali, Rome, Swiss Alps"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Starting City / Departure Point <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco, New York, London, Delhi"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Departure Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Return Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="date"
                  required
                  value={returnDate}
                  min={departureDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-center">
              <span className="text-xs text-sky-700 font-medium">Calculated Duration</span>
              <div className="text-lg font-extrabold text-sky-900 mt-0.5">
                {durationDays} Day{durationDays > 1 ? 's' : ''} ({Math.max(1, durationDays - 1)} Nights)
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: TRAVELERS & BUDGET */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 text-xs flex items-center justify-center font-bold">2</span>
            <span>Travel Party & Budget</span>
          </h2>

          {/* Travel Type Selectors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Travel Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRAVEL_TYPES.map((type) => {
                const isSelected = travelType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setTravelType(type.id);
                      if (type.id === 'Solo') setTravelersCount(1);
                      if (type.id === 'Couple') setTravelersCount(2);
                      if (type.id === 'Family' && travelersCount < 3) setTravelersCount(3);
                      if (type.id === 'Friends' && travelersCount < 3) setTravelersCount(4);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition duration-200 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-sky-900' : 'text-slate-800'}`}>
                      {type.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{type.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Travelers</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Budget <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CARD 3: INTERESTS & EXPERIENCES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 text-xs flex items-center justify-center font-bold">3</span>
            <span>Travel Interests & Style</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select What You Love Doing (Choose at least one)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INTERESTS.map((interest) => {
                const isSelected = travelInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition duration-200 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500 text-white font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-lg">{interest.icon}</span>
                    <span className="text-xs truncate">{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Pace */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Travel Pace</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PACES.map((pace) => {
                const isSelected = pacePreference === pace.id;
                return (
                  <button
                    key={pace.id}
                    type="button"
                    onClick={() => setPacePreference(pace.id)}
                    className={`p-3.5 rounded-2xl border text-left transition duration-200 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-navy-900">{pace.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{pace.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 4: LOGISTICS & PREFERENCES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <h2 className="text-base font-extrabold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 text-xs flex items-center justify-center font-bold">4</span>
            <span>Lodging, Transit & Dining</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-sky-600" />
                <span>Accommodation</span>
              </label>
              <select
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              >
                {ACCOMMODATIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-sky-600" />
                <span>Transportation</span>
              </label>
              <select
                value={transportation}
                onChange={(e) => setTransportation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              >
                {TRANSPORTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-sky-600" />
                <span>Food Preference</span>
              </label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              >
                {FOOD_PREFERENCES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 hover:from-sky-700 hover:to-sky-600 text-white font-extrabold text-base shadow-lg hover:shadow-glow transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-sky-200" />
            <span>Generate Personalized AI Itinerary</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            Synthesizes day-by-day schedules, Google Maps links, budget calculations & travel tips
          </p>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrips } from './context/TripContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { ItineraryResultPage } from './pages/ItineraryResultPage';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ShareModal } from './components/common/ShareModal';
import { Toast } from './components/common/Toast';
import { api } from './lib/api';

function AppContent() {
  const { user } = useAuth();
  const { currentItinerary, setCurrentItinerary } = useTrips();

  const [currentView, setCurrentView] = useState('home');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingDestination, setGeneratingDestination] = useState('');
  const [sharingItinerary, setSharingItinerary] = useState(null);
  const [toast, setToast] = useState(null);

  // Parse URL hash on mount and hash changes
  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setCurrentView('home');
      } else if (hash === 'create') {
        setCurrentView('create');
      } else if (hash === 'dashboard') {
        setCurrentView('dashboard');
      } else if (hash === 'auth') {
        setCurrentView('auth');
      } else if (hash.startsWith('itinerary/')) {
        const tripId = hash.split('/')[1];
        if (tripId) {
          try {
            const trip = await api.getItineraryById(tripId);
            setCurrentItinerary(trip);
            setCurrentView('itinerary');
          } catch (e) {
            console.error('Failed to load shared trip:', e);
            setCurrentView('home');
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setCurrentItinerary]);

  const navigateTo = (view, extraHash = '') => {
    setCurrentView(view);
    window.location.hash = extraHash ? `${view}/${extraHash}` : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartGenerating = (dest) => {
    setGeneratingDestination(dest);
    setIsGenerating(true);
  };

  const handleItineraryGenerated = (result) => {
    setIsGenerating(false);
    setCurrentItinerary(result);
    navigateTo('itinerary', result.id);
    setToast({
      message: 'Itinerary synthesized successfully! Review your custom plan below.',
      type: 'success',
    });
  };

  const handleViewTrip = (trip) => {
    setCurrentItinerary(trip);
    navigateTo('itinerary', trip.id);
  };

  const handleShareTrip = (trip) => {
    setSharingItinerary(trip);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage onNavigate={navigateTo} />
        )}

        {currentView === 'auth' && (
          <AuthPage onNavigate={navigateTo} />
        )}

        {currentView === 'dashboard' && (
          user ? (
            <DashboardPage
              onNavigate={navigateTo}
              onViewTrip={handleViewTrip}
              onShareTrip={handleShareTrip}
            />
          ) : (
            <AuthPage onNavigate={navigateTo} />
          )
        )}

        {currentView === 'create' && (
          <CreateTripPage
            onStartGenerating={handleStartGenerating}
            onItineraryGenerated={handleItineraryGenerated}
          />
        )}

        {currentView === 'itinerary' && (
          <ItineraryResultPage
            itinerary={currentItinerary}
            onBackToEdit={() => navigateTo('create')}
            onShareTrip={handleShareTrip}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Generation Loading Overlay */}
      {isGenerating && (
        <LoadingScreen destination={generatingDestination} />
      )}

      {/* Share Modal */}
      {sharingItinerary && (
        <ShareModal
          itinerary={sharingItinerary}
          onClose={() => setSharingItinerary(null)}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  );
}

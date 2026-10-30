const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      console.warn('API Health Check Error:', err);
      return { status: 'offline', gemini_configured: false, supabase_configured: false };
    }
  },

  async getFeaturedDestinations() {
    try {
      const res = await fetch(`${API_BASE_URL}/destinations/featured`);
      if (!res.ok) throw new Error('Failed to fetch featured destinations');
      return await res.json();
    } catch (err) {
      console.error('Featured Destinations Error:', err);
      return [];
    }
  },

  async generateItinerary(preferences) {
    const res = await fetch(`${API_BASE_URL}/itinerary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate itinerary. Please verify your inputs.');
    }

    return await res.json();
  },

  async saveItinerary(itinerary, user) {
    const payload = {
      user_id: user?.id || 'demo-user',
      user_email: user?.email || 'demo@example.com',
      itinerary: itinerary,
    };

    const res = await fetch(`${API_BASE_URL}/itinerary/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to save itinerary.');
    }

    return await res.json();
  },

  async getUserItineraries(userId = 'demo-user') {
    try {
      const res = await fetch(`${API_BASE_URL}/itineraries?user_id=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('Failed to fetch trips');
      return await res.json();
    } catch (err) {
      console.error('Get User Trips Error:', err);
      return [];
    }
  },

  async getItineraryById(id) {
    const res = await fetch(`${API_BASE_URL}/itinerary/${id}`);
    if (!res.ok) throw new Error('Itinerary not found');
    return await res.json();
  },

  async deleteItinerary(id, userId = 'demo-user') {
    const res = await fetch(`${API_BASE_URL}/itinerary/${id}?user_id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete itinerary');
    return await res.json();
  }
};

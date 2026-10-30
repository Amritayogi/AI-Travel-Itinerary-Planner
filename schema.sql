-- Supabase / PostgreSQL Database Schema for AI Travel Itinerary Planner

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trips Table: Stores generated itineraries and metadata
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'demo-user',
    user_email TEXT DEFAULT 'demo@example.com',
    destination VARCHAR(150) NOT NULL,
    starting_city VARCHAR(150) NOT NULL,
    duration_days INT NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_budget NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    hero_image_url TEXT,
    itinerary_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own trips (and demo users)
CREATE POLICY "Users can read own trips"
    ON public.trips
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = 'demo-user');

-- Allow authenticated users or demo users to insert trips
CREATE POLICY "Users can insert own trips"
    ON public.trips
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = 'demo-user');

-- Allow users to delete their own trips
CREATE POLICY "Users can delete own trips"
    ON public.trips
    FOR DELETE
    USING (auth.uid()::text = user_id OR user_id = 'demo-user');

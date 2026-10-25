-- ==============================================================================
-- MedVault Production PostgreSQL Schema & Supabase RLS Policies
-- Execute this script in your Supabase Project SQL Editor
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Patient Profiles (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  blood_group TEXT,
  height TEXT,
  weight TEXT,
  allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
  chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  primary_physician JSONB DEFAULT '{}'::jsonb,
  insurance JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Medical Records Vault
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lab-report', 'prescription', 'radiology', 'discharge', 'vaccination', 'other')),
  doctor_name TEXT NOT NULL,
  facility TEXT NOT NULL,
  record_date DATE NOT NULL,
  storage_path TEXT,
  file_size TEXT,
  file_type TEXT,
  summary TEXT,
  key_findings TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_encrypted BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'verified' CHECK (status IN ('verified', 'pending-review', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Extracted Clinical Biomarkers
CREATE TABLE IF NOT EXISTS public.biomarkers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  reference_range TEXT,
  status TEXT CHECK (status IN ('normal', 'borderline', 'elevated', 'low')),
  clinical_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Daily Medication & Schedules
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  times_of_day TEXT[] DEFAULT ARRAY[]::TEXT[],
  instructions TEXT,
  prescribed_by TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  remaining_refills INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Medication Adherence Logs
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_taken BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Granular Doctor / Caregiver Access Passes
CREATE TABLE IF NOT EXISTS public.share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  organization TEXT NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('Full Vault', 'Lab Reports Only', 'Single Document')),
  target_record_id UUID REFERENCES public.medical_records(id) ON DELETE SET NULL,
  pin_hash TEXT,
  view_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Pharmacy Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Pharmacist Review', 'Dispatched', 'Delivered')),
  tracking_number TEXT,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Ensure zero-trust tenant isolation: Users can ONLY see their own records.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: Only current user
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Medical Records: Only current user
CREATE POLICY "Users can view own records" ON public.medical_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON public.medical_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON public.medical_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON public.medical_records FOR DELETE USING (auth.uid() = user_id);

-- Medications
CREATE POLICY "Users can manage own medications" ON public.medications FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage bucket creation for Private Medical Files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medvault-records-private', 'medvault-records-private', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Owner only
CREATE POLICY "Users can upload their own medical files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'medvault-records-private' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own medical files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'medvault-records-private' AND auth.uid()::text = (storage.foldername(name))[1]);

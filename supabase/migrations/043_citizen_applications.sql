-- ==================================================================================
-- 043_citizen_applications.sql
-- SHREE RADHE KRISHNA DIGITAL SERVICE — Citizen Digital Service Applications Schema
-- Safe, idempotent extension for citizen profiles, services, applications & payments
-- ==================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CUSTOMER PROFILES (Citizens)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Optional link to auth.users
    full_name TEXT NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    district VARCHAR(100) DEFAULT 'Vadodara',
    taluka VARCHAR(100) DEFAULT 'Shinor',
    village_city VARCHAR(100) DEFAULT 'Sadhli',
    pincode VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_mobile ON public.customer_profiles(mobile);

-- 2. SERVICES CATALOG (21 Digital Services)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(20) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_gu TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    description TEXT,
    instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_code ON public.services(service_code);

-- 3. APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
    service_code VARCHAR(20) NOT NULL,
    service_name TEXT NOT NULL,
    locked_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Application Received',
    applicant_name TEXT NOT NULL,
    applicant_mobile VARCHAR(20) NOT NULL,
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    admin_remark TEXT,
    final_document_name TEXT,
    final_document_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apps_number ON public.applications(application_number);
CREATE INDEX IF NOT EXISTS idx_apps_status ON public.applications(status);

-- 4. STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by TEXT NOT NULL DEFAULT 'System',
    notes TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CITIZEN PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference VARCHAR(100) NOT NULL UNIQUE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50) DEFAULT 'UPI', -- UPI, Card, Netbanking, Cash
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Created',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_app ON public.payments(application_id);

-- Enable RLS
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow public read of services catalog
DO $$ BEGIN
    CREATE POLICY "Allow public read on services" ON public.services FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

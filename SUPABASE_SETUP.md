# Supabase Setup Guide

## ✅ Completed Steps

1. **Environment Variables Configured**
   - Updated `.env.local` with new Supabase credentials
   - URL: `https://moglmxolvmbcmdktrerl.supabase.co`
   - Anon Key: Configured

2. **Supabase Client Libraries Installed**
   - `@supabase/supabase-js` v2.47.10
   - `@supabase/ssr` v0.5.2

3. **Supabase Client Files Created**
   - `/src/lib/supabase/client.ts` - Browser client for client-side operations
   - `/src/lib/supabase/server.ts` - Server client for server-side operations
   - `/src/lib/supabase/middleware.ts` - Middleware for session management

## 🔧 Next Steps: Database Setup

### 1. Create Database Tables

You need to run SQL scripts in your Supabase SQL Editor to create the required tables. Go to your Supabase dashboard:
- Navigate to: https://moglmxolvmbcmdktrerl.supabase.co
- Go to SQL Editor
- Run the following SQL scripts

#### Core Tables SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    blood_group TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient medical history
CREATE TABLE IF NOT EXISTS patient_medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    condition TEXT NOT NULL,
    diagnosed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screening records
CREATE TABLE IF NOT EXISTS screening_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    screening_date DATE NOT NULL,
    screening_type TEXT NOT NULL,
    result TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnoses
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis_date DATE NOT NULL,
    stage TEXT,
    type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatments
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE CASCADE,
    treatment_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    prescribing_doctor TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Symptoms log
CREATE TABLE IF NOT EXISTS symptoms_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    symptoms JSONB NOT NULL,
    pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 10),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 0 AND 10),
    bleeding BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    appointment_type TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical Reports
CREATE TABLE IF NOT EXISTS medical_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    report_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Educational content
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_log_patient_id ON symptoms_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
```

### 2. Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Patients policies
CREATE POLICY "Patients can view their own data"
    ON patients FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Doctors can view all patients"
    ON patients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Symptoms log policies
CREATE POLICY "Patients can view their own symptoms"
    ON symptoms_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = symptoms_log.patient_id
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert their own symptoms"
    ON symptoms_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = patient_id
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can view all symptoms"
    ON symptoms_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Messages policies
CREATE POLICY "Users can view their own messages"
    ON messages FOR SELECT
    USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Medical Reports policies
CREATE POLICY "Docs can view reports"
    ON medical_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

CREATE POLICY "Docs can upload reports"
    ON medical_reports FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

CREATE POLICY "Patients can view their own reports"
    ON medical_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = medical_reports.patient_id
            AND patients.user_id = auth.uid()
        )
    );

-- Educational content policies (public read)
CREATE POLICY "Anyone can view educational content"
    ON educational_content FOR SELECT
    USING (true);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
    ON appointments FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
        OR doctor_id = auth.uid()
    );

-- Medications policies
CREATE POLICY "Patients can view their own medications"
    ON medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = medications.patient_id
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Doctors can view all medications"
    ON medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());
```

### 3. Create Database Trigger for User Registration

```sql
-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
    );
    
    -- If role is patient, create patient record
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'patient' THEN
        INSERT INTO public.patients (user_id)
        VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Set Up Storage Buckets

Go to Storage in your Supabase dashboard and create these buckets:

1. **medical-documents** bucket
   - Public: No
   - File size limit: 50MB
   - Allowed MIME types: `application/pdf`, `image/*`

2. **avatars** bucket
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

#### Storage Policies

```sql
-- Medical documents policies
CREATE POLICY "Users can upload their own documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'medical-documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'medical-documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Doctors can view all documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'medical-documents'
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Avatar policies
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

### 5. Add Sample Educational Content

```sql
INSERT INTO educational_content (title, content, category, author) VALUES
('Understanding Cervical Cancer', 'Cervical cancer is a type of cancer that occurs in the cells of the cervix...', 'General', 'Medical Team'),
('HPV and Cervical Cancer', 'Human papillomavirus (HPV) is the main cause of cervical cancer...', 'Prevention', 'Medical Team'),
('Screening and Early Detection', 'Regular screening can help detect cervical cancer early...', 'Screening', 'Medical Team'),
('Treatment Options', 'Treatment for cervical cancer depends on the stage and type...', 'Treatment', 'Medical Team'),
('Living with Cervical Cancer', 'Managing symptoms and maintaining quality of life...', 'Support', 'Medical Team');
```

## 🔐 Authentication Setup

### Disable Email Confirmation (for testing)

1. Go to Authentication → Settings in Supabase dashboard
2. Under "Email Auth", disable "Enable email confirmations"
3. This allows immediate login after registration

### Enable Email Confirmation (for production)

1. Configure email templates in Authentication → Email Templates
2. Set up SMTP settings or use Supabase's email service
3. Enable "Enable email confirmations"

## 🧪 Testing the Setup

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Register a Test User

- Go to http://localhost:3000/register
- Register as a patient
- Register as a doctor (use different email)

### 3. Test Features

- Login with patient account
- Log symptoms
- View educational content
- Send messages to doctors
- Login with doctor account
- View patient list
- View messages from patients

## 📝 Important Notes

1. **Current State**: The application has Supabase client files configured but the authentication is still using Appwrite (`/lib/auth.ts`)

2. **Migration Needed**: To fully use Supabase, you need to:
   - Update `/lib/auth.ts` to use Supabase authentication
   - Or create a new auth file and update all imports
   - Update the LoginForm and RegisterForm components

3. **Database**: Make sure to run all SQL scripts in order:
   - Core tables first
   - RLS policies second
   - Triggers third
   - Storage policies last

4. **Environment**: The `.env.local` file is now configured with your Supabase credentials

## 🚀 Next Steps

1. Run the SQL scripts in your Supabase dashboard
2. Decide whether to migrate from Appwrite to Supabase completely
3. Test the application with the new database
4. Configure email templates for production use


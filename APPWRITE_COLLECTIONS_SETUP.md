# Appwrite Collections Setup Guide

This guide will help you create all the necessary collections in your Appwrite database to match the previous Supabase schema.

## Prerequisites

1. Log in to your Appwrite Console: https://cloud.appwrite.io
2. Navigate to your project: **cervical cancer patient** (ID: `694e144e003baee5a5ff`)
3. Go to the **Databases** section
4. Select your database with ID: `standard_5f913fcd87d3371c5e41a5706152b4648d76afea7f456bc7ea2a794abe50e7bf...`

## Collections to Create

### 1. Users Collection

**Collection ID:** `users`

**Attributes:**
- `role` (String, required) - Values: 'doctor' or 'patient'
- `full_name` (String, required)
- `email` (String, required)
- `phone` (String, optional)
- `is_active` (Boolean, default: true)

**Indexes:**
- `email_index` on `email` (unique)
- `role_index` on `role`

**Permissions:**
- Read: Users (for own documents)
- Create: Any (for signup)
- Update: Users (for own documents)

---

### 2. Patients Collection

**Collection ID:** `patients`

**Attributes:**
- `user_id` (String, required) - References users collection
- `date_of_birth` (String, optional) - ISO date format
- `age` (Integer, optional)
- `marital_status` (String, optional) - Values: 'single', 'married', 'divorced', 'widowed'
- `blood_group` (String, optional)
- `emergency_contact_name` (String, optional)
- `emergency_contact_phone` (String, optional)

**Indexes:**
- `user_id_index` on `user_id` (unique)

---

### 3. Appointments Collection

**Collection ID:** `appointments`

**Attributes:**
- `patient_id` (String, required)
- `doctor_id` (String, required)
- `appointment_date` (String, required) - ISO datetime format
- `appointment_type` (String, required) - Values: 'consultation', 'follow_up', 'screening', 'treatment', 'teleconsultation'
- `status` (String, default: 'scheduled') - Values: 'scheduled', 'completed', 'cancelled', 'no_show'
- `notes` (String, optional)

**Indexes:**
- `patient_id_index` on `patient_id`
- `doctor_id_index` on `doctor_id`
- `date_index` on `appointment_date`

---

### 4. Symptoms Log Collection

**Collection ID:** `symptoms_log`

**Attributes:**
- `patient_id` (String, required)
- `log_date` (String, required) - ISO date format
- `symptoms` (String[], required) - Array of symptom strings
- `pain_scale` (Integer, optional) - 1-10
- `bleeding` (Boolean, default: false)
- `bleeding_severity` (String, optional) - Values: 'light', 'moderate', 'heavy'
- `fatigue_level` (Integer, optional) - 1-10
- `notes` (String, optional)

**Indexes:**
- `patient_id_index` on `patient_id`
- `date_index` on `log_date`

---

### 5. Messages Collection

**Collection ID:** `messages`

**Attributes:**
- `sender_id` (String, required)
- `recipient_id` (String, required)
- `message` (String, required)
- `is_read` (Boolean, default: false)
- `is_urgent` (Boolean, default: false)
- `attachment_url` (String, optional)

**Indexes:**
- `sender_id_index` on `sender_id`
- `recipient_id_index` on `recipient_id`

---

### 6. Medical History Collection

**Collection ID:** `medical_history`

**Attributes:**
- `patient_id` (String, required)
- `menstrual_history` (String, optional) - JSON string
- `pregnancy_history` (String, optional) - JSON string
- `hpv_vaccination_status` (Boolean, default: false)
- `hpv_vaccination_date` (String, optional)
- `family_cancer_history` (String, optional)
- `other_medical_conditions` (String[], optional)
- `allergies` (String[], optional)

---

### 7. Treatments Collection

**Collection ID:** `treatments`

**Attributes:**
- `patient_id` (String, required)
- `diagnosis_id` (String, optional)
- `treatment_type` (String, required) - Values: 'chemotherapy', 'radiation', 'surgery', 'immunotherapy', 'targeted_therapy'
- `start_date` (String, required)
- `end_date` (String, optional)
- `status` (String, default: 'planned') - Values: 'planned', 'ongoing', 'completed', 'discontinued'
- `protocol` (String, optional)
- `notes` (String, optional)
- `prescribed_by` (String, required)

---

### 8. Screening Records Collection

**Collection ID:** `screening_records`

**Attributes:**
- `patient_id` (String, required)
- `screening_type` (String, required) - Values: 'pap_smear', 'hpv_test', 'biopsy', 'colposcopy'
- `screening_date` (String, required)
- `result` (String, required)
- `cin_stage` (String, optional) - Values: 'normal', 'cin1', 'cin2', 'cin3', 'cancer'
- `notes` (String, optional)
- `document_url` (String, optional)
- `created_by` (String, required)

---

### 9. Diagnoses Collection

**Collection ID:** `diagnoses`

**Attributes:**
- `patient_id` (String, required)
- `diagnosis_date` (String, required)
- `cancer_stage` (String, required)
- `histology_type` (String, optional)
- `tumor_size` (String, optional)
- `lymph_node_involvement` (Boolean, default: false)
- `metastasis` (Boolean, default: false)
- `notes` (String, optional)
- `diagnosed_by` (String, required)

---

### 10. Medications Collection

**Collection ID:** `medications`

**Attributes:**
- `patient_id` (String, required)
- `treatment_id` (String, optional)
- `medication_name` (String, required)
- `dosage` (String, required)
- `frequency` (String, required)
- `start_date` (String, required)
- `end_date` (String, optional)
- `status` (String, default: 'active') - Values: 'active', 'completed', 'discontinued'
- `prescribed_by` (String, required)

---

### 11. Notifications Collection

**Collection ID:** `notifications`

**Attributes:**
- `user_id` (String, required)
- `type` (String, required) - Values: 'appointment', 'medication', 'test_result', 'message', 'reminder'
- `title` (String, required)
- `message` (String, required)
- `is_read` (Boolean, default: false)
- `action_url` (String, optional)

---

### 12. Educational Content Collection

**Collection ID:** `educational_content`

**Attributes:**
- `title` (String, required)
- `category` (String, required) - Values: 'awareness', 'hpv', 'lifestyle', 'post_treatment', 'prevention'
- `content` (String, required)
- `content_type` (String, required) - Values: 'article', 'video', 'infographic'
- `media_url` (String, optional)

---

## Storage Buckets

Create the following storage buckets for file uploads:

1. **medical-documents**
   - ID: `medical-documents`
   - Permissions: Users can upload/view their own documents

2. **profile-images**
   - ID: `profile-images`
   - Permissions: Users can upload their own, all can view

---

## Quick Setup Script

You can use the Appwrite CLI or API to automate collection creation. Here's a basic example using the Appwrite SDK:

```javascript
// This is example code - run in Node.js with Appwrite SDK
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sfo.cloud.appwrite.io/v1')
    .setProject('694e144e003baee5a5ff')
    .setKey('YOUR_API_KEY');

const databases = new Databases(client);

// Create collections programmatically
// See Appwrite documentation for full implementation
```

---

## Next Steps

1. Create all collections listed above in your Appwrite Console
2. Set up appropriate permissions for each collection
3. Test the application with the new Appwrite backend
4. Migrate any existing data from Supabase (if needed)

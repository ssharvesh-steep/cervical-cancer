# Sample User Credentials

After running the seed script (`/api/seed`), you can use these credentials to log in and test the application.

## 🔑 Default Password
**All accounts use the same password:** `password123`

---

## 👨‍⚕️ Doctor Accounts

### Doctor 1
- **Email:** `dr.white@example.com`
- **Password:** `password123`
- **Name:** Dr. Jennifer White
- **Role:** Doctor

### Doctor 2
- **Email:** `dr.harris@example.com`
- **Password:** `password123`
- **Name:** Dr. Richard Harris
- **Role:** Doctor

---

## 👩 Patient Accounts

The seed script creates **50 patient accounts**. Here are some sample patient credentials:

### Patient Accounts (1-10)
- **Email:** `patient.test.1@example.com` → **Password:** `password123`
- **Email:** `patient.test.2@example.com` → **Password:** `password123`
- **Email:** `patient.test.3@example.com` → **Password:** `password123`
- **Email:** `patient.test.4@example.com` → **Password:** `password123`
- **Email:** `patient.test.5@example.com` → **Password:** `password123`
- **Email:** `patient.test.6@example.com` → **Password:** `password123`
- **Email:** `patient.test.7@example.com` → **Password:** `password123`
- **Email:** `patient.test.8@example.com` → **Password:** `password123`
- **Email:** `patient.test.9@example.com` → **Password:** `password123`
- **Email:** `patient.test.10@example.com` → **Password:** `password123`

### All Patient Accounts
All patient accounts follow this pattern:
- **Email Pattern:** `patient.test.{number}@example.com` (where number is 1-50)
- **Password:** `password123`

**Examples:**
- `patient.test.1@example.com` through `patient.test.50@example.com`
- All use password: `password123`

---

## 📋 Sample Patient Details

Each patient account includes:
- **Diverse Names:** Mix of Tamil and English names (e.g., Priya Kumar, Mary Smith, Lakshmi Devi)
- **Phone Numbers:** Indian format (+91-9000000001, +91-9000000002, etc.)
- **Date of Birth:** Random dates (ages 25-65)
- **Blood Group:** Random (O+, O-, A+, A-, B+, B-, AB+, AB-)
- **Emergency Contact:** Name and phone number

---

## 📊 Sample Data Included

When you log in as a patient, you'll see:
- ✅ **Appointments:** Random appointments (70% of patients have appointments)
- ✅ **Symptoms Logs:** Multiple symptom entries (60% of patients have symptoms)
- ✅ **Screening Records:** Screening history (50% of patients have screenings)
- ✅ **Medical Reports:** 1-3 reports per patient (60% of patients have reports)

---

## 🧪 Testing Scenarios

### Test as a Patient:
1. Login with: `patient.test.1@example.com` / `password123`
2. Check Dashboard for appointments and health status
3. View Reports page for medical reports
4. View Symptoms page for symptom logs
5. View Appointments page for scheduled appointments

### Test as a Doctor:
1. Login with: `dr.white@example.com` / `password123`
2. View Patient List to see all patients
3. Click on a patient to view their details
4. View Appointments page for patient appointments
5. Upload medical reports for patients

---

## 🔄 Running the Seed Script

To create these users, visit:
```
http://localhost:3000/api/seed
```

Or use curl:
```bash
curl http://localhost:3000/api/seed
```

**Note:** The seed script will skip creating users if they already exist, so you can run it multiple times safely.

---

## ⚠️ Important Notes

1. **All passwords are the same:** `password123` (change in production!)
2. **Email confirmation is disabled** for testing (users can log in immediately)
3. **Sample data is randomly generated** - names, dates, and other details vary
4. **Reports are database records only** - actual files are not uploaded to storage

---

## 📝 Quick Login Reference

**Doctors:**
- `dr.white@example.com` / `password123`
- `dr.harris@example.com` / `password123`

**Patients (any from 1-50):**
- `patient.test.1@example.com` / `password123`
- `patient.test.25@example.com` / `password123`
- `patient.test.50@example.com` / `password123`

---

**Happy Testing! 🎉**

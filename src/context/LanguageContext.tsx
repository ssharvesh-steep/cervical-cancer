'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ta'

type Dictionary = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

const dictionaries: Record<Language, Dictionary> = {
    en: {
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            save: 'Save',
            cancel: 'Cancel',
            submit: 'Submit',
            view: 'View',
            download: 'Download',
            back: 'Back',
            edit: 'Edit',
            delete: 'Delete',
            logout: 'Sign Out',
            dashboard: 'Dashboard',
            welcome: 'Welcome'
        },
        landing: {
            heroTitle: 'Healthcare Unlocked',
            heroSubtitle: 'Whether you are at work, home, traveling, or with family. We ensure that you have access to screening records, expert doctor consultations, and continuous health monitoring whenever you need it.',
            getStarted: 'Get Started',
            learnMore: 'Learn More',
            nav: {
                overview: 'Overview',
                foundation: 'Foundation',
                solutions: 'Solutions',
                resources: 'Resources',
                publication: 'Publication',
                signIn: 'Sign In',
                signUp: 'Sign Up'
            }
        },
        auth: {
            signInTitle: 'Welcome Back',
            signInSubtitle: 'Sign in to your dashboard',
            createAccount: 'Create Account',
            createAccountSubtitle: 'Join our cervical cancer care platform',
            email: 'Email Address',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            fullName: 'Full Name',
            phone: 'Phone Number',
            role: 'I am a',
            doctor: 'Doctor',
            patient: 'Patient',
            forgotPassword: 'Forgot password?',
            noAccount: 'Don&apos;t have an account?',
            haveAccount: 'Already have an account?',
            errors: {
                passwordsNotMatch: 'Passwords do not match',
                passwordTooShort: 'Password must be at least 6 characters',
                accountCreationFailed: 'Failed to create account',
                signInFailed: 'Failed to sign in',
                emailConfirmationRequired: 'Please check your email to confirm your account before logging in.'
            },
            success: {
                accountCreated: 'Account created successfully!',
                redirecting: 'Redirecting...'
            },
            buttons: {
                signIn: 'Sign In',
                signingIn: 'Signing in...',
                create: 'Create Account',
                creating: 'Creating account...'
            }
        },
        patient: {
            sidebar: {
                dashboard: 'Dashboard',
                overview: 'Overview',
                appointment: 'Appointment',
                report: 'Report',
                symptoms: 'Symptoms',
                message: 'Message',
                blog: 'Blog',
                scanQr: 'Scan QR',
                foodPlan: 'Food Plan',
                profile: 'Profile',
                settings: 'Settings'
            },
            header: {
                searchPlaceholder: 'Search records...',
                patient: 'Patient'
            },
            dashboard: {
                title: 'Patient Dashboard',
                welcome: 'Welcome back',
                nextAppointment: 'Next Appointment',
                recentActivity: 'Recent Activity',
                healthStatus: 'Health Status'
            },
            scan: {
                title: 'Scan QR Code',
                subtitle: 'Scan your test kit QR code to access your records instantly',
                cameraPermission: 'Camera permission is required to scan QR codes',
                startScan: 'Start Scan',
                stopScan: 'Stop Scan',
                uploadImage: 'Upload QR Image',
                processing: 'Analyzing QR Code...'
            },
            food: {
                title: 'Daily Food Plan',
                subtitle: 'Personalized nutrition guide',
                hydration: 'Hydration Tracker',
                todaysMeals: 'Today&apos;s Meals',
                breakfast: 'Breakfast',
                lunch: 'Lunch',
                dinner: 'Dinner',
                snack: 'Snacks'
            },
            symptoms: {
                title: 'Symptom Tracker',
                subtitle: 'Log your daily symptoms',
                logToday: 'Log Today&apos;s Symptoms',
                pain: 'Pain Level',
                fatigue: 'Fatigue Level',
                bleeding: 'Experiencing Abnormal Bleeding?',
                specific: 'Specific Symptoms',
                nausea: 'Nausea',
                vomiting: 'Vomiting',
                fever: 'Fever',
                appetiteLoss: 'Loss of Appetite',
                headache: 'Headache',
                discharge: 'Vaginal Discharge',
                notes: 'Additional Notes',
                history: 'History',
                saveLog: 'Save Log'
            },
            reports: {
                title: 'Medical Reports',
                noReports: 'No medical reports found at this time',
                view: 'View',
                download: 'Download',
                date: 'Date',
                type: 'Type',
                description: 'Description'
            },
            profile: {
                title: 'My Profile',
                subtitle: 'View and manage your personal information',
                personalInfo: 'Personal Information',
                medicalInfo: 'Medical Information',
                emergencyContact: 'Emergency Contact',
                accountSettings: 'Account Settings',
                fullName: 'Full Name',
                email: 'Email',
                phone: 'Phone',
                accountType: 'Account Type',
                dateOfBirth: 'Date of Birth',
                age: 'Age',
                bloodGroup: 'Blood Group',
                maritalStatus: 'Marital Status',
                contactName: 'Contact Name',
                contactPhone: 'Contact Phone',
                editProfile: 'Edit Profile',
                changePassword: 'Change Password',
                years: 'years'
            },
            settings: {
                title: 'Settings',
                subtitle: 'Manage your account settings and preferences',
                profileSettings: 'Profile Settings',
                updatePersonalInfo: 'Update your personal information',
                session: 'Session',
                signOutDescription: 'Sign out of your account on this device',
                editProfile: 'Edit Profile'
            }
        },
        doctor: {
            sidebar: {
                dashboard: 'Dashboard',
                overview: 'Overview',
                appointment: 'Appointment',
                myPatients: 'My Patients',
                message: 'Message',
                blog: 'Blog',
                myQrCode: 'My QR Code',
                settings: 'Settings'
            },
            header: {
                searchPlaceholder: 'Search Appointment, Patient or etc',
                doctor: 'Doctor'
            },
            dashboard: {
                title: 'Doctor Dashboard',
                totalPatients: 'Total Patients',
                pendingReviews: 'Pending Reviews'
            },
            patients: {
                title: 'Patient List',
                addPatient: 'Add Patient',
                search: 'Search patients...',
                table: {
                    name: 'Name',
                    age: 'Age',
                    contact: 'Contact',
                    status: 'Status',
                    actions: 'Actions'
                }
            },
            profile: {
                title: 'My Profile',
                subtitle: 'View and manage your professional information',
                professionalInfo: 'Professional Information',
                accountSettings: 'Account Settings',
                fullName: 'Full Name',
                email: 'Email',
                phone: 'Phone',
                accountType: 'Account Type',
                accountStatus: 'Account Status',
                memberSince: 'Member Since',
                active: 'Active',
                inactive: 'Inactive',
                editProfile: 'Edit Profile',
                changePassword: 'Change Password'
            },
            settings: {
                title: 'Settings',
                subtitle: 'Manage your account settings and preferences',
                profileSettings: 'Profile Settings',
                updatePersonalInfo: 'Update your personal information',
                session: 'Session',
                signOutDescription: 'Sign out of your account on this device',
                editProfile: 'Edit Profile'
            }
        },
        admin: {
            sidebar: {
                dashboard: 'Dashboard',
                users: 'User Management',
                settings: 'Settings'
            },
            header: {
                admin: 'Administrator'
            },
            dashboard: {
                title: 'Admin Dashboard',
                welcome: 'Welcome back, Admin',
                totalUsers: 'Total Users',
                activeUsers: 'Active Users',
                newUsers: 'New Users Today'
            },
            users: {
                title: 'User Management',
                search: 'Search users...',
                table: {
                    name: 'Name',
                    email: 'Email',
                    role: 'Role',
                    joined: 'Joined',
                    status: 'Status',
                    actions: 'Actions'
                },
                roles: {
                    admin: 'Admin',
                    doctor: 'Doctor',
                    patient: 'Patient'
                },
                actions: {
                    edit: 'Edit',
                    delete: 'Delete',
                    changeRole: 'Change Role'
                }
            }
        }
    },
    ta: {
        common: {
            loading: 'ஏற்றுகிறது...',
            error: 'பிழை ஏற்பட்டது',
            save: 'சேமி',
            cancel: 'ரத்துசெய்',
            submit: 'சமர்ப்பி',
            view: 'பார்வை',
            download: 'பதிவிறக்கம்',
            back: 'திரும்ப',
            edit: 'திருத்து',
            delete: 'அழி',
            logout: 'வெளியேறு',
            dashboard: 'முகப்புப் பக்கம்',
            welcome: 'நல்வரவு'
        },
        landing: {
            heroTitle: 'சுகாதாரம் உங்கள் கையில்',
            heroSubtitle: 'நீங்கள் வேலையில், வீட்டில், பயணத்தில் அல்லது குடும்பத்தினருடன் இருந்தாலும். உங்கள் பரிசோதனை பதிவுகள், மருத்துவ ஆலோசனைகள் மற்றும் தொடர் கண்காணிப்பு உங்களுக்குத் தேவைப்படும்போதெல்லாம் கிடைப்பதை நாங்கள் உறுதி செய்கிறோம்.',
            getStarted: 'தொடங்கவும்',
            learnMore: 'மேலும் அறிய',
            nav: {
                overview: 'கண்ணோட்டம்',
                foundation: 'அறக்கட்டளை',
                solutions: 'தீர்வுகள்',
                resources: 'வளங்கள்',
                publication: 'வெளியீடுகள்',
                signIn: 'உள்நுழைய',
                signUp: 'பதிவு செய்ய'
            }
        },
        auth: {
            signInTitle: 'மீண்டும் நல்வரவு',
            signInSubtitle: 'உங்கள் கணக்கில் உள்நுழையவும்',
            createAccount: 'கணக்கை உருவாக்கவும்',
            createAccountSubtitle: 'கர்ப்பப்பை வாய் புற்றுநோய் பராமரிப்பு தளத்தில் இணையுங்கள்',
            email: 'மின்னஞ்சல் முகவரி',
            password: 'கடவுச்சொல்',
            confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
            fullName: 'முழு பெயர்',
            phone: 'தொலைபேசி எண்',
            role: 'நான் ஒரு',
            doctor: 'மருத்துவர்',
            patient: 'நோயாளி',
            forgotPassword: 'கடவுச்சொல்லை மறந்தீர்களா?',
            noAccount: 'கணக்கு இல்லையா?',
            haveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
            errors: {
                passwordsNotMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
                passwordTooShort: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்',
                accountCreationFailed: 'கணக்கை உருவாக்க முடியவில்லை',
                signInFailed: 'உள்நுழைய முடியவில்லை',
                emailConfirmationRequired: 'உள்நுழைவதற்கு முன் உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்.'
            },
            success: {
                accountCreated: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!',
                redirecting: 'திருப்பி அனுப்புகிறது...'
            },
            buttons: {
                signIn: 'உள்நுழைய',
                signingIn: 'உள்நுழைகிறது...',
                create: 'கணக்கை உருவாக்கு',
                creating: 'உருவாக்குகிறது...'
            }
        },
        patient: {
            sidebar: {
                dashboard: 'முகப்பு',
                overview: 'கண்ணோட்டம்',
                appointment: 'சந்திப்பு',
                report: 'அறிக்கை',
                symptoms: 'அறிகுறிகள்',
                message: 'செய்தி',
                blog: 'வலைப்பதிவு',
                scanQr: 'QR ஸ்கேன்',
                foodPlan: 'உணவு திட்டம்',
                profile: 'சுயவிவரம்',
                settings: 'அமைப்புகள்'
            },
            header: {
                searchPlaceholder: 'பதிவுகளைத் தேடு...',
                patient: 'நோயாளி'
            },
            dashboard: {
                title: 'நோயாளி முகப்பு',
                welcome: 'மீண்டும் நல்வரவு',
                nextAppointment: 'அடுத்த சந்திப்பு',
                recentActivity: 'சமீபத்திய செயல்பாடுகள்',
                healthStatus: 'சுகாதார நிலை'
            },
            scan: {
                title: 'QR ஸ்கேன்',
                subtitle: 'உங்கள் பதிவுகளை அணுக QR குறியீட்டை ஸ்கேன் செய்யவும்',
                cameraPermission: 'ஸ்கேன் செய்ய கேமரா அனுமதி தேவை',
                startScan: 'ஸ்கேன் செய்',
                stopScan: 'நிறுத்து',
                uploadImage: 'QR படத்தை பதிவேற்று',
                processing: 'ஆய்வு செய்கிறது...'
            },
            food: {
                title: 'தினசரி உணவு திட்டம்',
                subtitle: 'தனிப்பயனாக்கப்பட்ட ஊட்டச்சத்து வழிகாட்டி',
                hydration: 'நீர் அருந்துதல்',
                todaysMeals: 'இன்றைய உணவுகள்',
                breakfast: 'காலை உணவு',
                lunch: 'மதிய உணவு',
                dinner: 'இரவு உணவு',
                snack: 'சிற்றுண்டி'
            },
            symptoms: {
                title: 'அறிகுறி பதிவேடு',
                subtitle: 'தினசரி அறிகுறிகளை பதிவு செய்யுங்கள்',
                logToday: 'இன்றைய அறிகுறிகள்',
                pain: 'வலி அளவு',
                fatigue: 'சோர்வு அளவு',
                bleeding: 'அசாதாரண இரத்தப்போக்கு உள்ளதா?',
                specific: 'குறிப்பிட்ட அறிகுறிகள்',
                nausea: 'குமட்டல்',
                vomiting: 'வாந்தி',
                fever: 'காய்ச்சல்',
                appetiteLoss: 'பசியின்மை',
                headache: 'தலைவலி',
                discharge: 'யோனி வெளியேற்றம்',
                notes: 'கூடுதல் குறிப்புகள்',
                history: 'வரலாறு',
                saveLog: 'சேமி'
            },
            reports: {
                title: 'மருத்துவ அறிக்கைகள்',
                noReports: 'தற்போது அறிக்கைகள் எதுவும் இல்லை',
                view: 'பார்வை',
                download: 'பதிவிறக்கம்',
                date: 'தேதி',
                type: 'வகை',
                description: 'விளக்கம்'
            },
            profile: {
                title: 'எனது சுயவிவரம்',
                subtitle: 'உங்கள் தனிப்பட்ட தகவல்களைப் பார்க்கவும் நிர்வகிக்கவும்',
                personalInfo: 'தனிப்பட்ட தகவல்',
                medicalInfo: 'மருத்துவ தகவல்',
                emergencyContact: 'அவசரத் தொடர்பு',
                accountSettings: 'கணக்கு அமைப்புகள்',
                fullName: 'முழு பெயர்',
                email: 'மின்னஞ்சல்',
                phone: 'தொலைபேசி',
                accountType: 'கணக்கு வகை',
                dateOfBirth: 'பிறந்த தேதி',
                age: 'வயது',
                bloodGroup: 'இரத்த வகை',
                maritalStatus: 'திருமண நிலை',
                contactName: 'தொடர்பு பெயர்',
                contactPhone: 'தொடர்பு தொலைபேசி',
                editProfile: 'சுயவிவரத்தைத் திருத்து',
                changePassword: 'கடவுச்சொல்லை மாற்று',
                years: 'வயது'
            },
            settings: {
                title: 'அமைப்புகள்',
                subtitle: 'உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்',
                profileSettings: 'சுயவிவர அமைப்புகள்',
                updatePersonalInfo: 'உங்கள் தனிப்பட்ட தகவல்களைப் புதுப்பிக்கவும்',
                session: 'அமர்வு',
                signOutDescription: 'இந்த சாதனத்தில் உங்கள் கணக்கிலிருந்து வெளியேறு',
                editProfile: 'சுயவிவரத்தைத் திருத்து'
            }
        },
        doctor: {
            sidebar: {
                dashboard: 'முகப்பு',
                overview: 'கண்ணோட்டம்',
                appointment: 'சந்திப்பு',
                myPatients: 'எனது நோயாளிகள்',
                message: 'செய்தி',
                blog: 'வலைப்பதிவு',
                myQrCode: 'எனது QR குறியீடு',
                settings: 'அமைப்புகள்'
            },
            header: {
                searchPlaceholder: 'சந்திப்பு, நோயாளி அல்லது பிறவற்றைத் தேடு',
                doctor: 'மருத்துவர்'
            },
            dashboard: {
                title: 'மருத்துவர் முகப்பு',
                totalPatients: 'மொத்த நோயாளிகள்',
                pendingReviews: 'நிலுவையில் உள்ளவை'
            },
            patients: {
                title: 'நோயாளிகள் பட்டியல்',
                addPatient: 'நோயாளியைச் சேர்',
                search: 'தேடு...',
                table: {
                    name: 'பெயர்',
                    age: 'வயது',
                    contact: 'தொடர்பு',
                    status: 'நிலை',
                    actions: 'செயல்கள்'
                }
            },
            profile: {
                title: 'எனது சுயவிவரம்',
                subtitle: 'உங்கள் தொழில்முறை தகவல்களைப் பார்க்கவும் நிர்வகிக்கவும்',
                professionalInfo: 'தொழில்முறை தகவல்',
                accountSettings: 'கணக்கு அமைப்புகள்',
                fullName: 'முழு பெயர்',
                email: 'மின்னஞ்சல்',
                phone: 'தொலைபேசி',
                accountType: 'கணக்கு வகை',
                accountStatus: 'கணக்கு நிலை',
                memberSince: 'உறுப்பினர் முதல்',
                active: 'செயலில்',
                inactive: 'செயலற்ற',
                editProfile: 'சுயவிவரத்தைத் திருத்து',
                changePassword: 'கடவுச்சொல்லை மாற்று'
            },
            settings: {
                title: 'அமைப்புகள்',
                subtitle: 'உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்',
                profileSettings: 'சுயவிவர அமைப்புகள்',
                updatePersonalInfo: 'உங்கள் தனிப்பட்ட தகவல்களைப் புதுப்பிக்கவும்',
                session: 'அமர்வு',
                signOutDescription: 'இந்த சாதனத்தில் உங்கள் கணக்கிலிருந்து வெளியேறு',
                editProfile: 'சுயவிவரத்தைத் திருத்து'
            }
        }
    }
}

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (path: string) => string
    dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    useEffect(() => {
        const savedLang = localStorage.getItem('app-language') as Language
        if (savedLang && (savedLang === 'en' || savedLang === 'ta') && savedLang !== language) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLanguage(savedLang)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('app-language', lang)
    }

    const t = (path: string): string => {
        const keys = path.split('.')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = dictionaries[language]

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`)
                return path // Fallback to key
            }
            current = current[key]
        }

        return current as string
    }

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage: handleSetLanguage,
            t,
            dir: 'ltr' // Tamil is also LTR
        }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

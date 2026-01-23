'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { language, setLanguage } = useLanguage()

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${language === 'ta'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${className}`}
            title="Switch Language"
        >
            <Globe size={16} />
            <span className="text-sm font-medium">
                {language === 'en' ? 'English' : 'தமிழ்'}
            </span>
        </button>
    )
}

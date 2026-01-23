'use client'

import React, { useState } from 'react'
import styles from './food-plan.module.css'
import {
    Utensils,
    Coffee,
    Sun,
    Moon,
    Droplets,
    Info,
    CheckCircle2,
    AlertCircle,
    Apple
} from 'lucide-react'

export default function FoodPlanPage() {
    const [waterIntake, setWaterIntake] = useState(4) // Mock initial state associated with user

    const handleGlassClick = (index: number) => {
        setWaterIntake(index + 1)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Daily Food Plan</h1>
            <p className={styles.subtitle}>
                Personalized nutrition guide to support your immunity and recovery.
                <br />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                    *This is a general recommendation. Please consult your oncologist for specific dietary needs.
                </span>
            </p>

            <div className={styles.grid}>
                {/* Left Column: Daily Plan */}
                <div>
                    <div className={styles.sectionTitle}>
                        <Utensils size={20} />
                        <h3>Today&apos;s Meals</h3>
                    </div>

                    <div className={styles.mealsGrid}>
                        {/* Breakfast */}
                        <div className={styles.mealCard}>
                            <div className={styles.mealTime}>
                                <Coffee size={24} />
                                <span>8:00 AM</span>
                            </div>
                            <div className={styles.mealContent}>
                                <div className={styles.mealName}>Oatmeal with Berries & Nuts</div>
                                <div className={styles.mealDesc}>
                                    Warm oatmeal topped with blueberries, walnuts, and a drizzle of honey.
                                    Rich in antioxidants and fiber.
                                </div>
                                <div className={styles.tags}>
                                    <span className={styles.tag}>High Fiber</span>
                                    <span className={styles.tag}>Antioxidants</span>
                                </div>
                            </div>
                        </div>

                        {/* Lunch */}
                        <div className={styles.mealCard}>
                            <div className={styles.mealTime}>
                                <Sun size={24} />
                                <span>1:00 PM</span>
                            </div>
                            <div className={styles.mealContent}>
                                <div className={styles.mealName}>Grilled Salmon & Quinoa Salad</div>
                                <div className={styles.mealDesc}>
                                    Omega-3 rich salmon with mixed greens, quinoa, cherry tomatoes, and lemon olive oil dressing.
                                </div>
                                <div className={styles.tags}>
                                    <span className={styles.tag}>High Protein</span>
                                    <span className={styles.tag}>Omega-3</span>
                                </div>
                            </div>
                        </div>

                        {/* Snack */}
                        <div className={styles.mealCard}>
                            <div className={styles.mealTime}>
                                <Apple size={24} />
                                <span>4:00 PM</span>
                            </div>
                            <div className={styles.mealContent}>
                                <div className={styles.mealName}>Greek Yogurt & Turmeric Tea</div>
                                <div className={styles.mealDesc}>
                                    Probiotic-rich yogurt and a cup of warm turmeric tea for inflammation reduction.
                                </div>
                                <div className={styles.tags}>
                                    <span className={styles.tag}>Probiotics</span>
                                    <span className={styles.tag}>Anti-inflammatory</span>
                                </div>
                            </div>
                        </div>

                        {/* Dinner */}
                        <div className={styles.mealCard}>
                            <div className={styles.mealTime}>
                                <Moon size={24} />
                                <span>7:30 PM</span>
                            </div>
                            <div className={styles.mealContent}>
                                <div className={styles.mealName}>Lentil Stew with Spinach</div>
                                <div className={styles.mealDesc}>
                                    Hearty vegetable and lentil stew containing iron-rich spinach and carrots.
                                    Easy to digest.
                                </div>
                                <div className={styles.tags}>
                                    <span className={styles.tag}>Iron Rich</span>
                                    <span className={styles.tag}>Vegetarian</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Nutrition Info & Hydration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

                    {/* Hydration Card */}
                    <div className={`${styles.mealCard} ${styles.nutritionCard}`}>
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Droplets size={20} />
                                    <span style={{ fontWeight: 'bold' }}>Hydration Tracker</span>
                                </div>
                                <span>{waterIntake}/8 Glasses</span>
                            </div>

                            <div className={styles.hydrationTracker}>
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.glass} ${i < waterIntake ? styles.filled : ''}`}
                                        onClick={() => handleGlassClick(i)}
                                        title={`Glass ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
                                Staying hydrated helps flush toxins and maintains energy levels.
                            </p>
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className={styles.mealCard} style={{ flexDirection: 'column', gap: '0' }}>
                        <div className={styles.sectionTitle} style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                            <Info size={20} />
                            <span>Dietary Guidelines</span>
                        </div>

                        <ul className={styles.tipList}>
                            <li className={styles.tipItem}>
                                <CheckCircle2 className={styles.tipIcon} size={18} />
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Focus on Plant-Based</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Include plenty of fruits, vegetables, beans, and whole grains.</div>
                                </div>
                            </li>
                            <li className={styles.tipItem}>
                                <CheckCircle2 className={styles.tipIcon} size={18} />
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Lean Proteins</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Choose fish, poultry, eggs, and plant proteins over red meat.</div>
                                </div>
                            </li>
                            <li className={styles.tipItem}>
                                <AlertCircle style={{ color: 'var(--color-warning)' }} size={18} />
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Limit Processed Foods</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Avoid sugary drinks, processed meats, and excessive salt.</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

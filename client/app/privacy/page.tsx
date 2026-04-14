'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container antialiased flex flex-col min-h-screen">
            <PublicHeader />

            <main className="min-h-screen pb-24 flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 px-8 max-w-[1280px] mx-auto overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col gap-2 mb-4">
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Compliance & Legal</span>
                            <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-tight text-on-surface max-w-[768px]">Privacy Policy</h1>
                        </div>
                        <div className="flex items-center gap-6 mt-8 text-on-surface-variant">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                <span className="text-sm font-medium">Last updated: May 24, 2024</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                <span className="text-sm font-medium">12 min read</span>
                            </div>
                        </div>
                    </div>
                    {/* Abstract Background Element */}
                    <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
                </section>

                {/* Content Grid */}
                <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
                    {/* Sticky Table of Contents */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Navigation</h3>
                                <nav className="flex flex-col space-y-4">
                                    <a className="text-primary font-semibold border-l-2 border-primary pl-4 py-1 transition-all" href="#introduction">Introduction</a>
                                    <a className="text-on-surface-variant hove:text-primary pl-4 py-1 border-l-2 border-transparent transition-all" href="#data-collection">Data Collection</a>
                                    <a className="text-on-surface-variant hover:text-primary pl-4 py-1 border-l-2 border-transparent transition-all" href="#usage">How We Use Data</a>
                                    <a className="text-on-surface-variant hover:text-primary pl-4 py-1 border-l-2 border-transparent transition-all" href="#rights">Your Rights</a>
                                    <a className="text-on-surface-variant hover:text-primary pl-4 py-1 border-l-2 border-transparent transition-all" href="#security">Security Practices</a>
                                    <a className="text-on-surface-variant hover:text-primary pl-4 py-1 border-l-2 border-transparent transition-all" href="#contact">Contact Us</a>
                                </nav>
                            </div>
                            <div className="p-6 bg-surface-container-low rounded-xl">
                                <p className="text-xs leading-relaxed text-on-surface-variant">
                                    Have questions regarding your personal data? Our data protection team is ready to assist.
                                </p>
                                <a className="inline-block mt-4 text-sm font-bold text-primary hover:underline" href="mailto:privacy@careercurator.com">privacy@careercurator.com</a>
                            </div>
                        </div>
                    </aside>

                    {/* Document Body */}
                    <article className="space-y-20 max-w-[768px]">
                        <section className="scroll-mt-32" id="introduction">
                            <h2 className="text-[1.75rem] font-semibold text-on-surface mb-6">1. Introduction</h2>
                            <div className="space-y-4 text-[1rem] leading-relaxed text-on-surface-variant">
                                <p>At CareerCurator, we believe that professionalism is rooted in trust. This Privacy Policy describes how we collect, use, and handle your personal information when you use our editorial platform, website, and services.</p>
                                <p>Our commitment to "Precision in Professionalism" extends to our data handling practices. We aim to be transparent about the data we collect and why we collect it, ensuring you remain in control of your digital identity.</p>
                            </div>
                        </section>

                        <section className="scroll-mt-32 p-10 bg-surface-container-low rounded-2xl" id="data-collection">
                            <h2 className="text-[1.75rem] font-semibold text-on-surface mb-6">2. Data Collection</h2>
                            <p className="text-on-surface-variant mb-8 leading-relaxed">To provide our curated career services, we collect information that falls into three primary categories:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
                                    <span className="material-symbols-outlined text-primary mb-4">person_search</span>
                                    <h4 className="font-semibold text-on-surface mb-2">Directly Provided</h4>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">Name, contact details, resume data, and professional profiles you upload to our platform per REG-002.</p>
                                </div>
                                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
                                    <span className="material-symbols-outlined text-primary mb-4">analytics</span>
                                    <h4 className="font-semibold text-on-surface mb-2">Automatically Collected</h4>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">Log files, device identifiers, and interaction data via cookies and similar technologies.</p>
                                </div>
                            </div>
                            <div className="mt-8 p-6 border border-outline-variant/20 rounded-lg bg-surface/50">
                                <p className="text-sm font-medium text-on-surface italic">"We do not sell your personal data to third-party advertisers. Your information is used strictly to facilitate the professional matching process."</p>
                            </div>
                        </section>

                        <section className="scroll-mt-32" id="usage">
                            <h2 className="text-[1.75rem] font-semibold text-on-surface mb-6">3. How We Use Data</h2>
                            <div className="space-y-4 text-on-surface-variant leading-relaxed">
                                <p>Data orchestration is vital to our editorial mission. We use your information to:</p>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                        <div>
                                            <strong className="text-on-surface block">Curate Professional Matches</strong>
                                            <span className="text-sm">Aligning your unique skill sets with high-end editorial job listings.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                        <div>
                                            <strong className="text-on-surface block">Personalize Experience</strong>
                                            <span className="text-sm">Tailoring the interface and insights to match your career trajectory.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="scroll-mt-32" id="rights">
                            <h2 className="text-[1.75rem] font-semibold text-on-surface mb-6">4. Your Rights</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.02)] group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                                            <span className="material-symbols-outlined">key</span>
                                        </div>
                                        <span className="font-medium">Right to Access and Portability (REG-004)</span>
                                    </div>
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.02)] group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-error/5 flex items-center justify-center text-error font-bold">
                                            <span className="material-symbols-outlined">delete</span>
                                        </div>
                                        <span className="font-medium">Right to Erasure (REG-004)</span>
                                    </div>
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                                </div>
                            </div>
                        </section>

                        <section className="scroll-mt-32" id="security">
                            <div className="relative overflow-hidden p-10 bg-slate-900 rounded-2xl text-white">
                                <h2 className="text-[1.75rem] font-semibold mb-6 relative z-10">5. Security Practices</h2>
                                <p className="text-slate-400 mb-8 leading-relaxed relative z-10">Security is not a feature; it's our foundation (NFR-SEC-006). We employ industry-leading protocols to safeguard your data at rest and in transit.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-2">
                                        <h4 className="text-primary font-bold uppercase tracking-wider text-xs">Encryption</h4>
                                        <p className="text-sm text-slate-300">All sensitive data is encrypted using AES-256 standards with rotating keys managed through secure hardware modules (NFR-SEC-002).</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-primary font-bold uppercase tracking-wider text-xs">Access Control</h4>
                                        <p className="text-sm text-slate-300">Strict least-privilege access models and mandatory multi-factor authentication for all internal administrative systems.</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <span className="material-symbols-outlined !text-[120px] text-fill">verified_user</span>
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

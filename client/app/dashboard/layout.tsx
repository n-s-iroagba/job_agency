'use client';

import React from 'react';
import { ApplicantSidebar } from '@/components/layout/ApplicantSidebar';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-surface">
            <ApplicantSidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <header className="sticky top-0 z-30 h-16 bg-white/70 backdrop-blur-xl flex items-center justify-between px-10 border-b border-slate-100/50">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Applicant Console</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-container transition-colors">
                            Search New Jobs
                        </button>
                    </div>
                </header>
                <main className="p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { ApplicantSidebar } from '@/components/layout/ApplicantSidebar';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white overflow-x-hidden font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-[60]">
                <h1 className="text-slate-900 font-bold tracking-tight text-lg">JobNexa</h1>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-10 h-10 flex items-center justify-center text-slate-900"
                >
                    <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Sidebar with mobile overlay */}
            <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
            
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ApplicantSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 transition-all duration-300 min-w-0 pt-16 lg:pt-0 lg:ml-64">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 lg:py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}

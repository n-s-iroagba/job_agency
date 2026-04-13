'use client';

import React from 'react';
import { ApplicantSidebar } from '@/components/layout/ApplicantSidebar';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background">
            <ApplicantSidebar />
            <main className="flex-1 ml-60 p-lg max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}

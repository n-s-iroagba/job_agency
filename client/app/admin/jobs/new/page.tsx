'use client';

import Link from 'next/link';
import JobForm from '@/components/admin/forms/JobForm';

export default function JobListingNewPage() {
    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator Admin</span>
                </div>
            </header>

            <main className="flex-1 p-8 md:p-12 max-w-[1152px] mx-auto w-full">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 max-w-[672px]">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20">Post Management</span>
                        <h1 className="text-[3.5rem] font-black text-on-surface tracking-tighter leading-none italic uppercase">Create<span className="text-primary"> Listing</span></h1>
                        <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Establish a new opportunity in the curator ecosystem.</p>
                    </div>
                </div>

                <JobForm />
            </main>
        </div>
    );
}

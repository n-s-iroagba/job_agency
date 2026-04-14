'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import JobForm from '@/components/admin/forms/JobForm';
import Link from 'next/link';

export default function JobEditPage() {
    const params = useParams();
    const id = params?.id;
    const { data: job, isLoading, error } = useApiQuery<any>(['admin', 'jobs'], `/admin/jobs/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Listing Narrative...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Job</div>;

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
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20">Post Refinement</span>
                        <h1 className="text-[3.5rem] font-black text-on-surface tracking-tighter leading-none italic uppercase text-slate-900">Edit <span className="text-primary">Listing</span></h1>
                        <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Refine the narrative for {job?.title}.</p>
                    </div>
                </div>

                <JobForm initialData={job} isEdit={true} />
            </main>
        </div>
    );
}

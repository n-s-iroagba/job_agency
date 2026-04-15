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
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Standard Admin Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/admin/jobs" className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>

                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold border border-slate-200 uppercase tracking-widest italic">
                        JOBID-{id}
                    </span>
                </div>
            </header>

            <main className="p-6 md:p-10 max-w-5xl mx-auto w-full">
                <div className="mb-8">

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Update <span className="text-blue-600">{job?.title}</span></h2>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-200 shadow-sm">
                    <JobForm initialData={job} isEdit={true} />
                </div>
            </main>
        </div>
    );
}

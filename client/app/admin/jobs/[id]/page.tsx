'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { Job } from '@/types/models';

export default function JobViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: job, isLoading, error } = useApiQuery<Job>(`/admin/jobs/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Contextualizing Opportunity...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Listing</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface pb-16 overflow-x-hidden">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator Admin</span>
                </div>
                <div className="flex gap-4">
                    <Link href={`/admin/jobs/${id}/stages`}>
                        <button className="px-6 py-2 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">account_tree</span> Pipeline Stages
                        </button>
                    </Link>
                    <Link href={`/admin/jobs/${id}/edit`}>
                        <button className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">edit</span> Edit Narrative
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 p-8 md:p-12 max-w-[1152px] mx-auto w-full">
                <Link href="/admin/jobs" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 w-fit">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Marketplace</span>
                </Link>

                <div className="mb-12">
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase text-slate-900">{job?.title}</h1>
                    <div className="flex flex-wrap gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-200">
                            {job?.JobCategory?.name}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                            {job?.employmentType}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                            {job?.location}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 underline decoration-primary decoration-2 underline-offset-4">Mission Statement & Description</h3>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{job?.description}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 decoration-blue-400 decoration-2 underline underline-offset-4">Candidate Requirements</h3>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-base font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">{job?.requirements}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/50 shadow-inner">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-[16px]">analytics</span> Statistics
                            </h3>
                            <div className="space-y-6">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applications</p>
                                    <p className="text-2xl font-black text-slate-900">24 <span className="text-[10px] text-slate-400">Total</span></p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${job?.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                        <p className="text-sm font-black uppercase tracking-widest text-slate-700">{job?.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

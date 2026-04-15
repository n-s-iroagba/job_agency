'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';


export default function JobViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: job, isLoading, error } = useApiQuery<any>(['admin', 'jobs', `${id}`], `/admin/jobs/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Contextualizing Opportunity...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Listing</div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Standard Admin Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/admin/jobs" className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Listing Review</h1>
                </div>


            </header>

            <main className="p-6 md:p-10 max-w-6xl mx-auto w-full">

                <div className=" gap-2 sm:gap-3">
                    <Link href={`/admin/jobs/${id}/stages`}>
                        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-lg transition-all border border-slate-200">
                            <span className="material-symbols-outlined text-lg">account_tree</span>
                            Stages
                        </button>
                    </Link>
                    <Link href={`/admin/jobs/${id}/edit`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            <span className="hidden sm:inline">Modify</span>
                        </button>
                    </Link>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-4">{job?.title}</h2>

                <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-blue-100">
                        {job?.JobCategory?.name || 'Uncategorized'}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200">
                        {job?.employmentType}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {job?.location}
                    </span>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Core Mission */}
                        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6 pb-4 border-b border-slate-50">
                                <span className="material-symbols-outlined text-lg">description</span>
                                Role Narrative
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap italic">
                                    {job?.description}
                                </p>
                            </div>
                        </div>

                        {/* Skill Requirements */}
                        <div className="bg-slate-900 text-white p-8 rounded-xl border border-slate-800 shadow-lg">
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-6 pb-4 border-b border-slate-800">
                                <span className="material-symbols-outlined text-lg">verified</span>
                                Pre-requisite Skillset
                            </div>
                            <div className="text-sm font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {job?.requirements}
                            </div>
                        </div>

                        {/* Provisions & Compliance (Dynamic) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">redeem</span>
                                    Active Benefits
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {job?.JobBenefits?.length > 0 ? (
                                        job.JobBenefits.map((b: any) => (
                                            <span key={b.id} className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100 uppercase tracking-tighter">
                                                {b.benefitType}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No specific incentives configured.</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">policy</span>
                                    Active Conditions
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {job?.JobConditions?.length > 0 ? (
                                        job.JobConditions.map((c: any) => (
                                            <span key={c.id} className="text-[10px] font-bold bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100 uppercase tracking-tighter">
                                                {c.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No specific conditions configured.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-slate-600">dataset</span>
                                Registry Trace
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Internal ID</span>
                                    <span className="text-[11px] font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">JOB-{id}</span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
                                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${job?.isActive ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${job?.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        {job?.isActive ? 'Active' : 'Archived'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pipeline Nodes</span>
                                    <span className="text-[11px] font-bold text-slate-900">{job?.JobStages?.length || 0} stages</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-lg italic">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 text-center">Governance Audit</p>
                            <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Created: {new Date(job?.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(job?.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

interface Application {
    id: number;
    status: string;
    completionPercentage: number;
    updatedAt: string;
    JobListing: { title: string };
}

interface ApplicationsResponse {
    rows: Application[];
    count: number;
}

export default function ApplicationsListPage() {
    const { data, isLoading } = useApiQuery<ApplicationsResponse>(
        ['applications', 'list'],
        '/applications'
    );

    const activeCount = data?.rows.filter(a => a.status === 'Active').length || 0;
    const completedCount = data?.rows.filter(a => a.status === 'Completed').length || 0;

    return (
        <div className="space-y-10 selection:bg-primary-container selection:text-on-primary-container">
            {/* Header Section */}
            <header>
                <h1 className="text-[3.5rem] font-bold leading-none tracking-tight text-on-surface mb-4">Application Hub</h1>
                <p className="text-lg text-on-surface-variant max-w-[672px] leading-relaxed">
                    Manage your professional journey. Track active submissions, resume drafts, and completed interview cycles in one curated space.
                </p>
            </header>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2 border border-slate-50">
                    <span className="text-outline uppercase tracking-widest font-bold text-[0.65rem]">Active Paths</span>
                    <span className="text-3xl font-bold text-primary">{String(activeCount).padStart(2, '0')}</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2 border border-slate-50">
                    <span className="text-outline uppercase tracking-widest font-bold text-[0.65rem]">In Review</span>
                    <span className="text-3xl font-bold text-secondary">02</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2 border-l-4 border-primary border-y border-r border-slate-50">
                    <span className="text-outline uppercase tracking-widest font-bold text-[0.65rem]">Actions Req.</span>
                    <span className="text-3xl font-bold text-primary">01</span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-2 border border-slate-50">
                    <span className="text-outline uppercase tracking-widest font-bold text-[0.65rem]">Success Rate</span>
                    <span className="text-3xl font-bold text-on-surface">82%</span>
                </div>
            </div>

            {/* Application List Section */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-xl font-bold text-on-surface">Recent Submissions</h2>
                    <div className="flex gap-2 bg-surface-container-low p-1 rounded-full">
                        <button className="bg-white px-6 py-1.5 rounded-full text-xs font-bold text-on-surface shadow-sm">All</button>
                        <button className="px-6 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Active</button>
                        <button className="px-6 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Completed</button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-2xl" />)}
                    </div>
                ) : data?.rows.length === 0 ? (
                    <div className="bg-surface-container-low p-24 text-center rounded-2xl border-2 border-dashed border-slate-200">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">folder_open</span>
                        <p className="text-on-surface-variant italic">No applications found in your hub.</p>
                        <Link href={CONSTANTS.ROUTES.JOBS} className="text-primary font-bold hover:underline mt-4 inline-block tracking-widest text-xs uppercase">Start applying now →</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data?.rows.map((app) => (
                            <div key={app.id} className="group bg-surface-container-lowest p-8 rounded-2xl flex flex-col md:flex-row md:items-center gap-8 shadow-sm hover:shadow-xl transition-all border border-slate-100/50">
                                <div className="flex-shrink-0">
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${app.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-3xl font-bold">
                                            {app.status === 'Active' ? 'architecture' : 'verified'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                                                app.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-slate-100 text-slate-500'
                                            }`}>
                                            {app.status}
                                        </span>
                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">• Updated {new Date(app.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{app.JobListing.title}</h3>
                                    <p className="text-on-surface-variant text-sm mb-4">Global Recruitment Console • Remote Opportunity</p>
                                    <div className="max-w-[320px]">
                                        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                                            <span>Progress Status</span>
                                            <span>{app.completionPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${app.status === 'Active' ? 'bg-primary' : 'bg-green-500'}`}
                                                style={{ width: `${app.completionPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3 min-w-[160px] md:border-l border-slate-100 md:pl-8">
                                    <Link
                                        href={`${CONSTANTS.ROUTES.APPLICATIONS}/${app.id}`}
                                        className="w-full bg-slate-900 text-white py-3 rounded-lg text-xs font-bold text-center shadow-lg hover:bg-primary transition-all active:scale-95 uppercase tracking-widest"
                                    >
                                        View Details
                                    </Link>
                                    <button className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-error transition-colors py-2">
                                        Withdraw Application
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

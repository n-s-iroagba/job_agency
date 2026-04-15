'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardSummary {
    pendingStages: Array<{
        applicationId: number;
        jobTitle: string;
        stageId: number;
        completionPercentage: number;
    }>;
    unpaidPayments: Array<{
        id: number;
        amount: number;
        Application?: { JobListing?: { title: string } };
    }>;
    activeJobs: any[];
    applicationCount: number;
}

export default function DashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data: summary, isLoading: isSummaryLoading } = useApiQuery<DashboardSummary>(
        ['dashboard', 'summary'],
        '/dashboard'
    );

    const isLoading = isAuthLoading || isSummaryLoading;

    if (isLoading) return (
        <div className="space-y-10 animate-pulse">
            <div className="h-48 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
            </div>
        </div>
    );

    if (!user) return null; // AuthContext handles redirect

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col justify-center">
                    <h3 className="text-5xl font-bold tracking-tight text-on-surface mb-4">
                        Welcome back, {(user.fullName || 'Applicant').split(' ')[0]}!
                    </h3>
                    <p className="text-on-surface-variant text-lg max-w-[448px] leading-relaxed">
                        Your professional journey is gaining momentum. You have {summary?.applicationCount || 0} active applications in the pipeline.
                    </p>
                </div>
                {/* Curator Spotlight Widget */}
                <div className="bg-primary text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xl shadow-primary/20">
                    <div className="z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 italic">Curator Recommendation</span>
                        <h4 className="text-xl font-bold mt-2">Ready for Next Step?</h4>
                        <p className="text-sm opacity-90 mt-2">Your Profile Review for {summary?.pendingStages[0]?.jobTitle || 'active roles'} is nearly complete.</p>
                    </div>
                    <div className="z-10 mt-4">
                        <Link href={CONSTANTS.ROUTES.APPLICATIONS} className="text-sm font-bold flex items-center gap-1 group">
                            Check Status <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Summary Widgets - Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm shadow-slate-200/50 flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-secondary-container/30 flex items-center justify-center rounded-lg text-primary">
                        <span className="material-symbols-outlined text-fill">pending_actions</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-on-surface">{summary?.pendingStages.length || 0}</p>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Stages</p>
                    </div>
                </div>
                <Link href={CONSTANTS.ROUTES.APPLICATIONS} className="bg-surface-container-lowest p-6 rounded-lg shadow-sm shadow-slate-200/50 flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-error-container/30 flex items-center justify-center rounded-lg text-error">
                        <span className="material-symbols-outlined text-fill">payments</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-on-surface">{summary?.unpaidPayments.length || 0}</p>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Unpaid Tasks</p>
                    </div>
                </Link>
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm shadow-slate-200/50 flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-primary-container/10 flex items-center justify-center rounded-lg text-primary">
                        <span className="material-symbols-outlined text-fill">assignment_turned_in</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-on-surface">{summary?.applicationCount || 0}</p>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Apps</p>
                    </div>
                </div>
            </section>

            {/* Active Applications Section */}
            <section className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-on-surface">Curation Pipeline</h3>
                    <Link href={CONSTANTS.ROUTES.APPLICATIONS} className="text-xs font-bold text-primary flex items-center gap-1 group">
                        VIEW FULL ARCHIVE <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                {summary?.pendingStages.length === 0 ? (
                    <div className="bg-surface-container-low p-12 rounded-2xl text-center border-2 border-dashed border-slate-200">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">work_outline</span>
                        <p className="text-on-surface-variant italic mb-6">No active applications currently tracked.</p>
                        <Link href={CONSTANTS.ROUTES.JOBS} className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform inline-block">
                            Explore New Roles
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {summary?.pendingStages.map((app) => (
                            <div key={app.applicationId} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-50 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all">
                                <div className="flex-1 w-full space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold text-on-surface">{app.jobTitle}</h4>
                                        <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase">IN PROGRESS</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${app.completionPercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Current Stage: {app.completionPercentage > 0 ? `Stage ${Math.ceil(app.completionPercentage / 25)}` : 'Initiated'}</span>
                                        <span>{app.completionPercentage}% Complete</span>
                                    </div>
                                </div>
                                <div className="md:border-l border-slate-100 md:pl-8 flex flex-col gap-2 w-full md:w-auto">
                                    <Link
                                        href={`${CONSTANTS.ROUTES.APPLICATIONS}/${app.applicationId}`}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-lg text-sm font-bold text-center hover:bg-primary transition-colors whitespace-nowrap"
                                    >
                                        Resume Curation
                                    </Link>
                                    <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors text-center">VIEW DETAILS</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

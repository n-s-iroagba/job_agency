'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';
import {
    Clock,
    CreditCard,
    Briefcase,
    ArrowRight
} from 'lucide-react';

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
    const { data: summary, isLoading } = useApiQuery<DashboardSummary>(
        ['dashboard', 'summary'],
        '/dashboard'
    );

    if (isLoading) return <div className="space-y-xl animate-pulse">
        <div className="flex gap-lg">
            {[1, 2, 3].map(i => <div key={i} className="card flex-1 h-32 bg-slate-50" />)}
        </div>
        <div className="card h-64 bg-slate-50" />
    </div>;

    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1>Welcome back, {user.fullName || 'Applicant'} 👋</h1>
                    <p className="text-text-secondary mt-1">Status: Active Candidate</p>
                </div>
            </header>

            {/* Summary Widgets - UIDD §4.2.1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="card flex items-center gap-md">
                    <div className="p-3 bg-blue-50 text-primary rounded-md"><Clock className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">Pending Stages</p>
                        <p className="text-2xl font-bold">{summary?.pendingStages.length || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-md">
                    <div className="p-3 bg-red-50 text-danger rounded-md"><CreditCard className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">Unpaid Payments</p>
                        <p className="text-2xl font-bold">{summary?.unpaidPayments.length || 0}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-md">
                    <div className="p-3 bg-green-50 text-success rounded-md"><Briefcase className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">Active Apps</p>
                        <p className="text-2xl font-bold">{summary?.applicationCount || 0}</p>
                    </div>
                </div>
            </div>

            {/* In-Progress Applications - UIDD §4.2.1 */}
            <section className="space-y-md">
                <div className="flex justify-between items-center">
                    <h2>Active Applications</h2>
                    <Link href={CONSTANTS.ROUTES.APPLICATIONS} className="text-sm text-primary font-medium hover:underline">View All</Link>
                </div>

                {summary?.pendingStages.length === 0 ? (
                    <div className="card py-xl text-center">
                        <p className="text-text-secondary mb-md">You don't have any active applications.</p>
                        <Link href={CONSTANTS.ROUTES.JOBS} className="btn-primary inline-flex items-center gap-2">
                            Browse Jobs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-md">
                        {summary?.pendingStages.map((app) => (
                            <div key={app.applicationId} className="card flex flex-col md:flex-row items-center gap-xl">
                                <div className="flex-1 w-full">
                                    <h3 className="text-lg font-bold mb-1">{app.jobTitle}</h3>
                                    <ProgressTracker
                                        currentPercent={app.completionPercentage}
                                        stages={[
                                            { id: 1, name: 'Setup', status: 'completed' },
                                            { id: 2, name: 'Stage 2', status: app.completionPercentage > 30 ? 'completed' : 'current' },
                                            { id: 3, name: 'Stage 3', status: app.completionPercentage > 60 ? 'completed' : app.completionPercentage > 30 ? 'current' : 'upcoming' },
                                            { id: 4, name: 'Final', status: app.completionPercentage >= 100 ? 'completed' : 'upcoming' },
                                        ]}
                                    />
                                </div>
                                <div className="md:border-l border-border md:pl-xl w-full md:w-auto">
                                    <Link
                                        href={`${CONSTANTS.ROUTES.APPLICATIONS}/${app.applicationId}`}
                                        className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Available Jobs Sneak Peek */}
            <section className="space-y-md">
                <h2>New Opportunities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {summary?.activeJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="card p-md">
                            <h4 className="font-bold mb-2">{job.title}</h4>
                            <p className="text-xs text-text-secondary mb-md">📍 {job.location}</p>
                            <Link href={`/dashboard/jobs/${job.id}`} className="text-xs text-primary font-bold hover:underline">
                                View Details & Apply →
                            </Link>
                        </div>
                    ))}
                    <Link href={CONSTANTS.ROUTES.JOBS} className="card flex items-center justify-center border-dashed text-text-secondary hover:text-primary hover:border-primary transition-colors cursor-pointer">
                        <span className="text-sm font-medium">Browse more jobs...</span>
                    </Link>
                </div>
            </section>

            <footer className="pt-xl text-center border-t border-border">
                <p className="text-xs text-slate-400">
                    Need help? 📧 support@jobagency.com | 📞 +1-555-HELP
                </p>
            </footer>
        </div>
    );
}

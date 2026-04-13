'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';
import {
    Search,
    Filter,
    ArrowUpRight
} from 'lucide-react';

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

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="mb-1">My Applications</h1>
                    <p className="text-text-secondary">Track your progress and respond to requirements (STK-APP-APPLIST-001)</p>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-md justify-between items-center bg-surface p-md border border-border rounded-md">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-10" placeholder="Search by job title..." />
                </div>
                <div className="flex gap-sm w-full md:w-auto">
                    <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-slate-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <Link href={CONSTANTS.ROUTES.JOBS} className="btn-primary flex-1 md:flex-none text-center">
                        Find New Jobs
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-md animate-pulse">
                    {[1, 2, 4].map(i => <div key={i} className="card h-24 bg-slate-50" />)}
                </div>
            ) : data?.rows.length === 0 ? (
                <div className="card py-24 text-center">
                    <p className="text-text-secondary text-lg">No applications found.</p>
                    <Link href={CONSTANTS.ROUTES.JOBS} className="text-primary font-bold hover:underline">Start applying now →</Link>
                </div>
            ) : (
                <div className="card overflow-hidden p-0 border-t-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-y border-border">
                            <tr>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Job Opportunity</th>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">Progress</th>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data?.rows.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-lg py-5">
                                        <p className="font-bold text-text-primary">{app.JobListing.title}</p>
                                        <p className="text-[10px] text-text-secondary mt-0.5">Updated {new Date(app.updatedAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-lg py-5">
                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${app.status === 'Active' ? 'bg-blue-50 text-primary' :
                                                app.status === 'Completed' ? 'bg-green-50 text-success' :
                                                    'bg-slate-100 text-text-secondary'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-lg py-5">
                                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-success transition-all duration-300"
                                                style={{ width: `${app.completionPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-text-secondary mt-1 block">{app.completionPercentage}% Complete</span>
                                    </td>
                                    <td className="px-lg py-5 text-right">
                                        <Link
                                            href={`${CONSTANTS.ROUTES.APPLICATIONS}/${app.id}`}
                                            className="text-primary text-sm font-bold flex items-center justify-end gap-1 hover:underline"
                                        >
                                            Details <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

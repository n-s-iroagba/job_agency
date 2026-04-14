'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { Application } from '@/types/models';

export default function ApplicationDraftsPage() {
    const { data: drafts, isLoading } = useApiQuery<{ rows: Application[], count: number }>(['admin', 'applications', 'drafts'], '/admin/applications/drafts');

    const draftList = drafts?.rows || [];
    const totalCount = drafts?.count || 0;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
            <div className="flex-1 p-12 space-y-12 max-w-[1280px]">
                {/* Page Header */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-80">Pipeline Management</span>
                        <h2 className="text-[4rem] font-black leading-tight tracking-tighter text-on-surface uppercase">
                            Application<br />Drafts
                        </h2>
                        <p className="text-lg text-on-surface-variant max-w-[576px] font-light italic leading-relaxed">
                            Monitor and manage incomplete candidate submissions to identify friction points in the curation process.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col items-start gap-2 min-w-[200px] border border-slate-50 relative overflow-hidden group">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Drafts</span>
                            <span className="text-4xl font-black text-on-surface tracking-tighter">{totalCount.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Position</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Active</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse h-24">
                                            <td colSpan={4} className="px-10 bg-slate-50/10"></td>
                                        </tr>
                                    ))
                                ) : draftList.length === 0 ? (
                                    <tr><td colSpan={4} className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest italic tracking-[0.3em]">No drafts detected in the pipeline</td></tr>
                                ) : draftList.map((app: Application) => (
                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                                                    {app.User?.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-black text-xs uppercase tracking-tight text-on-surface">{app.User?.fullName || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold lowercase opacity-70">{app.User?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xs font-black text-on-surface uppercase tracking-tight">{app.JobListing?.title || 'Unknown Role'}</span>
                                        </td>
                                        <td className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                                            {new Date(app.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-[10px] font-black text-primary italic uppercase tracking-widest">{app.completionPercentage}% Complete</span>
                                                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${app.completionPercentage}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

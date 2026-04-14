'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';

export default function AdminApplicationsPage() {
    const { data: apps, isLoading } = useApiQuery<any>(['admin', 'applications', 'all'], '/admin/applications');

    const appList = apps?.rows || apps || [];
    const totalCount = apps?.count || appList.length;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-blue-500/10 selection:text-blue-600">
            {/* Header / AppBar */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter">Application Pipeline</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Active Triage</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all cursor-pointer">Historical Data</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" style={{ fontSize: '18px' }}>search</span>
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                            placeholder="Identify applicant..."
                            type="text"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-12 space-y-10 max-w-[1280px]">
                {/* Breadcrumbs & Title */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span>Recruitment</span>
                            <span className="material-symbols-outlined text-[12px] font-bold">chevron_right</span>
                            <span>Pipeline</span>
                            <span className="material-symbols-outlined text-[12px] font-bold">chevron_right</span>
                            <span className="text-primary">New Applications</span>
                        </div>
                        <h2 className="text-[3.5rem] font-black tracking-tighter text-on-surface leading-none mb-4 uppercase">New Applications</h2>
                        <p className="text-on-surface-variant text-lg max-w-[672px] font-light italic">
                            Review and triage incoming talent. Total pending submissions: <span className="text-primary font-bold not-italic">{totalCount}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white border border-slate-100 text-on-surface px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:bg-slate-50 shadow-sm active:scale-95">
                            <span className="material-symbols-outlined font-bold">filter_list</span>
                            Filter Results
                        </button>
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-slate-200 hover:bg-primary transition-all active:scale-95">
                            <span className="material-symbols-outlined font-bold">download</span>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned Career</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Submission</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pipeline Stage</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Integrity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="px-10 py-8 h-20 bg-slate-50/20"></td>
                                        </tr>
                                    ))
                                ) : appList.map((app: any) => (
                                    <tr key={app.id} className="group hover:bg-slate-50 transition-colors duration-300 cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs shadow-sm">
                                                    {(app.User?.fullName || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-on-surface uppercase tracking-tight text-xs">{app.User?.fullName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-tight lowercase">{app.User?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="font-black text-on-surface uppercase tracking-tight text-xs">{app.JobListing?.title}</p>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{app.JobListing?.employmentType} • {app.JobListing?.location}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-xs font-black text-on-surface uppercase tracking-tighter">
                                                {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-primary border border-primary/10">
                                                {app.status || 'Triage'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${app.isPaid ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-300'}`}></span>
                                                <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{app.isPaid ? 'Verified' : 'Pending'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <Link href={`/admin/applications/${app.id}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all hover:bg-primary">
                                                Initialize
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Footer */}
                    <div className="px-10 py-8 flex items-center justify-between bg-slate-50/30 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-on-surface font-black">{isLoading ? 0 : appList.length}</span> of <span className="text-on-surface font-black">{totalCount}</span> application records
                        </p>
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-lg transition-all disabled:opacity-20">
                                <span className="material-symbols-outlined font-bold">chevron_left</span>
                            </button>
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-200">1</button>
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-lg transition-all">2</button>
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-lg transition-all font-bold">
                                <span className="material-symbols-outlined font-bold">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Style Metrics at Bottom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-white rounded-3xl border border-slate-50 shadow-2xl shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-blue-50 rounded-2xl text-primary shadow-sm">
                                <span className="material-symbols-outlined font-bold text-2xl">rocket_launch</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">+12% vs LY</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Weekly Velocity</h3>
                        <p className="text-4xl font-black text-on-surface tracking-tighter">42 Recruits</p>
                    </div>
                    <div className="p-10 bg-white rounded-3xl border border-slate-50 shadow-2xl shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-orange-50 rounded-2xl text-orange-600 shadow-sm">
                                <span className="material-symbols-outlined font-bold text-2xl">timer</span>
                            </div>
                            <span className="text-[10px] font-black text-error bg-error/5 px-3 py-1 rounded-full border border-error/10 uppercase">-4.2% Slowdown</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Avg. Review Time</h3>
                        <p className="text-4xl font-black text-on-surface tracking-tighter">1.8 Days</p>
                    </div>
                    <div className="p-10 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-300 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-8xl font-bold">workspace_premium</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-4">Top Performer Spotlight</h3>
                            <p className="text-3xl font-black mb-2 uppercase tracking-tighter">Sarah Jenkins</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest italic opacity-80">98% Match Score • Marketing Dir.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

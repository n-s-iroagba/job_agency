'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';

export default function AdminDraftsPage() {
    const { data: drafts, isLoading } = useApiQuery<any>(['admin', 'applications', 'drafts'], '/admin/applications/drafts');

    const draftList = drafts?.rows || drafts || [];
    const totalDrafts = drafts?.count || draftList.length;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-blue-500/10 selection:text-blue-600">
            {/* Header / AppBar */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter">Draft Management</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Incomplete Flows</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all cursor-pointer">Dropout Analytics</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" style={{ fontSize: '18px' }}>search</span>
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                            placeholder="Locate partial profile..."
                            type="text"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-12 space-y-10 max-w-7xl">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Administrative Queue</span>
                        <h2 className="text-[4rem] font-black tracking-tighter text-on-surface leading-none uppercase">Application Drafts</h2>
                        <p className="text-on-surface-variant max-w-2xl text-lg font-light italic leading-relaxed">
                            Review and manage incomplete candidate profiles. High-intent drafts are <span className="text-primary font-bold not-italic decoration-primary decoration-2">highlighted</span> for proactive outreach.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white border border-slate-100 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm group cursor-pointer hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors font-bold" style={{ fontSize: '20px' }}>filter_list</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filter By Stage</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Style Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-2xl border-l-8 border-primary shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Drafts</p>
                            <p className="text-4xl font-black tracking-tighter text-on-surface">{totalDrafts.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">trending_up</span>
                            +12% vs last week
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border-l-8 border-tertiary shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stagnant (&gt; 7 days)</p>
                            <p className="text-4xl font-black tracking-tighter text-tertiary">28</p>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-tertiary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">warning</span>
                            Proactive Signal
                        </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-2xl border-l-8 border-emerald-500 shadow-2xl shadow-slate-300 col-span-1 md:col-span-2 flex items-center justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-7xl font-bold">celebration</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">High Completion (&gt; 80%)</p>
                            <p className="text-4xl font-black tracking-tighter text-white">45 <span className="text-xs font-bold text-slate-500 ml-2">Profiles</span></p>
                        </div>
                        <div className="flex -space-x-3 hover:translate-x-2 transition-transform cursor-pointer">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xl relative overflow-hidden group">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Candidate" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-xl bg-primary border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                                +42
                            </div>
                        </div>
                    </div>
                </div>

                {/* Paginated Table Section */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <div className="relative w-96 group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors font-bold" style={{ fontSize: '18px' }}>search</span>
                            <input
                                className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-primary/20 text-[10px] font-bold uppercase tracking-tight transition-all"
                                placeholder="Search by name or career..."
                                type="text"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 text-slate-400 hover:text-primary transition-all rounded-xl hover:bg-slate-50">
                                <span className="material-symbols-outlined font-bold">download</span>
                            </button>
                            <button className="p-3 text-slate-400 hover:text-primary transition-all rounded-xl hover:bg-slate-50">
                                <span className="material-symbols-outlined font-bold">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/30">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant Identity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Role</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Completion Matrix</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Activity</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Incomplete Node</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2].map(i => (
                                    <tr key={i} className="animate-pulse h-24">
                                        <td colSpan={6} className="px-10 bg-slate-50/10"></td>
                                    </tr>
                                ))
                            ) : draftList.map((app: any) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-primary">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs shadow-sm shadow-slate-100">
                                                {(app.User?.fullName || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-xs uppercase tracking-tight text-on-surface">{app.User?.fullName}</div>
                                                <div className="text-[10px] text-slate-400 font-bold lowercase">{app.User?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-xs font-black text-on-surface uppercase tracking-tight">{app.JobListing?.title}</span>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: #UX-2024-{app.id}</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black mb-2 text-primary uppercase">85% Complete</span>
                                            <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-primary w-[85%] shadow-lg shadow-primary/30"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">2 hours ago</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-100/50 shadow-sm">
                                            {app.status || 'Portfolio Review'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:underline decoration-primary decoration-2 underline-offset-8 mr-6">Remind</button>
                                        <button className="p-3 rounded-xl hover:bg-white hover:shadow-xl transition-all opacity-0 group-hover:opacity-100">
                                            <span className="material-symbols-outlined text-lg align-middle font-bold text-slate-400 group-hover:text-primary" style={{ fontSize: '20px' }}>visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Footer */}
                    <div className="px-10 py-8 bg-slate-50/20 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-on-surface font-black">{draftList.length}</span> of <span className="text-on-surface font-black">{totalDrafts}</span> incomplete records
                        </p>
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-lg transition-all disabled:opacity-20 opacity-50">
                                <span className="material-symbols-outlined font-bold">chevron_left</span>
                            </button>
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-200 focus:scale-95 transition-all">1</button>
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-lg transition-all font-bold">2</button>
                            <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-lg transition-all font-bold">
                                <span className="material-symbols-outlined font-bold">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

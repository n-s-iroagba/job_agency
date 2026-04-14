'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { Application } from '@/types/models';

export default function ApplicationDraftsPage() {
    const { data: drafts, isLoading } = useApiQuery<{ rows: Application[], count: number }>(['admin', 'drafts'], '/admin/applications/drafts');

    const draftList = drafts?.rows || [];

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopNavBar */}
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-black tracking-tight uppercase italic text-blue-700">CareerCurator Admin</span>
                    <nav className="hidden md:flex gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Opportunities</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border-b-2 border-blue-600 pb-1">Talent</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Categories</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">SCR-ADM-DRAFTS-001</p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 md:p-12 max-w-[1280px] mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Administrative Queue</span>
                        <h1 className="text-[3.5rem] font-black tracking-tighter text-on-surface leading-none italic uppercase">Application<span className="text-primary"> Drafts</span></h1>
                        <p className="text-on-surface-variant max-w-[576px] text-lg font-medium leading-relaxed">Review and manage incomplete candidate profiles. High-intent drafts are highlighted for proactive outreach.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white border border-slate-200 px-6 py-4 rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-slate-500 text-[18px]">filter_list</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filter By Stage</span>
                        </button>
                        <Link href="/admin/jobs/new">
                            <button className="bg-primary text-white border border-blue-600 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                                Post New Job
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Bento Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-transform relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-4">Total Drafts</p>
                        <p className="text-6xl font-black italic tracking-tighter text-slate-800 pl-4">142</p>
                        <div className="mt-6 flex items-center text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 w-fit px-3 py-1.5 rounded-lg border border-blue-100 ml-4">
                            <span className="material-symbols-outlined text-[14px] mr-1.5">trending_up</span> +12% from last week
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-1 transition-transform relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-4">Stagnant (&gt; 7 days)</p>
                        <p className="text-6xl font-black italic tracking-tighter text-orange-600 pl-4">28</p>
                        <div className="mt-6 flex items-center text-[10px] text-orange-600 font-black uppercase tracking-widest bg-orange-50 w-fit px-3 py-1.5 rounded-lg border border-orange-100 ml-4">
                            <span className="material-symbols-outlined text-[14px] mr-1.5">warning</span> Requires Action
                        </div>
                    </div>
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl group hover:-translate-y-1 transition-transform relative overflow-hidden col-span-1 md:col-span-2 flex flex-col justify-between">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-4">High Completion (&gt; 80%)</p>
                        <div className="flex items-center justify-between pl-4">
                            <p className="text-6xl font-black italic tracking-tighter text-white">45</p>
                            <div className="flex -space-x-3 items-center">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center relative z-30 shadow-lg text-[10px] font-bold text-white uppercase tracking-widest">JC</div>
                                <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center relative z-20 shadow-lg text-[10px] font-bold text-white uppercase tracking-widest">MP</div>
                                <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-600 flex items-center justify-center relative z-10 shadow-lg text-[10px] font-bold text-white uppercase tracking-widest">TS</div>
                                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-emerald-400 uppercase tracking-widest relative z-0">+42</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Paginated Table Section */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/50">
                        <div className="relative w-full sm:w-96">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            <input className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 text-[10px] font-black uppercase tracking-widest text-slate-800 placeholder:text-slate-400 shadow-sm" placeholder="Search applicant by name or job..." type="text" />
                        </div>
                        <div className="flex gap-4">
                            <button className="p-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm text-slate-500 hover:text-primary"><span className="material-symbols-outlined text-[20px]">download</span></button>
                            <button className="p-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm text-slate-500 hover:text-primary"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">Job Title</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Completion</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden lg:table-cell">Last Activity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Stage</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {draftList.map((draft: Application) => (
                                    <tr key={draft.id} className={`hover:bg-slate-50/80 transition-colors group ${draft.completionPercentage < 30 ? 'bg-orange-50/30' : ''}`}>
                                        <td className={`px-10 py-8 ${draft.completionPercentage < 30 ? 'border-l-4 border-orange-400' : 'border-l-4 border-transparent'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-inner bg-slate-100">{draft.User?.fullName.charAt(0)}</div>
                                                <div>
                                                    <div className="font-black text-xs text-slate-800 uppercase tracking-tight">{draft.User?.fullName}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{draft.User?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 hidden md:table-cell">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700 block mb-1">{draft.JobListing?.title}</span>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">ID: {draft.jobId}</div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2">{draft.completionPercentage}%</span>
                                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                    <div className={`h-full rounded-full ${draft.completionPercentage > 80 ? 'bg-emerald-500' : draft.completionPercentage < 30 ? 'bg-orange-500' : 'bg-primary'}`} style={{ width: `${draft.completionPercentage}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 hidden lg:table-cell">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${draft.completionPercentage < 30 ? 'text-orange-600' : 'text-slate-500'}`}>{new Date(draft.updatedAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-3 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-widest ${draft.completionPercentage < 30 ? 'bg-orange-100 text-orange-700 border border-orange-200' : draft.completionPercentage > 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                                {draft.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-100">Remind</button>
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary shadow-sm hover:shadow transition-all">
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing <span className="text-slate-800">1-4</span> of 142 applicants</p>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-300 cursor-not-allowed shadow-sm"><span className="material-symbols-outlined text-[16px]">chevron_left</span></button>
                            <button className="px-4 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">1</button>
                            <button className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-primary transition-colors shadow-sm">2</button>
                            <button className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-primary transition-colors shadow-sm">3</button>
                            <span className="px-2 text-slate-400 text-sm font-bold tracking-widest">...</span>
                            <button className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-primary transition-colors shadow-sm">12</button>
                            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';

export default function StageBuilderPage({ params }: { params: { id: string } }) {
    // Mock the job context since params unwrapping can be tricky in newer Next.js without React.use, assuming params.id is available
    const jobId = params.id;
    const { data: job, isLoading: jobLoading } = useApiQuery<any>(['admin', 'job', jobId], `/admin/jobs/${jobId}`);
    const { data: stages, isLoading: stagesLoading, refetch } = useApiQuery<{ rows: any[], count: number }>(['admin', 'job', jobId, 'stages'], `/admin/jobs/${jobId}/stages`);

    const stageList = (stages as any)?.rows || stages || [
        { id: 1, name: 'Initial Profile Evaluation', type: 'Screening', paymentRequired: false, description: 'Screening of CV, portfolio, and initial technical screening responses.' },
        { id: 2, name: 'Background Verification Fee', type: 'Payment', paymentRequired: true, amount: 249, description: 'Collection of processing fees for background checks.' },
        { id: 3, name: 'Architectural Deep Dive', type: 'Interview', paymentRequired: false, description: '120-minute whiteboarding session focusing on system design.' },
    ];

    if (jobLoading || stagesLoading) return <div className="p-12 animate-pulse"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    const jobTitle = job?.title || 'Senior Technical Architect';

    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopAppBar */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-black text-blue-800 tracking-tight italic">JobNexa Admin</h1>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest hidden md:block">Builder / Stage Architecture</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-STAGE-001</p>
                </div>
            </header>

            {/* Canvas */}
            <div className="p-8 lg:p-12 max-w-[1280px] mx-auto w-full">

                {/* Page Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                    <div className="max-w-[672px]">
                        <div className="flex items-center gap-2 mb-3">
                            <Link href="/admin/jobs" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Jobs</Link>
                            <span className="text-slate-300 text-xs material-symbols-outlined">chevron_right</span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Project: {jobTitle}</span>
                        </div>
                        <h2 className="text-[3.5rem] leading-[1] font-black text-on-surface tracking-tighter mb-4 italic uppercase">Stage Builder</h2>
                        <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                            Design the workflow logic for the recruitment lifecycle. Organize stages by priority and configure automated triggers for seamless candidate transitions.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-colors">
                            Preview Workflow
                        </button>
                        <button className="px-8 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Publish Changes
                        </button>
                    </div>
                </div>

                {/* Builder Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Stage List (Draggable Canvas) */}
                    <div className="lg:col-span-8 space-y-6">
                        {stageList.map((stage: any, index: number) => (
                            <div key={stage.id} className="group relative flex items-start gap-6 p-8 bg-white rounded-[2rem] border border-slate-50/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                                <div className="flex flex-col items-center gap-2 pt-2 cursor-grab active:cursor-grabbing hover:text-primary">
                                    <span className="material-symbols-outlined text-slate-300 transition-colors">drag_indicator</span>
                                    <span className="text-[10px] font-black text-slate-400">{(index + 1).toString().padStart(2, '0')}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-xl font-black italic tracking-tight text-on-surface uppercase">{stage.name}</h3>
                                            {stage.paymentRequired && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm">
                                                    <span className="material-symbols-outlined text-[14px]">payments</span>
                                                    Transactional
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50/50 border border-blue-100/50 rounded-xl hidden sm:flex">
                                            <span className="material-symbols-outlined text-[14px] text-primary">{stage.paymentRequired ? 'mail' : stage.type === 'Interview' ? 'videocam' : 'notifications_active'}</span>
                                            <span className="text-[9px] font-black uppercase text-primary tracking-widest">{stage.paymentRequired ? 'Invoice Sent' : stage.type === 'Interview' ? 'Live Session' : 'Auto-Alert'}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed max-w-[512px]">{stage.description}</p>

                                    <div className="flex flex-wrap items-center gap-6 pb-2">
                                        {stage.paymentRequired ? (
                                            <>
                                                <div className="flex items-center gap-2 text-primary font-black">
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400">Fee Amount:</span>
                                                    <span className="text-lg bg-blue-50 px-3 py-1 rounded-xl border border-blue-100/50">${stage.amount?.toFixed(2)}</span>
                                                </div>
                                                <div className="w-px h-6 bg-slate-200"></div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Stripe Integrated</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">EST: 48 Hours</span>
                                                </div>
                                                <div className="hidden sm:flex items-center gap-2 text-slate-500">
                                                    <span className="material-symbols-outlined text-[18px]">group</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Assigned: HR Panel</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-error hover:bg-red-50 transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Stage Placeholder */}
                        <button className="w-full py-10 border-2 border-dashed border-slate-200/80 bg-slate-50/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-blue-50/30 transition-all group">
                            <span className="material-symbols-outlined text-[32px] group-hover:scale-125 transition-transform bg-white p-2 rounded-xl shadow-sm">add</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Append New Workflow Stage</span>
                        </button>
                    </div>

                    {/* Control Panel (Sidebar Context) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Analytics Quick Card */}
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Pipeline Health</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-slate-800/80 p-5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Active Candidates</span>
                                        <span className="text-3xl font-black italic tracking-tighter text-emerald-400">1,284</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: '72%' }}></div>
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">72% through Initial Evaluation</p>
                                    </div>
                                </div>
                            </div>
                            {/* Abstract Background Decoration */}
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700"></div>
                            <div className="absolute top-10 -right-10 opacity-10 blur-[1px]">
                                <span className="material-symbols-outlined text-[120px]">monitor_heart</span>
                            </div>
                        </div>

                        {/* Stage Logic Settings */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-2xl shadow-slate-200/50">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-100">Global Logic Settings</h4>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <label className="text-xs font-black uppercase tracking-widest text-on-surface cursor-pointer group-hover:text-primary transition-colors">Auto-Advance on Success</label>
                                    <div className="w-10 h-5 bg-primary rounded-full relative shadow-inner">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between opacity-50 cursor-pointer">
                                    <label className="text-xs font-black uppercase tracking-widest text-on-surface cursor-pointer">Notify Reject Status</label>
                                    <div className="w-10 h-5 bg-slate-200 rounded-full relative shadow-inner">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between cursor-pointer group">
                                    <label className="text-xs font-black uppercase tracking-widest text-on-surface cursor-pointer group-hover:text-primary transition-colors">Skip Verification</label>
                                    <div className="w-10 h-5 bg-slate-200 rounded-full relative shadow-inner">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Pipeline Preview</h5>
                                <div className="relative pl-6 space-y-8">
                                    <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-slate-100"></div>
                                    <div className="relative">
                                        <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-primary rounded-full ring-4 ring-white shadow-sm"></div>
                                        <p className="text-xs font-black uppercase tracking-widest text-on-surface mb-1">Draft Phase</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Configuration Mode</p>
                                    </div>
                                    <div className="relative opacity-50">
                                        <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-slate-200 rounded-full ring-4 ring-white"></div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-1">Staging</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Internal Testing</p>
                                    </div>
                                    <div className="relative opacity-50">
                                        <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-slate-200 rounded-full ring-4 ring-white"></div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-1">Live Release</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Public Pipeline</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spotlight Candidate (Signature Component) */}
                        <div className="bg-blue-50/80 p-8 rounded-[2.5rem] border border-blue-100 shadow-inner overflow-hidden relative group">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">Top Match</span>
                                    <span className="material-symbols-outlined text-primary/50 cursor-pointer hover:text-primary transition-colors">more_horiz</span>
                                </div>
                                <div className="flex items-center gap-5 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-14 h-14 rounded-[1rem] bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[24px] text-slate-400">person</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase italic tracking-tight text-on-surface">Elena Rodriguez</h4>
                                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Principal Dev @ FintechGlobal</p>
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-slate-600 mb-8 leading-relaxed italic bg-white/50 p-4 rounded-2xl border border-white">
                                    "Specialist in high-availability cloud architecture with 12+ years experience in the DACH region."
                                </p>
                                <button className="w-full py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 active:scale-95 shadow-xl shadow-primary/20 transition-all">
                                    Fast-Track Application
                                </button>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-5 group-hover:scale-110 transition-transform duration-700 -mb-10 -mr-10">
                                <span className="material-symbols-outlined text-[200px]">auto_awesome</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

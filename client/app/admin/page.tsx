'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export default function AdminDashboardPage() {
    const { data: apps } = useApiQuery<any>(['admin', 'apps', 'summary'], '/admin/applications?limit=5');
    const { data: unverified } = useApiQuery<any>(['admin', 'payments', 'unverified'], '/admin/payments/unverified');
    const { data: unpaid } = useApiQuery<any>(['admin', 'payments', 'unpaid'], '/admin/payments/unpaid');

    const appCount = apps?.count || 0;
    const unpaidCount = unpaid?.count || 0;
    const unverifiedCount = unverified?.rows?.length || unverified?.length || 0;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-blue-500/10 selection:text-blue-600">
            {/* Header */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter text-on-surface uppercase decoration-primary decoration-4">Administrative Overview</h2>
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest opacity-60">Monitoring Precision Professional Placement Systems</p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">System Live</span>
                    </div>
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors font-bold" style={{ fontSize: '20px' }}>notifications</button>
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors font-bold" style={{ fontSize: '20px' }}>settings</button>
                </div>
            </header>

            <div className="p-12 space-y-12 max-w-7xl">
                {/* Bento Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Summary Card 1: Applications */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-48 relative overflow-hidden group border border-slate-50">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[12rem] font-bold">assignment</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">New Applications</p>
                            <h3 className="text-6xl font-black tracking-tighter text-primary">{appCount.toString().padStart(2, '0')}</h3>
                        </div>
                        <div className="flex items-center text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">trending_up</span>
                            +12% Activity
                        </div>
                    </div>

                    {/* Summary Card 2: Unpaid */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-48 relative overflow-hidden group border border-slate-50">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700 text-error">
                            <span className="material-symbols-outlined text-[12rem] font-bold">payments</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-error text-[10px] font-black uppercase tracking-[0.2em] mb-4">Unpaid Sums</p>
                            <h3 className="text-6xl font-black tracking-tighter text-on-surface">{unpaidCount.toString().padStart(2, '0')}</h3>
                        </div>
                        <div className="flex items-center text-error font-bold text-[10px] uppercase tracking-widest bg-error/5 w-fit px-3 py-1 rounded-full border border-error/10">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">warning</span>
                            Action Required
                        </div>
                    </div>

                    {/* Summary Card 3: Unverified */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-48 relative overflow-hidden group border border-slate-50">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700 text-tertiary">
                            <span className="material-symbols-outlined text-[12rem] font-bold">verified_user</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Pending Proofs</p>
                            <h3 className="text-6xl font-black tracking-tighter text-on-surface">{unverifiedCount.toString().padStart(2, '0')}</h3>
                        </div>
                        <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-widest bg-slate-50 w-fit px-3 py-1 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">hourglass_empty</span>
                            Processing Queue
                        </div>
                    </div>
                </section>

                {/* Operational Insight Layer */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* System Health Widget */}
                    <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-10 shadow-2xl shadow-slate-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-9xl font-bold">health_and_safety</span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 border-b border-white/10 pb-6 flex items-center text-emerald-400">
                            <span className="material-symbols-outlined mr-3 text-2xl font-bold">shield_with_heart</span>
                            System Health Core
                        </h4>
                        <div className="space-y-10 relative z-10">
                            {/* CPU */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logic Load</span>
                                    <span className="text-xs font-black text-emerald-400 uppercase tracking-tighter">24% Optimal</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[24%] shadow-lg shadow-emerald-500/50"></div>
                                </div>
                            </div>
                            {/* Memory */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Memory Matrix</span>
                                    <span className="text-xs font-black text-amber-400 uppercase tracking-tighter">68% Elevated</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[68%] shadow-lg shadow-amber-500/50"></div>
                                </div>
                            </div>
                            {/* DB */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Latency</span>
                                    <span className="text-xs font-black text-emerald-400 uppercase tracking-tighter">12ms Healthy</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[12%] shadow-lg shadow-emerald-500/50"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="lg:col-span-8 bg-white rounded-2xl p-10 shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <div className="flex items-center justify-between mb-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface flex items-center">
                                <span className="material-symbols-outlined mr-3 text-primary font-bold">history</span>
                                Real-time Operational Logs
                            </h4>
                            <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:underline">Full Audit Log</button>
                        </div>
                        <div className="space-y-0 relative">
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                            {[
                                { title: 'Payment Verification', desc: 'Admin Sarah J. verified batch #PV-992.', time: '2 mins ago', color: 'bg-primary' },
                                { title: 'Protocol Advance', desc: '8 applications moved to "Interviewing".', time: '14 mins ago', color: 'bg-tertiary' },
                                { title: 'Batch Settlement', desc: 'Finance core successfully settled 14 partners.', time: '42 mins ago', color: 'bg-emerald-500' }
                            ].map((entry, i) => (
                                <div key={i} className="relative pl-12 pb-10 last:pb-0">
                                    <div className={`absolute left-1.5 top-0 w-3.5 h-3.5 ${entry.color} rounded-full border-4 border-white z-10 shadow-sm`}></div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-black text-on-surface uppercase tracking-tight">{entry.title}</p>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{entry.time}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed italic opacity-80">{entry.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Dashboard Spot */}
                <section className="bg-slate-900 overflow-hidden rounded-3xl relative min-h-[320px] flex items-center shadow-2xl shadow-slate-300">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1551288049-bbbda5366392?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
                    <div className="relative z-10 px-16 py-12 max-w-2xl">
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">Precision Insight</p>
                        <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">Placement Efficiency has reached a <span className="text-primary italic">New High</span>.</h2>
                        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium italic">
                            Operational efficiency in placement matching is up 22%. Your proactive management of payment verifications has reduced average cycle time by 1.2 days.
                        </p>
                        <div className="flex space-x-6">
                            <button className="bg-white text-slate-900 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">Generate Report</button>
                            <button className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">Dismiss</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

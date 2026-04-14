'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { Payment } from '@/types/models';

export default function UnpaidQueuePage() {
    const { data: unpaid, isLoading } = useApiQuery<{ rows: Payment[], count: number }>(['admin', 'payments', 'unpaid'], '/admin/payments/unpaid');

    const unpaidList = unpaid?.rows || [];
    const totalCount = unpaid?.count || 0;
    const totalOverdue = unpaidList.reduce((acc: number, p: Payment) => acc + (p.amount || 0), 0);

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-error/10 selection:text-error">
            {/* Main Content Area */}
            <div className="flex-1 p-12 space-y-12 max-w-[1280px]">
                {/* Page Header & Stats */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-error opacity-80">Financial Oversight</span>
                        <h2 className="text-[4rem] font-black leading-tight tracking-tighter text-on-surface uppercase">
                            Unpaid<br />Payments
                        </h2>
                        <p className="text-lg text-on-surface-variant max-w-[576px] font-light italic leading-relaxed">
                            Manage and track outstanding application stage fees across the curated talent pipeline. (SCR-ADM-PAY-003)
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col items-start gap-2 min-w-[200px] border border-slate-50 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <span className="material-symbols-outlined text-8xl font-bold">payments</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary">Total Overdue</span>
                            <span className="text-4xl font-black text-on-surface tracking-tighter">${totalOverdue.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-slate-300 flex flex-col items-start gap-2 min-w-[200px] relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <span className="material-symbols-outlined text-8xl font-bold text-white">pending_actions</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pending Tasks</span>
                            <span className="text-4xl font-black tracking-tighter">{totalCount.toString().padStart(2, '0')} <span className="text-xs text-slate-500 uppercase">Items</span></span>
                        </div>
                    </div>
                </section>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100 px-2">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                            <span className="material-symbols-outlined text-sm font-bold" style={{ fontSize: '18px' }}>filter_list</span>
                            Filter Stages
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-80">
                            Showing <span className="text-on-surface font-black not-italic">{totalCount}</span> records requiring resolution
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary transition-all shadow-sm active:scale-95">
                            <span className="material-symbols-outlined font-bold">file_download</span>
                        </button>
                        <button className="p-4 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary transition-all shadow-sm active:scale-95">
                            <span className="material-symbols-outlined font-bold">print</span>
                        </button>
                    </div>
                </div>

                {/* Payments Table Section */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned Career</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Locked Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Sum Due</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deadline</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stall Period</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse h-24">
                                            <td colSpan={7} className="px-10 bg-slate-50/10"></td>
                                        </tr>
                                    ))
                                ) : unpaidList.length === 0 ? (
                                    <tr><td colSpan={7} className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest italic tracking-[0.3em]">Queue is clear • Zero outstanding debits</td></tr>
                                ) : unpaidList.map((p: Payment) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs shadow-sm">
                                                    {(p.Application?.User?.fullName || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-xs uppercase tracking-tight text-on-surface">{p.Application?.User?.fullName || `User ID: ${p.applicationId}`}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold lowercase tracking-tight opacity-70">{p.Application?.User?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xs font-black text-on-surface uppercase tracking-tight">{p.Application?.JobListing?.title || 'Lead UI Designer'}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black text-primary uppercase tracking-widest bg-blue-50 border border-blue-100">{p.JobStage?.name || 'Final Interview'}</span>
                                        </td>
                                        <td className="px-10 py-8 text-right font-black text-on-surface text-base tracking-tighter italic">
                                            ${p.amount.toLocaleString()}
                                        </td>
                                        <td className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                                            {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-3 py-1 rounded-full text-[9px] font-black bg-error/10 text-error uppercase tracking-widest border border-error/10 shadow-sm animate-pulse-slow">
                                                {Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24))} Days
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-primary transition-all active:scale-95 group-hover:bg-primary group-hover:border-primary">Mark as Paid</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-10 py-8 bg-slate-50/20 flex items-center justify-between border-t border-slate-50">
                        <div className="flex gap-4">
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:bg-primary hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined font-bold">chevron_left</span>
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-200">1</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-colors font-bold text-xs">2</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:bg-primary hover:text-white transition-all shadow-sm">
                                <span className="material-symbols-outlined font-bold">chevron_right</span>
                            </button>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Queue Page <span className="text-on-surface">1</span> of <span className="text-on-surface">1</span>
                        </div>
                    </div>
                </div>

                {/* Footer Summary Asymmetric Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 pb-12">
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300 relative overflow-hidden group border border-white/5">
                        <div className="relative z-10 max-w-[576px]">
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Automate Collection Protocol?</h3>
                            <p className="opacity-60 mb-10 text-sm font-medium italic leading-relaxed">
                                Enable automatic follow-ups for payments overdue by more than 5 days. Candidates will receive reminders via SMS and Email to maintain pipeline velocity.
                            </p>
                            <button className="bg-white text-slate-900 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:translate-y-[-2px] transition-all hover:bg-primary hover:text-white active:scale-95">Initialize Automation</button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                            <span className="material-symbols-outlined text-[240px] font-bold">auto_awesome</span>
                        </div>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <span className="material-symbols-outlined text-7xl font-bold text-error">analytics</span>
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-error uppercase tracking-[0.2em] block mb-6 px-3 py-1 bg-error/5 w-fit rounded-full border border-error/10">Risk Scoping</span>
                            <p className="text-on-surface font-black text-2xl leading-none uppercase tracking-tighter italic">4 payments at<br />critical risk of<br />abandonment.</p>
                        </div>
                        <div className="flex items-center gap-2 mt-10 text-primary font-black uppercase text-[10px] tracking-[0.2em] cursor-pointer hover:translate-x-2 transition-transform w-fit group">
                            <span>Diagnostic Report</span>
                            <span className="material-symbols-outlined text-sm font-bold group-hover:scale-125 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

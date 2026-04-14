'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { BankAccount } from '@/types/models';

export default function BankAccountsPage() {
    const { data: accounts, isLoading, refetch } = useApiQuery<{ rows: BankAccount[], count: number }>(['admin', 'bank-accounts'], '/admin/bank-accounts');

    const deleteMutation = useApiMutation<number, any>('delete', '/admin/bank-accounts', {
        onSuccess: () => refetch()
    });

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this bank account?')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) { alert('Delete failed'); }
    };

    const accountList = accounts?.rows || [];

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-[#f7f9fb] selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* Top Bar (Contextual) */}
            <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-10 bg-white/70 backdrop-blur-[24px] border-b border-slate-200/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant text-sm font-medium">Finance</span>
                    <span className="material-symbols-outlined text-sm text-outline-variant">chevron_right</span>
                    <span className="text-on-surface text-sm font-bold">Bank Management</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">search</span>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
                    <div className="w-px h-6 bg-outline-variant/20 hidden md:block"></div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest hidden md:block">SCR-ADM-BANK-001</p>
                </div>
            </header>

            <div className="p-10 max-w-[1280px] mx-auto w-full">
                {/* Hero Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2 max-w-[672px]">
                        <h2 className="text-5xl font-black tracking-tighter text-on-surface italic uppercase">Manage Accounts</h2>
                        <p className="text-lg text-on-surface-variant font-medium leading-relaxed">Configure and audit institutional bank records for cross-border candidate placements and payroll distributions.</p>
                    </div>
                    <div>
                        <Link href="/admin/bank-accounts/new">
                            <button className="bg-primary text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Bank Account
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Quick Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-1 transition-transform duration-300">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Total Liquidity Accounts</p>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                            <span className="text-5xl font-black italic tracking-tighter text-on-surface">{accountList.length}</span>
                            <span className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">+2 this month</span>
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-1 transition-transform duration-300 transform md:translate-y-2">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Open Beneficiary</p>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                            <span className="text-5xl font-black italic tracking-tighter text-on-surface">09</span>
                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Active Channels</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-slate-800">
                        <div className="relative z-10">
                            <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-4">System Health</p>
                            <div className="flex items-center gap-4">
                                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] w-[98%]"></div>
                                </div>
                                <span className="text-2xl font-black italic tracking-tighter">98%</span>
                            </div>
                        </div>
                        <div className="absolute -right-6 -top-6 opacity-10">
                            <span className="material-symbols-outlined text-[120px] text-blue-400">shield_with_heart</span>
                        </div>
                    </div>
                </div>

                {/* Data Table Container */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-50">
                    <div className="p-8 flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 bg-slate-50/80 gap-6">
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:border-primary hover:text-primary transition-colors text-slate-500">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filter By Type</span>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                            <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:border-primary hover:text-primary transition-colors text-slate-500">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sort: Newest</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Details</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">Holder & Routing</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {accountList.map((acc: BankAccount) => (
                                    <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                                                    <span className="material-symbols-outlined font-bold text-[20px]">account_balance</span>
                                                </div>
                                                <div>
                                                    <div className="font-black text-xs text-on-surface uppercase tracking-tight mb-1">{acc.bankName}</div>
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                                        <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{acc.currency}</span>
                                                        <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{acc.accountNumber}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 hidden md:table-cell">
                                            <div className="flex flex-col gap-1 max-w-[320px]">
                                                <span className="text-xs font-bold text-slate-700">{acc.routingCode || 'N/A'}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">business</span> Corporate Entity
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${acc.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)] ${acc.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                {acc.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/bank-accounts/${acc.id}/edit`}>
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleDelete(acc.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-error transition-colors shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px] font-bold">delete_outline</span>
                                                </button>
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

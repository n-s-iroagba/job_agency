'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CryptoWallet } from '@/types/models';

export default function CryptoWalletsPage() {
    const { data: wallets, isLoading } = useApiQuery<{ rows: CryptoWallet[], count: number }>(['admin', 'crypto-wallets'], '/admin/crypto-wallets');

    const walletList = wallets?.rows || [];

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopNavBar Anchor */}
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-slate-900 italic uppercase">JobNexa</span>
                    <span className="mx-2 text-outline-variant">/</span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-on-surface-variant">Crypto Configuration</span>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-CRYPTO-001</p>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 w-full p-8 md:p-12 max-w-[1280px] mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-[672px]">
                        <nav className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <span>Finance</span>
                            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                            <span className="text-primary border-b border-primary/30 pb-0.5">Crypto Wallets</span>
                        </nav>
                        <h2 className="text-[3.5rem] font-black tracking-tighter text-on-surface leading-none mb-4 italic uppercase">Manage Assets</h2>
                        <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Monitor and configure institutional cryptocurrency repositories across multiple blockchain protocols.</p>
                    </div>
                    <div>
                        <Link href="/admin/crypto-wallets/new">
                            <button className="bg-primary bg-gradient-to-r from-primary to-blue-700 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                Add Wallet
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl shadow-inner border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Total Wallets</p>
                        <h3 className="text-5xl font-black tracking-tighter text-on-surface italic">{walletList.length}</h3>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl shadow-inner border border-slate-100 text-blue-600">
                                <span className="material-symbols-outlined text-[24px]">currency_bitcoin</span>
                            </div>
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Networks Supported</p>
                        <h3 className="text-5xl font-black tracking-tighter text-on-surface italic">6</h3>
                    </div>
                    <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white/10 rounded-2xl shadow-inner border border-white/5 text-emerald-400 backdrop-blur-md">
                                    <span className="material-symbols-outlined text-[24px]">security</span>
                                </div>
                                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">Secured</span>
                            </div>
                            <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">System Integrity</p>
                            <h3 className="text-5xl font-black tracking-tighter text-white italic">99.9%</h3>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[200px]">shield</span>
                        </div>
                    </div>
                </div>

                {/* Wallet Table Card */}
                <section className="bg-white rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 bg-slate-50/80 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-on-surface whitespace-nowrap">Configured Wallets</h3>
                            <div className="relative w-full sm:w-auto">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                                <input
                                    className="pl-12 pr-6 py-3 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-[11px] font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                                    placeholder="SEARCH ASSETS..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 hover:text-primary transition-colors hover:border-primary/30 w-full justify-center">
                                <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Wallet Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">Public Address</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Network</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {walletList.map((wallet: CryptoWallet) => (
                                    <tr key={wallet.id} className="hover:bg-slate-50/70 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0">
                                                    <span className="material-symbols-outlined font-bold text-[20px]">account_balance_wallet</span>
                                                </div>
                                                <span className="font-black text-xs text-on-surface uppercase tracking-tight">{wallet.displayLabel || wallet.currencyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 hidden md:table-cell">
                                            <div className="flex gap-3 items-center">
                                                <div className="bg-slate-100 flex items-center px-4 py-2 rounded-xl border border-slate-200">
                                                    <span className="text-[11px] font-medium font-mono text-slate-600 truncate max-w-[140px] tracking-widest">{wallet.walletAddress}</span>
                                                </div>
                                                <button className="text-slate-400 hover:text-primary transition-colors p-2 bg-white rounded-lg border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{wallet.networkType}</span>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${wallet.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)] ${wallet.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                {wallet.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/crypto-wallets/${wallet.id}/edit`}>
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
                                                    </button>
                                                </Link>
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-error transition-colors shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px] font-bold">delete_outline</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

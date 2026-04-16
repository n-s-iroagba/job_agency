'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CryptoWallet } from '@/types/models';

export default function CryptoWalletsPage() {
    const { data: wallets, isLoading } = useApiQuery<{ rows: CryptoWallet[], count: number }>(['admin', 'crypto-wallets'], '/admin/crypto-wallets');

    const walletList = wallets?.rows || [];

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Wallets...</div>;

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Crypto Wallets</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional payment repositories</p>
                </div>
                <Link href="/admin/crypto-wallets/new">
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                        Add Wallet
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Label / Currency</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Address / Network</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {walletList.map((wallet: CryptoWallet) => (
                                <tr key={wallet.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{wallet.displayLabel}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{wallet.currencyName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-mono text-slate-600 break-all max-w-[200px]">{wallet.walletAddress}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{wallet.networkType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${wallet.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {wallet.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link href={`/admin/crypto-wallets/${wallet.id}`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900">
                                                View
                                            </Link>
                                            <Link href={`/admin/crypto-wallets/${wallet.id}/edit`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600">
                                                Edit
                                            </Link>
                                            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {walletList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No wallets configured</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

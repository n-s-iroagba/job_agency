'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CryptoWallet } from '@/types/models';

export default function CryptoWalletViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: wallet, isLoading, error } = useApiQuery<CryptoWallet>(`/admin/crypto-wallets/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Verifying Ledger Record...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Ledger</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface pb-16 overflow-x-hidden">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator</h2>
                </div>
                <Link href={`/admin/crypto-wallets/${id}/edit`}>
                    <button className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">edit</span> Update Wallet
                    </button>
                </Link>
            </header>

            <main className="flex-1 w-full pt-16 pb-16 px-6 md:px-12 max-w-[896px] mx-auto">
                <Link href="/admin/crypto-wallets" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 w-fit">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Finance Hub</span>
                </Link>

                <div className="mb-12">
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase text-slate-900">{wallet?.displayLabel}</h1>
                    <div className="flex gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-200">
                            {wallet?.currencyName} / {wallet?.networkType}
                        </span>
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${wallet?.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                            {wallet?.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Settlement Address</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner group relative">
                        <p className="text-lg font-mono font-bold text-slate-900 break-all leading-relaxed pr-12">{wallet?.walletAddress}</p>
                        <button 
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            onClick={() => {
                                navigator.clipboard.writeText(wallet?.walletAddress || '');
                                alert('Address copied to clipboard');
                            }}
                        >
                            <span className="material-symbols-outlined">content_copy</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

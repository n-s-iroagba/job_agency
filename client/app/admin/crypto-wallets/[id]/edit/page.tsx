'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import CryptoWalletForm from '@/components/admin/forms/CryptoWalletForm';
import Link from 'next/link';

export default function CryptoWalletEditPage() {
    const params = useParams();
    const id = params?.id;
    const { data: wallet, isLoading, error } = useApiQuery<any>(`/admin/crypto-wallets/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Wallet Configuration...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Wallet</div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Standard Admin Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/admin/crypto-wallets" className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Configure Settlement Node</h1>
                </div>
            </header>

            <main className="p-6 md:p-10 max-w-4xl mx-auto w-full">
                <div className="mb-8">
                    <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Financials</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>Crypto Wallets</span>
                    </nav>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Refining <span className="text-blue-600">{wallet?.displayLabel}</span></h2>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-200 shadow-sm">
                    <CryptoWalletForm initialData={wallet} isEdit={true} />
                </div>
            </main>
        </div>
    );
}

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
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator</h2>
                </div>
            </header>

            <main className="flex-1 w-full pt-12 pb-20 px-6 md:px-12 max-w-[896px] mx-auto">
                <div className="mb-10">
                    <h3 className="text-[3.5rem] font-black text-on-surface tracking-tighter leading-none mb-4 italic uppercase text-slate-900">Edit <span className="text-primary">Digital Asset</span></h3>
                    <p className="text-on-surface-variant max-w-[576px] leading-relaxed font-medium text-lg">Modify secure digital settlement address for {wallet?.displayLabel}.</p>
                </div>

                <CryptoWalletForm initialData={wallet} isEdit={true} />
            </main>
        </div>
    );
}

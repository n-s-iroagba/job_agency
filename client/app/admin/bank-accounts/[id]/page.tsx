'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { BankAccount } from '@/types/models';

export default function BankAccountViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: bankAccount, isLoading, error } = useApiQuery<BankAccount>(`/admin/bank-accounts/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Fetching Secure Record...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Record</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface pb-16">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">CareerCurator</span>
                </div>
                <Link href={`/admin/bank-accounts/${id}/edit`}>
                    <button className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">edit</span> Edit Record
                    </button>
                </Link>
            </header>

            <main className="flex-1 w-full pt-16 pb-16 px-6 max-w-[896px] mx-auto">
                <Link href="/admin/bank-accounts" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 w-fit">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Inventory</span>
                </Link>

                <div className="mb-12">
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase text-slate-900">{bankAccount?.bankName}</h1>
                    <div className="flex gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-200">
                            {bankAccount?.currency} Settlement
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                            Type: {bankAccount?.accountType}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Account Number</label>
                            <p className="text-xl font-bold tracking-tight text-slate-900 font-mono">{bankAccount?.accountNumber}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Routing / Sort Code</label>
                            <p className="text-lg font-bold text-slate-700">{bankAccount?.routingCode || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Processing Instructions</label>
                        <p className="text-sm font-medium leading-relaxed opacity-80">{bankAccount?.instructions || 'No specific processing constraints defined for this record.'}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

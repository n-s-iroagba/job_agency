'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobBenefit } from '@/types/models';

export default function BenefitViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: benefit, isLoading, error } = useApiQuery<JobBenefit>(`/admin/benefits/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Benefit Profile...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Profile</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface pb-16">
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">CareerCurator</span>
                </div>
                <Link href={`/admin/benefits/${id}/edit`}>
                    <button className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">edit</span> Edit Benefit
                    </button>
                </Link>
            </header>

            <main className="mt-8 p-8 lg:p-12 max-w-[1152px] mx-auto w-full">
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                        <span>System</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href="/admin/benefits" className="hover:text-primary transition-colors">Benefits</Link>
                    </nav>
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase text-slate-900">{benefit?.benefitType}</h1>
                    <div className="flex gap-4">
                        <span className="px-4 py-2 bg-blue-50 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-blue-100">
                            Value: {benefit?.value}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">description</span>
                            Operational Description
                        </h3>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{benefit?.description}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-800">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Traceability Metadata</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal ID</span>
                                    <span className="text-[10px] font-mono text-white bg-white/10 px-2 py-0.5 rounded">BEN-{id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

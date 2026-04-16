'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobBenefit } from '@/types/models';

export default function BenefitViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: benefit, isLoading, error } = useApiQuery<JobBenefit>(['admin', 'benefits'], `/admin/benefits/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Benefit Details...</div>;
    if (error) return <div className="p-12 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Error Loading Record</div>;

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/benefits" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </Link>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Benefit Registry / {id}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{benefit?.benefitType}</h1>
                </div>
                <Link href={`/admin/benefits/${id}/edit`}>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">edit</span>
                        Edit Benefit
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Description</h3>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {benefit?.description || 'No description provided.'}
                        </p>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 pb-4 border-b border-slate-800">Benefit Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value</span>
                                <span className="text-sm font-medium">{benefit?.value || 'Standard'}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

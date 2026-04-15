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

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Benefit Profile...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Profile</div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Standard Admin Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/admin/benefits" className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Review Incentive</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/admin/benefits/${id}/edit`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit Profile
                        </button>
                    </Link>
                </div>
            </header>

            <main className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
                <div className="mb-8">
                    <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Registry</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>Benefits</span>
                    </nav>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-4">{benefit?.benefitType}</h2>
                    <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-widest rounded-lg border border-blue-100">
                            Fiscal Value: <span className="text-blue-900">{benefit?.value || 'N/A'}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6 pb-4 border-b border-slate-50">
                            <span className="material-symbols-outlined text-lg">description</span>
                            Provision Scope
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap italic">
                                {benefit?.description || 'No detailed scope configured for this incentive record.'}
                            </p>
                        </div>
                    </div>


                </div>
            </main>
        </div>
    );
}

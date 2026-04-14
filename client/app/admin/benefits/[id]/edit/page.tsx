'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import BenefitForm from '@/components/admin/forms/BenefitForm';
import Link from 'next/link';

export default function BenefitEditPage() {
    const params = useParams();
    const id = params?.id;
    const { data: benefit, isLoading, error } = useApiQuery<any>(['admin', 'benefits'], `/admin/benefits/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Benefit Data...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Benefit</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">CareerCurator</span>
                </div>
            </header>

            <div className="mt-8 p-8 lg:p-12 max-w-[1152px] mx-auto w-full">
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                        <span>System</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href="/admin/benefits" className="hover:text-primary transition-colors">Benefits</Link>
                    </nav>
                    <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-2 uppercase italic text-slate-900">Edit <span className="text-primary">Benefit</span></h2>
                </div>

                <BenefitForm initialData={benefit} isEdit={true} />
            </div>
        </div>
    );
}

'use client';

import BenefitForm from '@/components/admin/forms/BenefitForm';
import Link from 'next/link';

export default function BenefitFormPage() {
    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">JobNexa</span>
                </div>
            </header>

            <div className="mt-8 p-8 lg:p-12 max-w-[1152px] mx-auto w-full">
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                        <span>System</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href="/admin/benefits" className="hover:text-primary transition-colors">Benefits</Link>
                    </nav>
                    <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-2 uppercase italic">New Benefit</h2>
                </div>

                <BenefitForm />
            </div>
        </div>
    );
}


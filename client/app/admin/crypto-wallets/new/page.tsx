'use client';

import Link from 'next/link';
import CryptoWalletForm from '@/components/admin/forms/CryptoWalletForm';

export default function CryptoWalletNewPage() {
    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator</h2>
                </div>
            </header>

            <main className="flex-1 w-full pt-12 pb-20 px-6 md:px-12 max-w-[896px] mx-auto">
                <div className="mb-10">
                    <h3 className="text-[3.5rem] font-black text-on-surface tracking-tighter leading-none mb-4 italic uppercase">New <span className="text-primary">Digital Asset</span></h3>
                    <p className="text-on-surface-variant max-w-[576px] leading-relaxed font-medium text-lg">Setup a new cryptocurrency settlement address.</p>
                </div>

                <CryptoWalletForm />
            </main>
        </div>
    );
}

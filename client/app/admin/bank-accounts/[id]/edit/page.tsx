'use client';

import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import BankAccountForm from '@/components/admin/forms/BankAccountForm';
import Link from 'next/link';

export default function BankAccountEditPage() {
    const params = useParams();
    const id = params?.id;
    const { data: bankAccount, isLoading, error } = useApiQuery<any>(['admin', 'bank-accounts'], `/admin/bank-accounts/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Loading Configuration...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Account</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-slate-900 italic uppercase">CareerCurator</span>
                </div>
            </header>

            <main className="flex-1 w-full pt-16 pb-16 px-6 max-w-[896px] mx-auto">
                <Link href="/admin/bank-accounts" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 w-fit">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Accounts</span>
                </Link>

                <div className="mb-10 text-center">
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase text-slate-900">Edit <span className="text-primary">Bank Account</span></h1>
                    <p className="text-on-surface-variant text-lg font-medium max-w-[576px] mx-auto leading-relaxed">Modify secure financial endpoint for {bankAccount?.bankName}.</p>
                </div>

                <BankAccountForm initialData={bankAccount} isEdit={true} />
            </main>
        </div>
    );
}

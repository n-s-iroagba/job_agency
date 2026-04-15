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
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Standard Admin Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/admin/bank-accounts" className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Sync Financial Endpoint</h1>
                </div>
            </header>

            <main className="p-6 md:p-10 max-w-4xl mx-auto w-full">
                <div className="mb-8">
                    <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Financials</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>Custodial Accounts</span>
                    </nav>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Configuring <span className="text-blue-600">{bankAccount?.bankName}</span></h2>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-200 shadow-sm">
                    <BankAccountForm initialData={bankAccount} isEdit={true} />
                </div>
            </main>
        </div>
    );
}

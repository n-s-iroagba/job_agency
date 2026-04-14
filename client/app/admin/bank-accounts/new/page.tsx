'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApiMutation } from '@/lib/hooks';

export default function BankAccountFormPage() {
    const router = useRouter();
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountType, setAccountType] = useState('normal');
    const [routingCode, setRoutingCode] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [instructions, setInstructions] = useState('');

    const createMutation = useApiMutation('post', '/admin/bank-accounts', {
        onSuccess: () => {
            router.push('/admin/bank-accounts');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({
                bankName,
                accountNumber,
                accountType,
                routingCode,
                currency,
                instructions,
            });
        } catch (err) {
            alert('Failed to save bank account');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopNavBar Anchor */}
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-slate-900 italic uppercase">CareerCurator</span>
                    <span className="mx-2 text-outline-variant">/</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Banking Configuration</span>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-BANKFORM-001</p>
                </div>
            </header>

            {/* Content Canvas */}
            <main className="flex-1 w-full pt-16 pb-16 px-6 max-w-[896px] mx-auto">
                <Link href="/admin/bank-accounts" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 w-fit">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Accounts</span>
                </Link>

                {/* Breadcrumb & Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                        Traceability: STK-ADM-BANK-001
                    </div>
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase">Bank Account <span className="text-primary">Setup</span></h1>
                    <p className="text-on-surface-variant text-lg font-medium max-w-[576px] mx-auto leading-relaxed">
                        Configure secure financial endpoints for international candidate disbursements and agency payroll operations.
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Row 1: Bank Name */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="bank_name">Institutional Name</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">account_balance</span>
                                    <input
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
                                        id="bank_name"
                                        placeholder="e.g. International Finance Corp"
                                        type="text"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2: Account Number & Account Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="account_number">Account Number</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">payments</span>
                                        <input
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
                                            id="account_number"
                                            placeholder="0000 0000 0000"
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="account_type">Account Type</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">category</span>
                                        <select
                                            className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 appearance-none shadow-inner"
                                            id="account_type"
                                            value={accountType}
                                            onChange={(e) => setAccountType(e.target.value)}
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="open_beneficiary">Open Beneficiary</option>
                                        </select>
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-slate-400">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Routing/Sort Code & Currency */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="routing_code">Routing / Sort Code</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">pin</span>
                                        <input
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
                                            id="routing_code"
                                            placeholder="XY-12345"
                                            type="text"
                                            value={routingCode}
                                            onChange={(e) => setRoutingCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="currency">Currency Code</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">currency_exchange</span>
                                        <select
                                            className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 appearance-none shadow-inner"
                                            id="currency"
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                        >
                                            <option value="USD">USD - United States Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="SGD">SGD - Singapore Dollar</option>
                                            <option value="NGN">NGN - Nigerian Naira</option>
                                        </select>
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-slate-400">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 4: Additional Instructions */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="instructions">Processing Constraints</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-6 material-symbols-outlined text-outline">description</span>
                                    <textarea
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 resize-none leading-relaxed"
                                        id="instructions"
                                        placeholder="Mention any specific processing requirements or intermediary bank details..."
                                        rows={4}
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-slate-100">
                                <Link href="/admin/bank-accounts" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-10 py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 rounded-xl transition-all" type="button">
                                        Discard
                                    </button>
                                </Link>
                                <button
                                    className="w-full sm:w-auto px-12 py-4 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    type="submit"
                                    disabled={createMutation.isPending}
                                >
                                    <span className="material-symbols-outlined text-[16px] font-bold">verified_user</span>
                                    {createMutation.isPending ? 'Validating...' : 'Secure Account'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Safety/Security Footer */}
                    <div className="bg-slate-50 px-8 py-5 flex items-center justify-center gap-3 text-emerald-600 border-t border-slate-200/50">
                        <span className="material-symbols-outlined text-[20px]">shield</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">AES-256 Encrypted Infrastructure (NFR-SEC-009)</span>
                    </div>
                </div>

                {/* Supporting Context Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-50 border-t-[6px] border-t-primary">
                        <h4 className="font-black text-xl italic text-on-surface mb-2 uppercase tracking-tighter">Direct Deposit</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">Validated for instant candidate payouts across 40+ countries.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-50 border-t-[6px] border-t-blue-400">
                        <h4 className="font-black text-xl italic text-on-surface mb-2 uppercase tracking-tighter">Multi-Currency</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">Automatic FX conversion available for EUR/GBP settlement.</p>
                    </div>
                    <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl border border-slate-800 border-t-[6px] border-t-emerald-400">
                        <h4 className="font-black text-xl italic text-emerald-400 mb-2 uppercase tracking-tighter">Audit Trail</h4>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed">Logged change management tracked via STR-ADM-BANK-002.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

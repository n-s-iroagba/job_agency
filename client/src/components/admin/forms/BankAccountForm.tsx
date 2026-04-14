'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { BankAccount } from '@/types/models';

interface BankAccountFormProps {
    initialData?: BankAccount;
    isEdit?: boolean;
}

export default function BankAccountForm({ initialData, isEdit = false }: BankAccountFormProps) {
    const router = useRouter();
    const [bankName, setBankName] = useState(initialData?.bankName || '');
    const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || '');
    const [accountType, setAccountType] = useState(initialData?.accountType || 'normal');
    const [routingCode, setRoutingCode] = useState(initialData?.routingCode || '');
    const [currency, setCurrency] = useState(initialData?.currency || 'USD');
    const [instructions, setInstructions] = useState(initialData?.instructions || '');

    useEffect(() => {
        if (initialData) {
            setBankName(initialData.bankName);
            setAccountNumber(initialData.accountNumber);
            setAccountType(initialData.accountType);
            setRoutingCode(initialData.routingCode || '');
            setCurrency(initialData.currency);
            setInstructions(initialData.instructions || '');
        }
    }, [initialData]);

    const mutation = useApiMutation(
        isEdit ? 'put' : 'post',
        isEdit ? `/admin/bank-accounts/${initialData?.id}` : '/admin/bank-accounts',
        {
            onSuccess: () => {
                router.push('/admin/bank-accounts');
                router.refresh();
            }
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutation.mutateAsync({
                bankName,
                accountNumber,
                accountType,
                routingCode,
                currency,
                instructions,
            });
        } catch (err) {
            alert(`Failed to ${isEdit ? 'update' : 'create'} bank account`);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden text-slate-900 selection:bg-primary/10 selection:text-primary">
            <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
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

                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest" htmlFor="instructions">Processing Constraints</label>
                        <textarea
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 resize-none leading-relaxed"
                            id="instructions"
                            placeholder="Mention any specific processing requirements..."
                            rows={4}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-slate-100">
                        <Link href="/admin/bank-accounts" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-10 py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 rounded-xl transition-all" type="button">Discard</button>
                        </Link>
                        <button
                            className="w-full sm:w-auto px-12 py-4 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            <span className="material-symbols-outlined text-[16px] font-bold">verified_user</span>
                            {mutation.isPending ? 'Validating...' : isEdit ? 'Update Account' : 'Secure Account'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-slate-50 px-8 py-5 flex items-center justify-center gap-3 text-emerald-600 border-t border-slate-200/50">
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">AES-256 Encrypted Infrastructure</span>
            </div>
        </div>
    );
}

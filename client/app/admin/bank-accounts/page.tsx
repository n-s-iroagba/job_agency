'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import {
    Plus,
    Edit,
    Trash2,
    Building2,
    Wallet,
    CheckCircle2,
    Shield
} from 'lucide-react';
import api from '@/lib/api';

export default function FinancialSettingsPage() {
    const { data: configs, isLoading, refetch } = useApiQuery<any>(['admin', 'finance', 'configs'], '/admin/finance/configs');
    const [activeTab, setActiveTab] = useState<'bank' | 'crypto'>('bank');

    const deleteMutation = useApiMutation('delete', '/admin', {
        onSuccess: () => refetch()
    });

    const executeDelete = async (type: 'bank-accounts' | 'crypto-wallets', id: number) => {
        if (!confirm('Are you sure? This may affect active application payment flows.')) return;
        try {
            await api.delete(`/admin/${type}/${id}`);
            refetch();
        } catch (err) { alert('Delete failed'); }
    };

    if (isLoading) return <div className="card h-96 animate-pulse bg-slate-100" />;

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1>Financial Infrastructure</h1>
                    <p className="text-text-secondary">Configure collection accounts and payment mapping (STK-ADM-BANK-001, STK-ADM-CRYPTO-001)</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New {activeTab === 'bank' ? 'Account' : 'Wallet'}
                </button>
            </header>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-md w-fit">
                <button
                    onClick={() => setActiveTab('bank')}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'bank' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'}`}
                >
                    Bank Accounts
                </button>
                <button
                    onClick={() => setActiveTab('crypto')}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'crypto' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'}`}
                >
                    Crypto Wallets
                </button>
            </div>

            {activeTab === 'bank' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {configs?.bankAccounts?.map((acc: any) => (
                        <div key={acc.id} className="card border-l-4 border-l-primary flex flex-col justify-between group">
                            <div className="space-y-md">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-blue-50 text-primary rounded-md"><Building2 className="w-5 h-5" /></div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 hover:bg-slate-100 rounded border border-border"><Edit className="w-3.5 h-3.5 text-text-secondary" /></button>
                                        <button onClick={() => executeDelete('bank-accounts', acc.id)} className="p-1 hover:bg-red-50 rounded border border-red-100 text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary text-lg leading-tight">{acc.bankName}</h4>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{acc.type} Account</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-text-primary"><span className="text-text-secondary">Name:</span> {acc.accountName}</p>
                                    <p className="text-sm font-mono font-bold tracking-tight">{acc.accountNumber}</p>
                                </div>
                            </div>
                            <div className="mt-xl pt-md border-t border-border flex justify-between items-center text-[10px]">
                                <span className={acc.isActive ? 'text-success font-bold' : 'text-slate-400'}>
                                    {acc.isActive ? '● SYSTEM ACTIVE' : '○ INACTIVE'}
                                </span>
                                <span className="font-mono text-slate-400">ID: {acc.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {configs?.cryptoWallets?.map((w: any) => (
                        <div key={w.id} className="card border-l-4 border-l-admin-accent flex flex-col justify-between group">
                            <div className="space-y-md">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-purple-50 text-admin-accent rounded-md"><Wallet className="w-5 h-5" /></div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 hover:bg-slate-100 rounded border border-border"><Edit className="w-3.5 h-3.5 text-text-secondary" /></button>
                                        <button onClick={() => executeDelete('crypto-wallets', w.id)} className="p-1 hover:bg-red-50 rounded border border-red-100 text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary text-lg leading-tight">{w.type} Wallet</h4>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{w.network} Network</p>
                                </div>
                                <p className="text-[11px] font-mono break-all font-semibold bg-slate-50 p-2 rounded border border-border">{w.address}</p>
                            </div>
                            <div className="mt-xl pt-md border-t border-border flex justify-between items-center text-[10px]">
                                <span className={w.isActive ? 'text-success font-bold' : 'text-slate-400'}>
                                    {w.isActive ? '● ACTIVE' : '○ DISABLED'}
                                </span>
                                <span className="font-mono text-slate-400">ID: {w.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <section className="card bg-blue-50/20 border-blue-100 space-y-md">
                <h4 className="font-bold flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Multi-Routing Configuration (STK-ADM-BANK-003)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                    Bank accounts are automatically routed based on the payment amount threshold.
                    Accounts marked as <strong>Open Beneficiary</strong> will be shown for transactions ≥ $5,000,
                    while <strong>Normal</strong> accounts are for smaller transactions.
                    Verify each account with your local bank branch after configuring.
                </p>
            </section>
        </div>
    );
}

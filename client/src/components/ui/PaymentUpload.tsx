'use client';

import React, { useState } from 'react';
import { useApiQuery } from '@/lib/hooks';
import api from '@/lib/api';

interface PaymentUploadProps {
    paymentId: number;
    amount: number;
    onSuccess: () => void;
}

export function PaymentUpload({ paymentId, amount, onSuccess }: PaymentUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const { data: details, isLoading } = useApiQuery<any>(
        ['payment', 'details', paymentId],
        `/payments/${paymentId}`,
        { enabled: !!paymentId }
    );

    const bankAccounts = details?.bankAccounts || [];
    const wallets = details?.cryptoWallets || [];

    const handleCopy = (val: string, key: string) => {
        navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('proof', file);

        try {
            await api.post(`/payments/${paymentId}/proof`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
        } catch (err: any) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Syncing Settlement Nodes...</div>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Settlement */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">Protocol 1: Bank Settlement</h4>
                    {bankAccounts && bankAccounts.length > 0 ? (
                        <div className="space-y-3">
                            {bankAccounts.map((acc: any) => (
                                <div key={acc.id} className="p-5 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                                    <div>
                                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Beneficiary</p>
                                        <p className="text-sm font-bold text-blue-900 uppercase">
                                            {amount < 5000 ? 'Jobnexa LLC' : 'Application Manager'}
                                        </p>
                                        <p className="text-[10px] text-blue-500 font-medium uppercase">{acc.bankName}</p>
                                    </div>
                                    <div className="pt-3 border-t border-blue-100 flex justify-between items-center group">
                                        <div className="select-all">
                                            <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Account Number</p>
                                            <p className="text-xs font-mono font-bold text-blue-900 tracking-wider">{acc.accountNumber}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(acc.accountNumber, `bank-${acc.id}`)}
                                            className="text-[9px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-900 transition-colors"
                                        >
                                            {copied === `bank-${acc.id}` ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="p-5 text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-50 rounded-xl border border-blue-100 border-dashed">No active bank nodes</p>}
                </div>

                {/* Crypto Settlement */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">Protocol 2: Crypto Transfer</h4>
                    {wallets && wallets.length > 0 ? (
                        <div className="space-y-3">
                            {wallets.map((w: any) => (
                                <div key={w.id} className="p-5 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">{w.networkType}</p>
                                            <p className="text-sm font-bold text-blue-900 uppercase">{w.currencyName}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(w.walletAddress, `crypto-${w.id}`)}
                                            className="text-[9px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-900 transition-colors"
                                        >
                                            {copied === `crypto-${w.id}` ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-blue-100 border-dashed select-all overflow-hidden">
                                        <p className="text-[10px] font-mono text-blue-500 break-all leading-relaxed">{w.walletAddress}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="p-5 text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-50 rounded-xl border border-blue-100 border-dashed">No active crypto nodes</p>}
                </div>
            </div>

            <div className="pt-8 border-t border-blue-50">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Submission Audit</h4>
                <p className="text-[10px] text-blue-500 font-medium mb-6 italic">Upload a high-fidelity screenshot of the transaction receipt. Reference #CC-{paymentId.toString().padStart(5, '0')} must be included.</p>

                <div className="relative group">
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-blue-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">upload_file</span>
                        {uploading ? 'Archiving Proof...' : 'Submit Settlement Proof'}
                    </div>
                </div>
            </div>
        </div>
    );
}

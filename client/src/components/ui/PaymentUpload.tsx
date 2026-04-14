'use client';

import React, { useState } from 'react';
import { useApiQuery } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import {
    Upload,
    AlertCircle,
    Copy,
    Check
} from 'lucide-react';
import api from '@/lib/api';

interface PaymentUploadProps {
    applicationId: number;
    stageId: number;
    amount: number;
    onSuccess: () => void;
}

export function PaymentUpload({ applicationId, stageId, amount, onSuccess }: PaymentUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // STK-ADM-BANK-003: Fetch bank details for this specific amount
    const { data: bankAccounts } = useApiQuery<any[]>(
        ['finance', 'bank', 'amount'],
        `/admin/finance/bank-accounts/by-amount?amount=${amount}`
    );

    // STK-ADM-CRYPTO-003: Active wallets
    const { data: wallets } = useApiQuery<any[]>(['finance', 'crypto', 'active'], '/wallets/active');

    const handleCopy = (val: string, key: string) => {
        navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TRUST-007 Validation
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
            return;
        }

        setError(null);
        setUploading(true);

        const formData = new FormData();
        formData.append('proof', file);

        try {
            await api.post(`/payments/${applicationId}/proof?stageId=${stageId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg overflow-hidden">
                {/* Bank Transfer Instructions */}
                <div className="card bg-surface">
                    <h4 className="font-bold mb-md">Option 1: Bank Transfer</h4>
                    {bankAccounts && bankAccounts.length > 0 ? (
                        <div className="space-y-md">
                            {bankAccounts.map(acc => (
                                <div key={acc.id} className="text-xs p-md bg-slate-50 border border-border rounded-md space-y-1">
                                    <p className="font-bold text-text-primary uppercase tracking-wide">{acc.type} ACCOUNT</p>
                                    <p>Bank: <span className="font-semibold">{acc.bankName}</span></p>
                                    <p>Name: <span className="font-semibold">{acc.accountName}</span></p>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                                        <span className="font-mono text-lg font-bold">{acc.accountNumber}</span>
                                        <button
                                            onClick={() => handleCopy(acc.accountNumber, `bank-${acc.id}`)}
                                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                                        >
                                            {copied === `bank-${acc.id}` ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-xs text-text-secondary">Loading local bank details...</p>}
                </div>

                {/* Crypto Instructions */}
                <div className="card bg-surface">
                    <h4 className="font-bold mb-md text-admin-accent">Option 2: Cryptocurrency</h4>
                    {wallets && wallets.length > 0 ? (
                        <div className="space-y-md">
                            {wallets.map(w => (
                                <div key={w.id} className="text-xs p-md bg-purple-50/50 border border-purple-100 rounded-md space-y-1">
                                    <p className="font-bold text-purple-700 uppercase tracking-wide">{w.type} ({w.network})</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-mono break-all font-semibold mr-2">{w.address}</span>
                                        <button
                                            onClick={() => handleCopy(w.address, `crypto-${w.id}`)}
                                            className="p-1 hover:bg-purple-100 rounded transition-colors flex-shrink-0"
                                        >
                                            {copied === `crypto-${w.id}` ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-xs text-text-secondary">Loading crypto wallets...</p>}
                </div>
            </div>

            {/* Evidence Submission - TRUST-007 */}
            <div className="card border-primary/20 bg-blue-50/10">
                <h4 className="font-bold mb-md">Step 2: Submit Payment Evidence</h4>
                <p className="text-xs text-text-secondary mb-xl">
                    Once paid, upload a clear screenshot of the transaction receipt.
                    Include your reference #{applicationId.toString().padStart(5, '0')} in the bank description if possible.
                </p>

                <label className="btn-primary cursor-pointer w-full inline-flex items-center justify-center gap-2 py-3">
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload Receipt Screenshot'}
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={uploading} />
                </label>

                {error && (
                    <div className="flex items-center gap-2 text-danger text-xs mt-md">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
            </div>
        </div>
    );
}

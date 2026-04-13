'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    ExternalLink,
    AlertTriangle
} from 'lucide-react';
import { CONSTANTS } from '@/constants';
import api from '@/lib/api';

export default function UnverifiedProofsPage() {
    const { data: proofs, isLoading, refetch } = useApiQuery<any>(
        ['admin', 'payments', 'unverified'],
        '/admin/payments/unverified'
    );
    const [selectedProof, setSelectedProof] = useState<any>(null);
    const [note, setNote] = useState('');

    const verifyMutation = useApiMutation('post', '', {
        onSuccess: () => {
            refetch();
            setSelectedProof(null);
            setNote('');
        }
    });

    const handleVerify = (id: number, status: string) => {
        verifyMutation.mutate({
            status,
            adminNote: note
        }, {
            // Override URL
            // baseUrl + /payments/${id}/verify
        });
        // Fixing the mutation call - our hook needs a fix or wrap
    };

    // Verification execution
    const executeVerify = async (id: number, status: string) => {
        try {
            await api.post(`/admin/payments/${id}/verify`, { status, adminNote: note });
            refetch();
            setSelectedProof(null);
            setNote('');
        } catch (err) { alert('Verification failed'); }
    };

    if (isLoading) return <div className="card h-96 animate-pulse bg-slate-100" />;

    const proofList = proofs?.rows || proofs || [];

    return (
        <div className="space-y-xl">
            <header>
                <h1>Payment Verification Queue</h1>
                <p className="text-text-secondary">Verify uploaded screenshots and acknowledge payments (TRUST-007, STK-ADM-PAY-004)</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
                <div className="lg:col-span-2 card p-0 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-border">
                            <tr>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Applicant</th>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Amount</th>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Status</th>
                                <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {proofList.length === 0 ? (
                                <tr><td colSpan={4} className="p-xl text-center text-sm text-text-secondary">No proofs awaiting verification.</td></tr>
                            ) : proofList.map((p: any) => (
                                <tr key={p.id} className={`hover:bg-slate-50 cursor-pointer ${selectedProof?.id === p.id ? 'bg-blue-50/50' : ''}`} onClick={() => setSelectedProof(p)}>
                                    <td className="px-lg py-4">
                                        <p className="font-bold">App #{p.applicationId.toString().padStart(5, '0')}</p>
                                        <p className="text-[10px] text-text-secondary">{new Date(p.updatedAt).toLocaleString()}</p>
                                    </td>
                                    <td className="px-lg py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold">${p.amount}</span>
                                            {p.amount >= 5000 && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}

                                        </div>
                                    </td>
                                    <td className="px-lg py-4">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                                            <Clock className="w-3 h-3" /> {p.status}
                                        </span>
                                    </td>
                                    <td className="px-lg py-4 text-right">
                                        <button className="text-primary hover:underline text-xs font-bold flex items-center justify-end gap-1">
                                            Inspect <Eye className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-lg">
                    {selectedProof ? (
                        <div className="card space-y-lg sticky top-24">
                            <h3 className="pb-md border-b border-border">Verification Details</h3>

                            <div className="aspect-video bg-slate-900 rounded-md flex items-center justify-center relative group">
                                {selectedProof.proofUrl?.endsWith('.pdf') ? (

                                    <div className="text-center text-white p-lg">
                                        <p className="text-xs mb-md">PDF Document Uploaded</p>
                                        <a href={selectedProof.proofUrl} target="_blank" className="btn-primary inline-flex items-center gap-2">View Document <ExternalLink className="w-3.5 h-3.5" /></a>
                                    </div>
                                ) : (
                                    <img src={selectedProof.proofUrl} alt="Payment Proof" className="max-h-full object-contain" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a href={selectedProof.proofUrl} target="_blank" className="text-white bg-slate-800 p-2 rounded-full"><ExternalLink className="w-5 h-5" /></a>
                                </div>
                            </div>

                            <div className="space-y-sm">
                                <label className="label">Admin Note (Sent to Applicant)</label>
                                <textarea
                                    className="input min-h-[80px]"
                                    placeholder="e.g., Confirmed receipt. Proceeding to Stage 3."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-md">
                                <button
                                    onClick={() => executeVerify(selectedProof.id, CONSTANTS.STATUSES.PAYMENT.PAID)}
                                    className="flex items-center justify-center gap-2 bg-success text-white py-2.5 rounded-md text-sm font-bold hover:bg-green-600 transition-colors"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() => executeVerify(selectedProof.id, CONSTANTS.STATUSES.PAYMENT.REJECTED)}
                                    className="flex items-center justify-center gap-2 border border-danger text-danger py-2.5 rounded-md text-sm font-bold hover:bg-red-50 transition-colors"
                                >
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card py-24 text-center text-text-secondary flex flex-col items-center gap-md">
                            <Eye className="w-12 h-12 opacity-10" />
                            <p className="text-sm">Select a proof from the list to inspect and verify.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

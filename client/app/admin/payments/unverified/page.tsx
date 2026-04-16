'use client';

import React, { useState } from 'react';
import { useApiQuery } from '@/lib/hooks';
import api from '@/lib/api';
import { Payment } from '@/types/models';

export default function UnverifiedProofsPage() {
    const { data: proofs, isLoading, refetch } = useApiQuery<{ rows: Payment[], count: number }>(
        ['admin', 'payments', 'unverified'],
        '/admin/payments/unverified'
    );
    const [selectedProof, setSelectedProof] = useState<Payment | null>(null);
    const [note, setNote] = useState('');

    const executeVerify = async (id: number, status: 'PAID' | 'REJECTED') => {
        try {
            await api.post(`/admin/payments/${id}/verify`, { 
                isApproved: status === 'PAID', 
                note 
            });
            refetch();
            setSelectedProof(null);
            setNote('');
        } catch (err) { 
            console.error(err);
        }
    };

    const proofList = proofs?.rows || [];
    const totalPending = proofs?.count || 0;
    const pendingValue = proofList.reduce((acc: number, p: Payment) => acc + (p.amount || 0), 0);

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Proofs...</div>;

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Verification</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit submitted proof of payments</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending Value</span>
                        <span className="text-xl font-bold text-slate-900">${pendingValue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {proofList.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification queue is empty</p>
                    </div>
                ) : proofList.map((p: Payment) => (
                    <div key={p.id} className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-8 ${p.amount >= 5000 ? 'ring-1 ring-slate-900 shadow-md' : ''}`}>
                        <div 
                            className="w-24 h-32 rounded-lg bg-slate-100 overflow-hidden cursor-pointer border border-slate-100 shrink-0 shadow-inner group relative"
                            onClick={() => setSelectedProof(p)}
                        >
                            {p.proofUrl?.endsWith('.pdf') ? (
                                <div className="h-full flex items-center justify-center bg-slate-200">
                                    <span className="material-symbols-outlined text-slate-400">picture_as_pdf</span>
                                </div>
                            ) : (
                                <img src={p.proofUrl || ''} alt="Proof" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            )}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined text-white text-base">zoom_in</span>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Applicant</span>
                                <p className="text-sm font-bold text-slate-900 mt-1">{p.Application?.User?.fullName || 'Anonymous'}</p>
                                <p className="text-[10px] text-slate-500 font-medium">#{p.applicationId}</p>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amount</span>
                                <p className="text-2xl font-bold text-slate-900 tracking-tight mt-1">${p.amount.toLocaleString()}</p>
                                {p.amount >= 5000 && <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded">High Value</span>}
                            </div>
                            <div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submitted</span>
                                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight mt-1">{new Date(p.updatedAt).toLocaleDateString()}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{new Date(p.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button 
                                onClick={() => executeVerify(p.id, 'PAID')}
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                            >
                                Verify
                            </button>
                            <button 
                                onClick={() => { setSelectedProof(p); setNote(''); }}
                                className="bg-white text-slate-900 border border-slate-200 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Inspect
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row h-[80vh] overflow-hidden border border-slate-100">
                        <div className="flex-1 bg-slate-50 relative border-r border-slate-100">
                            {selectedProof.proofUrl?.endsWith('.pdf') ? (
                                <iframe src={selectedProof.proofUrl} className="w-full h-full" />
                            ) : (
                                <img src={selectedProof.proofUrl || ''} className="w-full h-full object-contain p-8" />
                            )}
                            <button onClick={() => setSelectedProof(null)} className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-sm hover:bg-slate-50 transition-all border border-slate-200">
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <div className="w-full md:w-80 p-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Action</h3>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight">Review Proof</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Internal Note</label>
                                    <textarea 
                                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all outline-none focus:ring-2 focus:ring-slate-900/5 resize-none"
                                        placeholder="Add verification notes..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                    <p className="text-[9px] text-slate-400 italic">This note is shared with the applicant.</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => executeVerify(selectedProof.id, 'PAID')}
                                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Approve Proof
                                </button>
                                <button 
                                    onClick={() => executeVerify(selectedProof.id, 'REJECTED')}
                                    className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all"
                                >
                                    Reject Proof
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

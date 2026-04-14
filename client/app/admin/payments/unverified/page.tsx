'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import api from '@/lib/api';
import Link from 'next/link';
import { Payment } from '@/types/models';

export default function UnverifiedProofsPage() {
    const { data: proofs, isLoading, refetch } = useApiQuery<{ rows: Payment[], count: number }>(
        ['admin', 'payments', 'unverified'],
        '/admin/payments/unverified'
    );
    const [selectedProof, setSelectedProof] = useState<Payment | null>(null);
    const [note, setNote] = useState('');

    const executeVerify = async (id: number, status: string) => {
        try {
            await api.post(`/admin/payments/${id}/verify`, { status, adminNote: note });
            refetch();
            setSelectedProof(null);
            setNote('');
        } catch (err) { alert('Verification failed'); }
    };

    const proofList = proofs?.rows || [];
    const totalPending = proofs?.count || 0;
    const pendingValue = proofList.reduce((acc: number, p: Payment) => acc + (p.amount || 0), 0);
    const highValueCount = proofList.filter((p: Payment) => (p.amount || 0) >= 5000).length;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
            {/* Header / AppBar (Local) */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter">Verification Queue</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Manual Audit</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all cursor-pointer">Rejection Logs</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" style={{ fontSize: '18px' }}>search</span>
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                            placeholder="Identify transaction..."
                            type="text"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-12 space-y-12 max-w-[1280px]">
                {/* Hero Stats / Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Compliance & Audit</span>
                        <h2 className="text-[4rem] font-black tracking-tighter text-on-surface leading-none uppercase">Unverified Payments</h2>
                        <p className="text-on-surface-variant text-lg max-w-[672px] font-light italic leading-relaxed">
                            Confirm candidate deposit screenshots to finalize enrollment. High-value transactions are <span className="text-tertiary font-bold not-italic">flagged</span> for priority audit.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col items-start gap-2 min-w-[200px] border border-slate-50 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <span className="material-symbols-outlined text-8xl font-bold">account_balance_wallet</span>
                            </div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Pending Total</p>
                            <p className="text-3xl font-black text-on-surface tracking-tighter">${pendingValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col items-start gap-2 min-w-[200px] border border-slate-50 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700 text-tertiary">
                                <span className="material-symbols-outlined text-8xl font-bold">priority_high</span>
                            </div>
                            <p className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em]">High Value</p>
                            <p className="text-3xl font-black text-on-surface tracking-tighter">{highValueCount.toString().padStart(2, '0')} <span className="text-xs text-slate-400 font-bold">Items</span></p>
                        </div>
                    </div>
                </div>

                {/* List of Payments */}
                <div className="space-y-8">
                    {isLoading ? (
                        [1, 2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-3xl animate-pulse" />)
                    ) : proofList.length === 0 ? (
                        <div className="py-24 text-center">
                            <span className="material-symbols-outlined text-8xl text-slate-100 mb-6 font-bold uppercase">verified_user</span>
                            <p className="text-slate-400 font-black uppercase tracking-[0.4em] italic text-sm">Audit Queue Zeroed • All transactions verified</p>
                        </div>
                    ) : proofList.map((p: Payment) => (
                        <div key={p.id} className={`group bg-white rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden border border-slate-50 ${p.amount >= 5000 ? 'border-l-8 border-tertiary' : ''}`}>
                            {p.amount >= 5000 && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-tertiary text-white px-6 py-2 text-[9px] font-black tracking-[0.2em] uppercase rounded-bl-3xl shadow-lg shadow-tertiary/20">
                                        Priority Audit • High Value
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                                {/* Proof Image Preview */}
                                <div
                                    className="w-32 h-44 rounded-2xl bg-slate-900 overflow-hidden cursor-pointer relative shadow-2xl shadow-slate-300 active:scale-95 transition-all group-hover:rotate-1"
                                    onClick={() => setSelectedProof(p)}
                                >
                                    {p.proofUrl?.endsWith('.pdf') ? (
                                        <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                                            <span className="material-symbols-outlined text-white text-4xl mb-2 font-bold">picture_as_pdf</span>
                                            <span className="text-[8px] text-white/50 font-black uppercase tracking-widest">Digital PDF</span>
                                        </div>
                                    ) : (
                                        <img src={p.proofUrl || ''} alt="Proof" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white font-bold" style={{ fontSize: '32px' }}>zoom_in</span>
                                    </div>
                                </div>

                                {/* Transaction Info */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="space-y-2">
                                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Applicant Trace</h4>
                                        <p className="font-black text-xl text-on-surface uppercase tracking-tighter">{p.Application?.User?.fullName || `User ID: ${p.Application?.userId}`}</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">App ID: #{p.applicationId.toString().padStart(5, '0')}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Financial Payload</h4>
                                        <p className="font-black text-[2.5rem] text-primary tracking-tighter leading-none italic">${p.amount.toLocaleString()}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Batch Ref: #PF-{p.id + 90000}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Audit Metadata</h4>
                                        <p className="text-xs font-black text-on-surface uppercase tracking-tight"> {new Date(p.updatedAt).toLocaleDateString()} · {new Date(p.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-1 italic tracking-widest uppercase">{p.Verifier ? `Verified by ${p.Verifier.fullName}` : 'Verified Hash • Origin IP Hidden'}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-4 shrink-0">
                                    <button
                                        onClick={() => executeVerify(p.id, 'PAID')}
                                        className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-sm font-bold">verified</span> Verify
                                    </button>
                                    <button
                                        onClick={() => { setSelectedProof(p); setNote(''); }}
                                        className="flex items-center justify-center gap-3 px-10 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-error/5 hover:text-error hover:border-error/20 transition-all active:scale-95 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-sm font-bold">block</span> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-12">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing <span className="text-on-surface">{proofList.length}</span> of <span className="text-on-surface">{proofList.length}</span> audit nodes</span>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed border border-slate-100">
                            <span className="material-symbols-outlined font-bold">chevron_left</span>
                        </button>
                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-200">1</button>
                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 font-black text-xs">2</button>
                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-100 hover:bg-primary hover:text-white transition-all text-slate-400 shadow-sm">
                            <span className="material-symbols-outlined font-bold">chevron_right</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Lightbox / Modal for Rejection or Inspection */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/95 backdrop-blur-3xl animate-in fade-in transition-all">
                    <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-[1024px] flex flex-col md:flex-row h-[80vh]">
                        <div className="flex-1 bg-slate-100 relative group overflow-hidden">
                            {selectedProof.proofUrl?.endsWith('.pdf') ? (
                                <iframe src={selectedProof.proofUrl} className="w-full h-full border-none" />
                            ) : (
                                <img src={selectedProof.proofUrl || ''} alt="Inspection" className="w-full h-full object-contain p-10 drop-shadow-2xl" />
                            )}
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="absolute top-8 left-8 p-4 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-2xl backdrop-blur-xl transition-all shadow-2xl"
                            >
                                <span className="material-symbols-outlined font-bold">close</span>
                            </button>
                        </div>
                        <div className="w-full md:w-[400px] p-12 flex flex-col justify-between border-l border-slate-50">
                            <div className="space-y-8">
                                <div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block mb-2">Audit Decision</span>
                                    <h3 className="text-3xl font-black text-on-surface uppercase tracking-tighter">Verify Receipt</h3>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Audit Memorandum (Sent to Candidate)</label>
                                    <textarea
                                        className="w-full min-h-[160px] p-6 rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-primary/20 text-xs font-bold leading-relaxed transition-all italic text-slate-600"
                                        placeholder="Add operational notes here..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>

                                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <p className="text-[9px] text-blue-800 font-medium italic leading-relaxed">
                                        Note: Positive verification will automatically transition the applicant to the subsequent pipeline node.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => executeVerify(selectedProof.id, 'PAID')}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all active:scale-95"
                                >
                                    Confirm Audit
                                </button>
                                <button
                                    onClick={() => executeVerify(selectedProof.id, 'REJECTED')}
                                    className="w-full py-5 bg-white border border-slate-100 text-error rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-error/5 hover:border-error/20 transition-all active:scale-95"
                                >
                                    Reject Payload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

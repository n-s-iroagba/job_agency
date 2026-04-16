'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { Payment } from '@/types/models';
import { useQueryClient } from '@tanstack/react-query';

export default function UnpaidQueuePage() {
    const queryClient = useQueryClient();
    const { data: unpaid, isLoading } = useApiQuery<{ rows: Payment[], count: number }>(['admin', 'payments', 'unpaid'], '/admin/payments/unpaid');

    const verifyMutation = useApiMutation<any, any>('post', '/admin/payments/:id/verify', {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'payments', 'unpaid'] });
        }
    });

    const unpaidList = unpaid?.rows || [];
    const totalCount = unpaid?.count || 0;
    const totalOverdue = unpaidList.reduce((acc: number, p: Payment) => acc + (p.amount || 0), 0);

    const handleMarkAsPaid = async (id: number) => {
        if (!confirm('Mark this payment as received?')) return;
        try {
            await verifyMutation.mutateAsync({ data: { isApproved: true }, params: { id } });
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Loading Payment Queue...</div>;

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Unpaid Payments</h1>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Pending stage fees across all applications</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-xl border border-blue-100 shadow-sm flex flex-col">
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Outstanding</span>
                        <span className="text-xl font-bold text-blue-900">${totalOverdue.toLocaleString()}</span>
                    </div>
                    <div className="bg-blue-900 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-900/10 flex flex-col">
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Queue Size</span>
                        <span className="text-xl font-bold">{totalCount} Items</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50 border-b border-blue-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-400">Applicant</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-400">Job / Stage</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-400 text-right">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-400">Due Since</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-blue-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {unpaidList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                                        No outstanding payments found
                                    </td>
                                </tr>
                            ) : unpaidList.map((p: Payment) => (
                                <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-blue-900">{p.Application?.User?.fullName || 'Anonymous'}</span>
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">{p.Application?.User?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-blue-600">{p.Application?.JobListing?.title}</span>
                                            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mt-0.5">{p.JobStage?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-blue-900">
                                        ${p.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 text-[9px] font-bold uppercase tracking-widest border border-red-100">
                                            {Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24))} Days Ago
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => handleMarkAsPaid(p.id)}
                                            className="text-[10px] font-bold text-blue-900 uppercase tracking-widest hover:bg-blue-900 hover:text-white px-3 py-1.5 rounded border border-blue-900 transition-all shadow-sm"
                                        >
                                            Mark Paid
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

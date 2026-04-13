'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import {
    Clock,
    AlertCircle,
    ArrowRight,
    Search,
    ChevronRight,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export default function UnpaidQueuePage() {
    const { data: unpaid, isLoading } = useApiQuery<any>(['admin', 'payments', 'unpaid'], '/admin/payments/unpaid');

    if (isLoading) return <div className="space-y-md animate-pulse">
        {[1, 2, 4].map(i => <div key={i} className="card h-20 bg-slate-50" />)}
    </div>;

    const unpaidList = unpaid?.rows || unpaid || [];

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1>Unpaid Applications Queue</h1>
                    <p className="text-text-secondary">Applications stalled at payment stages (SCR-ADM-PAY-003)</p>
                </div>
                <div className="bg-amber-50 px-4 py-2 rounded-md border border-amber-100 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <div>
                        <p className="text-[10px] font-bold text-amber-800 uppercase">Awaiting Action</p>
                        <p className="text-sm font-bold text-amber-900">{unpaidList.length} STALLED APPS</p>
                    </div>
                </div>
            </header>

            <div className="flex gap-md bg-white p-4 rounded-md border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-10" placeholder="Filter by applicant or job..." />
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border">
                        <tr>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Application ID</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Applicant</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Target Stage</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Amount Due</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase text-right">Follow-up</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {unpaidList.length === 0 ? (
                            <tr><td colSpan={5} className="p-xl text-center text-sm text-text-secondary">Queue is clear! No unpaid applications.</td></tr>
                        ) : unpaidList.map((p: any) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-lg py-5 font-mono font-bold text-primary">
                                    #{p.applicationId.toString().padStart(5, '0')}
                                </td>
                                <td className="px-lg py-5">
                                    <p className="font-bold text-text-primary">User ID: {p.userId}</p>
                                    <span className="text-[10px] text-text-secondary flex items-center gap-1 uppercase">
                                        <Clock className="w-3 h-3" /> Stalled {Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                </td>
                                <td className="px-lg py-5">
                                    <span className="px-2 py-0.5 bg-slate-100 text-text-secondary text-[10px] font-bold rounded uppercase">
                                        STAGE {p.stageId}
                                    </span>
                                </td>
                                <td className="px-lg py-5">
                                    <span className="font-mono font-bold text-text-primary text-base">${p.amount}</span>
                                </td>
                                <td className="px-lg py-5 text-right">
                                    <Link
                                        href={`/admin/mail?to=${p.userId}@unresolved.com`}
                                        className="text-primary font-bold text-xs hover:underline flex items-center justify-end gap-1"
                                    >
                                        Nudge Applicant <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-blue-50/50 p-lg rounded-md border border-blue-100 flex items-start gap-md">
                <div className="p-2 bg-primary/10 text-primary rounded-md mt-0.5"><AlertCircle className="w-5 h-5" /></div>
                <div className="text-xs text-text-secondary leading-relaxed">
                    <p className="font-bold text-primary mb-1 uppercase tracking-wider">Operational Protocol:</p>
                    Applicants in this queue have seen the payment instructions but haven't uploaded a proof.
                    Protocol suggests nudging via Mail Composer (STK-ADM-APP-003) after 48 hours of inactivity.
                    Stalled applications ≥ 14 days should be marked for archival.
                </div>
            </div>
        </div>
    );
}

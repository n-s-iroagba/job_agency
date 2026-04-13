'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import {
    Users,
    FileCheck,
    CreditCard,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export default function AdminDashboardPage() {
    const { data: apps } = useApiQuery<any>(['admin', 'apps', 'summary'], '/admin/applications?limit=5');
    const { data: unverified } = useApiQuery<any>(['admin', 'payments', 'unverified'], '/admin/payments/unverified');
    const { data: unpaid } = useApiQuery<any>(['admin', 'payments', 'unpaid'], '/admin/payments/unpaid');

    const appList = apps?.rows || [];
    const unverifiedList = unverified?.rows || unverified || [];

    return (
        <div className="space-y-xl">
            <header>
                <h1>Admin Oversight Overview</h1>
                <p className="text-text-secondary">Global operational status and queue monitoring (SCR-ADM-DASH-001)</p>
            </header>

            {/* Admin Summary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                <div className="card bg-slate-900 border-slate-700 text-white flex items-center gap-md">
                    <div className="p-3 bg-primary/20 text-primary rounded-md"><Users className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Applicants</p>
                        <p className="text-2xl font-bold">{apps?.count || 0}</p>
                    </div>
                </div>
                <div className="card bg-slate-900 border-slate-700 text-white flex items-center gap-md">
                    <div className="p-3 bg-amber-500/20 text-amber-500 rounded-md"><FileCheck className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Proofs</p>
                        <p className="text-2xl font-bold">{unverifiedList.length}</p>
                    </div>
                </div>
                <div className="card bg-slate-900 border-slate-700 text-white flex items-center gap-md">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-md"><CreditCard className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unpaid Sum</p>
                        <p className="text-2xl font-bold">{unpaid?.count || 0}</p>
                    </div>
                </div>
                <div className="card bg-slate-900 border-slate-700 text-white flex items-center gap-md">
                    <div className="p-3 bg-green-500/20 text-green-500 rounded-md"><TrendingUp className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
                        <p className="text-2xl font-bold">12%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Recent Applications Queue */}
                <section className="card p-0 overflow-hidden">
                    <div className="p-lg border-b border-border flex justify-between items-center">
                        <h3 className="text-base">Recent Applications</h3>
                        <Link href="/admin/applications" className="text-xs text-primary font-bold hover:underline">View Queue →</Link>
                    </div>
                    <div className="divide-y divide-border">
                        {appList.length === 0 ? (
                            <div className="p-xl text-center text-sm text-text-secondary">No recent applications.</div>
                        ) : appList.map((app: any) => (
                            <div key={app.id} className="p-lg hover:bg-slate-50 transition-colors flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm">#{app.id.toString().padStart(5, '0')} - {app.User?.fullName}</p>
                                    <p className="text-[11px] text-text-secondary">{app.JobListing?.title} • {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${app.status === 'Active' ? 'bg-blue-50 text-primary' : 'bg-green-50 text-success'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Priority Verification Queue */}
                <section className="card p-0 overflow-hidden border-amber-100">
                    <div className="p-lg border-b border-border flex justify-between items-center bg-amber-50/30">
                        <h3 className="text-base text-amber-800">Proofs Awaiting Verification</h3>
                        <Link href={CONSTANTS.ROUTES.ADMIN.UNVERIFIED} className="text-xs text-amber-600 font-bold hover:underline">Verify Now →</Link>
                    </div>
                    <div className="divide-y divide-border">
                        {unverifiedList.length === 0 ? (
                            <div className="p-xl text-center text-sm text-text-secondary">Verification queue is empty. Good job!</div>
                        ) : unverifiedList.slice(0, 5).map((pay: any) => (
                            <div key={pay.id} className="p-lg hover:bg-slate-50 transition-colors flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm">Payment Proof: ${pay.amount}</p>
                                    <p className="text-[11px] text-text-secondary">Ref: #{pay.applicationId.toString().padStart(5, '0')} • {new Date(pay.updatedAt).toLocaleTimeString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {pay.amount >= 5000 && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded">HIGH VALUE</span>}
                                    <Link href={CONSTANTS.ROUTES.ADMIN.UNVERIFIED} className="p-1.5 border border-border rounded hover:bg-white"><ArrowUpRight className="w-3.5 h-3.5" /></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

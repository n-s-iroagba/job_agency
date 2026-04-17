'use client';

import { PaymentUpload } from '@/components/ui/PaymentUpload';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { useState } from 'react';

export default function ApplicantDashboard() {
    const { data: summary, isLoading, refetch } = useApiQuery<any>(['applicant', 'dashboard'], '/dashboard');
    const [selectedPaymentApp, setSelectedPaymentApp] = useState<any>(null);
    const [appFilter, setAppFilter] = useState<'All' | 'Active' | 'Completed' | 'Payments'>('All');

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400 animate-pulse">Loading Dashboard...</div>;

    const pendingStages = summary?.pendingStages || [];
    const activeJobs = summary?.activeJobs?.rows || [];

    const filteredStages = pendingStages.filter((app: any) => {
        if (appFilter === 'All') return true;
        if (appFilter === 'Active') return app.completionPercentage < 100 && !app.requiresPayment;
        if (appFilter === 'Payments') return app.requiresPayment;
        if (appFilter === 'Completed') return app.completionPercentage === 100;
        return true;
    });

    const getPaymentForApp = (app: any) => {
        return summary?.unpaidPayments?.find(
            (p: any) => p.applicationId === app.applicationId && p.stageId === app.stageId
        );
    };

    return (
        <div className="font-sans antialiased text-blue-900 selection:bg-blue-100 selection:text-blue-900">
            <div className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-blue-900">Applicant Dashboard</h1>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-2">Overview / Application Status</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-blue-50">
                            <div>
                                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Application Progress</h2>
                                <p className="text-[9px] text-blue-300 font-bold uppercase mt-1">{filteredStages.length} Active Processes</p>
                            </div>
                            <div className="flex bg-blue-50 p-1 rounded-xl border border-blue-100 self-start">
                                {['All', 'Active', 'Payments', 'Completed'].map((filter: any) => (
                                    <button
                                        key={filter}
                                        onClick={() => setAppFilter(filter)}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${appFilter === filter ? 'bg-white text-blue-900 shadow-md shadow-blue-900/5' : 'text-blue-400 hover:text-blue-600'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredStages.map((app: any) => (
                                <div key={app.applicationId} className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-900/20">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-blue-900 tracking-tight leading-tight">{app.jobTitle}</h3>
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Active Phase:</span>
                                                <span className="px-3 py-1 bg-blue-50 text-blue-900 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">{app.stageName}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Total Progress</div>
                                            <div className="text-2xl font-bold font-mono text-blue-900 tracking-tighter">{app.completionPercentage}%</div>
                                        </div>
                                    </div>

                                    <div className="h-1.5 bg-blue-50 rounded-full overflow-hidden mb-8">
                                        <div className="h-full bg-blue-900 transition-all duration-700 ease-out" style={{ width: `${app.completionPercentage}%` }} />
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-blue-50">
                                        <div className="flex items-center gap-2">
                                            {app.requiresPayment ? (
                                                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-100 animate-pulse">
                                                    <span className="material-symbols-outlined text-[14px]">payments</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Pending Settlement: ${app.amount}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Verified / Under Review</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/dashboard/applications/${app.applicationId}`}
                                                className="px-5 py-2.5 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] hover:bg-blue-50 hover:text-blue-900 transition-all"
                                            >
                                                View Details
                                            </Link>
                                            {app.requiresPayment && (
                                                <button
                                                    onClick={() => setSelectedPaymentApp(app)}
                                                    className="bg-blue-900 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-blue-900/10 active:scale-95"
                                                >
                                                    Process Payment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredStages.length === 0 && (
                                <div className="py-20 text-center bg-blue-50/50 rounded-[3rem] border-2 border-dashed border-blue-100">
                                    <span className="material-symbols-outlined text-4xl text-blue-200 mb-4">clinical_notes</span>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">No applications found in this filter</p>
                                    <button
                                        onClick={() => setAppFilter('All')}
                                        className="mt-6 text-[9px] font-black text-blue-900 uppercase tracking-[0.3em] hover:underline"
                                    >
                                        View All Applications
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {((summary?.allPayments?.length > 0) || pendingStages.some((ap: any) => ap.requiresPayment)) && (
                        <section className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-blue-50">Payment History</h2>
                            <div className="space-y-3">
                                {summary.allPayments.map((pay: any) => (
                                    <div key={pay.id} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl group hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[9px] font-black text-blue-900 uppercase tracking-tight">{pay.JobStage?.name}</p>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${pay.status === 'Verified' || pay.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    pay.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {pay.status === 'Pending' ? 'Audit Pending' : pay.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[8px] text-blue-400 font-black uppercase tracking-widest">
                                            <span>Val: ${pay.amount}</span>
                                            <span>#CC-{pay.id.toString().padStart(4, '0')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-sm animate-in fade-in slide-in-from-right-8 duration-700">
                        <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-blue-50">Recommended Roles</h2>
                        <div className="space-y-2">
                            {activeJobs.slice(0, 5).map((job: any) => (
                                <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="block p-4 rounded-2xl hover:bg-blue-900 hover:text-white transition-all group group-hover:shadow-xl group-hover:shadow-blue-900/10">
                                    <h4 className="text-xs font-bold transition-colors mb-2">{job.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{job.location}</p>
                                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">arrow_forward</span>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/dashboard/jobs" className="block text-center pt-6 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-900 transition-colors">
                                Browse All Jobs
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            {selectedPaymentApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-900/95 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
                        <div className="p-8 bg-white border-b border-blue-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Payment Gateway</h3>
                                <p className="text-[9px] font-bold text-blue-400 uppercase mt-1">Ref ID: #TXN-{selectedPaymentApp.applicationId.toString().padStart(5, '0')}</p>
                            </div>
                            <button onClick={() => setSelectedPaymentApp(null)} className="w-10 h-10 rounded-xl hover:bg-blue-50 text-blue-400 hover:text-blue-900 transition-all flex items-center justify-center">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            {getPaymentForApp(selectedPaymentApp) ? (
                                <PaymentUpload
                                    paymentId={getPaymentForApp(selectedPaymentApp).id}
                                    amount={selectedPaymentApp.amount}
                                    onSuccess={() => {
                                        setSelectedPaymentApp(null);
                                        refetch();
                                    }}
                                />
                            ) : (
                                <div className="p-12 text-center">
                                    <span className="material-symbols-outlined text-5xl text-red-100 mb-4">error</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                        Data Error: No payment record detected for this stage.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

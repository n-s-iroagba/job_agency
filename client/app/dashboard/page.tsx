'use client';

import { PaymentUpload } from '@/components/ui/PaymentUpload';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { useState } from 'react';

export default function ApplicantDashboard() {
    const { data: summary, isLoading, refetch } = useApiQuery<any>(['applicant', 'dashboard'], '/dashboard');
    const [selectedPaymentApp, setSelectedPaymentApp] = useState<any>(null);

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Dashboard...</div>;

    const pendingStages = summary?.pendingStages || [];
    const activeJobs = summary?.activeJobs?.rows || [];

    const getPaymentForApp = (app: any) => {
        return summary?.unpaidPayments?.find(
            (p: any) => p.applicationId === app.applicationId && p.stageId === app.stageId
        );
    };

    return (
        <div className="font-sans">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicant Dashboard</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your active applications and career path</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Applications</h2>
                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{pendingStages.length} Total</span>
                        </div>

                        <div className="space-y-4">
                            {pendingStages.map((app: any) => (
                                <div key={app.applicationId} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{app.jobTitle}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Stage:</span>
                                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{app.stageName}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completion</div>
                                            <div className="text-xl font-bold text-slate-900 tracking-tight">{app.completionPercentage}%</div>
                                        </div>
                                    </div>

                                    <div className="h-1 bg-slate-50 rounded-full overflow-hidden mb-8">
                                        <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${app.completionPercentage}%` }} />
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            {app.requiresPayment ? (
                                                <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-widest border border-amber-100">
                                                    Action Required: ${app.amount} Due
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded bg-slate-50 text-slate-500 text-[9px] font-bold uppercase tracking-widest border border-slate-100">
                                                    Under Review
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/dashboard/applications/${app.applicationId}`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 p-2">
                                                Details
                                            </Link>
                                            {app.requiresPayment && (
                                                <button
                                                    onClick={() => setSelectedPaymentApp(app)}
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {pendingStages.length === 0 && (
                                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active applications</p>
                                    <Link href="/" className="inline-block mt-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:underline">Browse Listings</Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Recommended Jobs</h2>
                        <div className="space-y-1">
                            {activeJobs.slice(0, 5).map((job: any) => (
                                <Link key={job.id} href={`/jobs/${job.id}`} className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-600 transition-colors">{job.title}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{job.JobCategory?.name} • {job.employmentType}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Account Security</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Standard industry encryption protocols active. All transactions verified via manual audit trail.</p>
                    </section>
                </div>
            </div>

            {selectedPaymentApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
                        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Settlement Portal</h3>
                            <button onClick={() => setSelectedPaymentApp(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
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
                                <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-red-500">
                                    Error: No payment record found for this stage.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

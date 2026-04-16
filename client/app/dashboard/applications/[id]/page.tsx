'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import { PaymentUpload } from '@/components/ui/PaymentUpload';
import Link from 'next/link';

interface JobStage {
    id: number;
    name: string;
    description: string;
    requiresPayment: boolean;
    amount?: number;
    orderPosition: number;
}

interface Application {
    id: number;
    status: string;
    completionPercentage: number;
    currentStageId: number | null;
    JobListing: {
        id: number;
        title: string;
        JobStages: JobStage[];
    };
    Payments: any[];
}

export default function ApplicationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: app, isLoading, refetch } = useApiQuery<Application>(
        ['application', id],
        `/applications/${id}`
    );

    const { data: job } = useApiQuery<any>(
        ['job', app?.JobListing?.id?.toString() || ''],
        `/jobs/${app?.JobListing?.id}`,
        { enabled: !!app?.JobListing?.id }
    );

    const advanceMutation = useApiMutation('post', `/applications/${id}/advance`, {
        onSuccess: () => refetch()
    });

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Journey Audit...</div>;
    if (!app) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-red-500">Node not found</div>;

    const stages = job?.JobStages?.sort((a: any, b: any) => a.orderPosition - b.orderPosition) || [];
    const currentStageIndex = stages.findIndex((s: any) => s.id === app.currentStageId);
    const currentStage = stages[currentStageIndex];
    const currentPayment = app.Payments?.find(p => p.stageId === app.currentStageId);

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard/applications" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </Link>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Portal / #CC-{id.padStart(5, '0')}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{app.JobListing.title}</h1>
                </div>
                <div className="flex gap-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${app.status === 'Active' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                        Status: {app.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Settlement Node (If active) */}
                    {currentStage?.requiresPayment && (!currentPayment || currentPayment.status !== CONSTANTS.STATUSES.PAYMENT.VERIFIED) && (
                        <section className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Required Action</span>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 uppercase">Strategy Contribution Phase</h3>
                                <p className="text-sm text-slate-600 mb-8 max-w-[500px]">A processing fee of <span className="font-bold text-slate-900">${currentStage.amount}</span> is required to proceed to the next stage.</p>

                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                    <PaymentUpload
                                        paymentId={currentPayment?.id}
                                        amount={currentStage.amount || 0}
                                        onSuccess={refetch}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="space-y-4">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline Nodes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stages.map((stage: any, index: number) => (
                                <div key={stage.id} className={`p-6 rounded-2xl border transition-all ${index <= currentStageIndex ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-transparent opacity-50'
                                    }`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${index < currentStageIndex ? 'bg-emerald-50 text-emerald-600' :
                                                index === currentStageIndex ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {index < currentStageIndex ? 'Completed' : index === currentStageIndex ? 'Active' : 'Locked'}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 uppercase tracking-tight text-sm mb-1">{stage.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2">{stage.description.replace(/<[^>]*>?/gm, '')}</p>

                                    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-400">Node Fee</span>
                                        <span className={stage.requiresPayment ? 'text-slate-900' : 'text-slate-400'}>{stage.requiresPayment ? `$${stage.amount}` : 'Zero'}</span>
                                    </div>

                                    {index === currentStageIndex && !stage.requiresPayment && (
                                        <button
                                            onClick={() => advanceMutation.mutate({})}
                                            className="w-full mt-6 bg-slate-900 text-white py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                                        >
                                            {advanceMutation.isPending ? 'Processing...' : 'Advance Node'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Audit Trace</h2>
                        <div className="space-y-6 relative ml-1">
                            <div className="absolute left-1 top-2 bottom-2 w-px bg-slate-100" />
                            {[
                                { title: 'Current Node', action: currentStage?.name || 'Processing', time: 'Active' },
                                { title: 'Security Pass', action: 'Verified', time: 'Stage Start' },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-[-2.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-slate-900" />
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                                    <p className="text-[11px] font-bold text-slate-900 uppercase">{item.action}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-900 text-white p-8 rounded-2xl">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Pipeline Health</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Integrity Score</span>
                                <span>High</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-slate-500">Progress</span>
                                <span>{app.completionPercentage}%</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

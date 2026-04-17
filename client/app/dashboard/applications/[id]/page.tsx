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
    currency?: string;
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
    };
    JobStages: JobStage[];
    Payments: any[];
}

export default function ApplicationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: app, isLoading, refetch } = useApiQuery<Application>(
        ['application', id],
        `/applications/${id}`
    );

    const advanceMutation = useApiMutation('post', `/applications/${id}/advance`, {
        onSuccess: () => refetch()
    });

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Loading Application Details...</div>;
    if (!app) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-red-500">Application not found</div>;

    const stages = app?.JobStages?.sort((a: any, b: any) => a.orderPosition - b.orderPosition) || [];
    const currentStageIndex = stages.findIndex((s: any) => s.id === app.currentStageId);
    const currentStage = stages[currentStageIndex];
    const currentPayment = app.Payments?.find(p => p.stageId === app.currentStageId);

    const isPendingVerification = currentPayment?.status === 'Pending';

    const getStagePayment = (stageId: number) => {
        return app.Payments?.find(p => p.stageId === stageId);
    };

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/dashboard" className="text-blue-400 hover:text-blue-900 transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </Link>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Application Portal / #CC-{id.padStart(5, '0')}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{app.JobListing?.title}</h1>
                </div>
                <div className="flex gap-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${app.status === 'ACTIVE' ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/10' : 'bg-blue-50 text-blue-500 border border-blue-100'
                        }`}>
                        Status: {app.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Payment Stage (If active) */}
                    {currentStage?.requiresPayment && currentPayment?.status !== 'Verified' && currentPayment?.status !== 'Paid' && (
                        <section className="bg-blue-50 rounded-[2.5rem] p-10 border border-blue-100 relative overflow-hidden">
                            <div className="relative z-10">
                                {isPendingVerification ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                            <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-blue-900 tracking-tight mb-2 uppercase tracking-[0.2em]">Verification Pending</h3>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest max-w-[400px] mx-auto leading-relaxed">We've received your settlement proof. Our administrative team is currently conducting a manual audit of the transaction details.</p>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-4">Required Action</span>
                                        <h3 className="text-xl font-bold text-blue-900 tracking-tight mb-2 uppercase">Required Settlement Node</h3>
                                        <p className="text-sm text-blue-600 mb-8 max-w-[500px]">A processing fee of <span className="font-bold text-blue-900">${currentStage.amount}</span> is required to proceed to the next stage.</p>

                                        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                                            <PaymentUpload
                                                paymentId={currentPayment?.id}
                                                amount={currentStage.amount || 0}
                                                onSuccess={refetch}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    )}

                    <section className="space-y-4">
                        <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Application Phase Sequence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stages.map((stage: any, index: number) => {
                                const isCompleted = index < currentStageIndex;
                                const isActive = index === currentStageIndex;
                                const payment = getStagePayment(stage.id);
                                
                                return (
                                    <div key={stage.id} className={`p-6 rounded-[2rem] border transition-all ${index <= currentStageIndex ? 'bg-white border-blue-100 shadow-sm' : 'bg-blue-50 border-transparent opacity-50'
                                        }`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isCompleted ? 'bg-emerald-50 text-emerald-600' :
                                                isActive ? (isPendingVerification ? 'bg-amber-100 text-amber-600' : 'bg-blue-900 text-white') : 'bg-blue-100 text-blue-400'
                                                }`}>
                                                {isCompleted ? 'Protocol Completed' : isActive ? (isPendingVerification ? 'Audit In Progress' : 'Current Active') : 'Reserved'}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-blue-900 uppercase tracking-tight text-sm mb-1">{stage.name}</h4>
                                        <p className="text-[10px] text-blue-400 font-medium line-clamp-2 uppercase tracking-tight">{stage.description}</p>

                                        <div className="mt-6 pt-4 border-t border-blue-50 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                            <span className="text-blue-400">Security / Fee</span>
                                            <div className="text-right">
                                                {stage.requiresPayment ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-blue-900">${stage.amount}</span>
                                                        {payment && (
                                                            <span className={`text-[8px] italic mt-1 ${
                                                                payment.status === 'Verified' || payment.status === 'Paid' ? 'text-emerald-500' :
                                                                payment.status === 'Pending' ? 'text-amber-500' : 'text-red-400'
                                                            }`}>
                                                                Status: {payment.status === 'Verified' || payment.status === 'Paid' ? 'Settled' : payment.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-blue-400">Included</span>
                                                )}
                                            </div>
                                        </div>

                                        {isActive && !stage.requiresPayment && (
                                            <button
                                                onClick={() => advanceMutation.mutate({})}
                                                disabled={advanceMutation.isPending}
                                                className="w-full mt-6 bg-blue-900 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg disabled:opacity-50 active:scale-95"
                                            >
                                                {advanceMutation.isPending ? 'Synchronizing...' : 'Initialize Next Phase'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
                        <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6 pb-4 border-b border-blue-50">Operational Log</h2>
                        <div className="space-y-6 relative ml-1">
                            <div className="absolute left-1 top-2 bottom-2 w-px bg-blue-100" />
                            {[
                                { title: 'Current Vector', action: isPendingVerification ? 'Audit Required' : currentStage?.name || 'Processing', time: 'Active' },
                                { title: 'Registration', action: 'Verified', time: 'Initial' },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-[-2.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-900" />
                                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">{item.title}</p>
                                    <p className="text-[11px] font-bold text-blue-900 uppercase">{item.action}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-blue-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20">
                        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">Process Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-blue-500">Security Check</span>
                                <span className="text-emerald-400">Succeeded</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-blue-500">Audit Status</span>
                                <span>{isPendingVerification ? 'Manual Review' : 'Operational'}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-blue-500">Vector Depth</span>
                                <span>{app.completionPercentage}%</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

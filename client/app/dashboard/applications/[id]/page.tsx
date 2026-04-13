'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import { PaymentUpload } from '@/components/ui/PaymentUpload';

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

    if (isLoading) return (
        <div className="space-y-12 animate-pulse">
            <div className="h-40 bg-slate-100 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 h-96 bg-slate-100 rounded-2xl" />
                <div className="lg:col-span-4 h-96 bg-slate-100 rounded-2xl" />
            </div>
        </div>
    );

    if (!app) return <div>Application not found</div>;

    const stages = job?.JobStages?.sort((a: any, b: any) => a.orderPosition - b.orderPosition) || [];
    const currentStageIndex = stages.findIndex((s: any) => s.id === app.currentStageId);
    const currentStage = stages[currentStageIndex];
    const currentPayment = app.Payments?.find(p => p.stageId === app.currentStageId);

    return (
        <div className="space-y-12 selection:bg-primary-container selection:text-on-primary-container pb-24">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${app.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'
                            }`}>
                            {app.status} Application
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">• Ref: #CC-{app.id.toString().padStart(5, '0')}</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-4">{app.JobListing.title}</h1>
                    <p className="text-lg text-on-surface-variant leading-relaxed font-light">
                        Visualizing the future of global infrastructure. Currently in the <span className="font-bold text-primary italic uppercase tracking-tighter">{currentStage?.name || 'Processing'}</span> stage.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                        Withdraw
                    </button>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-95">
                        Send Message
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Stages & Payments */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Action Required Card */}
                    {currentStage?.requiresPayment && (!currentPayment || currentPayment.status !== CONSTANTS.STATUSES.PAYMENT.VERIFIED) && (
                        <section className="bg-primary/5 rounded-2xl p-8 flex items-start gap-4 border-l-4 border-primary">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <span className="material-symbols-outlined font-bold">assignment_late</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-on-surface mb-1 uppercase tracking-tight">Action Required: Strategy Contribution</h3>
                                <p className="text-on-surface-variant text-sm mb-6 font-medium">To proceed to the next stage, a nominal processing fee of <span className="font-bold text-primary">${currentStage.amount}</span> is required as per the recruitment protocol.</p>
                                <div className="bg-white/50 p-6 rounded-xl border border-primary/20">
                                    <PaymentUpload
                                        applicationId={app.id}
                                        stageId={currentStage.id}
                                        amount={currentStage.amount || 0}
                                        onSuccess={refetch}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Stages Grid */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold tracking-tight uppercase">Application Path</h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentStageIndex + 1} of {stages.length} Stages</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stages.map((stage: any, index: number) => {
                                const isPassed = index < currentStageIndex;
                                const isCurrent = index === currentStageIndex;
                                const isLocked = index > currentStageIndex;

                                return (
                                    <div
                                        key={stage.id}
                                        className={`p-6 rounded-2xl transition-all border ${isPassed ? 'bg-surface-container-lowest border-slate-100 grayscale-[0.5]' :
                                                isCurrent ? 'bg-white shadow-2xl shadow-primary/10 border-primary/20 ring-4 ring-primary/5' :
                                                    'bg-surface-container-low border-transparent opacity-60'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPassed ? 'bg-green-100 text-green-600' :
                                                    isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                                                        'bg-slate-200 text-slate-400'
                                                }`}>
                                                <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    {isPassed ? 'check_circle' : isCurrent ? 'pending' : 'lock'}
                                                </span>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded ${isPassed ? 'bg-green-50 text-green-600' :
                                                    isCurrent ? 'bg-primary/10 text-primary' :
                                                        'bg-slate-100 text-slate-400'
                                                }`}>
                                                {isPassed ? 'Passed' : isCurrent ? 'Active' : 'Locked'}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-on-surface mb-1">{stage.name}</h4>
                                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight line-clamp-2">{stage.description.replace(/<[^>]*>?/gm, '')}</p>
                                        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol</span>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                {stage.requiresPayment ? `Fee: $${stage.amount}` : 'No Fee'}
                                            </span>
                                        </div>
                                        {isCurrent && !stage.requiresPayment && (
                                            <button
                                                onClick={() => advanceMutation.mutate({})}
                                                disabled={advanceMutation.isPending}
                                                className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                                            >
                                                {advanceMutation.isPending ? 'Advancing...' : 'Mark as Complete'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right Column: Audit Trail & Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-slate-100/50">
                        <h2 className="text-xl font-bold tracking-tight mb-8 uppercase text-slate-800">Activity History</h2>
                        <div className="space-y-8 relative">
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                            {[
                                { title: 'Strategy Contribution', desc: 'Proof of payment submitted.', time: 'Today, 09:12 AM', color: 'bg-primary' },
                                { title: 'Initial Screening', desc: 'System check passed successfully.', time: 'Oct 15, 02:30 PM', color: 'bg-slate-300' },
                                { title: 'Application Initiated', desc: 'Package Ref #CC-88294 created.', time: 'Oct 12, 09:00 AM', color: 'bg-slate-300' }
                            ].map((item, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className={`absolute left-2 top-1.5 w-3 h-3 rounded-full ${item.color} border-4 border-white z-10 shadow-sm`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.time}</span>
                                        <p className="text-xs font-bold text-on-surface uppercase tracking-tight">{item.title}</p>
                                        <p className="text-[10px] text-on-surface-variant font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                            View Full Audit Logs
                        </button>
                    </section>

                    <section className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl shadow-slate-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-bold italic tracking-tighter">N</div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Global Partner</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">San Francisco • Technology</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Completion', value: `${app.completionPercentage}%` },
                                { label: 'Integrity', value: 'High' },
                                { label: 'Est. Offer', value: '$180k' }
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">{stat.label}</span>
                                    <span>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

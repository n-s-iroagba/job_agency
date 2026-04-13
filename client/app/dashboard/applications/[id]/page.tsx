'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Download,
    Info
} from 'lucide-react';
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

    // Fetch full job details to get stages (since findById doesn't include them on app)
    const { data: job } = useApiQuery<any>(
        ['job', app?.JobListing?.id?.toString() || ''],
        `/jobs/${app?.JobListing?.id}`,
        { enabled: !!app?.JobListing?.id }
    );

    const advanceMutation = useApiMutation('post', `/applications/${id}/advance`, {
        onSuccess: () => refetch()
    });

    if (isLoading) return <div className="animate-pulse space-y-lg">
        <div className="h-32 bg-slate-50 card" />
        <div className="h-64 bg-slate-50 card" />
    </div>;

    if (!app) return <div>Application not found</div>;

    const stages = job?.JobStages?.sort((a: any, b: any) => a.orderPosition - b.orderPosition) || [];
    const currentStage = stages.find((s: any) => s.id === app.currentStageId);

    const mappedStages = stages.map((s: any) => ({
        id: s.id,
        name: s.name,
        status: s.id === app.currentStageId ? 'current' :
            stages.indexOf(s) < stages.findIndex((st: any) => st.id === app.currentStageId) ? 'completed' : 'upcoming',
        requiresPayment: s.requiresPayment
    }));

    const currentPayment = app.Payments?.find(p => p.stageId === app.currentStageId);

    return (
        <div className="space-y-xl max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start gap-md">
                <div>
                    <h1 className="mb-1">{app.JobListing.title}</h1>
                    <p className="text-text-secondary">Application Ref: #{app.id.toString().padStart(5, '0')}</p>
                </div>
                <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase ${app.status === 'Active' ? 'bg-blue-50 text-primary' : 'bg-green-50 text-success'
                    }`}>
                    {app.status} Status
                </span>
            </header>

            <section className="card">
                <h3 className="mb-lg">Overall Progress</h3>
                <ProgressTracker
                    stages={mappedStages}
                    currentPercent={app.completionPercentage}
                />
            </section>

            {currentStage && (
                <section className="space-y-lg">
                    <div className="flex items-center gap-md">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                            {stages.indexOf(currentStage) + 1}
                        </div>
                        <h2>Current Stage: {currentStage.name}</h2>
                    </div>

                    <div className="card space-y-md">
                        <div className="flex items-start gap-md text-text-secondary leading-relaxed">
                            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div dangerouslySetInnerHTML={{ __html: currentStage.description }} />
                        </div>

                        {currentStage.requiresPayment && (
                            <div className="mt-xl pt-xl border-t border-border space-y-lg">
                                <h3 className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-warning" />
                                    Payment Required: ${currentStage.amount}
                                </h3>

                                {!currentPayment || currentPayment.status === CONSTANTS.STATUSES.PAYMENT.UNPAID ? (
                                    <div className="bg-amber-50 border border-amber-100 p-lg rounded-md space-y-md">
                                        <p className="text-sm">Please follow the payment instructions below to proceed.</p>
                                        <PaymentUpload
                                            applicationId={app.id}
                                            stageId={currentStage.id}
                                            amount={currentStage.amount || 0}
                                            onSuccess={refetch}
                                        />
                                    </div>
                                ) : currentPayment.status === CONSTANTS.STATUSES.PAYMENT.PENDING ? (
                                    <div className="bg-blue-50 border border-blue-100 p-lg rounded-md flex items-center gap-md text-primary">
                                        <AlertCircle className="w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Payment Proof Uploaded</p>
                                            <p className="text-sm">Our finance team is verifying your payment. This usually takes 1-6 hours.</p>
                                        </div>
                                    </div>
                                ) : currentPayment.status === CONSTANTS.STATUSES.PAYMENT.VERIFIED ? (
                                    <div className="bg-green-50 border border-green-100 p-lg rounded-md flex items-center gap-md text-success">
                                        <CheckCircle2 className="w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Payment Verified</p>
                                            <p className="text-sm">You can now proceed to the next stage.</p>
                                            <button
                                                onClick={() => advanceMutation.mutate({})}
                                                disabled={advanceMutation.isPending}
                                                className="btn-primary mt-md flex items-center gap-2"
                                            >
                                                {advanceMutation.isPending ? 'Advancing...' : 'Proceed to Next Stage'} <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-red-50 border border-red-100 p-lg rounded-md space-y-md text-danger">
                                        <p className="font-bold">Payment Rejected</p>
                                        <p className="text-sm">Note: {currentPayment.adminNote || 'Please re-upload a clear proof.'}</p>
                                        <PaymentUpload
                                            applicationId={app.id}
                                            stageId={currentStage.id}
                                            amount={currentStage.amount || 0}
                                            onSuccess={refetch}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {!currentStage.requiresPayment && (
                            <div className="mt-xl pt-lg border-t border-border flex justify-end">
                                <button
                                    onClick={() => advanceMutation.mutate({})}
                                    disabled={advanceMutation.isPending}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {advanceMutation.isPending ? 'Advancing...' : 'Mark as Complete & Proceed'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {app.status === 'Completed' && (
                <div className="card bg-green-50 border-green-200 text-center py-2xl space-y-md">
                    <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2>Congratulations!</h2>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Your application for <strong>{app.JobListing.title}</strong> is fully completed.
                        Our team will contact you for final orientation and logistics.
                    </p>
                </div>
            )}
        </div>
    );
}

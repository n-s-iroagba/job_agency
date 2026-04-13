'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { useParams, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';
import {
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Briefcase,
    ShieldCheck
} from 'lucide-react';

export default function JobApplyStartPage() {
    const params = useParams();
    const jobId = params.id as string;
    const router = useRouter();

    const { data: job, isLoading } = useApiQuery<any>(['job', jobId], `/jobs/${jobId}`);

    const applyMutation = useApiMutation('post', '/applications', {
        onSuccess: (data: any) => {
            router.push(`${CONSTANTS.ROUTES.APPLICATIONS}/${data.id}`);
        }
    });

    if (isLoading) return <div className="card animate-pulse h-96 bg-slate-50" />;
    if (!job) return <div>Job not found</div>;

    const handleApply = () => {
        applyMutation.mutate({ jobId: parseInt(jobId, 10) });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-xl">
            <header>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    <Briefcase className="w-3.5 h-3.5" /> Starting New Application
                </div>
                <h1>Apply for {job.title}</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div className="md:col-span-2 space-y-lg">
                    <section className="card space-y-md">
                        <h3 className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-success" /> Quality Assurance</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            By starting this application, you agree to provide truthful information.
                            Our team will verify your credentials and CV documents during Stage 1.
                            You can save your progress and return at any time.
                        </p>
                        <div className="bg-blue-50 p-md rounded-md flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-primary leading-tight">
                                <p className="font-bold mb-1">Pre-requisites Check:</p>
                                <ul className="list-disc ml-4 space-y-1">
                                    <li>Valid CV uploaded in CV Management.</li>
                                    <li>Agreement to sequential processing stages.</li>
                                    <li>Acknowledgment of stage-specific costs (if any).</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-lg">
                    <div className="card space-y-md bg-slate-50/50">
                        <h3 className="text-sm font-bold uppercase text-text-secondary pb-md border-b border-border">Summary</h3>
                        <div className="space-y-sm text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Location:</span>
                                <span className="font-medium text-right">{job.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Category:</span>
                                <span className="font-medium text-right">{job.JobCategory?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Stages:</span>
                                <span className="font-medium text-right">{job.JobStages?.length} Steps</span>
                            </div>
                        </div>

                        <button
                            onClick={handleApply}
                            disabled={applyMutation.isPending}
                            className="btn-primary w-full py-3 mt-lg flex items-center justify-center gap-2"
                        >
                            {applyMutation.isPending ? 'Initializing...' : 'Confirm & Start Application'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="text-center px-lg">
                        <p className="text-[10px] text-text-secondary">
                            Your data is handled securely per NFR-SEC-006.
                            You can delete your draft applications any time before Stage 1 completion.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

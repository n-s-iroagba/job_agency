'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiQuery } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

interface JobStage {
    id: number;
    name: string;
    description: string;
    requiresPayment: boolean;
    amount?: number;
}

interface JobDetail {
    id: number;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    JobCategory: { name: string };
    JobBenefits: { benefitType: string; description: string }[];
    JobConditions: { name: string; description: string }[];
    JobStages: JobStage[];
}

export default function JobDetailPage() {
    const params = useParams();
    const jobId = params.jobId as string;

    const { data: job, isLoading } = useApiQuery<JobDetail>(['job', jobId], `/jobs/${jobId}`);

    if (isLoading) return <div className="p-xl text-center">Loading job details...</div>;
    if (!job) return <div className="p-xl text-center">Job not found</div>;

    const totalCost = job.JobStages?.reduce((acc, stage) => acc + (stage.amount || 0), 0) || 0;

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />

            <main className="flex-1 pt-24 pb-xl px-lg max-w-4xl mx-auto w-full">
                <Link href={CONSTANTS.ROUTES.HOME} className="text-sm text-primary hover:underline mb-lg block">← Back to Jobs</Link>

                <div className="flex gap-md mb-md">
                    <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full uppercase">{job.JobCategory.name}</span>
                    <span className="px-3 py-1 bg-slate-100 text-text-secondary text-xs font-bold rounded-full uppercase">{job.employmentType}</span>
                </div>

                <h1 className="mb-sm">{job.title}</h1>
                <p className="text-text-secondary text-lg mb-xl">📍 {job.location}</p>

                <section className="mb-xl">
                    <h2 className="mb-md">Description</h2>
                    <div className="text-text-secondary leading-relaxed space-y-md" dangerouslySetInnerHTML={{ __html: job.description }} />
                </section>

                <section className="mb-xl grid grid-cols-1 md:grid-cols-2 gap-xl">
                    <div>
                        <h3 className="mb-md">Benefits</h3>
                        <ul className="space-y-sm">
                            {job.JobBenefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-sm text-sm text-text-secondary">
                                    <span className="text-success font-bold font-mono">✓</span>
                                    <div>
                                        <span className="font-semibold text-text-primary">{b.benefitType}:</span> {b.description}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-md">Conditions</h3>
                        <ul className="space-y-sm">
                            {job.JobConditions.map((c, i) => (
                                <li key={i} className="flex items-start gap-sm text-sm text-text-secondary">
                                    <span className="text-primary font-bold font-mono">•</span>
                                    {c.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="card p-xl mb-xl">
                    <h3 className="mb-lg">Application Stages & Costs</h3>
                    <div className="space-y-md mb-lg">
                        {job.JobStages?.sort((a, b) => a.id - b.id).map((s, i) => (
                            <div key={s.id} className="flex justify-between items-center text-sm">
                                <span>Stage {i + 1}: {s.name}</span>
                                <span className={s.requiresPayment ? 'font-bold' : 'text-text-secondary'}>
                                    {s.requiresPayment ? `$${s.amount}` : 'Free'}
                                </span>
                            </div>
                        ))}
                        <div className="pt-md border-t border-border flex justify-between font-bold text-lg">
                            <span>Total Estimated Cost</span>
                            <span>${totalCost}</span>
                        </div>
                    </div>
                    <p className="text-xs text-text-secondary mb-xl">
                        * Costs are disclosed upfront for complete transparency. Payments are made sequentially per stage.
                    </p>
                    <Link href={`/login?redirect=/jobs/${job.id}/apply`} className="btn-primary w-full inline-block text-center py-3">
                        Apply Now — Start Application
                    </Link>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}

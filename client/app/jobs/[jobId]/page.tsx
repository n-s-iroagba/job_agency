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

    if (isLoading) return (
        <div className="bg-surface min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-1 pt-24 pb-16 px-4 md:px-8 max-w-[1280px] mx-auto animate-pulse">
                <div className="h-64 bg-slate-100 rounded-2xl" />
            </main>
            <PublicFooter />
        </div>
    );

    if (!job) return (
        <div className="bg-surface min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-1 pt-24 pb-16 text-center">
                <h1 className="text-2xl font-bold">Job Not Found</h1>
                <Link href="/" className="text-primary hover:underline mt-4 inline-block">Back to Home</Link>
            </main>
            <PublicFooter />
        </div>
    );

    const totalCost = job.JobStages?.reduce((acc, stage) => acc + (stage.amount || 0), 0) || 0;

    return (
        <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col">
            <PublicHeader />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-[1280px] mx-auto flex-1">
                {/* Hero Header Section */}
                <header className="mb-12 relative flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary-container/10 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary font-semibold text-xs tracking-wider uppercase">Active Recruitment</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-on-surface tracking-tighter leading-tight whitespace-pre-line">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-on-surface-variant">
                            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <span className="material-symbols-outlined text-primary">work</span>
                                <span className="text-sm font-medium">{job.employmentType}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg">
                                <span className="material-symbols-outlined text-primary">category</span>
                                <span className="text-sm font-medium">{job.JobCategory?.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-80 p-6 bg-surface-container-lowest rounded-xl shadow-2xl shadow-slate-200/50 flex flex-col gap-4 sticky top-24">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Trust Index</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className="material-symbols-outlined text-primary scale-75 text-fill">star</span>
                                ))}
                            </div>
                        </div>
                        <Link
                            href={`/register?redirect=/dashboard/applications/${job.id}/apply`}
                            className="w-full bg-primary text-on-primary py-4 rounded-lg font-bold text-lg text-center hover:shadow-lg hover:shadow-primary/30 transition-all font-sans"
                        >
                            Apply Now
                        </Link>
                        <p className="text-[10px] text-center text-slate-400 leading-tight">JobNexa Verified Role. Your professional data is protected by end-to-end encryption.</p>
                    </div>
                </header>

                {/* Bento Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Description Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-on-surface">The Opportunity</h2>
                            <div className="text-lg text-on-surface-variant leading-relaxed font-sans prose" dangerouslySetInnerHTML={{ __html: job.description }} />
                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm">
                                <img alt="Workspace" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGRSYf3EYPFETQbi2b3WMDJL3lqO_qdbVOIEc1YTcnSwXcyk1zDDjktu2Q-7NikV3Cvej1LnS4DXVyZUUmAkI9ifabe0_Xs4HQtRdSpXRvlzo1C6FlMPdED4GlLoaJUjmD1e07A0U60FZ4DeY5XW6Xz9pAYLP5AxjE85fFfORFmS4GrkESF5eWnXydz2kB-fWTtwoeFFUUMVszMIgYawrQdLfJyrv12hGQ4wkTBwEUOlOjKI8Ny1umNKGaPsU-WSXDynHZm2pbd62D" />
                            </div>
                        </section>

                        {/* Stages & Costs */}
                        <section className="p-8 bg-surface-container-low rounded-2xl space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-on-surface">Transparent Application Flow</h2>
                                    <p className="text-sm text-on-surface-variant">Clear progression with full financial disclosure (TRUST-009).</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-primary uppercase tracking-tighter">Total Cost</span>
                                    <span className="text-3xl font-black text-on-surface">${totalCost}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {job.JobStages?.sort((a, b) => a.id - b.id).map((stage, i) => (
                                    <div key={stage.id} className={`bg-surface-container-lowest p-6 rounded-xl border-l-4 shadow-sm ${i === 0 ? 'border-primary' : 'border-outline-variant/30'}`}>
                                        <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
                                        <h3 className="font-bold text-sm mt-2">{stage.name}</h3>
                                        <p className="text-xs text-on-secondary-container mt-1 line-clamp-1">{stage.description}</p>
                                        <span className={`block mt-4 text-xs font-bold ${stage.amount ? 'text-on-surface' : 'text-green-600'}`}>
                                            {stage.amount ? `$${stage.amount}` : 'FREE'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Side Cards Area */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Benefits Bento */}
                        {job.JobBenefits?.length > 0 && (
                            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border-t border-slate-100">
                                <h3 className="text-xl font-bold mb-6">Premium Benefits</h3>
                                <div className="space-y-6">
                                    {job.JobBenefits.map((b, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-primary">
                                                    {b.benefitType.toLowerCase().includes('health') ? 'health_and_safety' :
                                                        b.benefitType.toLowerCase().includes('salary') ? 'savings' :
                                                            'card_giftcard'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{b.benefitType}</h4>
                                                <p className="text-xs text-on-surface-variant">{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Conditions & Requirements */}
                        {job.JobConditions?.length > 0 && (
                            <div className="bg-slate-900 text-white p-8 rounded-2xl">
                                <h3 className="text-xl font-bold mb-6">Prerequisites</h3>
                                <div className="space-y-4">
                                    {job.JobConditions.map((c, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-blue-400 text-fill">check_circle</span>
                                            <span className="text-sm">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Location Insight</p>
                                    <div className="mt-4 rounded-xl overflow-hidden h-32 grayscale opacity-80">
                                        <img
                                            alt="Map"
                                            className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNfvIlE4Vqz45gUFmi9fYloq78e7lfc3_DZjHAOb06nmhSokSi5F6FwYMri-_y8OEUQXdw12p6w7RbtFrjZhvB5HNn0ztZ6GliqUCJxCLAPED-oNmUs_vZzeeWWnBLlllWXVA6ucyp2BE-525KOMxjQ5KVqeZqjypZW589sBC5PMed8QFIeD4454WWcAri0R_AAW60IURo0ax6_Y6SYVEbtGExKDTZ1W1XmJ-x01gogj9GH1xwtrMEtv7oEItcUUFWIG9kFGak-4Wp"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

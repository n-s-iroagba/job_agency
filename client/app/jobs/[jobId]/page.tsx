'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiQuery } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';



interface JobDetail {
    id: number;
    title: string;
    description: string;
    location: string;
    employmentType: string;
    JobCategory: { name: string };
    JobBenefits: { benefitType: string; description: string }[];
    JobConditions: { name: string; description: string }[];

}

export default function JobDetailPage() {
    const params = useParams();
    const jobId = params.jobId as string;

    const { data: job, isLoading } = useApiQuery<JobDetail>(['job', jobId], `/jobs/${jobId}`);

    if (isLoading) return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />
            <main className="flex-1 pt-32 pb-16 px-6 max-w-[1000px] mx-auto w-full">
                <div className="h-64 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
            </main>
            <PublicFooter />
        </div>
    );

    if (!job) return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />
            <main className="flex-1 pt-32 pb-16 text-center px-6">
                <h1 className="text-xl font-bold text-slate-900 mb-4">Job Not Found</h1>
                <Link href="/" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900">Return to Listings</Link>
            </main>
            <PublicFooter />
        </div>
    );


    return (
        <div className="bg-white text-slate-900 antialiased min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="pt-24 lg:pt-32 pb-24 px-6 max-w-[1000px] mx-auto w-full flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        <header className="space-y-6">
                            <div className="flex flex-wrap gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{job.JobCategory?.name}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200 self-center"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{job.employmentType}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                                {job.title}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-sm font-bold">location_on</span>
                                {job.location}
                            </div>
                        </header>

                        <section className="space-y-6">
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Description</h2>
                            <div className="text-slate-500 font-medium leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
                        </section>


                    </div>

                    {/* Sidebar Area */}
                    <aside className="space-y-12">
                        <section className="space-y-6">
                            <Link
                                href={`/register?redirect=/dashboard/applications/${job.id}/apply`}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] text-center block shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                Apply Now
                            </Link>
                            <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest leading-loose">
                                Registration required to initiate the application sequence.
                            </p>
                        </section>

                        {job.JobBenefits?.length > 0 && (
                            <section className="space-y-6 pt-12 border-t border-slate-50">
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Benefits</h3>
                                <div className="space-y-6">
                                    {job.JobBenefits.map((b, i) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="w-1 h-1 rounded-full bg-slate-900 mt-2 shrink-0"></span>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1">{b.benefitType}</h4>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {job.JobConditions?.length > 0 && (
                            <section className="space-y-6 pt-12 border-t border-slate-50">
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Prerequisites</h3>
                                <div className="space-y-4">
                                    {job.JobConditions.map((c, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-slate-400 text-sm font-bold">check</span>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

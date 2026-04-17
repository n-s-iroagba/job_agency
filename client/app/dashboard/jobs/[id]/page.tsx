'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

export default function JobDetailPage() {
    const params = useParams();
    const jobId = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: job, isLoading } = useApiQuery<any>(['job', jobId], `/jobs/${jobId}`);
    const { data: userData } = useApiQuery<any>(['auth', 'me'], '/auth/me');

    const applyMutation = useApiMutation('post', '/applications', {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['applicant', 'dashboard'] });
            router.push(`${CONSTANTS.ROUTES.APPLICATIONS}/${data.id}`);
        }
    });

    const handleApply = () => {
        const user = userData?.user;
        if (!user) return;

        // Pre-flight validation: Check if biodata is complete
        const isBiodataComplete = user.fullName && user.phoneNumber && user.nationality;
        const isCvUploaded = !!user.cvUrl;

        if (!isBiodataComplete) {
            alert('Your professional profile is split. Please complete your basic biodata (Name, Phone, Nationality) before proceeding.');
            router.push(`${CONSTANTS.ROUTES.PROFILE}?redirect=/dashboard/jobs/${jobId}`);
            return;
        }

        if (!isCvUploaded) {
            alert('A CV/Resume document is required for screening. Redirecting to your document vault.');
            router.push(`${CONSTANTS.ROUTES.CV}?redirect=/dashboard/jobs/${jobId}`);
            return;
        }

        applyMutation.mutate({ jobId: parseInt(jobId, 10) });
    };

    const isReadyToApply = userData?.user?.fullName && userData?.user?.phoneNumber && userData?.user?.nationality && userData?.user?.cvUrl;

    if (isLoading) return (
        <div className="space-y-12 animate-pulse">
            <div className="h-64 bg-blue-100 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 h-96 bg-blue-100 rounded-2xl" />
                <div className="lg:col-span-4 h-96 bg-blue-100 rounded-2xl" />
            </div>
        </div>
    );

    if (!job) return <div>Job not found</div>;

    return (
        <div className="space-y-16 selection:bg-primary-container selection:text-on-primary-container">
            {/* Hero Job Header */}
            <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Premium Partner</span>
                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Posted 2 days ago</span>
                    </div>
                    <h1 className="text-[3.5rem] font-bold leading-tight tracking-tight text-on-surface">{job.title}</h1>
                    <div className="flex flex-wrap gap-4 text-on-surface-variant font-medium">
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg">
                            <span className="material-symbols-outlined text-primary">apartment</span>
                            <span className="text-sm font-bold uppercase tracking-tight">{job.JobCategory?.name || 'Global Systems'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            <span className="text-sm font-bold uppercase tracking-tight">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            <span className="text-sm font-bold uppercase tracking-tight">{job.salaryRange || '$120,000 - $160,000'}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-80 bg-surface-container-lowest p-8 rounded-xl shadow-xl shadow-blue-200/50 border border-blue-100/50">
                    <button
                        onClick={handleApply}
                        disabled={applyMutation.isPending}
                        className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:shadow-lg transition-all mb-4 active:scale-95 disabled:opacity-50 ${isReadyToApply ? 'bg-primary text-white' : 'bg-blue-200 text-blue-500'}`}
                    >
                        {applyMutation.isPending ? 'Initializing...' : isReadyToApply ? 'Start Application' : 'Resolve Readiness to Apply'}
                    </button>
                    <button className="w-full bg-surface-container-high text-on-surface py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-blue-200 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">bookmark</span>
                        Save for Later
                    </button>
                    <p className="text-[10px] text-center text-on-surface-variant mt-4 leading-relaxed font-bold uppercase tracking-tighter">
                        Safe and Secure Recruitment • (NFR-SEC-006)
                    </p>
                </div>

                {/* Pre-flight Readiness Card */}
                <div className="w-full md:w-80 bg-white p-8 rounded-xl border border-blue-100 shadow-sm space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">fact_check</span>
                        Application Readiness
                    </h4>

                    <div className="space-y-4">
                        <ReadinessItem
                            label="Professional Biodata"
                            isComplete={!!(userData?.user?.fullName && userData?.user?.phoneNumber && userData?.user?.nationality)}
                            link={`${CONSTANTS.ROUTES.PROFILE}?redirect=/dashboard/jobs/${jobId}`}
                        />
                        <ReadinessItem
                            label="Document: CV / Resume"
                            isComplete={!!userData?.user?.cvUrl}
                            link={`${CONSTANTS.ROUTES.CV}?redirect=/dashboard/jobs/${jobId}`}
                        />
                    </div>

                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-tight leading-relaxed">
                        Complete all modules to authorize your professional profile for this role.
                    </p>
                </div>
            </div>

            {/* Asymmetric Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Role Details */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Role Conditions Bento Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-surface-container-low p-8 rounded-xl">
                            <h3 className="text-xl font-bold mb-4">The Mission</h3>
                            <p className="text-on-surface-variant leading-relaxed text-lg font-light">
                                {job.description || "We are seeking a visionary to lead our next phase of growth. You will be the bridge between global strategy and technical execution, managing a multi-disciplinary team. Your role is not just to manage, but to define the next decade of professional excellence."}
                            </p>
                        </div>
                        <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Quick Stats</h4>
                            <ul className="space-y-4">
                                <li className="flex justify-between items-center">
                                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">Experience</span>
                                    <span className="font-bold text-sm uppercase">6+ Years</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">Duration</span>
                                    <span className="font-bold text-sm uppercase">{job.type}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-on-surface-variant text-[10px] font-bold uppercase">Stages</span>
                                    <span className="font-bold text-sm uppercase">{job.JobStages?.length || 4} Steps</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Detailed Content */}
                    <section className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                Key Responsibilities
                            </h2>
                            <ul className="space-y-4 text-on-surface-variant leading-relaxed list-none">
                                <li className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <span className="text-sm font-medium">Oversee strategic implementation for major regional accounts, ensuring top-tier consistency.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <span className="text-sm font-medium">Direct stakeholder management with C-suite executives at global partner organizations.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                    <span className="text-sm font-medium">Lead high-stakes pitches and conceptual development for multi-channel campaigns.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-surface-container-lowest p-8 rounded-xl border border-blue-100">
                            <h2 className="text-2xl font-bold mb-6">Benefits & Conditions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-secondary-container/30 rounded-lg flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">health_and_safety</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Health & Wellness</h4>
                                        <p className="text-xs text-on-surface-variant font-medium">Premium private insurance and mental health support for you and your family.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-secondary-container/30 rounded-lg flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">travel_explore</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Global Mobility</h4>
                                        <p className="text-xs text-on-surface-variant font-medium">Annual work-from-anywhere credit and relocation assistance if needed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Application Journey */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-surface-container-high/20 p-8 rounded-xl">
                        <h3 className="text-xl font-bold mb-8">Application Journey</h3>
                        <div className="relative space-y-12">
                            {/* Step 1 */}
                            <div className="relative flex gap-6">
                                <div className="absolute left-4 top-10 h-14 border-l-2 border-dashed border-blue-200"></div>
                                <div className="z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs uppercase shadow-lg shadow-primary/20">01</div>
                                <div>
                                    <h4 className="font-bold text-sm">Profile Screening</h4>
                                    <p className="text-xs text-on-surface-variant font-medium">Initial review of your resume and portfolio by our talent curators.</p>
                                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1 inline-block">Avg. 3 Days</span>
                                </div>
                            </div>
                            {/* Step 2 */}
                            <div className="relative flex gap-6">
                                <div className="absolute left-4 top-10 h-14 border-l-2 border-dashed border-blue-200"></div>
                                <div className="z-10 w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">02</div>
                                <div>
                                    <h4 className="font-bold text-sm">Discovery Call</h4>
                                    <p className="text-xs text-on-surface-variant font-medium">30-minute chat with the Creative Director about vision and culture.</p>
                                </div>
                            </div>
                            {/* Step 3 */}
                            <div className="relative flex gap-6">
                                <div className="z-10 w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">03</div>
                                <div>
                                    <h4 className="font-bold text-sm">Strategic Workshop</h4>
                                    <p className="text-xs text-on-surface-variant font-medium">A paid 3-hour deep dive into a real-world business challenge.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Glassmorphism Card for Diversity */}
                    <div className="p-8 rounded-xl bg-primary/5 backdrop-blur-md border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-primary text-6xl">diversity_3</span>
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 relative z-10">Our Commitment</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed relative z-10 font-medium italic">
                            JobNexe works exclusively with agencies that prioritize diversity. This role is open to all qualified applicants regardless of background.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReadinessItem({ label, isComplete, link }: { label: string, isComplete: boolean, link: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isComplete ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[14px] font-bold">
                        {isComplete ? 'check' : 'pending'}
                    </span>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${isComplete ? 'text-blue-900' : 'text-blue-400'}`}>
                    {label}
                </span>
            </div>
            {!isComplete && (
                <Link href={link} className="text-[9px] font-black uppercase tracking-widest text-blue-900 hover:underline decoration-2 underline-offset-4">
                    Update
                </Link>
            )}
        </div>
    );
}

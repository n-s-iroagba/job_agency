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
            <div className="h-64 bg-blue-50/50 rounded-[3rem]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 h-96 bg-blue-50/50 rounded-[3rem]" />
                <div className="lg:col-span-4 h-96 bg-blue-50/50 rounded-[3rem]" />
            </div>
        </div>
    );

    if (!job) return (
        <div className="py-20 text-center bg-red-50 rounded-[3rem] border border-red-100 mt-12">
            <span className="material-symbols-outlined text-red-200 text-6xl mb-6">error</span>
            <h2 className="text-xl font-bold text-red-900 uppercase tracking-widest">Entry Not Found</h2>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-2">The requested career node does not exist in the active registry.</p>
            <Link href="/dashboard/jobs" className="inline-block mt-8 text-[10px] font-black text-red-900 uppercase tracking-[0.3em] underline underline-offset-8">Return to Dashboard</Link>
        </div>
    );

    // Extract salary from benefits
    const salaryBenefit = job.JobBenefits?.find((b: any) => b.benefitType.toLowerCase().includes('salary'));
    const salaryDisplay = salaryBenefit ? (salaryBenefit.value || salaryBenefit.description) : 'Salary Undisclosed';

    const requirements = job.requirements ? job.requirements.split('\n').filter((line: string) => line.trim()) : [];
    const stages = job.stages || [];

    return (
        <div className="space-y-16 selection:bg-blue-100 selection:text-blue-900 pb-32 antialiased">
            {/* Hero Job Header */}
            <div className="flex flex-col xl:flex-row gap-12 items-start">
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em]">Verified Listing</span>
                        <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">{job.employmentType}</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tighter text-blue-900 drop-shadow-sm">{job.title}</h1>
                    <div className="flex flex-wrap gap-6 text-blue-400 font-bold">
                        <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 px-6 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-blue-900">corporate_fare</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">{job.JobCategory?.name || 'Uncategorized'}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 px-6 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-blue-900">location_on</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">{job.location || 'Remote Node'}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 px-6 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-emerald-600">payments</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{salaryDisplay}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full xl:w-96 flex flex-col gap-6">
                    <button
                        onClick={handleApply}
                        disabled={applyMutation.isPending}
                        className={`w-full py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 disabled:opacity-50 shadow-2xl ${isReadyToApply ? 'bg-blue-900 text-white shadow-blue-900/20 hover:bg-black' : 'bg-blue-100 text-blue-400'}`}
                    >
                        {applyMutation.isPending ? 'Syncing...' : isReadyToApply ? 'Initiate Application' : 'Incomplete Profile'}
                    </button>
                    
                    <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 flex items-center gap-3">
                            <span className="material-symbols-outlined text-base">task_alt</span>
                            Profile Integrity
                        </h4>

                        <div className="space-y-4">
                            <ReadinessItem
                                label="Verification Biodata"
                                isComplete={!!(userData?.user?.fullName && userData?.user?.phoneNumber && userData?.user?.nationality)}
                                link={`${CONSTANTS.ROUTES.PROFILE}?redirect=/dashboard/jobs/${jobId}`}
                            />
                            <ReadinessItem
                                label="CV / Career History"
                                isComplete={!!userData?.user?.cvUrl}
                                link={`${CONSTANTS.ROUTES.CV}?redirect=/dashboard/jobs/${jobId}`}
                            />
                        </div>

                        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed pt-2 border-t border-blue-50">
                            Status: {isReadyToApply ? 'Authorized for Submission' : 'Awaiting Profile Updates'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-16">
                    <section className="space-y-8">
                        <div>
                            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8 pb-4 border-b border-blue-50 flex items-center gap-4">
                                <span className="w-10 h-[1px] bg-blue-100" />
                                01. Operational Mission
                            </h2>
                            <p className="text-blue-900 leading-[2.2] text-xl font-medium tracking-tight">
                                {job.description}
                            </p>
                        </div>

                        {requirements.length > 0 && (
                            <div>
                                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8 pb-4 border-b border-blue-50 flex items-center gap-4">
                                    <span className="w-10 h-[1px] bg-blue-100" />
                                    02. Core Requirements
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {requirements.map((req: string, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-50 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 group">
                                            <span className="text-[10px] font-black text-blue-200 mt-1 opacity-40 group-hover:opacity-100">{(idx + 1).toString().padStart(2, '0')}</span>
                                            <span className="text-sm font-bold text-blue-900 leading-relaxed">{req.replace(/^[•-]\s*/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(job.JobBenefits?.length > 0 || job.JobConditions?.length > 0) && (
                            <div className="bg-blue-900 text-white p-12 rounded-[4rem] shadow-2xl shadow-blue-900/10 space-y-12 relative overflow-hidden">
                                <span className="absolute -top-10 -right-10 material-symbols-outlined text-[20rem] opacity-5 text-white italic">award_star</span>
                                
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                                    <div className="space-y-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-300">Package Benefits</h3>
                                        <div className="space-y-8">
                                            {job.JobBenefits?.map((benefit: any) => (
                                                <div key={benefit.id} className="group">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-2 group-hover:text-blue-300 transition-colors">{benefit.benefitType}</h4>
                                                    <p className="text-sm text-blue-300 font-medium leading-relaxed">{benefit.description}</p>
                                                    {benefit.value && <span className="inline-block mt-3 px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-100">{benefit.value}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-300">Service Conditions</h3>
                                        <div className="space-y-8">
                                            {job.JobConditions?.map((condition: any) => (
                                                <div key={condition.id} className="group text-right md:text-left">
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-2 group-hover:text-blue-300 transition-colors">{condition.name}</h4>
                                                    <p className="text-sm text-blue-300 font-medium leading-relaxed">{condition.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Vertical Application Journey */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-blue-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900">Application Node Path</h3>
                            <span className="px-3 py-1 bg-blue-50 text-blue-900 text-[9px] font-black uppercase rounded-lg">{stages.length} Phases</span>
                        </div>
                        
                        <div className="relative space-y-12 ml-4">
                            <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-blue-50" />
                            
                            {stages.map((stage: any, idx: number) => (
                                <div key={idx} className="relative flex gap-8 group">
                                    <div className={`z-10 w-9 h-9 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase transition-all shadow-xl group-hover:rotate-12 ${
                                        idx === 0 ? 'bg-blue-900 text-white shadow-blue-900/20' : 'bg-white border border-blue-100 text-blue-300'
                                    }`}>
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 transition-all group-hover:translate-x-1">
                                        <h4 className="font-black text-sm text-blue-900 uppercase tracking-tight mb-1">{stage.name}</h4>
                                        <p className="text-[11px] text-blue-400 font-bold leading-relaxed">{stage.description}</p>
                                        <div className="flex gap-4 mt-3">
                                            {stage.requiresPayment && (
                                                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">Payment Req</span>
                                            )}
                                            {stage.deadlineDays && (
                                                <span className="text-[8px] font-black text-blue-400 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest border border-blue-100">{stage.deadlineDays} Days</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-emerald-50 border border-emerald-100 relative overflow-hidden group hover:bg-emerald-900 transition-all duration-500">
                        <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-emerald-900 group-hover:text-white text-[10rem]">verified</span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 group-hover:text-emerald-300 mb-6 relative z-10 transition-colors">Direct Placement</h4>
                        <p className="text-xs text-emerald-900 leading-loose relative z-10 font-bold group-hover:text-white transition-colors">
                            JobNexe exclusively curates roles that offer direct contractual agreements with verified global entities. No intermediaries involved.
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

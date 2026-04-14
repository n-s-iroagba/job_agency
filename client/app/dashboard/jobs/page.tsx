'use client';

import React, { useState } from 'react';
import { useApiQuery } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

interface Job {
    id: number;
    title: string;
    location: string;
    salaryRange: string;
    type: string;
    description: string;
    companyLogo?: string;
}

export default function BrowseJobsPage() {
    const { data: jobs, isLoading } = useApiQuery<Job[]>(
        ['jobs', 'list'],
        '/jobs'
    );

    return (
        <div className="flex gap-8 selection:bg-primary-container selection:text-on-primary-container">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-72 space-y-8 flex-shrink-0">
                <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-6 border border-slate-50">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Search Jobs</h3>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-container-low border-none rounded-lg py-3 px-10 text-sm focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all outline-none"
                                placeholder="Title, keyword, company"
                                type="text"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Location</h3>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-container-low border-none rounded-lg py-3 px-10 text-sm focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all outline-none"
                                placeholder="City or remote"
                                type="text"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Job Type</h3>
                        <div className="space-y-3">
                            {['Full-time', 'Contract', 'Freelance'].map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary">Opportunity Curator</span>
                        <h1 className="text-[3.5rem] font-bold tracking-tight text-on-surface leading-tight mt-1">Discover your next <span className="text-primary">career</span> step</h1>
                        <p className="text-[1rem] text-on-surface-variant mt-4 max-w-[576px] font-light">Curated roles from top-tier agencies and startups. Focused on precision, impact, and growth.</p>
                    </div>
                    <div className="flex items-center bg-surface-container-low p-1.5 rounded-xl self-start md:self-auto">
                        <button className="px-6 py-2 bg-white shadow-sm rounded-lg text-xs font-bold text-primary uppercase tracking-widest">Recommended</button>
                        <button className="px-6 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-widest">Newest</button>
                    </div>
                </div>

                {/* Job Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(jobs as any)?.rows?.map((job: Job, index: number) => (
                            <article
                                key={job.id}
                                className={`${index === 0 ? 'md:col-span-2 flex-row p-8' : 'flex-col p-6'} group bg-surface-container-lowest rounded-2xl flex gap-8 transition-all hover:shadow-[0_20px_40px_rgba(25,28,30,0.06)] border border-slate-100`}
                            >
                                <div className={`${index === 0 ? 'w-20 h-20' : 'w-14 h-14'} bg-surface rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <span className={`${index === 0 ? 'text-4xl' : 'text-2xl'} material-symbols-outlined text-primary`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {index % 2 === 0 ? 'token' : 'architecture'}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Exclusive</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Opportunity</span>
                                    </div>
                                    <div>
                                        <h3 className={`${index === 0 ? 'text-2xl' : 'text-lg'} font-bold text-on-surface group-hover:text-primary transition-colors`}>{job.title}</h3>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{job.location} • {job.type}</p>
                                    </div>
                                    {index === 0 && (
                                        <p className="text-on-surface-variant line-clamp-2 max-w-[672px] font-light">
                                            {job.description || "Shape the future of professional infrastructure through strategic systems thinking and high-fidelity output."}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="px-4 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase">Strategic Impact</span>
                                        <span className="px-4 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase">Curated Role</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end items-end gap-3 min-w-[140px] md:border-l border-slate-50 md:pl-6">
                                    <span className="text-xl font-bold text-on-surface">{job.salaryRange || '$120k - $160k'}</span>
                                    <Link
                                        href={`/jobs/${job.id}`}
                                        className="w-full px-8 py-3 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all text-center"
                                    >
                                        View Detail
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';

interface Job {
    id: number;
    title: string;
    location: string;
    salaryRange: string;
    type: string;
    description: string;
    companyLogo?: string;
    JobCategory?: { name: string };
}

export default function BrowseJobsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState(''); // Visual only for now or combine with search
    const [employmentType, setEmploymentType] = useState('');
    const [sortBy, setSortBy] = useState<'Recommended' | 'Newest'>('Recommended');

    // Debounced search logic could be added here, but using direct state for simplicity in this pass
    const { data: jobs, isLoading } = useApiQuery<any>(
        ['jobs', 'list', searchQuery, employmentType, sortBy],
        `/jobs?searchQuery=${searchQuery}&employmentType=${employmentType}&sortBy=${sortBy === 'Newest' ? 'createdAt' : ''}&sortOrder=DESC`
    );

    const jobList = jobs?.rows || [];

    return (
        <div className="flex gap-8 selection:bg-blue-100 selection:text-blue-900">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-72 space-y-8 flex-shrink-0">
                <section className="bg-white p-6 rounded-2xl shadow-sm space-y-8 border border-blue-50 sticky top-8">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Semantic Search</h3>
                        <div className="relative group">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-blue-50 border-transparent rounded-xl py-3.5 px-10 text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-900/10 focus:bg-white transition-all outline-none placeholder:text-blue-300"
                                placeholder="Role, keyword, stack"
                                type="text"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-900 transition-colors">search</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Node Location</h3>
                        <div className="relative group">
                            <input
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full bg-blue-50 border-transparent rounded-xl py-3.5 px-10 text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-900/10 focus:bg-white transition-all outline-none placeholder:text-blue-300"
                                placeholder="City or remote"
                                type="text"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-900 transition-colors">location_on</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Deployment Type</h3>
                        <div className="space-y-3">
                            {['Full-time', 'Contract', 'Freelance'].map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="radio"
                                            name="jobType"
                                            checked={employmentType === type}
                                            onChange={() => setEmploymentType(employmentType === type ? '' : type)}
                                            className="peer appearance-none w-5 h-5 rounded-lg border-2 border-blue-100 checked:bg-blue-900 checked:border-blue-900 transition-all cursor-pointer"
                                        />
                                        <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none">check</span>
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${employmentType === type ? 'text-blue-900' : 'text-blue-400 group-hover:text-blue-600'}`}>{type}</span>
                                </label>
                            ))}
                            {employmentType && (
                                <button 
                                    onClick={() => setEmploymentType('')}
                                    className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-red-500 pt-2"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-[600px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Infrastructure / Discovery</span>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900 leading-tight mt-3">Discover your next <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">career</span> milestone</h1>
                        <p className="text-sm text-blue-500 mt-4 font-medium leading-relaxed">Curated high-impact roles for specialized talent. Every node represents a standard-compliant career path.</p>
                    </div>
                    <div className="flex items-center bg-blue-50 p-1.5 rounded-2xl self-start md:self-auto border border-blue-100">
                        <button 
                            onClick={() => setSortBy('Recommended')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'Recommended' ? 'bg-white text-blue-900 shadow-xl shadow-blue-900/5' : 'text-blue-400 hover:text-blue-600'}`}
                        >
                            Recommended
                        </button>
                        <button 
                            onClick={() => setSortBy('Newest')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === 'Newest' ? 'bg-white text-blue-900 shadow-xl shadow-blue-900/5' : 'text-blue-400 hover:text-blue-600'}`}
                        >
                            Newest
                        </button>
                    </div>
                </div>

                {/* Job Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-72 bg-blue-50 rounded-[2rem] animate-pulse border border-blue-100/50" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {jobList.map((job: Job, index: number) => (
                            <Link 
                                href={`/dashboard/jobs/${job.id}`}
                                key={job.id}
                                className={`${index === 0 ? 'md:col-span-2' : ''} group block relative outline-none focus:ring-4 focus:ring-blue-100 rounded-[2.5rem]`}
                            >
                                <article
                                    className={`h-full bg-white border border-blue-100 rounded-[2.5rem] flex flex-col md:flex-row gap-8 transition-all duration-500 group-hover:border-blue-900 group-hover:shadow-2xl group-hover:shadow-blue-900/5 ${index === 0 ? 'p-10' : 'p-8'}`}
                                >
                                    <div className={`${index === 0 ? 'w-24 h-24' : 'w-16 h-16'} bg-blue-50 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:bg-blue-900 group-hover:text-white`}>
                                        <span className={`${index === 0 ? 'text-4xl' : 'text-2xl'} material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {index % 2 === 0 ? 'token' : 'architecture'}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-blue-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Verified Position</span>
                                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{job.JobCategory?.name || 'General'}</span>
                                        </div>
                                        <div>
                                            <h3 className={`${index === 0 ? 'text-3xl' : 'text-xl'} font-bold text-blue-900 group-hover:text-blue-900 transition-colors leading-tight`}>{job.title}</h3>
                                            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.1em] mt-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">location_on</span> {job.location} • <span className="material-symbols-outlined text-sm">work</span> {job.type}
                                            </p>
                                        </div>
                                        {index === 0 && (
                                            <p className="text-sm text-blue-500 leading-relaxed font-medium line-clamp-3">
                                                {job.description.replace(/<[^>]*>?/gm, '')}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {['ISO-Compliant', 'High Priority', 'Scale Node'].map(tag => (
                                                <span key={tag} className="px-4 py-1.5 bg-blue-50 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end gap-6 md:border-l border-blue-50 md:pl-8 min-w-[160px]">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Budget Allocation</p>
                                            <span className="text-xl font-bold font-mono text-blue-900 tracking-tighter">{job.salaryRange || 'Unspecified'}</span>
                                        </div>
                                        <div className="w-full bg-blue-50 text-blue-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-blue-900 group-hover:text-white transition-all text-center shadow-lg shadow-blue-900/5">
                                            View Artifact
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                        {jobList.length === 0 && (
                            <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-blue-100 rounded-[3rem]">
                                <span className="material-symbols-outlined text-5xl text-blue-200 mb-4">search_off</span>
                                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">No matching infrastructure nodes detected</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

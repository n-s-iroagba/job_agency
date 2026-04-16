'use client';

import React, { useState } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobListing } from '@/types/models';

export default function JobsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data, isLoading } = useApiQuery<any>(['jobs', 'active', searchQuery], `/jobs?search=${searchQuery}`);
    const jobs = data?.rows || [];

    return (
        <div className="bg-white text-blue-900 antialiased min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="flex-1 pt-32 pb-24 px-8 lg:px-16 max-w-[1440px] mx-auto w-full">
                <header className="mb-16 space-y-4">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Opportunities Index</span>
                    <h1 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter">Careers at Nexa</h1>
                    <p className="text-blue-500 text-sm font-medium max-w-[600px] leading-relaxed">
                        Explore our global mission. We're sourcing elite talent to bridge industrial gaps and drive professional excellence.
                    </p>
                </header>

                <div className="mb-12">
                    <div className="relative max-w-2xl">
                        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-blue-300">search</span>
                        <input
                            type="text"
                            placeholder="FILTER BY ROLE OR DEPARTMENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-blue-50 border border-blue-100 rounded-2xl pl-14 pr-6 py-5 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all outline-none"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-blue-50 rounded-3xl animate-pulse border border-blue-100" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs.map((job: any) => (
                            <Link 
                                href={`/jobs/${job.id}`} 
                                key={job.id}
                                className="group bg-white border border-blue-100 p-10 rounded-[2.5rem] hover:border-blue-900 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col justify-between h-[340px]"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="text-[9px] font-black bg-blue-50 text-blue-400 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                            {job.JobCategory?.name || 'GENERIC'}
                                        </span>
                                        <span className="material-symbols-outlined text-blue-200 group-hover:text-blue-900 transition-colors">east</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:italic transition-all leading-tight">{job.title}</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {job.location}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-blue-50 flex justify-between items-center">
                                    <span className="text-[9px] font-black text-blue-900 uppercase tracking-widest">{job.employmentType}</span>
                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">STK-ID: {job.id}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}

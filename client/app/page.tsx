'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

import { JobListing } from '@/types/models';

export default function HomePage() {
  const { data: jobs, isLoading } = useApiQuery<{ rows: JobListing[], count: number }>(['jobs', 'public'], '/jobs');

  const jobList = jobs?.rows || [];

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans antialiased">
      <PublicHeader />

      <main className="pt-24 lg:pt-32 flex-1 pb-24 px-6">
        {/* Simplified Hero */}
        <div className="max-w-[800px] mx-auto text-center mb-16 lg:mb-24">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Professional Opportunities. <br />Hand-Curated.
          </h1>
          <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-[600px] mx-auto leading-relaxed">
            A minimalist approach to career advancement. We connect high-impact professionals with vetted global roles.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-[700px] mx-auto mb-20">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex-1 flex items-center px-4">
              <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-widest py-3 placeholder:text-slate-300" 
                placeholder="Job title or keywords" 
                type="text" 
              />
            </div>
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
              Search Jobs
            </button>
          </div>
        </div>

        {/* Job Listings Grid */}
        <section className="max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Latest Openings</h2>
            <div className="h-px bg-slate-100 flex-1 mx-8 hidden sm:block"></div>
            <Link href={CONSTANTS.ROUTES.JOBS} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl h-64 animate-pulse" />
              ))
            ) : jobList.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No opportunities found at this time.</p>
              </div>
            ) : (
              jobList.map((job: JobListing) => (
                <Link 
                  key={job.id} 
                  href={`/jobs/${job.id}`}
                  className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-8">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {job.JobCategory?.name || 'Uncategorized'}
                       </span>
                       {new Date(job.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                       )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-900">{job.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-8">
                      <span className="material-symbols-outlined text-sm font-bold">location_on</span> {job.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{job.employmentType}</span>
                    <span className="material-symbols-outlined text-slate-900 transition-transform group-hover:translate-x-1 font-bold">arrow_forward</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

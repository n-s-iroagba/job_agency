'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

interface Job {
  id: number;
  title: string;
  location: string;
  employmentType: string;
  description: string;
  JobCategory?: { name: string };
}

export default function HomePage() {
  const { data: jobs, isLoading } = useApiQuery<Job[]>(['jobs', 'public'], '/jobs');

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-1 pt-24 pb-xl px-lg max-w-7xl mx-auto w-full">
        {/* Hero Section - UIDD §4.1.1 */}
        <section className="text-center mb-2xl py-xl bg-slate-50 rounded-lg">
          <h1 className="mb-md">Your Gateway to Global Career Success</h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-lg">
            Verified opportunities across IT, Healthcare, Finance and more. Transparent stages, secure payments, and real-time tracking.
          </p>
          <div className="flex justify-center gap-md">
            <div className="flex items-center gap-2 text-success font-medium">
              <span className="w-2 h-2 bg-success rounded-full" /> Verified Platform
            </div>
            <div className="flex items-center gap-2 text-success font-medium">
              <span className="w-2 h-2 bg-success rounded-full" /> Secure Payments
            </div>
          </div>
        </section>

        {/* Job Search/Filter Placeholder - SCR-PUB-HOME-001 */}
        <div className="flex flex-col md:flex-row gap-md mb-xl justify-between items-center">
          <h2>Available Opportunities</h2>
          <div className="flex gap-sm w-full md:w-auto">
            <input className="input max-w-xs" placeholder="Search jobs..." />
            <select className="input max-w-[150px]">
              <option>All Categories</option>
            </select>
          </div>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card h-48 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {jobs?.map((job) => (
              <div key={job.id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-blue-50 rounded-full">
                      {job.JobCategory?.name || 'General'}
                    </span>
                    <span className="text-xs text-text-secondary font-medium">{job.employmentType}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-xs leading-tight">{job.title}</h3>
                  <p className="text-sm text-text-secondary mb-md">📍 {job.location}</p>
                </div>

                <Link
                  href={`/jobs/${job.id}`}
                  className="btn-primary w-full text-center"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

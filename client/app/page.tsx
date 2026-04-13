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
  createdAt: string;
}

export default function HomePage() {
  const { data: jobs, isLoading } = useApiQuery<Job[]>(['jobs', 'public'], '/jobs');

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <PublicHeader />

      <main className="pt-16 flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center overflow-hidden bg-surface">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[80%] rounded-full bg-primary/5 blur-[120px]"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[60%] rounded-full bg-secondary/5 blur-[100px]"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 text-primary text-xs font-bold mb-6">
                <span className="material-symbols-outlined text-sm text-fill">verified</span>
                PRECISION IN PROFESSIONAL PLACEMENT
              </div>
              <h1 className="text-slate-900 font-bold leading-[1.1] tracking-tight mb-6 text-[3.5rem] lg:text-[4.5rem]">
                Your Gateway to <span className="text-primary">Global</span> Opportunities
              </h1>
              <p className="text-on-surface-variant text-lg lg:text-xl max-w-xl mb-10 leading-relaxed">
                An editorial approach to job searching. We curate high-impact roles for specialized professionals across the globe.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform">Explore Careers</button>
                <button className="bg-surface-container-high text-on-secondary-container px-8 py-4 rounded-lg font-bold text-base hover:bg-surface-container-highest transition-colors">Our Process</button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img
                  alt="Corporate Excellence"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Xnwi37B5XPgmD3a9CFgqJpSIMWlUZo0kSeHMXU-CwG1C1yOmKYCpvNtc8efaPp1pNXpZDWqnQnbWRXPqzSMp08e4sq0AudRIFwrssNsLEJsYMpC9yeb7c14Qrh7Fg7lhEAe6A5j28QIzUFv8fB8Nwitrl2lec4MuyRY0LdYx-5AKRL3MrHuAfDAkVSGGlAQq03QN5mkKifvmXw1TN3agviYUHsBajwAqRHRzrcuJuyjYuocSpiJeZwg8pW1Bh9MMuGPd1aZKG3bI"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
                  <p className="text-primary font-bold text-sm mb-1">Global Reach</p>
                  <p className="text-slate-900 font-semibold">1,200+ Verified Agency Credentials</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-surface-container-low">
          <div className="container mx-auto px-8">
            <p className="text-center text-slate-500 text-xs font-bold tracking-[0.2em] mb-10 uppercase">TRUSTED BY GLOBAL INSTITUTIONS</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
                <span className="font-bold text-xl tracking-tighter">GLOBALCERT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">shield_person</span>
                <span className="font-bold text-xl tracking-tighter">SECUREHIRE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">gavel</span>
                <span className="font-bold text-xl tracking-tighter">LEGALALIGN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl">public</span>
                <span className="font-bold text-xl tracking-tighter">WORLDWORK</span>
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings Search & Filters */}
        <section id="jobs" className="py-24 bg-surface">
          <div className="container mx-auto px-8">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Curated Opportunities</h2>
              <div className="bg-surface-container-low p-2 rounded-xl flex flex-col md:flex-row gap-2">
                <div className="flex-grow flex items-center bg-white rounded-lg px-4 border-none shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                  <input className="w-full border-none focus:ring-0 text-sm py-3 bg-transparent" placeholder="Job title, keywords, or company..." type="text" />
                </div>
                <div className="flex gap-2">
                  <select className="bg-white border-none rounded-lg text-sm px-4 py-3 shadow-sm focus:ring-2 ring-primary/20">
                    <option>Category</option>
                  </select>
                  <button className="bg-primary text-white px-6 rounded-lg font-bold text-sm shadow-md hover:bg-primary-container transition-colors">Search</button>
                </div>
              </div>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white p-8 rounded-xl shadow-sm animate-pulse h-64 bg-slate-50" />
                ))
              ) : (
                jobs?.map(job => (
                  <div key={job.id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group border border-slate-100/50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined">
                            {job.JobCategory?.name === 'Technology' ? 'code' :
                              job.JobCategory?.name === 'Healthcare' ? 'medical_services' :
                                'work'}
                          </span>
                        </div>
                        {new Date(job.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full">NEW</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">location_on</span> {job.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">{job.JobCategory?.name}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">{job.employmentType}</span>
                      </div>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="w-full py-3 bg-slate-50 text-primary text-center font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                      Apply Now
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="mt-16 text-center">
              <button className="text-primary font-bold flex items-center gap-2 mx-auto group">
                View All Opportunities
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Candidate Spotlight / Signature Component */}
        <section className="py-24 bg-surface-container-low overflow-hidden">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="bg-white p-10 rounded-[2rem] shadow-2xl relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <img className="w-24 h-24 rounded-2xl object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC500VKOj6V4ZjscSKKMJkEPq-MxcNwtS6MQCB7oNSdKJyoWa5s_EFzu-AXHZ6o2L7PCKBtgRLijZKJNNap_325AQVpWiESclBVkPXeS0ZPX7_4RhJzbVLiRUNQcM-iA2LJJU_mmHOHJ8UIvt-X67hhZbD42hmewN905Z1N0HJYsvzG3GfIBU9ceRlX-gc5ULL8qS8BSvvpSU4t-gqus_bZBOWw4OfvbIISPIhGUsdGlEEfg1qJ56wXZQ75tWAVkTMyfeuEYYZygq3A" alt="Profile" />
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 leading-tight">Elite Talent <br />Matching</h4>
                      <p className="text-primary font-semibold text-sm">Case Study: Sarah J., DevOps Engineer</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-lg italic leading-relaxed mb-8">
                    "CareerCurator didn't just find me a job; they curated a career path that aligned with my global ambitions. The precision of their placement is unmatched in the industry."
                  </p>
                  <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PLACED IN</p>
                      <p className="font-bold text-slate-900">14 Days</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SALARY INCREASE</p>
                      <p className="font-bold text-slate-900">+45%</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              </div>
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">Beyond a Simple <br />Bulletin Board.</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary text-fill">stars</span>
                    <div>
                      <h5 className="font-bold text-slate-900">Vetted Partnerships</h5>
                      <p className="text-on-surface-variant text-sm">We only work with agencies and companies that meet our strict ethical and professional standards.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary text-fill">insights</span>
                    <div>
                      <h5 className="font-bold text-slate-900">Precision Analysis</h5>
                      <p className="text-on-surface-variant text-sm">Our curation engine matches your unique skills with roles where you'll thrive, not just fit.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary text-fill">language</span>
                    <div>
                      <h5 className="font-bold text-slate-900">Seamless Relocation</h5>
                      <p className="text-on-surface-variant text-sm">Integrated support for global mobility, visas, and settling into your new career chapter.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

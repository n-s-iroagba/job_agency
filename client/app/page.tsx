import React, { useState, useEffect } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

import { JobListing } from '@/types/models';

const TESTIMONIALS = [
  {
    name: "Elena R.",
    role: "Senior DevOps Engineer",
    text: "CareerCurator streamlined my transition to a global tech hub. The curation is unmatched and the process is seamless.",
    location: "Berlin, DE"
  },
  {
    name: "Marcus T.",
    role: "Product Design Lead",
    text: "Minimalist, efficient, and professional. The best platform I've used for high-impact roles. Truly a premium experience.",
    location: "San Francisco, USA"
  },
  {
    name: "Sofia K.",
    role: "FinTech Consultant",
    text: "The verification process gave me confidence in my new placement. Highly recommend for any serious professional.",
    location: "London, UK"
  },
  {
    name: "David W.",
    role: "Head of Operations",
    text: "Simple but powerful. They really understand the needs of executive talent and provide exceptional service levels.",
    location: "Sydney, AU"
  },
  {
    name: "Aisha M.",
    role: "Full Stack Developer",
    text: "From application to offer in just 14 days. This platform is a game-changer for international careers.",
    location: "Dubai, UAE"
  }
];

export default function HomePage() {
  const { data: jobs, isLoading } = useApiQuery<{ rows: JobListing[], count: number }>(['jobs', 'public'], '/jobs');
  const [currentSlide, setCurrentSlide] = useState(0);

  const jobList = jobs?.rows || [];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-sans antialiased">
      <PublicHeader />

      <main className="pt-24 lg:pt-32 flex-1 pb-24">
        {/* Simplified Hero */}
        <div className="max-w-[800px] mx-auto text-center mb-16 lg:mb-24 px-6">
          <div className="inline-block px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 animate-fade-in">
            Global Placement Infrastructure
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Curated Career <br /><span className="text-slate-400 italic">Excellence.</span>
          </h1>
          <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-[600px] mx-auto leading-relaxed">
            A minimalist approach to career advancement. We connect high-impact professionals with vetted global roles.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-[700px] mx-auto mb-32 px-6">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex-1 flex items-center px-4">
              <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-widest py-3 placeholder:text-slate-300 outline-none" 
                placeholder="Job title or keywords" 
                type="text" 
              />
            </div>
            <button className="bg-slate-900 text-white px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
              Explore Roles
            </button>
          </div>
        </div>

        {/* Job Listings Grid */}
        <section className="max-w-[1280px] mx-auto mb-40 px-6">
          <div className="flex items-center justify-between mb-12 px-2">
            <div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] mb-1">Open Positions</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hand-vetted global opportunities</p>
            </div>
            <div className="h-px bg-slate-100 flex-1 mx-12 hidden md:block"></div>
            <Link href={CONSTANTS.ROUTES.JOBS} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors border border-slate-100 px-6 py-2.5 rounded-full hover:bg-slate-50">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-8 rounded-3xl h-72 animate-pulse" />
              ))
            ) : jobList.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The registry is currently being updated.</p>
              </div>
            ) : (
              jobList.slice(0, 6).map((job: JobListing) => (
                <Link 
                  key={job.id} 
                  href={`/jobs/${job.id}`}
                  className="bg-white p-10 rounded-[2rem] border border-slate-100 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 flex flex-col justify-between h-full group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                       <span className="px-3 py-1 bg-slate-50 rounded text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        {job.JobCategory?.name || 'Vetted'}
                       </span>
                       {new Date(job.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                          <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-900 animate-pulse"></span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">New</span>
                          </span>
                       )}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight leading-tight group-hover:translate-x-1 transition-transform">{job.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-10">
                      <span className="material-symbols-outlined text-sm">location_on</span> {job.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-slate-50 relative z-10">
                    <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest px-3 py-1 border border-slate-100 rounded-full">{job.employmentType}</span>
                    <span className="material-symbols-outlined text-slate-900 group-hover:translate-x-2 transition-transform font-bold">east</span>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity"></div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Global Presence Section */}
        <section className="bg-slate-900 py-32 mb-40 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          </div>
          
          <div className="max-w-[1280px] mx-auto px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] block mb-6">Global Hubs</span>
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                  A Unified Network of <br />Elite Talent.
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-[500px]">
                  Our physical presence in key economic zones ensures localized expertise and cultural alignment for every placement.
                </p>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
                <div className="p-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 block">Region 01</span>
                  <h4 className="text-2xl font-bold mb-4">Australia</h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">100 Mount St, North Sydney NSW 2060, Australia</p>
                  <div className="w-10 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
                
                <div className="p-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 block">Region 02</span>
                  <h4 className="text-2xl font-bold mb-4">United States</h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">500 Seventh Avenue, New York, NY 10018</p>
                  <div className="w-10 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="max-w-[1000px] mx-auto mb-40 px-6">
          <div className="text-center mb-20">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] block mb-4">Success Stories</span>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900 uppercase italic">Testimonials.</h2>
          </div>

          <div className="relative bg-slate-50 rounded-[3rem] p-12 lg:p-20 overflow-hidden shadow-sm border border-slate-100">
            <div className="relative z-10 transition-all duration-700 min-h-[250px] flex flex-col justify-center text-center items-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-8 block select-none">format_quote</span>
              <p className="text-xl lg:text-3xl font-medium text-slate-900 leading-relaxed max-w-[700px] mb-12">
                "{TESTIMONIALS[currentSlide].text}"
              </p>
              <div>
                <h5 className="font-bold text-slate-900 uppercase tracking-widest text-sm">{TESTIMONIALS[currentSlide].name}</h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{TESTIMONIALS[currentSlide].role} • {TESTIMONIALS[currentSlide].location}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-16 relative z-10">
              {TESTIMONIALS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-10 bg-slate-900' : 'w-4 bg-slate-200'}`}
                />
              ))}
            </div>

            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all z-20 hidden md:flex"
            >
              <span className="material-symbols-outlined font-bold">west</span>
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all z-20 hidden md:flex"
            >
              <span className="material-symbols-outlined font-bold">east</span>
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[1280px] mx-auto px-6 mb-24">
          <div className="bg-slate-50 rounded-[4rem] px-8 py-24 text-center border border-slate-100 flex flex-col items-center">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-900/5 flex items-center justify-center mb-10 animate-bounce">
                <span className="material-symbols-outlined text-4xl text-slate-900">verified_user</span>
             </div>
             <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-8 uppercase italic tracking-tighter">Ready for the Next Protocol?</h2>
             <p className="text-slate-500 text-lg mb-12 max-w-sm mx-auto font-medium leading-relaxed">Join the registry and unlock access to hand-curated global opportunities.</p>
             <Link href={CONSTANTS.ROUTES.REGISTER} className="bg-slate-900 text-white px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95">
               Begin Enrollment
             </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

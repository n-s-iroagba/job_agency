'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JobListingFormPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopNavBar */}
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-black tracking-tight uppercase italic text-slate-900">JobNexa Admin</span>
                    <nav className="hidden md:flex gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border-b-2 border-blue-600 pb-1">Opportunities</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Talent</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Categories</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">SCR-ADM-JOBFORM-001</p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8 md:p-12 max-w-[1152px] mx-auto w-full">

                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 max-w-[672px]">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20">Post Management</span>
                        <h1 className="text-[3.5rem] font-black text-on-surface tracking-tighter leading-none italic uppercase">Create<span className="text-primary"> Listing</span></h1>
                        <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Craft a compelling narrative for your next role. Precision in detail attracts precision in talent.</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/admin/jobs">
                            <button className="px-8 py-4 rounded-xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm">Discard</button>
                        </Link>
                        <button className="px-10 py-4 rounded-xl bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">publish</span> Publish Listing
                        </button>
                    </div>
                </div>

                {/* Form Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Column: Core Details */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-8 space-y-8">

                        {/* Form Section: Primary Info */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-8 relative overflow-hidden group">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                                <div className="sm:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Job Title</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-inner" placeholder="e.g. Senior Experience Designer" type="text" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-10 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer shadow-inner">
                                            <option>Design & Creative</option>
                                            <option>Engineering</option>
                                            <option>Product Management</option>
                                            <option>Sales & Marketing</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Employment Type</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-10 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer shadow-inner">
                                            <option>Full-time</option>
                                            <option>Contract / Freelance</option>
                                            <option>Part-time</option>
                                            <option>Internship</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Location</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold text-[20px]">location_on</span>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-400 shadow-inner" placeholder="London, UK or Remote" type="text" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                        </div>

                        {/* Form Section: Rich Text Description */}
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Description</label>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors hover:border-primary/30"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
                                    <button className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors hover:border-primary/30"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
                                    <button className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors hover:border-primary/30"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
                                    <button className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors hover:border-primary/30"><span className="material-symbols-outlined text-[16px]">link</span></button>
                                </div>
                            </div>
                            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none leading-relaxed shadow-inner placeholder:text-slate-400 text-slate-800" placeholder="Describe the mission, impact, and daily life of this role..." rows={10}></textarea>
                        </div>

                        {/* Form Section: Requirements */}
                        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">fact_check</span> Candidate Requirements
                                </label>
                                <textarea className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-5 px-6 text-sm font-medium focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/30 transition-all resize-none leading-relaxed shadow-inner placeholder:text-slate-500 text-white" placeholder="List the essential skills and experiences required..." rows={8}></textarea>
                            </div>
                            <div className="absolute opacity-5 -bottom-10 -right-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                <span className="material-symbols-outlined text-[200px]">verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Meta */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-8">

                        {/* Visibility Toggle Card */}
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/50 shadow-inner space-y-8">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">settings</span> Publishing Controls
                            </h3>

                            <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5 border-l-2 border-emerald-500 pl-2">
                                        Active Listing
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Visible to all talent</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input className="sr-only peer" type="checkbox" defaultChecked />
                                    <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Application Deadline</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">calendar_today</span>
                                    <input className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 appearance-none transition-all" type="date" />
                                </div>
                            </div>
                        </div>

                        {/* Info Bento */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-blue-50/80 p-8 rounded-[2rem] border border-blue-100 shadow-inner group hover:bg-blue-50 transition-colors">
                                <div className="bg-white w-10 h-10 rounded-xl flex flex-col items-center justify-center text-primary mb-4 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[20px]">emoji_objects</span>
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-3">Curation Tip</h4>
                                <p className="text-[11px] font-medium text-blue-900/70 leading-relaxed bg-white/50 p-3 rounded-lg">Listings with clear 'Growth Trajectories' receive <strong className="text-primary tracking-widest">40%</strong> more high-quality applications.</p>
                            </div>

                            <div className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-slate-200/50">
                                <img alt="Modern Office" className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
                                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                                    <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full mb-3 border border-white/30">
                                        <p className="text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">camera</span>
                                            Office Culture
                                        </p>
                                    </div>
                                    <p className="text-slate-200 text-xs font-medium leading-relaxed">Visuals of your workspace are automatically synced from company profile.</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Help */}
                        <div className="text-center px-4 pt-6 pb-2 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Need assistance writing this job?<br />
                                <a className="text-primary hover:text-blue-700 transition-colors inline-block mt-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100" href="#">Chat with an Expert</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

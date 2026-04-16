'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white text-slate-900 antialiased flex flex-col min-h-screen font-sans">
            <PublicHeader />

            <main className="pt-32 pb-32 flex-1 px-8">
                <div className="max-w-[800px] mx-auto">
                    <header className="mb-20">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block mb-4">Compliance Protocol</span>
                        <h1 className="text-4xl lg:text-6xl font-black italic tracking-tight text-slate-900 mb-8 uppercase">Privacy Policy</h1>
                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Revision 2.1 • 2024</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                            <span>Standard Operational Procedure</span>
                        </div>
                    </header>

                    <div className="space-y-20">
                        <section>
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-4">01. Data Sovereignty</h2>
                            <div className="text-slate-500 font-medium leading-[2] text-sm space-y-6">
                                <p>At CareerCurator, we implement advanced data protection protocols to ensure your professional identity remains secure. This document establishes our commitment to transparency in information handling.</p>
                                <p>We operate under the principle of minimal data retention, collecting only the necessary vectors required to facilitate high-impact professional placement.</p>
                            </div>
                        </section>

                        <section className="bg-slate-50 p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-10">02. Information Vectors</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Identity Data</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-tight">Personal identifiers, encrypted CV content, and verified professional history stored within our secure registry.</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">System Telemetry</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-tight">Operational logs, device fingerprints, and interaction metrics analyzed to optimize matching algorithms.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-4">03. Protocol Execution</h2>
                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <span className="text-[10px] font-black text-slate-900 opacity-20 mt-1">03.1</span>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Matching Intelligence</h4>
                                        <p className="text-slate-500 text-xs font-medium uppercase tracking-tight leading-relaxed">Cross-referencing your profile with institutional role requirements via proprietary logic engines.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <span className="text-[10px] font-black text-slate-900 opacity-20 mt-1">03.2</span>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Network Security</h4>
                                        <p className="text-slate-500 text-xs font-medium uppercase tracking-tight leading-relaxed">Preventing unauthorized access to the talent registry through continuous threat monitoring.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="pt-12 border-t border-slate-100">
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-8">04. Data Authority</h2>
                            <p className="text-slate-500 text-sm font-medium leading-[2] mb-10">You retain ultimate authority over your digital presence. You may request identity erasure or vector rectification through our compliance channel.</p>
                            <div className="flex">
                                <a href="mailto:privacy@curator.io" className="bg-slate-900 text-white px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]">
                                    Request Data Erasure
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

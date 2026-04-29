'use client';

import React from 'react';
import Link from 'next/link';

export default function ApexAuditLandingPage() {
    return (
        <div className="bg-white min-h-screen text-blue-900 selection:bg-blue-900 selection:text-white flex items-center justify-center p-6">
            <div className="max-w-xl w-full space-y-16">
                <header className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.85]">
                        Apex <br />
                        Verification <br />
                        Protocol
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Restricted Access // Node Auditing Required</p>
                </header>

                <div className="space-y-10">
                    <div className="space-y-6">
                        <p className="text-sm font-bold leading-relaxed border-l-4 border-blue-900 pl-6">
                            The JobNexe Apex Network is not for the general applicant pool. It is a gated ecosystem for high-impact talent who command asymmetric market value.
                        </p>
                        <p className="text-xs text-blue-500 font-medium leading-relaxed italic">
                            95% of professionals who initiate this audit are disqualified. Our vetting process is rigorous, empirical, and non-negotiable. 
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900">Pre-Audit Warning:</h3>
                            <ul className="space-y-3 text-[10px] font-bold text-blue-400 uppercase tracking-widest list-none">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1 flex-shrink-0" />
                                    Submitting unverified or inflated data results in immediate permanent blacklisting.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1 flex-shrink-0" />
                                    Activation requires a one-time infrastructure fee of $503 upon approval.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1 flex-shrink-0" />
                                    You will be asked to bypass traditional HR channels; readiness for direct executive engagement is mandatory.
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6">
                            <Link href="/expression-of-interest">
                                <button className="w-full bg-blue-900 text-white py-5 rounded-none font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-800 transition-all active:scale-[0.98] shadow-2xl shadow-blue-900/20">
                                    Initialize Audit Sequence
                                </button>
                            </Link>
                            <p className="text-center mt-6">
                                <Link href="/dashboard/jobs" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-900 transition-colors">
                                    Return to Standard Registry
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="pt-12 border-t border-blue-50">
                    <p className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] text-center">
                        Secure Recuitment Pipeline // Encrypted Audit Node 0.9.4
                    </p>
                </footer>
            </div>
        </div>
    );
}

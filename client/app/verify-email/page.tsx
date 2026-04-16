'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Synchronizing Verification Tokens...');

    const { data, error } = useApiQuery<any>(
        ['auth', 'verify-email', token || ''],
        `/auth/verify-email?token=${token}`,
        { enabled: !!token }
    );

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Missing Protocol Token.');
            return;
        }

        if (data) {
            setStatus('success');
            setMessage(data.message || 'Identity verified successfully.');
            const timer = setTimeout(() => router.push(CONSTANTS.ROUTES.LOGIN), 3000);
            return () => clearTimeout(timer);
        }

        if (error) {
            setStatus('error');
            setMessage((error as any).response?.data?.error || 'Verification failed. Bridge link may be expired.');
        }
    }, [data, error, token, router]);

    return (
        <main className="max-w-[448px] w-full space-y-12 text-center">
            <div className="space-y-6">
                <Link href="/" className="text-xl font-black italic uppercase tracking-[0.1em] text-slate-900 block mb-12">
                    JobNexa
                </Link>
                <div>
                    <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center transition-all duration-700 shadow-xl ${status === 'loading' ? 'bg-slate-50 text-slate-300 shadow-slate-100' : status === 'success' ? 'bg-slate-900 text-white shadow-slate-900/10' : 'bg-red-50 text-red-600 shadow-red-100'}`}>
                        <span className={`material-symbols-outlined text-4xl ${status === 'loading' ? 'animate-spin' : ''}`}>
                            {status === 'loading' ? 'sync' : status === 'success' ? 'verified' : 'gpp_bad'}
                        </span>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 pt-8 uppercase tracking-tight">
                    {status === 'loading' ? 'Verifying Profile' : status === 'success' ? 'Identity Secured' : 'Access Denied'}
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto italic">
                    {message}
                </p>
            </div>

            {status === 'success' && (
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest animate-pulse">
                    Routing to Authentication Gateway...
                </p>
            )}

            {(status === 'error' || status === 'success') && (
                <Link href={CONSTANTS.ROUTES.LOGIN} className="block w-full">
                    <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]">
                        Return to Login
                    </button>
                </Link>
            )}
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 antialiased flex flex-col items-center justify-center p-8 font-sans">
            <Suspense fallback={<div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initializing Core...</div>}>
                <VerifyEmailContent />
            </Suspense>

            <footer className="mt-24 py-12 border-t border-slate-50 w-full max-w-[1440px]">
                <div className="flex justify-center flex-col items-center gap-4">
                    <p className="text-slate-300 text-[9px] font-bold uppercase tracking-[0.3em]">© 2024 JOBNEXA ENTERPRISE</p>
                </div>
            </footer>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your identity...');

    // We use useApiQuery but it's really a one-time verification
    // Since it's a GET request, useApiQuery is appropriate
    const { data, error, isLoading } = useApiQuery<any>(
        ['auth', 'verify-email', token || ''],
        `/auth/verify-email?token=${token}`,
        { enabled: !!token }
    );

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Missing verification token.');
            return;
        }

        if (data) {
            setStatus('success');
            setMessage(data.message || 'Identity verified successfully.');
            // Auto redirect after 3 seconds
            const timer = setTimeout(() => router.push(CONSTANTS.ROUTES.LOGIN), 3000);
            return () => clearTimeout(timer);
        }

        if (error) {
            setStatus('error');
            setMessage((error as any).response?.data?.error || 'Verification failed. Token may be invalid or expired.');
        }
    }, [data, error, token, router]);

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 selection:bg-primary/10 selection:text-primary">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-50 p-10 text-center space-y-8">
                <div className="flex justify-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-700 ${status === 'loading' ? 'bg-primary/5 text-primary animate-pulse' : status === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20 rotate-[360deg]' : 'bg-error text-white shadow-error/20 scale-110'}`}>
                        <span className="material-symbols-outlined text-4xl font-bold">
                            {status === 'loading' ? 'hourglass_empty' : status === 'success' ? 'verified' : 'error'}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black tracking-tighter text-on-surface uppercase italic">
                        {status === 'loading' ? 'Hold Steady' : status === 'success' ? 'Identity Secured' : 'Verification Denied'}
                    </h1>
                    <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                        {message}
                    </p>
                </div>

                {status === 'success' && (
                    <div className="pt-4">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-bounce">
                            Redirecting to secure login in 3s...
                        </p>
                    </div>
                )}

                {(status === 'error' || status === 'success') && (
                    <Link href={CONSTANTS.ROUTES.LOGIN} className="block w-full">
                        <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-2xl active:scale-95">
                            Proceed to Identity Gateway
                        </button>
                    </Link>
                )}
            </div>

            <footer className="mt-12">
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] italic">© 2024 JobNexa • Identity Management Node</p>
            </footer>
        </div>
    );
}

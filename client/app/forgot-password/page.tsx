'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApiMutation } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const mutation = useApiMutation<ForgotPasswordForm, any>('post', '/auth/forgot-password', {
        onSuccess: (data: any) => {
            setStatus('success');
            setMessage(data.message || 'Recovery sequence initialized. Check your email.');
        },
        onError: (error: any) => {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Failed to initialize recovery. Please try again.');
        }
    });

    const onSubmit = (data: ForgotPasswordForm) => {
        setStatus('idle');
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col items-center justify-center p-6 selection:bg-primary/10 selection:text-primary">
            {/* Abstract Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-secondary-container/5 rounded-full blur-[100px]" />
            </div>

            <main className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-50 p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary/5 text-primary flex items-center justify-center shadow-inner group transition-transform hover:scale-105 duration-500">
                            <span className="material-symbols-outlined text-4xl font-bold transition-transform group-hover:rotate-12">lock_reset</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Recover Access</h1>
                        <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">
                            Security Operations Center • Node Activation
                        </p>
                    </div>
                    <p className="text-on-surface-variant text-[11px] font-medium leading-relaxed max-w-[280px] mx-auto opacity-70">
                        Enter your verified identity email to trigger the secure recovery protocol.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-700">
                        <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl space-y-4">
                            <div className="flex justify-center">
                                <span className="material-symbols-outlined text-emerald-400 text-3xl font-black animate-pulse">mark_email_unread</span>
                            </div>
                            <p className="text-xs font-bold leading-relaxed italic">
                                {message}
                            </p>
                        </div>
                        <Link href={CONSTANTS.ROUTES.LOGIN} className="block w-full">
                            <button className="w-full py-5 bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg">
                                Return to Entry Point
                            </button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-4 bg-error/5 border border-error/10 rounded-2xl text-error text-[10px] font-black italic flex items-center gap-3 animate-in shake duration-500">
                                <span className="material-symbols-outlined text-sm font-black">warning</span>
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="email">Identity Email Hub</label>
                            <div className="relative group">
                                <input
                                    {...register('email')}
                                    className={`w-full bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.email ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white focus:shadow-xl focus:shadow-slate-100'}`}
                                    id="email"
                                    placeholder="Enter verified email"
                                    type="email"
                                    disabled={mutation.isPending}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">alternate_email</span>
                            </div>
                            {errors.email && <p className="text-error text-[10px] mt-1 font-bold italic ml-2">{errors.email.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                        >
                            {mutation.isPending ? 'PROCESSING PROTOCOL...' : 'INITIALIZE RECOVERY'}
                        </button>

                        <div className="text-center pt-2">
                            <Link href={CONSTANTS.ROUTES.LOGIN} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity italic">
                                Recall identity credentials?
                            </Link>
                        </div>
                    </form>
                )}
            </main>

            <footer className="mt-12 text-center opacity-30 group">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.5em] italic transition-opacity group-hover:opacity-100">
                    © 2024 JobNexa • Security Operations Center • Auth Node 09
                </p>
            </footer>
        </div>
    );
}
    );
}

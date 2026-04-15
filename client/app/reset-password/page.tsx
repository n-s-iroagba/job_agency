'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApiMutation } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Min 8 characters')
        .regex(/[A-Z]/, 'One uppercase')
        .regex(/[0-9]/, 'One number')
        .regex(/[\W_]/, 'One special character'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const mutation = useApiMutation<any, any>('post', '/auth/reset-password', {
        onSuccess: (data: any) => {
            setStatus('success');
            setMessage(data.message || 'Access credentials updated successfully.');
            setTimeout(() => router.push(CONSTANTS.ROUTES.LOGIN), 3000);
        },
        onError: (error: any) => {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Failed to reset password. Link may be invalid or expired.');
        }
    });

    const onSubmit = (data: ResetPasswordForm) => {
        if (!token) {
            setStatus('error');
            setMessage('Missing reset token.');
            return;
        }
        setStatus('idle');
        mutation.mutate({ token, password: data.password });
    };

    const passwordValue = watch('password', '');
    const strength = [
        passwordValue.length >= 8,
        /[A-Z]/.test(passwordValue),
        /[0-9]/.test(passwordValue),
        /[\W_]/.test(passwordValue),
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col items-center justify-center p-6 selection:bg-primary/10 selection:text-primary">
            {/* Abstract Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-tertiary-container/5 rounded-full blur-[120px]" />
            </div>

            <main className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-50 p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary shadow-2xl shadow-primary/20 text-white flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 group">
                            <span className="material-symbols-outlined text-4xl font-bold transition-transform group-hover:scale-110">key_visualizer</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Reset Identity</h1>
                        <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] opacity-50 italic">
                            Node Verification Complete • Securing Credentials
                        </p>
                    </div>
                    <p className="text-on-surface-variant text-[11px] font-medium leading-relaxed max-w-[280px] mx-auto opacity-70">
                        Cryptographic validation successful. Configure your new high-entropy password protocol.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-700">
                        <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl space-y-4 border border-slate-800">
                            <div className="flex justify-center">
                                <span className="material-symbols-outlined text-emerald-400 text-3xl font-black animate-bounce">verified_user</span>
                            </div>
                            <p className="text-xs font-bold leading-relaxed italic">
                                {message}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">
                                Routing to login node in 3s...
                            </p>
                            <Link href={CONSTANTS.ROUTES.LOGIN} className="block w-full">
                                <button className="w-full py-5 bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg border border-slate-200">
                                    Manual Relay
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-4 bg-error/5 border border-error/10 rounded-2xl text-error text-[10px] font-black italic flex items-center gap-3 animate-in shake duration-500">
                                <span className="material-symbols-outlined text-sm font-black">warning</span>
                                {message}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="password">New Passphrase</label>
                                <div className="relative group">
                                    <input
                                        {...register('password')}
                                        className={`w-full bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.password ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white focus:shadow-xl focus:shadow-slate-100'}`}
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                        disabled={mutation.isPending}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">password</span>
                                </div>
                                {errors.password && <p className="text-error text-[10px] mt-1 font-bold italic ml-2">{errors.password.message}</p>}
                            </div>
                            
                            {/* Refined Strength Bar */}
                            <div className="px-2 space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest italic leading-none">
                                    <span className="text-slate-400">Security Entropy</span>
                                    <span className={strength >= 3 ? 'text-primary' : 'text-error'}>{strength === 0 ? 'Empty' : strength <= 2 ? 'Insecure' : 'Optimal'}</span>
                                </div>
                                <div className="flex gap-1.5 h-1.5">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${strength >= (i === 1 ? 1 : i === 2 ? 3 : i === 3 ? 4 : 5) ? (strength >= 3 ? 'bg-primary' : 'bg-error') : 'bg-slate-100 shadow-inner'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="confirmPassword">Verification Relay</label>
                            <div className="relative group">
                                <input
                                    {...register('confirmPassword')}
                                    className={`w-full bg-slate-50 border-none rounded-2xl px-6 py-5 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.confirmPassword ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white focus:shadow-xl focus:shadow-slate-100'}`}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    type="password"
                                    disabled={mutation.isPending}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">verified_user</span>
                            </div>
                            {errors.confirmPassword && <p className="text-error text-[10px] mt-1 font-bold italic ml-2">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={mutation.isPending || !token}
                                className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                            >
                                {mutation.isPending ? 'ENCRYPTING NEW IDENTITY...' : 'SECURE NEW PASSWORD'}
                            </button>
                        </div>
                    </form>
                )}
            </main>

            <footer className="mt-12 text-center opacity-30 group">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.5em] italic transition-opacity group-hover:opacity-100">
                    © 2024 JobNexa • Security Control Center • Reset Node 12
                </p>
            </footer>
        </div>
    );
}
    );
}

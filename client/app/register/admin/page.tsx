'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApiMutation } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Min 8 characters')
        .regex(/[A-Z]/, 'One uppercase')
        .regex(/[a-z]/, 'One lowercase')
        .regex(/[0-9]/, 'One number')
        .regex(/[^A-Za-z0-9]/, 'One special character'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [regError, setRegError] = useState<string | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useApiMutation<RegisterForm, any>('post', '/auth/register-admin', {
        onSuccess: (data: any) => {
            login(data.accessToken, data.user);
            router.push(CONSTANTS.ROUTES.ADMIN.DASHBOARD);
        },
        onError: (error: any) => {
            setRegError(error.response?.data?.error || 'Admin Provisioning failed.');
        }
    });

    const onSubmit = (data: RegisterForm) => {
        setRegError(null);
        registerMutation.mutate(data);
    };

    const password = watch('password', '');

    const strength = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    const strengthLabel = strength <= 2 ? 'Security Low' : strength <= 4 ? 'Optimal' : 'Fortified';
    const strengthColor = strength <= 2 ? 'bg-error' : strength <= 4 ? 'bg-tertiary' : 'bg-primary';

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/10 selection:text-primary">
            {/* Minimal Header */}
            <header className="h-20 px-12 flex items-center border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="text-xl font-black text-blue-800 uppercase tracking-tighter italic">JobNexa Admin</Link>
            </header>

            <main className="flex-grow flex items-center justify-center p-12">
                <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Visual Side */}
                    <div className="hidden lg:block space-y-8">
                        <div className="inline-flex items-center px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase tracking-[0.3em] italic">
                            Administrative Provisioning
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-on-surface leading-[1.1] uppercase italic">
                            Initialize <span className="text-primary italic">Command</span> Control.
                        </h1>

                    </div>

                    {/* Form Side */}
                    <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-50 p-12 space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase italic">Provision Node</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-70">REG-004 SECURITY PROTOCOL ACTIVE</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {regError && (
                                <div className="bg-error/5 text-error text-[10px] p-4 rounded-xl border border-error/10 font-bold italic flex items-center gap-3">
                                    <span className="material-symbols-outlined text-sm font-bold">warning</span>
                                    {regError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="fullName">Full Identity</label>
                                    <div className="relative group">
                                        <input
                                            {...register('fullName')}
                                            className={`w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.fullName ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white'}`}
                                            id="fullName"
                                            placeholder="John Doe"
                                            type="text"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">badge</span>
                                    </div>
                                    {errors.fullName && <p className="text-error text-[10px] mt-1 font-bold italic ml-1">{errors.fullName.message}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="email">Admin Relay Hub</label>
                                    <div className="relative group">
                                        <input
                                            {...register('email')}
                                            className={`w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.email ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white'}`}
                                            id="email"
                                            placeholder="admin@jobnexa.com"
                                            type="email"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">alternate_email</span>
                                    </div>
                                    {errors.email && <p className="text-error text-[10px] mt-1 font-bold italic ml-1">{errors.email.message}</p>}
                                </div>

                                {/* Password Cluster */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="password">Passphrase</label>
                                        <div className="relative group">
                                            <input
                                                {...register('password')}
                                                className={`w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.password ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white'}`}
                                                id="password"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">lock</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic ml-1" htmlFor="confirmPassword">Verify Code</label>
                                        <div className="relative group">
                                            <input
                                                {...register('confirmPassword')}
                                                className={`w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 transition-all outline-none text-on-surface font-bold text-sm ${errors.confirmPassword ? 'ring-2 ring-error/40' : 'focus:ring-primary/20 focus:bg-white'}`}
                                                id="confirmPassword"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 material-symbols-outlined font-bold group-focus-within:text-primary transition-colors">verified_user</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Strength Visualization */}
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest italic">
                                        <span className="text-slate-400">Security Entropy</span>
                                        <span className={strength >= 4 ? 'text-primary' : strength >= 2 ? 'text-tertiary' : 'text-error'}>{strengthLabel}</span>
                                    </div>
                                    <div className="flex gap-1.5 h-1.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${strength >= i ? strengthColor : 'bg-slate-100'}`} />
                                        ))}
                                    </div>
                                    {errors.password && <p className="text-error text-[10px] mt-1 font-bold italic">{errors.password.message}</p>}
                                    {errors.confirmPassword && <p className="text-error text-[10px] mt-1 font-bold italic">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 mt-4"
                            >
                                {registerMutation.isPending ? 'CONFIGURING NODE...' : 'INITIALIZE ADMIN NODE'}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-80">
                                Existing Authorized Entity? <Link className="text-primary hover:underline ml-2" href={CONSTANTS.ROUTES.LOGIN}>Authenticate Here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-24 flex items-center justify-center border-t border-slate-50 bg-slate-50 relative overflow-hidden">
                <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.5em] italic z-10">© 2024 JobNexa • Executive Management Layer • Global Command Center</p>
            </footer>
        </div>
    );
}

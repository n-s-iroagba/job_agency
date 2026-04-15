'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApiMutation } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

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
    agreeTerms: z.boolean().refine(v => v === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [regError, setRegError] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useApiMutation<RegisterForm, any>('post', '/auth/register', {
        onSuccess: (data: any, variables) => {
            setRegisteredEmail(variables.email);
            setIsRegistered(true);
        },
        onError: (error: any) => {
            setRegError(error.response?.data?.error || 'Registration failed.');
        }
    });

    const resendMutation = useApiMutation<{ email: string }, any>('post', '/auth/resend-verification', {
        onSuccess: () => {
            alert('Verification link resent to ' + registeredEmail);
        },
        onError: (err: any) => {
            alert(err.response?.data?.error || 'Failed to resend link.');
        }
    });

    const handleResend = () => {
        if (registeredEmail) {
            resendMutation.mutate({ email: registeredEmail });
        }
    };

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

    const strengthLabel = strength <= 2 ? 'Weak' : strength <= 4 ? 'Moderate' : 'High Strength';
    const strengthColor = strength <= 2 ? 'bg-error' : strength <= 4 ? 'bg-tertiary' : 'bg-primary';

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] px-8 h-16 flex items-center">
                <nav className="flex justify-between items-center w-full max-w-[1280px] mx-auto">
                    <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">JobNexa</Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-slate-500 font-medium hover:text-primary transition-colors">Jobs</Link>
                        <a className="text-slate-500 font-medium hover:text-primary transition-colors" href="#">Companies</a>
                        <a className="text-slate-500 font-medium hover:text-primary transition-colors" href="#">Insights</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-slate-500 font-medium hover:text-primary transition-colors">Sign In</Link>
                        <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-lg font-semibold active:scale-95 duration-200 transition-all">Register</button>
                    </div>
                </nav>
            </header>

            <main className="flex-grow w-full flex flex-col items-center justify-center pt-24 pb-12 px-6">
                <div className="max-w-[1152px] w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Editorial Content */}
                    <div className="hidden lg:block space-y-8 pr-12 scale-90 origin-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/30 text-primary text-xs font-semibold tracking-wider uppercase">
                            Precision in Professionalism
                        </div>
                        <h1 className="text-6xl font-bold leading-[1.1] text-on-surface tracking-tight">
                            Join the <span className="text-primary">elite</span> network.
                        </h1>
                        <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-[448px]">
                            Step into a curated ecosystem where your potential meets precision. Beyond job listings, we build career legacies.
                        </p>
                        <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-on-surface">Curated Opportunities</h3>
                                    <p className="text-sm text-on-surface-variant">Access roles hand-selected for high-impact professionals.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-xl">analytics</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-on-surface">Precision Insights</h3>
                                    <p className="text-sm text-on-surface-variant">Real-time market data to guide your next strategic move.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Registration Form / Success View */}
                    <div className="w-full max-w-[448px] mx-auto lg:mx-0">
                        <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] p-8 md:p-10 border border-slate-100/50">
                            {isRegistered ? (
                                <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-inner animate-bounce">
                                            <span className="material-symbols-outlined text-4xl font-bold">mark_email_unread</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-on-surface">Precision Secured.</h2>
                                        <p className="text-on-surface-variant text-sm leading-relaxed px-4">
                                            We've dispatched a high-priority activation link to <span className="text-primary font-bold">{registeredEmail}</span>.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-surface-container-low rounded-xl text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">
                                        Please verify your identity to access the curated professional network.
                                    </div>
                                    <Link href={CONSTANTS.ROUTES.LOGIN} className="block w-full">
                                        <button className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold text-sm tracking-wide hover:bg-primary transition-all duration-300">
                                            Proceed to Portal Login
                                        </button>
                                    </Link>
                                    <p className="text-xs text-outline font-medium italic">
                                        Didn't receive the hub relay? <button 
                                            onClick={handleResend}
                                            disabled={resendMutation.isPending}
                                            className="text-primary font-bold hover:underline disabled:opacity-50"
                                        >
                                            {resendMutation.isPending ? 'Resending...' : 'Resend'}
                                        </button>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8 text-center lg:text-left">
                                        <h2 className="text-2xl font-bold text-on-surface">Create Account</h2>
                                        <p className="text-on-surface-variant text-sm mt-2">Start your professional curation today.</p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {regError && (
                                            <div className="bg-error/5 text-error text-xs p-3 rounded-lg border border-error/10 flex items-center gap-2 italic">
                                                <span className="material-symbols-outlined text-sm">error</span>
                                                {regError}
                                            </div>
                                        )}

                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="fullName">Full Name</label>
                                            <div className="relative">
                                                <input
                                                    {...register('fullName')}
                                                    className={`w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 transition-all outline-none text-on-surface ${errors.fullName ? 'ring-2 ring-error/40' : 'focus:ring-primary/40 focus:bg-surface-container-lowest'}`}
                                                    id="fullName"
                                                    placeholder="Enter your full name"
                                                    type="text"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 material-symbols-outlined">person</span>
                                            </div>
                                            {errors.fullName && <p className="text-error text-[10px] mt-1 font-bold">{errors.fullName.message}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">Work Email</label>
                                            <div className="relative">
                                                <input
                                                    {...register('email')}
                                                    className={`w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 transition-all outline-none text-on-surface ${errors.email ? 'ring-2 ring-error/40' : 'focus:ring-primary/40 focus:bg-surface-container-lowest'}`}
                                                    id="email"
                                                    placeholder="name@company.com"
                                                    type="email"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 material-symbols-outlined">mail</span>
                                            </div>
                                            {errors.email && <p className="text-error text-[10px] mt-1 font-bold">{errors.email.message}</p>}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                                            <div className="relative">
                                                <input
                                                    {...register('password')}
                                                    className={`w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 transition-all outline-none text-on-surface ${errors.password ? 'ring-2 ring-error/40' : 'focus:ring-primary/40 focus:bg-surface-container-lowest'}`}
                                                    id="password"
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 material-symbols-outlined">lock</span>
                                            </div>

                                            {/* Password Strength Indicator */}
                                            <div className="mt-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Security Tier</span>
                                                    <span className={`text-[10px] font-bold uppercase ${strength >= 3 ? 'text-primary' : 'text-error'}`}>{strengthLabel}</span>
                                                </div>
                                                <div className="flex gap-1 h-1">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className={`flex-1 rounded-full transition-colors ${strength >= (i === 1 ? 1 : i === 2 ? 3 : i === 3 ? 4 : 5) ? strengthColor : 'bg-surface-container-high'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            {errors.password && <p className="text-error text-[10px] mt-1 font-bold">{errors.password.message}</p>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="confirmPassword">Confirm Password</label>
                                            <input
                                                {...register('confirmPassword')}
                                                className={`w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 transition-all outline-none text-on-surface ${errors.confirmPassword ? 'ring-2 ring-error/40' : 'focus:ring-primary/40 focus:bg-surface-container-lowest'}`}
                                                id="confirmPassword"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                            {errors.confirmPassword && <p className="text-error text-[10px] mt-1 font-bold">{errors.confirmPassword.message}</p>}
                                        </div>

                                        {/* Privacy Policy */}
                                        <div>
                                            <div className="flex items-start gap-3">
                                                <input
                                                    {...register('agreeTerms')}
                                                    className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                                                    id="privacy"
                                                    type="checkbox"
                                                />
                                                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="privacy">
                                                    I agree to the <Link className="text-primary hover:underline font-medium" href={CONSTANTS.ROUTES.PRIVACY}>Privacy Policy</Link> and <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a>.
                                                </label>
                                            </div>
                                            {errors.agreeTerms && <p className="text-error text-[10px] mt-1 font-bold">{errors.agreeTerms.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={registerMutation.isPending}
                                            className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-lg font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {registerMutation.isPending ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                                        </button>

                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20"></div></div>
                                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold"><span className="bg-surface-container-lowest px-4 text-outline">or curate with</span></div>
                                        </div>

                                        <button type="button" className="w-full flex items-center justify-center gap-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface py-4 rounded-lg font-semibold text-sm transition-all duration-300">
                                            <img alt="Google" className="w-5 h-5" src="https://www.google.com/favicon.ico" />
                                            Continue with Google
                                        </button>
                                    </form>

                                    <p className="text-center text-sm text-on-surface-variant mt-8">
                                        Already part of the network? <Link className="text-primary font-bold hover:underline ml-1" href={CONSTANTS.ROUTES.LOGIN}>Sign In</Link>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 px-8">
                <div className="flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-6 text-center lg:text-left">
                    <div className="text-lg font-bold text-slate-900">JobNexa</div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <Link className="text-slate-500 font-medium hover:text-primary transition-colors hover:underline underline-offset-4" href={CONSTANTS.ROUTES.PRIVACY}>Privacy Policy</Link>
                        <a className="text-slate-500 font-medium hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Terms of Service</a>
                        <a className="text-slate-500 font-medium hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Cookie Settings</a>
                        <a className="text-slate-500 font-medium hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Contact</a>
                    </div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        © 2024 JobNexa. Precision in Professionalism.
                    </div>
                </div>
            </footer>
        </div>
    );
}

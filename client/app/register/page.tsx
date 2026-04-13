'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
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

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useApiMutation<RegisterForm, any>('post', '/auth/register', {
        onSuccess: (data: any) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push(CONSTANTS.ROUTES.DASHBOARD);
        },
        onError: (error: any) => {
            setRegError(error.response?.data?.error || 'Registration failed.');
        }
    });

    const onSubmit = (data: RegisterForm) => {
        setRegError(null);
        registerMutation.mutate(data);
    };

    const password = watch('password', '');

    const strengthTests = [
        { label: '8+ chars', test: password.length >= 8 },
        { label: 'Uppercase', test: /[A-Z]/.test(password) },
        { label: 'Lowercase', test: /[a-z]/.test(password) },
        { label: 'Number', test: /[0-9]/.test(password) },
        { label: 'Special', test: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1 flex items-center justify-center p-lg pt-32 pb-xl bg-slate-50">
                <div className="card w-full max-w-md p-xl space-y-xl bg-surface">
                    <div className="text-center">
                        <h2>Create Your Account</h2>
                        <p className="text-text-secondary text-sm mt-xs">Start your global career journey today</p>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 border border-border rounded-md py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                        Sign up with Google
                    </button>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
                        {regError && (
                            <div className="bg-red-50 text-danger text-xs p-sm rounded-md border border-red-100 italic">
                                ⚠ {regError}
                            </div>
                        )}

                        <div>
                            <label className="label">Full Name</label>
                            <input {...register('fullName')} className="input" placeholder="John Doe" />
                            {errors.fullName && <p className="text-danger text-[11px] mt-1">{errors.fullName.message}</p>}
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input {...register('email')} className="input" placeholder="email@example.com" />
                            {errors.email && <p className="text-danger text-[11px] mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input {...register('password')} type="password" className="input" placeholder="••••••••" />
                            <div className="grid grid-cols-3 gap-1 mt-2">
                                {strengthTests.map((t, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${t.test ? 'bg-success' : 'bg-slate-200'}`} />
                                        <span className={`text-[9px] ${t.test ? 'text-success' : 'text-text-secondary'}`}>{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="label">Confirm Password</label>
                            <input {...register('confirmPassword')} type="password" className="input" placeholder="••••••••" />
                            {errors.confirmPassword && <p className="text-danger text-[11px] mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input type="checkbox" {...register('agreeTerms')} className="mt-1" />
                            <p className="text-[11px] text-text-secondary leading-tight">
                                I agree to the <Link href={CONSTANTS.ROUTES.PRIVACY} className="text-primary hover:underline">Privacy Policy</Link> and data collection terms per REG-002/GDPR.
                            </p>
                        </div>
                        {errors.agreeTerms && <p className="text-danger text-[11px]">{errors.agreeTerms.message}</p>}

                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="btn-primary w-full py-2.5 disabled:opacity-50 mt-xl"
                        >
                            {registerMutation.isPending ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-secondary">
                        Already have an account? <Link href={CONSTANTS.ROUTES.LOGIN} className="text-primary font-semibold hover:underline">Login →</Link>
                    </p>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}

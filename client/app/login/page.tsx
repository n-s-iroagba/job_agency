'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useApiMutation } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || CONSTANTS.ROUTES.DASHBOARD;
    const [loginError, setLoginError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useApiMutation<LoginForm, any>('post', '/auth/login', {
        onSuccess: (data: any) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push(redirectPath);
        },
        onError: (error: any) => {
            setLoginError(error.response?.data?.error || 'Invalid credentials provided.');
        }
    });

    const onSubmit = (data: LoginForm) => {
        setLoginError(null);
        loginMutation.mutate(data);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1 flex items-center justify-center p-lg pt-32 pb-xl bg-slate-50">
                <div className="card w-full max-w-md p-xl space-y-xl bg-surface">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center text-white font-bold mx-auto mb-md text-xl">J</div>
                        <h2>Welcome Back</h2>
                        <p className="text-text-secondary text-sm mt-xs">Login to track your applications</p>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 border border-border rounded-md py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                        Sign in with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-2 text-text-secondary">or</span></div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
                        {loginError && (
                            <div className="bg-red-50 text-danger text-xs p-sm rounded-md border border-red-100 italic">
                                ⚠ {loginError}
                            </div>
                        )}

                        <div>
                            <label className="label">Email</label>
                            <input {...register('email')} className={`input ${errors.email ? 'border-danger' : ''}`} placeholder="email@example.com" />
                            {errors.email && <p className="text-danger text-[11px] mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-xs">
                                <label className="label mb-0">Password</label>
                                <Link href="#" className="text-[11px] text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <input {...register('password')} type="password" className={`input ${errors.password ? 'border-danger' : ''}`} placeholder="••••••••" />
                            {errors.password && <p className="text-danger text-[11px] mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="btn-primary w-full py-2.5 disabled:opacity-50"
                        >
                            {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-text-secondary">
                        Don't have an account? <Link href={CONSTANTS.ROUTES.REGISTER} className="text-primary font-semibold hover:underline">Create one →</Link>
                    </p>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}

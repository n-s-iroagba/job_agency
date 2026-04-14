'use client';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApiMutation } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || CONSTANTS.ROUTES.DASHBOARD;
    const [loginError, setLoginError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed antialiased">
            <main className="flex-grow w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-[10%] -left-[5%] w-[35%] h-[50%] bg-secondary-container/30 rounded-full blur-[100px]"></div>
                </div>

                <div className="w-full max-w-[448px]">
                    {/* Branding Header */}
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-on-surface hover:opacity-80 transition-opacity">
                            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm text-fill">work</span>
                            </span>
                            JobNexa
                        </Link>
                        <p className="text-on-surface-variant mt-2 font-medium tracking-tight">Precision in Professionalism.</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)] border border-slate-100/50">
                        <h2 className="text-xl font-semibold mb-8 text-center text-on-surface">Welcome back</h2>

                        {/* SSO Section */}
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 rounded-lg group">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="font-medium text-on-surface group-active:scale-95 transition-transform">Sign in with Google</span>
                            </button>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-outline-variant/30"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-surface-container-lowest text-on-surface-variant font-medium">Or continue with email</span>
                            </div>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {loginError && (
                                <div className="bg-error/5 text-error text-xs p-3 rounded-lg border border-error/10 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    {loginError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-2" htmlFor="email">Email address</label>
                                <input
                                    {...register('email')}
                                    className={`w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 transition-all placeholder:text-outline outline-none ${errors.email ? 'ring-2 ring-error/40' : 'focus:ring-primary/40 focus:bg-surface-container-lowest'}`}
                                    id="email"
                                    placeholder="name@company.com"
                                    type="email"
                                />
                                {errors.email && <p className="text-error text-[10px] mt-1 font-bold uppercase tracking-tighter">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-on-surface-variant tracking-wider uppercase" htmlFor="password">Password</label>
                                    <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        className={`w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 transition-all placeholder:text-outline outline-none ${errors.password ? 'ring-2 ring-error/40' : 'focus:ring-primary/40 focus:bg-surface-container-lowest'}`}
                                        id="password"
                                        placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-error text-[10px] mt-1 font-bold uppercase tracking-tighter">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                            >
                                {loginMutation.isPending ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 text-center border-t border-slate-50">
                            <p className="text-sm text-on-surface-variant">
                                Don't have an account?
                                <Link href={CONSTANTS.ROUTES.REGISTER} className="font-bold text-primary hover:text-primary-container transition-colors ml-1">Create an account</Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 opacity-60">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                            <span className="text-xs font-medium uppercase tracking-widest">Securely Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">verified_user</span>
                            <span className="text-xs font-medium uppercase tracking-widest">GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="w-full py-10 px-8">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[0.75rem] font-medium text-slate-500">© 2024 JobNexa. Precision in Professionalism.</p>
                    <div className="flex gap-8">
                        <Link className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors" href={CONSTANTS.ROUTES.PRIVACY}>Privacy Policy</Link>
                        <a className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors" href="#">Terms of Service</a>
                        <a className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors" href="#">Cookie Settings</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}


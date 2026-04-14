'use client';

import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export function PublicHeader() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm shadow-slate-200/50 flex justify-between items-center px-4 sm:px-8 h-16 max-w-full">
            <div className="flex items-center gap-8">
                <Link href={CONSTANTS.ROUTES.HOME} className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
                    CareerCurator
                </Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link href={CONSTANTS.ROUTES.HOME} className="text-blue-600 font-semibold font-sans antialiased text-sm transition-colors duration-300">
                        Home
                    </Link>
                    <Link href={CONSTANTS.ROUTES.JOBS} className="text-slate-600 hover:text-blue-700 font-sans antialiased text-sm font-medium transition-colors duration-300">
                        Jobs
                    </Link>
                    <Link href={CONSTANTS.ROUTES.PRIVACY} className="text-slate-600 hover:text-blue-700 font-sans antialiased text-sm font-medium transition-colors duration-300">
                        Privacy
                    </Link>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Link href={CONSTANTS.ROUTES.LOGIN} className="text-slate-600 hover:text-blue-700 font-sans antialiased text-sm font-medium transition-colors duration-300">
                    Login
                </Link>
                <Link href={CONSTANTS.ROUTES.REGISTER} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-container transition-all duration-300">
                    Signup
                </Link>
            </div>
        </nav>
    );
}

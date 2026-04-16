'use client';

import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export function PublicHeader() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 flex justify-between items-center px-8 lg:px-16 h-20 max-w-full font-sans antialiased text-slate-900">
            <div className="flex items-center gap-12">
                <Link href={CONSTANTS.ROUTES.HOME} className="flex flex-col">
                    <span className="text-xl font-black italic uppercase tracking-[0.1em] text-slate-900">CareerCurator</span>
                </Link>
                <div className="hidden md:flex gap-10 items-center">
                    <Link href={CONSTANTS.ROUTES.HOME} className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] transition-all">
                        Index
                    </Link>
                    <Link href={CONSTANTS.ROUTES.JOBS} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">
                        Opportunities
                    </Link>
                    <Link href={CONSTANTS.ROUTES.PRIVACY} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">
                        Privacy
                    </Link>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <Link href={CONSTANTS.ROUTES.LOGIN} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">
                    Login
                </Link>
                <Link href={CONSTANTS.ROUTES.REGISTER} className="bg-slate-900 text-white px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                    Sign Up
                </Link>
            </div>
        </nav>
    );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';

const navItems = [
    { label: 'Overview', href: CONSTANTS.ROUTES.ADMIN.DASHBOARD, icon: 'analytics' },
    { label: 'Applications', href: '/admin/applicants', icon: 'assignment' },
    { label: 'Payments Queue', href: CONSTANTS.ROUTES.ADMIN.UNVERIFIED, icon: 'payments' },
    { label: 'Job Management', href: CONSTANTS.ROUTES.ADMIN.JOBS, icon: 'business_center' },
    { label: 'Category Engine', href: CONSTANTS.ROUTES.ADMIN.CATEGORIES, icon: 'layers' },
    { label: 'Mail Composer', href: CONSTANTS.ROUTES.ADMIN.MAIL, icon: 'chat' },
    { label: 'System Health', href: CONSTANTS.ROUTES.ADMIN.HEALTH, icon: 'health_and_safety' },
    { label: 'Bank Settings', href: CONSTANTS.ROUTES.ADMIN.BANK_ACCOUNTS, icon: 'account_balance' },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push(CONSTANTS.ROUTES.LOGIN);
    };

    return (
        <aside className="h-screen w-72 fixed left-0 top-0 bg-slate-900 flex flex-col space-y-2 z-50 selection:bg-blue-500/30 selection:text-blue-200">
            {/* Brand / Header */}
            <div className="px-8 py-10">
                <Link href={CONSTANTS.ROUTES.ADMIN.DASHBOARD}>
                    <h1 className="text-white font-black tracking-tighter text-2xl hover:text-blue-400 transition-colors">CareerCurator</h1>
                </Link>
                <div className="mt-6 flex items-center space-x-3 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                        AU
                    </div>
                    <div>
                        <p className="text-white text-xs font-bold uppercase tracking-tight">Admin Console</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest opacity-80">System Oversight</p>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${active
                                    ? 'bg-blue-600/10 text-blue-400 shadow-inner'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span
                                className={`material-symbols-outlined mr-4 transition-transform group-hover:scale-110 ${active ? 'font-bold' : ''}`}
                                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                            <span className={`font-bold text-[10px] uppercase tracking-[0.2em] ${active ? 'text-blue-400' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-4 rounded-xl bg-slate-800 text-slate-400 hover:bg-error hover:text-white transition-all duration-300 group"
                >
                    <span className="material-symbols-outlined text-sm mr-2 group-hover:rotate-12 transition-transform">logout</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

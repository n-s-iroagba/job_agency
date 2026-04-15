'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { label: 'Overview', href: CONSTANTS.ROUTES.ADMIN.DASHBOARD, icon: 'analytics' },
    { label: 'Applications', href: '/admin/applicants', icon: 'assignment' },
    { label: 'Payments Queue', href: CONSTANTS.ROUTES.ADMIN.UNVERIFIED, icon: 'payments' },
    { label: 'Payments', href: CONSTANTS.ROUTES.ADMIN.UNPAID, icon: 'receipt_long' },
    { label: 'Job Management', href: CONSTANTS.ROUTES.ADMIN.JOBS, icon: 'business_center' },
    { label: 'Category Engine', href: CONSTANTS.ROUTES.ADMIN.CATEGORIES, icon: 'layers' },
    { label: 'Benefits', href: CONSTANTS.ROUTES.ADMIN.BENEFITS, icon: 'redeem' },
    { label: 'Conditions', href: CONSTANTS.ROUTES.ADMIN.CONDITIONS, icon: 'fact_check' },
    { label: 'Mail Composer', href: CONSTANTS.ROUTES.ADMIN.MAIL, icon: 'chat' },
    { label: 'System Health', href: CONSTANTS.ROUTES.ADMIN.HEALTH, icon: 'health_and_safety' },
    { label: 'Bank Settings', href: CONSTANTS.ROUTES.ADMIN.BANK_ACCOUNTS, icon: 'account_balance' },
    { label: 'Crypto Wallets', href: CONSTANTS.ROUTES.ADMIN.CRYPTO_WALLETS, icon: 'account_balance_wallet' },
];

export function AdminSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const initials = user?.fullName ? user.fullName.split(' ').map((n: any) => n[0]).join('').toUpperCase() : 'AU';

    return (
        <aside className={`h-screen fixed left-0 top-0 bg-slate-900 flex flex-col transition-all duration-300 z-50 selection:bg-blue-500/30 selection:text-blue-200 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-10 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-blue-500 transition-colors z-[60]"
            >
                <span className="material-symbols-outlined text-[14px] font-bold">
                    {isCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
            </button>

            {/* Brand / Header */}
            <div className={`py-10 transition-all duration-300 ${isCollapsed ? 'px-4 flex justify-center' : 'px-8'}`}>
                <Link href={CONSTANTS.ROUTES.ADMIN.DASHBOARD}>
                    {isCollapsed ? (
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">J</div>
                    ) : (
                        <h1 className="text-white font-black tracking-tighter text-2xl hover:text-blue-400 transition-colors">JobNexa</h1>
                    )}
                </Link>
                {!isCollapsed && (
                    <div className="mt-6 flex items-center space-x-3 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20">
                            {initials}
                        </div>
                        <div>
                            <p className="text-white text-[10px] font-bold uppercase tracking-tight truncate max-w-[120px]">
                                {user?.fullName || 'Admin Console'}
                            </p>
                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest opacity-80">System Oversight</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className={`flex-1 space-y-1 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : ''}
                            className={`flex items-center transition-all duration-300 group rounded-xl ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'px-4 py-3.5'} ${active
                                ? 'bg-blue-600/10 text-blue-400 shadow-inner'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span
                                className={`material-symbols-outlined transition-transform group-hover:scale-110 ${active ? 'font-bold' : ''} ${isCollapsed ? 'm-0' : 'mr-4'}`}
                                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span className={`font-bold text-[10px] uppercase tracking-[0.2em] ${active ? 'text-blue-400' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className={`p-6 transition-all duration-300 ${isCollapsed ? 'px-2 flex justify-center' : 'p-6'}`}>
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? 'Logout' : ''}
                    className={`flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-error hover:text-white transition-all duration-300 group ${isCollapsed ? 'w-12 h-12 p-0' : 'w-full py-4'}`}
                >
                    <span className={`material-symbols-outlined text-sm group-hover:rotate-12 transition-transform ${isCollapsed ? 'm-0' : 'mr-2'}`}>logout</span>
                    {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

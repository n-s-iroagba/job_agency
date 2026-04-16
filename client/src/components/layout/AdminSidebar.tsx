'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { label: 'Overview', href: CONSTANTS.ROUTES.ADMIN.DASHBOARD, icon: 'analytics' },
    { label: 'Applicants', href: '/admin/applicants', icon: 'groups' },
    { label: 'Payment Queue', href: CONSTANTS.ROUTES.ADMIN.UNVERIFIED, icon: 'account_tree' },
    { label: 'Payments', href: CONSTANTS.ROUTES.ADMIN.UNPAID, icon: 'receipt_long' },
    { label: 'Jobs', href: CONSTANTS.ROUTES.ADMIN.JOBS, icon: 'business_center' },
    { label: 'Categories', href: CONSTANTS.ROUTES.ADMIN.CATEGORIES, icon: 'layers' },
    { label: 'Benefits', href: CONSTANTS.ROUTES.ADMIN.BENEFITS, icon: 'redeem' },
    { label: 'Conditions', href: CONSTANTS.ROUTES.ADMIN.CONDITIONS, icon: 'fact_check' },
    { label: 'Mail', href: CONSTANTS.ROUTES.ADMIN.MAIL, icon: 'mail' },
    { label: 'Health', href: CONSTANTS.ROUTES.ADMIN.HEALTH, icon: 'health_and_safety' },
    { label: 'Bank Accounts', href: CONSTANTS.ROUTES.ADMIN.BANK_ACCOUNTS, icon: 'account_balance' },
    { label: 'Wallets', href: CONSTANTS.ROUTES.ADMIN.CRYPTO_WALLETS, icon: 'account_balance_wallet' },
];

export function AdminSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const initials = user?.fullName ? user.fullName.split(' ').map((n: any) => n[0]).join('').toUpperCase() : 'AU';

    return (
        <aside className={`h-screen fixed left-0 top-0 bg-slate-900 flex flex-col transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-10 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-slate-700 transition-colors z-[60]"
            >
                <span className="material-symbols-outlined text-[14px] font-bold">
                    {isCollapsed ? 'chevron_right' : 'chevron_left'}
                </span>
            </button>

            {/* Brand / Header */}
            <div className={`py-8 transition-all duration-300 ${isCollapsed ? 'px-4 flex justify-center' : 'px-8'}`}>
                <Link href={CONSTANTS.ROUTES.ADMIN.DASHBOARD}>
                    {isCollapsed ? (
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">J</div>
                    ) : (
                        <h1 className="text-white font-bold tracking-tight text-xl">JobNexa</h1>
                    )}
                </Link>
                {!isCollapsed && (
                    <div className="mt-6 flex items-center space-x-3 bg-slate-800/40 p-3 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-[11px] font-bold truncate">
                                {user?.fullName || 'Admin'}
                            </p>
                            <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Administrator</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className={`flex-1 space-y-1 transition-all duration-300 py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : ''}
                            className={`flex items-center transition-all duration-200 group rounded-lg ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'px-4 py-2.5'} ${active
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <span
                                className={`material-symbols-outlined transition-transform group-hover:scale-110 ${isCollapsed ? 'm-0' : 'mr-3'}`}
                                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0", fontSize: '20px' }}
                            >
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span className="font-bold text-[11px] uppercase tracking-wider">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className={`p-4 transition-all duration-300 ${isCollapsed ? 'px-2 flex justify-center' : 'p-4'}`}>
                <button
                    onClick={handleLogout}
                    className={`flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-red-900 hover:text-white transition-all duration-200 group ${isCollapsed ? 'w-12 h-12 p-0' : 'w-full py-3'}`}
                >
                    <span className={`material-symbols-outlined text-sm ${isCollapsed ? 'm-0' : 'mr-2'}`}>logout</span>
                    {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

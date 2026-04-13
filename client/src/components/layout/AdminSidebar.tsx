'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import {
    LayoutDashboard,
    Briefcase,
    Layers,
    Users,
    CreditCard,
    Activity,
    Settings,
    Mail,
    LogOut,
    ShieldCheck
} from 'lucide-react';

const navItems = [
    { label: 'Overview', href: CONSTANTS.ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: 'System Health', href: CONSTANTS.ROUTES.ADMIN.HEALTH, icon: Activity },
    { label: 'Manage Jobs', href: CONSTANTS.ROUTES.ADMIN.JOBS, icon: Briefcase },
    { label: 'Categories', href: CONSTANTS.ROUTES.ADMIN.CATEGORIES, icon: Layers },
    { label: 'Applicants', href: '/admin/applicants', icon: Users },
    { label: 'Unverified Proofs', href: CONSTANTS.ROUTES.ADMIN.UNVERIFIED, icon: ShieldCheck },
    { label: 'Unpaid Queue', href: CONSTANTS.ROUTES.ADMIN.UNPAID, icon: CreditCard },
    { label: 'Finance Settings', href: CONSTANTS.ROUTES.ADMIN.BANK_ACCOUNTS, icon: Settings },
    { label: 'Mail Composer', href: CONSTANTS.ROUTES.ADMIN.MAIL, icon: Mail },
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
        <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900 text-slate-300 flex flex-col py-6">
            <div className="px-6 mb-10 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold">J</div>
                <span className="font-bold text-lg text-white">Admin Central</span>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 pt-6 border-t border-slate-800 space-y-1">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    System Logout
                </button>
            </div>
        </aside>
    );
}

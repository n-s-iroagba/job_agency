'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Bell,
    User,
    LogOut,
    HelpCircle
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: CONSTANTS.ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'My Applications', href: CONSTANTS.ROUTES.APPLICATIONS, icon: Briefcase },
    { label: 'Browse Jobs', href: CONSTANTS.ROUTES.JOBS, icon: FileText },
    { label: 'CV Management', href: CONSTANTS.ROUTES.CV, icon: FileText },
    { label: 'Notifications', href: CONSTANTS.ROUTES.NOTIFICATIONS, icon: Bell },
    { label: 'Profile', href: CONSTANTS.ROUTES.PROFILE, icon: User },
];

export function ApplicantSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push(CONSTANTS.ROUTES.LOGIN);
    };

    return (
        <aside className="w-60 h-screen fixed left-0 top-0 bg-surface border-r border-border flex flex-col pt-6 pb-6">
            <div className="px-6 mb-10 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold">J</div>
                <span className="font-bold text-lg">{CONSTANTS.APP_NAME}</span>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                                    ? 'bg-blue-50 text-primary border-l-4 border-primary'
                                    : 'text-text-secondary hover:bg-slate-50'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 pt-6 border-t border-border space-y-1">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Support</div>
                <div className="px-3 py-2 text-xs text-text-secondary flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    +1-555-HELP
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-danger hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { label: 'Dashboard', href: CONSTANTS.ROUTES.DASHBOARD, icon: 'dashboard' },
    { label: 'My Applications', href: CONSTANTS.ROUTES.APPLICATIONS, icon: 'work' },
    { label: 'Browse Jobs', href: CONSTANTS.ROUTES.JOBS, icon: 'search' },
    { label: 'CV Management', href: CONSTANTS.ROUTES.CV, icon: 'description' },
    { label: 'Notifications', href: CONSTANTS.ROUTES.NOTIFICATIONS, icon: 'notifications' },
    { label: 'Profile', href: CONSTANTS.ROUTES.PROFILE, icon: 'person' },
];

export function ApplicantSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 flex flex-col py-6 transition-all duration-200 z-40 border-r border-slate-100">
            <div className="px-6 mb-10">
                <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
                    JobNexa
                </Link>
            </div>

            <nav className="flex-1 flex flex-col px-4">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 mb-1 ${active
                                ? 'text-primary font-bold border-r-4 border-primary bg-slate-100'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${active ? 'text-fill' : ''}`} style={{ fontSize: '20px' }}>
                                {item.icon}
                            </span>
                            <span className="font-sans text-sm tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-4">
                <div className="bg-surface-container-low p-4 rounded-lg mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-on-surface truncate max-w-[120px]">
                            {user?.fullName || 'Applicant'}
                        </p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter font-bold">Precision Curation</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 text-slate-500 hover:text-error hover:bg-error/5 rounded-lg transition-all duration-200"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                    <span className="font-sans text-sm tracking-wide">Logout</span>
                </button>
            </div>
        </aside>
    );
}

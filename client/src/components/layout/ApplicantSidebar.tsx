'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { label: 'Dashboard', href: CONSTANTS.ROUTES.DASHBOARD, icon: 'dashboard' },
    { label: 'My Applications', href: CONSTANTS.ROUTES.APPLICATIONS, icon: 'work' },
    { label: 'Browse Jobs', href: CONSTANTS.ROUTES.JOBS, icon: 'search' },
    { label: 'CV / Resume', href: CONSTANTS.ROUTES.CV, icon: 'description' },
    { label: 'Notifications', href: CONSTANTS.ROUTES.NOTIFICATIONS, icon: 'notifications' },
    { label: 'Settings', href: CONSTANTS.ROUTES.PROFILE, icon: 'person' },
];

export function ApplicantSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const initials = user?.fullName ? user.fullName.split(' ').map((n: any) => n[0]).join('').toUpperCase() : 'AP';

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-white flex flex-col transition-all duration-300 z-50 border-r border-slate-100 font-sans text-slate-900">
            {/* Branding */}
            <div className="py-12 px-8 border-b border-slate-50">
                <Link href="/" className="flex flex-col">
                    <span className="text-xl font-black italic uppercase tracking-[0.1em] text-slate-900">JobNexa</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Applicant Portal</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col px-4 py-8 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 py-3.5 px-6 rounded-xl transition-all duration-200 group ${active
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <span className={`material-symbols-outlined transition-transform group-hover:scale-110 ${active ? 'font-bold' : ''}`} style={{ fontSize: '20px' }}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile & Logout */}
            <div className="p-6 border-t border-slate-50">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6 min-w-0 border border-slate-100/50">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 truncate">
                            {user?.fullName || 'Applicant'}
                        </p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Candidate</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1" style={{ fontSize: '18px' }}>logout</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

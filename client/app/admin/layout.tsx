'use client';

import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('adminSidebarCollapsed');
        if (savedState !== null) {
            setIsSidebarOpen(JSON.parse(savedState));
        }

        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userStr || !token) {
            router.push(CONSTANTS.ROUTES.LOGIN);
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== CONSTANTS.ROLES.ADMIN) {
                router.push(CONSTANTS.ROUTES.DASHBOARD);
                return;
            }
        } catch (e) {
            router.push(CONSTANTS.ROUTES.LOGIN);
            return;
        }

        setAuthorized(true);
    }, [router]);

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
    };

    if (!authorized) return null;

    return (
        <div className="flex min-h-screen bg-white overflow-x-hidden font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-[60]">
                <h1 className="text-white font-bold tracking-tight text-lg">JobNexa</h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-10 h-10 flex items-center justify-center text-white"
                >
                    <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Sidebar with mobile overlay */}
            <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />

            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AdminSidebar isCollapsed={isSidebarOpen} onToggle={toggleSidebar} />
            </div>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 min-w-0 pt-16 lg:pt-0 ${isSidebarOpen ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 lg:py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('adminSidebarCollapsed');
        if (savedState !== null) {
            setIsSidebarCollapsed(JSON.parse(savedState));
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
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
    };

    if (!authorized) return null;

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
            <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`flex-1 transition-all duration-300 min-w-0 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
                <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                    {children}
                </div>
            </main>
        </div>
    );
}

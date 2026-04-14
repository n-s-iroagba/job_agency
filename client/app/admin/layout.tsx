'use client';

import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useRouter } from 'next/navigation';
import { CONSTANTS } from '@/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userStr || !token) {
            router.push(CONSTANTS.ROUTES.LOGIN);
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== CONSTANTS.ROLES.ADMIN) {
            router.push(CONSTANTS.ROUTES.DASHBOARD);
            return;
        }

        setAuthorized(true);
    }, [router]);

    if (!authorized) return null;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 ml-72">
                <div className="max-w-[1280px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

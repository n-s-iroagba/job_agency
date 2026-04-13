'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { data: notifications, isLoading, refetch } = useApiQuery<Notification[]>(
        ['notifications', 'user'],
        '/notifications'
    );

    const markReadMutation = useApiMutation('put', '/notifications', {
        onSuccess: () => refetch()
    });

    const handleMarkAllRead = () => {
        // Assuming bulk mark read endpoint or loop
        markReadMutation.mutate({ all: true });
    };

    if (isLoading) return (
        <div className="space-y-12 animate-pulse">
            <div className="h-40 bg-slate-100 rounded-2xl" />
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-12 selection:bg-primary-container selection:text-on-primary-container pb-24 max-w-5xl">
            {/* Header Section */}
            <header>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-[3.5rem] font-bold leading-tight tracking-tighter text-on-surface mb-2">Updates</h1>
                        <p className="text-on-surface-variant text-lg max-w-xl font-light leading-relaxed">
                            Stay informed on your professional journey. Manage your application status, payments, and team communications in one place.
                        </p>
                    </div>
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-6 py-3 bg-surface-container-high hover:bg-slate-200 text-on-surface-variant font-bold text-xs uppercase tracking-widest rounded-lg transition-all"
                    >
                        <span className="material-symbols-outlined font-bold">done_all</span>
                        Mark all as read
                    </button>
                </div>
            </header>

            {/* Notifications Container */}
            <div className="space-y-12">
                {notifications && notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-container-low/30 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-slate-300 mb-6">
                            <span className="material-symbols-outlined text-5xl font-bold">notifications_off</span>
                        </div>
                        <h2 className="text-xl font-bold text-on-surface mb-1 uppercase tracking-tight">You're all caught up</h2>
                        <p className="text-on-surface-variant max-w-xs text-xs font-bold uppercase tracking-widest opacity-60 italic">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Group: Recent */}
                        <div>
                            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-6 px-4">Latest Stream</h3>
                            <div className="space-y-3">
                                {notifications?.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`group relative p-6 rounded-2xl transition-all duration-300 flex items-start gap-5 border ${!n.isRead
                                                ? 'bg-white shadow-2xl shadow-primary/5 border-primary/10'
                                                : 'bg-surface-container-low/30 border-transparent opacity-70 grayscale-[0.3] hover:grayscale-0 hover:opacity-100 hover:bg-white'
                                            }`}
                                    >
                                        {!n.isRead && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-r-full shadow-lg shadow-primary/40"></div>
                                        )}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                                n.type === 'ALERT' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-primary/10 text-primary'
                                            }`}>
                                            <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                {n.type === 'SUCCESS' ? 'check_circle' : n.type === 'ALERT' ? 'warning' : 'notifications'}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors tracking-tight uppercase">{n.title}</h4>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-on-surface-variant mb-4 font-medium leading-relaxed">{n.message}</p>
                                            <div className="flex items-center gap-4">
                                                <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                                                    Action Detail <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                                                </button>
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => markReadMutation.mutate({ id: n.id, isRead: true })}
                                                        className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-on-surface transition-colors"
                                                    >
                                                        Dismiss
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Support/Info Card */}
            <footer className="p-8 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl font-bold">mail_lock</span>
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Communications Integrity</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic max-w-xl">
                        EliteTalent ensures all communications are encrypted and verified. Critical updates are also mirrored via email and secure SMS protocols. (NFR-SEC-006)
                    </p>
                </div>
            </footer>
        </div>
    );
}

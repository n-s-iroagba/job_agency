'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Info,
    MailCheck,
    Clock
} from 'lucide-react';

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

    const handleMarkRead = (id: number) => {
        markReadMutation.mutate({ id, isRead: true }, {
            // override generic mutation logic for specific URL if needed
            // but our lib/hooks should handle it if passed correctly
        });
    };

    if (isLoading) return <div className="space-y-md animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="card h-20 bg-slate-50" />)}
    </div>;

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="mb-1">Notifications</h1>
                    <p className="text-text-secondary">Updates on your applications and payments (STK-APP-NOTIF-001)</p>
                </div>
                {unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                        {unreadCount} UNREAD
                    </span>
                )}
            </header>

            {notifications && notifications.length === 0 ? (
                <div className="card py-24 text-center text-text-secondary">
                    <Bell className="w-12 h-12 mx-auto mb-md opacity-20" />
                    <p>No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-md">
                    {notifications?.map((n) => (
                        <div
                            key={n.id}
                            className={`card flex gap-md items-start transition-all border-l-4 ${n.isRead ? 'opacity-70 border-l-slate-200' : 'border-l-primary shadow-level-1'
                                }`}
                        >
                            <div className={`p-2 rounded-md ${n.type === 'SUCCESS' ? 'bg-green-50 text-success' :
                                n.type === 'ALERT' ? 'bg-amber-50 text-warning' :
                                    'bg-blue-50 text-primary'
                                }`}>
                                {n.type === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5" /> :
                                    n.type === 'ALERT' ? <AlertCircle className="w-5 h-5" /> :
                                        <MailCheck className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold ${n.isRead ? 'text-text-secondary' : 'text-text-primary'}`}>
                                        {n.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary mt-1 leading-relaxed">{n.message}</p>
                            </div>
                            {!n.isRead && (
                                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
                                    Mark Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <footer className="card bg-slate-50 border-dashed text-center py-lg">
                <p className="text-xs text-text-secondary">
                    You also receive email and push notifications for urgent updates (TRUST-008).
                </p>
            </footer>
        </div>
    );
}

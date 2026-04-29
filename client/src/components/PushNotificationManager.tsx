'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const VAPID_PUBLIC_KEY = 'BLX7h2AF-MbwFRRtf-YSBgLQ8FFOj7eiV6cP7HQicE0BvBFzfrFBzrjgXbAtfymNx53z4OT0R820HaZJvMCieVE';

export function PushNotificationManager() {
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && user) {
            navigator.serviceWorker.ready.then((reg) => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then((sub) => {
                    if (sub) {
                        setSubscription(sub);
                        setIsSubscribed(true);
                    }
                });
            });
        }
    }, [user]);

    const subscribeToPush = async () => {
        if (!registration) return;

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            // Send subscription to server
            await api.post('/notifications/subscribe', sub.toJSON());
            
            setSubscription(sub);
            setIsSubscribed(true);
            console.log('[Push] Subscribed successfully');
        } catch (error) {
            console.error('[Push] Subscription failed', error);
        }
    };

    if (!user || isSubscribed) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-blue-50 max-w-sm flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined">notifications_active</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-blue-900">Enable Push Alerts</h4>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Get real-time updates on your applications and job matches.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={subscribeToPush}
                        className="flex-1 py-3 bg-blue-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                        Enable Now
                    </button>
                    <button 
                        onClick={() => setIsSubscribed(true)}
                        className="px-6 py-3 bg-blue-50 text-blue-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

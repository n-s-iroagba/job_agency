'use client'
import { useState, useEffect } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';

export default function ProfilePage() {
    const { data, isLoading, refetch } = useApiQuery<any>(['auth', 'me'], '/auth/me');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (data?.user) {
            setFullName(data.user.fullName || '');
        }
    }, [data]);

    const updateProfileMutation = useApiMutation('put', '/auth/profile', {
        onSuccess: () => {
            refetch();
            // Update local storage for sidebar/nav consistency
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...stored, fullName }));
        }
    });

    const handleSave = () => {
        updateProfileMutation.mutate({ fullName });
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing Identity...</div>;

    const user = data?.user || {};

    return (
        <div className="font-sans text-slate-900 pb-24 max-w-5xl">
            <header className="mb-12">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Account Settings</span>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Profile</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">


                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Identity Section */}
                    <section id="identity" className="space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-3xl font-bold uppercase">
                                    {fullName[0] || user.email?.[0] || '?'}
                                </div>
                                <button className="absolute -bottom-2 -right-2 bg-white text-slate-900 p-2 rounded-lg shadow-lg border border-slate-100 hover:bg-slate-50 transition-all cursor-not-allowed opacity-50">
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                </button>
                            </div>
                            <div className="flex-1 grid grid-cols-1 gap-6 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Legal Full Name</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Registered Email Address</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-slate-900/5 transition-all opacity-60 cursor-not-allowed"
                                        type="email"
                                        value={user.email || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* Save Footer */}
                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                        <button
                            onClick={handleSave}
                            disabled={updateProfileMutation.isPending}
                            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {updateProfileMutation.isPending ? 'Syncing...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

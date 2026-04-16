import React, { useState, useEffect } from 'react';
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
                {/* Navigation Anchors */}
                <aside className="lg:col-span-1 space-y-2 sticky top-24 h-fit hidden lg:block">
                    <a className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white font-bold rounded-lg shadow-lg shadow-slate-900/10 text-[10px] uppercase tracking-widest" href="#identity">
                        Identity
                    </a>
                    <a className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-widest" href="#security">
                        Security
                    </a>
                </aside>

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

                    {/* Security Section */}
                    <section id="security" className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Account Access</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 opacity-50">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Access Credentials</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight leading-relaxed">Modify your password to ensure continued account integrity.</p>
                                <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-lg text-[10px] uppercase tracking-widest cursor-not-allowed">Update Key</button>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 opacity-50">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Two-Factor Auth</h3>
                                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">OFF</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight leading-relaxed">Add a secondary layer of verification to your login process.</p>
                                <button disabled className="w-full border border-slate-100 text-slate-400 font-bold py-3.5 rounded-lg text-[10px] uppercase tracking-widest cursor-not-allowed">Enable 2FA</button>
                            </div>
                        </div>
                    </section>

                    {/* Death Section (Danger Zone) */}
                    <section className="p-8 rounded-2xl bg-red-50 border border-red-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-50">
                        <div className="max-w-md">
                            <h2 className="text-base font-bold text-red-600 uppercase tracking-tight mb-1">Permanent Deactivation</h2>
                            <p className="text-[10px] text-red-600/60 font-medium uppercase tracking-widest leading-relaxed">
                                Irreversible removal of your professional history, CV, and verified status.
                            </p>
                        </div>
                        <button disabled className="px-8 py-3 bg-red-100 text-red-400 font-bold rounded-lg text-[10px] uppercase tracking-widest cursor-not-allowed">
                            Terminate Account
                        </button>
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

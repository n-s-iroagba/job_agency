'use client';

import React from 'react';
import { CONSTANTS } from '@/constants';

export default function ProfilePage() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : { fullName: 'Elena Rodriguez', email: 'elena.rodriguez@precision.io' };

    return (
        <div className="space-y-12 selection:bg-primary-container selection:text-on-primary-container pb-24">
            {/* Title & Hero Section */}
            <header>
                <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Workspace Identity</p>
                <h1 className="text-[3.5rem] font-bold leading-tight tracking-tighter text-on-surface mb-4">Account Settings</h1>
                <p className="text-lg text-on-surface-variant max-w-[672px] leading-relaxed font-light">
                    Manage your professional identity, security preferences, and communication channels. Your precision career journey starts here.
                </p>
            </header>

            {/* Asymmetric Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Navigation Anchors */}
                <aside className="lg:col-span-3 space-y-2 sticky top-24 h-fit">
                    <a className="flex items-center gap-3 px-5 py-3 bg-white text-primary font-bold rounded-xl shadow-2xl shadow-primary/10 border border-primary/10 transition-all" href="#personal">
                        <span className="material-symbols-outlined text-xl font-bold">person</span>
                        <span className="text-[10px] uppercase tracking-widest">Personal Info</span>
                    </a>
                    <a className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-primary hover:bg-white transition-all rounded-xl font-bold" href="#security">
                        <span className="material-symbols-outlined text-xl">security</span>
                        <span className="text-[10px] uppercase tracking-widest">Security & Privacy</span>
                    </a>
                    <a className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-primary hover:bg-white transition-all rounded-xl font-bold" href="#notifications">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        <span className="text-[10px] uppercase tracking-widest">Notifications</span>
                    </a>
                    <a className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-primary hover:bg-white transition-all rounded-xl font-bold" href="#data">
                        <span className="material-symbols-outlined text-xl">database</span>
                        <span className="text-[10px] uppercase tracking-widest">Data Management</span>
                    </a>
                </aside>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-12">
                    {/* Section: Personal Information */}
                    <section className="bg-surface-container-lowest p-10 rounded-2xl shadow-2xl shadow-slate-200/50 relative overflow-hidden border border-slate-100" id="personal">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none"></div>
                        <h2 className="text-xl font-bold mb-10 flex items-center gap-2 uppercase tracking-tight">
                            <span className="material-symbols-outlined text-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
                            Identity Profile
                        </h2>
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden ring-8 ring-slate-50 shadow-xl border-4 border-white">
                                    <img alt="Profile" className="w-full h-full object-cover" data-alt="Close-up professional headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO7HkkJlFqR1SMKhU27IzqVuRtjqMWJDPUnX51vDyecwoll8psIX3ZfjaLLOJGDvh74OrI18dGyd5FeJsvwCDlNwIf2INu8di8LZjM050TCXi32RQcX1pSTkHbKuQNoxu9uIQ6sXLS8uwFC7lA3T7KJHh5mBrWaBLzkGPSZ3i08v_L9drtPkq7kh736sDMIlDRpsdVPWRQRNE_EurGpFiE6DVzCFogbefRyW1DRsNqy9wiX_17c-SyZesU8PXLCIHXzMuWphIhFGf8" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2.5 rounded-xl shadow-2xl hover:bg-primary hover:scale-110 transition-all active:scale-95 border-2 border-white">
                                    <span className="material-symbols-outlined text-sm font-bold">photo_camera</span>
                                </button>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Legal Full Name</label>
                                    <input className="w-full bg-slate-50 border-transparent rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 transition-all" type="text" defaultValue={user.fullName} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Professional Title</label>
                                    <input className="w-full bg-slate-50 border-transparent rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 transition-all" type="text" defaultValue="Senior Logistics Architect" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">System Email Bridge</label>
                                    <input className="w-full bg-slate-50 border-transparent rounded-xl px-5 py-4 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 transition-all" type="email" defaultValue={user.email} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Security & Password */}
                    <section className="bg-surface-container-low/30 p-10 rounded-2xl border border-slate-100" id="security">
                        <h2 className="text-xl font-bold mb-10 flex items-center gap-2 uppercase tracking-tight">
                            <span className="material-symbols-outlined text-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                            Access Integrity
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                <h3 className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Protocol Update</h3>
                                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed italic opacity-80">Update your account credentials periodically to maintain the highest level of security.</p>
                                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all">Update Key</button>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                <h3 className="text-[10px] font-bold text-on-surface uppercase tracking-widest">System MFA Bridge</h3>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Verification Status</span>
                                    <span className="text-[10px] font-bold text-error uppercase tracking-widest">Inactive</span>
                                </div>
                                <button className="w-full border-2 border-primary/20 text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-primary/5 transition-all">Initialize MFA</button>
                            </div>
                        </div>
                    </section>

                    {/* Section: Communication Center */}
                    <section className="space-y-6" id="notifications">
                        <div className="flex items-end justify-between px-2">
                            <div>
                                <h2 className="text-xl font-bold mb-1 uppercase tracking-tight">Sync Preferences</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fine-tune your communication frequency.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h4 className="font-bold text-base uppercase tracking-tight mb-1">Recruitment Alerts</h4>
                                        <p className="text-[10px] text-on-surface-variant font-medium italic">Real-time application status updates.</p>
                                    </div>
                                    <div className="w-12 h-7 bg-primary rounded-full relative shadow-inner">
                                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-transparent hover:border-primary/20 transition-all text-center">
                                        <span className="material-symbols-outlined text-primary mb-2 font-bold">mail</span>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Daily Digest</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-transparent hover:border-primary/20 transition-all text-center">
                                        <span className="material-symbols-outlined text-primary mb-2 font-bold">send</span>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Push Relay</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-900 text-white p-10 rounded-2xl flex flex-col justify-between shadow-2xl shadow-slate-200">
                                <span className="material-symbols-outlined text-4xl opacity-30 font-bold">verified</span>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Priority Path</h4>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">Only receive notifications for top-tier matched roles.</p>
                                    <button className="mt-8 w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Enable Path</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Danger Zone */}
                    <section className="bg-error/5 p-10 rounded-2xl border-2 border-dashed border-error/20" id="data">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="max-w-[448px]">
                                <h2 className="text-xl font-bold text-error mb-2 uppercase tracking-tight">Identity Termination</h2>
                                <p className="text-[10px] text-error font-bold leading-relaxed uppercase tracking-widest opacity-60">
                                    Permanent erasure of application history, portfolios, and saved credentials. This action is final. (REG-004)
                                </p>
                            </div>
                            <button className="px-10 py-4 bg-error text-white font-bold rounded-xl shadow-2xl shadow-error/20 hover:scale-105 transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                                Deactivate Account
                            </button>
                        </div>
                    </section>

                    {/* CTA Footer Section */}
                    <div className="flex justify-end gap-6 pt-12 border-t border-slate-100">
                        <button className="px-10 py-5 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-on-surface transition-all">Cancel Bridge</button>
                        <button className="px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl shadow-slate-200 hover:bg-primary transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.2em]">Save Identity</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

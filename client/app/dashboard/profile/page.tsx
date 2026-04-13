'use client';

import React from 'react';
import { CONSTANTS } from '@/constants';
import {
    User,
    Shield,
    Key,
    Trash2,
    CheckCircle2,
    Lock
} from 'lucide-react';

export default function ProfilePage() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

    return (
        <div className="max-w-4xl mx-auto space-y-xl">
            <header>
                <h1>Personal Profile</h1>
                <p className="text-text-secondary mt-1">Manage your identity and account security (REG-004)</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                <div className="md:col-span-2 space-y-xl">
                    <section className="card space-y-lg">
                        <h3 className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div>
                                <label className="label">Full Name</label>
                                <p className="font-semibold text-text-primary p-2 bg-slate-50 rounded-md border border-border">
                                    {user.fullName || 'User Name'}
                                </p>
                            </div>
                            <div>
                                <label className="label">Email Address</label>
                                <p className="font-semibold text-text-primary p-2 bg-slate-50 rounded-md border border-border">
                                    {user.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-blue-50/50 p-md rounded-md flex items-center gap-3 text-[11px] text-text-secondary">
                            <Shield className="w-4 h-4 text-primary" />
                            Your identity is verified via RBAC (NFR-SEC-004). Contact support to change your registered email.
                        </div>
                    </section>

                    <section className="card space-y-lg opacity-60 pointer-events-none">
                        <h3 className="flex items-center gap-2"><Key className="w-5 h-5 text-warning" /> Security Settings</h3>
                        <div>
                            <label className="label">Current Password</label>
                            <input className="input" type="password" placeholder="••••••••" disabled />
                        </div>
                        <div className="flex justify-end">
                            <button className="btn-primary" disabled>Update Password</button>
                        </div>
                        <div className="absolute inset-0 bg-white/10 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded-sm flex items-center gap-1">
                                <Lock className="w-3 h-3" /> UNDER MAINTENANCE
                            </span>
                        </div>
                    </section>
                </div>

                <div className="space-y-xl">
                    <section className="card space-y-md border-danger/20">
                        <h3 className="flex items-center gap-2 text-danger"><Trash2 className="w-5 h-5" /> Danger Zone</h3>
                        <p className="text-xs text-text-secondary">
                            You can request permanent deletion of your account and all associated data per REG-004.
                        </p>
                        <button className="w-full py-2 border border-danger text-danger rounded-md text-xs font-bold hover:bg-red-50 transition-colors">
                            Request Account Deletion
                        </button>
                    </section>

                    <section className="card space-y-md bg-green-50/30 border-green-100">
                        <h4 className="font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success" /> Verification Status
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span>Email Verified</span>
                                <span className="text-success font-bold">YES</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span>KYC Completed</span>
                                <span className="text-slate-400">PENDING</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span>CV Uploaded</span>
                                <span className="text-success font-bold">YES</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { User } from '@/types/models';

export default function AdminApplicantsPage() {
    const { data: users, isLoading } = useApiQuery<{ rows: User[], count: number }>(['admin', 'users', 'all'], '/admin/users');

    const userList = users?.rows || [];

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-blue-500/10 selection:text-blue-600">
            {/* Header / AppBar (Local Context) */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter italic">Identity Hub</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Active Applicants</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all cursor-pointer">Restricted Access</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" style={{ fontSize: '18px' }}>search</span>
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 w-80 transition-all shadow-inner"
                            placeholder="Search by identity or email sequence..."
                            type="text"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-12 space-y-12 max-w-[1280px]">
                {/* Hero Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black rounded-full uppercase tracking-widest border border-primary/20 shadow-sm">Identity Management</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest italic">REG-004 Compliance Active</span>
                    </div>
                    <h2 className="text-[4.5rem] font-black tracking-tighter text-on-surface leading-none uppercase italic">Applicant Base</h2>
                    <p className="text-on-surface-variant text-lg max-w-[672px] font-light leading-relaxed italic border-l-4 border-slate-100 pl-6">
                        Centralized oversight for all platform stakeholders. Ensure identity verification and role-based access reflects current <span className="text-primary font-bold not-italic">security protocols</span>.
                    </p>
                </div>

                {/* Identity Inventory */}
                <section className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-50">
                    <div className="bg-slate-50/50 px-10 py-8 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-6">
                            <span className="material-symbols-outlined text-primary font-bold">shield_person</span>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-on-surface">Verified Identity Inventory</h3>
                            <div className="flex gap-2">
                                <span className="px-4 py-1.5 bg-white border border-slate-100 text-[8px] font-black text-slate-400 rounded-full uppercase tracking-widest shadow-sm italic hover:text-primary transition-colors cursor-pointer">Filter: All Roles</span>
                                <span className="px-4 py-1.5 bg-white border border-slate-100 text-[8px] font-black text-slate-400 rounded-full uppercase tracking-widest shadow-sm italic hover:text-primary transition-colors cursor-pointer">Status: Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Digital Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transmission Channel</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Tier</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Pulse</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Admin Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-24"><td colSpan={5} className="bg-slate-50/10"></td></tr>)
                                ) : userList.map((u: User) => (
                                    <tr key={u.id} className="hover:bg-slate-50/70 transition-all group cursor-pointer border-l-4 border-transparent hover:border-blue-600">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center text-white font-black text-lg border border-slate-800 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                                    {u.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-on-surface uppercase tracking-tight text-xs mb-1">{u.fullName}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic opacity-70">UID: {u.id.toString().padStart(8, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-[11px] font-black text-primary lowercase tracking-tight italic bg-blue-50/30 px-3 py-1 rounded-lg w-fit">{u.email}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 ${u.role === 'ADMIN' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-blue-600 border-blue-100'}`}>
                                                    <span className="material-symbols-outlined text-[12px] font-bold">{u.role === 'ADMIN' ? 'shield' : 'person_check'}</span>
                                                    {u.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-[10px] font-black text-on-surface uppercase tracking-widest opacity-60 italic">{new Date(u.updatedAt).toLocaleDateString()}</p>
                                            <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em] mt-1">Last Secure Auth</p>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <Link
                                                    href={`/admin/mail?to=${u.email}`}
                                                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-xl active:scale-90"
                                                >
                                                    <span className="material-symbols-outlined text-sm font-bold">mail</span>
                                                </Link>
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-xl active:scale-90">
                                                    <span className="material-symbols-outlined text-sm font-bold">description</span>
                                                </button>
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-xl active:scale-90">
                                                    <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Compliance Callout */}
                <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl shadow-slate-300 relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-[250px] font-bold text-white">gavel</span>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/50 shrink-0">
                            <span className="material-symbols-outlined text-4xl font-bold">verified_user</span>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Regulatory Audit Mode</h4>
                            <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-[672px] italic uppercase tracking-tight">
                                User data management is strictly monitored per <span className="text-white">REG-004 protocols</span>. All modifications are logged in the secure audit vault. Deletion requests require formal cryptographic verification.
                            </p>
                        </div>
                        <button className="ml-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">
                            Audit Vault Access
                        </button>
                    </div>
                </div>

                <footer className="pt-24 pb-12 text-center">
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] italic">© 2024 JobNexa • Identity Shield • Global Oversight Node</p>
                </footer>
            </main>
        </div>
    );
}

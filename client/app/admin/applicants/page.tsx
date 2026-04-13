'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import {
    User,
    Mail,
    FileText,
    ChevronRight,
    Search,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export default function AdminApplicantsPage() {
    const { data: users, isLoading } = useApiQuery<any>(['admin', 'users', 'all'], '/admin/users');

    if (isLoading) return <div className="space-y-md animate-pulse">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="card h-16 bg-slate-50" />)}
    </div>;

    const userList = users?.rows || users || [];

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1>Applicant Management</h1>
                    <p className="text-text-secondary">View and manage platform users (REG-004)</p>
                </div>
            </header>

            <div className="flex gap-md bg-white p-4 rounded-md border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-10" placeholder="Search by name or email..." />
                </div>
                <div className="flex gap-sm">
                    <select className="input max-w-[150px]">
                        <option>All Roles</option>
                        <option>Applicant</option>
                        <option>Admin</option>
                    </select>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border">
                        <tr>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">User Identity</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Contact Info</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Role</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase">Last Active</th>
                            <th className="px-lg py-3 text-xs font-bold text-text-secondary uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {userList.map((u: any) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-lg py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <span className="font-bold text-text-primary">{u.fullName}</span>
                                    </div>
                                </td>
                                <td className="px-lg py-4 text-text-secondary">
                                    {u.email}
                                </td>
                                <td className="px-lg py-4">
                                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'text-admin-accent' : 'text-primary'
                                        }`}>
                                        <Shield className="w-3 h-3" /> {u.role}
                                    </span>
                                </td>
                                <td className="px-lg py-4 text-text-secondary">
                                    {new Date(u.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-lg py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/mail?to=${u.email}`}
                                            className="p-1.5 hover:bg-blue-50 text-primary border border-transparent rounded-md transition-colors"
                                            title="Send Mail"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </Link>
                                        <button
                                            className="p-1.5 hover:bg-slate-100 text-text-secondary border border-transparent rounded-md transition-colors"
                                            title="View CV"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-slate-100 text-text-secondary border border-transparent rounded-md transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 p-lg rounded-md border border-dashed border-slate-300 text-center">
                <p className="text-xs text-text-secondary italic">
                    Note: User deletion is handled per record request in compliance with REG-004.
                    Modification of roles requires super-admin privileges.
                </p>
            </div>
        </div>
    );
}

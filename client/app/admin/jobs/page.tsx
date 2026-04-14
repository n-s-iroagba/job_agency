'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobListing } from '@/types/models';

export default function AdminJobsPage() {
    const { data: jobs, isLoading } = useApiQuery<{ rows: JobListing[], count: number }>(['admin', 'jobs', 'all'], '/admin/jobs');

    const jobList = jobs?.rows || [];
    const totalListings = jobs?.count || 0;
    const activeRoles = jobList.filter((j: JobListing) => j.isActive).length;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-blue-500/10 selection:text-blue-600">
            {/* Header / AppBar (Local Context) */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter italic">Job Inventory</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Active Listings</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all cursor-pointer">Archive Vault</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" style={{ fontSize: '18px' }}>search</span>
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                            placeholder="Locate role profile..."
                            type="text"
                        />
                    </div>
                    <Link href="/admin/jobs/new">
                        <button className="bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/20 hover:bg-blue-700 transition-all active:scale-95">
                            <span className="material-symbols-outlined font-bold">add</span>
                            Provision Job
                        </button>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-12 space-y-10 max-w-[1280px]">
                {/* Hero Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40 border border-slate-50 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">work_history</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Listings</p>
                            <p className="text-4xl font-black tracking-tighter text-on-surface italic">{totalListings.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">trending_up</span>
                            +12% Capacity
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40 border border-slate-50 relative overflow-hidden group text-emerald-600">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">verified</span>
                        </div>
                        <div className="text-emerald-900">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 opacity-60">Active Roles</p>
                            <p className="text-4xl font-black tracking-tighter italic">{activeRoles.toString().padStart(2, '0')}</p>
                        </div>
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100 italic">
                            Operational
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40 border border-slate-50 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700 text-tertiary">
                            <span className="material-symbols-outlined text-8xl font-bold">flaky</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">In Review</p>
                            <p className="text-4xl font-black tracking-tighter text-tertiary">03</p>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-tertiary uppercase tracking-widest border border-tertiary/10 bg-tertiary/5 w-fit px-3 py-1 rounded-full italic">
                            Action Point
                        </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl shadow-slate-300 flex flex-col justify-between h-40 relative overflow-hidden text-white">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">monetization_on</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. Yield / Role</p>
                            <p className="text-4xl font-black tracking-tighter text-white italic">$142k</p>
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Global Benchmark</p>
                    </div>
                </div>

                {/* Listing Inventory Shell */}
                <section className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="bg-slate-50/50 px-10 py-6 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary font-bold">inventory_2</span>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-on-surface opacity-80">Comprehensive Job Inventory</h3>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                                <span className="material-symbols-outlined font-bold">filter_list</span>
                            </button>
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                                <span className="material-symbols-outlined font-bold">download</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Role Profile</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vertical</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deployment Site</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Provisioned Date</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Lifecycle</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-28"><td colSpan={6} className="bg-slate-50/10"></td></tr>)
                                ) : jobList.map((job: JobListing) => (
                                    <tr key={job.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-primary">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                    <span className="material-symbols-outlined font-bold">terminal</span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-on-surface uppercase tracking-tight text-xs">{job.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-70">NODE: JOB-{job.id + 77000}-INV</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-4 py-1.5 bg-blue-50 text-primary text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-100 shadow-sm">
                                                {job.JobCategory?.name || 'Technology'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-xs font-black text-on-surface uppercase tracking-tight">{job.location}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.employmentType}</p>
                                        </td>
                                        <td className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 italic">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                <button className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 shadow-inner ${job.isActive ? 'bg-primary' : 'bg-slate-200'}`}>
                                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xl ring-0 transition duration-300 ease-in-out ${job.isActive ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/jobs/${job.id}`}>
                                                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:shadow-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">visibility</span>
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/jobs/${job.id}/stages`}>
                                                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:shadow-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">account_tree</span>
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/jobs/${job.id}/edit`}>
                                                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:shadow-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Context */}
                    <div className="bg-slate-50/50 px-10 py-8 flex items-center justify-between border-t border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-80 italic">
                            Provisioning <span className="text-on-surface font-black not-italic">{jobList.length}</span> of <span className="text-on-surface font-black not-italic">{totalListings}</span> nodes
                        </p>
                        <div className="flex gap-2">
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-200">1</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all font-bold text-xs">2</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all font-bold text-xs">
                                <span className="material-symbols-outlined font-bold">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

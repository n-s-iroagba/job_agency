'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { JobListing, JobCategory } from '@/types/models';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminJobsPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const limit = 10;

    const { data: stats } = useApiQuery<any>(['admin', 'jobs', 'stats'], '/admin/jobs/stats');
    const { data: categoriesResult } = useApiQuery<{ rows: JobCategory[], count: number }>(['admin', 'categories', 'all'], '/admin/categories');
    const categories = categoriesResult?.rows || [];

    const { data: jobs, isLoading, refetch } = useApiQuery<{ rows: JobListing[], count: number }>(
        ['admin', 'jobs', 'list', String(page), searchQuery, selectedCategory, sortBy, sortOrder],
        `/admin/jobs?limit=${limit}&offset=${(page - 1) * limit}${searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''}${selectedCategory ? `&categoryId=${selectedCategory}` : ''}${sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''}`
    );

    const toggleStatusMutation = useApiMutation<any, any>('put', '/admin/jobs/:id', {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
        }
    });

    const deleteMutation = useApiMutation<any, any>('delete', '/admin/jobs/:id', {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
            refetch();
        }
    });

    const jobList = jobs?.rows || [];
    const totalListings = jobs?.count || 0;
    const totalPages = Math.ceil(totalListings / limit);

    const handleToggleStatus = (id: number, currentStatus: boolean) => {
        toggleStatusMutation.mutate({ isActive: !currentStatus }, { params: { id } });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) return;
        try {
            await deleteMutation.mutateAsync({}, { params: { id } });
        } catch (err) {
            alert('Deletion failed');
        }
    };

    const toggleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(column);
            setSortOrder('DESC');
        }
        setPage(1);
    };

    const getCategoryIcon = (categoryName?: string) => {
        const name = categoryName?.toLowerCase() || '';
        if (name.includes('tech') || name.includes('engine')) return 'terminal';
        if (name.includes('finance') || name.includes('bank')) return 'account_balance';
        if (name.includes('health')) return 'health_and_safety';
        if (name.includes('design')) return 'palette';
        return 'work';
    };

    return (
        <>
            {/* Header / AppBar (Local Context) */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter italic">Job Inventory</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" style={{ fontSize: '18px' }}>search</span>
                        <input
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-[10px] font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                            placeholder="Locate role profile..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                        />
                        <br />
                    </div>
                    <Link href="/admin/jobs/new">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-blue-500/40 hover:scale-[1.02] hover:shadow-blue-500/60 transition-all active:scale-95 border border-white/10">
                            <span className="material-symbols-outlined font-bold">add_circle</span>
                            Provision New Role
                        </button>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="py-10 space-y-10 w-full">
                {/* Hero Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40 border border-slate-50 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">work_history</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Listings</p>
                            <p className="text-4xl font-black tracking-tighter text-on-surface italic">{(stats?.totalListing || 0).toString().padStart(2, '0')}</p>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">trending_up</span>
                            System Live
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-40 border border-slate-50 relative overflow-hidden group text-emerald-600">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">verified</span>
                        </div>
                        <div className="text-emerald-900">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 opacity-60">Active Roles</p>
                            <p className="text-4xl font-black tracking-tighter italic">{(stats?.activeRoles || 0).toString().padStart(2, '0')}</p>
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
                            <p className="text-4xl font-black tracking-tighter text-tertiary">{(stats?.inReview || 0).toString().padStart(2, '0')}</p>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-tertiary uppercase tracking-widest border border-tertiary/10 bg-tertiary/5 w-fit px-3 py-1 rounded-full italic">
                            Action Point
                        </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl shadow-slate-300 flex flex-col justify-between h-40 relative overflow-hidden text-white">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">groups</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Demand</p>
                            <p className="text-4xl font-black tracking-tighter text-white italic">{(stats?.appVolume || 0).toString().padStart(2, '0')}</p>
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Application Nodes</p>
                    </div>
                </div>

                {/* Listing Inventory Shell */}
                <section className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="bg-slate-50/50 px-10 py-6 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-[18px] font-bold">inventory_2</span>
                            </div>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-on-surface opacity-80">Inventory Database</h3>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined);
                                    setPage(1);
                                }}
                                className="px-5 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                            >
                                <option value="">All Verticals</option>
                                {categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th
                                        className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => toggleSort('title')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Target Role Profile
                                            {sortBy === 'title' && (
                                                <span className="material-symbols-outlined text-[14px]">{sortOrder === 'ASC' ? 'arrow_upward' : 'arrow_downward'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => toggleSort('categoryId')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Vertical
                                            {sortBy === 'categoryId' && (
                                                <span className="material-symbols-outlined text-[14px]">{sortOrder === 'ASC' ? 'arrow_upward' : 'arrow_downward'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => toggleSort('location')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Deployment Site
                                            {sortBy === 'location' && (
                                                <span className="material-symbols-outlined text-[14px]">{sortOrder === 'ASC' ? 'arrow_upward' : 'arrow_downward'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => toggleSort('createdAt')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Provisioned Date
                                            {sortBy === 'createdAt' && (
                                                <span className="material-symbols-outlined text-[14px]">{sortOrder === 'ASC' ? 'arrow_upward' : 'arrow_downward'}</span>
                                            )}
                                        </div>
                                    </th>
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
                                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all text-primary">
                                                    <span className="material-symbols-outlined font-bold">{getCategoryIcon(job.JobCategory?.name)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-on-surface uppercase tracking-tight text-xs">{job.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-70">NODE: JOB-{job.id.toString().padStart(5, '0')}-INV</p>
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
                                                <button
                                                    onClick={() => handleToggleStatus(job.id, job.isActive)}
                                                    disabled={toggleStatusMutation.isPending}
                                                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 shadow-inner ${job.isActive ? 'bg-primary' : 'bg-slate-200'}`}
                                                >
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
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                                                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-error hover:shadow-lg transition-all shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] font-bold">delete_outline</span>
                                                </button>
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
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all font-bold text-xs"
                            >
                                <span className="material-symbols-outlined font-bold">chevron_left</span>
                            </button>
                            <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-200">
                                {page}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all font-bold text-xs"
                            >
                                <span className="material-symbols-outlined font-bold">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

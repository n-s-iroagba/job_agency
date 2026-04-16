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
        toggleStatusMutation.mutate({ data: { isActive: !currentStatus }, params: { id } });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await deleteMutation.mutateAsync({ params: { id } });
        } catch (err) {
            console.error(err);
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

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Jobs</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage all active job listings</p>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-64"
                        placeholder="Search jobs..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                    <Link href="/admin/jobs/new">
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                            Add Job
                        </button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined);
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-900/5"
                    >
                        <option value="">All Categories</option>
                        {categories?.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer" onClick={() => toggleSort('title')}>Title</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr className="animate-pulse h-28"><td colSpan={5} className="bg-slate-50/10"></td></tr>
                            ) : jobList.map((job: JobListing) => (
                                <tr key={job.id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                                                {job.title.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-900">{job.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {job.JobCategory?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-slate-600">{job.location}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{job.employmentType}</p>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(job.id, job.isActive)}
                                            disabled={toggleStatusMutation.isPending}
                                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ${job.isActive ? 'bg-slate-900' : 'bg-slate-200'}`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ease-in-out ${job.isActive ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link href={`/admin/jobs/${job.id}/edit`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(job.id)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {jobList.length} of {totalListings} jobs
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-50 disabled:opacity-30"
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 bg-slate-900 text-white rounded text-[10px] font-bold uppercase">
                            {page}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-50 disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

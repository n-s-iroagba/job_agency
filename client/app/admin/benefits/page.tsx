'use client'
import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { JobBenefit, JobCategory } from '@/types/models';
import Link from 'next/link';

export default function BenefitsManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryId, setCategoryId] = useState<string | number>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: categoriesResult } = useApiQuery<{ rows: JobCategory[], count: number }>(['admin', 'categories'], '/admin/categories');
    const categories = categoriesResult?.rows || [];

    const { data: benefits, isLoading, refetch } = useApiQuery<{ rows: JobBenefit[], count: number }>(
        ['admin', 'benefits', 'list', page, searchQuery, categoryId],
        `/admin/benefits?limit=${limit}&offset=${(page - 1) * limit}${searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''}${categoryId ? `&categoryId=${categoryId}` : ''}`
    );

    const deleteMutation = useApiMutation<number, any>('delete', '/admin/benefits', {
        onSuccess: () => refetch()
    });

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) { console.error(err); }
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Benefits...</div>;

    const benefitsList = benefits?.rows || [];
    const totalCount = benefits?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Benefits</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage standard job incentives</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <input
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-48"
                        placeholder="Search benefits..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                    <select
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/5 transition-all"
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <Link href="/admin/benefits/new">
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                            Add Benefit
                        </button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {benefitsList.map((b: JobBenefit) => (
                                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-900">{b.benefitType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">{b.description}</p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link href={`/admin/benefits/${b.id}`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                                View
                                            </Link>
                                            <Link href={`/admin/benefits/${b.id}/edit`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(b.id)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {benefitsList.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No benefits found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {benefitsList.length} of {totalCount} records
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


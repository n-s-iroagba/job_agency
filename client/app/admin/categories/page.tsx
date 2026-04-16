'use client';

import React, { useState } from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobCategory } from '@/types/models';

export default function CategoryManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: categoriesResult, isLoading } = useApiQuery<{ rows: JobCategory[], count: number }>(
        ['admin', 'categories', 'list', page, searchQuery],
        `/admin/categories?limit=${limit}&offset=${(page - 1) * limit}${searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''}`
    );

    const categoryList = categoriesResult?.rows || [];
    const totalCount = categoriesResult?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Categories...</div>;

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage job verticals</p>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-64"
                        placeholder="Search categories..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                    <Link href="/admin/categories/new">
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                            Add Category
                        </button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {categoryList.map((category: JobCategory) => (
                                <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                <span className="material-symbols-outlined text-lg">folder</span>
                                            </div>
                                            <span className="text-sm font-medium text-slate-900">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link href={`/admin/categories/${category.id}/edit`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {categoryList.length} of {totalCount} categories
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

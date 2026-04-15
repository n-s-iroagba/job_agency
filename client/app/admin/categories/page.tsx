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

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Minimal Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight ">Taxonomy Engine</h1>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium border border-slate-200 uppercase tracking-wider">
                        {totalCount} nodes
                    </span>
                    <br />
                </div>


                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                            placeholder="Find taxonomy node..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <Link href="/admin/categories/new">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Category
                        </button>
                    </Link>
                </div>
            </header>

            <div className="p-6 space-y-6 max-w-full">

                {/* Categories Table Wrapper */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Category Name</th>
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categoryList.map((category: JobCategory) => (
                                    <tr key={category.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                                                    <span className="material-symbols-outlined text-lg">folder</span>
                                                </div>
                                                <p className="font-semibold text-slate-900 text-sm">{category.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/categories/${category.id}/edit`} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-600 transition-colors">
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Context */}
                    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                            Showing <span className="text-slate-900 font-bold">{categoryList.length}</span> categories
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all font-bold"
                            >
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <span className="px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-bold">
                                {page}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all font-bold"
                            >
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

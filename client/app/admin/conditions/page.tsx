import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { JobCondition, JobCategory } from '@/types/models';
import Link from 'next/link';

export default function ConditionsManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryId, setCategoryId] = useState<string | number>('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: categoriesResult } = useApiQuery<{ rows: JobCategory[], count: number }>(['admin', 'categories'], '/admin/categories');
    const categories = categoriesResult?.rows || [];

    const { data: conditions, isLoading, refetch } = useApiQuery<{ rows: JobCondition[], count: number }>(
        ['admin', 'conditions', 'list', String(page), searchQuery, String(categoryId)],
        `/admin/conditions?limit=${limit}&offset=${(page - 1) * limit}${searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''}${categoryId ? `&categoryId=${categoryId}` : ''}`
    );

    const deleteMutation = useApiMutation<number, any>('delete', '/admin/conditions', {
        onSuccess: () => refetch()
    });

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this condition?')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) { alert('Delete failed'); }
    };

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    const conditionsList = conditions?.rows || [];
    const totalCount = conditions?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Minimal Header */}
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">Compliance Engine</h1>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium border border-slate-200 uppercase tracking-wider">
                        {totalCount} prerequisites
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 w-56 transition-all"
                            placeholder="Find prerequisite..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <select
                        className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider outline-none focus:ring-1 focus:ring-blue-500/20 cursor-pointer"
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
                    <Link href="/admin/conditions/new">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Condition
                        </button>
                    </Link>
                </div>
            </header>

            <div className="p-6 space-y-6">
                {/* Structural Clean Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Prerequisites</p>
                        <p className="text-3xl font-bold text-slate-900 tracking-tighter italic">{conditionsList.length.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Compliance Nodes</p>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 leading-none">{totalCount}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">verified standards</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 leading-none">89%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">coverage rate</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis Status</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <p className="text-xl font-bold italic text-emerald-400 tracking-tight">Active Coverage</p>
                    </div>
                </div>

                {/* Conditions Table Wrapper */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-100 italic bg-slate-50/50">
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Constraint Identity</th>
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Global Description</th>
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {conditionsList.map((cond: JobCondition) => (
                                    <tr key={cond.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-5 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                                                    <span className="material-symbols-outlined text-lg">fact_check</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm tracking-tight leading-none mb-1">{cond.name}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Node</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5">
                                            <p className="text-xs font-medium text-slate-500 max-w-[448px] line-clamp-1 leading-relaxed italic opacity-80">
                                                {cond.description || 'Standard requirement configured for operational recruitment.'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 text-center">
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 text-right pr-6">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/conditions/${cond.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </Link>
                                                <Link href={`/admin/conditions/${cond.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </Link>
                                                <button onClick={() => handleDelete(cond.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-lg">delete_outline</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {conditionsList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 italic">No conditions configured in this cluster</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                            Listing <span className="text-slate-900 font-bold">{conditionsList.length}</span> compliance nodes
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


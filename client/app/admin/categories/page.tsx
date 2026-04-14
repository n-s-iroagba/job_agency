'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobCategory } from '@/types/models';

export default function CategoryManagementPage() {
    const { data: categories, isLoading } = useApiQuery<{ rows: JobCategory[], count: number }>(['admin', 'categories'], '/admin/categories');

    const categoryList = categories?.rows || [];

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopAppBar */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-blue-800 tracking-tight italic">JobNexa Admin</span>
                    <span className="h-4 w-px bg-slate-200"></span>
                    <nav className="flex gap-6 hidden md:flex items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Taxonomy</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary cursor-pointer transition-colors pb-1">Hierarchies</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-CAT-001</p>
                </div>
            </header>

            {/* Page Content */}
            <div className="p-8 lg:p-12 max-w-[1280px] mx-auto w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                    <div className="max-w-[672px]">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block border border-primary/20 w-fit px-3 py-1 bg-primary/5 rounded-full">Inventory Control</span>
                        <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-4 uppercase italic">Job Categories</h2>
                        <p className="text-on-surface-variant max-w-[576px] text-lg font-light leading-relaxed">Manage the organizational taxonomy of industries and specializations for all global job listings.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/admin/categories/new">
                            <button className="bg-primary bg-gradient-to-r from-primary to-primary-container text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Category
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview (Asymmetric Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
                    <div className="col-span-12 md:col-span-8 bg-white rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border border-slate-50 shadow-2xl shadow-slate-200/50">
                        <div className="relative z-10 w-full mb-6 md:mb-0">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Taxonomy Nodes</p>
                            <p className="text-on-surface font-black text-6xl italic tracking-tighter">{categoryList.length}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                    +4 NEW THIS MONTH
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 w-full md:text-right flex flex-col items-start md:items-end">
                            <p className="text-slate-500 font-medium text-sm italic mb-6 leading-relaxed max-w-[200px]">"Structure is the backbone of precision placement."</p>
                            <div className="flex -space-x-3 justify-start md:justify-end">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                    <span className="material-symbols-outlined text-slate-400 w-full h-full flex items-center justify-center">person</span>
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                    <span className="material-symbols-outlined text-slate-400 w-full h-full flex items-center justify-center">person_3</span>
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-[10px] text-white font-black flex items-center justify-center z-10 shadow-sm">
                                    +12
                                </div>
                            </div>
                        </div>
                        {/* Subtle background visual */}
                        <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                            <span className="material-symbols-outlined text-[240px]">category</span>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4 bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border border-slate-700/50">
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-[24px] mb-6 text-emerald-400 opacity-80" data-icon="auto_awesome">auto_awesome</span>
                            <h3 className="text-xl font-black italic uppercase tracking-tight mb-4">Category Health</h3>
                            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest pb-6 border-b border-white/10">94% of jobs are accurately mapped to categories. 6 listings require manual review.</p>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 w-[94%] h-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="px-10 py-8 bg-slate-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 gap-6">
                        <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar">
                            <h3 className="text-on-surface font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Active Classifications</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">Industries</span>
                                <span className="px-3 py-1 bg-transparent text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 cursor-pointer transition-colors">Specializations</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                            <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors cursor-pointer p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-[18px]">search</span>
                            <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors cursor-pointer p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-[18px]">filter_list</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Taxonomy Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">URL Slug</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Active Jobs</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categoryList.map((category: JobCategory) => (
                                    <tr key={category.id} className="hover:bg-slate-50/70 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                                    <span className="material-symbols-outlined text-[18px]">folder</span>
                                                </div>
                                                <span className="font-black text-xs text-on-surface uppercase tracking-tight">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 hidden md:table-cell">
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                <span className="material-symbols-outlined text-[14px] text-slate-300">link</span>
                                                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest truncate">/{category.name.toLowerCase().replace(/\s+/g, '-')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm gap-2 text-slate-700">
                                                <span className="text-xs font-black">0</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Listings</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors shadow-sm">
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
                </div>
            </div>
        </div>
    );
}

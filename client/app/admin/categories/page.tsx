'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';

export default function CategoriesManagementPage() {
    const { data: categories, isLoading } = useApiQuery<any>(['admin', 'categories', 'all'], '/admin/categories');

    const catList = categories || [];
    const totalTaxonomy = catList.length;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
            {/* Header / AppBar (Local) */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-800 uppercase tracking-tighter">Taxonomy Engine</h1>
                    <div className="h-6 w-[1px] bg-slate-200"></div>
                    <nav className="flex gap-6">
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Job Classifications</span>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-all cursor-pointer">Global Dictionary</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <button className="bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/20 hover:bg-blue-700 transition-all active:scale-95">
                        <span className="material-symbols-outlined font-bold">add</span>
                        Add Category
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-12 space-y-12 max-w-7xl">
                {/* Hero Header & Stats */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Inventory Control</span>
                        <h2 className="text-[4rem] font-black tracking-tighter text-on-surface leading-none uppercase italic">Job Categories</h2>
                        <p className="text-on-surface-variant text-lg max-w-xl font-light leading-relaxed">
                            Manage the organizational taxonomy of industries and specializations for all global job listings. Structure is the backbone of precision placement.
                        </p>
                    </div>
                </div>

                {/* Stats Grid Asymmetric */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-56 border border-slate-50 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Taxonomy Nodes</p>
                            <p className="text-[5rem] font-black tracking-tighter text-on-surface leading-none italic">{totalTaxonomy.toString().padStart(2, '0')}</p>
                            <div className="mt-6 flex items-center text-primary text-[10px] font-black uppercase tracking-widest">
                                <span className="material-symbols-outlined text-sm mr-2 font-bold">trending_up</span>
                                +4 nodes provisioned this month
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700 text-primary">
                            <span className="material-symbols-outlined text-[200px] font-bold">category</span>
                        </div>
                    </div>
                    <div className="md:col-span-4 bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-300 flex flex-col justify-between h-56 relative overflow-hidden text-white group">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-8xl font-bold">auto_awesome</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Category Health</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">94% of jobs are accurately mapped to taxonomy nodes. 06 listings require manual review.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Mapping Precision</span>
                                <span>94%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary w-[94%] h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Classification Table */}
                <section className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                    <div className="bg-slate-50/50 px-10 py-8 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-6">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-on-surface">Active Classifications</h3>
                            <div className="flex gap-2">
                                <span className="px-4 py-1.5 bg-white border border-slate-100 text-[8px] font-black text-slate-400 rounded-full uppercase tracking-widest shadow-sm">Industries</span>
                                <span className="px-4 py-1.5 bg-white border border-slate-100 text-[8px] font-black text-slate-400 rounded-full uppercase tracking-widest shadow-sm">Functions</span>
                            </div>
                        </div>
                        <div className="flex items-center bg-white border border-slate-100 px-6 py-3 rounded-2xl gap-3 w-80 shadow-sm">
                            <span className="material-symbols-outlined text-slate-400 text-lg font-bold">search</span>
                            <input className="bg-transparent border-none text-[10px] font-bold uppercase tracking-tight focus:ring-0 w-full text-on-surface" placeholder="Filter classifications..." type="text" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Classification Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Definition / Scope</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Mapped Capacity</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    [1, 2].map(i => <tr key={i} className="animate-pulse h-24"><td colSpan={4} className="bg-slate-50/10"></td></tr>)
                                ) : catList.map((cat: any) => (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-primary">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                    <span className="material-symbols-outlined font-bold">folder_open</span>
                                                </div>
                                                <span className="text-[11px] font-black text-on-surface uppercase tracking-tight">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-sm line-clamp-2 uppercase italic">
                                                {cat.description || 'Definition pending for this taxonomy node.'}
                                            </p>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className="text-sm font-black text-on-surface italic">842</span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
                                                    <span className="material-symbols-outlined text-sm font-bold">edit</span>
                                                </button>
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-error transition-all shadow-sm">
                                                    <span className="material-symbols-outlined text-sm font-bold">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Intelligence Callouts */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] flex items-start gap-8 border-l-[10px] border-primary shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl font-bold">lightbulb</span>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-on-surface uppercase tracking-[0.3em]">Smart Suggestion</h4>
                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase italic">
                                System detected surge in "AI Ethics" related postings. Recommend provisioning new sub-taxonomy node.
                            </p>
                            <button className="text-primary text-[9px] font-black uppercase tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform">
                                Provision Node <span className="material-symbols-outlined text-xs ml-2 font-bold">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] flex items-start gap-8 border-l-[10px] border-tertiary shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                        <div className="w-16 h-16 rounded-2xl bg-tertiary/5 flex items-center justify-center text-tertiary shrink-0 group-hover:bg-tertiary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-3xl font-bold">warning</span>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-on-surface uppercase tracking-[0.3em]">Unmapped Volume</h4>
                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase italic">
                                18 new roles uploaded from 'Aura Corp' do not match existing taxonomy definitions.
                            </p>
                            <button className="text-tertiary text-[9px] font-black uppercase tracking-[0.2em] flex items-center hover:translate-x-2 transition-transform">
                                Go to Mapping Hub <span className="material-symbols-outlined text-xs ml-2 font-bold">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </section>

                <footer className="pt-24 pb-12 text-center">
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] italic">© 2024 CareerCurator • Precision Taxonomy Engine • V4.2.1</p>
                </footer>
            </main>
        </div>
    );
}

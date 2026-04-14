'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApiMutation } from '@/lib/hooks';

export default function CategoryFormPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const createMutation = useApiMutation('post', '/admin/categories', {
        onSuccess: () => {
            router.push('/admin/categories');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({ name, description });
        } catch (err) {
            alert('Failed to save category');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopNavBar Navigation Shell */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-CATFORM-001</p>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 overflow-y-auto max-w-[1280px] mx-auto w-full p-8 md:p-12 lg:p-16">

                {/* Back Action */}
                <Link href="/admin/categories" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-12 w-fit">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Categories</span>
                </Link>

                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-4 uppercase italic">Category Editor</h1>
                    <p className="text-lg text-on-surface-variant max-w-[576px] font-medium leading-relaxed">Refine the taxonomies of your platform. Maintain precise descriptions to help candidates find their perfect match.</p>
                </div>

                {/* Bento Style Form Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Form Section */}
                    <section className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* Category Name Input */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="category-name">Category Name</label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-inner placeholder-slate-300"
                                        id="category-name"
                                        name="category-name"
                                        placeholder="e.g. Software Engineering"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/40">
                                        <span className="material-symbols-outlined text-[20px]">category</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description Input */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="description">Description (Operational Scope)</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 text-sm font-medium leading-relaxed text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none shadow-inner placeholder-slate-300"
                                    id="description"
                                    name="description"
                                    placeholder="Describe the scope of this category and what roles are typically included..."
                                    rows={8}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-100">
                                <Link href="/admin/categories">
                                    <button className="px-8 py-4 bg-white text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:text-slate-700 hover:bg-slate-50 transition-all" type="button">
                                        Discard
                                    </button>
                                </Link>
                                <button
                                    className="w-full sm:w-auto px-10 py-4 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    type="submit"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? 'Committing...' : 'Commit Taxonomy Node'}
                                    <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Sidebar Info / Visual Anchor */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Live Preview Card */}
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200/50 shadow-inner group">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Live Preview
                            </h3>
                            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1rem] flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                                    <span className="material-symbols-outlined text-[24px]">developer_mode</span>
                                </div>
                                <h4 className="text-xl font-black italic tracking-tight text-slate-900 mb-3 uppercase">{name || 'Software Engineering'}</h4>
                                <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed mb-6">
                                    {description || 'Includes roles specializing in the design, development, and maintenance of software systems.'}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-blue-50 px-3 py-2 rounded-xl w-fit border border-blue-100">
                                    <span>24 Active Openings</span>
                                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Info */}
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 overflow-hidden relative shadow-2xl">
                            <div className="relative z-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Traceability Logic</h3>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stakeholder Ref</span>
                                        <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">STK-ADM-CAT-001</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Compliance Status</span>
                                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Valid</span>
                                    </div>
                                </div>
                            </div>
                            {/* Aesthetic Pattern */}
                            <div className="absolute right-0 bottom-0 opacity-10">
                                <span className="material-symbols-outlined text-[200px] transform rotate-12">receipt_long</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

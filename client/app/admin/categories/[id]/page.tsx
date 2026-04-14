'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobCategory } from '@/types/models';

export default function CategoryViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: category, isLoading, error } = useApiQuery<JobCategory>(['admin', 'categories'], `/admin/categories/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Contextualizing Taxonomy...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Record</div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface pb-16">
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">CareerCurator</span>
                </div>
                <Link href={`/admin/categories/${id}/edit`}>
                    <button className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">edit</span> Modify Node
                    </button>
                </Link>
            </header>

            <main className="mt-8 p-8 lg:p-12 max-w-[1152px] mx-auto w-full">
                <div className="mb-12">
                    <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                        <span>System</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href="/admin/categories" className="hover:text-primary transition-colors">Categories</Link>
                    </nav>
                    <h1 className="text-[3.5rem] font-black text-on-surface leading-[1.1] tracking-tighter mb-4 italic uppercase text-slate-900">{category?.name}</h1>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Taxonomy Context</h3>
                    <p className="text-xl font-medium text-slate-600 leading-relaxed max-w-[768px]">{category?.description}</p>
                </div>
            </main>
        </div>
    );
}

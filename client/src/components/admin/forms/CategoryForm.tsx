'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { JobCategory } from '@/types/models';

interface CategoryFormProps {
    initialData?: JobCategory;
    isEdit?: boolean;
}

export default function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    const mutation = useApiMutation(
        isEdit ? 'put' : 'post',
        isEdit ? `/admin/categories/${initialData?.id}` : '/admin/categories',
        {
            onSuccess: () => {
                router.push('/admin/categories');
                router.refresh();
            }
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutation.mutateAsync({ name, description });
        } catch (err) {
            alert(`Failed to ${isEdit ? 'update' : 'create'} category`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Section */}
            <section className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50">
                <form onSubmit={handleSubmit} className="space-y-10">
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

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-100">
                        <Link href="/admin/categories">
                            <button className="px-8 py-4 bg-white text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:text-slate-700 hover:bg-slate-50 transition-all" type="button">
                                Discard
                            </button>
                        </Link>
                        <button
                            className="w-full sm:w-auto px-10 py-4 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Committing...' : isEdit ? 'Update Category Node' : 'Commit Taxonomy Node'}
                            <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                        </button>
                    </div>
                </form>
            </section>

            {/* Sidebar Preview */}
            <aside className="lg:col-span-4 space-y-8">
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
                            <span>Active Taxon</span>
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

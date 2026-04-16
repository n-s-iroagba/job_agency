'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import CategoryForm from '@/components/admin/forms/CategoryForm';
import Link from 'next/link';

export default function CategoryEditPage() {
    const params = useParams();
    const id = params?.id;
    const { data: category, isLoading, error } = useApiQuery<any>(`/admin/categories/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Category Details...</div>;
    if (error) return <div className="p-12 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Error Loading Category</div>;

    return (
        <div className="font-sans">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/admin/categories" className="text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categories / {id} / Edit</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Category</h1>
            </div>

            <CategoryForm initialData={category} isEdit={true} />
        </div>
    );
}

'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import {
    Layers,
    Plus,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle
} from 'lucide-react';

export default function CategoriesManagementPage() {
    const { data: categories, isLoading } = useApiQuery<any>(['admin', 'categories', 'all'], '/admin/categories');

    if (isLoading) return <div className="animate-pulse h-96 bg-slate-50 card" />;

    const catList = categories || [];

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1>Category & Metadata Management</h1>
                    <p className="text-text-secondary">Structure the job listings and stage configurations (STK-ADM-JOB-001)</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create Category
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {catList.map((cat: any) => (
                    <div key={cat.id} className="card group hover:border-primary transition-all">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-slate-50 text-primary rounded-md group-hover:bg-primary/10 transition-colors">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-slate-100 rounded border border-border"><Edit className="w-3.5 h-3.5" /></button>
                                <button className="p-1.5 hover:bg-red-50 rounded border border-red-100 text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                        <h3 className="mt-md font-bold text-lg">{cat.name}</h3>
                        <p className="text-xs text-text-secondary mt-1">{cat.description || 'No description provided.'}</p>

                        <div className="mt-xl pt-md border-t border-border flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">ID: {cat.id}</span>
                            <span className="px-2 py-0.5 bg-green-50 text-success text-[10px] font-bold rounded uppercase flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> ACTIVE
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

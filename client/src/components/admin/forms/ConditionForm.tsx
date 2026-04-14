'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { JobCondition } from '@/types/models';

interface ConditionFormProps {
    initialData?: JobCondition;
    isEdit?: boolean;
}

export default function ConditionForm({ initialData, isEdit = false }: ConditionFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
        }
    }, [initialData]);

    const mutation = useApiMutation(
        isEdit ? 'put' : 'post',
        isEdit ? `/admin/conditions/${initialData?.id}` : '/admin/conditions',
        {
            onSuccess: () => {
                router.push('/admin/conditions');
                router.refresh();
            }
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutation.mutateAsync({ name, description });
        } catch (err) {
            alert(`Failed to ${isEdit ? 'update' : 'create'} condition`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prerequisite Name</label>
                        <div className="relative">
                            <input
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm font-bold shadow-inner placeholder-slate-300"
                                placeholder="e.g., Minimum 5 Years Experience, or Valid Work Permit"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <span className="material-symbols-outlined text-primary/40">gavel</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Legal & Operational Description</label>
                        <textarea
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none text-sm font-medium leading-relaxed shadow-inner placeholder-slate-300"
                            placeholder="Provide the exact compliance wording used for verification processes..."
                            rows={8}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-100">
                        <Link href="/admin/conditions">
                            <button className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors bg-white hover:bg-slate-50 rounded-xl" type="button">Discard</button>
                        </Link>
                        <button
                            className="px-10 h-14 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-95 transition-all w-full sm:w-auto flex justify-center items-center gap-2"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            <span className="material-symbols-outlined font-bold text-[18px]">gavel</span>
                            {mutation.isPending ? 'Enforcing...' : isEdit ? 'Update Prerequisite' : 'Enforce Prerequisite'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100/50 shadow-inner">
                    <div className="flex items-center gap-3 mb-8 text-orange-600">
                        <span className="material-symbols-outlined p-2 bg-orange-100 rounded-lg">warning</span>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance Guidance</h3>
                    </div>
                    <ul className="space-y-6 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <li>Prerequisites are strict fail conditions.</li>
                        <li>Compliance requirements are tracked under STK-ADM-COND-001.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

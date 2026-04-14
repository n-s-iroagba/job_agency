'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApiMutation } from '@/lib/hooks';

export default function ConditionFormPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const createMutation = useApiMutation('post', '/admin/conditions', {
        onSuccess: () => {
            router.push('/admin/conditions');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({ name, description });
        } catch (err) {
            alert('Failed to save condition');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">JobNexa</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-CONDFORM-001</p>
                </div>
            </header>

            <div className="mt-8 p-8 lg:p-12 max-w-[1152px] mx-auto w-full">

                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                            <span>System</span>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <Link href="/admin/conditions" className="hover:text-primary transition-colors">Conditions</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-primary">Configuration</span>
                        </nav>
                        <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-2 uppercase italic">Prerequisite Editor</h2>
                        <p className="text-lg font-medium text-slate-500 max-w-[576px]">Configure strict compliance constraints and legal requirements for talent placements.</p>
                    </div>
                </div>

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
                                    disabled={createMutation.isPending}
                                >
                                    <span className="material-symbols-outlined font-bold text-[18px]">gavel</span>
                                    {createMutation.isPending ? 'Enforcing...' : 'Enforce Prerequisite'}
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
                            <ul className="space-y-6">
                                <li className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600 font-black text-[10px] shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">1</div>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">Prerequisites are strict fail conditions. Candidates failing to meet these will not progress.</p>
                                </li>
                                <li className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-600 font-black text-[10px] shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">2</div>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">Legal conditions must use precise wording approved by the operations risk team.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

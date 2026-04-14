'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApiMutation } from '@/lib/hooks';

export default function BenefitFormPage() {
    const router = useRouter();
    const [type, setType] = useState('health');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');

    const createMutation = useApiMutation('post', '/admin/benefits', {
        onSuccess: () => {
            router.push('/admin/benefits');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({ type, value, description });
        } catch (err) {
            alert('Failed to save benefit');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            {/* TopAppBar Shell */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black uppercase italic tracking-tighter text-slate-900">CareerCurator</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-BENFORM-001</p>
                </div>
            </header>

            {/* Page Content */}
            <div className="mt-8 p-8 lg:p-12 max-w-[1152px] mx-auto w-full">

                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                            <span>System</span>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <Link href="/admin/benefits" className="hover:text-primary transition-colors">Benefits</Link>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-primary">Configuration</span>
                        </nav>
                        <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-2 uppercase italic">Benefit Editor</h2>
                        <p className="text-lg font-medium text-slate-500 max-w-[576px]">Configure high-value compensation packages and perks for top-tier candidate placements.</p>
                    </div>
                </div>

                {/* Bento Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Form Section */}
                    <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Benefit Type */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Benefit Type</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-14 pl-5 pr-10 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm font-bold shadow-inner"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            required
                                        >
                                            <option value="Salary & Wages">Salary & Wages</option>
                                            <option value="Paid Time Off">Paid Time Off (PTO)</option>
                                            <option value="Health & Medical">Health & Medical</option>
                                            <option value="Retirement">Retirement / 401k</option>
                                            <option value="Performance Bonus">Performance Bonus</option>
                                            <option value="Equity & Stock">Equity & Stock Options</option>
                                            <option value="Utility">Utility / Stipends</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Value */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Benefit Value</label>
                                    <div className="relative">
                                        <input
                                            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm font-bold shadow-inner placeholder-slate-300"
                                            placeholder="e.g., $160k/yr or 25 Days"
                                            type="text"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <span className="material-symbols-outlined text-primary/40">payments</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description (Editorial Format)</label>
                                <textarea
                                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none text-sm font-medium leading-relaxed shadow-inner placeholder-slate-300"
                                    placeholder="Provide a detailed overview of the eligibility, scope, and specific terms of this benefit..."
                                    rows={8}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            {/* Action Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-100">
                                <Link href="/admin/benefits">
                                    <button className="px-8 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors bg-white hover:bg-slate-50 rounded-xl" type="button">Discard</button>
                                </Link>
                                <button
                                    className="px-10 h-14 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-95 transition-all w-full sm:w-auto"
                                    type="submit"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? 'Saving...' : 'Save Benefit Package'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Guidance & Context Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50 shadow-inner">
                            <div className="flex items-center gap-3 mb-8 text-primary">
                                <span className="material-symbols-outlined p-2 bg-blue-100 rounded-lg">info</span>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Curator Guidance</h3>
                            </div>
                            <ul className="space-y-6">
                                <li className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center text-primary font-black text-[10px] shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">1</div>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">Ensure descriptions are editorial and precise. Avoid bullet points in the primary description field.</p>
                                </li>
                                <li className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center text-primary font-black text-[10px] shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">2</div>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">Values should follow a standard format for comparison analytics (e.g., Currency/Period).</p>
                                </li>
                                <li className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center text-primary font-black text-[10px] shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">3</div>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wide">This record is tracked under compliance ticket <span className="font-mono text-primary bg-blue-100/50 px-2 py-0.5 rounded ml-1">STK-ADM-BEN-002</span>.</p>
                                </li>
                            </ul>
                        </div>

                        {/* Visual Asset - Editorial feel */}
                        <div className="relative group h-64 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                            <div className="absolute inset-0 bg-slate-900 group-hover:scale-110 transition-transform duration-1000">
                                {/* Synthetic image background approach for visual richness */}
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-blue-900 to-black opacity-80 backdrop-blur-3xl"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <span className="text-[8px] uppercase font-black text-blue-300 tracking-[0.3em] mb-2 block">Contextual Preview</span>
                                <h4 className="text-white font-black italic tracking-tight text-xl">Premium Placement Standards</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

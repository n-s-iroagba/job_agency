'use client';

import React from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { JobCondition } from '@/types/models';

export default function ConditionsManagementPage() {
    const { data: conditions, isLoading, refetch } = useApiQuery<{ rows: JobCondition[], count: number }>(['admin', 'conditions'], '/admin/conditions');

    const deleteMutation = useApiMutation<number, any>('delete', '/admin/conditions', {
        onSuccess: () => refetch()
    });

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this condition?')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) { alert('Delete failed'); }
    };

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    const conditionsList = conditions?.rows || [];

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            {/* TopAppBar */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-blue-800 tracking-tight italic">JobNexa</span>
                    <span className="h-4 w-px bg-slate-200"></span>
                    <nav className="flex gap-6 items-center hidden md:flex">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Conditions</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-pointer">Templates</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-pointer">Archive</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-COND-001</p>
                </div>
            </header>

            {/* Page Content */}
            <div className="p-8 lg:p-12 max-w-[1400px] mx-auto w-full">

                {/* Hero / Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                    <div className="max-w-[672px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 block border border-primary/20 w-fit px-3 py-1 rounded-full bg-primary/5">System Configuration</span>
                        <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface mb-4 uppercase italic">Job Conditions</h2>
                        <p className="text-on-surface-variant max-w-[576px] text-lg font-light leading-relaxed">Define and manage the mandatory prerequisites, compliance standards, and experience benchmarks for global talent placement.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all">
                            Export Schema
                        </button>
                        <Link href="/admin/conditions/new">
                            <button className="bg-primary text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                                New Prerequisite
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview - Asymmetric Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
                    <div className="col-span-12 md:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col sm:flex-row justify-between md:items-center relative overflow-hidden shadow-2xl shadow-slate-200/50 group">
                        <div className="relative z-10 w-full">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Active Compliance Logic</h3>
                            <div className="text-5xl font-black italic text-on-surface mb-6">{conditionsList.length} Prerequisites</div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow-sm group-hover:bg-emerald-100 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    {Math.max(0, conditionsList.length - 2)} Verified Standards
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl shadow-sm group-hover:bg-blue-100 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">info</span>
                                    2 Custom Rules
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block w-48 h-48 opacity-[0.03] absolute -right-8 -bottom-8 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
                            <span className="material-symbols-outlined text-[180px]">fact_check</span>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group flex flex-col justify-center">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Impact Analysis</h3>
                            <div className="text-5xl font-black italic text-emerald-400 mb-4 drop-shadow-sm">89%</div>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest pb-6 border-b border-white/10">Condition coverage across all active tech-sector listings.</p>
                            <div className="mt-6">
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 group/btn hover:text-blue-400 transition-colors">
                                    View Report
                                    <span className="material-symbols-outlined text-[14px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                        <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-125 transition-transform duration-1000 origin-center">
                            <span className="material-symbols-outlined text-[200px] text-blue-400">analytics</span>
                        </div>
                    </div>
                </div>

                {/* Main Data Table Container */}
                <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="px-10 py-8 bg-slate-50/80 flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 gap-6">
                        <div className="flex gap-8 overflow-x-auto w-full sm:w-auto no-scrollbar pb-2 sm:pb-0">
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b-2 border-primary pb-1 shrink-0">All Conditions</button>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-700 pb-1 shrink-0 transition-colors">Visa & Legal</button>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-700 pb-1 shrink-0 transition-colors">Experience</button>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto justify-end">
                            <button className="bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined font-bold text-[18px]">filter_list</span>
                            </button>
                            <button className="bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined font-bold text-[18px]">sort</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Condition Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Global Description</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {conditionsList.map((cond: JobCondition, idx: number) => {
                                    const uiClass = idx % 2 === 0 ? { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'badge', badgeBg: 'bg-blue-100/50' } :
                                        { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'history_edu', badgeBg: 'bg-orange-100/50' };

                                    return (
                                        <tr key={cond.id} className="hover:bg-slate-50/70 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl ${uiClass.bg} ${uiClass.text} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                                        <span className="material-symbols-outlined font-bold">{uiClass.icon}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-on-surface uppercase tracking-tight mb-1">{cond.name}</div>
                                                        <div className={`text-[8px] font-black ${uiClass.text} ${uiClass.badgeBg} uppercase tracking-widest px-2 py-0.5 rounded-full inline-block border border-${uiClass.text}/10`}>Compliance Standard</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 max-w-[448px]">
                                                <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed tracking-wide">
                                                    {cond.description || 'Standard requirement configured for operational recruitment.'}
                                                </p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/conditions/${cond.id}`}>
                                                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:shadow-md transition-all shadow-sm">
                                                            <span className="material-symbols-outlined text-[16px] font-bold">visibility</span>
                                                        </button>
                                                    </Link>
                                                    <Link href={`/admin/conditions/${cond.id}/edit`}>
                                                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:shadow-md transition-all shadow-sm">
                                                            <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(cond.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-error hover:shadow-md transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">delete_outline</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {conditionsList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-16 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">No conditions configured</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="px-10 py-8 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Showing {conditionsList.length} of {conditionsList.length} conditions</span>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary shadow-sm transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                                <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-md">1</button>
                                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-[10px] font-black text-slate-600 hover:text-primary hover:border-primary shadow-sm transition-colors cursor-not-allowed opacity-50">2</button>
                                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary shadow-sm transition-colors opacity-50 cursor-not-allowed"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Component: The Candidate Spotlight / Compliance Focus */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="col-span-12 md:col-span-5 bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden border border-slate-50">
                        <div className="relative z-10">
                            <h4 className="text-[2rem] font-black leading-tight text-on-surface mb-6 italic tracking-tighter uppercase">Precision Prerequisite Management</h4>
                            <p className="text-on-surface-variant font-medium leading-relaxed tracking-wide mb-10 text-sm">Our proprietary curation engine ensures every job listing meets legal and professional standards before reaching the public board.</p>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Automatic Visa Mapping</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Cross-border validation</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Skill Clustering</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Intelligent vetting</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="absolute -right-20 -bottom-20 text-blue-50/60 select-none grayscale opacity-30 transform -rotate-12">
                            <span className="material-symbols-outlined text-[400px]">architecture</span>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-7 rounded-[2.5rem] overflow-hidden relative min-h-[450px] shadow-2xl group border-4 border-white">
                        <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(37,99,235,0.8),_transparent_70%)] group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        </div>
                        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]"></div>
                        <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/20 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div>
                                    <h5 className="font-black italic text-xl tracking-tight text-white uppercase drop-shadow-md">Global Standards Hub</h5>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Last schema update: 4 hours ago
                                    </p>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-primary px-8 py-4 rounded-xl shadow-xl hover:bg-slate-50 active:scale-95 transition-all w-full sm:w-auto">Sync Cloud Rules</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

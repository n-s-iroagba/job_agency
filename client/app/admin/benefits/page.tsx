'use client';

import { JobBenefit } from '@/types/models';

export default function BenefitsManagementPage() {
    const { data: benefits, isLoading, refetch } = useApiQuery<{ rows: JobBenefit[], count: number }>(['admin', 'benefits'], '/admin/benefits');

    const deleteMutation = useApiMutation<number, any>('delete', '/admin/benefits', {
        onSuccess: () => refetch()
    });

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this benefit?')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) { alert('Delete failed'); }
    };

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    const benefitsList = benefits?.rows || [];

    // Calculate distribution for Stats Bento Grid
    const typeDistribution = benefitsList.reduce((acc: any, b: JobBenefit) => {
        acc[b.benefitType] = (acc[b.benefitType] || 0) + 1;
        return acc;
    }, {});
    const total = benefitsList.length || 1; // avoid division by zero

    // Sort distribution to get top 3
    const sortedTypes = Object.entries(typeDistribution).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            {/* TopAppBar Shell */}
            <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>System</span>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="text-primary">Benefit Configuration</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6 hidden md:flex">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">SCR-ADM-BEN-001</p>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="p-8 lg:p-12 max-w-[1400px] mx-auto w-full">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-[672px]">
                        <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-3 block">Governance & Incentives</span>
                        <h2 className="text-[3.5rem] font-black tracking-tighter text-on-surface mb-4 leading-none italic uppercase">Agency Benefits</h2>
                        <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                            Design and manage the premium incentive structures offered across your portfolio. Curated benefits drive higher engagement and candidate retention.
                        </p>
                    </div>
                    <Link href="/admin/benefits/new">
                        <button className="px-8 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined font-bold text-[18px]">add</span>
                            Add New Benefit
                        </button>
                    </Link>
                </header>

                {/* Stats Bento Grid (Precision Style) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
                    <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-50 relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px] font-bold">verified_user</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Benefits</p>
                                <p className="text-5xl font-black italic text-on-surface">{benefitsList.length.toString().padStart(2, '0')}</p>
                            </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative z-10">
                            <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 opacity-5">
                            <span className="material-symbols-outlined text-[120px]">workspace_premium</span>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-8 bg-slate-900 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">Benefit Distribution</h3>
                                <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Top-performing categories based on inventory.</p>
                            </div>
                            <div className="flex gap-8 items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                                {sortedTypes.map(([type, count]: any, idx) => (
                                    <div key={type} className="text-center">
                                        <span className={`block text-3xl font-black italic mb-1 ${idx === 0 ? 'text-primary' : idx === 1 ? 'text-secondary' : 'text-tertiary'}`}>
                                            {Math.round((count / total) * 100)}%
                                        </span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{type || 'General'}</span>
                                    </div>
                                ))}
                                {sortedTypes.length === 0 && <div className="text-slate-400 text-sm font-bold">No data</div>}
                            </div>
                        </div>
                        <div className="absolute -left-10 -top-10 opacity-10">
                            <span className="material-symbols-outlined text-[200px] text-white">pie_chart</span>
                        </div>
                    </div>
                </div>

                {/* Data Canvas */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-50">

                    {/* Table Controls */}
                    <div className="px-10 py-8 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-white px-5 py-3 rounded-xl flex items-center gap-3 border border-slate-200 shadow-sm">
                                <span className="material-symbols-outlined text-slate-400 font-bold" style={{ fontSize: '18px' }}>filter_list</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">All Categories</span>
                            </div>
                            <div className="bg-white px-5 py-3 rounded-xl flex items-center gap-3 border border-slate-200 shadow-sm">
                                <span className="material-symbols-outlined text-slate-400 font-bold" style={{ fontSize: '18px' }}>sort</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Recently Modified</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                                DISPLAYING {benefitsList.length} RECORD(S)
                            </span>
                        </div>
                    </div>

                    {/* Precision Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Benefit Type</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Value</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {benefitsList.map((b: JobBenefit, idx: number) => {
                                    // Assign varied colors based on index for visual flair matching design
                                    const uiClass = idx % 3 === 0 ? { bg: 'bg-primary/10', text: 'text-primary', icon: 'payments', badgeBg: 'bg-blue-50', border: 'hover:border-primary' } :
                                        idx % 3 === 1 ? { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'flight', badgeBg: 'bg-slate-100', border: 'hover:border-secondary' } :
                                            { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: 'medical_services', badgeBg: 'bg-orange-50', border: 'hover:border-tertiary' };

                                    return (
                                        <tr key={b.id} className={`hover:bg-slate-50/70 transition-colors group border-l-4 border-transparent ${uiClass.border}`}>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl ${uiClass.bg} flex items-center justify-center ${uiClass.text} group-hover:scale-110 transition-transform shadow-inner`}>
                                                        <span className="material-symbols-outlined font-bold">{uiClass.icon}</span>
                                                    </div>
                                                    <div className="flex flex-col items-start gap-1">
                                                        <p className="font-black text-on-surface uppercase tracking-tight text-xs">{b.benefitType}</p>
                                                        <span className={`text-[8px] font-black ${uiClass.text} px-3 py-1 ${uiClass.badgeBg} rounded-full uppercase tracking-widest border border-slate-200/50`}>
                                                            {b.benefitType.split(' ')[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-xs font-bold text-slate-500 max-w-[384px] line-clamp-2 leading-relaxed tracking-wide">
                                                    {b.description || 'Standard corporate package provision configured according to Tier 1 placement guidelines.'}
                                                </p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="text-sm font-black text-on-surface font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">{b.value || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/benefits/${b.id}/edit`}>
                                                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:shadow-lg transition-all shadow-sm">
                                                            <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(b.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-error hover:shadow-lg transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px] font-bold">delete_outline</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {benefitsList.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-16 text-center">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">No benefits configured</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Featured Benefit Highlight (Editorial Signature Component) */}
                <section className="mt-16 relative h-[400px] rounded-[3rem] overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 z-0 bg-slate-900">
                        {/* Placeholder gradient mimicking image */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 to-blue-600/40 opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"></div>
                        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(37,99,235,0.4) 0%, transparent 50%)" }}></div>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-center p-16 max-w-[576px] text-white">
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-300 mb-6 block border border-blue-400/30 w-fit px-3 py-1 rounded-full bg-blue-900/50 backdrop-blur-sm">Candidate Spotlight</span>
                        <h3 className="text-4xl font-black mb-8 leading-tight italic tracking-tight drop-shadow-xl">"The premium health benefits package was the absolute deciding factor in my professional journey."</h3>
                        <div className="flex items-center gap-5 bg-black/20 w-fit pr-6 rounded-full backdrop-blur-md border border-white/10">
                            <div className="w-14 h-14 rounded-full border-2 border-primary/50 bg-slate-800 flex items-center justify-center -ml-1">
                                <span className="material-symbols-outlined text-white">person</span>
                            </div>
                            <div>
                                <p className="font-black text-xs uppercase tracking-widest text-white">Elena Vance</p>
                                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Senior Product Designer</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-black/80 to-transparent flex items-end justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/50 transform -rotate-90 origin-bottom-right translate-x-8 mb-20 italic">Curator Precision Standard</p>
                    </div>
                </section>

            </main>
        </div>
    );
}

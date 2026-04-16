'use client';


import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';


export default function JobViewPage() {
    const params = useParams();
    const id = params?.id;
    const { data: job, isLoading, error } = useApiQuery<any>(['admin', 'jobs', `${id}`], `/admin/jobs/${id}`, {
        enabled: !!id
    });

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Job Details...</div>;
    if (error) return <div className="p-12 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Error Loading Listing</div>;

    return (
        <div className="font-sans pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/jobs" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                        </Link>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Registry / {id}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{job?.title}</h1>
                </div>
                <Link href={`/admin/jobs/${id}/edit`}>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">edit</span>
                        Edit Job
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Description</h3>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {job?.description}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Requirements</h3>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {job?.requirements}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Benefits</h3>
                            <div className="flex flex-wrap gap-2">
                                {job?.JobBenefits?.length > 0 ? (
                                    job.JobBenefits.map((b: any) => (
                                        <span key={b.id} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                                            {b.benefitType}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">None</span>
                                )}
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Conditions</h3>
                            <div className="flex flex-wrap gap-2">
                                {job?.JobConditions?.length > 0 ? (
                                    job.JobConditions.map((c: any) => (
                                        <span key={c.id} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                                            {c.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">None</span>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="space-y-8">
                    <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 pb-4 border-b border-slate-800">Job Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</span>
                                <span className="text-sm font-medium">{job?.JobCategory?.name || 'Uncategorized'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</span>
                                <span className="text-sm font-medium">{job?.employmentType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</span>
                                <span className="text-sm font-medium">{job?.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${job?.isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {job?.isActive ? 'Active' : 'Archived'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Timeline</h3>
                        <div className="space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <p>Created: {new Date(job?.createdAt).toLocaleDateString()}</p>
                            <p>Updated: {new Date(job?.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}


'use client';

import { Application } from '@/types/models';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';

interface ApplicationsResponse {
    rows: Application[];
    count: number;
}

export default function AdminApplicationsPage() {
    const { data: apps, isLoading } = useApiQuery<ApplicationsResponse>(['admin', 'applications', 'all'], '/admin/applications');
    const appList = apps?.rows || [];

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Pipeline Infrastructure...</div>;

    return (
        <div className="font-sans antialiased text-slate-900">
            <div className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight uppercase leading-tight">Operational Pipelines</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Oversee global talent acquisitions and real-time application processing</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-900/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personnel</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project / Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fiscal Audit</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {appList.map((app: any) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-slate-900/10">
                                                {(app.User?.fullName || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{app.User?.fullName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.User?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{app.JobListing?.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{app.JobListing?.employmentType}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse"></span>
                                            <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                                                {app.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${app.isPaid ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-200'}`}></div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${app.isPaid ? 'text-slate-900' : 'text-slate-400'}`}>{app.isPaid ? 'Cleared' : 'Pending'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link 
                                            href={`/admin/applications/${app.id}`} 
                                            className="inline-flex items-center gap-2 bg-white border border-slate-100 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-95"
                                        >
                                            Inspect Pipeline
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-slate-900/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Pipeline Load</h3>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">{appList.length} Active Protocols</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-900/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Financial Clearance</h3>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">{appList.filter(a => a.isPaid).length} Verified Deposits</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-900/5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Real-Time Sync</h3>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">Operational</p>
                </div>
            </div>
        </div>
    );
}

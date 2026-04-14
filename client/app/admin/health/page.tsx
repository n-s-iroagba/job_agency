'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';

export default function SystemHealthDashboardPage() {
    const { data: healthVars, isLoading } = useApiQuery<any>(['admin', 'health'], '/telemetry');

    const metrics = healthVars || {};

    if (isLoading) return <div className="p-12 animate-pulse flex flex-col gap-6"><div className="h-40 bg-surface-container-low rounded-xl"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopNavBar Shell */}
            <header className="sticky top-0 z-40 h-16 flex justify-between items-center w-full px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex items-center gap-8">
                    <span className="text-xl font-black text-blue-800 tracking-tight italic uppercase">JobNexa Admin</span>
                    <nav className="hidden md:flex items-center gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-blue-600 transition-all">Overview</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-blue-600 transition-all">Reports</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-blue-600/30 pb-0.5">Logs</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[16px]">search</span>
                        <input
                            className="bg-slate-50 border border-slate-200 rounded-full py-2 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-primary/20 w-64 transition-all shadow-inner placeholder:text-slate-400"
                            placeholder="SEARCH LOGS..."
                            type="text"
                        />
                    </div>
                </div>
            </header>

            {/* Dashboard Canvas */}
            <div className="p-8 md:p-12 max-w-[1280px] mx-auto w-full space-y-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-[3.5rem] font-black text-on-surface leading-none tracking-tighter uppercase italic mb-2">System Health</h2>
                        <p className="text-on-surface-variant font-medium text-lg">Real-time status: <span className="text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 ml-2 shadow-sm">All Systems Operational</span></p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Last sync: 2s ago</span>
                    </div>
                </div>

                {/* Bento Grid - Server Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* CPU Metric */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CPU Usage</span>
                            <span className="material-symbols-outlined text-[20px] text-primary">memory</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter italic text-slate-800">{metrics.cpu.usage}%</span>
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{metrics.cpu.trend}%</span>
                        </div>
                        <div className="mt-8 h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-primary bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${metrics.cpu.usage}%` }}></div>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6">Peak: {metrics.cpu.peak}% (09:12 AM)</p>
                    </div>

                    {/* RAM Metric */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Memory</span>
                            <span className="material-symbols-outlined text-[20px] text-blue-500">developer_board</span>
                        </div>
                        <div className="flex flex-col gap-1 inline-block">
                            <span className="text-5xl font-black tracking-tighter italic text-slate-800">{metrics.ram.usage}GB</span>
                            <span className="text-slate-400 text-[11px] font-bold tracking-widest">/ {metrics.ram.total}GB allocated</span>
                        </div>
                        <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-blue-500 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: `${(metrics.ram.usage / metrics.ram.total) * 100}%` }}></div>
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6">Swap usage: 0%</p>
                    </div>

                    {/* Uptime Metric */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Uptime</span>
                            <span className="material-symbols-outlined text-[20px] text-emerald-500">schedule</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter italic text-slate-800">{metrics.uptime.days}d</span>
                            <span className="text-slate-400 text-xl font-black italic">{metrics.uptime.hours}h</span>
                        </div>
                        <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Target SLA</span>
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">99.9%</span>
                        </div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-4 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">verified</span> SLA Maintained: {metrics.uptime.sla}%
                        </p>
                    </div>

                    {/* Network Metric */}
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl group hover:-translate-y-1 transition-transform duration-300 border border-slate-800 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Active Connections</span>
                                <span className="material-symbols-outlined text-[20px] text-white">router</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter italic text-white">{metrics.requests.active}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-8 text-[10px] font-black uppercase tracking-widest">
                                <span className="material-symbols-outlined text-[14px] text-emerald-400">trending_up</span>
                                <span className="text-emerald-400">{metrics.requests.rate} req/s</span>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6">Capacity: 9%</p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 opacity-10">
                            <span className="material-symbols-outlined text-[160px] text-blue-400">language</span>
                        </div>
                    </div>
                </div>

                {/* Additional detailed sections would go here (Service Map, Application Logs, Database Performance) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 min-h-[400px]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">list_alt</span> Access Logs Stream
                        </h3>
                        <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden font-mono text-[10px] max-h-[300px] overflow-y-auto">
                            <div className="text-slate-400 font-bold tracking-widest leading-loose">
                                <div className="text-emerald-400 hover:bg-white/5 py-1 px-2 rounded">[2023-10-24 10:45:01] <span className="text-blue-300">INFO</span> - API Request to /api/users/auth [200 OK] 45ms</div>
                                <div className="text-emerald-400 hover:bg-white/5 py-1 px-2 rounded">[2023-10-24 10:45:02] <span className="text-blue-300">INFO</span> - Cache generated for job_tree_global [200 OK]</div>
                                <div className="text-emerald-400 hover:bg-white/5 py-1 px-2 rounded">[2023-10-24 10:45:04] <span className="text-yellow-400">WARN</span> - Rate limit threshold approaching for IP 192.168.1.5</div>
                                <div className="text-emerald-400 hover:bg-white/5 py-1 px-2 rounded">[2023-10-24 10:45:05] <span className="text-blue-300">INFO</span> - Webhook dispatch to Payment Gateway completed</div>
                                <div className="text-emerald-400 hover:bg-white/5 py-1 px-2 rounded">[2023-10-24 10:45:10] <span className="text-error">ERROR</span> - Attempted unauthorized access to admin/keys</div>
                                <div className="text-emerald-400 hover:bg-white/5 py-1 px-2 rounded">[2023-10-24 10:45:12] <span className="text-blue-300">INFO</span> - DB Connection pool re-balanced successfully</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">dns</span> Infrastructure Nodes
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">database</span>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Primary Database Node</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 font-mono">postgres-cluster-main</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Healthy</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">cached</span>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Redis Caching Layer</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 font-mono">redis-cache-eu-west</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Healthy</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">cloud</span>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest">CDN & Edge Delivery</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 font-mono">cloudflare-edge-dist</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Optimized</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

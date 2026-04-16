'use client';


import { useApiQuery } from '@/lib/hooks';


export default function AdminDashboardPage() {
    const { data: apps, isLoading: appsLoading } = useApiQuery<any>(['admin', 'apps', 'summary'], '/admin/applications?limit=5');
    const { data: unverified } = useApiQuery<any>(['admin', 'payments', 'unverified'], '/admin/payments/unverified');
    const { data: unpaid } = useApiQuery<any>(['admin', 'payments', 'unpaid'], '/admin/payments/unpaid');
    const { data: health } = useApiQuery<any>(['admin', 'health'], '/admin/health');
    const { data: users } = useApiQuery<any>(['admin', 'users', 'total'], '/admin/users?limit=1');

    const appCount = apps?.count || 0;
    const unpaidCount = unpaid?.count || 0;
    const unverifiedCount = unverified?.rows?.length || unverified?.length || 0;
    const totalUsers = users?.count || 0;

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-blue-500/10 selection:text-blue-600">
            {/* Header */}
            <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-40 border-b border-slate-100/50">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter text-on-surface uppercase decoration-primary decoration-4">Administrative Overview</h2>
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest opacity-60">Monitoring Precision Professional Placement Systems</p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <span className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${health?.database?.status === 'Connected' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            {health?.database?.status === 'Connected' ? 'System Live' : 'Service Disrupted'}
                        </span>
                    </div>
                </div>
            </header>

            <div className="p-12 space-y-12 max-w-[1280px]">
                {/* Bento Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Summary Card 1: Applications */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-48 relative overflow-hidden group border border-slate-50">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[12rem] font-bold">assignment</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Applications</p>
                            <h3 className="text-6xl font-black tracking-tighter text-primary">{appCount.toString().padStart(2, '0')}</h3>
                        </div>
                        <div className="flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 w-fit px-3 py-1 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">groups</span>
                            {totalUsers} Registered Users
                        </div>
                    </div>

                    {/* Summary Card 2: Unpaid */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-48 relative overflow-hidden group border border-slate-50">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700 text-error">
                            <span className="material-symbols-outlined text-[12rem] font-bold">payments</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-error text-[10px] font-black uppercase tracking-[0.2em] mb-4">Unpaid Sums</p>
                            <h3 className="text-6xl font-black tracking-tighter text-on-surface">{unpaidCount.toString().padStart(2, '0')}</h3>
                        </div>
                        <div className="flex items-center text-error font-bold text-[10px] uppercase tracking-widest bg-error/5 w-fit px-3 py-1 rounded-full border border-error/10">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">warning</span>
                            {unpaidCount > 0 ? 'Pending Collection' : 'Settled'}
                        </div>
                    </div>

                    {/* Summary Card 3: Unverified */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-48 relative overflow-hidden group border border-slate-50">
                        <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-700 text-tertiary">
                            <span className="material-symbols-outlined text-[12rem] font-bold">verified_user</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Pending Proofs</p>
                            <h3 className="text-6xl font-black tracking-tighter text-on-surface">{unverifiedCount.toString().padStart(2, '0')}</h3>
                        </div>
                        <div className="flex items-center text-slate-500 font-bold text-[10px] uppercase tracking-widest bg-slate-50 w-fit px-3 py-1 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-sm mr-1 font-bold">hourglass_empty</span>
                            Audit Queue
                        </div>
                    </div>
                </section>

                {/* Operational Insight Layer */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* System Health Widget */}
                    <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-10 shadow-2xl shadow-slate-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-9xl font-bold">health_and_safety</span>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 border-b border-white/10 pb-6 flex items-center text-emerald-400">
                            <span className="material-symbols-outlined mr-3 text-2xl font-bold">shield_with_heart</span>
                            System Health Core
                        </h4>
                        <div className="space-y-10 relative z-10">
                            {/* CPU/Latency */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Database Sync</span>
                                    <span className={`text-xs font-black uppercase tracking-tighter ${health?.database?.status === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {health?.database?.status === 'Connected' ? 'Stable' : 'Offline'}
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-emerald-500 shadow-lg shadow-emerald-500/50 ${health?.database?.status === 'Connected' ? 'w-full' : 'w-0'}`}></div>
                                </div>
                            </div>
                            {/* Memory */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Memory Matrix</span>
                                    <span className="text-xs font-black text-amber-400 uppercase tracking-tighter">
                                        {health?.memoryUsage ? `${health.memoryUsage.heapUsedMb}/${health.memoryUsage.heapTotalMb} MB` : 'Scanning...'}
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 shadow-lg shadow-amber-500/50 transition-all duration-1000"
                                        style={{ width: health?.memoryUsage ? `${(health.memoryUsage.heapUsedMb / health.memoryUsage.heapTotalMb * 100).toFixed(0)}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                            {/* Uptime */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logic Availability</span>
                                    <span className="text-xs font-black text-emerald-400 uppercase tracking-tighter">
                                        {health?.serverUptime ? `${(health.serverUptime / 3600).toFixed(1)} Hours` : 'Online'}
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full shadow-lg shadow-emerald-500/50"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="lg:col-span-8 bg-white rounded-2xl p-10 shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <div className="flex items-center justify-between mb-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface flex items-center">
                                <span className="material-symbols-outlined mr-3 text-primary font-bold">history</span>
                                Real-time Operational Logs
                            </h4>
                        </div>
                        <div className="space-y-0 relative min-h-[200px]">
                            {apps?.rows?.length > 0 ? (
                                <>
                                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                                    {apps.rows.map((app: any, i: number) => (
                                        <div key={app.id} className="relative pl-12 pb-10 last:pb-0">
                                            <div className={`absolute left-1.5 top-0 w-3.5 h-3.5 ${i === 0 ? 'bg-primary' : 'bg-slate-200'} rounded-full border-4 border-white z-10 shadow-sm`}></div>
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-black text-on-surface uppercase tracking-tight">Application Protocol</p>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant font-medium leading-relaxed italic opacity-80">
                                                Subscriber <span className="text-primary font-bold not-italic font-sans text-[10px]">{app.User?.fullName}</span> initiated placement sequence for {app.JobListing?.title}.
                                            </p>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <span className="material-symbols-outlined text-4xl text-slate-200 mb-4 font-bold">inbox</span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Recent Log Entries</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Dashboard Spot */}
                <section className="bg-slate-900 overflow-hidden rounded-3xl relative min-h-[320px] flex items-center shadow-2xl shadow-slate-300">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1551288049-bbbda5366392?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
                    <div className="relative z-10 px-16 py-12 max-w-[672px]">

                        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium italic">
                            There are currently {appCount} applications in the pipeline across {totalUsers} registered candidates. {unverifiedCount > 0 ? `Attention required for ${unverifiedCount} pending verifications.` : 'All payment queues are currently clear.'}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

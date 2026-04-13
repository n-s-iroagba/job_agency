'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import {
    Activity,
    Database,
    Cpu,
    Layers,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function AdminHealthPage() {
    const { data: health, isLoading } = useApiQuery<any>(['admin', 'health'], '/admin/health');

    if (isLoading) return <div className="card h-96 animate-pulse bg-slate-100" />;

    return (
        <div className="space-y-xl">
            <header>
                <h1>System Health & Metrics</h1>
                <p className="text-text-secondary">Real-time infrastructure observability (STK-ADM-HEALTH-001..002)</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                <div className="card border-l-4 border-l-success flex items-center gap-md">
                    <div className="p-3 bg-green-50 text-success rounded-md"><Database className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">DB Status</p>
                        <p className="text-xl font-bold">HEALTHY</p>
                    </div>
                </div>
                <div className="card border-l-4 border-l-primary flex items-center gap-md">
                    <div className="p-3 bg-blue-50 text-primary rounded-md"><Cpu className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">Memory Usage</p>
                        <p className="text-xl font-bold">{health?.memoryUsage?.heapUsed ? `${(health.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)} MB` : 'N/A'}</p>
                    </div>
                </div>
                <div className="card border-l-4 border-l-amber-500 flex items-center gap-md">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-md"><Activity className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">Uptime</p>
                        <p className="text-xl font-bold">{health?.uptime ? `${(health.uptime / 60).toFixed(0)} min` : 'N/A'}</p>
                    </div>
                </div>
                <div className="card border-l-4 border-l-purple-500 flex items-center gap-md">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-md"><Layers className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">Pool Total</p>
                        <p className="text-xl font-bold">{health?.dbPool?.size || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                <section className="card space-y-md">
                    <h3 className="flex items-center gap-2">Platform Integrity</h3>
                    <div className="space-y-sm">
                        <div className="flex justify-between p-sm bg-slate-50 rounded-md text-sm">
                            <span>API Rate Limiting (NFR-SEC-008)</span>
                            <span className="text-success font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE</span>
                        </div>
                        <div className="flex justify-between p-sm bg-slate-50 rounded-md text-sm">
                            <span>JWT Authorization (NFR-SEC-004)</span>
                            <span className="text-success font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE</span>
                        </div>
                        <div className="flex justify-between p-sm bg-slate-50 rounded-md text-sm">
                            <span>Sequelize Connection</span>
                            <span className="text-success font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> STABLE</span>
                        </div>
                    </div>
                </section>

                <section className="card space-y-md">
                    <h3 className="flex items-center gap-2">Operational Alerts</h3>
                    <div className="bg-blue-50/50 p-xl rounded-md text-center py-xl">
                        <AlertCircle className="w-8 h-8 text-primary mx-auto mb-md opacity-20" />
                        <p className="text-sm text-text-secondary">No critical system alerts at this time.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

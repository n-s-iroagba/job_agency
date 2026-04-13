'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import {
    Plus,
    Edit,
    Trash2,
    Briefcase,
    MapPin,
    Layers,
    Search
} from 'lucide-react';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

export default function AdminJobsPage() {
    const { data: jobs, isLoading, refetch } = useApiQuery<any>(['admin', 'jobs', 'all'], '/admin/jobs');
    const [search, setSearch] = useState('');

    const deleteMutation = useApiMutation('delete', '/admin/jobs', {
        onSuccess: () => refetch()
    });

    if (isLoading) return <div className="card h-96 animate-pulse bg-slate-100" />;

    const jobList = jobs?.filter((j: any) => j.title.toLowerCase().includes(search.toLowerCase())) || [];

    return (
        <div className="space-y-xl">
            <header className="flex justify-between items-end">
                <div>
                    <h1>Job Management</h1>
                    <p className="text-text-secondary">Create and edit recruitment opportunities (STK-ADM-JOB-001..005)</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create New Job
                </button>
            </header>

            <div className="flex gap-md bg-white p-4 rounded-md border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        className="input pl-10"
                        placeholder="Search by job title or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-sm">
                    <select className="input max-w-[150px]">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Draft</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {jobList.map((job: any) => (
                    <div key={job.id} className="card group relative flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-md">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${job.isActive ? 'bg-green-50 text-success' : 'bg-slate-100 text-text-secondary'
                                    }`}>
                                    {job.isActive ? 'Active' : 'Draft'}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-slate-100 rounded border border-border"><Edit className="w-3.5 h-3.5" /></button>
                                    <button className="p-1.5 hover:bg-red-50 rounded border border-red-100 text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-sm group-hover:text-primary transition-colors">{job.title}</h3>
                            <div className="space-y-2 text-xs text-text-secondary">
                                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {job.location}</p>
                                <p className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> {job.employmentType}</p>
                                <p className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> {job.JobCategory?.name || 'Uncategorized'}</p>
                            </div>
                        </div>

                        <div className="pt-lg mt-xl border-t border-border flex justify-between items-center bg-slate-50 -mx-md -mb-md px-md py-3 rounded-b-md">
                            <span className="text-[10px] font-bold text-slate-400">ID: {job.id}</span>
                            <Link href={`/admin/jobs/${job.id}/stages`} className="text-[10px] font-bold text-primary hover:underline">
                                Configure Stages →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

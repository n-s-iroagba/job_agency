'use client';


import Link from 'next/link';
import JobForm from '@/components/admin/forms/JobForm';

export default function JobListingNewPage() {
    return (
        <div className="font-sans">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/admin/jobs" className="text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Registry / New</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Listing</h1>
            </div>

            <JobForm />
        </div>
    );
}

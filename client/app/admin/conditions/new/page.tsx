'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import ConditionForm from '@/components/admin/forms/ConditionForm';

export default function ConditionNewPage() {
    const params = useParams();
    const jobId = params?.jobId ? Number(params.jobId) : undefined;

    return (
        <div className="font-sans">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/admin/conditions" className="text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conditions / New</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Condition</h1>
            </div>

            <ConditionForm />
        </div>
    );
}

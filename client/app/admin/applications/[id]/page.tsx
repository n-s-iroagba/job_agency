'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import Link from 'next/link';

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [showAddStage, setShowAddStage] = useState(false);

    // Form state for new stage
    const [newStageName, setNewStageName] = useState('');
    const [newStageDesc, setNewStageDesc] = useState('');
    const [requiresPayment, setRequiresPayment] = useState(false);
    const [amount, setAmount] = useState('');

    const { data: application, isLoading, error, refetch } = useApiQuery<any>(
        ['admin', 'applications', `${id}`],
        `/admin/applications/${id}`,
        { enabled: !!id }
    );

    const addStageMutation = useApiMutation(
        'post',
        `/admin/applications/${id}/stages`,
        {
            onSuccess: () => {
                setShowAddStage(false);
                setNewStageName('');
                setNewStageDesc('');
                setRequiresPayment(false);
                setAmount('');
                refetch();
            }
        }
    );

    const handleAddStage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addStageMutation.mutateAsync({
                name: newStageName,
                description: newStageDesc,
                requiresPayment,
                amount: requiresPayment ? parseFloat(amount) : null,
                currency: requiresPayment ? 'USD' : null,
                orderPosition: (application?.JobStages?.length || 0) + 1
            });
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Loading...</div>;
    if (error) return <div className="p-12 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">Error Loading Application</div>;

    const user = application?.User;
    const job = application?.JobListing;
    const stages = application?.JobStages || [];

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-900 tracking-tight">{user?.fullName}</h1>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">
                        Application for {job?.title}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg ${application.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            application.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                'bg-blue-100 text-blue-600'
                        }`}>
                        {application.status}
                    </span>
                    <button
                        onClick={() => setShowAddStage(true)}
                        className="bg-blue-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all"
                    >
                        Add Stage
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-blue-100">
                        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">Pipeline</h3>
                        <div className="space-y-4">
                            {stages.map((stage: any, index: number) => {
                                const isCurrent = stage.id === application.currentStageId;
                                return (
                                    <div
                                        key={stage.id}
                                        className={`p-5 rounded-xl border transition-all ${isCurrent ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-blue-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex gap-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${isCurrent ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                                        {stage.name}
                                                        {stage.requiresPayment && (
                                                            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">
                                                                (Paid)
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-blue-500 mt-1 leading-relaxed">
                                                        {stage.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {isCurrent && (
                                                <span className="text-[9px] font-bold text-blue-900 uppercase tracking-widest">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {stages.length === 0 && (
                                <div className="py-12 text-center text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                                    No stages defined
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Email</p>
                                <p className="text-xs font-medium text-blue-900 mt-1">{user?.email}</p>
                            </div>
                            <div className="pt-4 border-t border-blue-50">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Progress</p>
                                <div className="mt-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xl font-bold text-blue-900">{application.completionPercentage}%</span>
                                    </div>
                                    <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-900 transition-all duration-500"
                                            style={{ width: `${application.completionPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900 p-6 rounded-2xl text-white">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-blue-400">
                            <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                            <span>ID #{id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showAddStage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowAddStage(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-blue-100 flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Add Stage</h3>
                            <button onClick={() => setShowAddStage(false)} className="text-blue-400 hover:text-blue-900 transition-colors">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddStage} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newStageName}
                                    onChange={(e) => setNewStageName(e.target.value)}
                                    placeholder="Stage Title"
                                    className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-900/5 focus:border-blue-900 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={newStageDesc}
                                    onChange={(e) => setNewStageDesc(e.target.value)}
                                    placeholder="Describe this stage..."
                                    className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-900/5 focus:border-blue-900 outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <input
                                    type="checkbox"
                                    id="paywall"
                                    checked={requiresPayment}
                                    onChange={(e) => setRequiresPayment(e.target.checked)}
                                    className="w-4 h-4 rounded border-blue-300 text-blue-900 focus:ring-blue-900"
                                />
                                <label htmlFor="paywall" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Requires Payment</label>
                            </div>
                            {requiresPayment && (
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest">Amount (USD)</label>
                                    <input
                                        type="number"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-900/5 focus:border-blue-900 outline-none transition-all"
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={addStageMutation.isPending}
                                className="w-full py-3 bg-blue-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
                            >
                                {addStageMutation.isPending ? 'Saving...' : 'Save Stage'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

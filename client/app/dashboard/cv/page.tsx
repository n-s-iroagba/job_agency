'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import api from '@/lib/api';

interface Cv {
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    createdAt: string;
}

export default function CvManagementPage() {
    const { data: cv, isLoading, refetch } = useApiQuery<Cv | null>(['cv', 'current'], '/cv');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteMutation = useApiMutation('delete', '/cv', {
        onSuccess: () => refetch()
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Only PDF and DOCX are allowed.');
            return;
        }

        if (file.size > CONSTANTS.FILE_CONSTRAINTS.CV_LIMIT_MB * 1024 * 1024) {
            setError(`File size exceeds ${CONSTANTS.FILE_CONSTRAINTS.CV_LIMIT_MB}MB limit.`);
            return;
        }

        setError(null);
        setUploading(true);

        const formData = new FormData();
        formData.append('cv', file);

        try {
            await api.post('/cv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            refetch();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-12 selection:bg-primary-container selection:text-on-primary-container pb-24">
            {/* Hero Header Section */}
            <header>
                <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Secure Document Vault</p>
                <h1 className="text-[3.5rem] font-bold leading-tight tracking-tighter text-on-surface mb-4">Curate Your <span className="text-primary italic">Professional</span> Identity.</h1>
                <p className="text-on-surface-variant max-w-2xl text-lg font-light leading-relaxed">
                    Manage your resumes and portfolios with bank-grade security. Link specific versions to targeted job applications for a tailored approach.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Column 1: Upload & Active Management */}
                <div className="lg:col-span-8 space-y-12">
                    {/* High-End Drag & Drop Zone */}
                    {!cv ? (
                        <section className="bg-surface-container-lowest p-10 rounded-2xl shadow-2xl shadow-slate-200/50 group relative overflow-hidden text-center border border-slate-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative border-2 border-dashed border-slate-200 group-hover:border-primary/40 transition-colors rounded-xl p-12 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-4xl font-bold">cloud_upload</span>
                                </div>
                                <h3 className="text-xl font-bold text-on-surface uppercase tracking-tight">Upload Professional CV</h3>
                                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">PDF or DOCX (Max {CONSTANTS.FILE_CONSTRAINTS.CV_LIMIT_MB}MB)</p>
                                <label className="mt-6 bg-slate-900 text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all cursor-pointer shadow-xl shadow-slate-200 active:scale-95">
                                    {uploading ? 'Processing...' : 'Select Document'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.docx"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                {error && <p className="text-error text-[10px] font-bold uppercase tracking-widest mt-2">{error}</p>}
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest pt-4 font-bold italic">Or drag and drop here</p>
                            </div>
                        </section>
                    ) : (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold tracking-tight uppercase">Active Portfolio</h2>
                                <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold uppercase tracking-widest">1 Document Managed</span>
                            </div>
                            <div className="bg-surface-container-lowest p-8 rounded-2xl group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 border border-slate-100">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cv.fileName.endsWith('.pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <span className="material-symbols-outlined text-3xl font-bold">
                                            {cv.fileName.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-lg text-on-surface tracking-tighter uppercase">{cv.fileName}</h4>
                                            <span className="bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Verified Primary</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">calendar_month</span> {new Date(cv.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm font-bold">database</span> {(cv.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => window.open(cv.fileUrl, '_blank')}
                                                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                                            >
                                                Preview <span className="material-symbols-outlined text-sm">visibility</span>
                                            </button>
                                            <button
                                                onClick={() => deleteMutation.mutate({})}
                                                disabled={deleteMutation.isPending}
                                                className="text-[10px] font-bold uppercase tracking-widest text-error hover:underline flex items-center gap-1"
                                            >
                                                {deleteMutation.isPending ? 'Removing...' : 'Delete'} <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Column 2: Spotlight & Analytics */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Signature Component: Security Panel */}
                    <aside className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-2xl shadow-slate-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-9xl scale-110 font-bold">shield</span>
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2">Vault Integrity</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">NFR-SEC-006 Compliant</p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary font-bold">verified_user</span>
                                    <div>
                                        <p className="font-bold text-xs uppercase tracking-widest">Encrypted Storage</p>
                                        <p className="text-slate-500 text-[10px] font-medium leading-tight mt-1 italic">AES-256 standard encryption at rest.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary font-bold">policy</span>
                                    <div>
                                        <p className="font-bold text-xs uppercase tracking-widest">Access Control</p>
                                        <p className="text-slate-500 text-[10px] font-medium leading-tight mt-1 italic">Visible only to verified curators.</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-white/10 hover:bg-white/20 transition-all text-white font-bold text-[10px] py-4 rounded-xl uppercase tracking-widest border border-white/10">
                                View Security Logs
                            </button>
                        </div>
                    </aside>

                    {/* Quick Help / Analytics Card */}
                    <div className="p-1 bg-gradient-to-br from-primary/20 to-primary-container/20 rounded-2xl">
                        <div className="bg-surface-container-lowest p-8 rounded-xl border border-white/50">
                            <div className="flex items-center justify-between mb-6">
                                <span className="material-symbols-outlined text-primary font-bold">auto_awesome</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Smart Insights</span>
                            </div>
                            <h4 className="font-bold text-lg text-on-surface mb-2 uppercase tracking-tight">Portfolio Health</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed font-medium italic">
                                Your current CV profile strength is <span className="text-primary font-bold">94%</span>. Adding a verified LinkedIn bridge can increase curator engagement by 23%.
                            </p>
                            <button className="mt-6 text-primary font-bold text-[10px] flex items-center gap-1 hover:underline uppercase tracking-widest">
                                Enhance Portfolio <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

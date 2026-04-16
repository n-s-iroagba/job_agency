'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import api from '@/lib/api';

interface Cv {
    id: number;
    fileName?: string;
    fileUrl: string;
    fileSize?: number;
    createdAt?: string;
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

        try {
            // Simulator: In a production environment, this would be a client-side upload to S3/Cloudinary
            // Returning a secure URL for the backend to persist in the audit trail.
            const mockUrl = `https://storage.googleapis.com/job-agency-cvs/cv_${Date.now()}.pdf`;
            
            await api.post('/cv', {
                cvUrl: mockUrl,
                fileType: file.type,
                fileSizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(2))
            });
            refetch();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Documents...</div>;

    return (
        <div className="font-sans text-slate-900 pb-24">
            <header className="mb-12">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Documents</span>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CV / Resume Management</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {!cv ? (
                        <section className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6">
                                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Your CV</h3>
                            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
                                Please upload your resume in PDF or DOCX format. This document will be accessible to job curators during the application review process.
                            </p>
                            <label className="bg-slate-900 text-white px-8 py-3.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-900/10 active:scale-95">
                                {uploading ? 'Uploading...' : 'Select Document'}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.docx"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                            {error && <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mt-6">{error}</p>}
                        </section>
                    ) : (
                        <section className="space-y-4">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Current Active Document</h2>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl">
                                            {cv.fileName?.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-lg text-slate-900 truncate max-w-[300px]">{cv.fileName || 'Document.pdf'}</h4>
                                        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            <span>{cv.fileSize ? (cv.fileSize / 1024 / 1024).toFixed(2) : '0.00'} MB</span>
                                            <span>•</span>
                                            <span>Uploaded {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : 'Unknown Date'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => window.open(cv.fileUrl, '_blank')}
                                        className="bg-slate-50 text-slate-900 border border-slate-200 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate({})}
                                        disabled={deleteMutation.isPending}
                                        className="text-[9px] font-bold text-red-600 uppercase tracking-widest hover:underline px-4"
                                    >
                                        {deleteMutation.isPending ? 'Removing...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                        Note: You can only maintain one primary CV in your vault. Uploading a new document will replace the existing one.
                    </div>
                </div>

                <aside className="space-y-8">
                    <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-6">Security & Privacy</span>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-slate-400">lock</span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Encrypted Access</p>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">Documents are encrypted at rest and only accessible via authorized tokens.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-slate-400">visibility_off</span>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Restricted View</p>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">Only verified recruiters assigned to your application can view this document.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

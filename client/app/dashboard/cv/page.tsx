'use client';

import React, { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { CONSTANTS } from '@/constants';
import {
    FileText,
    Upload,
    Trash2,
    Download,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
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

        // REG-004, STK-APP-CV-001 Validation
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
        <div className="space-y-xl max-w-4xl mx-auto">
            <header>
                <h1>CV Management</h1>
                <p className="text-text-secondary mt-1">Manage your professional resume for job applications (REG-004, STK-APP-CV-001)</p>
            </header>

            {isLoading ? (
                <div className="card h-48 animate-pulse bg-slate-50" />
            ) : cv ? (
                <div className="card space-y-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-md">
                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-md flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{cv.fileName}</h3>
                                <p className="text-xs text-text-secondary">
                                    {(cv.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded on {new Date(cv.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-sm">
                            <a
                                href={cv.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Download
                            </a>
                            <button
                                onClick={() => deleteMutation.mutate({})}
                                disabled={deleteMutation.isPending}
                                className="flex items-center gap-2 px-3 py-2 border border-danger text-danger rounded-md text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-md p-md flex items-center gap-md text-success text-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p>Your CV is verified and ready for applications. You can update it by deleting the current one first.</p>
                    </div>
                </div>
            ) : (
                <div className="card border-dashed border-2 py-16 flex flex-col items-center gap-md bg-slate-50/50">
                    <div className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center text-text-secondary shadow-sm">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <h3 className="mb-1">Upload Your CV</h3>
                        <p className="text-sm text-text-secondary max-w-xs">
                            Format: PDF or DOCX (Max {CONSTANTS.FILE_CONSTRAINTS.CV_LIMIT_MB}MB).
                            Ensure your contact information is up to date.
                        </p>
                    </div>

                    <label className="btn-primary cursor-pointer mt-md">
                        {uploading ? 'Uploading...' : 'Choose File'}
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>

                    {error && (
                        <div className="flex items-center gap-2 text-danger text-xs mt-md">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                </div>
            )}

            <section className="card space-y-md bg-blue-50/30 border-blue-100">
                <h4 className="font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" /> Why upload a CV?
                </h4>
                <ul className="text-sm text-text-secondary space-y-2 ml-6 list-disc">
                    <li>Required for all active job applications.</li>
                    <li>Allows recruiters to find you via talent matching.</li>
                    <li>Secure storage per NFR-SEC-006 and GDPR standards.</li>
                </ul>
            </section>
        </div>
    );
}

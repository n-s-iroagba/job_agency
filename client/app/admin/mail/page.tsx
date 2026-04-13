'use client';

import React, { useState, useEffect } from 'react';
import { useApiMutation } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import {
    Send,
    Paperclip,
    Search,
    User,
    Mail as MailIcon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';

export default function MailComposerPage() {
    const searchParams = useSearchParams();
    const [to, setTo] = useState(searchParams.get('to') || '');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!to || !subject || !body) return;

        setSending(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post('/admin/mail', { email: to, subject, message: body });
            setSuccess(true);
            setSubject('');
            setBody('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send email.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-xl">
            <header>
                <h1>Internal Mail Composer</h1>
                <p className="text-text-secondary mt-1">Direct communication with applicants (STK-ADM-APP-003..004)</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                <div className="md:col-span-2 card space-y-lg">
                    {success && (
                        <div className="bg-green-50 border border-green-100 p-md rounded-md flex items-center gap-3 text-success text-sm font-medium">
                            <CheckCircle2 className="w-5 h-5" /> Email sent successfully to {to}.
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-md rounded-md flex items-center gap-3 text-danger text-sm font-medium">
                            <AlertCircle className="w-5 h-5" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="space-y-lg">
                        <div className="space-y-md">
                            <div>
                                <label className="label">Recipient Email</label>
                                <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        className="input pl-10"
                                        placeholder="applicant@example.com"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Subject Line</label>
                                <input
                                    className="input"
                                    placeholder="Update regarding your application..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Message Body</label>
                                <textarea
                                    className="input min-h-[200px] leading-relaxed"
                                    placeholder="Write your professional message here..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-border">
                            <button type="button" className="p-2 hover:bg-slate-100 rounded text-text-secondary" title="Attach Files (Logic pending)">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button
                                type="submit"
                                disabled={sending}
                                className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-xl">
                    <section className="card bg-slate-50/50 space-y-md">
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-secondary">
                            <User className="w-4 h-4" /> Quick Templates
                        </h4>
                        <div className="space-y-sm">
                            <button
                                onClick={() => { setSubject('Interview Schedule'); setBody('Dear Applicant,\n\nWe would like to invite you for an interview...') }}
                                className="w-full text-left text-xs p-2 hover:bg-white border border-transparent hover:border-border rounded transition-colors"
                            >
                                📅 Interview Invitation
                            </button>
                            <button
                                onClick={() => { setSubject('Status Update'); setBody('Dear Applicant,\n\nYour application status has been updated. Please check your dashboard.') }}
                                className="w-full text-left text-xs p-2 hover:bg-white border border-transparent hover:border-border rounded transition-colors"
                            >
                                ℹ️ Status Update
                            </button>
                            <button
                                onClick={() => { setSubject('Payment Proof Verification Error'); setBody('Dear Applicant,\n\nThe payment proof you uploaded was unclear. Please re-upload a high-quality screenshot.') }}
                                className="w-full text-left text-xs p-2 hover:bg-white border border-transparent hover:border-border rounded transition-colors"
                            >
                                ⚠️ Payment Rejection
                            </button>
                        </div>
                    </section>

                    <p className="text-[10px] text-text-secondary text-center px-lg">
                        Notice: All outgoing mail is logged in the system audit trail for compliance.
                        Dual-channel notification (Email + Push) is enabled (TRUST-008).
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, Suspense } from 'react';
import { useApiMutation, useApiQuery } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function MailComposerContent() {
    const searchParams = useSearchParams();
    const [to, setTo] = useState(searchParams.get('to') || '');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync: sendMail, isPending: sending } = useApiMutation<{ email: string, subject: string, message: string }, any>('post', '/admin/mail');

    // Disable activity query as backend doesn't support it yet
    const recentActivity: any[] = [];
    // const { data: recentActivity = [] } = useApiQuery<any[]>(['admin', 'mail-activity'], '/admin/mail/activity');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!to || !subject || !body) return;

        setError(null);
        setSuccess(false);

        try {
            await sendMail({ email: to, subject, message: body });
            setSuccess(true);
            setSubject('');
            setBody('');
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send email.');
            console.error(err);
        }
    };

    const applyTemplate = (tmplSubject: string, tmplBody: string) => {
        setSubject(tmplSubject);
        setBody(tmplBody);
    };

    return (
        <div className="font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-900 tracking-tight">Mail Composer</h1>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Communicate with applicants and segments</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-[11px] font-bold uppercase tracking-widest">
                    Message sent successfully to {to}
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold uppercase tracking-widest">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSend} className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">Recipients</label>
                            <input
                                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium focus:bg-white outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
                                placeholder="applicant@example.com..."
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">Subject</label>
                            <input
                                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium focus:bg-white outline-none focus:ring-2 focus:ring-blue-900/5 transition-all"
                                placeholder="Message subject..."
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">Message Body</label>
                            <textarea
                                className="w-full px-4 py-4 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium focus:bg-white outline-none focus:ring-2 focus:ring-blue-900/5 transition-all min-h-[300px] resize-none leading-relaxed"
                                placeholder="Write your message here..."
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={sending}
                                className="bg-blue-900 text-white px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 pb-3 border-b border-blue-50">Quick Templates</h3>
                        <div className="space-y-2">
                            {[
                                { title: 'Interview Invite', subject: 'Next Steps: Interview Scheduling', body: 'Dear Applicant,\n\nWe\'d love to schedule a time to speak with you regarding your application. Please follow the link below to select a time slot.' },
                                { title: 'Action Required', subject: 'Important: Action Required for Application', body: 'Dear Applicant,\n\nWe are reviewing your profile but need some additional information before proceeding. Please log in to complete the pending requirements.' },
                                { title: 'Payment Update', subject: 'Payment Verification Update', body: 'Dear Applicant,\n\nYour recent payment proof submission has been reviewed. See your dashboard for the detailed status.' }
                            ].map((tmpl, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => applyTemplate(tmpl.subject, tmpl.body)}
                                    className="w-full text-left p-4 rounded-xl border border-blue-100 hover:border-blue-900 hover:bg-blue-50 transition-all group"
                                >
                                    <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">{tmpl.title}</p>
                                    <p className="text-[10px] text-blue-400 line-clamp-1 mt-1 font-medium">{tmpl.subject}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                        <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4 pb-3 border-b border-blue-50">Recent Communication</h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">
                                        <span className="material-symbols-outlined text-base">mail</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-tight leading-tight">{activity.title}</span>
                                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">{activity.desc}</span>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && <p className="text-[9px] font-bold text-blue-300 uppercase tracking-widest text-center">No recent activity</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function MailComposerPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Loading Mail System...</div>}>
            <MailComposerContent />
        </Suspense>
    );
}

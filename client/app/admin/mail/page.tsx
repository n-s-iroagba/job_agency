'use client';

import React, { useState } from 'react';
import { useApiMutation, useApiQuery } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';

export default function MailComposerPage() {
    const searchParams = useSearchParams();
    const [to, setTo] = useState(searchParams.get('to') || '');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync: sendMail, isPending: sending } = useApiMutation<{ email: string, subject: string, message: string }, any>('post', '/admin/mail');

    const { data: recentActivity = [] } = useApiQuery<any[]>(['admin', 'mail-activity'], '/admin/mail/activity');

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
        }
    };

    const applyTemplate = (tmplSubject: string, tmplBody: string) => {
        setSubject(tmplSubject);
        setBody(tmplBody);
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16">
            {/* TopNavBar */}
            <header className="flex justify-between items-center w-full px-8 h-16 z-40 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 border-b border-surface-container-high/50">
                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Communication</span>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="text-primary">Mail Composer</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-MAIL-001</p>
                </div>
            </header>

            {/* Composition Canvas */}
            <div className="flex-1 overflow-y-auto px-6 py-10 md:px-10 lg:px-12 bg-surface">
                <div className="max-w-[1400px] mx-auto space-y-8">

                    {/* Page Title */}
                    <div className="mb-10">
                        <h1 className="text-[2.5rem] md:text-[3.5rem] font-black text-on-surface leading-tight tracking-tighter uppercase italic">
                            Compose Message
                        </h1>
                        <p className="text-on-surface-variant text-lg font-light max-w-[672px] mt-2">
                            Draft a personalized message to selected candidates or broadcast an update to a specific segment.
                        </p>
                    </div>

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-700 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            Message sent successfully to {to}.
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-error text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    {/* Composer Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
                        <form onSubmit={handleSend}>
                            {/* Header Actions */}
                            <div className="px-8 py-5 bg-slate-50/80 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary font-bold">edit_note</span>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-600">New Message Draft</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Dual Delivery (Push + Email)</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Input Grid (Asymmetric) */}
                            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left Column: Fields */}
                                <div className="lg:col-span-8 space-y-8">

                                    {/* Recipient Selection */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Recipients</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">person</span>
                                            <input
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-inner"
                                                placeholder="applicant@example.com, candidate2@example.com..."
                                                type="text"
                                                value={to}
                                                onChange={(e) => setTo(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Subject line */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Subject Line</label>
                                        <input
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-inner placeholder-slate-300"
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Action Required: Interview Invitation"
                                            required
                                        />
                                    </div>

                                    {/* Editor Toolbar & Body */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Message Body</label>
                                        <div className="border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-inner bg-slate-50/50">
                                            <div className="bg-white flex items-center justify-between p-3 border-b border-slate-100">
                                                <div className="flex items-center gap-1">
                                                    <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                                                        <span className="material-symbols-outlined text-[18px]">format_bold</span>
                                                    </button>
                                                    <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                                                        <span className="material-symbols-outlined text-[18px]">format_italic</span>
                                                    </button>
                                                    <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                                                        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                                                    </button>
                                                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                                                    <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700">
                                                        <span className="material-symbols-outlined text-[18px]">link</span>
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1.5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20">Variables</button>
                                                </div>
                                            </div>
                                            <textarea
                                                className="w-full bg-transparent border-none p-6 text-sm text-on-surface leading-relaxed focus:ring-0 resize-none font-medium min-h-[300px]"
                                                placeholder="Dear {{candidate_name}},&#10;&#10;Write your professional message here..."
                                                value={body}
                                                onChange={(e) => setBody(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column: Sidebar / Context */}
                                <div className="lg:col-span-4 space-y-8">

                                    {/* Template Selector */}
                                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 mb-6">
                                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                            Smart Templates
                                        </h3>
                                        <div className="space-y-3 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => applyTemplate('Next Steps: Interview Scheduling', 'Dear Applicant,\n\nWe\'d love to schedule a time to speak with you regarding your application. Please follow the link below to select a time slot.')}
                                                className="w-full text-left p-4 rounded-xl bg-white border border-slate-100 hover:border-primary hover:shadow-md transition-all group"
                                            >
                                                <p className="text-[10px] font-black text-on-surface uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Interview Invite</p>
                                                <p className="text-xs text-slate-400 line-clamp-1 italic font-medium">"We'd love to schedule a time..."</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyTemplate('Important: Action Required for Application', 'Dear Applicant,\n\nWe are reviewing your profile but need some additional information before proceeding. Please log in to complete the pending requirements.')}
                                                className="w-full text-left p-4 rounded-xl bg-white border border-slate-100 hover:border-primary hover:shadow-md transition-all group"
                                            >
                                                <p className="text-[10px] font-black text-on-surface uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Action Required</p>
                                                <p className="text-xs text-slate-400 line-clamp-1 italic font-medium">"We are reviewing your profile but..."</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyTemplate('Payment Verification Update', 'Dear Applicant,\n\nYour recent payment proof submission has been reviewed. See your dashboard for the detailed status.')}
                                                className="w-full text-left p-4 rounded-xl bg-white border border-slate-100 hover:border-primary hover:shadow-md transition-all group"
                                            >
                                                <p className="text-[10px] font-black text-on-surface uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Payment Update</p>
                                                <p className="text-xs text-slate-400 line-clamp-1 italic font-medium">"Your recent payment proof..."</p>
                                            </button>
                                        </div>
                                        <button type="button" className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all">Manage Templates</button>
                                    </div>

                                    {/* Preview Panel */}
                                    <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 hidden md:block">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-6">
                                            <span className="material-symbols-outlined text-primary">visibility</span>
                                            Mobile App Preview
                                        </h3>
                                        <div className="w-48 mx-auto aspect-[9/16] bg-slate-900 rounded-[2.5rem] p-2 border-4 border-slate-800 shadow-2xl overflow-hidden relative">
                                            <div className="w-full h-full bg-white rounded-[2rem] p-4 flex flex-col relative overflow-hidden">
                                                {/* Header Mock */}
                                                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4"></div>

                                                {/* Mock Push Notif overlayed if title exists */}
                                                <div className={`transition-all duration-500 absolute top-4 left-2 right-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl shadow-lg z-10 ${subject ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                                                        <span className="font-black text-[8px] uppercase tracking-widest text-slate-600">CareerCurator</span>
                                                    </div>
                                                    <p className="font-bold text-[9px] text-slate-800 line-clamp-2 leading-tight">{subject || 'New Message'}</p>
                                                </div>

                                                <div className="mt-auto space-y-2 pb-4 opacity-30">
                                                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                                                    <div className="h-2 w-4/6 bg-slate-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-center mt-6 text-blue-600 uppercase tracking-[0.2em] font-black">Live UX Rendering</p>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Action Bar */}
                            <div className="px-8 md:px-10 py-6 bg-slate-50/80 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-4">
                                <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
                                    <button type="button" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">attach_file</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">Attach</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button type="button" className="flex-1 md:flex-none px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all shadow-inner">
                                        Save Draft
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="flex-1 md:flex-none px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-primary shadow-xl shadow-primary/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{sending ? 'sync' : 'send'}</span>
                                        {sending ? 'Sending...' : 'Transmit Now'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* History / Recent Messages (Editorial Asymmetry) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                        <div className="p-10 bg-white rounded-[3rem] shadow-xl shadow-slate-100/50 border border-slate-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
                                <span className="material-symbols-outlined text-[120px]">history</span>
                            </div>
                            <h3 className="text-xl font-black italic tracking-tight text-on-surface mb-8 uppercase">Recent Activity</h3>
                            <ul className="space-y-4 relative z-10">
                                {recentActivity.map((activity) => (
                                    <li key={activity.id} className="flex items-center gap-5 p-5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-primary/30 transition-colors">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${activity.type === 'broadcast' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            <span className="material-symbols-outlined font-bold">{activity.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-on-surface uppercase tracking-tight">{activity.title}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{activity.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 block">System Pulse</span>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 shadow-sm text-emerald-400">High Engagement</h3>
                                <p className="text-slate-400 text-xs font-semibold leading-relaxed tracking-widest max-w-[384px]">94% of applicant messages sent today have been read within 30 minutes of push delivery.</p>
                            </div>
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between pt-12 gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                            <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black z-10">+12</div>
                                </div>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-colors group/btn">
                                    View Analytics
                                    <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                            <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                                <span className="material-symbols-outlined text-[300px]">monitoring</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminApplicantDetailPage() {
    const { id } = useParams();
    const { data: userData, isLoading } = useApiQuery<any>(['admin', 'applicants', id], `/admin/users/${id}`);
    const user = userData?.user;

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Retrieving Talent Dossier...</div>;
    if (!user) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-red-500">Applicant Node Not Found</div>;

    const DataItem = ({ label, value }: { label: string, value: string | null | undefined }) => (
        <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">{label}</span>
            <p className="text-sm font-bold text-blue-900">{value || 'Not Disclosed'}</p>
        </div>
    );

    return (
        <div className="font-sans antialiased text-blue-900 pb-24 max-w-6xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/admin/applicants" className="p-2 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-900 hover:text-white transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                        </Link>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Personnel Profile</span>
                    </div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-blue-900">{user.fullName}</h1>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Registry ID: {user.id} · {user.email}</p>
                </div>
                
                <div className="flex gap-3">
                    <Link
                        href={`/admin/mail?to=${user.email}`}
                        className="bg-blue-900 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">mail</span>
                        Direct Message
                    </Link>
                    {user.cvUrl && (
                        <a
                            href={user.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border-2 border-blue-900 text-blue-900 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">description</span>
                            View Document (CV)
                        </a>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Identity Summary Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-900/5 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-3xl bg-blue-900 flex items-center justify-center text-white text-4xl font-black italic shadow-2xl shadow-blue-900/20 mb-6">
                            {user.fullName.charAt(0)}
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-blue-900 text-center">{user.fullName}</h2>
                        <span className="mt-2 px-3 py-1 bg-blue-50 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest">TALENT STATUS: VERIFIED</span>
                        
                        <div className="w-full mt-10 pt-10 border-t border-blue-50 grid grid-cols-1 gap-6">
                            <DataItem label="Electronic Mail" value={user.email} />
                            <DataItem label="Primary Phone" value={user.phoneNumber} />
                        </div>
                    </div>

                    <div className="bg-blue-900 p-10 rounded-[2.5rem] text-white space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Compliance Warning</h3>
                        <p className="text-[11px] font-bold text-blue-100 leading-relaxed uppercase">Internal access restricted. All profile viewing is logged for security audits. Unauthorized extraction of talent data is strictly prohibited.</p>
                    </div>
                </div>

                {/* Extended Biodata */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Identity Details */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-900/5">
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-blue-50">
                            <span className="material-symbols-outlined text-blue-900">badge</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900">Personnel Biodata</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                            <DataItem label="Nationality" value={user.nationality} />
                            <DataItem label="Gender" value={user.gender} />
                            <DataItem label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'} />
                        </div>
                    </div>

                    {/* Residential Details */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-900/5">
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-blue-50">
                            <span className="material-symbols-outlined text-blue-900">location_on</span>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900">Location & Residence</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                            <div className="col-span-2">
                                <DataItem label="Principal Residence Address" value={user.address} />
                            </div>
                            <DataItem label="City" value={user.city} />
                            <DataItem label="State / Province" value={user.state} />
                            <DataItem label="Country" value={user.country} />
                            <DataItem label="Postal Code" value={user.zipCode} />
                        </div>
                    </div>

                    {/* Document Management */}
                    {!user.cvUrl && (
                        <div className="p-10 rounded-[2.5rem] bg-amber-50 border-2 border-dashed border-amber-200 text-center">
                            <span className="material-symbols-outlined text-amber-500 mb-2">warning</span>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Missing Documentation</h3>
                            <p className="text-[11px] font-bold text-amber-600 mt-1 uppercase">No curriculum vitae has been synchronized with this profile.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

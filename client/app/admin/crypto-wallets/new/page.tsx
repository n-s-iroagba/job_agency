'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CryptoWalletFormPage() {
    const router = useRouter();
    const [label, setLabel] = useState('');
    const [cryptoType, setCryptoType] = useState('ETH');
    const [network, setNetwork] = useState('ERC20');
    const [address, setAddress] = useState('');
    const [isActive, setIsActive] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Placeholder save action
            router.push('/admin/crypto-wallets');
        } catch (err) {
            alert('Failed to save wallet');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-surface selection:bg-primary/10 selection:text-primary pb-16 overflow-x-hidden">
            {/* TopAppBar */}
            <header className="sticky top-0 z-40 h-20 flex justify-between items-center px-8 bg-white/70 backdrop-blur-xl border-b border-surface-container-high/50 shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black tracking-tight uppercase italic text-slate-900">CareerCurator</h2>
                    <nav className="flex gap-2 mt-1 hidden md:flex items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System</span>
                        <span className="text-[10px] text-slate-300">/</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Finance</span>
                        <span className="text-[10px] text-slate-300">/</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Wallet Management</span>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hidden md:block">SCR-ADM-CRYPTOFORM-001</p>
                </div>
            </header>

            {/* Form Content */}
            <main className="flex-1 w-full pt-12 pb-20 px-6 md:px-12 max-w-[896px] mx-auto">
                <form onSubmit={handleSubmit}>
                    {/* Breadcrumb for Traceability */}
                    <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">STK-ADM-CRYPTO-001</span>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <Link href="/admin/crypto-wallets" className="w-full sm:w-auto">
                                <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all border border-slate-200 bg-white shadow-sm" type="button">
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                    Discard
                                </button>
                            </Link>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" type="submit">
                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Header Section */}
                        <section>
                            <h3 className="text-[3.5rem] font-black text-on-surface tracking-tighter leading-none mb-4 italic uppercase">Configure <span className="text-primary">Digital Asset</span></h3>
                            <p className="text-on-surface-variant max-w-[576px] leading-relaxed font-medium text-lg">Manage your agency's cryptocurrency settlement addresses. Ensure the network and wallet type match the destination provider to avoid permanent loss of funds.</p>
                        </section>

                        {/* Form Container */}
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 space-y-10 border border-slate-50 relative overflow-hidden">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-10 relative z-10">

                                {/* Display Label */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Label</label>
                                    <input
                                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none shadow-inner"
                                        placeholder="e.g. Primary Company Reserves"
                                        type="text"
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        required
                                    />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Internal name for easy identification within the agency portal.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Crypto Type */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cryptocurrency Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 appearance-none font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none cursor-pointer shadow-inner"
                                                value={cryptoType}
                                                onChange={(e) => setCryptoType(e.target.value)}
                                            >
                                                <option value="BTC">Bitcoin (BTC)</option>
                                                <option value="ETH">Ethereum (ETH)</option>
                                                <option value="USDT">Tether (USDT)</option>
                                                <option value="USDC">USD Coin (USDC)</option>
                                                <option value="SOL">Solana (SOL)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>

                                    {/* Network */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network</label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 appearance-none font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none cursor-pointer shadow-inner"
                                                value={network}
                                                onChange={(e) => setNetwork(e.target.value)}
                                            >
                                                <option value="ERC20">Ethereum (ERC20)</option>
                                                <option value="BEP20">BNB Smart Chain (BEP20)</option>
                                                <option value="TRC20">Tron (TRC20)</option>
                                                <option value="POLYGON">Polygon Network</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet Address */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Wallet Address</label>
                                    <div className="relative">
                                        <input
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-6 pr-16 font-mono font-medium text-[11px] tracking-widest text-slate-600 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none shadow-inner"
                                            placeholder="0x..."
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 px-2 bg-emerald-50 w-fit py-2 rounded-xl border border-emerald-100">
                                        <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
                                        <span className="text-[9px] text-emerald-700 font-black uppercase tracking-[0.2em]">Verified for TRC-20 and ERC-20 standards.</span>
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner mt-4">
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary border border-blue-500 text-white shadow-lg shadow-primary/30' : 'bg-slate-200 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-[24px]">power_settings_new</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-1">Wallet Active State</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toggle visibility and usage for payouts.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            className="sr-only peer"
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={() => setIsActive(!isActive)}
                                        />
                                        <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Abstract Graphic */}
                            <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
                        </div>

                        {/* Guidance Footer */}
                        <div className="flex items-start gap-4 p-8 bg-blue-50 border border-blue-100 rounded-[2rem] shadow-inner">
                            <div className="bg-white p-2 rounded-xl text-primary shadow-sm border border-blue-100">
                                <span className="material-symbols-outlined text-[20px]">info</span>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Traceability Reference</h5>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">This form is governed by security policy <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px]">STK-ADM-CRYPTO-002</span>. Every modification is logged with a timestamp and administrator signature to maintain financial transparency and compliance audit trails.</p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}

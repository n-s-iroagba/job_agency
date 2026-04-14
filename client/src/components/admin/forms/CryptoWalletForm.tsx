'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/lib/hooks';
import Link from 'next/link';
import { CryptoWallet } from '@/types/models';

interface CryptoWalletFormProps {
    initialData?: CryptoWallet;
    isEdit?: boolean;
}

export default function CryptoWalletForm({ initialData, isEdit = false }: CryptoWalletFormProps) {
    const router = useRouter();
    const [label, setLabel] = useState(initialData?.displayLabel || '');
    const [cryptoType, setCryptoType] = useState(initialData?.currencyName || 'ETH');
    const [network, setNetwork] = useState(initialData?.networkType || 'ERC20');
    const [address, setAddress] = useState(initialData?.walletAddress || '');
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    useEffect(() => {
        if (initialData) {
            setLabel(initialData.displayLabel || '');
            setCryptoType(initialData.currencyName);
            setNetwork(initialData.networkType);
            setAddress(initialData.walletAddress);
            setIsActive(initialData.isActive);
        }
    }, [initialData]);

    const mutation = useApiMutation(
        isEdit ? 'put' : 'post',
        isEdit ? `/admin/crypto-wallets/${initialData?.id}` : '/admin/crypto-wallets',
        {
            onSuccess: () => {
                router.push('/admin/crypto-wallets');
                router.refresh();
            }
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutation.mutateAsync({
                displayLabel: label,
                currencyName: cryptoType,
                networkType: network,
                walletAddress: address,
                isActive
            });
        } catch (err) {
            alert(`Failed to ${isEdit ? 'update' : 'create'} wallet`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" type="submit" disabled={mutation.isPending}>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                        {mutation.isPending ? 'Saving...' : 'Save Wallet'}
                    </button>
                </div>
            </div>

            <div className="space-y-10">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 space-y-10 border border-slate-50 relative overflow-hidden">
                    <div className="grid grid-cols-1 gap-10 relative z-10">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Public Wallet Address</label>
                            <input
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-mono font-medium text-[11px] tracking-widest text-slate-600 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none shadow-inner"
                                placeholder="0x..."
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner mt-4">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-1">Wallet Active State</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toggle visibility for payouts.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    className="sr-only peer"
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => setIsActive(!isActive)}
                                />
                                <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:start-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-8 bg-blue-50 border border-blue-100 rounded-[2rem] shadow-inner">
                    <div className="bg-white p-2 rounded-xl text-primary shadow-sm border border-blue-100">
                        <span className="material-symbols-outlined text-[20px]">info</span>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Traceability Reference</h5>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed uppercase tracking-wide">Financial modifications are logged for audit compliance: STK-ADM-CRYPTO-002</p>
                    </div>
                </div>
            </div>
        </form>
    );
}

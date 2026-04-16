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
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="font-sans">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {isEdit ? 'Edit Wallet' : 'New Crypto Wallet'}
                </h1>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link href="/admin/crypto-wallets" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all px-4 py-3">
                        Cancel
                    </Link>
                    <button className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50" type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Save Wallet'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-100 space-y-8">
                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Display Label</label>
                    <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none"
                        placeholder="e.g. Primary Wallet"
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Currency</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none appearance-none"
                            value={cryptoType}
                            onChange={(e) => setCryptoType(e.target.value)}
                        >
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="USDT">Tether (USDT)</option>
                            <option value="USDC">USD Coin (USDC)</option>
                            <option value="SOL">Solana (SOL)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Network</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none appearance-none"
                            value={network}
                            onChange={(e) => setNetwork(e.target.value)}
                        >
                            <option value="ERC20">Ethereum (ERC20)</option>
                            <option value="BEP20">BNB Chain (BEP20)</option>
                            <option value="TRC20">Tron (TRC20)</option>
                            <option value="POLYGON">Polygon Network</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Wallet Address</label>
                    <input
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none"
                        placeholder="0x..."
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Active Status</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Enable for public transactions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            className="sr-only peer"
                            type="checkbox"
                            checked={isActive}
                            onChange={() => setIsActive(!isActive)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-slate-900 transition-all after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>
            </div>
        </form>
    );
}

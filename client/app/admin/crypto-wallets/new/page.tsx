'use client';

import Link from 'next/link';
import CryptoWalletForm from '@/components/admin/forms/CryptoWalletForm';

export default function CryptoWalletNewPage() {
    return (
        <div className="font-sans">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/admin/crypto-wallets" className="text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Finance / Crypto Wallets / New</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Wallet</h1>
            </div>

            <CryptoWalletForm />
        </div>
    );
}

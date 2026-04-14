'use client';

import { CONSTANTS } from '@/constants';
import Link from 'next/link';

export function PublicFooter() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-4 sm:px-8 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <div className="space-y-4">
                    <span className="font-bold text-slate-900 dark:text-white text-xl">JobNexa</span>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                        © 2024 JobNexa. Precision in Professional Placement.
                    </p>
                    <div className="flex gap-4">
                        <a className="text-slate-400 hover:text-blue-600 transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                        <a className="text-slate-400 hover:text-blue-600 transition-colors" href="#"><span className="material-symbols-outlined">chat</span></a>
                        <a className="text-slate-400 hover:text-blue-600 transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
                    </div>
                </div>
                <div>
                    <h6 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Contact</h6>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                        <li>support@JobNexa.com</li>
                        <li>+1 (555) 000-8888</li>
                        <li>Global HQ, New York</li>
                    </ul>
                </div>
                <div>
                    <h6 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Legal</h6>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
                        <li><Link href={CONSTANTS.ROUTES.PRIVACY} className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h6 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Subscribe</h6>
                    <p className="text-[10px] text-slate-500 mb-4">Get curated job alerts directly.</p>
                    <div className="flex">
                        <input className="bg-white border border-outline-variant/30 rounded-l-lg text-xs w-full focus:ring-1 ring-primary px-3" placeholder="Email" type="text" />
                        <button className="bg-primary text-white px-3 py-2 rounded-r-lg"><span className="material-symbols-outlined text-sm">send</span></button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

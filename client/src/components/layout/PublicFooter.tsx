import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export function PublicFooter() {
    return (
        <footer className="bg-surface border-t border-border py-xl px-lg mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-xl">
                <div>
                    <h3 className="mb-md">{CONSTANTS.APP_NAME}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-lg">
                        Connecting top talent with premium global opportunities. Verified, secure, and transparent recruitment.
                    </p>
                    <div className="flex gap-md text-text-secondary">
                        {/* Placeholder for social icons */}
                        <div className="w-5 h-5 bg-slate-200 rounded-full" />
                        <div className="w-5 h-5 bg-slate-200 rounded-full" />
                        <div className="w-5 h-5 bg-slate-200 rounded-full" />
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-md">Quick Links</h4>
                    <ul className="space-y-sm text-sm text-text-secondary">
                        <li><Link href={CONSTANTS.ROUTES.HOME} className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link href={CONSTANTS.ROUTES.JOBS} className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                        <li><Link href={CONSTANTS.ROUTES.PRIVACY} className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-md">Contact Us</h4>
                    <ul className="space-y-sm text-sm text-text-secondary">
                        <li>📧 support@jobagency.com</li>
                        <li>📞 +1 (555) 123-4567</li>
                        <li>📍 123 Agency Plaza, Suite 100</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-xl pt-lg border-t border-border flex flex-col md:flex-row justify-between items-center gap-md text-xs text-text-secondary">
                <p>© 2026 {CONSTANTS.APP_NAME}. All rights reserved.</p>
                <div className="flex gap-lg">
                    <Link href={CONSTANTS.ROUTES.PRIVACY} className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <span>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}

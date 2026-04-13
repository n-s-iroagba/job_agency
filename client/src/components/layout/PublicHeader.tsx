import Link from 'next/link';
import { CONSTANTS } from '@/constants';

export function PublicHeader() {
    return (
        <header className="fixed top-0 z-50 w-full h-16 bg-surface border-b border-border px-lg flex items-center justify-between">
            <Link href={CONSTANTS.ROUTES.HOME} className="flex items-center gap-sm">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold">J</div>
                <span className="text-lg font-bold tracking-tight">{CONSTANTS.APP_NAME}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-lg text-sm font-medium text-text-secondary">
                <Link href={CONSTANTS.ROUTES.HOME} className="hover:text-primary transition-colors">Home</Link>
                <Link href={CONSTANTS.ROUTES.JOBS} className="hover:text-primary transition-colors">Jobs</Link>
                <Link href={CONSTANTS.ROUTES.PRIVACY} className="hover:text-primary transition-colors">Privacy Policy</Link>
            </nav>

            <div className="flex items-center gap-md">
                <Link href={CONSTANTS.ROUTES.LOGIN} className="text-sm font-medium hover:text-primary transition-colors">
                    Login
                </Link>
                <Link href={CONSTANTS.ROUTES.REGISTER} className="btn-primary">
                    Sign Up
                </Link>
            </div>
        </header>
    );
}

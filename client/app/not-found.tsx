'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-xl text-center">
            <h1 className="text-9xl font-bold text-slate-200">404</h1>
            <h2 className="text-2xl font-bold mt-md">Page Not Found</h2>
            <p className="text-text-secondary mt-sm max-w-sm mx-auto">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/" className="btn-primary mt-xl">
                Back to Safety
            </Link>
        </div>
    );
}

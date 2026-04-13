'use client';

import React from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { CONSTANTS } from '@/constants';

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1 pt-24 pb-xl px-lg max-w-4xl mx-auto w-full">
                <h1 className="mb-lg">Privacy Policy</h1>
                <div className="card p-xl space-y-lg text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-text-primary mb-md">1. Data Collection</h2>
                        <p>
                            Per REG-002, we collect only necessary information to facilitate your job application:
                            Full name, email address, CV documents, and payment proof screenshots.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-text-primary mb-md">2. Purpose of Processing</h2>
                        <p>
                            Your data is used solely for the recruitment processes you initiate.
                            We do not share your data with third parties except as required for visa coordination or employment verification.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-text-primary mb-md">3. Data Security</h2>
                        <p>
                            All CVs and payment proofs are stored in secure, encrypted storage (NFR-SEC-006).
                            Passwords are hashed using bcrypt (NFR-SEC-002).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-text-primary mb-md">4. Your Rights</h2>
                        <p>
                            You have the right to access your data and request deletion at any time (REG-004).
                            Deletion requests can be made via your profile settings when authenticated, or by contacting our support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-text-primary mb-md">5. Contact Info</h2>
                        <p>
                            For privacy concerns, contact: privacy@{CONSTANTS.APP_NAME.toLowerCase().replace(' ', '')}.com
                        </p>
                    </section>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}

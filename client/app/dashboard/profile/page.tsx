'use client'
import { useState, useEffect, Suspense } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/hooks';
import { useSearchParams, useRouter } from 'next/navigation';

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect');
    const { data, isLoading, refetch } = useApiQuery<any>(['auth', 'me'], '/auth/me');
    const [successMessage, setSuccessMessage] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
    });

    useEffect(() => {
        if (data?.user) {
            const user = data.user;
            setFormData({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                nationality: user.nationality || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                country: user.country || '',
                zipCode: user.zipCode || ''
            });
        }
    }, [data]);

    const updateProfileMutation = useApiMutation('put', '/auth/profile', {
        onSuccess: (response: any) => {
            refetch();
            // Update local storage for sidebar/nav consistency
            localStorage.setItem('user', JSON.stringify(response.user));
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000);

            if (redirectPath) {
                setTimeout(() => router.push(redirectPath), 1000);
            } else {
                setTimeout(() => router.push('/dashboard'), 1000);
            }
        }
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateProfileMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Syncing Identity...</div>;

    const user = data?.user || {};

    return (
        <div className="font-sans text-blue-900 pb-24 max-w-5xl mx-auto">
            <header className="mb-12">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] block mb-2">Account Settings</span>
                <h1 className="text-4xl font-bold text-blue-900 tracking-tight">Professional Profile</h1>
                <p className="text-blue-500 text-sm mt-2 font-medium">Manage your personal information and biodata for applications.</p>
            </header>

            {successMessage && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Profile Synced Successfully {redirectPath ? '— Redirecting...' : '— Returning to Dashboard'}</p>
                </div>
            )}

            <div className="space-y-12">
                {/* Identity Section */}
                <section className="bg-white p-10 rounded-3xl border border-blue-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-blue-900 rounded-lg text-white">
                            <span className="material-symbols-outlined text-base">person</span>
                        </div>
                        <h2 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Personal Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center gap-6 md:col-span-2 pb-6 border-b border-blue-50">
                            <div className="w-20 h-20 rounded-2xl bg-blue-900 flex items-center justify-center text-white text-3xl font-bold italic">
                                {formData.fullName?.[0] || user.email?.[0] || '?'}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-900">{formData.fullName || 'New Applicant'}</h3>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Profile Photo Restricted</p>
                            </div>
                        </div>

                        <InputField label="Legal Full Name" value={formData.fullName} onChange={(v: string) => handleInputChange('fullName', v)} />
                        <InputField label="Date of Birth" value={formData.dateOfBirth} onChange={(v: string) => handleInputChange('dateOfBirth', v)} type="date" />
                        <InputField label="Gender" value={formData.gender} onChange={(v: string) => handleInputChange('gender', v)} options={['Male', 'Female', 'Other']} />
                        <InputField label="Nationality" value={formData.nationality} onChange={(v: string) => handleInputChange('nationality', v)} placeholder="e.g. United Kingdom" />
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-white p-10 rounded-3xl border border-blue-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-blue-900 rounded-lg text-white">
                            <span className="material-symbols-outlined text-base">contact_mail</span>
                        </div>
                        <h2 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Contact Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField label="Registered Email" value={user.email || ''} onChange={() => { }} type="email" placeholder={user.email} readOnly />
                        <InputField label="Phone Number" value={formData.phoneNumber} onChange={(v: string) => handleInputChange('phoneNumber', v)} placeholder="+1 (555) 000-0000" />
                    </div>
                </section>

                {/* Residential Details */}
                <section className="bg-white p-10 rounded-3xl border border-blue-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-2 bg-blue-900 rounded-lg text-white">
                            <span className="material-symbols-outlined text-base">home</span>
                        </div>
                        <h2 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Residential Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <InputField label="Residential Address" value={formData.address} onChange={(v: string) => handleInputChange('address', v)} placeholder="123 Career St, Industrial Park" />
                        </div>
                        <InputField label="City" value={formData.city} onChange={(v: string) => handleInputChange('city', v)} />
                        <InputField label="State / Province" value={formData.state} onChange={(v: string) => handleInputChange('state', v)} />
                        <InputField label="Country" value={formData.country} onChange={(v: string) => handleInputChange('country', v)} />
                        <InputField label="Zip / Postal Code" value={formData.zipCode} onChange={(v: string) => handleInputChange('zipCode', v)} />
                    </div>
                </section>

                {/* Save Footer */}
                <div className="flex justify-end gap-4 p-8 bg-blue-50 rounded-2xl border border-blue-100 items-center">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mr-auto px-4">Last Sync: {new Date(user.updatedAt || Date.now()).toLocaleDateString()}</p>
                    <button
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                        className="px-10 py-4 bg-blue-900 text-white font-bold rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {updateProfileMutation.isPending ? 'Syncing Profile...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    readOnly?: boolean;
    options?: string[] | null;
}

const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    readOnly = false,
    options = null
}: InputFieldProps) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1">{label}</label>
        {options ? (
            <select
                className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm font-bold text-blue-900 focus:bg-white outline-none focus:ring-2 focus:ring-blue-900/5 transition-all appearance-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Select {label}</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        ) : (
            <input
                className={`w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm font-bold text-blue-900 focus:bg-white outline-none focus:ring-2 focus:ring-blue-900/5 transition-all ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                readOnly={readOnly}
            />
        )}
    </div>
);

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">Loading Module...</div>}>
            <ProfileContent />
        </Suspense>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation, useApiQuery } from '@/lib/hooks';
import Link from 'next/link';
import { JobListing, JobCategory, JobBenefit, JobCondition } from '@/types/models';

interface JobFormProps {
    initialData?: JobListing & { JobBenefits?: JobBenefit[], JobConditions?: JobCondition[] };
    isEdit?: boolean;
}

export default function JobForm({ initialData, isEdit = false }: JobFormProps) {
    const router = useRouter();
    const { data: categoriesResult } = useApiQuery<{ rows: JobCategory[], count: number }>(['admin', 'categories'], '/admin/categories');
    const categories = categoriesResult?.rows || [];

    const { data: benefitsResult } = useApiQuery<{ rows: JobBenefit[], count: number }>(['admin', 'benefits'], '/admin/benefits');
    const { data: conditionsResult } = useApiQuery<{ rows: JobCondition[], count: number }>(['admin', 'conditions'], '/admin/conditions');

    const allBenefits = benefitsResult?.rows || [];
    const allConditions = conditionsResult?.rows || [];

    const [title, setTitle] = useState(initialData?.title || '');
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
    const [employmentType, setEmploymentType] = useState(initialData?.employmentType || 'Full-time');
    const [location, setLocation] = useState(initialData?.location || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [requirements, setRequirements] = useState(initialData?.requirements || '');
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    const [selectedBenefits, setSelectedBenefits] = useState<number[]>(
        initialData?.JobBenefits?.map(b => b.id) || []
    );
    const [selectedConditions, setSelectedConditions] = useState<number[]>(
        initialData?.JobConditions?.map(c => c.id) || []
    );

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setCategoryId(initialData.categoryId);
            setEmploymentType(initialData.employmentType);
            setLocation(initialData.location as string);
            setDescription(initialData.description);
            setRequirements(initialData.requirements || '');
            setIsActive(initialData.isActive);
            setSelectedBenefits(initialData.JobBenefits?.map(b => b.id) || []);
            setSelectedConditions(initialData.JobConditions?.map(c => c.id) || []);
        }
    }, [initialData]);

    const mutation = useApiMutation(
        isEdit ? 'put' : 'post',
        isEdit ? `/admin/jobs/${initialData?.id}` : '/admin/jobs',
        {
            onSuccess: () => {
                router.push('/admin/jobs');
                router.refresh();
            }
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutation.mutateAsync({
                title,
                categoryId: parseInt(categoryId.toString(), 10),
                employmentType,
                location,
                description,
                requirements,
                isActive,
                benefitsIds: selectedBenefits,
                conditionsIds: selectedConditions
            });
        } catch (err) {
            alert(`Failed to ${isEdit ? 'update' : 'create'} job listing`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="sm:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Job Title</label>
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                placeholder="e.g. Senior Experience Designer"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-8">
                            <label className="text-[10px]  font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>

                            <div className="relative">
                                <br />
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-10 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer shadow-inner"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Employment Type</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-10 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer shadow-inner"
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                    required
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Contract / Freelance">Contract / Freelance</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div className="sm:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Location</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold">location_on</span>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                    placeholder="London, UK or Remote"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Description</label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                        placeholder="Describe the mission..."
                        rows={10}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Requirements</label>
                    <textarea
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-5 px-6 text-sm font-medium focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/30 transition-all resize-none shadow-inner text-white"
                        placeholder="List essential skills..."
                        rows={8}
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Benefits & Conditions (Production Upgrade) */}
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Targeted Benefits</label>
                            <Link href="/admin/benefits/new">
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] cursor-pointer hover:underline">+ Provision New</span>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {allBenefits.map(benefit => {
                                const isSelected = selectedBenefits.includes(benefit.id);
                                return (
                                    <button
                                        key={benefit.id}
                                        type="button"
                                        onClick={() => setSelectedBenefits(prev => isSelected ? prev.filter(id => id !== benefit.id) : [...prev, benefit.id])}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                            : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        {benefit.benefitType}
                                        <br />

                                        {benefit.value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Operational Conditions</label>
                            <Link href="/admin/conditions/new">
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] cursor-pointer hover:underline">+ Provision New</span>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {allConditions.map(condition => {
                                const isSelected = selectedConditions.includes(condition.id);
                                return (
                                    <button
                                        key={condition.id}
                                        type="button"
                                        onClick={() => setSelectedConditions(prev => isSelected ? prev.filter(id => id !== condition.id) : [...prev, condition.id])}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                            : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        {condition.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200/50 shadow-inner space-y-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">settings</span> Controls
                    </h3>
                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-100">
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tight text-slate-800 border-l-2 border-emerald-500 pl-2">Active</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                className="sr-only peer"
                                type="checkbox"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                            <div className="w-14 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 shadow-inner"></div>
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            className="w-full py-4 bg-primary bg-gradient-to-r from-primary to-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Processing...' : isEdit ? 'Update Listing' : 'Publish Listing'}
                        </button>
                        <Link href="/admin/jobs">
                            <button className="w-full py-4 bg-white text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border border-slate-200 rounded-xl hover:bg-slate-50 transition-all" type="button">Discard</button>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

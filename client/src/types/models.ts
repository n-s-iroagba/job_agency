/**
 * Unified TypeScript Models for Job Agency Platform
 * These interfaces map directly to the backend Sequelize Models.
 */

export interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string; // Typically excluded in response, but mapped here for completeness
    role: string;
    preferences: {
        pushNotifications?: boolean;
        emailNotifications?: boolean;
        [key: string]: any;
    };
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface JobCategory {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface JobListing {
    id: number;
    title: string;
    description: string;
    location: string | null;
    employmentType: string;
    requirements: string;
    categoryId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    JobCategory?: JobCategory;
}

export interface JobBenefit {
    id: number;
    benefitType: string;
    description: string;
    value: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface JobCondition {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface JobStage {
    id: number;
    jobId: number;
    name: string;
    description: string;
    orderPosition: number;
    requiresPayment: boolean;
    amount: number | null;
    currency: string | null;
    instructions: string | null;
    deadlineDays: number | null;
    notifyEmail: boolean;
    notifyPush: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Application {
    id: number;
    userId: number;
    jobId: number;
    currentStageId: number | null;
    status: string;
    completionPercentage: number;
    createdAt: string;
    updatedAt: string;
    User?: User;
    JobListing?: JobListing;
}

export interface BankAccount {
    id: number;
    bankName: string;
    accountNumber: string;
    accountType: string;
    routingCode: string | null;
    currency: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CryptoWallet {
    id: number;
    currencyName: string;
    networkType: string;
    walletAddress: string;
    memoTag: string | null;
    isActive: boolean;
    displayLabel: string;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: number;
    applicationId: number;
    stageId: number;
    status: string;
    amount: number;
    currency: string;
    proofUrl: string | null;
    adminNote: string | null;
    verifiedById: number | null;
    createdAt: string;
    updatedAt: string;
    JobStage?: JobStage;
    Application?: Application;
    Verifier?: User;
}

export interface Notification {
    id: number;
    userId: number;
    subject: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
}

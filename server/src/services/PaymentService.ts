import { sequelize } from '../config/database';
import { paymentRepository } from '../repositories/PaymentRepository';
import { applicationRepository } from '../repositories/ApplicationRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { bankAccountRepository } from '../repositories/BankAccountRepository';
import { cryptoWalletRepository } from '../repositories/CryptoWalletRepository';
import { sendEmail } from '../utils/email';
import { CONSTANTS } from '../constants';

export class PaymentService {
    // Maps to STK-APP-PAY-001, STK-ADM-BANK-003 — display correct bank account type by amount
    public async getPaymentDetails(paymentId: number) {
        const payment = await paymentRepository.findById(paymentId);
        if (!payment) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

        const amount = (payment as any).amount || 0;
        // STK-ADM-BANK-003, Scenario 3: High-value routing
        const bankType = amount >= CONSTANTS.SEED_DEFAULTS.HIGH_VALUE_THRESHOLD
            ? CONSTANTS.BANK_ACCOUNT_TYPES.NORMAL
            : CONSTANTS.BANK_ACCOUNT_TYPES.OPEN_BENEFICIARY;

        const allBankAccounts = await bankAccountRepository.findAll();
        const relevantBankAccounts = (allBankAccounts as any[]).filter(a => a.accountType === bankType);

        const allWallets = await cryptoWalletRepository.findAll();
        const activeCryptoWallets = (allWallets as any[]).filter(w => w.isActive);

        return {
            payment,
            bankAccounts: relevantBankAccounts,    // STK-APP-PAY-001
            cryptoWallets: activeCryptoWallets,     // STK-ADM-CRYPTO-003
            isHighValue: amount >= CONSTANTS.SEED_DEFAULTS.HIGH_VALUE_THRESHOLD,
        };
    }

    // Maps to STK-APP-PAY-002, STK-APP-PAY-003, NFR-SEC-005
    public async uploadPaymentProof(paymentId: number, proofUrl: string) {
        const payment = await paymentRepository.findById(paymentId);
        if (!payment) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

        const [, updatedPayments] = await paymentRepository.update(paymentId, {
            proofUrl,
            status: CONSTANTS.PAYMENT_STATUSES.PENDING,
        });

        // TRUST-007: Notify applicant that proof was received
        await notificationRepository.create({
            userId: (payment as any).Application?.userId,
            subject: 'Payment Proof Received',
            message: 'Your payment screenshot has been received and is currently in the verification queue.',
            type: 'SYSTEM',
        });

        return updatedPayments[0];
    }

    // Maps to STK-ADM-PAY-003 — unpaid payments view
    public async getPendingPayments(limit?: number, offset?: number) {
        return paymentRepository.findAllAdmin({ status: CONSTANTS.PAYMENT_STATUSES.UNPAID, limit, offset });
    }

    // Maps to STK-ADM-PAY-004 — unverified (screenshot uploaded, not yet verified)
    public async getUnverifiedPayments(limit?: number, offset?: number) {
        return paymentRepository.findAllAdmin({ status: CONSTANTS.PAYMENT_STATUSES.PENDING, limit, offset });
    }

    // Maps to STK-ADM-PAY-001, STK-ADM-PAY-002
    public async verifyPayment(paymentId: number, adminId: number, isApproved: boolean, note?: string) {
        const t = await sequelize.transaction();
        try {
            const payment = await paymentRepository.findById(paymentId, t);
            if (!payment) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            const status = isApproved ? CONSTANTS.PAYMENT_STATUSES.PAID : CONSTANTS.PAYMENT_STATUSES.REJECTED;

            const [, updatedPayments] = await paymentRepository.update(paymentId, {
                status,
                verifiedById: adminId,
                adminNote: note,
            }, t);

            const applicantUserId = (payment as any).Application?.userId;

            if (applicantUserId) {
                const nSubject = isApproved ? 'Payment Verified' : 'Payment Rejected';
                const nMessage = isApproved
                    ? 'Your payment was successfully verified. Your application has been advanced to the next stage.'
                    : `Your payment was rejected. Reason: ${note || 'No reason provided'}. Please re-upload your payment proof.`;

                // STK-ADM-PAY-002: push notification
                await notificationRepository.create({
                    userId: applicantUserId,
                    subject: nSubject,
                    message: nMessage,
                    type: 'SYSTEM',
                }, t);

                // STK-APP-PAY-005, TRUST-008: email notification
                try {
                    const userEmail = (payment as any).Application?.User?.email;
                    if (userEmail) {
                        await sendEmail(userEmail, nSubject, `<p>${nMessage}</p>`);
                    }
                } catch (_emailErr) {
                    // STK-CAP-005: graceful degradation — don't fail if email is down
                }
            }

            await t.commit();
            return updatedPayments[0];
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export const paymentService = new PaymentService();

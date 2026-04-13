import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { jobController } from '../controllers/JobController';
import { applicationController } from '../controllers/ApplicationController';
import { paymentController } from '../controllers/PaymentController';
import { adminController } from '../controllers/AdminController';
import { notificationController } from '../controllers/NotificationController';
import { cvController } from '../controllers/CvController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { apiLimiter, authLimiter } from '../utils/rateLimiter';
import { CONSTANTS } from '../constants';

const router = Router();

// =======================
// Public Routes
// =======================
// STK-APP-AUTH-004: email/password registration and login (NFR-SEC-008: rate limited)
router.use('/auth', authLimiter);
router.post('/auth/register', authController.register.bind(authController));
router.post('/auth/login', authController.login.bind(authController));

// STK-APP-AUTH-001, STK-ADM-JOB-004: public job listings
router.use('/jobs', apiLimiter);
router.get('/jobs', jobController.getActiveJobs.bind(jobController));
router.get('/jobs/:id', jobController.getJobDetails.bind(jobController));

// STK-ADM-CRYPTO-003: active crypto wallets for public display (payment pages)
router.get('/wallets/active', apiLimiter, adminController.getActiveCryptoWallets.bind(adminController));

// =======================
// Applicant Routes (requireAuth + APPLICANT role)
// =======================
const applicantMW = [requireAuth, requireRole([CONSTANTS.ROLES.APPLICANT]), apiLimiter];

// STK-APP-DASH-001..003
router.get('/dashboard', ...applicantMW, applicationController.getDashboardSummary.bind(applicationController));

// STK-APP-APPLY-001..005
router.post('/applications', ...applicantMW, applicationController.startApplication.bind(applicationController));
router.get('/applications', ...applicantMW, applicationController.getUserApplications.bind(applicationController));
router.get('/applications/:id', ...applicantMW, applicationController.getApplicationDetails.bind(applicationController));
router.post('/applications/:id/advance', ...applicantMW, applicationController.advanceApplication.bind(applicationController));

// STK-APP-CV-001..004
router.get('/cv', ...applicantMW, cvController.getCv.bind(cvController));
router.post('/cv', ...applicantMW, cvController.uploadCv.bind(cvController));
router.put('/cv', ...applicantMW, cvController.updateCv.bind(cvController));
router.delete('/cv', ...applicantMW, cvController.deleteCv.bind(cvController));

// STK-APP-PAY-001: payment details with bank account routing
router.get('/payments/:id', ...applicantMW, paymentController.getPaymentDetails.bind(paymentController));
// STK-APP-PAY-002, STK-APP-PAY-003: upload proof
router.post('/payments/:id/proof', ...applicantMW, paymentController.uploadProof.bind(paymentController));

// STK-APP-NOTIF-001..003, TRUST-008: notifications
router.get('/notifications', ...applicantMW, notificationController.getUserNotifications.bind(notificationController));
router.put('/notifications/:id/read', ...applicantMW, notificationController.markAsRead.bind(notificationController));

// =======================
// Admin Routes (requireAuth + ADMIN role) — NFR-SEC-004
// =======================
const adminMW = [requireAuth, requireRole([CONSTANTS.ROLES.ADMIN]), apiLimiter];

// STK-ADM-HEALTH-001..003
router.get('/admin/health', ...adminMW, adminController.getHealth.bind(adminController));

// STK-ADM-APP-001: new/completed applications
router.get('/admin/applications', ...adminMW, applicationController.getAdminApplications.bind(applicationController));
// STK-ADM-APP-002: draft applications
router.get('/admin/applications/drafts', ...adminMW, applicationController.getDraftApplications.bind(applicationController));
// STK-ADM-APP-003, STK-ADM-APP-004: send mail/push to applicant
router.post('/admin/mail', ...adminMW, adminController.sendMailToApplicant.bind(adminController));

// STK-ADM-PAY-003: unpaid payments view
router.get('/admin/payments/unpaid', ...adminMW, paymentController.getPendingPaymentsAdmin.bind(paymentController));
// STK-ADM-PAY-004: unverified payments (screenshot uploaded, not confirmed)
router.get('/admin/payments/unverified', ...adminMW, paymentController.getUnverifiedPaymentsAdmin.bind(paymentController));
// STK-ADM-PAY-001, STK-ADM-PAY-002: verify payment
router.post('/admin/payments/:id/verify', ...adminMW, paymentController.verifyPayment.bind(paymentController));

// STK-ADM-JOB-001..005
router.get('/admin/jobs', ...adminMW, jobController.getAllJobsAdmin.bind(jobController));
router.post('/admin/jobs', ...adminMW, jobController.createJob.bind(jobController));
router.put('/admin/jobs/:id', ...adminMW, jobController.updateJob.bind(jobController));
router.delete('/admin/jobs/:id', ...adminMW, jobController.deleteJob.bind(jobController));

// STK-ADM-STAGE-001..005: stage management
router.get('/admin/jobs/:id/stages', ...adminMW, jobController.getJobStages.bind(jobController));
router.post('/admin/jobs/:id/stages', ...adminMW, jobController.createJobStage.bind(jobController));
router.put('/admin/jobs/stages/:stageId', ...adminMW, jobController.updateJobStage.bind(jobController));
router.delete('/admin/jobs/stages/:stageId', ...adminMW, jobController.deleteJobStage.bind(jobController));

// STK-ADM-BANK-001..004
router.get('/admin/finance/configs', ...adminMW, adminController.getFinancialConfigs.bind(adminController));
router.get('/admin/finance/bank-accounts/by-amount', ...adminMW, adminController.getBankAccountsForAmount.bind(adminController));
router.post('/admin/bank-accounts', ...adminMW, adminController.createBankAccount.bind(adminController));
router.put('/admin/bank-accounts/:id', ...adminMW, adminController.updateBankAccount.bind(adminController));
router.delete('/admin/bank-accounts/:id', ...adminMW, adminController.deleteBankAccount.bind(adminController));

// STK-ADM-CRYPTO-001..003
router.post('/admin/crypto-wallets', ...adminMW, adminController.createCryptoWallet.bind(adminController));
router.put('/admin/crypto-wallets/:id', ...adminMW, adminController.updateCryptoWallet.bind(adminController));
router.delete('/admin/crypto-wallets/:id', ...adminMW, adminController.deleteCryptoWallet.bind(adminController));

// STK-ADM-CAT-001..003
router.get('/admin/jobs/metadata', ...adminMW, adminController.getJobConfigs.bind(adminController));
router.post('/admin/categories', ...adminMW, adminController.createCategory.bind(adminController));
router.put('/admin/categories/:id', ...adminMW, adminController.updateCategory.bind(adminController));
router.delete('/admin/categories/:id', ...adminMW, adminController.deleteCategory.bind(adminController));

// STK-ADM-COND-001..003
router.post('/admin/conditions', ...adminMW, adminController.createCondition.bind(adminController));
router.put('/admin/conditions/:id', ...adminMW, adminController.updateCondition.bind(adminController));
router.delete('/admin/conditions/:id', ...adminMW, adminController.deleteCondition.bind(adminController));

// STK-ADM-BEN-001..004
router.post('/admin/benefits', ...adminMW, adminController.createBenefit.bind(adminController));
router.put('/admin/benefits/:id', ...adminMW, adminController.updateBenefit.bind(adminController));
router.delete('/admin/benefits/:id', ...adminMW, adminController.deleteBenefit.bind(adminController));

// REG-004: admin user listing
router.get('/admin/users', ...adminMW, adminController.getAllApplicants.bind(adminController));

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const JobController_1 = require("../controllers/JobController");
const ApplicationController_1 = require("../controllers/ApplicationController");
const PaymentController_1 = require("../controllers/PaymentController");
const AdminController_1 = require("../controllers/AdminController");
const NotificationController_1 = require("../controllers/NotificationController");
const CvController_1 = require("../controllers/CvController");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const rateLimiter_1 = require("../utils/rateLimiter");
const constants_1 = require("../constants");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});
const router = (0, express_1.Router)();
// =======================
// Public Routes
// =======================
// STK-APP-AUTH-004: email/password registration and login (NFR-SEC-008: rate limited)
router.use('/auth', rateLimiter_1.authLimiter);
router.post('/auth/register', AuthController_1.authController.register.bind(AuthController_1.authController));
router.post('/auth/register-admin', AuthController_1.authController.registerAdmin.bind(AuthController_1.authController));
router.post('/auth/login', AuthController_1.authController.login.bind(AuthController_1.authController));
router.post('/auth/refresh', AuthController_1.authController.refresh.bind(AuthController_1.authController));
router.post('/auth/logout', AuthController_1.authController.logout.bind(AuthController_1.authController));
router.get('/auth/me', auth_1.requireAuth, AuthController_1.authController.getMe.bind(AuthController_1.authController));
router.put('/auth/profile', auth_1.requireAuth, AuthController_1.authController.updateProfile.bind(AuthController_1.authController));
router.get('/auth/verify-email', AuthController_1.authController.verifyEmail.bind(AuthController_1.authController));
router.post('/auth/forgot-password', AuthController_1.authController.forgotPassword.bind(AuthController_1.authController));
router.post('/auth/reset-password', AuthController_1.authController.resetPassword.bind(AuthController_1.authController));
router.post('/auth/resend-verification', AuthController_1.authController.resendVerification.bind(AuthController_1.authController));
router.put('/auth/change-password', auth_1.requireAuth, AuthController_1.authController.changePassword.bind(AuthController_1.authController));
// STK-APP-AUTH-001, STK-ADM-JOB-004: public job listings
router.use('/jobs', rateLimiter_1.apiLimiter);
router.get('/jobs', JobController_1.jobController.getActiveJobs.bind(JobController_1.jobController));
router.get('/jobs/:id', JobController_1.jobController.getJobDetails.bind(JobController_1.jobController));
// STK-ADM-CRYPTO-003: active crypto wallets for public display (payment pages)
router.get('/wallets/active', rateLimiter_1.apiLimiter, AdminController_1.adminController.getActiveCryptoWallets.bind(AdminController_1.adminController));
// =======================
// Applicant Routes (requireAuth + APPLICANT role)
// =======================
const applicantMW = [auth_1.requireAuth, (0, rbac_1.requireRole)([constants_1.CONSTANTS.ROLES.APPLICANT]), rateLimiter_1.apiLimiter];
// STK-APP-DASH-001..003
router.get('/dashboard', ...applicantMW, ApplicationController_1.applicationController.getDashboardSummary.bind(ApplicationController_1.applicationController));
// STK-APP-APPLY-001..005
router.post('/applications', ...applicantMW, ApplicationController_1.applicationController.startApplication.bind(ApplicationController_1.applicationController));
router.get('/applications', ...applicantMW, ApplicationController_1.applicationController.getUserApplications.bind(ApplicationController_1.applicationController));
router.get('/applications/:id', ...applicantMW, ApplicationController_1.applicationController.getApplicationDetails.bind(ApplicationController_1.applicationController));
router.post('/applications/:id/advance', ...applicantMW, ApplicationController_1.applicationController.advanceApplication.bind(ApplicationController_1.applicationController));
// STK-APP-CV-001..004
router.get('/cv', ...applicantMW, CvController_1.cvController.getCv.bind(CvController_1.cvController));
router.post('/cv', ...applicantMW, CvController_1.cvController.uploadCv.bind(CvController_1.cvController));
router.put('/cv', ...applicantMW, CvController_1.cvController.updateCv.bind(CvController_1.cvController));
router.delete('/cv', ...applicantMW, CvController_1.cvController.deleteCv.bind(CvController_1.cvController));
// STK-APP-PAY-001: payment details with bank account routing
router.get('/payments/:id', ...applicantMW, PaymentController_1.paymentController.getPaymentDetails.bind(PaymentController_1.paymentController));
// STK-APP-PAY-002, STK-APP-PAY-003: upload proof
router.post('/payments/:id/proof', ...applicantMW, PaymentController_1.paymentController.uploadProof.bind(PaymentController_1.paymentController));
// STK-APP-NOTIF-001..003, TRUST-008: notifications
router.get('/notifications', ...applicantMW, NotificationController_1.notificationController.getUserNotifications.bind(NotificationController_1.notificationController));
router.put('/notifications/mark-all-read', ...applicantMW, NotificationController_1.notificationController.markAllRead.bind(NotificationController_1.notificationController));
router.put('/notifications/:id/read', ...applicantMW, NotificationController_1.notificationController.markAsRead.bind(NotificationController_1.notificationController));
// =======================
// Admin Routes (requireAuth + ADMIN role) — NFR-SEC-004
// =======================
const adminMW = [auth_1.requireAuth, (0, rbac_1.requireRole)([constants_1.CONSTANTS.ROLES.ADMIN]), rateLimiter_1.apiLimiter];
// STK-ADM-HEALTH-001..003
router.get('/admin/health', ...adminMW, AdminController_1.adminController.getHealth.bind(AdminController_1.adminController));
// STK-ADM-APP-001: new/completed applications
router.get('/admin/applications', ...adminMW, ApplicationController_1.applicationController.getAdminApplications.bind(ApplicationController_1.applicationController));
// STK-ADM-APP-002: draft applications
router.get('/admin/applications/drafts', ...adminMW, ApplicationController_1.applicationController.getDraftApplications.bind(ApplicationController_1.applicationController));
// STK-ADM-APP-003, STK-ADM-APP-004: send mail/push to applicant
router.post('/admin/mail', ...adminMW, upload.array('attachments'), AdminController_1.adminController.sendMailToApplicant.bind(AdminController_1.adminController));
// New: manage ad-hoc stages for specific applications
router.post('/admin/applications/:id/stages', ...adminMW, ApplicationController_1.applicationController.addStage.bind(ApplicationController_1.applicationController));
router.get('/admin/applications/:id/stages/:stageId', ...adminMW, ApplicationController_1.applicationController.getStageDetails.bind(ApplicationController_1.applicationController));
router.put('/admin/applications/:id/stages/:stageId', ...adminMW, ApplicationController_1.applicationController.updateStage.bind(ApplicationController_1.applicationController));
router.delete('/admin/applications/:id/stages/:stageId', ...adminMW, ApplicationController_1.applicationController.deleteStage.bind(ApplicationController_1.applicationController));
router.post('/admin/applications/:id/stages/:stageId/complete', ...adminMW, ApplicationController_1.applicationController.completeApplicationStage.bind(ApplicationController_1.applicationController));
router.post('/admin/applications/:id/complete', ...adminMW, ApplicationController_1.applicationController.completeApplication.bind(ApplicationController_1.applicationController));
router.get('/admin/applications/:id', ...adminMW, ApplicationController_1.applicationController.getApplicationDetails.bind(ApplicationController_1.applicationController));
// STK-ADM-PAY-003: unpaid payments view
router.get('/admin/payments/unpaid', ...adminMW, PaymentController_1.paymentController.getPendingPaymentsAdmin.bind(PaymentController_1.paymentController));
// STK-ADM-PAY-004: unverified payments (screenshot uploaded, not confirmed)
router.get('/admin/payments/unverified', ...adminMW, PaymentController_1.paymentController.getUnverifiedPaymentsAdmin.bind(PaymentController_1.paymentController));
// STK-ADM-PAY-001, STK-ADM-PAY-002: verify payment
router.post('/admin/payments/:id/verify', ...adminMW, PaymentController_1.paymentController.verifyPayment.bind(PaymentController_1.paymentController));
// STK-ADM-JOB-001..005
router.get('/admin/jobs/stats', ...adminMW, JobController_1.jobController.getJobStats.bind(JobController_1.jobController));
router.get('/admin/jobs', ...adminMW, JobController_1.jobController.getAllJobsAdmin.bind(JobController_1.jobController));
router.get('/admin/jobs/:id', ...adminMW, JobController_1.jobController.getJobDetails.bind(JobController_1.jobController));
router.post('/admin/jobs', ...adminMW, JobController_1.jobController.createJob.bind(JobController_1.jobController));
router.put('/admin/jobs/:id', ...adminMW, JobController_1.jobController.updateJob.bind(JobController_1.jobController));
router.delete('/admin/jobs/:id', ...adminMW, JobController_1.jobController.deleteJob.bind(JobController_1.jobController));
// STK-ADM-BANK-001..004
router.get('/admin/finance/configs', ...adminMW, AdminController_1.adminController.getFinancialConfigs.bind(AdminController_1.adminController));
router.get('/admin/bank-accounts', ...adminMW, AdminController_1.adminController.getAllBankAccounts.bind(AdminController_1.adminController));
router.get('/admin/bank-accounts/:id', ...adminMW, AdminController_1.adminController.getBankAccountById.bind(AdminController_1.adminController));
router.get('/admin/crypto-wallets', ...adminMW, AdminController_1.adminController.getAllCryptoWallets.bind(AdminController_1.adminController));
router.get('/admin/crypto-wallets/:id', ...adminMW, AdminController_1.adminController.getCryptoWalletById.bind(AdminController_1.adminController));
router.get('/admin/finance/bank-accounts/by-amount', ...adminMW, AdminController_1.adminController.getBankAccountsForAmount.bind(AdminController_1.adminController));
router.post('/admin/bank-accounts', ...adminMW, AdminController_1.adminController.createBankAccount.bind(AdminController_1.adminController));
router.put('/admin/bank-accounts/:id', ...adminMW, AdminController_1.adminController.updateBankAccount.bind(AdminController_1.adminController));
router.delete('/admin/bank-accounts/:id', ...adminMW, AdminController_1.adminController.deleteBankAccount.bind(AdminController_1.adminController));
// STK-ADM-CRYPTO-001..003
router.post('/admin/crypto-wallets', ...adminMW, AdminController_1.adminController.createCryptoWallet.bind(AdminController_1.adminController));
router.put('/admin/crypto-wallets/:id', ...adminMW, AdminController_1.adminController.updateCryptoWallet.bind(AdminController_1.adminController));
router.delete('/admin/crypto-wallets/:id', ...adminMW, AdminController_1.adminController.deleteCryptoWallet.bind(AdminController_1.adminController));
// STK-ADM-CAT-001..003
router.get('/admin/jobs/metadata', ...adminMW, AdminController_1.adminController.getJobConfigs.bind(AdminController_1.adminController));
router.get('/admin/categories', ...adminMW, AdminController_1.adminController.getAllCategories.bind(AdminController_1.adminController));
router.get('/admin/categories/:id', ...adminMW, AdminController_1.adminController.getCategoryById.bind(AdminController_1.adminController));
router.get('/admin/conditions', ...adminMW, AdminController_1.adminController.getAllConditions.bind(AdminController_1.adminController));
router.get('/admin/conditions/:id', ...adminMW, AdminController_1.adminController.getConditionById.bind(AdminController_1.adminController));
router.get('/admin/benefits', ...adminMW, AdminController_1.adminController.getAllBenefits.bind(AdminController_1.adminController));
router.get('/admin/benefits/:id', ...adminMW, AdminController_1.adminController.getBenefitById.bind(AdminController_1.adminController));
router.post('/admin/categories', ...adminMW, AdminController_1.adminController.createCategory.bind(AdminController_1.adminController));
router.put('/admin/categories/:id', ...adminMW, AdminController_1.adminController.updateCategory.bind(AdminController_1.adminController));
router.delete('/admin/categories/:id', ...adminMW, AdminController_1.adminController.deleteCategory.bind(AdminController_1.adminController));
// STK-ADM-COND-001..003
router.post('/admin/conditions', ...adminMW, AdminController_1.adminController.createCondition.bind(AdminController_1.adminController));
router.put('/admin/conditions/:id', ...adminMW, AdminController_1.adminController.updateCondition.bind(AdminController_1.adminController));
router.delete('/admin/conditions/:id', ...adminMW, AdminController_1.adminController.deleteCondition.bind(AdminController_1.adminController));
// STK-ADM-BEN-001..004
router.post('/admin/benefits', ...adminMW, AdminController_1.adminController.createBenefit.bind(AdminController_1.adminController));
router.put('/admin/benefits/:id', ...adminMW, AdminController_1.adminController.updateBenefit.bind(AdminController_1.adminController));
router.delete('/admin/benefits/:id', ...adminMW, AdminController_1.adminController.deleteBenefit.bind(AdminController_1.adminController));
// REG-004: admin user management
router.get('/admin/users/:id', ...adminMW, AdminController_1.adminController.getApplicantById.bind(AdminController_1.adminController));
router.get('/admin/users', ...adminMW, AdminController_1.adminController.getAllApplicants.bind(AdminController_1.adminController));
router.delete('/admin/users/:id', ...adminMW, AdminController_1.adminController.deleteApplicant.bind(AdminController_1.adminController));
exports.default = router;

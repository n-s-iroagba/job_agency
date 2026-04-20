"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.Payment = exports.Application = exports.JobStage = exports.JobCondition = exports.JobBenefit = exports.JobListing = exports.JobCategory = exports.CryptoWallet = exports.BankAccount = exports.User = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const BankAccount_1 = require("./BankAccount");
Object.defineProperty(exports, "BankAccount", { enumerable: true, get: function () { return BankAccount_1.BankAccount; } });
const CryptoWallet_1 = require("./CryptoWallet");
Object.defineProperty(exports, "CryptoWallet", { enumerable: true, get: function () { return CryptoWallet_1.CryptoWallet; } });
const JobCategory_1 = require("./JobCategory");
Object.defineProperty(exports, "JobCategory", { enumerable: true, get: function () { return JobCategory_1.JobCategory; } });
const JobListing_1 = require("./JobListing");
Object.defineProperty(exports, "JobListing", { enumerable: true, get: function () { return JobListing_1.JobListing; } });
const JobBenefit_1 = require("./JobBenefit");
Object.defineProperty(exports, "JobBenefit", { enumerable: true, get: function () { return JobBenefit_1.JobBenefit; } });
const JobCondition_1 = require("./JobCondition");
Object.defineProperty(exports, "JobCondition", { enumerable: true, get: function () { return JobCondition_1.JobCondition; } });
const JobStage_1 = require("./JobStage");
Object.defineProperty(exports, "JobStage", { enumerable: true, get: function () { return JobStage_1.JobStage; } });
const Application_1 = require("./Application");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return Application_1.Application; } });
const Payment_1 = require("./Payment");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return Payment_1.Payment; } });
const Notification_1 = require("./Notification");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return Notification_1.Notification; } });
// Job Category <-> Job Listing
JobCategory_1.JobCategory.hasMany(JobListing_1.JobListing, { foreignKey: 'categoryId' });
JobListing_1.JobListing.belongsTo(JobCategory_1.JobCategory, { foreignKey: 'categoryId' });
// Job Category <-> Job Benefit
JobCategory_1.JobCategory.hasMany(JobBenefit_1.JobBenefit, { foreignKey: 'categoryId' });
JobBenefit_1.JobBenefit.belongsTo(JobCategory_1.JobCategory, { foreignKey: 'categoryId' });
// Job Category <-> Job Condition
JobCategory_1.JobCategory.hasMany(JobCondition_1.JobCondition, { foreignKey: 'categoryId' });
JobCondition_1.JobCondition.belongsTo(JobCategory_1.JobCategory, { foreignKey: 'categoryId' });
// Application <-> Job Stage
Application_1.Application.hasMany(JobStage_1.JobStage, { foreignKey: 'applicationId', as: 'JobStages', onDelete: 'CASCADE', hooks: true });
JobStage_1.JobStage.belongsTo(Application_1.Application, { foreignKey: 'applicationId' });
// JobListing <-> JobBenefit (M:N)
JobListing_1.JobListing.belongsToMany(JobBenefit_1.JobBenefit, { through: 'ListingBenefits', foreignKey: 'jobId', otherKey: 'benefitId' });
JobBenefit_1.JobBenefit.belongsToMany(JobListing_1.JobListing, { through: 'ListingBenefits', foreignKey: 'benefitId', otherKey: 'jobId' });
// JobListing <-> JobCondition (M:N)
JobListing_1.JobListing.belongsToMany(JobCondition_1.JobCondition, { through: 'ListingConditions', foreignKey: 'jobId', otherKey: 'conditionId' });
JobCondition_1.JobCondition.belongsToMany(JobListing_1.JobListing, { through: 'ListingConditions', foreignKey: 'conditionId', otherKey: 'jobId' });
// User <-> Application
User_1.User.hasMany(Application_1.Application, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
Application_1.Application.belongsTo(User_1.User, { foreignKey: 'userId' });
// JobListing <-> Application
JobListing_1.JobListing.hasMany(Application_1.Application, { foreignKey: 'jobId' });
Application_1.Application.belongsTo(JobListing_1.JobListing, { foreignKey: 'jobId' });
// JobListing <-> JobStage (Template Stages)
// Application <-> Payment
Application_1.Application.hasMany(Payment_1.Payment, { foreignKey: 'applicationId', onDelete: 'CASCADE', hooks: true });
Payment_1.Payment.belongsTo(Application_1.Application, { foreignKey: 'applicationId' });
// JobStage <-> Payment
JobStage_1.JobStage.hasMany(Payment_1.Payment, { foreignKey: 'stageId', onDelete: 'CASCADE', hooks: true });
Payment_1.Payment.belongsTo(JobStage_1.JobStage, { foreignKey: 'stageId' });
// User <-> Notification
User_1.User.hasMany(Notification_1.Notification, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
Notification_1.Notification.belongsTo(User_1.User, { foreignKey: 'userId' });
// Admin who verified payment
User_1.User.hasMany(Payment_1.Payment, { foreignKey: 'verifiedById', as: 'VerifiedPayments' });
Payment_1.Payment.belongsTo(User_1.User, { foreignKey: 'verifiedById', as: 'Verifier' });

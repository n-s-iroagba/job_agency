"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("./models");
const constants_1 = require("./constants");
const seedDatabase = async () => {
    try {
        await models_1.sequelize.authenticate();
        console.log('Database connected.');
        // 1. Synchronize (with safety)
        const isForce = process.argv.includes('--force');
        const userCount = await models_1.User.count();
        if (userCount > 0 && !isForce) {
            console.log('Database already contains data. Use --force to reseed.');
            process.exit(0);
        }
        if (isForce) {
            await models_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            await models_1.sequelize.sync({ force: true });
            await models_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('Database recreated (FORCED).');
        }
        else {
            await models_1.sequelize.sync();
            console.log('Database synced (safe mode).');
        }
        // 2. Add Users
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@elite.com';
        const adminPass = process.env.SEED_ADMIN_PASSWORD || 'admin123';
        const passwordHash = await bcrypt_1.default.hash(adminPass, 10);
        const admin = await models_1.User.create({
            fullName: 'Admin User',
            email: adminEmail,
            passwordHash,
            role: constants_1.CONSTANTS.ROLES.ADMIN,
            isVerified: true,
        });
        const appPasswordHash = await bcrypt_1.default.hash('applicant123', 10);
        const applicant = await models_1.User.create({
            fullName: 'Marcus Sterling',
            email: 'm.sterling@example.com',
            passwordHash: appPasswordHash,
            role: constants_1.CONSTANTS.ROLES.APPLICANT,
            isVerified: true,
        });
        // 3. System Finance
        await models_1.CryptoWallet.create({
            currencyName: constants_1.CONSTANTS.CRYPTO_TYPES.USDT,
            networkType: constants_1.CONSTANTS.CRYPTO_NETWORKS.TRC20,
            walletAddress: 'T9yD14Nj9j7xAB4dbzL...',
            displayLabel: 'Primary Treasury Wallet USDT (TRC20)',
            isActive: true,
        });
        await models_1.BankAccount.create({
            bankName: 'Global Heritage Bank',
            accountNumber: '92837492019',
            accountType: constants_1.CONSTANTS.BANK_ACCOUNT_TYPES.OPEN_BENEFICIARY,
            routingCode: 'CHASUS33XX',
            currency: 'USD',
            isActive: true,
        });
        // 4. Categories
        const engCat = await models_1.JobCategory.create({ name: 'Engineering' });
        const designCat = await models_1.JobCategory.create({ name: 'Design & Creative' });
        // 5. Conditions & Benefits
        const benefitRemote = await models_1.JobBenefit.create({ benefitType: 'WORK_LIFE', description: 'Fully Remote Workflow' });
        const condRelo = await models_1.JobCondition.create({ name: 'Relocation Required', description: 'Available within 30 days.' });
        // 6. Job Listing
        const job = await models_1.JobListing.create({
            title: 'Senior UX Architect',
            description: 'Craft a compelling narrative for your next role.',
            location: 'London, UK or Remote',
            employmentType: 'Full-time',
            requirements: '5+ years UX research experience',
            categoryId: designCat.id,
        });
        // Add relationships
        // @ts-ignore
        await job.addJobBenefits([benefitRemote]);
        // @ts-ignore
        await job.addJobConditions([condRelo]);
        // 7. Stages
        const stage1 = await models_1.JobStage.create({
            jobId: job.id,
            name: 'Portfolio Review',
            description: 'Submit your best designs',
            orderPosition: 1,
            requiresPayment: true,
            amount: 50.00,
            currency: 'USD',
        });
        // 8. Application
        const app = await models_1.Application.create({
            userId: applicant.id,
            jobId: job.id,
            currentStageId: stage1.id,
            status: constants_1.CONSTANTS.APPLICATION_STATUSES.ACTIVE,
            completionPercentage: 85,
        });
        await models_1.Payment.create({
            applicationId: app.id,
            stageId: stage1.id,
            amount: 50.00,
            currency: 'USD',
            status: constants_1.CONSTANTS.PAYMENT_STATUSES.UNPAID
        });
        console.log('Seeding Complete! 🎉');
        process.exit(0);
    }
    catch (e) {
        console.error('Seeding failed: ', e);
        process.exit(1);
    }
};
void seedDatabase();

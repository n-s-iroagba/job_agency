import bcrypt from 'bcrypt';
import { sequelize, User, BankAccount, CryptoWallet, JobCategory, JobListing, JobBenefit, JobCondition, JobStage, Application, Payment, Notification } from './models';
import { CONSTANTS } from './constants';

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Synchronize force
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Database recreated.');

        // 2. Add Users
        const passwordHash = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            fullName: 'Admin User',
            email: 'admin@elite.com',
            passwordHash,
            role: CONSTANTS.ROLES.ADMIN,
            isVerified: true,
        });

        const appPasswordHash = await bcrypt.hash('applicant123', 10);
        const applicant = await User.create({
            fullName: 'Marcus Sterling',
            email: 'm.sterling@example.com',
            passwordHash: appPasswordHash,
            role: CONSTANTS.ROLES.APPLICANT,
            isVerified: true,
        });

        // 3. System Finance
        await CryptoWallet.create({
            currencyName: CONSTANTS.CRYPTO_TYPES.USDT,
            networkType: CONSTANTS.CRYPTO_NETWORKS.TRC20,
            walletAddress: 'T9yD14Nj9j7xAB4dbzL...',
            displayLabel: 'Primary Treasury Wallet USDT (TRC20)',
            isActive: true,
        });

        await BankAccount.create({
            bankName: 'Global Heritage Bank',
            accountNumber: '92837492019',
            accountType: CONSTANTS.BANK_ACCOUNT_TYPES.OPEN_BENEFICIARY,
            routingCode: 'CHASUS33XX',
            currency: 'USD',
            isActive: true,
        });

        // 4. Categories
        const engCat = await JobCategory.create({ name: 'Engineering' });
        const designCat = await JobCategory.create({ name: 'Design & Creative' });

        // 5. Conditions & Benefits
        const benefitRemote = await JobBenefit.create({ benefitType: 'WORK_LIFE', description: 'Fully Remote Workflow' });
        const condRelo = await JobCondition.create({ name: 'Relocation Required', description: 'Available within 30 days.' });

        // 6. Job Listing
        const job = await JobListing.create({
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
        const stage1 = await JobStage.create({
            jobId: job.id,
            name: 'Portfolio Review',
            description: 'Submit your best designs',
            orderPosition: 1,
            requiresPayment: true,
            amount: 50.00,
            currency: 'USD',
        });

        // 8. Application
        const app = await Application.create({
            userId: applicant.id,
            jobId: job.id,
            currentStageId: stage1.id,
            status: CONSTANTS.APPLICATION_STATUSES.ACTIVE,
            completionPercentage: 85,
        });

        await Payment.create({
            applicationId: app.id,
            stageId: stage1.id,
            amount: 50.00,
            currency: 'USD',
            status: CONSTANTS.PAYMENT_STATUSES.UNPAID
        });

        console.log('Seeding Complete! 🎉');
        process.exit(0);

    } catch (e) {
        console.error('Seeding failed: ', e);
        process.exit(1);
    }
};

void seedDatabase();

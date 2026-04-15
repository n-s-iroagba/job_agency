import { sequelize } from '../config/database';
import { User } from './User';
import { BankAccount } from './BankAccount';
import { CryptoWallet } from './CryptoWallet';
import { JobCategory } from './JobCategory';
import { JobListing } from './JobListing';
import { JobBenefit } from './JobBenefit';
import { JobCondition } from './JobCondition';
import { JobStage } from './JobStage';
import { Application } from './Application';
import { Payment } from './Payment';
import { Notification } from './Notification';

// Job Category <-> Job Listing
JobCategory.hasMany(JobListing, { foreignKey: 'categoryId' });
JobListing.belongsTo(JobCategory, { foreignKey: 'categoryId' });

// Job Category <-> Job Benefit
JobCategory.hasMany(JobBenefit, { foreignKey: 'categoryId' });
JobBenefit.belongsTo(JobCategory, { foreignKey: 'categoryId' });

// Job Category <-> Job Condition
JobCategory.hasMany(JobCondition, { foreignKey: 'categoryId' });
JobCondition.belongsTo(JobCategory, { foreignKey: 'categoryId' });

// Job Listing <-> Job Stage
JobListing.hasMany(JobStage, { foreignKey: 'jobId' });
JobStage.belongsTo(JobListing, { foreignKey: 'jobId' });

// JobListing <-> JobBenefit (M:N)
JobListing.belongsToMany(JobBenefit, { through: 'ListingBenefits', foreignKey: 'jobId', otherKey: 'benefitId' });
JobBenefit.belongsToMany(JobListing, { through: 'ListingBenefits', foreignKey: 'benefitId', otherKey: 'jobId' });

// JobListing <-> JobCondition (M:N)
JobListing.belongsToMany(JobCondition, { through: 'ListingConditions', foreignKey: 'jobId', otherKey: 'conditionId' });
JobCondition.belongsToMany(JobListing, { through: 'ListingConditions', foreignKey: 'conditionId', otherKey: 'jobId' });

// User <-> Application
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

// JobListing <-> Application
JobListing.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(JobListing, { foreignKey: 'jobId' });

// Application <-> Payment
Application.hasMany(Payment, { foreignKey: 'applicationId' });
Payment.belongsTo(Application, { foreignKey: 'applicationId' });

// JobStage <-> Payment
JobStage.hasMany(Payment, { foreignKey: 'stageId' });
Payment.belongsTo(JobStage, { foreignKey: 'stageId' });
Application.hasMany(JobStage, { foreignKey: 'applicationId' });
JobStage.belongsTo(Application, { foreignKey: 'applicationId' });
// User <-> Notification
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Admin who verified payment
User.hasMany(Payment, { foreignKey: 'verifiedById', as: 'VerifiedPayments' });
Payment.belongsTo(User, { foreignKey: 'verifiedById', as: 'Verifier' });

export {
    sequelize,
    User,
    BankAccount,
    CryptoWallet,
    JobCategory,
    JobListing,
    JobBenefit,
    JobCondition,
    JobStage,
    Application,
    Payment,
    Notification
};

import { sequelize } from './config/database';

export async function run() {
    // try {
    //     await sequelize.authenticate();
    //     await sequelize.query('ALTER TABLE applications DROP COLUMN completionPercentage;');
    //     console.log('Dropped completionPercentage from applications');
    // } catch (e: any) {
    //     if (!e.message.includes("check that column/key exists")) {
    //         console.error('Error dropping column:', e.message);
    //     } else {
    //         console.log('completionPercentage already dropped');
    //     }
    // }

    // try {
    //     await sequelize.query('ALTER TABLE job_stages ADD COLUMN isCompleted TINYINT(1) DEFAULT 0;');
    //     console.log('Added isCompleted to job_stages');
    // } catch (e: any) {
    //     if (!e.message.includes("Duplicate column name")) {
    //         console.error('Error adding column:', e.message);
    //     } else {
    //         console.log('isCompleted already exists');
    //     }
    // }

    try {
        await sequelize.query('ALTER TABLE crypto_wallets MODIFY COLUMN currencyName VARCHAR(255);');
        await sequelize.query('ALTER TABLE crypto_wallets MODIFY COLUMN networkType VARCHAR(255);');
        console.log('Relaxed ENUM constraints in crypto_wallets');
    } catch (e: any) {
        console.error('Error relaxing crypto constraints:', e.message);
    }
}


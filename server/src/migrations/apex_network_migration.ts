import { sequelize } from '../config/database';

export async function migrateApexNetwork() {
    console.log('--- Initializing Apex Network Migration Sequence ---');

    // 1. Update Users Table
    try {
        await sequelize.query('ALTER TABLE Users ADD COLUMN isApexMember TINYINT(1) DEFAULT 0;');
        await sequelize.query('ALTER TABLE Users ADD COLUMN apexStatus VARCHAR(255) DEFAULT "NONE";');
        await sequelize.query('ALTER TABLE Users ADD COLUMN countryOfResidence VARCHAR(255);');
        await sequelize.query('ALTER TABLE Users ADD COLUMN languages JSON;');
        console.log('[SUCCESS] Users table updated with Apex metadata.');
    } catch (e: any) {
        if (e.message.includes("Duplicate column name")) {
            console.log('[INFO] Users table already contains Apex metadata.');
        } else {
            console.error('[ERROR] Failed to update Users table:', e.message);
        }
    }

    // 2. Update JobListings Table
    try {
        await sequelize.query('ALTER TABLE JobListings ADD COLUMN jobType VARCHAR(255) DEFAULT "NORMAL";');
        console.log('[SUCCESS] JobListings table updated with jobType.');
    } catch (e: any) {
        if (e.message.includes("Duplicate column name")) {
            console.log('[INFO] JobListings table already contains jobType.');
        } else {
            console.error('[ERROR] Failed to update JobListings table:', e.message);
        }
    }

    // 3. Update JobStages Table
    try {
        await sequelize.query('ALTER TABLE JobStages ADD COLUMN feeType VARCHAR(255) DEFAULT "NONE";');
        await sequelize.query('ALTER TABLE JobStages ADD COLUMN refundMessage TEXT;');
        console.log('[SUCCESS] JobStages table updated with feeType/refundMessage.');
    } catch (e: any) {
        if (e.message.includes("Duplicate column name")) {
            console.log('[INFO] JobStages table already contains fee/refund metadata.');
        } else {
            console.error('[ERROR] Failed to update JobStages table:', e.message);
        }
    }

    // 4. Create Interests Table
    try {
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Interests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                roles JSON,
                skills JSON,
                qualifications JSON,
                experience JSON,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('[SUCCESS] Interests table synchronized.');
    } catch (e: any) {
        console.error('[ERROR] Failed to create Interests table:', e.message);
    }

    console.log('--- Apex Network Migration Sequence Completed ---');
}

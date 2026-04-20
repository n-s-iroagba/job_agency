"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
async function run() {
    try {
        await database_1.sequelize.authenticate();
        await database_1.sequelize.query('ALTER TABLE applications DROP COLUMN completionPercentage;');
        console.log('Dropped completionPercentage from applications');
    }
    catch (e) {
        if (!e.message.includes("check that column/key exists")) {
            console.error('Error dropping column:', e.message);
        }
        else {
            console.log('completionPercentage already dropped');
        }
    }
    try {
        await database_1.sequelize.query('ALTER TABLE job_stages ADD COLUMN isCompleted TINYINT(1) DEFAULT 0;');
        console.log('Added isCompleted to job_stages');
    }
    catch (e) {
        if (!e.message.includes("Duplicate column name")) {
            console.error('Error adding column:', e.message);
        }
        else {
            console.log('isCompleted already exists');
        }
    }
    process.exit(0);
}
run();

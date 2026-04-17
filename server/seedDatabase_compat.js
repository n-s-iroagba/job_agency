const { sequelize, User, BankAccount, CryptoWallet, JobCategory, JobListing, JobBenefit, JobCondition } = require('./dist/models/index');
const { CONSTANTS } = require('./dist/constants');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

/**
 * Basic CSV Parser for quoted strings (Node 12 compat)
 */
function parseCSV(content) {
    const lines = content.split(/\r?\n/);
    const result = [];
    
    for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;
        
        const pattern = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
        const row = [];
        let match;
        
        while ((match = pattern.exec(line)) !== null) {
            let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
            row.push(val);
            if (match.index === pattern.lastIndex) pattern.lastIndex++;
        }
        // Patch for trailing empty columns if any
        if (line.endsWith(',')) row.push('');
        
        if (row.length >= 5) {
            result.push(row.slice(0, 5));
        }
    }
    return result;
}

async function seedDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced. Seeding global recruitment data from CSV...');

        const adminPassword = await bcrypt.hash('AdminPass123!', 12);
        const applicantPassword = await bcrypt.hash('ApplicantPass123!', 12);

        // 1. Seed Core Identity
        await User.create({
            fullName: 'Global System Admin',
            email: 'admin@careercurator.com',
            passwordHash: adminPassword,
            role: CONSTANTS.ROLES.ADMIN,
            isVerified: true,
        });

        for (let i = 1; i <= 3; i++) {
            await User.create({
                fullName: `Global Applicant ${i}`,
                email: `applicant${i}@example.com`,
                passwordHash: applicantPassword,
                role: CONSTANTS.ROLES.APPLICANT,
                isVerified: true,
            });
        }

        // 2. Seed Financial Rails
        await BankAccount.create({
            bankName: 'International Settlement Bank',
            accountNumber: 'GB12ISB80000',
            accountType: CONSTANTS.BANK_ACCOUNT_TYPES.OPEN_BENEFICIARY,
            routingCode: 'ISB88',
        });

        await BankAccount.create({
            bankName: 'Global High-Yield Capital',
            accountNumber: 'CH99GHYC5000',
            accountType: CONSTANTS.BANK_ACCOUNT_TYPES.NORMAL,
            routingCode: 'GHYC22',
        });

        await CryptoWallet.create({
            displayLabel: 'Corporate Settlement (USDT)',
            currencyName: CONSTANTS.CRYPTO_TYPES.USDT,
            networkType: CONSTANTS.CRYPTO_NETWORKS.TRC20,
            walletAddress: 'TYhc6R6pS3Y1s8vX2a9zB4mN7kL3p9qR',
            isActive: true,
        });

        // 3. Load CSV Data
        const csvPath = path.join(__dirname, 'FIFO JOBS.csv');
        if (!fs.existsSync(csvPath)) {
            console.error(`CSV file not found at ${csvPath}.`);
            return;
        }
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const rows = parseCSV(csvContent);

        // 4. Seed Categories
        const categoryMap = {};
        const uniqueCategories = Array.from(new Set(rows.map(r => r[0])));
        
        for (const catName of uniqueCategories) {
            const cat = await JobCategory.create({ name: catName, description: `Specialized roles in ${catName}` });
            categoryMap[catName] = cat;
        }

        // 5. Generic Pipeline Stages (Templates)
        const genericStages = [
            { name: 'Identity & Initial Screening', description: 'Review of professional credentials and government-issued identity.', orderPosition: 1, requiresPayment: false },
            { name: 'Background Verification Payment', description: 'Third-party investigation including criminal and credit history.', orderPosition: 2, requiresPayment: true, amount: 250 },
            { name: 'Technical Simulation', description: 'Remote assessment of specialized skills or flight simulator session.', orderPosition: 3, requiresPayment: false },
            { name: 'Compliance & Medical Review', description: 'Final medical clearance and visa eligibility assessment.', orderPosition: 4, requiresPayment: true, amount: 450 }
        ];

        // 6. Seed Jobs from CSV
        for (const row of rows) {
            const [category, title, salary, benefitsStr, requirementsStr] = row;

            const job = await JobListing.create({
                title,
                description: `Join our team as a ${title}. This role offers competitive remuneration and a stable work environment within the ${category} sector.`,
                location: 'Various Regional Locations (FIFO)',
                employmentType: 'Full-Time',
                requirements: requirementsStr,
                company: 'Global Resources Group',
                salary,
                visaSponsorship: true,
                categoryId: categoryMap[category].id,
                isActive: true,
                stages: genericStages.map(s => ({
                    ...s,
                    currency: 'USD',
                    instructions: s.requiresPayment ? `Please complete the ${s.name} by transferring the required fee to our secure settlement accounts.` : `Please complete the ${s.name} as per the instructions provided in your dashboard.`
                }))
            });

            // Add dynamic benefit based on CSV content
            if (benefitsStr) {
                const ben = await JobBenefit.create({ 
                    benefitType: 'Employment Perks', 
                    description: benefitsStr.substring(0, 250),
                    categoryId: categoryMap[category].id
                });
                await job.addJobBenefit(ben);
            }

            // Add dynamic condition based on CSV requirements
            const cond = await JobCondition.create({ 
                name: 'Operational Requirements', 
                description: requirementsStr.split('.')[0] + '.',
                categoryId: categoryMap[category].id
            });
            await job.addJobCondition(cond);
        }

        console.log(`Seeding completed successfully! ${rows.length} FIFO Jobs with pipelines created.`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();

import { sequelize, User, BankAccount, CryptoWallet, JobCategory, JobListing, JobBenefit, JobCondition } from './models';
import { CONSTANTS } from './constants';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

/**
 * Basic CSV Parser for quoted strings
 */
function parseCSV(content: string) {
    const lines = content.split(/\r?\n/);
    const result: string[][] = [];

    for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;

        const pattern = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
        const row: string[] = [];
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

export async function seedDatabase() {
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
    const csvPath = path.join(__dirname, '..', 'FIFO JOBS.csv');
    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found at ${csvPath}. Please ensure FIFO JOBS.csv is in the server root.`);
        return;
    }
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(csvContent);

    // 4. Seed Categories
    const categoryMap: any = {};
    const uniqueCategories = Array.from(new Set(rows.map(r => r[0])));

    for (const catName of uniqueCategories) {
        const cat = await JobCategory.create({ name: catName, description: `Specialized roles in ${catName}` });
        categoryMap[catName] = cat;
    }

    // 5. Generic Pipeline Stages (Templates)


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

        });

        // Add dynamic benefit based on CSV content
        if (benefitsStr) {
            const ben = await JobBenefit.create({
                benefitType: 'Employment Perks',
                description: benefitsStr.substring(0, 250) // Truncate if too long for simple model
            });
            await (job as any).addJobBenefit(ben);
        }

        // Add dynamic condition based on CSV requirements
        const cond = await JobCondition.create({
            name: 'Operational Requirements',
            description: requirementsStr.split('.')[0] + '.' // Just the first sentence for a label
        });
        await (job as any).addJobCondition(cond);
    }

    console.log(`Seeding completed successfully! ${rows.length} FIFO Jobs with pipelines created.`);
}

seedDatabase().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});



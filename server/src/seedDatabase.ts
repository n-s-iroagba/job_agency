import { sequelize, User, BankAccount, CryptoWallet, JobCategory, JobListing, JobBenefit, JobCondition } from './models';
import { CONSTANTS } from './constants';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
    await sequelize.sync({ force: true });
    console.log('Database synced. Seeding global recruitment data with JSON pipeline templates...');

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

    // 3. Seed Industrial Sectors (Categories)
    const sectors = [
        { name: 'Energy & Resources', description: 'Oil, Gas, and Renewable Energy operations.' },
        { name: 'Maritime & Logistics', description: 'Global shipping and port management.' },
        { name: 'Aerospace & Aviation', description: 'Commercial aviation and aerospace engineering.' },
        { name: 'Healthcare & Life Sciences', description: 'Specialized healthcare and clinical research.' },
        { name: 'Technology & Innovation', description: 'Global infrastructure and digital transformation.' },
        { name: 'Infrastructure & Construction', description: 'Civil engineering and mega-projects.' },
        { name: 'Global Trade & Manufacturing', description: 'Supply chain and industrial automation.' }
    ];

    const categoryMap: any = {};
    for (const sector of sectors) {
        const cat = await JobCategory.create(sector);
        categoryMap[sector.name] = cat;
    }

    // 4. Global Benefits & Conditions
    const benHealth = await JobBenefit.create({ benefitType: 'Global Health Premium', description: 'Full international health and dental coverage for family.' });
    const benRelo = await JobBenefit.create({ benefitType: 'Relocation Package', description: 'Complete relocation assistance including housing search and flights.' });
    const benFlight = await JobBenefit.create({ benefitType: 'Annual Home Flight', description: 'Business class annual return flights to country of origin.' });

    const condVisa = await JobCondition.create({ name: 'International Work Rights', description: 'Must be eligible for a work visa in the destination country.' });
    const condCert = await JobCondition.create({ name: 'Sector Certification', description: 'Mandatory industry-standard certification for high-risk roles.' });
    const condLang = await JobCondition.create({ name: 'English Proficiency', description: 'Minimum IELTS 7.5 or equivalent professional proficiency.' });

    // 5. Seed 7 Realistic Global Jobs
    const jobs = [
        {
            title: 'Drilling Operations Manager',
            description: 'Oversee offshore drilling operations in the Gulf of Mexico. This role requires extensive experience in deep-water pressure management and safety protocols.',
            location: 'Houston / Offshore',
            employmentType: 'Full-Time',
            requirements: '10+ years in Petrophysical engineering; Deep-water certification.',
            company: 'Oceanic Energy Corp',
            salary: '$180,000 - $240,000',
            visaSponsorship: true,
            category: 'Energy & Resources'
        },
        {
            title: 'Chief Marine Engineer',
            description: 'Lead engineering department on a 20,000 TEU container vessel. Responsible for main propulsion and auxiliary systems during global transits.',
            location: 'Global (Vessel-Based)',
            employmentType: 'Contract',
            requirements: 'Class 1 Marine Engineer Certificate of Competency.',
            company: 'Maersk Liner Services',
            salary: '$12,000 - $15,000 / month',
            visaSponsorship: false,
            category: 'Maritime & Logistics'
        },
        {
            title: 'Senior First Officer (B787)',
            description: 'Operate long-haul international routes. Ensuring passenger safety and following strict global EASA/FAA regulations.',
            location: 'London Heathrow Base',
            employmentType: 'Full-Time',
            requirements: '5,000+ flight hours; Valid ATPL license.',
            company: 'British Global Airways',
            salary: '£95,000 - £110,000',
            visaSponsorship: true,
            category: 'Aerospace & Aviation'
        },
        {
            title: 'Critical Care Specialist Nurse',
            description: 'Provide advanced life support in a state-of-the-art ICU environment. Role includes mentoring junior nurses and managing patient technology.',
            location: 'Riyadh, Saudi Arabia',
            employmentType: 'Full-Time',
            requirements: 'Registered Nurse; 5+ years in Critical Care; Post-grad specialization.',
            company: 'King Faisal Specialist Hospital',
            salary: '$60,000 - $85,000 (Tax Free)',
            visaSponsorship: true,
            category: 'Healthcare & Life Sciences'
        },
        {
            title: 'Global Infrastructure Architect',
            description: 'Design and implement hybrid cloud infrastructure for a multinational organization with nodes in 45 countries.',
            location: 'Dubai / Remote Flex',
            employmentType: 'Full-Time',
            requirements: 'Expertise in Azure/AWS; Multi-regional network design experience.',
            company: 'NexaCore Global',
            salary: '$140,000 - $175,000',
            visaSponsorship: true,
            category: 'Technology & Innovation'
        },
        {
            title: 'Mega-Project Director',
            description: 'Direct a $2B infrastructure project including tunnel boring and urban station construction in a dense metropolitan area.',
            location: 'Singapore',
            employmentType: 'Full-Time',
            requirements: 'Chartered Engineer; Experience in projects >$500M.',
            company: 'LTA Engineering Partners',
            salary: '$250,000 - $320,000 SGD',
            visaSponsorship: true,
            category: 'Infrastructure & Construction'
        },
        {
            title: 'Global Supply Chain Lead',
            description: 'Optimize manufacturing throughput across European and Asian production hubs. implementing AI-driven logistics models.',
            location: 'Berlin, Germany',
            employmentType: 'Full-Time',
            requirements: 'Master’s in Supply Chain Mgmt; Expert in SAP S/4HANA.',
            company: 'Siemens Industrial Automation',
            salary: '€90,000 - €120,000',
            visaSponsorship: true,
            category: 'Global Trade & Manufacturing'
        }
    ];

    const genericStages = [
        { name: 'Identity & Initial Screening', description: 'Review of professional credentials and government-issued identity.', orderPosition: 1, requiresPayment: false },
        { name: 'Background Verification Payment', description: 'Third-party investigation including criminal and credit history.', orderPosition: 2, requiresPayment: true, amount: 250 },
        { name: 'Technical Simulation', description: 'Remote assessment of specialized skills or flight simulator session.', orderPosition: 3, requiresPayment: false },
        { name: 'Compliance & Medical Review', description: 'Final medical clearance and visa eligibility assessment.', orderPosition: 4, requiresPayment: true, amount: 450 }
    ];

    for (const jobData of jobs) {
        const job = await JobListing.create({
            title: jobData.title,
            description: jobData.description,
            location: jobData.location,
            employmentType: jobData.employmentType,
            requirements: jobData.requirements,
            company: jobData.company,
            salary: jobData.salary,
            visaSponsorship: jobData.visaSponsorship,
            categoryId: categoryMap[jobData.category].id,
            isActive: true,
            stages: genericStages.map(s => ({
                ...s,
                currency: 'USD',
                instructions: s.requiresPayment ? `Please complete the ${s.name} by transferring the required fee to our secure settlement accounts.` : `Please complete the ${s.name} as per the instructions provided in your dashboard.`
            }))
        });

        // Link Benefits & Conditions
        await (job as any).addJobBenefit(benHealth);
        await (job as any).addJobBenefit(benRelo);
        if (jobData.visaSponsorship) {
            await (job as any).addJobBenefit(benFlight);
            await (job as any).addJobCondition(condVisa);
        }
        await (job as any).addJobCondition(condCert);
        await (job as any).addJobCondition(condLang);
    }

    console.log('Seeding completed successfully! 7 Global Jobs with pipelines created.');
}

// import { sequelize, User, BankAccount, CryptoWallet, JobCategory, JobListing, JobBenefit, JobCondition } from './models';
// import { CONSTANTS } from './constants';
// import bcrypt from 'bcrypt';
// import fs from 'fs';
// import path from 'path';

// /**
//  * Basic CSV Parser for quoted strings
//  */
// function parseCSV(content: string) {
//     const lines = content.split(/\r?\n/);
//     const result: string[][] = [];

//     for (let i = 1; i < lines.length; i++) { // Skip header
//         const line = lines[i].trim();
//         if (!line) continue;

//         const pattern = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
//         const row: string[] = [];
//         let match;

//         while ((match = pattern.exec(line)) !== null) {
//             let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
//             row.push(val);
//             if (match.index === pattern.lastIndex) pattern.lastIndex++;
//         }
//         // Patch for trailing empty columns if any
//         if (line.endsWith(',')) row.push('');

//         if (row.length >= 5) {
//             result.push(row.slice(0, 5));
//         }
//     }
//     return result;
// }

// export async function seedDatabase() {
//     await sequelize.sync({ force: true });

//     const csvPath = path.join(__dirname, '..', 'FIFO JOBS.csv');
//     if (!fs.existsSync(csvPath)) {
//         console.error(`CSV file not found at ${csvPath}. Please ensure FIFO JOBS.csv is in the server root.`);
//         return;
//     }
//     const csvContent = fs.readFileSync(csvPath, 'utf8');
//     const rows = parseCSV(csvContent);

//     // 4. Seed Categories
//     const categoryMap: any = {};
//     const uniqueCategories = Array.from(new Set(rows.map(r => r[0])));

//     for (const catName of uniqueCategories) {
//         const cat = await JobCategory.create({ name: catName, description: `Specialized roles in ${catName}` });
//         categoryMap[catName] = cat;
//     }

//     // 5. Generic Pipeline Stages (Templates)


//     // 6. Seed Jobs from CSV
//     for (const row of rows) {
//         const [category, title, salary, benefitsStr, requirementsStr] = row;

//         const job = await JobListing.create({
//             title,
//             description: `Join our team as a ${title}. This role offers competitive remuneration and a stable work environment within the ${category} sector.`,
//             location: 'Various Regional Locations (FIFO)',
//             employmentType: 'Full-Time',
//             requirements: requirementsStr,
//             company: 'Global Resources Group',
//             salary,
//             visaSponsorship: true,
//             categoryId: categoryMap[category].id,
//             isActive: true,

//         });

//         // Add dynamic benefit based on CSV content
//         if (benefitsStr) {
//             const ben = await JobBenefit.create({
//                 benefitType: 'Employment Perks',
//                 description: benefitsStr.substring(0, 250) // Truncate if too long for simple model
//             });
//             await (job as any).addJobBenefit(ben);
//         }

//         // Add dynamic condition based on CSV requirements
//         const cond = await JobCondition.create({
//             name: 'Operational Requirements',
//             description: requirementsStr.split('.')[0] + '.' // Just the first sentence for a label
//         });
//         await (job as any).addJobCondition(cond);
//     }

//     console.log(`Seeding completed successfully! ${rows.length} FIFO Jobs with pipelines created.`);
// }

// seedDatabase().catch(err => {
//     console.error('Seeding failed:', err);
//     process.exit(1);
// });


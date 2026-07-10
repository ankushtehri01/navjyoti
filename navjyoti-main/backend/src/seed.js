/**
 * Idempotent database seed: bootstrap admin, loan categories, and starter FAQs.
 * Run with `npm run seed`.
 */
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { User } from './models/user.model.js';
import { LoanCategory } from './models/loanCategory.model.js';
import { FAQ } from './models/faq.model.js';

const CATEGORIES = [
  { name: 'Personal Loan', tagline: 'Funds for any personal need', icon: 'personal', minAmount: 50000, maxAmount: 4000000, minTenureMonths: 6, maxTenureMonths: 60, interestRateMin: 10.5, interestRateMax: 18, order: 1 },
  { name: 'Business Loan', tagline: 'Fuel your growth', icon: 'business', minAmount: 100000, maxAmount: 20000000, minTenureMonths: 12, maxTenureMonths: 84, interestRateMin: 14, interestRateMax: 22, order: 2 },
  { name: 'Home Loan', tagline: 'Own your dream home', icon: 'home', minAmount: 500000, maxAmount: 100000000, minTenureMonths: 60, maxTenureMonths: 360, interestRateMin: 8.4, interestRateMax: 11, order: 3 },
  { name: 'Car Loan', tagline: 'Drive home your car', icon: 'car', minAmount: 100000, maxAmount: 5000000, minTenureMonths: 12, maxTenureMonths: 84, interestRateMin: 9.2, interestRateMax: 13, order: 4 },
  { name: 'Education Loan', tagline: 'Invest in your future', icon: 'education', minAmount: 50000, maxAmount: 7500000, minTenureMonths: 12, maxTenureMonths: 180, interestRateMin: 9.8, interestRateMax: 14, order: 5 },
  { name: 'Gold Loan', tagline: 'Unlock your gold’s value', icon: 'gold', minAmount: 10000, maxAmount: 2500000, minTenureMonths: 3, maxTenureMonths: 36, interestRateMin: 8.9, interestRateMax: 15, order: 6 },
];

const FAQS = [
  { question: 'How long does loan approval take?', answer: 'Most applications are reviewed within a few hours, with disbursal typically in 24–48 hours.', category: 'General', order: 1 },
  { question: 'What documents do I need?', answer: 'A government ID (Aadhaar/PAN), address proof, and income proof. Requirements vary by loan type.', category: 'General', order: 2 },
  { question: 'Are there hidden charges?', answer: 'No. All fees are disclosed upfront before you accept any offer.', category: 'General', order: 3 },
];

const run = async () => {
  await connectDatabase();

  // Admin
  const existingAdmin = await User.findOne({ email: env.seed.adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: env.seed.adminName,
      email: env.seed.adminEmail,
      password: env.seed.adminPassword,
      role: 'admin',
    });
    logger.info(`Seeded admin: ${env.seed.adminEmail}`);
  } else {
    logger.info('Admin already exists — skipping');
  }

  // Loan categories (upsert by name)
  for (const cat of CATEGORIES) {
    const exists = await LoanCategory.findOne({ name: cat.name });
    if (!exists) await LoanCategory.create(cat);
  }
  logger.info(`Ensured ${CATEGORIES.length} loan categories`);

  // FAQs
  for (const faq of FAQS) {
    const exists = await FAQ.findOne({ question: faq.question });
    if (!exists) await FAQ.create(faq);
  }
  logger.info(`Ensured ${FAQS.length} FAQs`);

  await disconnectDatabase();
  logger.info('Seed complete.');
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Seed failed: ${err.message}`);
  process.exit(1);
});

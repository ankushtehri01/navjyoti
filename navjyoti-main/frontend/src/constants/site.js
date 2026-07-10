/**
 * Static public-site content (nav, marketing data, footer).
 * Centralized so copy lives in one place; can later be sourced from Settings API.
 */
import {
  FiUser, FiBriefcase, FiHome, FiTruck, FiBookOpen, FiCircle,
  FiCreditCard, FiShield, FiTrendingUp, FiPercent, FiFileText, FiSearch,
  FiZap, FiLock, FiClock, FiThumbsUp, FiHeadphones, FiAward,
} from 'react-icons/fi';
import { ROUTES } from './routes.js';

/** Single source of truth for contact details — used by Footer, Contact
 * section, and the floating contact widget. */
export const CONTACT = Object.freeze({
  email: 'support@navjyoti.com',
  phone: '+911800000000',
  phoneDisplay: '1800-000-000',
  address: 'Bengaluru, India',
});

export const LOAN_CATEGORIES = [
  { key: 'personal', name: 'Personal Loan', icon: FiUser, to: ROUTES.LOAN_PERSONAL, desc: 'Instant funds for any personal need, minimal paperwork.', rate: '10.5%' },
  { key: 'business', name: 'Business Loan', icon: FiBriefcase, to: ROUTES.LOAN_BUSINESS, desc: 'Fuel growth with flexible working-capital finance.', rate: '14%' },
  { key: 'home', name: 'Home Loan', icon: FiHome, to: ROUTES.LOAN_HOME, desc: 'Own your dream home with low EMIs and long tenure.', rate: '8.4%' },
  { key: 'car', name: 'Car Loan', icon: FiTruck, to: ROUTES.LOAN_CAR, desc: 'Drive home your car with up to 100% on-road funding.', rate: '9.2%' },
  { key: 'education', name: 'Education Loan', icon: FiBookOpen, to: ROUTES.LOAN_EDUCATION, desc: 'Invest in a future without financial limits.', rate: '9.8%' },
  { key: 'gold', name: 'Gold Loan', icon: FiCircle, to: ROUTES.LOAN_GOLD, desc: 'Unlock the value of your gold in minutes.', rate: '8.9%' },
];

export const FINANCE_SERVICES = [
  { key: 'cards', name: 'Credit Cards', icon: FiCreditCard, to: ROUTES.CREDIT_CARDS, desc: 'Premium cards with rewards, cashback, and zero-fee options.' },
  { key: 'insurance', name: 'Insurance', icon: FiShield, to: ROUTES.INSURANCE, desc: 'Protect what matters with life, health, and asset cover.' },
  { key: 'investments', name: 'Investments', icon: FiTrendingUp, to: ROUTES.INVESTMENTS, desc: 'Grow wealth with curated mutual funds and plans.' },
  { key: 'emi', name: 'EMI Calculator', icon: FiPercent, to: ROUTES.EMI_CALCULATOR, desc: 'Plan repayments with an instant, accurate EMI estimate.' },
  { key: 'eligibility', name: 'Eligibility Check', icon: FiSearch, to: ROUTES.ELIGIBILITY_CALCULATOR, desc: 'Know how much you qualify for in seconds.' },
  { key: 'consult', name: 'Financial Consultation', icon: FiFileText, to: ROUTES.CONTACT, desc: 'Talk to experts for a tailored financial roadmap.' },
];

export const WHY_CHOOSE = [
  { icon: FiZap, title: 'Fast Approvals', desc: 'Get sanctioned in minutes with our digital-first process.' },
  { icon: FiLock, title: 'Bank-grade Security', desc: 'Your data is encrypted end-to-end and never shared.' },
  { icon: FiPercent, title: 'Transparent Rates', desc: 'No hidden charges — see every fee upfront.' },
  { icon: FiClock, title: 'Real-time Tracking', desc: 'Follow your application status at every step.' },
  { icon: FiHeadphones, title: 'Dedicated Support', desc: 'Human help whenever you need it, 7 days a week.' },
  { icon: FiThumbsUp, title: 'Trusted by Thousands', desc: 'Rated highly by customers across the country.' },
];

export const LOAN_PROCESS = [
  { step: '01', title: 'Apply Online', desc: 'Fill a simple form and pick your loan type.' },
  { step: '02', title: 'Upload Documents', desc: 'Securely submit your KYC and income proofs.' },
  { step: '03', title: 'Get Approved', desc: 'Our team reviews and sanctions your loan fast.' },
  { step: '04', title: 'Receive Funds', desc: 'Money is disbursed straight to your account.' },
];

export const STATS = [
  { value: 1200, prefix: '₹', suffix: ' Cr+', label: 'Loans Disbursed', icon: FiTrendingUp },
  { value: 50000, suffix: '+', label: 'Happy Customers', icon: FiThumbsUp },
  { value: 40, suffix: '+', label: 'Partner Banks', icon: FiAward },
  { value: 15, suffix: '+', label: 'Years of Trust', icon: FiClock },
];

export const TESTIMONIALS = [
  { name: 'Ananya Sharma', role: 'Small Business Owner', rating: 5, message: 'Nav Jyoti funded my working capital in under 48 hours. The process was effortless and transparent.' },
  { name: 'Rohit Mehta', role: 'Software Engineer', rating: 5, message: 'Got my home loan at a rate no one else could match. The team guided me through every step.' },
  { name: 'Priya Nair', role: 'Doctor', rating: 5, message: 'The EMI calculator and quick approval saved me so much time. Highly recommend their service.' },
  { name: 'Vikram Singh', role: 'Retailer', rating: 4, message: 'Transparent, fast, and genuinely helpful support. My gold loan was processed the same day.' },
];

export const PARTNER_BANKS = [
  'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI', 'Kotak', 'Yes Bank',
  'IndusInd', 'Federal Bank', 'Bajaj Finserv', 'IDFC First',
];

export const HOME_FAQS = [
  { q: 'How long does loan approval take?', a: 'Most applications are reviewed within a few hours. Once approved, funds are typically disbursed within 24–48 hours.' },
  { q: 'What documents do I need to apply?', a: 'Generally a government ID (Aadhaar/PAN), address proof, and income proof (salary slips or bank statements). Requirements vary by loan type.' },
  { q: 'Are there any hidden charges?', a: 'No. We show all fees — processing charges, interest, and taxes — upfront before you accept any offer.' },
  { q: 'Can I prepay or foreclose my loan?', a: 'Yes. You can prepay or foreclose anytime. Applicable charges, if any, are disclosed transparently in your agreement.' },
  { q: 'Is my personal information safe?', a: 'Absolutely. We use bank-grade encryption and never share your data with third parties without consent.' },
];

export const NAV_LINKS = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'About', to: ROUTES.ABOUT },
  {
    label: 'Loans',
    children: LOAN_CATEGORIES.map((c) => ({ label: c.name, to: c.to, icon: c.icon })),
  },
  {
    label: 'Services',
    children: [
      { label: 'Credit Cards', to: ROUTES.CREDIT_CARDS, icon: FiCreditCard },
      { label: 'Insurance', to: ROUTES.INSURANCE, icon: FiShield },
      { label: 'Investments', to: ROUTES.INVESTMENTS, icon: FiTrendingUp },
      { label: 'EMI Calculator', to: ROUTES.EMI_CALCULATOR, icon: FiPercent },
      { label: 'Eligibility Check', to: ROUTES.ELIGIBILITY_CALCULATOR, icon: FiSearch },
    ],
  },
  { label: 'Blogs', to: ROUTES.BLOGS },
  { label: 'Contact', to: ROUTES.CONTACT },
];

export const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: ROUTES.ABOUT },
      { label: 'Services', to: ROUTES.SERVICES },
      { label: 'Blogs', to: ROUTES.BLOGS },
      { label: 'Contact', to: ROUTES.CONTACT },
    ],
  },
  {
    title: 'Loans',
    links: LOAN_CATEGORIES.slice(0, 5).map((c) => ({ label: c.name, to: c.to })),
  },
  {
    title: 'Resources',
    links: [
      { label: 'EMI Calculator', to: ROUTES.EMI_CALCULATOR },
      { label: 'Eligibility Check', to: ROUTES.ELIGIBILITY_CALCULATOR },
      { label: 'FAQ', to: ROUTES.FAQ },
      { label: 'Testimonials', to: ROUTES.TESTIMONIALS },
    ],
  },
];

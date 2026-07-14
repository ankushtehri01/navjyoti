import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck, FiChevronRight, FiHome, FiMail, FiMapPin, FiPhone, FiShield, FiTrendingUp, FiUser } from 'react-icons/fi';
import BrandLogo from '@/components/common/BrandLogo.jsx';
import { Input, Textarea } from '@/components/ui';
import { ROUTES } from '@/constants/routes.js';
import { fundingInquiryService } from '@/services/fundingInquiry.service.js';

const FUNDING_OPTIONS = [
  { value: 'business_loan', label: 'Business Loan', desc: 'Growth capital for established businesses.', Icon: FiBriefcase },
  { value: 'working_capital', label: 'Working Capital', desc: 'Keep your operating cycle funded.', Icon: FiTrendingUp },
  { value: 'project_funding', label: 'Project Funding', desc: 'Finance for expansion, capex, and new projects.', Icon: FiBriefcase },
  { value: 'secured_loan', label: 'Secured Loan', desc: 'Funding against property or other assets.', Icon: FiShield },
  { value: 'home_loan', label: 'Home Loan', desc: 'Purchase, balance transfer, or top-up funding.', Icon: FiHome },
  { value: 'personal_loan', label: 'Personal Loan', desc: 'Flexible finance for your personal goals.', Icon: FiUser },
];
const AMOUNT_RANGES = ['Up to ₹25 Lakh', '₹25 Lakh to ₹1 Crore', '₹1 Crore to ₹5 Crore', '₹5 Crore to ₹25 Crore', 'Above ₹25 Crore'];
const PROFILES = [
  { value: 'business_owner', label: 'Business Owner / MSME', Icon: FiBriefcase },
  { value: 'salaried', label: 'Salaried Professional', Icon: FiUser },
  { value: 'self_employed', label: 'Self-employed Professional', Icon: FiTrendingUp },
  { value: 'partner_other', label: 'Channel Partner / Other', Icon: FiUser },
];

const SelectionCard = ({ option, selected, onSelect, compact = false }) => {
  const Icon = option.Icon;
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${selected ? 'border-[#d9a72f] bg-[#19375a] shadow-lg shadow-[#d9a72f]/10' : 'border-white/15 bg-white/[0.045] hover:border-[#d9a72f]/60 hover:bg-white/[0.08]'}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d9a72f]/15 text-[#e2b13c]"><Icon size={20} /></span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{option.label}</span>{!compact && <span className="mt-1 block text-xs leading-snug text-slate-400">{option.desc}</span>}</span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-[#e5b439] bg-[#e5b439] text-[#0a2545]' : 'border-slate-500'}`}>{selected && <FiCheck size={13} strokeWidth={3} />}</span>
    </button>
  );
};

const FundingWizardPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fundingNeed, setFundingNeed] = useState(null);
  const [amountRange, setAmountRange] = useState('');
  const [profile, setProfile] = useState(null);
  const [details, setDetails] = useState({ name: '', email: '', phone: '', city: '', companyName: '', note: '' });
  const [errors, setErrors] = useState({});
  const [reference, setReference] = useState('');
  const submit = useMutation({
    mutationFn: fundingInquiryService.create,
    onSuccess: (data) => { setReference(data?.inquiryNumber || ''); toast.success('Your funding request has been submitted.'); setStep(5); },
    onError: (error) => toast.error(error.message),
  });
  const selectedFunding = FUNDING_OPTIONS.find((item) => item.value === fundingNeed);
  const selectedProfile = PROFILES.find((item) => item.value === profile);
  const selectAndAdvance = (setValue, value) => {
    setValue(value);
    setStep((current) => Math.min(current + 1, 4));
  };
  const updateDetail = (key) => (event) => { setDetails((current) => ({ ...current, [key]: event.target.value })); setErrors((current) => ({ ...current, [key]: '' })); };
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!details.name.trim()) nextErrors.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(details.email)) nextErrors.email = 'Please enter a valid email';
    if (details.phone.replace(/\D/g, '').length < 8) nextErrors.phone = 'Please enter a valid phone number';
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    submit.mutate({ fundingNeed, fundingNeedLabel: selectedFunding.label, amountRange, applicantProfile: profile, applicantProfileLabel: selectedProfile.label, ...details });
  };
  const title = step === 1 ? 'What do you need funding for?' : step === 2 ? 'How much funding do you need?' : step === 3 ? 'Tell us about you' : 'Almost there — share your details';
  const subtitle = step === 1 ? 'Pick the option closest to your requirement. Our advisor will fine-tune it with you.' : step === 2 ? 'An approximate range is absolutely fine.' : step === 3 ? 'This helps us match you with the right funding specialist.' : 'We will review your request and contact you with the next steps.';

  return (
    <div className="min-h-screen bg-[#071f3d] text-white">
      <header className="border-b border-white/10 bg-[#0b2749]"><div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8"><Link to={ROUTES.HOME} className="flex items-center gap-3" aria-label="Nav Jyoti home"><BrandLogo className="h-12 w-12 rounded-full" /><span className="font-display text-lg font-extrabold tracking-wide">NAVJYOTI</span></Link><button type="button" onClick={() => navigate(ROUTES.HOME)} className="focus-ring rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/40 hover:text-white">Back to home</button></div>{step <= 4 && <div className="h-1 bg-white/15"><div className="h-full bg-[#d9a72f] transition-all duration-300" style={{ width: `${step * 25}%` }} /></div>}</header>
      <main className="mx-auto flex min-h-[calc(100vh-84px)] max-w-4xl flex-col px-5 py-10 sm:px-8 sm:py-14">
        {step <= 4 ? <>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#dfad38]">Step {step} of 4</p>
          <section className="mx-auto w-full max-w-2xl pt-12 sm:pt-16"><h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{title}</h1><p className="mt-3 max-w-xl text-base text-slate-300">{subtitle}</p>
            {step === 1 && <div className="mt-8 grid gap-3 sm:grid-cols-2">{FUNDING_OPTIONS.map((option) => <SelectionCard key={option.value} option={option} selected={fundingNeed === option.value} onSelect={() => selectAndAdvance(setFundingNeed, option.value)} />)}</div>}
            {step === 2 && <div className="mt-8 space-y-3">{AMOUNT_RANGES.map((range) => <SelectionCard key={range} compact option={{ label: range, Icon: FiTrendingUp }} selected={amountRange === range} onSelect={() => selectAndAdvance(setAmountRange, range)} />)}</div>}
            {step === 3 && <div className="mt-8 grid gap-3 sm:grid-cols-2">{PROFILES.map((option) => <SelectionCard key={option.value} compact option={option} selected={profile === option.value} onSelect={() => selectAndAdvance(setProfile, option.value)} />)}</div>}
            {step === 4 && <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6"><div className="rounded-2xl border border-[#d9a72f]/45 bg-white/[0.045] p-5"><p className="text-sm font-bold text-white">Your funding request</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{[['Funding for', selectedFunding?.label], ['Amount needed', amountRange], ['Your profile', selectedProfile?.label]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#102d50] p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-white">{value}</p></div>)}</div></div><div className="grid gap-4 sm:grid-cols-2"><Input label="Full name" placeholder="Your full name" value={details.name} onChange={updateDetail('name')} error={errors.name} /><Input label="Phone number" type="tel" placeholder="98765 43210" value={details.phone} onChange={updateDetail('phone')} error={errors.phone} leftIcon={<FiPhone size={17} />} /><Input label="Email address" type="email" placeholder="you@example.com" value={details.email} onChange={updateDetail('email')} error={errors.email} leftIcon={<FiMail size={17} />} /><Input label="City (optional)" placeholder="Your city" value={details.city} onChange={updateDetail('city')} leftIcon={<FiMapPin size={17} />} /><Input label="Company / business name (optional)" placeholder="Your company name" value={details.companyName} onChange={updateDetail('companyName')} containerClassName="sm:col-span-2" /><Textarea label="Anything else we should know? (optional)" placeholder="Tell us a little more about your funding requirement" value={details.note} onChange={updateDetail('note')} containerClassName="sm:col-span-2" rows={3} /></div><div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6"><button type="button" onClick={() => setStep(3)} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-bold text-slate-200 hover:border-white/40"><FiArrowLeft /> Back</button><button type="submit" disabled={submit.isPending} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#d9a72f] px-5 py-3 text-sm font-extrabold text-[#092241] shadow-lg shadow-[#d9a72f]/20 transition hover:bg-[#ebbe4d] disabled:cursor-not-allowed disabled:opacity-60">{submit.isPending ? 'Submitting…' : 'Submit request'} <FiArrowRight /></button></div></form>}
          </section>
          {step < 4 && <div className="mt-auto flex items-center justify-between gap-4 pt-12"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-white/40 disabled:invisible"><FiArrowLeft /> Back</button><p className="text-sm text-slate-400">Choose an option to continue</p></div>}
        </> : <section className="m-auto max-w-xl text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9a72f] text-[#092241]"><FiCheck size={32} strokeWidth={3} /></span><h1 className="mt-6 font-display text-4xl font-extrabold">Request received</h1><p className="mt-4 text-lg text-slate-300">Thank you, {details.name}. Our funding team will review your requirement and contact you shortly.</p>{reference && <p className="mt-5 text-sm text-[#e4ba52]">Reference: {reference}</p>}<Link to={ROUTES.HOME} className="focus-ring mt-8 inline-flex items-center gap-2 rounded-lg bg-[#d9a72f] px-5 py-3 text-sm font-extrabold text-[#092241] hover:bg-[#ebbe4d]">Return to home <FiArrowRight /></Link></section>}
      </main>
    </div>
  );
};

export default FundingWizardPage;

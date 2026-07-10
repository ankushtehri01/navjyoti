import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import { Card, Input, Select, Textarea, Button } from '@/components/ui';
import { applicationSchema } from '@/validators/applicationSchema.js';
import { applicationService } from '@/services/application.service.js';
import { loanCategoryService } from '@/services/loanCategory.service.js';
import { LOAN_CATEGORIES } from '@/constants/site.js';
import { EMPLOYMENT_TYPES } from '@/constants/status.js';
import { ROUTES } from '@/constants/routes.js';
import { calculateEMI } from '@/utils/emi.js';
import { formatCurrency } from '@/utils/format.js';

const STEPS = ['Loan Details', 'Your Profile', 'Review'];
const STEP_FIELDS = [
  ['category', 'amount', 'tenureMonths'],
  ['employmentType', 'monthlyIncome', 'companyName', 'purpose'],
];

const ApplyLoanPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const { data: catData } = useQuery({
    queryKey: ['loan-categories'],
    queryFn: () => loanCategoryService.list(),
    retry: false,
  });

  // Prefer live categories; fall back to static content so the form is usable.
  const categories = catData?.items?.length
    ? catData.items.map((c) => ({ value: c._id, label: c.name, rate: c.interestRateMin }))
    : LOAN_CATEGORIES.map((c) => ({ value: c.key, label: c.name, rate: parseFloat(c.rate) }));

  const {
    register,
    handleSubmit,
    trigger,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: { tenureMonths: 24, employmentType: '' },
  });

  // useWatch (vs watch()) is React-Compiler friendly for live-derived values.
  const [wCategory, wAmount, wTenure] = useWatch({
    control,
    name: ['category', 'amount', 'tenureMonths'],
  });
  const selectedRate = categories.find((c) => c.value === wCategory)?.rate ?? 12;
  const emi = useMemo(
    () => calculateEMI(wAmount, selectedRate, wTenure),
    [wAmount, wTenure, selectedRate]
  );

  const submit = useMutation({
    mutationFn: applicationService.create,
    onSuccess: (data) => {
      toast.success(`Application ${data?.applicationNumber || ''} submitted!`);
      navigate(ROUTES.DASHBOARD_APPLICATIONS);
    },
    onError: (e) => toast.error(e.message),
  });

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <>
      <PageHeader title="Apply for a Loan" subtitle="A few quick steps to get started." />

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                  i < step ? 'gradient-brand text-white' : i === step ? 'gradient-brand text-white' : 'glass text-slate-400'
                }`}
              >
                {i < step ? <FiCheck size={16} /> : i + 1}
              </span>
              <span className={`hidden text-sm font-medium sm:block ${i <= step ? 'text-white' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-3 h-px flex-1 ${i < step ? 'bg-brand-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit((v) => submit.mutate(v))} noValidate>
        <Card padding="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Loan type"
                    placeholder="Select a loan"
                    options={categories}
                    error={errors.category?.message}
                    {...register('category')}
                  />
                  <Input
                    label="Loan amount (₹)"
                    type="number"
                    placeholder="500000"
                    error={errors.amount?.message}
                    {...register('amount')}
                  />
                  <Input
                    label="Tenure (months)"
                    type="number"
                    placeholder="24"
                    error={errors.tenureMonths?.message}
                    {...register('tenureMonths')}
                  />
                  <div className="glass flex flex-col justify-center rounded-xl p-4">
                    <p className="text-xs text-slate-400">Estimated EMI @ {selectedRate}%</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(emi.emi)}<span className="text-sm text-slate-400">/mo</span></p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Employment type"
                    placeholder="Select"
                    options={EMPLOYMENT_TYPES}
                    error={errors.employmentType?.message}
                    {...register('employmentType')}
                  />
                  <Input
                    label="Monthly income (₹)"
                    type="number"
                    placeholder="80000"
                    error={errors.monthlyIncome?.message}
                    {...register('monthlyIncome')}
                  />
                  <Input
                    label="Company / Business name (optional)"
                    placeholder="Acme Corp"
                    error={errors.companyName?.message}
                    {...register('companyName')}
                  />
                  <Textarea
                    label="Purpose (optional)"
                    placeholder="What is this loan for?"
                    containerClassName="sm:col-span-2"
                    rows={3}
                    {...register('purpose')}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Review your application</h3>
                  {[
                    ['Loan type', categories.find((c) => c.value === getValues('category'))?.label || '—'],
                    ['Amount', formatCurrency(getValues('amount'))],
                    ['Tenure', `${getValues('tenureMonths')} months`],
                    ['Estimated EMI', `${formatCurrency(emi.emi)}/mo`],
                    ['Total payable', formatCurrency(emi.totalPayable)],
                    ['Employment', EMPLOYMENT_TYPES.find((e) => e.value === getValues('employmentType'))?.label || '—'],
                    ['Monthly income', formatCurrency(getValues('monthlyIncome'))],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-white/5 py-2.5 text-sm last:border-0">
                      <span className="text-slate-400">{k}</span>
                      <span className="font-medium text-white">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button type="submit" isLoading={submit.isPending}>
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </form>
    </>
  );
};

export default ApplyLoanPage;

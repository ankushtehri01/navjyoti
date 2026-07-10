import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import { forgotPasswordSchema } from '@/validators/authSchemas.js';
import { useAuth } from '@/hooks/useAuth.js';
import { ROUTES } from '@/constants/routes.js';

const ForgotPasswordPage = () => {
  const { forgotPassword, isForgot } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values) => {
    try {
      await forgotPassword(values);
      setSent(true);
    } catch {
      /* toast handled in hook */
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enter your email and we’ll send you a reset link.
        </p>
      </header>

      {sent ? (
        <div className="glass rounded-2xl p-6 text-sm text-slate-300">
          If an account exists for that email, a reset link is on its way. Check your inbox
          and spam folder.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            leftIcon={<FiMail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" fullWidth isLoading={isForgot}>
            Send Reset Link
          </Button>
        </form>
      )}

      <Link
        to={ROUTES.LOGIN}
        className="mt-6 inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200"
      >
        <FiArrowLeft size={14} /> Back to sign in
      </Link>
    </>
  );
};

export default ForgotPasswordPage;

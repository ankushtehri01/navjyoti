import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiPhone } from 'react-icons/fi';
import Input from '@/components/ui/Input.jsx';
import PasswordInput from '@/components/ui/PasswordInput.jsx';
import Button from '@/components/ui/Button.jsx';
import { registerSchema } from '@/validators/authSchemas.js';
import { useAuth } from '@/hooks/useAuth.js';
import { ROUTES } from '@/constants/routes.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ confirmPassword, ...payload }) => {
    void confirmPassword;
    try {
      await registerUser(payload);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      /* toast handled in hook */
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">
          Join Nav Jyoti and apply in minutes.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Full name"
          placeholder="Asha Rao"
          autoComplete="name"
          leftIcon={<FiUser size={16} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<FiMail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone (optional)"
          placeholder="9896704299"
          autoComplete="tel"
          leftIcon={<FiPhone size={16} />}
          error={errors.phone?.message}
          {...register('phone')}
        />
        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          hint="Min 8 chars, with upper, lower & a number."
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isRegistering}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-300 hover:text-brand-200">
          Sign in
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;

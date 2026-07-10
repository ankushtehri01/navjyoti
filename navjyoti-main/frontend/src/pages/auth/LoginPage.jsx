import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import Input from '@/components/ui/Input.jsx';
import PasswordInput from '@/components/ui/PasswordInput.jsx';
import Button from '@/components/ui/Button.jsx';
import { loginSchema } from '@/validators/authSchemas.js';
import { useAuth } from '@/hooks/useAuth.js';
import { ROUTES } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const { user } = await login(values);
      const fallback =
        user.role === ROLES.ADMIN || user.role === ROLES.EMPLOYEE
          ? ROUTES.ADMIN
          : ROUTES.DASHBOARD;
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch {
      /* toast handled in hook */
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to your Nav Jyoti account.</p>
      </header>

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
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-brand-300 hover:text-brand-200"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoggingIn}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-300 hover:text-brand-200">
          Create one
        </Link>
      </p>
    </>
  );
};

export default LoginPage;

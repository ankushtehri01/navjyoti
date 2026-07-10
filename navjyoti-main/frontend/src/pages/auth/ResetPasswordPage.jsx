import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PasswordInput from '@/components/ui/PasswordInput.jsx';
import Button from '@/components/ui/Button.jsx';
import { resetPasswordSchema } from '@/validators/authSchemas.js';
import { useAuth } from '@/hooks/useAuth.js';
import { ROUTES } from '@/constants/routes.js';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isResetting } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async ({ password }) => {
    try {
      await resetPassword({ token, password });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      /* toast handled in hook */
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-slate-400">
          Choose a strong password you haven’t used before.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <PasswordInput
          label="New password"
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
        <Button type="submit" fullWidth isLoading={isResetting}>
          Reset Password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered it?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-300 hover:text-brand-200">
          Sign in
        </Link>
      </p>
    </>
  );
};

export default ResetPasswordPage;

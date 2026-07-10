/**
 * Auth hook: exposes current auth state + mutations wired to Redux and toasts.
 * Keeps components declarative — they call login()/register()/logout() and
 * navigate on success.
 */
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service.js';
import { useAppDispatch, useAppSelector } from './redux.js';
import {
  setCredentials,
  logout as logoutAction,
  selectAuth,
} from '@/redux/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
    },
    onError: (err) => toast.error(err.message),
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
    },
    onError: (err) => toast.error(err.message),
  });

  const forgotMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => toast.success(data?.message || 'Check your email.'),
    onError: (err) => toast.error(err.message),
  });

  const resetMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => toast.success('Password reset. Please sign in.'),
    onError: (err) => toast.error(err.message),
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout — clear locally regardless
    }
    dispatch(logoutAction());
    toast.success('Signed out.');
  };

  return {
    ...auth,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    forgotPassword: forgotMutation.mutateAsync,
    resetPassword: resetMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isForgot: forgotMutation.isPending,
    isResetting: resetMutation.isPending,
  };
};

export default useAuth;

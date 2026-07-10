import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiCamera } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import { Card, Input, PasswordInput, Button } from '@/components/ui';
import { profileSchema, passwordSchema } from '@/validators/profileSchema.js';
import { userService } from '@/services/user.service.js';
import { useAuth } from '@/hooks/useAuth.js';
import { useAppDispatch } from '@/hooks/redux.js';
import { setUser } from '@/redux/slices/authSlice.js';

const initials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const fileRef = useRef(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const updateProfile = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: ({ user: updated }) => {
      dispatch(setUser(updated));
      toast.success('Profile updated.');
    },
    onError: (e) => toast.error(e.message),
  });

  const changePassword = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      toast.success('Password changed.');
      passwordForm.reset();
    },
    onError: (e) => toast.error(e.message),
  });

  const uploadAvatar = useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: ({ user: updated }) => {
      dispatch(setUser(updated));
      toast.success('Photo updated.');
    },
    onError: (e) => toast.error(e.message),
  });

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    uploadAvatar.mutate(fd);
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your account details and security." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <Card className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="gradient-brand flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                initials(user?.name)
              )}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change photo"
              className="glass-strong focus-ring absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-white"
            >
              <FiCamera size={15} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
          </div>
          <p className="mt-4 font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          {uploadAvatar.isPending && <p className="mt-2 text-xs text-brand-300">Uploading…</p>}
        </Card>

        {/* Details form */}
        <Card className="lg:col-span-2">
          <h3 className="mb-5 font-semibold text-white">Account details</h3>
          <form
            onSubmit={profileForm.handleSubmit((v) => updateProfile.mutate(v))}
            className="grid gap-5 sm:grid-cols-2"
            noValidate
          >
            <Input
              label="Full name"
              leftIcon={<FiUser size={16} />}
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name')}
            />
            <Input
              label="Phone"
              leftIcon={<FiPhone size={16} />}
              error={profileForm.formState.errors.phone?.message}
              {...profileForm.register('phone')}
            />
            <Input label="Email" value={user?.email || ''} disabled containerClassName="sm:col-span-2" />
            <Button type="submit" isLoading={updateProfile.isPending} className="sm:justify-self-start">
              Save changes
            </Button>
          </form>
        </Card>

        {/* Password form */}
        <Card className="lg:col-span-3">
          <h3 className="mb-5 font-semibold text-white">Change password</h3>
          <form
            onSubmit={passwordForm.handleSubmit((v) => changePassword.mutate(v))}
            className="grid gap-5 sm:grid-cols-3"
            noValidate
          >
            <PasswordInput
              label="Current password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />
            <PasswordInput
              label="New password"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')}
            />
            <PasswordInput
              label="Confirm password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')}
            />
            <Button type="submit" isLoading={changePassword.isPending} className="sm:justify-self-start">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;

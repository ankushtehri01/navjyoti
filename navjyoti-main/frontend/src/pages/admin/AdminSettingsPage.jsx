import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader.jsx';
import { Card, Input, Textarea, Checkbox, Button, Skeleton } from '@/components/ui';
import { settingsService } from '@/services/admin.js';

const AdminSettingsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => settingsService.get(),
    retry: false,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      siteName: '', tagline: '', supportEmail: '', supportPhone: '', address: '',
      socials: { facebook: '', twitter: '', linkedin: '', instagram: '' },
      maintenanceMode: false,
    },
  });

  useEffect(() => {
    if (data) reset({ ...data });
  }, [data, reset]);

  const save = useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => toast.success('Settings saved.'),
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <>
        <PageHeader title="Settings" subtitle="Manage site-wide configuration." />
        <Card><Skeleton className="h-64 w-full" /></Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage site-wide configuration and content." />
      <form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-6">
        <Card>
          <h3 className="mb-5 font-semibold text-white">General</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Site name" {...register('siteName')} />
            <Input label="Tagline" {...register('tagline')} />
            <Input label="Support email" type="email" {...register('supportEmail')} />
            <Input label="Support phone" {...register('supportPhone')} />
            <Textarea label="Address" containerClassName="sm:col-span-2" rows={2} {...register('address')} />
          </div>
        </Card>

        <Card>
          <h3 className="mb-5 font-semibold text-white">Social links</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Facebook" {...register('socials.facebook')} />
            <Input label="Twitter" {...register('socials.twitter')} />
            <Input label="LinkedIn" {...register('socials.linkedin')} />
            <Input label="Instagram" {...register('socials.instagram')} />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-white">Maintenance</h3>
          <Checkbox label="Enable maintenance mode (temporarily disable the public site)" {...register('maintenanceMode')} />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={save.isPending}>Save settings</Button>
        </div>
      </form>
    </>
  );
};

export default AdminSettingsPage;

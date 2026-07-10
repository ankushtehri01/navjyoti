/**
 * Schema-driven form used inside admin CRUD modals. Renders fields from a
 * config array with React Hook Form + Zod validation, so entity forms are
 * declarative. Field: { name, label, type, options?, placeholder?, colSpan?, hint?, createOnly? }
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea, Select, Checkbox, Button } from '@/components/ui';
import { cn } from '@/utils/cn.js';

const SimpleForm = ({ fields, schema, initialValues = {}, onSubmit, onCancel, submitting }) => {
  const isEditing = Boolean(initialValues?._id);

  const defaults = fields.reduce((acc, f) => {
    const val = initialValues[f.name];
    acc[f.name] = val ?? (f.type === 'checkbox' ? false : '');
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: schema ? zodResolver(schema) : undefined, defaultValues: defaults });

  const visibleFields = fields.filter((f) => !(f.createOnly && isEditing));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
      {visibleFields.map((f) => {
        const error = errors[f.name]?.message;
        const span = f.colSpan === 2 ? 'sm:col-span-2' : '';

        if (f.type === 'textarea') {
          return (
            <Textarea key={f.name} label={f.label} placeholder={f.placeholder} rows={f.rows || 4}
              error={error} hint={f.hint} containerClassName={span} {...register(f.name)} />
          );
        }
        if (f.type === 'select') {
          return (
            <Select key={f.name} label={f.label} placeholder={f.placeholder || 'Select'} options={f.options || []}
              error={error} containerClassName={span} {...register(f.name)} />
          );
        }
        if (f.type === 'checkbox') {
          return (
            <div key={f.name} className={cn('flex items-center', span)}>
              <Checkbox label={f.label} {...register(f.name)} />
            </div>
          );
        }
        return (
          <Input key={f.name} label={f.label} type={f.type || 'text'} placeholder={f.placeholder}
            error={error} hint={f.hint} containerClassName={span} {...register(f.name)} />
        );
      })}

      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={submitting}>
          {isEditing ? 'Save changes' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default SimpleForm;

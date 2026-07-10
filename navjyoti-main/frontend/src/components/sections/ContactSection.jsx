import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import Card from '@/components/ui/Card.jsx';
import Input from '@/components/ui/Input.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import Button from '@/components/ui/Button.jsx';
import { contactSchema } from '@/validators/contactSchema.js';
import { contactService } from '@/services/contact.service.js';
import { CONTACT } from '@/constants/site.js';

const CONTACT_INFO = [
  { icon: FiMail, label: 'Email', value: CONTACT.email },
  { icon: FiPhone, label: 'Phone', value: CONTACT.phoneDisplay },
  { icon: FiMapPin, label: 'Office', value: CONTACT.address },
];

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const mutation = useMutation({
    mutationFn: contactService.create,
    onSuccess: () => {
      toast.success('Thanks! We’ll get back to you shortly.');
      reset();
    },
    onError: (err) => toast.error(err.message || 'Could not send message.'),
  });

  return (
    <section id="contact" className="py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              Get in touch
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl">Let’s talk about your goals</h2>
            <p className="mt-4 text-slate-400">
              Have a question or need guidance? Our advisors are here to help you find the
              right financial solution.
            </p>
            <div className="mt-8 space-y-4">
              {CONTACT_INFO.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <span className="gradient-brand flex h-11 w-11 items-center justify-center rounded-xl text-white">
                    <c.icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-sm font-medium text-white">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card variant="strong" padding="lg" className="lg:col-span-3">
            <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="grid gap-5 sm:grid-cols-2" noValidate>
              <Input label="Name" placeholder="Your name" error={errors.name?.message} {...register('name')} />
              <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
              <Input label="Phone (optional)" placeholder="9896704299" error={errors.phone?.message} {...register('phone')} />
              <Input label="Subject (optional)" placeholder="How can we help?" error={errors.subject?.message} {...register('subject')} />
              <Textarea
                label="Message"
                placeholder="Tell us a bit more…"
                containerClassName="sm:col-span-2"
                error={errors.message?.message}
                {...register('message')}
              />
              <Button type="submit" isLoading={mutation.isPending} className="sm:col-span-2 sm:justify-self-start" size="lg">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;

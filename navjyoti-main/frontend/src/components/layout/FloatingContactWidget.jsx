/**
 * Fixed-position contact stack (WhatsApp / call / email), always visible in
 * the bottom-right corner — the same pattern used on most business sites.
 *
 * WhatsApp uses the public "click-to-chat" link (https://wa.me/<number>),
 * which needs no API key or WhatsApp Business account setup: it just opens
 * a chat with the number in `env.whatsappNumber` and a prefilled message.
 * Swap in the real WhatsApp Business API (Cloud API / Twilio / etc.) later
 * if you need automated replies, templates, or a live-chat widget instead.
 */
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Tooltip from '@/components/ui/Tooltip.jsx';
import { CONTACT } from '@/constants/site.js';
import { env } from '@/config/env.js';
import { cn } from '@/utils/cn.js';

const WHATSAPP_MESSAGE = "Hi Nav Jyoti, I'd like to know more about your loan options.";

const whatsappHref = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const CHANNELS = [
  {
    key: 'whatsapp',
    label: 'Chat on WhatsApp',
    icon: FaWhatsapp,
    href: whatsappHref,
    external: true,
    className: 'bg-[#25D366] text-white hover:brightness-110',
    pulse: true,
  },
  {
    key: 'call',
    label: `Call ${CONTACT.phoneDisplay}`,
    icon: FiPhone,
    href: `tel:${CONTACT.phone}`,
    className: 'gradient-brand text-white',
  },
  {
    key: 'email',
    label: `Email ${CONTACT.email}`,
    icon: FiMail,
    href: `mailto:${CONTACT.email}`,
    className: 'glass-strong text-white',
  },
];

const FloatingContactWidget = () => (
  <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
    {CHANNELS.map((c, i) => (
      <Tooltip key={c.key} content={c.label} position="left">
        <motion.a
          href={c.href}
          target={c.external ? '_blank' : undefined}
          rel={c.external ? 'noopener noreferrer' : undefined}
          aria-label={c.label}
          initial={{ opacity: 0, scale: 0.6, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className={cn(
            'focus-ring relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-ink-950/40',
            c.className
          )}
        >
          {c.pulse && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-60" />
          )}
          <c.icon size={20} />
        </motion.a>
      </Tooltip>
    ))}
  </div>
);

export default FloatingContactWidget;

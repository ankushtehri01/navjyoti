import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiFacebook, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import { FOOTER_LINKS, CONTACT } from '@/constants/site.js';
import { ROUTES } from '@/constants/routes.js';
import BrandLogo from '@/components/common/BrandLogo.jsx';

const SOCIALS = [
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiFacebook, href: '#', label: 'Facebook' },
  { icon: FiInstagram, href: '#', label: 'Instagram' },
];

const Footer = () => (
  <footer className="mt-24 border-t border-white/10 bg-ink-950/60">
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to={ROUTES.HOME} className="inline-flex items-center" aria-label="Nav Jyoti home">
            <BrandLogo className="h-16 w-16 rounded-full" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Capital that keeps your goals moving forward — loans, cards, insurance,
            and investments, all in one trusted place.
          </p>
          <div className="mt-5 space-y-2 text-sm text-slate-400">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white">
              <FiMail size={15} /> {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 hover:text-white">
              <FiPhone size={15} /> {CONTACT.phoneDisplay}
            </a>
          </div>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="glass focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Nav Jyoti. All rights reserved.</p>
        <p>Loans subject to eligibility & approval. T&amp;C apply.</p>
      </div>
    </Container>
  </footer>
);

export default Footer;

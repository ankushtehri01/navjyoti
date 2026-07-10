import { useRef, useState } from 'react';
import { FiSend, FiHeadphones, FiMail, FiPhone } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth.js';
import { cn } from '@/utils/cn.js';

const AUTO_REPLY =
  'Thanks for reaching out! A support specialist will review your message and respond shortly. Meanwhile, you can track your applications from the Overview page.';

const SupportPage = () => {
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, from: 'agent', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 How can we help you today?` },
  ]);
  const [draft, setDraft] = useState('');

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setDraft('');
    // Simulated support acknowledgement.
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'agent', text: AUTO_REPLY }]);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 700);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  return (
    <>
      <PageHeader title="Support" subtitle="We’re here to help — chat with us or reach out directly." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact info */}
        <Card className="space-y-5 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="gradient-brand flex h-11 w-11 items-center justify-center rounded-xl text-white">
              <FiHeadphones size={20} />
            </span>
            <div>
              <p className="font-semibold text-white">Customer Support</p>
              <p className="text-xs text-slate-400">Mon–Sat, 9am–7pm</p>
            </div>
          </div>
          <a href="mailto:support@navjyoti.com" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white">
            <FiMail size={16} /> support@navjyoti.com
          </a>
          <a href="tel:+911800000000" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white">
            <FiPhone size={16} /> 1800-000-000
          </a>
          <p className="text-xs text-slate-500">
            For loan-specific queries, mention your application number for faster help.
          </p>
        </Card>

        {/* Chat */}
        <Card padding="none" className="flex h-[520px] flex-col lg:col-span-2">
          <div className="border-b border-white/10 px-5 py-3">
            <p className="text-sm font-semibold text-white">Live Chat</p>
            <p className="text-xs text-green-300">● Online</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                    m.from === 'user'
                      ? 'gradient-brand text-white'
                      : 'glass text-slate-200'
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-3 border-t border-white/10 p-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message…"
              className="glass h-11 flex-1 rounded-xl bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-500 focus-ring"
            />
            <Button type="submit" size="md" aria-label="Send" disabled={!draft.trim()}>
              <FiSend size={16} />
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default SupportPage;

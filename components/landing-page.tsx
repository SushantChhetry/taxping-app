'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID || 'RG48Ll';
const TALLY_RESPONDER_URL = `https://tally.so/r/${TALLY_FORM_ID}`;
const TALLY_EMBED_URL = `https://tally.so/embed/${TALLY_FORM_ID}?hideTitle=1&transparentBackground=1`;

type Message = {
  from: 'in' | 'out';
  text?: string;
  isPhoto?: boolean;
  photoName?: string;
  photoLabel?: string;
};

const tickerItems = [
  'No portal required',
  '15-minute setup',
  'Works with Drake & Lacerte',
  'Unlimited clients',
  'Auto-named files',
  'Just SMS — nothing to install',
  'Google Drive sync',
  'AI handles client questions',
  'No client training',
  'Dropbox sync',
  'Smart follow-ups',
  'Built for solo preparers',
  'No per-client fees',
  'ProSeries compatible'
];

const howItWorks = [
  {
    number: '01',
    icon: '📲',
    title: "You add a client's number",
    text: 'Takes 30 seconds. TaxPing sends the first text automatically — no script to write, nothing to configure on their end.'
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI guides them over SMS',
    text: 'Asks for each document. Answers “what’s a 1099?” Sends gentle reminders if they go quiet. You stay completely out of it.'
  },
  {
    number: '03',
    icon: '📁',
    title: 'Files appear in your Drive',
    text: 'Auto-named, auto-organized. Johnson_Mark_W2_2025.pdf lands exactly where you need it — ready the moment it arrives.'
  }
];

const features = [
  ['💬', 'Pure SMS', 'Clients use their native Messages app. Nothing to download, no account to create, ever.'],
  ['🏷️', 'Auto-named files', 'Every document renamed LastName_Type_Year before it hits your folder. Zero manual sorting.'],
  ['🔔', 'Smart follow-ups', 'TaxPing nudges quiet clients automatically so you never have to send another “just checking in” email.'],
  ['🤝', 'Handles questions', '“Do I need a 1099?” — answered automatically. You stop being the after-hours help desk.'],
  ['☁️', 'Drive + Dropbox', 'Files land exactly where you already work. No new folder structure to learn or maintain.'],
  ['⚡', '15-minute setup', 'From signup to first client text in under 15 minutes. No training call, no implementation guide.']
];

const testimonials = [
  {
    quote:
      '“I send the portal link. They ignore it. I call. They say they’ll do it. Three weeks later I’m calling again. Every. Single. Client.”',
    name: 'Solo CPA',
    role: '220 clients · Drake user'
  },
  {
    quote:
      '“My clients are 60+. They will not use a portal. They don’t even know what a portal is. But they will absolutely text a photo.”',
    name: 'Enrolled Agent',
    role: '310 clients · Lacerte user'
  },
  {
    quote:
      '“TaxDome is built for a 20-person firm. I don’t need practice management. I need documents. Just the documents.”',
    name: '2-person firm',
    role: '175 clients · ProSeries user'
  }
];

const seasonFeatures = [
  'Unlimited client conversations',
  'Google Drive + Dropbox sync',
  'Auto-named & organized files',
  'Smart follow-up reminders',
  'AI answers client questions',
  '15-minute setup, no training call'
];

const demoConversation: Message[] = [
  {
    from: 'in',
    text: "Hi Mark! I'm collecting docs for your return — no app needed, just reply here. Ready to get started? 📋"
  },
  { from: 'out', text: 'Sure! What do I need to send?' },
  {
    from: 'in',
    text: 'Let’s start with your W-2. Just snap a photo and text it here 📸'
  },
  {
    from: 'out',
    isPhoto: true,
    photoName: 'IMG_0482.jpg',
    photoLabel: 'W-2 · Meridian Group'
  },
  {
    from: 'in',
    text: '✅ Got it! Any 1099s this year — freelance work, interest, or dividends?'
  },
  { from: 'out', text: 'Yes — one 1099-NEC from a consulting gig.' },
  { from: 'in', text: 'Perfect, send it over whenever you’re ready!' },
  {
    from: 'out',
    isPhoto: true,
    photoName: 'IMG_0491.jpg',
    photoLabel: '1099-NEC · Vertex Solutions'
  },
  {
    from: 'in',
    text: 'That’s everything! 🎉 Both files are saved and ready for your preparer. You’re all set — thank you!'
  },
  { from: 'out', text: 'That was way easier than the portal 😂' }
];

function useSmsDemo() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = async () => {
      while (!cancelled) {
        setStep(0);
        setTypedText('');
        setIsTyping(false);

        for (let i = 0; i < demoConversation.length; i += 1) {
          const item = demoConversation[i];

          if (item.from === 'out' && item.text && !item.isPhoto) {
            setIsTyping(true);
            setTypedText('');

            for (let index = 0; index < item.text.length; index += 1) {
              if (cancelled) return;
              await new Promise((resolve) => {
                timer = setTimeout(resolve, 18);
              });
              setTypedText((current) => current + item.text?.[index]);
            }

            await new Promise((resolve) => {
              timer = setTimeout(resolve, 220);
            });
          }

          if (cancelled) return;
          setIsTyping(false);
          setTypedText('');
          setStep(i + 1);

          await new Promise((resolve) => {
            timer = setTimeout(resolve, item.from === 'in' ? 1200 : 1000);
          });
        }

        await new Promise((resolve) => {
          timer = setTimeout(resolve, 2600);
        });
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return {
    shownMessages: demoConversation.slice(0, step),
    typedText,
    isTyping
  };
}

export default function LandingPage() {
  const [showBadge, setShowBadge] = useState(false);
  const spotsLeft = 10;
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  const { shownMessages, typedText, isTyping } = useSmsDemo();

  useEffect(() => {
    const container = messagesScrollRef.current;
    if (!container) return;

    const raf = requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(raf);
  }, [shownMessages.length, isTyping]);

  useEffect(() => {
    const onScroll = () => setShowBadge(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const repeatedTickerItems = useMemo(() => [...tickerItems, ...tickerItems], []);

  return (
    <main className="relative">
      <div
        className={`pointer-events-none fixed bottom-7 right-7 z-40 hidden items-center gap-3 rounded-2xl border border-sand3 bg-white px-4 py-3 shadow-float transition-all duration-300 lg:flex ${
          showBadge ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="relative h-3 w-3 rounded-full bg-brand">
          <span className="absolute inset-0 rounded-full bg-brand/30 animate-ping" />
        </div>
        <div className="text-sm font-semibold leading-5 text-ink">
          Ready in <span className="text-brand">15 minutes</span>
          <br />— no tech setup needed
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-brand/10 bg-sand/90 backdrop-blur-xl">
        <div className="section-shell flex h-[68px] items-center justify-between gap-6">
          <Link href="#" className="flex items-center gap-3 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg text-white shadow-glow">
              💬
            </div>
            <div className="font-display text-2xl font-extrabold tracking-tight text-ink">
              Tax<span className="text-brand">Ping</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#how" className="text-sm font-semibold text-muted transition hover:text-ink">
              How it works
            </Link>
            <Link href="#pricing" className="text-sm font-semibold text-muted transition hover:text-ink">
              Pricing
            </Link>
            <a
              href={TALLY_RESPONDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brandDark"
            >
              Join Early Access
            </a>
          </nav>
        </div>
      </header>

      <section className="section-shell grid min-h-[calc(100vh-68px)] items-center gap-12 py-10 md:grid-cols-2 md:py-16">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulseSoft" />
            Recruiting 10 founding members · December 2026
          </div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Document collection, simplified
          </p>
          <h1 className="display-title mb-5 text-5xl font-black leading-[0.98] md:text-7xl">
            Stop chasing.
            <br />
            Start <span className="italic text-brand">texting.</span>
          </h1>
          <p className="body-copy mb-8 max-w-xl">
            Your clients already know how to text. TaxPing meets them there —{' '}
            <strong className="font-extrabold text-ink">no portal, no app, no password</strong> — and sends
            their documents straight to your Drive.
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-3 rounded-2xl border border-sand3 bg-white px-4 py-3">
              <span className="text-lg">⚡</span>
              <div className="text-sm font-bold text-inkSoft">
                15 minutes
                <span className="mt-0.5 block text-xs font-semibold text-muted">
                  to your first client text
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-sand3 bg-white px-4 py-3">
              <span className="text-lg">📱</span>
              <div className="text-sm font-bold text-inkSoft">
                Zero apps
                <span className="mt-0.5 block text-xs font-semibold text-muted">
                  clients need nothing new
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={TALLY_RESPONDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-4 text-base font-bold text-white shadow-glow transition hover:-translate-y-1 hover:bg-brandDark"
            >
              Join Early Access →
            </a>
            <Link href="#how" className="text-sm font-bold text-inkSoft transition hover:text-brand">
              See how it works →
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Open to solo preparers with <span className="font-extrabold text-ink">75–400 clients</span> ·{' '}
            <span className="font-extrabold text-brand">10 spots only</span>
          </div>
        </div>

	        <div className="flex justify-center">
	          <div className="flex flex-col items-center">
	            <div className="relative">
	              <div className="absolute inset-[-40px] rounded-full bg-brand/10 blur-3xl" />

	              <div className="relative z-10 h-[560px] w-[270px] rounded-[3.25rem] bg-neutral-950 p-[10px] shadow-[0_60px_100px_rgba(0,0,0,0.45)] ring-8 ring-neutral-950/90">
	                <div className="absolute left-1/2 top-3 z-20 h-8 w-28 -translate-x-1/2 rounded-2xl bg-black" />
	                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2.5rem] bg-[#091220]">
                  <div className="flex items-end justify-between bg-neutral-900 px-5 pb-2 pt-5 text-white">
                    <span className="text-sm font-semibold">9:02</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-end gap-[2px]">
                        <span className="h-1 w-[3px] rounded bg-white/80" />
                        <span className="h-2 w-[3px] rounded bg-white/80" />
                        <span className="h-3 w-[3px] rounded bg-white/80" />
                        <span className="h-4 w-[3px] rounded bg-white/80" />
                      </div>
                      <div className="h-[10px] w-5 rounded border border-white/40 p-[1px]">
                        <div className="h-full w-4 rounded bg-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-b border-white/5 bg-neutral-900 px-4 py-3 text-white">
                    <span className="text-lg text-orange-300">‹</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brandDark text-sm">
                      💬
                    </div>
                    <div>
                      <div className="text-xs font-semibold">TaxPing</div>
                      <div className="text-[10px] text-blue-300">your tax assistant</div>
                    </div>
                  </div>

                  <div
                    ref={messagesScrollRef}
                    className="flex-1 min-h-0 overscroll-contain overflow-y-auto bg-[#0a0f1a] px-2 pb-4 pt-3"
                  >
                    <div className="mb-3 text-center text-[10px] text-neutral-500">Today 9:02 AM</div>
                    <div className="flex flex-col gap-2">
                      {shownMessages.map((message, index) => (
                        <div
                          key={`${message.from}-${index}`}
                          className={`flex flex-col ${message.from === 'out' ? 'items-end' : 'items-start'}`}
                        >
                          {message.isPhoto ? (
                            <div className="rounded-[18px] rounded-br-md border border-brand/20 bg-[#0f1e38] p-1.5 text-center text-white">
                              <div className="flex h-24 w-40 flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-[#0a1428] to-[#060e1e]">
                                <span className="text-xl">📷</span>
                                <span className="text-[9px] text-blue-200">{message.photoName}</span>
                                <span className="text-[10px] text-blue-400">{message.photoLabel}</span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`max-w-[196px] rounded-[17px] px-3 py-2 text-[13px] leading-[1.45] text-white ${
                                message.from === 'out'
                                  ? 'rounded-br-md bg-brand'
                                  : 'rounded-bl-md bg-[#1a2540]'
                              }`}
                            >
                              {message.text}
                            </div>
                          )}
                          {message.from === 'out' && !message.isPhoto ? (
                            <span className="px-2 pt-1 text-[9px] text-neutral-500">Delivered</span>
                          ) : null}
                        </div>
                      ))}
                      {isTyping ? (
                        <div className="flex items-end gap-2 px-1">
                          <div className="h-6 w-6 rounded-full bg-[#203152]" />
                          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#1a2540] px-3 py-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#5a80c0] animate-bop" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#5a80c0] [animation-delay:0.2s] animate-bop" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#5a80c0] [animation-delay:0.4s] animate-bop" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-white/5 bg-[#0f1a2e] px-3 pb-4 pt-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a2540] text-sm text-neutral-400">
                      +
                    </div>
                    <div className="flex min-h-[30px] flex-1 items-center rounded-full border border-white/5 bg-[#1a2540] px-3 text-[13px] text-white">
                      <span>{typedText}</span>
                      {isTyping ? <span className="ml-0.5 h-4 w-[1.5px] bg-blue-300 animate-blink" /> : null}
                    </div>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs text-white transition ${
                        isTyping ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                    >
                      ↑
                    </div>
                  </div>
	                </div>
	              </div>
	            </div>
	          </div>
	        </div>
	      </section>

      <section className="border-y border-sand3 bg-sand2 py-6">
        <div className="overflow-hidden">
          <div className="flex w-max animate-ticker gap-12">
            {repeatedTickerItems.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-inkSoft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-white py-24">
        <div className="section-shell">
          <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            <span className="h-0.5 w-5 rounded bg-brand" />
            How it works
          </div>
          <h2 className="display-title mb-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Simple enough to
            <br />
            explain in three steps.
          </h2>
          <p className="body-copy mb-14 max-w-2xl">
            Works alongside Drake, Lacerte, and ProSeries. No replacement, no disruption — just a
            better way to get documents from clients who will not use a portal.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item) => (
              <article
                key={item.number}
                className="rounded-3xl border border-transparent bg-sand p-8 transition hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-float"
              >
                <div className="mb-3 font-display text-6xl font-black tracking-tight text-brand/15">
                  {item.number}
                </div>
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="text-sm font-medium leading-7 text-inkSoft">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest py-24 text-white">
        <div className="absolute right-[-100px] top-[-100px] h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="section-shell relative">
          <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
            <span className="h-0.5 w-5 rounded bg-white/30" />
            Built for solos
          </div>
          <h2 className="font-display mb-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Everything you need.
            <br />
            Nothing extra.
          </h2>
          <p className="mb-14 max-w-2xl text-lg leading-8 text-white/65">
            No onboarding call. No IT department. No asking clients to remember a password. If they
            can text, they can use TaxPing.
          </p>

          <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-3">
            {features.map(([icon, title, text]) => (
              <article key={title} className="bg-white/5 p-7 transition hover:bg-white/10">
                <div className="mb-4 text-2xl">{icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold text-white">{title}</h3>
                <p className="text-sm font-medium leading-7 text-white/65">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="section-shell">
          <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            <span className="h-0.5 w-5 rounded bg-brand" />
            Sound familiar?
          </div>
          <h2 className="display-title mb-3 max-w-3xl text-4xl font-extrabold md:text-5xl">
            Every tax season,
            <br />
            the same problem.
          </h2>
          <p className="mb-12 max-w-2xl text-lg leading-8 text-muted">
            We talked to dozens of solo preparers. Here&apos;s what kept coming up — almost word for
            word.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-3xl border border-sand3 bg-white p-8 transition hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-float"
              >
                <div className="mb-4 text-sm">⭐⭐⭐⭐⭐</div>
                <p className="mb-6 text-[15px] font-medium italic leading-8 text-inkSoft">{item.quote}</p>
                <div className="mb-4 h-0.5 w-8 rounded bg-sand3" />
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand2">👤</div>
                  <div>
                    <div className="text-sm font-bold text-ink">{item.name}</div>
                    <div className="text-xs font-semibold text-muted">{item.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-sand3 bg-white py-24">
        <div className="section-shell grid gap-14 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
              <span className="h-0.5 w-5 rounded bg-brand" />
              Pricing
            </div>
            <h2 className="display-title mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
              One price.
              <br />
              Whole season.
              <br />
              No surprises.
            </h2>
            <p className="body-copy mb-6 max-w-xl">
              Flat rate covers your entire tax season —{' '}
              <strong className="font-extrabold text-ink">unlimited clients, unlimited conversations.</strong>{' '}
              No per-client fees, no usage limits, no gotchas at renewal.
            </p>
            <div className="flex gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm font-semibold leading-7 text-inkSoft">
              <span className="text-xl">⏳</span>
              <p>
                Founding member pricing locks in at <strong className="text-ink">$149/season forever</strong>{' '}
                for the first 10 customers. After launch, it goes to $299.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] bg-forest p-10 text-white shadow-[0_24px_64px_rgba(13,27,46,0.2)]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-300 animate-pulseSoft" />
              Founding Member Price
            </div>
            <div className="mb-2 flex items-start gap-1 font-display">
              <span className="mt-3 text-3xl text-white/60">$</span>
              <span className="text-8xl font-black leading-none tracking-tighter">149</span>
            </div>
            <div className="mb-8 text-sm font-semibold text-white/55">per tax season · unlimited clients</div>
            <div className="mb-8 h-px w-full bg-white/10" />
            <ul className="mb-8 space-y-4">
              {seasonFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-white/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-brand/30 bg-brand/15 text-xs text-blue-300">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={TALLY_RESPONDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-brand px-6 py-4 text-center text-base font-bold text-white shadow-glow transition hover:-translate-y-1 hover:bg-brandDark"
            >
              Join Early Access →
            </a>
            <p className="mt-4 text-center text-xs font-semibold text-white/35">
              No credit card to reserve your spot.
            </p>
          </div>
        </div>
      </section>

      <section id="signup" className="relative overflow-hidden bg-brand py-24 text-center text-white">
        <div className="absolute left-1/2 top-[-120px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="section-shell relative max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2 text-sm font-bold text-white/90">
            <span className="h-2 w-2 rounded-full bg-white animate-pulseSoft" />
            <span>
              <strong>{spotsLeft}</strong> founding spots remaining
            </span>
          </div>
          <h2 className="font-display mb-4 text-4xl font-black tracking-tight text-white md:text-7xl">
            Ten spots.
            <br />
            <span className="italic text-white/80">One tax season</span> to change everything.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-white/75">
            Join early access in 60 seconds. Shape the product. Lock in $149/season — forever.
          </p>

          <div className="mx-auto mb-9 grid max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['🔑', 'Early access before public launch'],
              ['💬', 'Direct line to the founder'],
              ['🏷️', '$149/season locked forever'],
              ['🔧', 'Shape features before anyone else']
            ].map(([icon, text]) => (
              <div key={text} className="border-white/10 p-6 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0 lg:min-h-[120px]">
                <div className="mb-2 text-2xl">{icon}</div>
                <div className="text-sm font-bold leading-6 text-white/90">{text}</div>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white shadow-float">
              <iframe title="Join Early Access" src={TALLY_EMBED_URL} loading="lazy" className="h-[820px] w-full" />
            </div>
            <a
              href={TALLY_RESPONDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-full bg-white px-8 py-4 text-base font-extrabold text-brand shadow-float transition hover:-translate-y-1"
            >
              Open the form in a new tab →
            </a>
          </div>

          <p className="mt-5 text-sm font-semibold text-white/55">
            No credit card. No commitment. Every application gets a personal reply within 48 hours.
          </p>
        </div>
      </section>

      <footer className="bg-ink py-8 text-white">
        <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm">💬</div>
            <div className="font-display text-xl font-extrabold">
              Tax<span className="text-brand">Ping</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-white/40">
            <Link href="#" className="transition hover:text-white/80">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-white/80">
              Terms
            </Link>
            <a href="mailto:hello@taxping.com" className="transition hover:text-white/80">
              hello@taxping.com
            </a>
          </div>
          <div className="text-xs font-semibold text-white/25">© 2026 TaxPing</div>
        </div>
      </footer>
    </main>
  );
}

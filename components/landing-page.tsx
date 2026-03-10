'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Reveal } from './reveal';

const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID || 'RG48Ll';
const TALLY_RESPONDER_URL = `https://tally.so/r/${TALLY_FORM_ID}`;
const TALLY_EMBED_URL = `https://tally.so/embed/${TALLY_FORM_ID}?hideTitle=1&transparentBackground=1`;

type Message = {
  from: 'in' | 'out';
  text?: string;
  isPhoto?: boolean;
  photoName?: string;
  photoLabel?: string;
  isTimestamp?: boolean;       // new
  timestampLabel?: string;     // new
};

const tickerItems = [
  'Works with Drake, Lacerte, ProSeries',
  'Clients never create an account',
  'No Twilio setup',
  'W-2 photo → named PDF in your folder',
  'Auto follow-ups (you stop “just checking in”)',
  'Google Drive + Dropbox sync',
  'Unlimited clients',
  'No per-client fees',
  'Just SMS — nothing to install',
  'Answers “what’s a 1099?” automatically',
  'Built for solo preparers',
  'Works with your current workflow'
];

const howItWorks = [
  {
    number: '01',
    reaction: '📲',
    side: 'out' as const,
    title: 'Stop sending the first follow-up',
    text: 'When a return is blocked by a missing W-2, you don’t write the “just checking in” email. TaxPing starts the thread and keeps it moving.'
  },
  {
    number: '02',
    reaction: '🤖',
    side: 'in' as const,
    title: 'Stop being the after-hours help desk',
    text: 'Clients ask questions in the same text thread. TaxPing answers the basics and keeps the checklist simple enough for your 67-year-old clients.'
  },
  {
    number: '03',
    reaction: '📁',
    side: 'in' as const,
    title: 'Stop renaming and filing PDFs',
    text: 'Documents land auto-named and organized in your Drive or Dropbox, ready to start the return the moment they arrive.'
  }
];

const testimonials = [
  {
    quote:
      '“I send the portal link. They ignore it. I call. They say they’ll do it. Three weeks later I’m calling again. Every. Single. Client. Now TaxPing sends the third reminder. I stopped counting.”',
    name: 'Solo CPA',
    role: '220 clients'
  },
  {
    quote:
      '“My clients are 60+. They will not use a portal. They don’t even know what a portal is. But they will absolutely text a photo. Now TaxPing asks for the W-2 by text and it shows up.”',
    name: 'Enrolled Agent',
    role: '310 clients'
  },
  {
    quote:
      '“TaxDome is built for a 20-person firm. I don’t need practice management. I need documents. Just the documents. Now TaxPing collects them and files them where I work.”',
    name: '2-person firm',
    role: '175 clients'
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
    text: "Hi Mark! Time to gather your tax docs — I'll walk you through it one step at a time. Ready? 📋"
  },
  { from: 'out', text: 'Sure! What do I need to send?' },
  {
    from: 'in',
    text: "Let's start with your W-2. Just snap a photo and reply with it here 📸"
  },
  {
    from: 'out',
    isPhoto: true,
    photoName: 'IMG_0482.jpg',
    photoLabel: 'W-2 · Meridian Group'
  },
  {
    from: 'in',
    text: '✅ W-2 saved. Did you have any 1099s this year — freelance, interest, or dividends?'
  },
  { from: 'out', text: "Yeah I think so — I'll have to dig it up." },
  {
    from: 'in',
    text: "No rush — I'll check back in a couple days 👍"
  },
  {
    from: 'in',
    isTimestamp: true,
    timestampLabel: '2 days later · no action needed from you'
  },
  {
    from: 'in',
    text: 'Hey Mark — still need that 1099 whenever you find it. No rush, just reply here 📎'
  },
  {
    from: 'out',
    isPhoto: true,
    photoName: 'IMG_0491.jpg',
    photoLabel: '1099-NEC · Vertex Solutions'
  },
  {
    from: 'in',
    text: "Done! 🎉 Both docs are saved to your preparer's folder. You're all set."
  },
  { from: 'out', text: 'Sorry for the delay — glad it was this easy 😅' }
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

          if (item.isTimestamp) {
            if (cancelled) return;
            setIsTyping(false);
            setTypedText('');
            setStep(i + 1);
            await new Promise((resolve) => { timer = setTimeout(resolve, 1800); });
            continue;
          }

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
              Early access
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
        <div className="animate-fadeInUpSoft">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulseSoft" />
            Recruiting 10 founding members · December 2026
          </div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Document collection, simplified
          </p>
	          <h1 className="display-title mb-5 text-5xl font-black leading-[0.98] md:text-7xl">
	            It&apos;s February.
	            <br />
	            The W-2 is missing.
	            <br />
	            Your email is unanswered — and the return can&apos;t start.
	          </h1>
	          <p className="mb-4 max-w-xl text-lg font-semibold leading-8 text-inkSoft">
	            Your clients will text a photo in 30 seconds and ignore a portal login for three weeks.
	          </p>
	          <p className="body-copy mb-8 max-w-xl">
	            TaxPing collects documents over plain SMS — <strong className="font-extrabold text-ink">no portal, no app, no password</strong> — and drops them into your Drive named and organized.
	          </p>

	          <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-sand3 bg-white px-4 py-3">
	            <span className="text-lg">⏱️</span>
	            <div className="text-sm font-bold text-inkSoft">
	              Avg. <span className="font-black text-ink">11 days</span> to collect docs{' '}
	              <span className="mx-1 text-brand">→</span>{' '}
	              <span className="font-black text-brand">3 days</span> with TaxPing
	              <span className="mt-0.5 block text-xs font-semibold text-muted">
	                from “waiting on a W-2” to “ready to start”
	              </span>
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

	          <div className="mt-4 text-sm font-semibold text-muted">
	            Built for solo preparers on <span className="font-extrabold text-ink">Drake</span>,{' '}
	            <span className="font-extrabold text-ink">Lacerte</span>, and{' '}
	            <span className="font-extrabold text-ink">ProSeries</span>.
	          </div>

	          <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-muted">
	            <span className="h-2 w-2 rounded-full bg-green-500" />
	            Open to solo preparers with <span className="font-extrabold text-ink">75–400 clients</span> ·{' '}
	            <span className="font-extrabold text-brand">10 spots only</span>
          </div>
        </div>

        <div className="[animation-delay:120ms] animate-fadeInUpSoft flex justify-center">
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
                      {shownMessages.map((message, index) => {
                        if (message.isTimestamp) {
                          return (
                            <div key={`ts-${index}`} className="my-3 flex items-center gap-2">
                              <div className="h-px flex-1 bg-white/10" />
                              <div className="flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand/70" />
                                <span className="text-[9px] font-bold uppercase tracking-wide text-brand/80">
                                  {message.timestampLabel}
                                </span>
                              </div>
                              <div className="h-px flex-1 bg-white/10" />
                            </div>
                          );
                        }

                        return (
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
                        );
                      })}
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
	              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-sand3 bg-white px-4 py-2.5 shadow-float">
	                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-[11px]">✓</span>
	                <span className="text-[11px] font-bold text-inkSoft">
	                  Mark's file · <span className="text-green-600">2 of 2 docs received</span> · no action needed
	                </span>
	              </div>
	              <div className="mt-3 w-full max-w-[360px] rounded-2xl border border-sand3 bg-white p-4 shadow-float">
	                <div className="flex items-center justify-between">
	                  <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
	                    Doc collection
	                  </div>
	                  <div className="text-xs font-semibold text-muted">Today</div>
	                </div>
	                <div className="mt-3 space-y-3 text-[12px] font-semibold text-inkSoft">
	                  <div className="flex items-center justify-between gap-3">
	                    <div className="min-w-0">
	                      <div className="truncate font-bold text-ink">Mark Johnson</div>
	                      <div className="text-muted">Ready to start · 2/2 received</div>
	                    </div>
	                    <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[11px] font-extrabold text-green-700">
	                      Complete
	                    </span>
	                  </div>
	                  <div className="h-px bg-sand3" />
	                  <div className="flex items-center justify-between gap-3">
	                    <div className="min-w-0">
	                      <div className="truncate font-bold text-ink">Amanda Lee</div>
	                      <div className="text-muted">Waiting on W-2 · last ping 2d ago</div>
	                    </div>
	                    <span className="shrink-0 rounded-full bg-brand/10 px-2 py-1 text-[11px] font-extrabold text-brand">
	                      In progress
	                    </span>
	                  </div>
	                  <div className="h-px bg-sand3" />
	                  <div className="flex items-center justify-between gap-3">
	                    <div className="min-w-0">
	                      <div className="truncate font-bold text-ink">Carlos Diaz</div>
	                      <div className="text-muted">Needs 1099 · ping scheduled</div>
	                    </div>
	                    <span className="shrink-0 rounded-full bg-sand2 px-2 py-1 text-[11px] font-extrabold text-inkSoft">
	                      Pending
	                    </span>
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

	      <section className="bg-white py-20">
	        <div className="section-shell">
	          <Reveal className="w-full">
	            <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
	              <span className="h-0.5 w-5 rounded bg-brand" />
	              First text preview
	            </div>
	            <h2 className="display-title mb-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
	              The first SMS your client gets.
	            </h2>
	            <p className="body-copy mb-10 max-w-2xl">
	              Word for word — so you can picture sending it to your least-technical client with confidence.
	            </p>

	            <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-sand3 bg-white shadow-float">
	              <div className="flex items-center justify-between border-b border-sand3 bg-sand px-6 py-4">
	                <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
	                  SMS
	                </div>
	                <div className="text-xs font-semibold text-muted">TaxPing</div>
	              </div>
	              <div className="bg-[#f2f2f7] px-6 py-8">
	                <div className="flex justify-start">
	                  <div className="max-w-[560px] rounded-3xl rounded-bl-md border border-sand3 bg-white px-5 py-4 text-[15px] font-semibold leading-7 text-inkSoft shadow-sm">
	                    Hi Mark — it&apos;s your tax preparer&apos;s office. I&apos;ll text you a short checklist for your return.
	                    Reply here with a photo of each document (no portal, no login). Ready to start?
	                  </div>
	                </div>
	                <div className="mt-4 flex justify-end">
	                  <div className="max-w-[560px] rounded-3xl rounded-br-md bg-brand px-5 py-4 text-[15px] font-semibold leading-7 text-white shadow-sm">
	                    Yes
	                  </div>
	                </div>
	              </div>
	            </div>
	          </Reveal>
	        </div>
	      </section>

	      <section id="how" className="bg-white py-24">
	        <div className="section-shell">
	          <Reveal className="w-full">
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
              Works alongside your existing process. No replacement, no disruption — just a better way
              to get documents from clients who will not use a portal.
            </p>

	            <div className="mx-auto max-w-5xl">
	              <div className="overflow-hidden rounded-3xl border border-sand3 bg-white shadow-float">
	                <div className="flex items-center justify-between border-b border-sand3 bg-sand px-6 py-4">
	                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
	                    Process
	                  </div>
	                  <div className="text-xs font-semibold text-muted">3 steps</div>
	                </div>

	                <div className="bg-[#f2f2f7] px-6 py-10">
	                  <div className="mx-auto max-w-4xl space-y-8">
	                    {howItWorks.map((item, index) => {
	                      const isOut = item.side === 'out';
	                      const isLast = index === howItWorks.length - 1;
	                      return (
	                        <div key={item.number} className="flex gap-6">
	                          <div className="flex w-14 flex-col items-center">
	                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sand3 bg-white text-[11px] font-black text-ink">
	                              {item.number}
	                            </div>
	                            {!isLast ? <div className="mt-2 w-[2px] flex-1 rounded bg-sand3" /> : null}
	                          </div>
	                          <div className={`flex-1 ${isOut ? 'text-right' : 'text-left'}`}>
	                            <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
	                              <div
	                                className={`relative max-w-[640px] rounded-3xl px-5 py-4 text-[15px] font-semibold leading-7 shadow-sm ${
	                                  isOut
	                                    ? 'rounded-br-md bg-brand text-white'
	                                    : 'rounded-bl-md border border-sand3 bg-white text-inkSoft'
	                                }`}
	                              >
	                                <div className={`font-display text-base font-black tracking-tight ${isOut ? 'text-white' : 'text-ink'}`}>
	                                  {item.title}
	                                </div>
	                                <div className={`mt-1 text-sm font-semibold leading-7 ${isOut ? 'text-white/85' : 'text-inkSoft'}`}>
	                                  {item.text}
	                                </div>

	                                <div
	                                  className={`pointer-events-none absolute -bottom-3 ${
	                                    isOut ? 'right-4' : 'left-4'
	                                  } flex h-7 w-7 items-center justify-center rounded-full border border-sand3 bg-white/95 text-sm shadow-float backdrop-blur-md`}
	                                >
	                                  {item.reaction}
	                                </div>
	                              </div>
	                            </div>
	                          </div>
	                        </div>
	                      );
	                    })}
	                  </div>
	                </div>
	              </div>
	            </div>
	          </Reveal>
	        </div>
	      </section>

	      <section className="relative overflow-hidden bg-forest py-28 text-white">
	        <div className="absolute right-[-100px] top-[-100px] h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
	        <div className="section-shell relative">
	          <Reveal className="w-full">
	            <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
	              <span className="h-0.5 w-5 rounded bg-white/30" />
	              February, without the chase
	            </div>
	            <h2 className="font-display mb-8 max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl">
	              February without TaxPing is a calendar full of returns that can&apos;t start.
	            </h2>
	            <p className="max-w-4xl text-xl font-semibold leading-9 text-white/70 md:text-2xl md:leading-10">
	              <span className="font-extrabold text-white">Without TaxPing:</span> unanswered emails, portal links ignored, you
	              tracking who&apos;s missing a W-2 in a sticky note, and the same “quick reminder” draft copied 40 times.
	              <br />
	              <span className="font-extrabold text-white">With TaxPing:</span> one calm SMS thread per client, automatic reminders,
	              and every doc landing named in your folder — so you start returns instead of starting chases.
	            </p>
	          </Reveal>
	        </div>
	      </section>

      <section className="bg-sand py-24">
        <div className="section-shell">
          <Reveal className="w-full">
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

            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-sand3 bg-white shadow-float">
              <div className="flex items-center justify-between border-b border-sand3 bg-sand px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Messages
                </div>
                <div className="text-xs font-semibold text-muted">Tax pros</div>
              </div>

              <div className="space-y-5 bg-[#f2f2f7] px-6 py-8">
                {testimonials.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-start">
                      <div className="relative max-w-[560px] rounded-3xl rounded-bl-md border border-sand3 bg-white px-5 py-4 text-[15px] font-semibold leading-7 text-inkSoft shadow-sm">
                        <div className="mb-2 text-[12px] font-bold text-muted">⭐⭐⭐⭐⭐</div>
                        <div className="italic leading-8">{item.quote}</div>
                        <div className="pointer-events-none absolute -bottom-3 left-4 flex h-7 w-7 items-center justify-center rounded-full border border-sand3 bg-white/95 text-sm shadow-float backdrop-blur-md">
                          ⭐️
                        </div>
                      </div>
                    </div>
                    <div className="pl-2 text-[11px] font-semibold text-muted">
                      {item.name} · {item.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

	      <section id="pricing" className="border-t border-sand3 bg-white py-24">
	        <div className="section-shell grid gap-14 md:grid-cols-2 md:items-start">
	          <Reveal className="w-full">
	            <div>
              <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
                <span className="h-0.5 w-5 rounded bg-brand" />
                Early access
              </div>
	              <h2 className="display-title mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
	                Early access for
	                <br />
	                small firms & solo
	                <br />
	                tax pros.
	              </h2>
	              <div className="mb-6 inline-flex items-end gap-2 rounded-2xl border border-sand3 bg-sand px-4 py-3">
	                <div className="text-4xl font-black tracking-tight text-ink">$149</div>
	                <div className="pb-1 text-sm font-extrabold uppercase tracking-[0.18em] text-muted">per month</div>
	              </div>
	              <p className="body-copy mb-6 max-w-xl">
	                We&apos;re inviting a small group of tax professionals to test TaxPing and help shape the
	                product.
	              </p>
              <div className="flex gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm font-semibold leading-7 text-inkSoft">
                <span className="text-xl">💡</span>
                <p>
	                  Founding members lock in <span className="font-extrabold text-ink">$149/month</span> and help shape the product before it opens up.
	                </p>
	              </div>
	            </div>
	          </Reveal>

          <Reveal className="w-full" delayMs={120}>
            <div className="overflow-hidden rounded-3xl border border-sand3 bg-white shadow-float">
              <div className="flex items-center justify-between border-b border-sand3 bg-sand px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Messages</div>
                <div className="text-xs font-semibold text-muted">TaxPing</div>
              </div>

              <div className="space-y-4 bg-[#f2f2f7] px-6 py-8">
	                <div className="flex justify-end">
	                  <div className="relative max-w-[560px] rounded-3xl rounded-br-md bg-brand px-5 py-4 text-[15px] font-semibold leading-7 text-white shadow-sm">
	                    Limited early access — <span className="font-black">{spotsLeft}</span> spots remaining.
                    <div className="pointer-events-none absolute -bottom-3 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-sand3 bg-white/95 text-sm shadow-float backdrop-blur-md">
                      🔥
                    </div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="relative max-w-[560px] rounded-3xl rounded-bl-md border border-sand3 bg-white px-5 py-4 text-[15px] font-semibold leading-7 text-inkSoft shadow-sm">
                    <div className="font-display text-base font-black tracking-tight text-ink">
                      What you get
                    </div>
                    <ul className="mt-2 space-y-2 text-sm font-semibold leading-7 text-inkSoft">
                      {seasonFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-[2px] flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[11px] font-black text-brand">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pointer-events-none absolute -bottom-3 left-4 flex h-7 w-7 items-center justify-center rounded-full border border-sand3 bg-white/95 text-sm shadow-float backdrop-blur-md">
                      ✅
                    </div>
                  </div>
                </div>

	                <div className="flex justify-end">
	                  <div className="relative max-w-[560px] rounded-3xl rounded-br-md bg-brand px-5 py-4 text-[15px] font-semibold leading-7 text-white shadow-sm">
	                    Founding price: <span className="font-black">$149/month</span>. Unlimited clients.
	                    <div className="pointer-events-none absolute -bottom-3 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-sand3 bg-white/95 text-sm shadow-float backdrop-blur-md">
	                      🏷️
	                    </div>
	                  </div>
	                </div>

                <a
                  href={TALLY_RESPONDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block rounded-full bg-brand px-6 py-4 text-center text-base font-bold text-white shadow-glow transition hover:-translate-y-1 hover:bg-brandDark"
                >
                  Join Early Access →
                </a>
	                <p className="text-center text-xs font-semibold text-muted">
	                  No credit card to reserve your spot.
	                </p>
	                <p className="text-center text-xs font-semibold text-muted">
	                  Built for solo preparers on Drake, Lacerte, and ProSeries.
	                </p>
	              </div>
	            </div>
	          </Reveal>
	        </div>
	      </section>

	      <section id="signup" className="relative overflow-hidden bg-brand py-24 text-center text-white">
	        <div className="absolute left-1/2 top-[-120px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
	        <div className="section-shell relative max-w-4xl">
	          <Reveal className="w-full">
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
	              Join early access in 60 seconds. Shape the product. Lock in <span className="font-extrabold text-white">$149/month</span>.
	            </p>
	          </Reveal>

          <Reveal className="w-full" delayMs={100}>
            <div className="mx-auto mb-10 max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-float">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Messages
                </div>
                <div className="text-xs font-semibold text-white/60">Early access</div>
              </div>
              <div className="space-y-4 bg-[#f2f2f7] px-6 py-8 text-ink">
                {[
                  ['🔑', 'Early access before public launch'],
                  ['💬', 'Direct line to the founder'],
                  ['🏷️', 'Discounted launch pricing'],
                  ['🔧', 'Shape features before anyone else']
                ].map(([icon, text], index) => {
                  const isOut = index % 2 === 0;
                  return (
                    <div key={text} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`relative max-w-[560px] rounded-3xl px-5 py-4 text-[15px] font-semibold leading-7 shadow-sm ${
                          isOut
                            ? 'rounded-br-md bg-brand text-white'
                            : 'rounded-bl-md border border-sand3 bg-white text-inkSoft'
                        }`}
                      >
                        <div className={`font-display text-base font-black tracking-tight ${isOut ? 'text-white' : 'text-ink'}`}>
                          {text}
                        </div>
                        <div
                          className={`pointer-events-none absolute -bottom-3 ${
                            isOut ? 'right-4' : 'left-4'
                          } flex h-7 w-7 items-center justify-center rounded-full border border-sand3 bg-white/95 text-sm shadow-float backdrop-blur-md`}
                        >
                          {icon}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

	          <Reveal className="w-full" delayMs={160}>
	            <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-float">
	              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Join early access
                </div>
                <div className="text-xs font-semibold text-white/60">Tally</div>
	              </div>
	              <div className="bg-[#f2f2f7] p-2 sm:p-3">
	                <div className="px-2 pb-2 sm:hidden">
	                  <a
	                    href={TALLY_RESPONDER_URL}
	                    target="_blank"
	                    rel="noopener noreferrer"
	                    className="inline-flex w-full items-center justify-center rounded-2xl bg-brand px-6 py-4 text-base font-extrabold text-white shadow-glow transition hover:bg-brandDark"
	                  >
	                    Open form →
	                  </a>
	                </div>
	                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
	                  <iframe
	                    title="Join Early Access"
	                    src={TALLY_EMBED_URL}
	                    loading="lazy"
	                    className="block h-[680px] w-full border-0 sm:h-[820px]"
	                  />
	                </div>
	              </div>
	            </div>
	            <a
	              href={TALLY_RESPONDER_URL}
	              target="_blank"
	              rel="noopener noreferrer"
	              className="mt-8 inline-flex w-full max-w-lg justify-center rounded-2xl bg-white px-10 py-5 text-lg font-black text-brand shadow-float transition hover:-translate-y-1"
	            >
	              Claim your founding spot →
	            </a>
	          </Reveal>

          <Reveal className="w-full" delayMs={220}>
            <p className="mt-5 text-sm font-semibold text-white/55">
              No credit card. No commitment. Every application gets a personal reply within 48 hours.
            </p>
          </Reveal>
        </div>
      </section>

	      <section className="border-t border-sand3 bg-white py-14">
	        <div className="section-shell max-w-4xl">
	          <div className="rounded-3xl border border-sand3 bg-sand px-6 py-6 shadow-float">
	            <div className="text-sm font-extrabold text-ink">
	              Does my client need to download anything?
	            </div>
	            <div className="mt-2 text-sm font-semibold leading-7 text-muted">
	              No. They receive a normal text and reply with photos — no apps, no account, no portal login.
	            </div>
	          </div>
	        </div>
	      </section>

	      <footer className="bg-ink py-10 text-white">
	        <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
	          <div className="flex items-center gap-3">
	            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm">💬</div>
	            <div className="font-display text-xl font-extrabold">
	              Tax<span className="text-brand">Ping</span>
	            </div>
	          </div>
	          <div className="flex flex-wrap gap-6 text-sm font-semibold text-white/60">
	            <Link href="#" className="transition hover:text-white/80">
	              Privacy
	            </Link>
	            <Link href="#" className="transition hover:text-white/80">
	              Terms
	            </Link>
	            <a
	              href={TALLY_RESPONDER_URL}
	              target="_blank"
	              rel="noopener noreferrer"
	              className="transition hover:text-white/80"
	            >
	              Contact form
	            </a>
	          </div>
	          <div className="text-xs font-semibold text-white/35">© 2026 TaxPing</div>
	        </div>
	      </footer>
	    </main>
	  );
	}

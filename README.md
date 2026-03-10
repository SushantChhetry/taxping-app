# TaxPing Landing Page

GitHub-ready landing page repo built with Next.js, React, and Tailwind CSS.

## Stack

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- `next/font` for Fraunces and Plus Jakarta Sans

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. (Optional) Set the environment variable below to point the “Join Early Access” CTA at your own Tally form.

### Environment variable

```bash
NEXT_PUBLIC_TALLY_FORM_ID=your_tally_form_id
```

- If unset, the landing page defaults to the bundled Tally form id `RG48Ll`.
- CTAs open `https://tally.so/r/<FORM_ID>` and the signup section embeds `https://tally.so/embed/<FORM_ID>`.

## Files to update before launch

- `components/landing-page.tsx`
  - founding cohort date text
  - legal links
  - support email
  - CTA copy if needed
- `.env.example`
  - set `NEXT_PUBLIC_TALLY_FORM_ID` if you want a different Tally form

## Notes

- The original uploaded HTML was rebuilt as a cleaner React component instead of a direct HTML dump.
- The SMS phone mockup is now driven by client-side React state.
- The page is static and Vercel-friendly out of the box.

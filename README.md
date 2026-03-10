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
3. Add the environment variable below if you want to use Tally instead of the built-in inline form.

### Environment variable

```bash
NEXT_PUBLIC_TALLY_FORM_ID=your_tally_form_id
```

- If `NEXT_PUBLIC_TALLY_FORM_ID` is set, the CTA section shows a Tally link.
- If it is blank, the page falls back to the inline demo application form.

## Files to update before launch

- `components/landing-page.tsx`
  - founding cohort date text
  - legal links
  - support email
  - CTA copy if needed
- `.env.example`
  - replace with your actual Tally form ID if using Tally

## Notes

- The original uploaded HTML was rebuilt as a cleaner React component instead of a direct HTML dump.
- The SMS phone mockup is now driven by client-side React state.
- The page is static and Vercel-friendly out of the box.

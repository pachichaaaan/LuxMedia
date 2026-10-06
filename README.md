# The Lux Expo

Marketing site for The Lux Expo, a social media management company. The company story is told as Stories: a 9:16 frame, segmented progress bars, scroll or tap to advance.

Built with Next.js (App Router), Tailwind CSS v4, GSAP with ScrollTrigger and SplitText, Lenis, and React Three Fiber. The design plan, tokens, contrast ratios, and motion map are in [DESIGN.md](DESIGN.md).

## Setup

Requires Node.js 20.9 or later (developed on Node 24).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script                   | What it does                                                |
| ------------------------ | ----------------------------------------------------------- |
| `npm run dev`            | Development server                                          |
| `npm run build`          | Production build                                            |
| `npm start`              | Serve the production build                                  |
| `npm run lint`           | ESLint                                                      |
| `npm run typecheck`      | TypeScript, no emit                                         |
| `npm run check`          | Lint, typecheck, and build: the gate every change passes    |
| `npm run format`         | Prettier, including Tailwind class sorting                  |
| `npm run media:manifest` | Regenerates `public/media/README.md` from the content files |

## Environment variables

| Variable               | Required      | Purpose                                                                                                                                                  |
| ---------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | In production | Canonical origin for metadata, Open Graph, the sitemap, and robots. No trailing slash. Defaults to `http://localhost:3000`.                              |
| `RESEND_API_KEY`       | No            | Sends contact form submissions through [Resend](https://resend.com). Without it, submissions are logged in development and the form still shows success. |
| `CONTACT_TO_EMAIL`     | With Resend   | The inbox that receives submissions.                                                                                                                     |
| `CONTACT_FROM_EMAIL`   | No            | A sender on a domain verified in Resend. Defaults to Resend's onboarding sender, which only delivers to your own Resend account address.                 |

## Rebranding

Everything the site says lives in `src/content/`, typed. Components never hard-code copy.

| File                                 | What's in it                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `brand.ts`                           | Name, legal name, handle, tagline, descriptor, founding year, HQ time zone and city, email, social URLs |
| `site.ts`                            | Navigation, page headlines, section headings, metadata descriptions, hero feed posts, 404 copy          |
| `story.ts`                           | The six Story chapters: years, titles, short and long copy, visuals, background stops                   |
| `services.ts`                        | The six services and everything on the Services page                                                    |
| `work.ts`                            | Case studies: results, challenge, approach, gallery, metrics                                            |
| `testimonials.ts`                    | The comment thread and case study quotes                                                                |
| `team.ts`                            | Team members, roles, cities, time zones                                                                 |
| `faq.ts`, `process.ts`, `clients.ts` | FAQ, the four process steps, marquee wordmarks                                                          |
| `contact.ts`                         | Form labels, hints, budget options, and every error message                                             |
| `legal.ts`                           | The privacy page                                                                                        |

A few things are derived rather than written:

- The About headline counts years from `brand.founded` and spells the number out.
- The HQ clock reads `brand.hq.timezone`. While `brand.hq.city` is `"TBD"`, copy says "at HQ". Set a real city and it says "in <city>".
- The footer year is computed at render.

Colors and type are design tokens, not brand facts. They live in `src/styles/globals.css` under `@theme`. If you change the palette, recheck the contrast tables in DESIGN.md, including the Story background stops in `story.ts`.

## Replacing media

Every image and video is a `MediaSlot`. Without a `src` it renders a labeled placeholder describing the asset that belongs there. [`public/media/README.md`](public/media/README.md) lists every slot with its ratio and recommended size.

1. Save the file as `public/media/<slot id>.jpg` (or `.mp4` plus a `-poster.jpg` for video).
2. Add `src` (and `poster` for video) to that visual in its content file, and rewrite its `alt`.
3. Run `npm run media:manifest`.

## Deploying to Vercel

1. Push the repository to GitHub and import it at [vercel.com/new](https://vercel.com/new). The framework preset is detected automatically.
2. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your production origin, for example `https://theluxexpo.com`). Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` if the contact form should deliver email.
3. Deploy. Every push to `main` deploys to production. Pull requests get preview URLs.

## Toolchain notes

- **TypeScript 6.0.** TypeScript 7.0 is the latest release, but typescript-eslint, which Next's ESLint config depends on, supports only versions below 6.1. The project uses the newest compatible release.
- **ESLint 9.** ESLint 10 is out, but the React plugin bundled in `eslint-config-next` 16.3 crashes on it.
- **Page transitions.** Next 16.3 exposes React's `<ViewTransition>`, but it ships from React's canary channel and isn't marked stable. Transitions use a small `TransitionProvider` with a custom link instead (see DESIGN.md).

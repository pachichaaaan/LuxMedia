# The Lux Expo: design

Written as the Phase 0 plan before any code, then updated after the build to match what shipped. Where the build departs from the plan, §10 says what changed and why. §11 is the QA log.

---

## 1. The idea

**Subject.** The Lux Expo runs social accounts for brands that never close. Two friends started it on a night shift in 2015. Today it's 120 people covering every hour.

**Audience.** CMOs, brand managers, and founders shortlisting a social partner. They have seen every agency site, and they're judging one thing: does this team understand the medium?

**The page's job.** Convince them it does, then get them to start a conversation.

**Signature.** The company story told as Stories: a 9:16 frame, segmented progress bars, scroll or tap to advance. That's where the site spends its boldness. Everything around it stays quiet.

**Governing rule.** The site borrows the medium's grammar (frames, segments, unread badges, timestamps, comment threads) and uses each device only where it's literally true:

- The badge appears only where something is live, unread, or being counted, plus the primary CTA.
- Progress segments appear only where there's a real sequence of stories.
- Every timestamp is either real time (the HQ clock) or a believable relative time on a fictional comment.
- Nothing from the medium is used as ornament.

**The risk we're adding.** Inside the Story frame, chapters hard-cut the way real Stories do, with no crossfade. All the motion happens outside the frame, where the title and copy mask in and out. At first the cut will feel abrupt. That abruptness is the medium's own rhythm, and it keeps the frame feeling like a product rather than a slideshow.

---

## 2. Tokens

### 2.1 Color

| Token         | Hex       | Role                | Used for                                                                                                      | Never used for                                                       |
| ------------- | --------- | ------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `midnight`    | `#1B1638` | The site's black    | Night surface, text on light surfaces, focus ring on light surfaces                                           | —                                                                    |
| `screenlight` | `#F3F4F8` | The site's white    | Day surface, text on night surfaces                                                                           | —                                                                    |
| `badge`       | `#FF3D2E` | Notification red    | Preloader badge, live dots, nav Contact dot, Story unread counter, "Start a project" and "Send message" pills | Decoration, errors, hover states, links, anything on `haze` (2.80:1) |
| `lilac`       | `#A99CFF` | Accent on dark      | Link hover, focus ring, active chip fill, all on night surfaces                                               | Text or focus rings on day/haze surfaces (2.15:1 and 1.88:1)         |
| `dusk`        | `#6E6A8A` | Muted, structural   | Meta text on `screenlight`, rules, marquee wordmarks, placeholder tone                                        | Small text on `haze` (4.08:1)                                        |
| `haze`        | `#E6E2FF` | Quiet light surface | Process band, placeholder tone, avatar fill                                                                   | Under any badge element                                              |

Tailwind's default palette is removed (`--color-*: initial`), so only these six colors exist as utilities. `bg-black` and `text-gray-900` won't compile. Every other color value in the codebase is derived from these with `color-mix()`: the text opacities below and the six Story stops.

```css
@theme {
  --color-*: initial;
  --color-midnight: #1b1638;
  --color-screenlight: #f3f4f8;
  --color-badge: #ff3d2e;
  --color-lilac: #a99cff;
  --color-dusk: #6e6a8a;
  --color-haze: #e6e2ff;

  --font-*: initial;
  --font-sans: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
  --font-weight-*: initial;
  --font-weight-bold: 700;

  --radius-*: initial;
  --radius-frame: 28px;
  --radius-pill: 9999px;

  --shadow-*: initial;
  --shadow-story: 0 48px 96px -32px rgb(27 22 56 / 0.45);

  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-power3-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### 2.2 Surfaces

Every section declares `data-surface="night" | "day" | "haze"`. The surface sets CSS variables, and components read the variables instead of hard-coding text color. The nav and cursor read the surface under them to pick their colors.

| Variable                   | night                      | day                  | haze                    |
| -------------------------- | -------------------------- | -------------------- | ----------------------- |
| `--bg`                     | midnight                   | screenlight          | haze                    |
| `--fg` (headings, 100%)    | screenlight                | midnight             | midnight                |
| `--fg-body` (78%)          | `#C3C3CE`                  | `#4B4762`            | `#484364`               |
| `--fg-meta`                | screenlight 60%, `#9D9BAB` | dusk                 | midnight 66%, `#605B7C` |
| `--rule`                   | screenlight 20%            | dusk                 | dusk                    |
| `--ring`                   | lilac                      | midnight             | midnight                |
| `--accent` (hover, active) | lilac                      | midnight + underline | midnight + underline    |

**How surfaces are assigned.** Color follows subject, not alternation:

- **Night is the feed.** It's used where the audience or the content is the subject: hero, work, CTA, case study galleries, and the 404.
- **Day and haze are the desk.** They're used where the team explains how it works: services, comments, process, forms, and legal.
- **The Story moves from night to day.** The company grows from a night shift into daylight.

| Home section        | Surface                         | Why                                                                            |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| Preloader, hero     | night                           | 2am. The feed.                                                                 |
| Story               | night to day, six stepped stops | The company grows up.                                                          |
| What we do          | day                             | Picks up from the Story's last frame with no visible seam.                     |
| Selected work       | night                           | Posts read as a feed. The cut to dark also marks where the pinned rail begins. |
| Comments, wordmarks | day                             | The clients talking.                                                           |
| Process             | haze                            | The quietest band on the page. One step off day so it reads as its own room.   |
| CTA, footer         | night                           | "Your audience is online right now."                                           |

### 2.3 Contrast (WCAG 2.2, computed with the relative-luminance formula)

All type is bold, so "large text" (3:1) means 18.66px and up. Every heading token qualifies at its smallest clamp. `body`, `body-lg`, and `small` need 4.5:1.

**Text**

| Foreground                | Background  | Ratio | Where                                                  | Verdict  |
| ------------------------- | ----------- | ----- | ------------------------------------------------------ | -------- |
| screenlight               | midnight    | 15.68 | Headings on night                                      | AAA      |
| screenlight 78% `#C3C3CE` | midnight    | 9.86  | Body on night                                          | AAA      |
| screenlight 60% `#9D9BAB` | midnight    | 6.33  | Meta on night                                          | AA       |
| midnight                  | screenlight | 15.68 | Headings on day                                        | AAA      |
| midnight 78% `#4B4762`    | screenlight | 8.04  | Body on day                                            | AAA      |
| dusk                      | screenlight | 4.67  | Meta on day, marquee                                   | AA       |
| midnight                  | haze        | 13.70 | Headings on haze                                       | AAA      |
| midnight 78% `#484364`    | haze        | 7.38  | Body on haze                                           | AAA      |
| midnight 66% `#605B7C`    | haze        | 5.08  | Meta on haze                                           | AA       |
| dusk                      | haze        | 4.08  | Large text only (process numerals)                     | AA large |
| midnight                  | badge       | 4.89  | CTA labels, preloader count, unread counter            | AA       |
| lilac                     | midnight    | 7.29  | Link hover on night                                    | AAA      |
| midnight                  | lilac       | 7.29  | Active chip on night, placeholder labels on lilac tone | AAA      |
| screenlight               | dusk        | 4.67  | Placeholder labels and frame chrome on dusk tone       | AA       |
| white                     | badge       | 3.52  | Not used: fails body text                              | ✗        |
| screenlight               | badge       | 3.21  | Not used                                               | ✗        |
| lilac                     | screenlight | 2.15  | Not used                                               | ✗        |
| lilac                     | haze        | 1.88  | Not used                                               | ✗        |
| dusk                      | midnight    | 3.36  | Not used for text                                      | —        |

**Non-text (UI components and focus, 3:1)**

| Element               | Against            | Ratio         | Verdict                         |
| --------------------- | ------------------ | ------------- | ------------------------------- |
| lilac focus ring      | midnight           | 7.29          | ✓                               |
| midnight focus ring   | screenlight / haze | 15.68 / 13.70 | ✓                               |
| badge pill / live dot | midnight           | 4.89          | ✓                               |
| badge pill / live dot | screenlight        | 3.21          | ✓                               |
| badge anything        | haze               | 2.80          | ✗, so no badge elements on haze |
| dusk input rule       | screenlight        | 4.67          | ✓                               |

### 2.4 Story background stops

A continuous blend from midnight to screenlight can't hold contrast. At t ≈ 0.44 the background is `#79778C`, where the best available text color reaches only **3.96:1**. That passes for headings and fails for the body copy beside the frame. So the background moves in six stepped stops, and it only changes while the chapter text is masked out (see the motion map, item 8). Text is only ever visible over a stop it was checked against.

| Chapter                            | Stop                    | Text        | Title | Body 78% | Focus ring     | Frame tone (edge vs bg) |
| ---------------------------------- | ----------------------- | ----------- | ----- | -------- | -------------- | ----------------------- |
| 2015 The night shift               | `#1B1638`               | screenlight | 15.68 | 9.86     | lilac 7.29     | dusk (3.36)             |
| 2017 The post that broke the inbox | `#241E48`               | screenlight | 14.11 | 9.07     | lilac 6.56     | lilac (6.56)            |
| 2019 Building the system           | `#30285C`               | screenlight | 12.06 | 7.95     | lilac 5.61     | lilac (5.61)            |
| 2020 Everyone moved online         | `#D2CCF6`               | midnight    | 11.25 | 6.52     | midnight 11.25 | midnight (11.25)        |
| 2023 The creator era               | `#E6E2FF` (haze)        | midnight    | 13.70 | 7.38     | midnight 13.70 | dusk (4.08)             |
| Today                              | `#F3F4F8` (screenlight) | midnight    | 15.68 | 8.04     | midnight 15.68 | midnight (15.68)        |

The text flips from light to dark between 2019 and 2020, the year "every storefront became a feed." The frame chrome (handle, year, segments) sits on the frame's tone, not the section background. On dusk and midnight tones it's screenlight (4.67 and 15.68). On lilac it's midnight (7.29).

### 2.5 Type

Poppins, weight 700, is the only face and the only weight. It's loaded with `next/font/google` (`weight: "700"`, `subsets: ["latin"]`, `display: "swap"`, `variable: "--font-poppins"`). It's self-hosted at build, so there are no external font requests.

| Token     | Size                          | Line-height | Tracking | Used for                                                            |
| --------- | ----------------------------- | ----------- | -------- | ------------------------------------------------------------------- |
| `display` | `clamp(3.5rem, 11vw, 13rem)`  | 0.88        | -0.045em | Hero headline, CTA statement, About hero                            |
| `h1`      | `clamp(2.75rem, 7vw, 7.5rem)` | 0.92        | -0.04em  | Page headlines, Story chapter titles, case study results            |
| `h2`      | `clamp(2rem, 4.5vw, 4.5rem)`  | 1.0         | -0.03em  | Service rows, marquee wordmarks, section headlines                  |
| `h3`      | `clamp(1.375rem, 2vw, 2rem)`  | 1.15        | -0.015em | Small section headings, process steps, result lines, CTA pill label |
| `body-lg` | `1.25rem`                     | 1.5         | -0.005em | Comments, intros, descriptor                                        |
| `body`    | `1.0625rem`                   | 1.65        | 0        | Running text, nav, form fields                                      |
| `small`   | `0.875rem`                    | 1.5         | 0.005em  | Meta, timestamps, like counts, legal                                |

These are defined as `--text-*` with `--line-height` and `--letter-spacing` sub-tokens, so `text-h2` sets all three. The default type scale is removed with `--text-*: initial`.

Rules:

- `font-synthesis: none`. There's no faux italic and no faux bolder. `<em>` and `<strong>` are left unstyled, and the copy doesn't rely on them.
- Hierarchy comes from size, tracking, line-height, and three opacity tiers: 100% headings, 78% body, and 60% meta (dusk on day).
- Body measure is capped at `62ch`.
- Sentence case everywhere. The codebase has no `text-transform: uppercase`, and QA greps for it.
- `-webkit-font-smoothing: antialiased` on night surfaces, because bold type on dark otherwise blooms.
- Headings use `text-wrap: balance` and body uses `text-wrap: pretty`.
- The clock and counters use `tabular-nums`. If the Poppins subset doesn't expose `tnum`, they sit in fixed-width `ch` slots so digits can't shift layout.
- Headlines are left-aligned and run edge to edge at `display` size. No headline is cropped by the viewport, because a cropped tagline can't be read at LCP. The marquee is the one element that runs off both edges.

### 2.6 Layout

- **Grid.** 4 columns under 768px, 8 columns from 768 to 1023px, and 12 columns from 1024px. (The Story uses its own stage: frame-left from 768px, three zones from 1280px.) Gutters are 16px on mobile and 24px from 768px. Page margin is `clamp(20px, 4vw, 64px)`.
- **Test widths.** 375, 768, 1024, 1440, 1920.
- **Radius.** 28px on 9:16 media frames, full pill on buttons, chips, and radio pills. Circles are reserved for two signals, the notification badge and the cursor, and are never used as containers. Everything else is square, including avatars, inputs, and 4:5, 1:1, and 16:9 media.
- **Shadow.** Exactly one, `--shadow-story`, under the Story frame.
- **Rules.** 1px in `--rule`, only between items in a list: service rows, FAQ, process steps, footer top.
- **Vertical rhythm.** Section padding is `max(20vh, 8rem)` from 1024px and `6rem` on mobile. Pinned sections pad their stage instead.
- **Alignment.** Left-aligned everywhere. Centering happens only inside Story frames, including the 404.

---

## 3. Home page wireframes

Glyph key: `╭╮` marks a 28px-radius 9:16 frame. `┌┐` marks square media or containers. `━` is a filled progress segment and `─` an empty one. `●` is a badge-red signal. `┆` marks an invisible tap or click zone. Text in `( )` is a cursor label.

### 3.1 Preloader

```
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│                      │   │░░░░░░░░░░░░░░░░░░░░░░│   │░░░░░░░░░░░░░░░░░░░░░░│
│                      │   │░░░░░░░░░░░░░░░░░░░░░░│   │░░░░░░░░░░░░░░░░░░░░░░│
│                      │   │░░░░░░░░░░░░░░░░░░░░░░│   │                      │
│       ( 37 )         │   │░░░░░░░ 99+ ░░░░░░░░░░│   │ We work the          │
│                      │   │░░░░░░░░░░░░░░░░░░░░░░│   │ hours your           │
│                      │   │░░░░░░░░░░░░░░░░░░░░░░│   │ audience             │
│                      │   │░░░░░░░░░░░░░░░░░░░░░░│   │                      │
└──────────────────────┘   └──────────────────────┘   └──────────────────────┘
Beat 1, up to 1.6s         Beat 2, 0.45s              Beat 3, 0.45s
Badge counts 1 to 99+,     circle() grows from        Red layer wipes out
gated on fonts and         the badge to cover         the top. Headline lines
hero media.                the viewport.              rise, 0.08s apart.
```

- The badge is a circle sized to fit "99+", so it doesn't change size as digits are added. The count is midnight on badge (4.89:1).
- Readiness means `document.fonts.ready` plus hero media ready. For a placeholder that's immediate. For a real image it's `decode()` on the first post. The count holds at 98 until ready and is released by 1.6s at the latest, so the overlay is gone by 2.5s even in the worst case.
- Beat 3 uses the same wipe as page transitions: swipe to the next story.

### 3.2 Hero, desktop (and nav)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ The Lux Expo                            Work   About   Services   Contact● │
│                                                                            │
│                                                        ╭────────────────╮  │
│ We work the                                            │ hearthandcrumb │  │
│ hours your                                             │                │  │
│ audience                                               │                │  │
│ scrolls.                                               │  Bakery reel,  │  │
│                                                        │      14s       │  │
│                                                        │                │  │
│                                                        │                │  │
│                                                        │ Fresh out at   │  │
│                                                        │ 6am.           │  │
│                                                        ╰────────────────╯  │
│ Social media management for                       ●  Posting now   02:14   │
│ brands that never close.                                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

- Headline: `display`, columns 1 to 8, from `brand.tagline`. Nav: `body` size. Contact carries the only badge dot in the nav, the "unread" signal.
- Frame: columns 10 to 12, about 62vh tall, tone dusk. Four posts stack vertically inside. Each has a client handle top-left, the placeholder label centered, and a one-line caption at the bottom.
- Bottom row: descriptor in `body-lg` at 78%, and the live row under the frame: badge dot (three pulses, then still), "Posting now", HQ time in `small` `tabular-nums`, and a "Pause feed" control. Moving content that runs longer than 5 seconds needs a way to stop it (WCAG 2.2.2).
- There's no "Scroll to explore" cue, because the advancing feed already tells you the page is live.

### 3.3 Hero, mobile

```
┌─────────────────────────────┐
│ The Lux Expo           Menu │
│                             │
│ We work                     │
│ the hours                   │
│ your                        │
│ audience                    │
│ scrolls.                    │
│                             │
│              ╭────────────╮ │
│              │hearthand…  │ │
│              │            │ │
│              │            │ │
│              │Bakery reel │ │
│              │            │ │
│              │            │ │
│              │Fresh out…  │ │
│              │            │ │
│              ╰────────────╯ │
│ Social media management     │
│ for brands that never       │
│ close.                      │
│ ●  Posting now   02:14      │
└─────────────────────────────┘
```

- Headline wraps naturally at the `display` minimum (56px), and the frame sits right-aligned in columns 2 to 4. Hero height is `auto`, not forced to 100svh, so the descriptor shows above the fold on a 375×667 screen.

### 3.4 Mobile menu

```
┌───────────────────────────────┐
│ The Lux Expo            Close │
│                               │
│                               │
│ Work                          │
│                               │
│ About                         │
│                               │
│ Services                      │
│                               │
│ Contact ●                     │
│                               │
│                               │
│                               │
│ hello@theluxexpo.example      │
│ Instagram  TikTok             │
│ LinkedIn  YouTube             │
└───────────────────────────────┘
```

- "Menu" and "Close" are text buttons, not icons. Links are set at `h1`. The panel is a full-screen night overlay with a focus trap, Esc to close, Lenis stopped for scroll lock, and focus returned to "Menu" on close.

### 3.5 The story (signature), desktop 1280px and up

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          ╭───────────────────────╮                         │
│                          │━━━ ━━━ ━━─ ─── ─── ───│                         │
│                          │ theluxexpo (300) 2017 │                         │
│                          │                       │                         │
│ The post                 │                       │   A 14-second video for │
│ that broke               │                       │   a neighborhood bakery │
│ the inbox.               │     Bakery reel,      │   crossed 4 million     │
│                          │      14 seconds       │   views in a weekend.   │
│                          │                       │   By Monday there were  │
│                          │                       │   300 unread messages.  │
│                          │           ┆           │   They made their first │
│                          │           ┆           │   hires.                │
│                          │   Back    ┆   Next    │                         │
│                          │           ┆           │                         │
│                          ╰───────────────────────╯                         │
│                               one soft shadow                              │
└────────────────────────────────────────────────────────────────────────────┘
```

- Pinned and scrubbed, with about 90vh of scroll per chapter. The frame is centered, `max-height: 82vh`, 9:16, 28px radius, and carries the site's single shadow.
- **Segments.** One per chapter. Segment _i_ fills (scaleX) across chapter _i_'s slice of scroll, so a segment fills while you're watching that story.
- **In-frame chrome.** Handle `theluxexpo` top-left and year top-right. In chapter 2 only, a badge counter next to the handle climbs from 0 to 300 as you scrub through the chapter. That's "300 unread messages," made literal.
- **Visuals.** Hard-cut between chapters, with no crossfade.
- **Outside the frame.** Title at `h1` in columns 1 to 4. Two or three sentences of `body-lg` in columns 9 to 12.
- **Navigation.**
  - The left and right halves of the frame are two real `<button>`s ("Previous chapter", "Next chapter") with cursor labels "Back" and "Next". They call `lenis.scrollTo()` on the chapter's scroll position.
  - Arrow keys work when the section has focus.
  - An `aria-live="polite"` region announces "Chapter 3 of 6: Building the system", debounced 300ms so fast scrolling doesn't queue six announcements.
- **Heading.** The section `h2` ("Our story, 2015 to today") is visually hidden, because the frame makes the section's purpose obvious. Chapter titles are `h3` set at `h1` size.

### 3.6 The story, tablet and small laptop, 768 to 1279px

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ╭─────────────────────╮                                                    │
│ │ ━━ ━━ ━─ ── ── ──   │                                                    │
│ │ theluxexpo     2017 │     The post that                                  │
│ │                     │     broke the inbox.                               │
│ │                     │                                                    │
│ │                     │                                                    │
│ │    Bakery reel,     │                                                    │
│ │     14 seconds      │     A 14-second video for a neighborhood bakery    │
│ │                     │     crossed 4 million views in a weekend. By       │
│ │                     │     Monday there were 300 unread messages. They    │
│ │                     │     made their first hires.                        │
│ │                     │                                                    │
│ │                     │                                                    │
│ │                     │                                                    │
│ ╰─────────────────────╯                                                    │
└────────────────────────────────────────────────────────────────────────────┘
```

- Below 1280px a three-zone layout can't fit the longest title words (about 4.5em at `h1`) beside the frame. So the frame sits left at `min(82svh × 9/16, 44vw)`, and the title and copy stack on the right. It's still pinned and works the same way.

### 3.7 The story, mobile under 768px (native viewer, not pinned)

```
┌───────────────────────────────┐
│ ━━━━ ━━━━ ━━── ──── ──── ──── │
│ theluxexpo (300)         2017 │
│                               │
│ ┌───────────────────────────┐ │
│ │                           │ │
│ │  Bakery reel, 14 seconds  │ │
│ │                           │ │
│ │                           │ │
│ │        ┆                  │ │
│ │        ┆                  │ │
│ │ Back   ┆        Next      │ │
│ │        ┆                  │ │
│ │        ┆                  │ │
│ └───────────────────────────┘ │
│                               │
│ The post that broke           │
│ the inbox.                    │
│                               │
│ A 14-second video for a       │
│ neighborhood bakery crossed   │
│ 4 million views in a          │
│ weekend. By Monday there      │
│ were 300 unread messages.     │
│                               │
└───────────────────────────────┘
```

- The viewer is 100svh, and the phone screen is the frame, so the visual inside is square-cornered and edge to edge.
- **Gestures.** Tap the left third to go back and the right two-thirds to advance, the platform convention. Horizontal swipe also works. `touch-action: pan-y` keeps vertical page scroll working through the viewer.
- **No auto-advance.** On tap, the current segment fills over 0.6s.
- **Type.** Titles drop to `h2` size here so the visual keeps most of the screen.
- **Background.** Tweens through the same six stops with the same contrast guard.
- **Keyboard.** The tap zones are the same two buttons as on desktop, so keyboard and switch users get identical controls.

### 3.8 The story, reduced motion (any width)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ╭────────╮    2015                                          band #1B1638   │
│ │        │    The night shift.                                             │
│ │        │                                                                 │
│ │ Kitchen│    Two friends running three local accounts from a kitchen      │
│ │ table  │    table after their day jobs. They posted at 11pm because      │
│ │        │    that's when their customers were awake.                      │
│ ╰────────╯                                                                 │
│                                                                            │
│ ╭────────╮    2017                                          band #241E48   │
│ │        │    The post that broke the inbox.                               │
│ │        │                                                                 │
│ │ Bakery │    A 14-second video for a neighborhood bakery crossed 4        │
│ │ reel   │    million views in a weekend. By Monday there were 300         │
│ │        │    unread messages. They made their first hires.                │
│ ╰────────╯                                                                 │
└────────────────────────────────────────────────────────────────────────────┘
```

- A static list: each chapter is a band with its own stop color, a small frame, the year, the title, and the copy. No pin, no tweening, no segments. The night-to-morning story still reads, just without motion.
- One DOM, three modes. The server renders this list, which is also what search engines and no-JS visitors get. On the client, `StoryController` sets `data-mode="pinned" | "viewer" | "list"` through `gsap.matchMedia()`, and CSS turns the same markup into the stage. The section is well below the fold, so the mode switch can't cause a visible layout shift.

### 3.9 What we do, desktop (row 2 hovered)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Six services. Most clients start with two.                See all services │
│                                                                            │
│ ────────────────────────────────────────────────────────────────────────── │
│ Social strategy                                                            │
│ ─────────────────────────────────────────────────────────────╭─────────╮── │
│ Content and short-form video                                 │         │   │
│ Scripted, shot and cut in-house, mostly under 30s.           │         │   │
│ ─────────────────────────────────────────────────────────────│ 9:16    │── │
│ Community management, 24/7                                   │ reel    │   │
│ ─────────────────────────────────────────────────────────────│         │── │
│ Paid social                                                  │         │   │
│ ─────────────────────────────────────────────────────────────│         │── │
│ Creator partnerships                                         ╰─────────╯   │
│ ────────────────────────────────────────────────────────────────────────── │
│ Reporting and insights                                                     │
│ ────────────────────────────────────────────────────────────────────────── │
└────────────────────────────────────────────────────────────────────────────┘
```

- The heading is a real sentence, an `h2` set at `h3` size. It sits above a full-width list of six links at `h2` size, separated by rules. There's no numbering, because services aren't a sequence, and no arrows.
- **Hover or focus opens the row.** Each row reserves space for its one-line description, so opening it is a `clip-path` reveal plus a small `translateY` on the name. Nothing reflows.
- **Preview frame.** A single 9:16 preview, 200×356px. It follows the pointer vertically and drifts only within the right third horizontally, so it never covers the name it previews. Its content hard-cuts between rows, Stories logic again.
- **Keyboard.** On keyboard focus the preview pins to the right end of the row instead of following.
- Each row links to `/services#<slug>`.

### 3.10 What we do, mobile accordion

```
┌───────────────────────────────┐
│ Six services. Most clients    │
│ start with two.               │
│                               │
│ ───────────────────────────── │
│ Social strategy             + │
│ ───────────────────────────── │
│ Content and short-form      – │
│ video                         │
│                               │
│ Scripted, shot and cut        │
│ in-house, mostly under 30s.   │
│                               │
│ ╭───────╮                     │
│ │       │                     │
│ │       │                     │
│ │ 9:16  │                     │
│ │ reel  │                     │
│ │       │                     │
│ │       │                     │
│ │       │  See how we make    │
│ ╰───────╯  video              │
│                               │
│ ───────────────────────────── │
│ Community management, 24/7    │
│ ⋮                             │
└───────────────────────────────┘
```

- Each row is a `button` inside an `h3` with `aria-expanded`, controlling a region that holds the description, the inline preview, and a link to the service. The "+" and "–" glyphs mirror state for sighted users; screen readers get the state from `aria-expanded`.

### 3.11 Selected work, desktop (pinned horizontal rail)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Work that moved a number.                                                  │
│                                                                            │
│ ╭────────╮                               ╭────────╮                        │
│ │        │                               │        │                        │
│ │        │                               │        │                        │
│ │        │  ┌───────────┐                │        │  ┌───────────┐         │
│ │        │  │           │                │        │  │           │         │
│ │  9:16  │  │           │  ┌──────────┐  │  9:16  │  │           │         │
│ │        │  │           │  │          │  │        │  │           │         │
│ │        │  │   4:5     │  │ ( View ) │  │        │  │   4:5     │  See    │
│ │        │  │           │  │          │  │        │  │           │  all    │
│ │        │  │           │  │   1:1    │  │        │  │           │  work   │
│ │        │  │           │  │          │  │        │  │           │         │
│ ╰────────╯  └───────────┘  └──────────┘  ╰────────╯  └───────────┘         │
│                                                                            │
│ Tidewater   Saltgrass      Kilo          Hearth &    Bramble               │
│ From 8k to  Replies in     Cost per      A line out  Readers in            │
│ 210k in 9mo 14 minutes     sale −41%     the door    40 cities             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

- Vertical scroll drives `translateX`. A mouse drag on the rail also scrubs it (cursor label "Drag"), with click suppression after a drag. Items show "View".
- **Media and captions.** Mixed ratios (9:16, 4:5, 1:1), bottom-aligned on a shared baseline so the captions line up. Captions: client name in `small` meta, and the result line in `h3`.
- **End of the rail.** A large "See all work" link at `h1`.
- **Keyboard.** Items are links. Focusing one that's off-screen scrolls the page to the vertical position that brings it into view.
- **Hover effect.** An R3F displacement shader on hover. It falls back to a CSS scale on touch, low-power devices, and reduced motion.

### 3.12 Selected work, mobile

```
┌───────────────────────────────┐
│ Work that moved               │
│ a number.                     │
│                               │
│ ╭────────────────────╮        │
│ │                    │        │
│ │                    │  ┌──── │
│ │                    │  │     │
│ │                    │  │     │
│ │        9:16        │  │     │
│ │                    │  │     │
│ │                    │  │     │
│ │                    │  │     │
│ │                    │  │     │
│ │                    │  │     │
│ ╰────────────────────╯  └──── │
│                               │
│ Tidewater Swim                │
│ From 8k to 210k followers     │
│ in nine months                │
└───────────────────────────────┘
```

- Native horizontal scroll with `scroll-snap-type: x mandatory`. Items are 78vw wide so the next one peeks in. No JS.
- Under reduced motion on desktop, the rail becomes a static three-column grid of the same items.

### 3.13 Clients say (a comment thread)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ From the comments.                                                         │
│                                                                            │
│                         ┌──┐  Mara Quintos   2w                            │
│                         │MQ│  Head of brand, Tidewater Swim                │
│                         └──┘  They answered a customer at 3:40am on a      │
│                               Sunday, in our voice. Better than we would   │
│                               have.                                        │
│                               1,204 likes                                  │
│                                │                                           │
│                                │  ┌──┐  theluxexpo   2w                    │
│                                │  │TL│  We were up anyway.                 │
│                                │  └──┘  318 likes                          │
│                                │                                           │
│                                                                            │
│                         ┌──┐  Joel Ramírez   3w                            │
│                         │JR│  Founder, Kilo Skincare                       │
│                         └──┘  The weekly report is one page. I read it on  │
│                               Monday before my coffee is cold.             │
│                               877 likes                                    │
│                               ⋮                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Avatars.** Square, because of the radius rule, with a lilac fill and midnight initials (7.29:1). The team's reply uses midnight.
- **Comment layout.** Name, then the timestamp separated by space (no middle dot), then the role on its own line in meta. The comment is `body-lg` at 78%. The like count is written out as text ("1,204 likes"), with no heart icon, because hearts belong to specific platforms.
- **The brand's reply.** One short reply from the team, indented with a structural thread rule. It shows the 24/7 desk in the brand's own voice.
- Static, with no carousel.

### 3.14 Client wordmarks (marquee)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│ umb      Tidewater Swim      saltgrass      Kilo      Bramble Books      N │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

- Fictional wordmarks in Poppins Bold at `h2` in dusk on day (4.67:1). They're separated by space only, with no stars or dots.
- **Motion.** Linear. Base speed is one loop per 40s. Scroll velocity multiplies it up to 4×, and scroll direction sets which way it runs. Hovering pauses it, and a small "Pause" control below stops it (WCAG 2.2.2).
- **Accessibility.** The visually hidden `h2` is "Brands we post for". The list is read once, and the cloned loop copy is `aria-hidden`.
- **Reduced motion.** A static wrapped row, with no clones.

### 3.15 How we work (process)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Four steps, repeated every month.                                          │
│                                                                            │
│                                                                            │
│ ─────────────────  ─────────────────  ─────────────────  ───────────────── │
│ 1  Listen          2  Plan            3  Publish         4  Learn          │
│                                                                            │
│ Two weeks reading  A month of posts   We post, reply     A one-page report │
│ your comments,     on one calendar,   and moderate in    every Monday:     │
│ reviews and DMs    approved in one    shifts, around     what worked, and  │
│ before we post.    meeting.           the clock.         what changes.     │
└────────────────────────────────────────────────────────────────────────────┘
```

- A real `<ol>`. Each step starts with a short rule. The numeral and step name are `h3` on one line, followed by one paragraph. Numbering is right here because this is a true sequence.
- On haze. No scroll effects.

### 3.16 Closing CTA and footer

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Your audience                                                              │
│ is online                                                                  │
│ right now.                                                                 │
│                                                                            │
│                                                                            │
│ ╭────────────────────────╮      hello@theluxexpo.example                   │
│ │    Start a project     │      ● It's 02:14 at HQ. We're posting.         │
│ ╰────────────────────────╯                                                 │
│                                                                            │
│                                                                            │
│ ────────────────────────────────────────────────────────────────────────── │
│ The Lux Expo          Work            Instagram         Privacy            │
│ Social media          About           TikTok                               │
│ management for        Services        LinkedIn                             │
│ brands that           Contact         YouTube                              │
│ never close.                                                               │
│                                                                            │
│ © 2026 The Lux Expo Inc.                                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Statement.** `display` size, bookending the hero.
- **CTA.** A badge-red pill with a midnight label, `h3` on phones and `h2` on desktop (about 2.1em tall), and magnetic.
- **Beside the CTA.** The email link and a live line: "It's 02:14 at HQ. We're posting."
- **Footer.** Small and quiet, with no giant wordmark. Social links are text labels. The © year is computed at render.

### 3.17 Not found

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          ╭───────────────────────╮                         │
│                          │─── ─── ─── ─── ─── ───│                         │
│                          │                       │                         │
│                          │                       │                         │
│                          │                       │                         │
│                          │                       │                         │
│                          │ This post is no longer│                         │
│                          │       available.      │                         │
│                          │                       │                         │
│                          │                       │                         │
│                          │  Go to the home page  │                         │
│                          │                       │                         │
│                          │                       │                         │
│                          │                       │                         │
│                          ╰───────────────────────╯                         │
└────────────────────────────────────────────────────────────────────────────┘
```

- A Story frame in dusk tone on night, with every segment empty. "This post is no longer available." is centered in the frame, the only centered text outside the Story, and the reason the frame exists. The link reads "Go to the home page".

---

## 4. Inner pages

| Page           | Surfaces                                        | Structure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/about`       | night hero, then day, haze, day                 | **Hero:** "Ten years on the night shift." at `display` (see open question 5). **Extended story:** long-form chapters, with the year in a left column (the year is information, so it isn't a decorative label). **Values:** three plain statements at `h2`, unnumbered, no icons. **Team grid:** 12 people, 4 columns on desktop and 2 on mobile, 4:5 square-cornered MediaSlot, name, and role. Hover or focus swaps the role for their local time ("4:12pm in Lisbon"). On touch, local time sits under the role. **Careers teaser** links to an email address. |
| `/services`    | night hero, day sections, haze process, day FAQ | **Hero:** h1 with in-page links to the six services. **Each service section:** `h2`, description, "What's included", "Typical outcomes", and a related case study link (MediaSlot plus result line). **Process:** the shared component. **FAQ:** six questions with `Disclosure`. No closing CTA (cut in the restraint pass, §11).                                                                                                                                                                                                                                |
| `/work`        | night                                           | **Header:** h1 and filter chips (`aria-pressed`) synced to `?service=`. **Grid:** a 12-column grid with deliberately placed mixed ratios, not auto-masonry. Filtering animates with GSAP Flip. When a filter returns nothing, the page says "No case studies for this service yet. Show all work."                                                                                                                                                                                                                                                                |
| `/work/[slug]` | night hero and gallery, day body and results    | **Hero:** client, headline result at `h1`, then services, year, and platforms as a `<dl>`. **Body:** challenge, approach, and a mixed-ratio gallery on night, in balanced columns. **Results:** three metrics in the big-number treatment, the only big numbers on the site. **Then:** a testimonial and a full-width "Next case study" link with a clip-path hover preview. Pages come from `generateStaticParams` and `generateMetadata`.                                                                                                                       |
| `/contact`     | day                                             | **Left:** "Tell us about your brand.", the email, and the reply promise. **Right:** the form. **Fields:** square-cornered, with a dusk bottom rule (4.67:1) that thickens to 2px midnight on focus. **Errors:** written in midnight, not red, because red is reserved for the badge. They're tied to fields with `aria-describedby`, and an error summary at the top links to each invalid field. **Primary action:** "Send message" in the badge pill.                                                                                                           |
| `/privacy`     | day                                             | Long-form text, 62ch measure, `h2` per topic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `not-found`    | night                                           | See 3.17.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

Every page opens on night except Contact and Privacy, which are desk pages. The nav adapts because it reads the surface beneath it.

---

## 5. Copy calibration

Voice: confident, dry, unhurried, plain. A team that has watched every trend come and go. Drafted section headlines, final in Phase 1:

| Place            | Draft                                           |
| ---------------- | ----------------------------------------------- |
| Services heading | Six services. Most clients start with two.      |
| Work heading     | Work that moved a number.                       |
| Comments heading | From the comments.                              |
| Process heading  | Four steps, repeated every month.               |
| CTA              | Your audience is online right now.              |
| Live line        | It's 02:14 at HQ. We're posting.                |
| Work index h1    | Case studies, with the numbers left in.         |
| Services h1      | Six services, one desk.                         |
| Form success     | Message sent. We reply within one business day. |
| Email error      | Enter a work email, like name@company.com.      |

Words we don't use: _scroll-stopping, elevate, unlock, seamless, next-level, storytelling, passionate, journey, synergy, cutting-edge, game-changer_.

---

## 6. Motion map

Principles: one orchestrated load moment (the preloader into the hero) and one signature scroll moment (the Story). Everything else moves only when the user does something, or very subtly. Only `transform`, `opacity`, and `clip-path` are animated. Reveals use `expo.out`, transitions use `power3.inOut`, and only the marquee is linear.

| #   | Moment                      | Trigger                                                 | What moves                                                                                                                                             | Timing                                                                                                                                    | Why                                                           | Reduced motion                  | Touch, under 768px                  |
| --- | --------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------- | ----------------------------------- |
| 1   | Preloader count             | First load in a session                                 | Badge digits (requestAnimationFrame)                                                                                                                   | Up to 1.4s, power2.out curve, held at 98 until fonts and hero media are ready                                                             | Sets up "unread" before a word is read. Covers the font swap. | Skipped                         | Same                                |
| 2   | Preloader expand            | Count reaches 99+                                       | Red layer `clip-path: circle()` from badge to viewport (Web Animations API)                                                                            | 0.45s power3.inOut                                                                                                                        | Opening the notification                                      | Skipped                         | Same                                |
| 3   | Preloader exit, hero reveal | Expand ends                                             | Red layer wipes out the top. Headline lines rise in masks.                                                                                             | Wipe 0.45s power3.inOut. Lines 0.9s expo.out, 0.08s stagger.                                                                              | Same gesture as page transitions                              | Static headline                 | Same                                |
| 4   | Hero feed                   | Time, while in view, not hovered or focused, not paused | Post stack `translateY`, one post per step                                                                                                             | Hold 2.8s, move 0.9s power3.inOut. "Pause feed" stops it.                                                                                 | Shows the work happening                                      | First post, static, no control  | Same. Pauses off-screen.            |
| 5   | Live dot                    | On load                                                 | Ring `scale` 1 to 2.4, `opacity` 0.6 to 0                                                                                                              | Three 1.6s pulses, then still (under WCAG 2.2.2's 5s)                                                                                     | "Live"                                                        | Static dot                      | Same                                |
| 6   | Hero drift                  | Scroll, scrubbed                                        | Line masks `yPercent` 0, −6, −12, −18. Frame `scale` 1 to 0.92.                                                                                        | Scrub 0.6                                                                                                                                 | Depth as you leave                                            | None                            | None                                |
| 7   | Story progress              | Scroll, scrubbed                                        | Segment fill `scaleX`                                                                                                                                  | Scrubbed                                                                                                                                  | The story advances with you                                   | No segments                     | Fill 0.6s expo.out on tap           |
| 8   | Story chapter change        | Index changes (scroll, click, key, tap, swipe)          | Lines mask out (`yPercent` 0 to −135) then in (135 to 0). Background tweens between stops. In-frame visual hard-cuts.                                  | Out 0.45s power3.inOut. Background 0.7s power3.inOut. In 0.9s expo.out from 0.4s (0.7s when the ink flips), 0.08s stagger. Interruptible. | Text appears only over a stop it was checked against          | Static bands                    | Same, on tap                        |
| 9   | Unread counter, chapter 2   | Scroll within chapter 2                                 | Badge digits 0 to 300                                                                                                                                  | Scrubbed                                                                                                                                  | "300 unread messages," literally                              | Hidden (no chrome in list mode) | Counts once on entry, 1.2s expo.out |
| 10  | Service row                 | Hover, focus                                            | Description `clip-path` reveal, name `translateY`                                                                                                      | 0.6s expo.out                                                                                                                             | Reveals one line, only when asked                             | Instant                         | Accordion, instant                  |
| 11  | Service preview             | Pointer over list                                       | Frame follows the pointer vertically and drifts within the right third horizontally (quickTo 0.5s). `clip-path` in and out. Hard cut between rows.     | 0.6s expo.out                                                                                                                             | One preview, never covering the type                          | Pinned beside the row           | Inline in accordion                 |
| 12  | Work rail                   | Scroll, drag                                            | Track `translateX`                                                                                                                                     | Scrubbed                                                                                                                                  | Browsing the feed sideways                                    | Static grid                     | Native swipe and snap               |
| 13  | Work hover                  | Hover                                                   | Displacement uniform 0 to 1 (WebGL)                                                                                                                    | Damped in about 0.8s, out about 0.6s                                                                                                      | The image reacts like a thumb on glass                        | CSS scale 1.03, instant         | CSS scale on press                  |
| 14  | Marquee                     | On screen, plus scroll velocity                         | Track `x`, wrapped                                                                                                                                     | Linear, 40s per loop, up to 4× with velocity, direction follows scroll. "Pause" stops it.                                                 | Wordmarks move with you                                       | Static wrapped row, no control  | Same                                |
| 15  | Nav                         | Scroll direction                                        | `translateY` −100% or 0                                                                                                                                | 0.6s power3.inOut                                                                                                                         | Gets out of the way                                           | Always visible                  | Same                                |
| 16  | Cursor                      | Pointer                                                 | Dot (lerp 0.35) and ring (lerp 0.15). Ring scales and shows a label on `data-cursor`.                                                                  | Label 0.6s expo.out                                                                                                                       | Tells you what a click does                                   | Native cursor                   | Native cursor                       |
| 17  | Magnetic                    | Pointer over primary CTAs and nav links                 | `translate` up to 20–30% of the offset                                                                                                                 | Follow and release 0.6s expo.out                                                                                                          | Primary actions feel within reach                             | Off                             | Off                                 |
| 18  | Page transition             | Internal link click; back and forward                   | Midnight panel `clip-path` wipes up, route changes, panel wipes out the top, new h1 lines rise. Back/forward covers before paint, then plays the exit. | 0.45s + 0.45s power3.inOut, 900ms max. Lines 0.8s expo.out.                                                                               | Swipe to the next story                                       | Instant swap                    | Same                                |
| 19  | Mobile menu                 | Menu button                                             | Overlay `clip-path` wipe up                                                                                                                            | 0.6s power3.inOut                                                                                                                         | Same gesture as transitions                                   | Instant                         | (mobile only)                       |
| 20  | Work filter                 | Chip toggle                                             | Items via GSAP Flip, `opacity` for leavers                                                                                                             | 0.6s power3.inOut                                                                                                                         | You can see where items went                                  | Instant                         | Same                                |
| 21  | Next case study             | Hover, focus                                            | Preview `clip-path` reveal                                                                                                                             | 0.6s expo.out                                                                                                                             | Previews the destination                                      | Instant                         | Preview always shown                |
| 22  | Team local time             | Hover                                                   | Role and local time `opacity` swap                                                                                                                     | 0.6s expo.out                                                                                                                             | "Someone's on, somewhere"                                     | Instant                         | Both shown, stacked                 |

**Deliberately still:** every section heading (no entrance animations), comments, process, footer, privacy, case study body copy, and inner-page h1s on a direct load. They animate only after a page transition.

**Duration exceptions.** The brief asks for 0.6 to 1.2s, a 900ms cap on page transitions, and a 2.5s preloader cap. The two-phase transitions (items 2, 3, and 18) use 0.45s per phase so the caps hold. Everything else stays inside 0.6 to 1.2s.

---

## 7. Component inventory

| Component                  | Path                                         | Runtime             | Notes                                                                                                                            |
| -------------------------- | -------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Nav                        | `components/layout/Nav.tsx`                  | client              | Hides on scroll down, returns on scroll up. Reads the surface under it for colors. Contact badge dot. Magnetic links.            |
| MobileMenu                 | `components/layout/MobileMenu.tsx`           | client              | Focus trap, Esc, page behind made `inert`, scroll lock, focus returned to "Menu"                                                 |
| Footer                     | `components/layout/Footer.tsx`               | server              | Nav, social text links, privacy, © year                                                                                          |
| SkipLink                   | `components/layout/SkipLink.tsx`             | server              | "Skip to content", first focusable element                                                                                       |
| SmoothScroll               | `components/motion/SmoothScroll.tsx`         | client              | Lenis after first idle, on the GSAP ticker only while a scroll is in flight; syncs ScrollTrigger when present                    |
| Cursor                     | `components/motion/Cursor.tsx`               | client              | Fine pointer only. Sleeps when caught up. Hides on Tab and arrows, and over text fields.                                         |
| Magnetic                   | `components/motion/Magnetic.tsx`             | client              | Wraps one child. `gsap.quickTo`.                                                                                                 |
| PageTransition             | `components/motion/PageTransition.tsx`       | client              | `TransitionProvider`: panel, route commit detection, back/forward handling, headline reveal, dev-only ScrollTrigger leak warning |
| TransitionLink             | `components/motion/TransitionLink.tsx`       | client              | Wraps `next/link`. Modified clicks, new tabs, same-page anchors, and query-only changes keep native behavior.                    |
| Preloader                  | `components/motion/Preloader.tsx`            | client              | requestAnimationFrame and Web Animations API, no GSAP. Inline head script plus CSS failsafe.                                     |
| InlineScript               | `components/motion/InlineScript.tsx`         | server              | The pre-paint head script (`data-js`, `data-preload`)                                                                            |
| Hero                       | `components/sections/Hero.tsx`               | server              | Feed frame, live row, "Pause feed"                                                                                               |
| HeroMotion                 | `components/sections/HeroMotion.tsx`         | client, lazy        | `useGSAP`. Owns the headline split, reveal, drift, frame scale, and feed loop.                                                   |
| Story                      | `components/sections/Story.tsx`              | server              | One DOM for all three modes                                                                                                      |
| StoryController            | `components/sections/StoryController.tsx`    | client, lazy        | `useGSAP` and `gsap.matchMedia`. Pinned or viewer mode, set up near the viewport.                                                |
| Services                   | `components/sections/Services.tsx`           | server              | Hover list (1024px and up) and `Disclosure` accordion (below)                                                                    |
| ServicesHover              | `components/sections/ServicesHover.tsx`      | client, lazy        | `useGSAP`. The single preview frame.                                                                                             |
| WorkRail                   | `components/sections/WorkRail.tsx`           | server              | Swipe, pinned, or grid by CSS and media queries                                                                                  |
| WorkRailController         | `components/sections/WorkRailController.tsx` | client, lazy        | `useGSAP`. Pin, drag, focus scrolling, set up near the viewport.                                                                 |
| WorkHoverGL                | `components/sections/WorkHoverGL.tsx`        | client, lazy        | R3F and drei `shaderMaterial`. One shared canvas, capable desktops only.                                                         |
| Comments                   | `components/sections/Comments.tsx`           | server              | No JS                                                                                                                            |
| Marquee, MarqueeMotion     | `components/sections/Marquee*.tsx`           | server, client lazy | Wordmarks, clones, "Pause" control; ticks only while visible and unpaused                                                        |
| Process                    | `components/sections/Process.tsx`            | server              | Shared by home and Services                                                                                                      |
| Cta                        | `components/sections/Cta.tsx`                | server              | Magnetic xl pill, email, live line. Home only.                                                                                   |
| motion-loaders, *Loader    | `components/sections/`                       | client              | `next/dynamic` with `ssr: false`, rendered only after first idle                                                                 |
| Button                     | `components/ui/Button.tsx`                   | server              | Variants `primary` and `secondary`; sizes `md`, `lg`, `xl`. Link, anchor, or button.                                             |
| MediaSlot                  | `components/ui/MediaSlot.tsx`                | server              | Placeholder or `next/image`; `InViewVideo` child for video                                                                       |
| StoryFrame                 | `components/ui/StoryFrame.tsx`               | server              | The 9:16 frame with segments (404)                                                                                               |
| PageHeader                 | `components/ui/PageHeader.tsx`               | server              | Inner-page h1 with `data-page-title`                                                                                             |
| Clock, LiveLine, LocalTime | `components/ui/*`                            | client              | One shared minute ticker through `useSyncExternalStore`                                                                          |
| LiveDot                    | `components/ui/LiveDot.tsx`                  | server              | CSS pulse, three times                                                                                                           |
| Chip                       | `components/ui/Chip.tsx`                     | client              | Toggle button with `aria-pressed`                                                                                                |
| Disclosure                 | `components/ui/Disclosure.tsx`               | client              | Button in a heading, `aria-expanded`, `aria-controls`, `hidden` panel                                                            |
| WorkIndex, WorkGrid        | `components/work/WorkIndex.tsx`              | client              | `?service=` through the History API; Flip loaded in idle time; full static fallback                                              |
| CaseLink                   | `components/work/CaseLink.tsx`               | server              | Cover, client, result                                                                                                            |
| ContactPanel, ContactForm  | `components/contact/*`                       | client              | `useActionState`, client-side zod on blur and submit, error summary                                                              |
| `submitInquiry`            | `app/contact/actions.ts`                     | server action       | zod, honeypot, minimum fill time, Resend                                                                                         |

Native checkboxes and radios dressed as pills (`.choice`) replace the planned `RadioPill`. Form fields are written inline in `ContactForm` rather than through a `Field` wrapper. Avatars are a small local component in `Comments`.

**MediaSlot.** It's a discriminated union: `kind: "video"` with a `src` requires `poster`, which the type checker enforces.

- **Props.** `ratio` (`"9:16" | "4:5" | "1:1" | "16:9"`), `src?`, `alt`, `label`, `tone` (`"midnight" | "dusk" | "lilac" | "haze" | "screenlight"`; badge is excluded because it's never decorative), `kind`, `sizes` (required), `eager?`, `fill?`, `blurDataURL?`. `fill` is for frames whose box comes from the layout.
- **Without `src`.** Tone fill, SVG `feTurbulence` grain blended into the tone, and the label centered in `small`. Semantics: `role="img"` with `aria-label={alt}`.
- **With `src`.** Images: `next/image` with explicit `sizes`, `loading`/`fetchPriority` for the LCP candidate (Next 16 deprecates `priority`), and a blur or tone-colored placeholder. Video: muted, `playsInline`, `loop`, `preload="none"`, plays only while intersecting, native controls instead of autoplay under reduced motion.

**Content files** (`src/content/`, all typed): `brand.ts`, `story.ts`, `services.ts`, `work.ts`, `team.ts`, `testimonials.ts`, `faq.ts`, `clients.ts`, `process.ts`, `site.ts`, `contact.ts`, `legal.ts`, and `types.ts`.

**Lib** (`src/lib/`): `gsap.ts` (on-demand kit, `withGsap`, ScrollTrigger registry), `idle.ts` (first-idle gate), `when-near.ts` (set up near the viewport, with scroll compensation), `reveal.ts`, `scroll.ts` (Lenis store, `scrollToTarget`, scroll lock), `motion.ts` (media-query hooks, low-power check), `preload.ts`, `time.ts`, `words.ts`, `copy.ts`, `validation.ts`, `seo.ts`, `og.tsx`, `site.ts`, `fonts.ts`, `utils.ts`.

---

## 8. Engineering notes

**Versions** (npm registry, 2026-10-06):

| Package                                      | Version                | Note                                                                       |
| -------------------------------------------- | ---------------------- | -------------------------------------------------------------------------- |
| next                                         | 16.3.8                 |                                                                            |
| react, react-dom                             | 19.3.0                 |                                                                            |
| tailwindcss                                  | 4.3.3                  |                                                                            |
| gsap, @gsap/react                            | 3.15.0, 2.1.2          |                                                                            |
| lenis                                        | 1.3.26                 |                                                                            |
| @react-three/fiber, @react-three/drei, three | 9.8.1, 10.7.9, 0.186.1 |                                                                            |
| zod, resend                                  | 4.6.5, 6.32.0          |                                                                            |
| typescript                                   | 6.0.3                  | 7.0 is out, but typescript-eslint supports only versions below 6.1         |
| eslint                                       | 9.39.5                 | 10 is out, but the React plugin in `eslint-config-next` 16.3 crashes on it |

**Page transitions.** Next 16.3 exposes React's `<ViewTransition>` with no flag, but it ships from React's canary channel, which React hasn't marked stable. Per the brief, the site uses its own `TransitionProvider` and `TransitionLink`. A layout effect detects the committed route before paint. Back and forward navigations are covered before the new page paints, then play the same exit wipe.

**Loading strategy.** Nothing that moves is needed to paint.

- The head script sets `data-js` (so CSS can lay out scripted sections before hydration) and, on first home visits, `data-preload`.
- GSAP and SplitText load through `loadGsap()` after the `load` event and first idle period. A link click asks for them urgently, and the preloader skips the wait.
- ScrollTrigger is imported only by the home page's lazy chunks (hero, Story, rail), which register it with `lib/gsap`. Inner pages never load it or its always-on animation-frame loop.
- Section choreography lives in lazy `useGSAP` chunks rendered after first idle. The Story and rail set up only when within a viewport of the screen, in idle time, with refresh priorities so pins always measure top to bottom. If the page was reloaded below a pin, the scroll position is compensated by the height the pin adds.
- Idle pages cost nothing per frame: Lenis ticks only during a scroll, the cursor sleeps when caught up, the marquee runs only while visible, the feed waits on timeouts.
- `experimental.inlineCss` inlines Tailwind's output (about 9 KB gzipped), removing the render-blocking stylesheet request.

**Preloader.** The head script gates the overlay, so no-JS visitors never see it. A 2.5s CSS animation hides it even if scripts stall. In JS, the sequence fits into whatever time is left before 2.4s and aborts in a hidden tab. The hero headline is server-rendered and painted under the overlay, so LCP records at first paint.

**Contrast guard in the Story.** The background tweens only while lines are masked out. When the ink flips (2019 to 2020), incoming lines wait for the background to finish.

**WebGL.** One canvas for the rail, `pointer-events: none`, `frameloop="demand"` when idle. It loads only on fine-pointer desktops without reduced motion, with more than 4 cores and no data saver, once the rail is near. The texture is the real image when there's a `src`, otherwise a canvas-drawn copy of the placeholder. three r183 deprecates `THREE.Clock`, which R3F 9.8 still constructs. That single notice is filtered through three's `setConsoleFunction`; everything else passes through.

**Contact.** One zod schema on blur, on submit, and in the server action. The client dispatches the action by hand, so typed values survive a server error. There's a honeypot (`address`) and a 3-second minimum from interactive to submit. Without `RESEND_API_KEY`, development logs the payload and production logs a warning without personal data; both return success.

**SEO.** Metadata API on every route with canonical URLs from `NEXT_PUBLIC_SITE_URL`, `generateMetadata` and per-case-study Open Graph images (prerendered), a site Open Graph image and icons rendered with Poppins Bold from a bundled TTF (OFL), `sitemap.ts`, `robots.ts`, and Organization JSON-LD on the home page (escaped, and without placeholder `sameAs` URLs).

**Hydration.** Clocks render a fixed-width invisible "00:00" on the server and fill in on mount through one shared `useSyncExternalStore` ticker. The footer year is computed at render.

---

## 9. Review against the brief

### 9.1 Section 14 audit

| Don't                                              | How the build complies                                                                                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accent a single word in a headline                 | Headlines are one color, one style. SplitText lines all inherit the same color. Underlines appear only on links in running text.                                                                           |
| All-caps eyebrows, labels that carry nothing       | No `uppercase` anywhere. Section headings are sentences that say something. The labels that remain carry information: form labels, `<dl>` terms on case studies, "Related case study", years in the Story. |
| Middle dots, "Word — fragment" labels              | Metadata stacks on separate lines or uses a `<dl>`. Comment meta is separated by space. The marquee uses space only.                                                                                       |
| "→" on links or buttons                            | None. Link text says what happens.                                                                                                                                                                         |
| 01/02/03 on non-sequences                          | Numbers appear only on Process (1 to 4). The Story uses years and segments.                                                                                                                                |
| Grids of identical rounded cards with soft shadows | Radius only on 9:16 frames and pills. One shadow on the whole site.                                                                                                                                        |
| Decorative gradient washes                         | None.                                                                                                                                                                                                      |
| Entrance animations on every section               | Only the hero (load) and a page h1 (after a transition).                                                                                                                                                   |
| Hotlinked stock, real logos, lorem ipsum           | Placeholders are art-directed and labeled. Clients and people are fictional. Every word is written.                                                                                                        |
| `#000`, `#0B0B0B`, `#111`                          | Impossible through Tailwind (palette reset), and an ESLint rule rejects those literals.                                                                                                                    |

### 9.2 Revisions: what read as a default, and what replaced it

| Area             | First instinct                        | Build                                             | Why                                                                  |
| ---------------- | ------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| Story background | Continuous scrubbed blend             | Six stepped stops behind masked text              | The continuous midpoint caps at 3.96:1, which fails body copy.       |
| Story visuals    | Crossfade                             | Hard cut inside the frame                         | Native Stories cut. (The risk named in §1.)                          |
| Hero frame       | Phone mockup                          | A bare 9:16 frame                                 | The subject is the medium, not the hardware.                         |
| Hero bottom      | "Scroll to explore" cue               | Removed                                           | The advancing feed and the live clock already say the page is alive. |
| Light and dark   | Strict alternation                    | Night is the feed, day is the desk                | Each band has a reason.                                              |
| Services         | Numbered rows with arrows             | Unnumbered; the row opens and one preview follows | Not a sequence, and §14.                                             |
| Comments         | Circle avatars, hearts, reply buttons | Square initials, likes as text, no fake controls  | Radius rule; hearts point to a platform.                             |
| Marquee          | ✦ or • separators                     | Space only                                        | Separators are decoration.                                           |
| Process          | Giant outlined numerals               | Numerals at `h3`, inline                          | True sequence, but the number isn't the content.                     |
| Footer           | Giant bleeding wordmark               | Small and quiet                                   | The CTA already holds the closing big type.                          |
| Cursor           | `mix-blend-mode: difference`          | Solid, surface-aware                              | Blending takes the cursor off-palette.                               |
| Preloader exit   | The circle shrinks back               | Wipes out the top                                 | One gesture for the whole site.                                      |

### 9.3 Decisions approved on 2026-10-06

All ten proposals from the plan were approved as written: midnight focus rings on light surfaces; circles reserved for signals; stepped Story backgrounds; errors in midnight rather than red; the About headline counted from `brand.founded` ("Eleven years on the night shift."); "at HQ" while `hq.city` is "TBD"; a functional scrim only over real Story media (not yet needed, since every slot is a placeholder); an 8-column tablet grid; 0.45s transition phases; and the GitHub repository for commits.

---

## 10. Where the build departs from the plan

| Plan                                     | Build                                                                                    | Why                                                                                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three-zone Story stage from 1024px       | From 1280px; frame-left layout from 768 to 1279px                                        | Measured: the longest title words ("Everyone", "platform,") are about 4.5em at `h1`. Beside a centered 82vh frame they don't fit below 1280px. The wide-stage frame also narrows so they always fit. |
| Phone viewer titles at `h1`              | `h2` size                                                                                | At 44px the title and copy crowd out the visual on a 667px-tall phone.                                                                                                                               |
| GSAP through `useGSAP` everywhere        | `useGSAP` in every section choreography chunk; site-wide systems use an on-demand loader | `@gsap/react` imports GSAP statically. Loading it on demand keeps about 45 KB gzipped out of every page's critical path.                                                                             |
| Preloader on GSAP                        | requestAnimationFrame and the Web Animations API                                         | It has to start the moment the page hydrates, before GSAP has loaded.                                                                                                                                |
| No pause controls                        | "Pause feed" and "Pause" on the marquee; the live dot pulses three times                 | WCAG 2.2.2: content that moves on its own for more than 5 seconds needs a way to stop it.                                                                                                            |
| Hover preview follows the pointer freely | Follows vertically, drifts within the right third horizontally                           | Following freely, it covered the service name it was previewing.                                                                                                                                     |
| Case study gallery as a wrapped row      | Balanced CSS columns                                                                     | A wrapped row left a single item orphaned on a second line.                                                                                                                                          |
| Closing CTA on Services                  | Removed                                                                                  | Restraint pass (§11).                                                                                                                                                                                |

---

### Changes after launch (2026-10-06)

| Change                                                 | Effect                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Work and About removed from the navigation             | Header, mobile menu, and footer list Services and Contact. Both pages still exist and are reachable from links and the sitemap.                                                                                                                                                                                                                     |
| Selected work rail removed from the home page          | The rail, its controller, the WebGL hover, and their styles are gone, along with `three`, `@react-three/fiber`, and `@react-three/drei`. Case studies are now reached from Services ("Related case study"), the Work index, and each case study's "Next case study" link. Sections 3.11, 3.12, and the WebGL notes in §8 describe the removed rail. |
| "From the comments." thread removed from the home page | Home now runs hero, Story, What we do, wordmarks, process, CTA. Testimonials still appear on case study pages. Section 3.13 describes the removed thread.                                                                                                                                                                                           |
| Contact email changed to jermainemartin@gmail.com      | Set in `brand.ts`; used by the footer, CTA, mobile menu, Contact, Privacy, form errors, and as the default delivery address.                                                                                                                                                                                                                        |

## 11. QA log

**Method.** Playwright drove the system's Edge browser against a production build: full-page screenshots of every route at 375, 768, and 1440 (`npm run screenshots`), scripted checks of every interaction, axe-core on every route at two widths with and without reduced motion (`npm run a11y`), Lighthouse mobile, and a development pass for hydration warnings and ScrollTrigger leaks.

**The five weakest details, fixed.**

1. **Hero feed frame cramped on phones.** At 2 of 4 columns (about 160px), handle, label, and caption collided. It now spans 3 columns.
2. **An orphan in the case study gallery.** The fourth item sat alone on a second row. The gallery now uses balanced columns.
3. **The same case study twice in a row on Services.** Paid social and Reporting both linked Kilo Skincare. Reporting now links Bramble Books.
4. **Comment avatars nearly invisible.** Haze on screenlight is 1.14:1. They're lilac now, with midnight initials at 7.29:1.
5. **Case study metadata squeezed on tablets.** Three `<dl>` columns in about 420px wrapped "Services" into five lines. It stacks from 768 to 1023px.

A sixth item looked like a bug in full-page captures, the team card's role and local time overlapping at 768px. Live rendering was correct; the card was rewritten so stacking is the default and only hover-capable devices overlay the two lines anyway.

**Restraint pass.** The closing "Your audience is online right now." CTA, repeated at the bottom of the Services page, was removed. It is the home page's last word, and repeating it made it a footer. Contact stays one click away in the nav, with its badge dot.

**Results** (production build on a local server; Lighthouse 13.5 mobile, median of three runs):

| Page       | Performance | Accessibility | Best Practices | SEO | LCP (simulated) | LCP (applied throttling) | TBT   | CLS   |
| ---------- | ----------- | ------------- | -------------- | --- | --------------- | ------------------------ | ----- | ----- |
| Home       | 92          | 100           | 100            | 100 | 2.47s           | 1.2s                     | 261ms | 0.017 |
| Work       | 97          | 100           | 100            | 100 | 2.48s           | 1.2s                     | 115ms | 0     |
| Case study | 90          | 100           | 100            | 100 | 2.51s           | 1.2s                     | 326ms | 0     |

Scores moved by up to ±8 between identical runs on this machine. Simulated LCP sits at the 2.5s line because Lighthouse's simulation counts every script requested before first paint (React and the Next runtime alone are about 125 KB gzipped). The pages paint their text without JavaScript: observed first paint locally is 150 to 320ms. Measure the deployed site with PageSpeed Insights for the definitive numbers.

- **axe-core:** no WCAG 2.2 A/AA violations on any route, at 375 and 1440, with and without reduced motion.
- **Development pass:** no console errors, hydration warnings, or ScrollTrigger leaks across a full navigation loop, including back and forward.
- **Idle cost:** an inner page at rest spends 0ms on script per 5 seconds (4× CPU throttle), down from 236ms before the idle work.

# ADVAIT SREEKUMAR — Portfolio

Two complete Next.js editions are included and use the **same data files**:

| Route      | Edition                                                        |
|------------|----------------------------------------------------------------|
| `/`        | **Forge Edition** — dark cinematic samurai: katana intro with sparks, mechanical nav wheel, ember atmosphere |
| `/dossier` | **Atelier Dossier** — light paper technical-document: drafting grid, vermilion seals, crosshair cursor, spec-sheet projects |

Both editions share `src/data/*` content and the same working contact API at
`src/app/api/contact/route.ts`.

---

A dark, cinematic, katana-forged personal portfolio. SVG katana intro with
engraved name, mechanical navigation wheel, scroll-driven 3D project
presentation, ember atmosphere and a working contact form.

Built with **Next.js 14 + React 18 + TypeScript**. No animation libraries —
all motion is hand-rolled with CSS transforms, `requestAnimationFrame` and
`IntersectionObserver` for performance.

---

## 1. Start work on a new machine

### Requirements

- Node.js 18.17 or newer
- npm (normally installed with Node.js)
- Git

### Pull and install

```bash
git clone https://github.com/Advait-Sreekumar/Portfolio.git
cd Portfolio
npm install
```

If the repository is already cloned, update it before starting:

```bash
git pull
npm install
```

Create the local environment file for contact-form delivery:

```bash
# macOS / Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

Edit `.env.local` as described in section 3. The contact form does not send
mail until its SMTP values are configured. The rest of the site can run
without it.

Start local development:

```bash
npm run dev
```

Open <http://localhost:3000> for the Forge Edition or
<http://localhost:3000/dossier> for the Atelier Dossier.

Stop the server with `Ctrl+C`.

### Optional Windows fix

If a Windows npm script fails with `spawn cmd.exe ENOENT`, configure npm to
use a 64-bit cmd.exe explicitly:

```powershell
npm config set script-shell "C:\Windows\System32\cmd.exe"
```

Remove that setting with:

```powershell
npm config delete script-shell
```

### Production build

```bash
npm run build
npm start
```

The production server listens on port 3000 unless `PORT` is set.

---

## 2. Katana sound and pointer

Cinzel is bundled locally in `public/fonts` with its SIL Open Font License because
Next.js 14 cannot parse Google's current extensionless Cinzel asset URLs. The
existing Cormorant Garamond and Dossier fonts retain their Next.js font setup.

The Forge hero uses a synthesized metallic draw (no audio asset required). Choose
**Sound on**, then **Draw again** to hear it. A single filtered-noise voice follows
the blade's actual progress and velocity; it stops on completion, skip, replay,
mute, or a hidden tab. No delayed first-click autoplay retries occur.

The miniature SVG katana cursor is enabled for fine pointers with hover. Its blade
slides a few pixels on links and buttons; inputs keep their native text cursor.
Touch devices and reduced-motion preferences retain the system cursor.

---

## 3. Contact form — email setup  ⚠️ IMPORTANT

Copy `.env.example` to `.env.local`, then fill in the values:

```
CONTACT_EMAIL=your-real-inbox@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-real-inbox@example.com
SMTP_PASS=your-generated-app-password
```

**EMAIL SERVICE SETUP (Gmail):**

1. Enable **2-Step Verification** on your Google account.
2. Go to https://myaccount.google.com/apppasswords
3. Create an App Password (name it "Portfolio").
4. Paste the 16-character password into `SMTP_PASS`.
5. Restart the server (`npm run dev`).

Never commit `.env.local` or an App Password. `.env.local`, `.env`, and
`.env*.local` are excluded by `.gitignore`. Use `.env.example` only for
variable names and safe placeholder values.

Every received message uses the visitor's email as **Reply-To**, so you can
answer directly. Format:

```
New Portfolio Contact

Name: …
Email: …
Subject: …

Message:
…
```

Works with any SMTP provider (Gmail, Outlook, Zoho…) — just change
`SMTP_HOST` / `SMTP_PORT`.

---

## 4. Certificates

Add PDF, PNG, JPG, JPEG, or WebP files to the root **certificates** folder (the
existing **Certificates** capitalization also works). Run `npm run certificates`
or restart `npm run dev`; production builds also sync automatically.

The script copies originals into `public/certificates` and writes
`src/data/certificates.generated.json`. Titles fall back to filenames. PDFs get
first-page PNG previews when Poppler's `pdftoppm` is on PATH (or specified with
`PDFTOPPM_PATH`). Generated previews are retained for deployments without Poppler;
new PDFs still have working original-file links if rendering is unavailable.
Images retain their proportions. Each card opens the original in a new tab.
No certificates produces a quiet empty state. Rebuild/redeploy after asset changes.

The contact sections use direct contact links and forms, with no photo required.

---

## 5. Editing content — data files

All resume content lives in `src/data/`. Edit these, never the components:

| File                 | Contents                          |
|----------------------|-----------------------------------|
| `profile.ts`         | Name, role, email, phone, tagline |
| `experience.ts`      | Jobs (position, company, dates)   |
| `education.ts`       | Institutions & degrees            |
| `publications.ts`    | Publications (`publications`) + awards (`awards`) |
| `projects.ts`        | Projects — add `github:` / `live:` URLs anytime; links render automatically |
| `skills.ts`          | Skill categories                  |
| `certifications.ts`  | Certificate types and generated asset manifest |
| `socials.ts`         | LinkedIn / other profiles         |

Section order & wheel segments are defined together in `src/lib/sections.ts`.

---

## 6. Project structure

```text
src/app/
  page.tsx                 # Forge Edition route
  dossier/page.tsx         # Dossier Edition route
  api/contact/route.ts     # SMTP contact endpoint
src/components/           # Shared and edition-specific components
src/data/                 # Portfolio content
src/lib/                  # Navigation and interaction helpers
Certificates/             # Source certificate files
public/certificates/      # Generated originals and previews
public/fonts/             # Bundled Cinzel typeface and license
scripts/                  # Certificate asset discovery
.env.example              # Safe environment-variable template
.env.local                # Local secrets; never commit
package-lock.json         # Reproducible npm dependency versions
```

Prefer editing content in `src/data/`, route-specific markup in
`src/app/page.tsx` or `src/app/dossier/page.tsx`, and shared behavior in
`src/components/` or `src/lib/`. Keep assets in `public/` so they are
served at their `/images/...` or `/audio/...` URLs.

---

## 7. Development workflow

After pulling changes or changing dependencies:

```bash
npm install
npm run dev
```

Before committing or moving to another environment, run:

```bash
npm run build
```

ESLint is not configured in this repository yet, so `npm run lint` opens
Next.js's interactive setup prompt the first time it is run. The production
build already checks TypeScript and Next.js route validity.

Useful Git checks:

```bash
git --no-pager status
git --no-pager diff
git --no-pager log -5 --oneline
```

Do not commit `.env.local`, generated `.next/` output, `node_modules/`, or
App Passwords. `package-lock.json` is committed so `npm install` reproduces
the current dependency graph.

---

## 8. How the experience works

1. **Intro** — scroll is locked during the opening draw, with a Skip intro control.
   Katana rises → blade draws (with opted-in sound) → lock/shake → reflection sweep
   → hero text → navigation wheel slides in → scroll unlocks.
2. **Navigation wheel** — fixed at the right edge. Hover adds a glow without
   moving its buttons. Prev/Next exposes other segments, and ordinary wheel events
   continue scrolling the page. Live section bounds update the active indicator;
   pointer clicks and keyboard selection scroll to the latest target. On tablets
   and touch devices, a compact dock opens a focus-trapped chapter menu.
3. **Projects** — cards enter with true 3D depth (perspective rotateX +
   Z-translation driven by scroll progress), layered parallax ghost numbers
   and media plates.
4. **Contact** — validated form with sending/success/error states, honeypot
   spam trap, rate limiting, and real SMTP delivery.

`prefers-reduced-motion` skips the entire intro, unlocks scrolling instantly
and disables decorative animation.

---

## 9. Deployment

Deploys cleanly to Vercel (API route included):

```bash
npm i -g vercel
vercel
```

Add the same environment variables in the Vercel dashboard
(Project → Settings → Environment Variables):
`CONTACT_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.


## Refinement implementation notes

The existing Forge design, original katana SVG, project animations, routes, SEO
metadata, and SMTP endpoint are preserved. No packages were added.

### Requested changes

1. Centered section containers within the space available beside the wheel; fixed
   heading word spacing and the conflicting font variable.
2. Responsive grids, typography, inputs, and spacing support 320–1440px layouts.
   The katana uses a containing SVG viewBox; tablets/touch use a compact chapter menu.
3. The education crest uses the explicit abbreviation KMEC.
4. A shared count derives two patents from the publication data. The new title is
   A SYSTEM AND METHOD FOR SPECIFICITY-CONSTRAINED GENE PANEL DESIGN USING
   COUNTERFACTUAL NEGATIVE SETS. No unprovided status, number, date, or role was added.
5. All three existing PDFs are indexed with first-page previews and original-file
   links. Folder discovery also accepts images and handles an empty folder.
6. Removed portrait components, placeholders, photo styling, and direct phone/email
   displays. Social links and the existing form now share an open, responsive layout.
7. Removed the decorative overlay intercepting wheel clicks. The wheel stays still
   on hover, allows normal page scrolling, and offers Prev/Next selection. Active
   tracking reads live section bounds. The mobile menu restores layout before
   measuring destinations and supports Escape and a keyboard focus trap.
8. Extended only the handle by 120 SVG units (about 50%), retaining wrap spacing,
   blade geometry, fittings, and an expanded viewBox to avoid clipping.
9. Removed the visible duplicate name below the sword; retained a visually hidden
   H1 for document structure. The visible name remains engraved on the blade.
10. Removed the standalone Portfolio eyebrow, preserving SEO metadata.
11. One Web Audio friction voice follows the same progress/velocity updates as the
    blade. Explicit sound opt-in, mute, replay, skip, short stop fades, and cleanup
    prevent delayed playback and overlapping draw voices.
12. Ember and hero parallax use a time-based 45ms interpolation response without
    React state updates. Pointer effects are inert for touch; idle motion loops park.
13. Replaced cursor embers with a small SVG katana/sheath. The sword slides 7px
    on nested interactive targets while the sheath stays fixed. The pointer position
    follows the latest event on the next animation frame. Inputs retain native text
    cursors; fine-pointer/hover and reduced-motion checks provide fallbacks.

### Changed files

| File(s) | Purpose |
| --- | --- |
| src/app/globals.css | Centering, responsive layout, contact styling, cursor styling, wheel hit targets |
| src/app/layout.tsx; public/fonts/* | Correct font variables and bundle the original Cinzel font with its license |
| src/components/Section.tsx | Heading word spacing and reliable reveals for tall sections |
| src/components/KatanaHero.tsx | Longer handle, containing viewBox, cleaned hero copy, replay/skip, synchronized audio bridge |
| src/lib/useKatanaAudio.ts | Gesture-enabled, progress-driven synthesized draw and clink |
| src/components/CursorWisp.tsx | Lightweight katana cursor replacing the old ember trail |
| src/components/Embers.tsx; src/components/MotionLayer.tsx | Responsive background motion and idle-loop cleanup |
| src/components/NavWheel.tsx; src/lib/useActiveSection.ts | Reliable clicks, live scroll tracking, accessible compact menu |
| src/data/education.ts; src/components/EducationSection.tsx | Explicit institution abbreviations |
| src/data/publications.ts; src/data/experience.ts; src/components/PublicationsSection.tsx | Second patent and shared patent totals |
| scripts/sync-certificates.mjs; src/data/certificates.generated.json; src/data/certifications.ts | Discover files, generate previews, and expose typed certificate data |
| public/certificates/*; src/components/SkillsSection.tsx | Publish original files and proportionate clickable previews |
| src/components/ContactSection.tsx; src/data/profile.ts | Photo-free contact composition and removal of obsolete profile fields |
| src/app/dossier/page.tsx; src/app/dossier/dossier.css; src/components/dossier/Hero.tsx | Keep the alternate route consistent with shared patents/certificates and photo removal |
| package.json; README.md | Certificate build/dev hooks, type-check command, and usage documentation |
| Removed: src/components/dossier/PortraitFigure.tsx; public/images/PLACE-PORTRAIT-HERE.txt; public/audio/PLACE-MP3-HERE.txt | Remove obsolete photo UI and instructions for unused assets |

The source PDFs in Certificates were supplied with the project and remain unchanged.

### Verification

- Passed: npm run typecheck and npm run build. The production build includes both
  / and /dossier and the original /api/contact endpoint.
- Passed: git diff --check (no whitespace errors).
- Browser checked the development and production render. At 320, 375, 425, 768,
  1024, and 1440px, no horizontal document or content-card overflow was detected.
- Exercised all seven mobile chapter links, rapid changes of destination,
  desktop wheel clicks and Prev/Next controls, active indicators, Escape, and focus
  trapping. Confirmed a mobile destination lands at its 24px scroll offset.
- Confirmed KMEC, no visible duplicate hero label/name, no contact images, and all
  three loaded certificate preview images. Original PDF copies match source bytes.
- Exercised sound opt-in, replay, mute, skip, cursor hover/return, and native input
  cursor restoration. Production browser console had no captured warnings/errors.
- Limitations: npm run lint opens the existing ESLint setup prompt because this
  repository has no ESLint configuration/dependency. There is no test script or
  existing automated test suite. Real SMTP delivery, perceptual audio quality,
  physical touch hardware, and a live reduced-motion preference switch were not tested.
- Pending assets: none required. All patent reference images and three certificate
  PDFs were available. The synthesized draw requires no MP3 or portrait asset.

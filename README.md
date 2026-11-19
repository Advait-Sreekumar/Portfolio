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

## 2. Katana sound (optional but recommended)

Place your sword-drawing audio at:

```
public/audio/katana-draw.mp3     ← exact name, exact folder
```

- Plays automatically when the blade is drawn.
- If the browser blocks autoplay, it fires on the visitor's first click/key.
- If the file is missing, the site stays silent — no errors, no UI controls.

The placeholder file `public/audio/PLACE-MP3-HERE.txt` documents the path and
can be deleted after `katana-draw.mp3` is added.

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

## 4. Your photo

Drop your portrait at:

```
public/images/portrait.jpg
```

It appears in the framed panel beside the contact form. Until then an
"AS" monogram placeholder shows automatically.

The placeholder file `public/images/PLACE-PORTRAIT-HERE.txt` documents the
path and can be deleted after `portrait.jpg` is added.

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
| `certifications.ts`  | Certifications (empty until you add them) |
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
public/images/            # Portrait and other images
public/audio/             # Katana-draw audio
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

1. **Intro** — scroll is fully locked (wheel, keys, touch, scrollbar).
   Katana rises → blade draws (with sound) → lock/shake → reflection sweep
   → hero text → navigation wheel slides in → scroll unlocks.
2. **Navigation wheel** — a full circular wheel docked off-screen right
   (~30% visible). Hover expands it to ~50%. It rotates with scrolling,
   always reflects the current section, and clicking a segment smooth-scrolls
   there. Leaving the wheel never resets its position. On mobile it becomes
   a dock dial that opens the full wheel as an overlay.
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

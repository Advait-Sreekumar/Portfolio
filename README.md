# ADVAIT SREEKUMAR — Portfolio

Two complete editions driven by the **same data files**:

| Route      | Edition                                                        |
|------------|----------------------------------------------------------------|
| `/`        | **Forge Edition** — dark cinematic samurai: katana intro with sparks, mechanical nav wheel, ember atmosphere |
| `/dossier` | **Atelier Dossier** — light paper technical-document: drafting grid, vermilion seals, crosshair cursor, spec-sheet projects |

Both share `src/data/*` content and the same working contact API.
To make the Dossier the primary site: move `src/app/dossier/page.tsx` +
`layout.tsx` + `dossier.css` into `src/app/` (replacing the originals) and
move the forge files into a sub-route.

---

A dark, cinematic, katana-forged personal portfolio. SVG katana intro with
engraved name, mechanical navigation wheel, scroll-driven 3D project
presentation, ember atmosphere and a working contact form.

Built with **Next.js 14 + React 18 + TypeScript**. No animation libraries —
all motion is hand-rolled with CSS transforms, `requestAnimationFrame` and
`IntersectionObserver` for performance.

---

## 1. Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

> If `npm run ...` ever fails with "spawn cmd.exe ENOENT", your Windows
> install is missing 64-bit cmd.exe. This machine is already fixed via:
> `npm config set script-shell "C:\Windows\SysWOW64\cmd.exe"`
> (revert with `npm config delete script-shell`).

---

## 2. Katana sound (optional but recommended)

Place your sword-drawing audio at:

```
public/audio/katana-draw.mp3     ← exact name, exact folder
```

- Plays automatically when the blade is drawn.
- If the browser blocks autoplay, it fires on the visitor's first click/key.
- If the file is missing, the site stays silent — no errors, no UI controls.

---

## 3. Contact form — email setup  ⚠️ IMPORTANT

**MY EMAIL GOES HERE** → edit `.env.local`:

```
CONTACT_EMAIL=advaitsreekumar01@gmail.com      ← messages arrive in this inbox
SMTP_USER=advaitsreekumar01@gmail.com          ← your Gmail address (sender)
SMTP_PASS=YOUR_16_CHAR_GMAIL_APP_PASSWORD      ← API KEY GOES HERE
```

**EMAIL SERVICE SETUP (Gmail):**

1. Enable **2-Step Verification** on your Google account.
2. Go to https://myaccount.google.com/apppasswords
3. Create an App Password (name it "Portfolio").
4. Paste the 16-character password into `SMTP_PASS`.
5. Restart the server (`npm run dev`).

Never commit `.env.local` — it is already git-ignored.
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

## 6. How the experience works

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

## 7. Deployment

Deploys cleanly to Vercel (API route included):

```bash
npm i -g vercel
vercel
```

Add the same environment variables in the Vercel dashboard
(Project → Settings → Environment Variables):
`CONTACT_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.

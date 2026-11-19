import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────────────────────
 *  Contact endpoint.
 *
 *  Configure via .env.local (see .env.example):
 *    CONTACT_EMAIL — your inbox
 *    SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS
 *
 *  Secrets live ONLY in env vars — never in frontend code.
 * ───────────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** naive per-instance rate limit: 5 messages / 10 min / IP */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (list.length >= 5) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
}

export async function POST(req: NextRequest) {
  if (!process.env.CONTACT_EMAIL || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error(
      "[contact] Email not configured. Fill CONTACT_EMAIL and SMTP_* in .env.local (see .env.example).",
    );
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // honeypot
  if (str(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const subject = str(body.subject, 160);
  const message = str(body.message, 5000);

  if (!name || !EMAIL_RE.test(email) || !subject || !message) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const text = [
    "New Portfolio Contact",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
<div style="font-family:Georgia,serif;background:#0b0c0e;color:#eef1f4;padding:32px;border-radius:8px;max-width:640px">
  <p style="letter-spacing:.35em;text-transform:uppercase;font-size:11px;color:#e8c98a;margin:0 0 18px">New Portfolio Contact</p>
  <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.7">
    <tr><td style="color:#9aa3ad;width:90px;padding:6px 0">Name</td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
    <tr><td style="color:#9aa3ad;padding:6px 0">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}" style="color:#e8c98a">${escapeHtml(email)}</a></td></tr>
    <tr><td style="color:#9aa3ad;padding:6px 0">Subject</td><td style="padding:6px 0">${escapeHtml(subject)}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #3a3f45;margin:18px 0" />
  <p style="color:#9aa3ad;margin:0 0 8px;font-size:13px;letter-spacing:.2em;text-transform:uppercase">Message</p>
  <p style="white-space:pre-wrap;line-height:1.7;margin:0">${escapeHtml(message)}</p>
</div>`.trim();

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email, // reply directly to the visitor
      subject: `New Portfolio Contact: ${subject}`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

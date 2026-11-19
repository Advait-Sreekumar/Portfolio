"use client";

import { useRef, useState, type FormEvent } from "react";
import Section from "@/components/Section";
import Magnetic from "@/components/Magnetic";
import { profile } from "@/data/profile";

type FormStatus = "idle" | "sending" | "success" | "error";

const BUTTON_LABEL: Record<FormStatus, string> = {
  idle: "Send Message",
  sending: "Sending…",
  success: "Message Sent",
  error: "Try Again",
};

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [portraitOk, setPortraitOk] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot — silently succeed for bots
    if ((data.get("company") as string)?.trim()) {
      setStatus("success");
      return;
    }

    const payload = {
      name: ((data.get("name") as string) || "").trim(),
      email: ((data.get("email") as string) || "").trim(),
      subject: ((data.get("subject") as string) || "").trim(),
      message: ((data.get("message") as string) || "").trim(),
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section
      id="contact"
      numeral="VII"
      title="Contact Me"
      lead="Open a channel."
    >
      <div className="contact-grid">
        {/* ── portrait panel ─────────────────────────────────── */}
        <aside className="contact-portrait rv rv-2" aria-label="Portrait">
          <div className="portrait-frame">
            <span className="corner c-tl" aria-hidden="true" />
            <span className="corner c-tr" aria-hidden="true" />
            <span className="corner c-bl" aria-hidden="true" />
            <span className="corner c-br" aria-hidden="true" />
            {portraitOk ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                onError={() => setPortraitOk(false)}
              />
            ) : (
              <div className="portrait-fallback">
                <span className="monogram">AS</span>
                <p>
                  Portrait placeholder — add your photo at
                  <code> public/images/portrait.jpg</code>
                </p>
              </div>
            )}
          </div>
          <p className="portrait-caption">{profile.name}</p>
        </aside>

        {/* ── form ───────────────────────────────────────────── */}
        <div className="contact-form-wrap rv rv-3">
          {status === "success" ? (
            <div className="form-success" role="status">
              <svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true">
                <circle cx="24" cy="24" r="21" fill="none" stroke="#e8c98a" strokeWidth="1.4" />
                <path d="m15 24.5 6.5 6.5L33.5 18" fill="none" stroke="#e8c98a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="success-title">Message Sent</h3>
              <p className="success-note">
                Thank you for reaching out.
                <br />
                I&rsquo;ll get back to you soon.
              </p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate={false}>
              <div className="field-row">
                <label className="field">
                  <span className="field-label">Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={120}
                    placeholder="Your name"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    maxLength={200}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="field">
                <span className="field-label">Subject</span>
                <input
                  type="text"
                  name="subject"
                  required
                  maxLength={160}
                  placeholder="What is this regarding?"
                />
              </label>

              <label className="field">
                <span className="field-label">Message</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  maxLength={5000}
                  placeholder="Write your message…"
                />
              </label>

              {/* honeypot field — hidden from humans */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hp-field"
                aria-hidden="true"
              />

              {status === "error" ? (
                <p className="form-error" role="alert" ref={statusRef}>
                  <strong>Something went wrong.</strong>
                  Your message couldn&rsquo;t be sent. Please try again.
                </p>
              ) : null}

              <Magnetic strength={9}>
                <button
                  type="submit"
                  className={`btn btn-solid btn-submit${status === "sending" ? " is-loading" : ""}`}
                  disabled={status === "sending"}
                >
                  {BUTTON_LABEL[status]}
                </button>
              </Magnetic>

              <p className="form-status" aria-live="polite">
                {status === "sending" ? "Transmitting…" : ""}
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}

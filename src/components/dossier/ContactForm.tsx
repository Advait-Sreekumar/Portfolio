"use client";

import { useRef, useState, type FormEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

const LABEL: Record<FormStatus, string> = {
  idle: "Transmit",
  sending: "Transmitting…",
  success: "Received",
  error: "Retry Transmission",
};

/** Dossier transmission form — same /api/contact backend as the main site. */
export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
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
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="d-form" onSubmit={onSubmit}>
      <div className="d-field-row">
        <label className="d-field">
          <span className="d-mono">01 — Name</span>
          <input type="text" name="name" required autoComplete="name" maxLength={120} />
        </label>
        <label className="d-field">
          <span className="d-mono">02 — Email</span>
          <input type="email" name="email" required autoComplete="email" maxLength={200} />
        </label>
      </div>
      <label className="d-field">
        <span className="d-mono">03 — Subject</span>
        <input type="text" name="subject" required maxLength={160} />
      </label>
      <label className="d-field">
        <span className="d-mono">04 — Message</span>
        <textarea name="message" required rows={6} maxLength={5000} />
      </label>

      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="d-hp" aria-hidden="true" />

      {status === "error" ? (
        <p className="d-form-error" role="alert">
          <strong>Transmission failed.</strong> Your message couldn&apos;t be
          sent — please try again.
        </p>
      ) : null}

      <button
        type="submit"
        className={`d-submit${status === "sending" ? " is-loading" : ""}`}
        disabled={status === "sending"}
      >
        {LABEL[status]}
      </button>

      {status === "success" ? (
        <div className="d-stamp-wrap" role="status">
          <span className="d-stamp">RECEIVED</span>
          <p>
            Thank you for reaching out. I&apos;ll get back to you soon.
          </p>
          <button type="button" className="d-link d-mono" onClick={() => setStatus("idle")}>
            New transmission
          </button>
        </div>
      ) : null}
    </form>
  );
}

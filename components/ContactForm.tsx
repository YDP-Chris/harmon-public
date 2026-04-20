"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, message }),
    });

    if (res.ok) {
      setStatus("sent");
      setName("");
      setContact("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-navy-700 rounded-lg p-6 bg-navy-800 text-center">
        <p className="text-cream-100">Your message has been sent.</p>
        <p className="text-cream-300 text-sm mt-2">
          The Secretary will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-navy-700 rounded-lg p-6 bg-navy-800 space-y-4">
      <div>
        <label htmlFor="name" className="block text-cream-300 text-sm mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-cream-100 text-sm focus:border-gold-400 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact" className="block text-cream-300 text-sm mb-1">
          Phone or Email
        </label>
        <input
          id="contact"
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-cream-100 text-sm focus:border-gold-400 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-cream-300 text-sm mb-1">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-cream-100 text-sm focus:border-gold-400 focus:outline-none resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm">
          Something went wrong. Please call the Secretary at 336-559-5989.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-navy-900 px-6 py-2 rounded text-sm transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

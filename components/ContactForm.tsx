"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle"|"sending"|"error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send. Please try again.");

      // Optional: include the sender’s name in the query string
      const name = (payload.name as string) || "";
      router.push(`/contact/success${name ? `?name=${encodeURIComponent(name)}` : ""}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-4">
      {/* honeypot (optional anti-spam) */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "error" && <p className="text-red-600">{error}</p>}
    </form>
  );
}

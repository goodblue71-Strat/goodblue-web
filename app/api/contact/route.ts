import { NextResponse } from "next/server";
import { Resend } from "resend";
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

// (Optional) tiny helper to keep payloads tidy
function clean(s: unknown) {
  return String(s ?? "").toString().slice(0, 5000).trim();
}

export async function POST(req: Request) {
  try {
    const { name, email, message, honeypot } = await req.json();

    // basic validation + simple anti-bot (honeypot)
    if (honeypot) {
      return NextResponse.json({ ok: true }); // silently ignore bots
    }
    const _name = clean(name);
    const _email = clean(email);
    const _message = clean(message);

    if (!_name || !_email || !_message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const from = process.env.CONTACT_FROM_EMAIL || "GoodBlue <noreply@gooblue.ai>";
    const to = process.env.CONTACT_TO_EMAIL || "hello@gooblue.ai";

    await resend.emails.send({
      from,
      to,
      subject: `New feedback from ${_name}`,
      replyTo: _email,
      text: `From: ${_name} <${_email}>\n\n${_message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

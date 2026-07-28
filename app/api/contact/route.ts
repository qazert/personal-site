import { NextResponse } from "next/server";

/**
 * Contact endpoint.
 *
 * Set CONTACT_FORWARD_URL to any webhook that accepts a JSON POST (Formspree,
 * Zapier, a Slack incoming webhook, your own mailer). Until it is set the route
 * answers 501 and the form surfaces its error state with a mailto fallback,
 * rather than pretending the message was delivered.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "That request could not be read." },
      { status: 400 },
    );
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 20) {
    return NextResponse.json(
      { error: "Some details are missing or incomplete." },
      { status: 422 },
    );
  }

  const forwardTo = process.env.CONTACT_FORWARD_URL;

  if (!forwardTo) {
    return NextResponse.json(
      { error: "The contact form is not connected yet." },
      { status: 501 },
    );
  }

  try {
    const res = await fetch(forwardTo, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        company: String(payload.company ?? "").trim(),
        reason: String(payload.reason ?? "").trim(),
        message,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
  } catch {
    return NextResponse.json(
      { error: "The message could not be delivered." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

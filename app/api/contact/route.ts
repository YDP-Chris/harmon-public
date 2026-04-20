import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = "Harmon Lodge No. 420 <lodge@harmon420.org>";
const TO_EMAIL = "fordchristopheralan@gmail.com";

export async function POST(req: NextRequest) {
  const { name, contact, message } = await req.json();

  if (!name || !contact || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // Basic length limits
  if (name.length > 200 || contact.length > 200 || message.length > 2000) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  const body = `New inquiry from harmon420.org:\n\nName: ${name}\nContact: ${contact}\n\nMessage:\n${message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Lodge Inquiry from ${name}`,
      text: body,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send. Please call the Secretary directly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

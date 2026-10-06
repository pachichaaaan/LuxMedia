"use server";

import { Resend } from "resend";
import { brand } from "@/content/brand";
import { budgetOptions, contact, serviceOptions } from "@/content/contact";
import {
  fieldErrorsFrom,
  inquirySchema,
  readInquiry,
  type FieldErrors,
  type Inquiry,
  type InquiryDraft,
} from "@/lib/validation";

export type InquiryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; fieldErrors: FieldErrors; formError?: string; draft: InquiryDraft };

/** People take longer than this to fill in seven fields; scripts don't. */
const MIN_FILL_MS = 3000;

const labelFor = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

function emailBody(inquiry: Inquiry) {
  return [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company}`,
    `Website or handle: ${inquiry.website}`,
    `Services: ${inquiry.services.map((value) => labelFor(serviceOptions, value)).join(", ")}`,
    `Monthly budget: ${labelFor(budgetOptions, inquiry.budget)}`,
    "",
    inquiry.message,
  ].join("\n");
}

async function deliver(inquiry: Inquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY is not set. Inquiry received:\n", emailBody(inquiry));
    } else {
      console.warn("[contact] RESEND_API_KEY is not set; an inquiry was accepted but not emailed.");
    }
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || `${brand.name} <onboarding@resend.dev>`,
    to: process.env.CONTACT_TO_EMAIL || brand.email,
    replyTo: inquiry.email,
    subject: `New inquiry from ${inquiry.company}`,
    text: emailBody(inquiry),
  });
  if (error) throw new Error(error.message);
}

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const draft = readInquiry(formData);

  // Honeypot filled in: a bot. Say thanks and do nothing.
  if (formData.get("address")) return { status: "success" };

  const started = Number(formData.get("started"));
  if (started && Date.now() - started < MIN_FILL_MS) {
    return { status: "error", fieldErrors: {}, formError: contact.errors.tooFast, draft };
  }

  const parsed = inquirySchema.safeParse(draft);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error), draft };
  }

  try {
    await deliver(parsed.data);
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return { status: "error", fieldErrors: {}, formError: contact.errors.server, draft };
  }

  return { status: "success" };
}

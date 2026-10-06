import { z } from "zod";
import { budgetOptions, contact, serviceOptions } from "@/content/contact";

const { errors } = contact;

const serviceValues = serviceOptions.map((option) => option.value) as [string, ...string[]];
const budgetValues = budgetOptions.map((option) => option.value) as [string, ...string[]];

/** A website ("company.com", "https://company.com/shop") or a handle ("@company"). */
const WEBSITE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;
const HANDLE = /^@[\w.]{2,30}$/;

/** One schema for the contact form, used by the browser and the server action. */
export const inquirySchema = z.object({
  name: z.string().trim().min(1, errors.name).max(120, errors.name),
  email: z.string().trim().pipe(z.email(errors.email)),
  company: z.string().trim().min(1, errors.company).max(160, errors.company),
  website: z
    .string()
    .trim()
    .refine((value) => WEBSITE.test(value) || HANDLE.test(value), errors.website),
  services: z.array(z.enum(serviceValues)).min(1, errors.services),
  budget: z.enum(budgetValues, { error: errors.budget }),
  message: z
    .string()
    .trim()
    .min(1, errors.messageEmpty)
    .min(20, errors.messageShort)
    .max(4000, errors.messageLong),
});

export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryField = keyof Inquiry;

export const INQUIRY_FIELDS = Object.keys(inquirySchema.shape) as InquiryField[];

/** Field values as submitted, before validation. */
export type InquiryDraft = {
  [K in InquiryField]: K extends "services" ? string[] : string;
};

export function readInquiry(formData: FormData): InquiryDraft {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    website: text("website"),
    services: formData.getAll("services").filter((v): v is string => typeof v === "string"),
    budget: text("budget"),
    message: text("message"),
  };
}

export type FieldErrors = Partial<Record<InquiryField, string>>;

/** The first message per field, in form order. */
export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as InquiryField | undefined;
    if (field && !result[field]) result[field] = issue.message;
  }
  return result;
}

/** Validates one field on its own, for blur and live re-checking. */
export function validateField(field: InquiryField, draft: InquiryDraft): string | undefined {
  const result = inquirySchema.shape[field].safeParse(draft[field]);
  return result.success ? undefined : result.error.issues[0]?.message;
}

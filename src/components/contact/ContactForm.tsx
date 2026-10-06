"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitInquiry, type InquiryState } from "@/app/contact/actions";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { budgetOptions, contact, serviceOptions } from "@/content/contact";
import { cn } from "@/lib/utils";
import {
  INQUIRY_FIELDS,
  fieldErrorsFrom,
  inquirySchema,
  readInquiry,
  validateField,
  type InquiryField,
} from "@/lib/validation";

const { fields, errors: copy } = contact;
const idFor = (field: InquiryField) => `contact-${field}`;
const errorIdFor = (field: InquiryField) => `contact-${field}-error`;
const hintIdFor = (field: InquiryField) => `contact-${field}-hint`;

/** Client verdicts: a message, or null once the field checks out. */
type ClientErrors = Partial<Record<InquiryField, string | null>>;

const initialState: InquiryState = { status: "idle" };

function FieldError({ field, message }: { field: InquiryField; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorIdFor(field)} className="mt-2 text-small text-ink">
      {message}
    </p>
  );
}

function Hint({ field, children }: { field: InquiryField; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={hintIdFor(field)} className="mt-1 text-small text-ink-meta">
      {children}
    </p>
  );
}

/**
 * The project inquiry form. Validates on blur and on submit with the same
 * schema the server uses, says exactly what to fix, and keeps what people
 * typed. Works without JavaScript through the server action.
 */
export function ContactForm({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);

  // Time-to-submit starts when the form is interactive.
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);

  const serverErrors = state.status === "error" ? state.fieldErrors : {};
  const draft = state.status === "error" ? state.draft : undefined;
  const errorFor = (field: InquiryField) =>
    field in clientErrors ? (clientErrors[field] ?? undefined) : serverErrors[field];
  const invalidFields = INQUIRY_FIELDS.filter((field) => errorFor(field));
  const formError = state.status === "error" ? state.formError : undefined;

  const describedBy = (field: InquiryField, hint?: boolean) =>
    [hint ? hintIdFor(field) : null, errorFor(field) ? errorIdFor(field) : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const recheck = (field: InquiryField, { onlyIfErrored = false } = {}) => {
    const form = formRef.current;
    if (!form) return;
    if (onlyIfErrored && !errorFor(field)) return;
    const values = readInquiry(new FormData(form));
    const value = values[field];
    const empty = Array.isArray(value) ? value.length === 0 : value.trim() === "";
    if (empty && !errorFor(field) && !onlyIfErrored) return; // Don't scold someone tabbing through.
    setClientErrors((previous) => ({ ...previous, [field]: validateField(field, values) ?? null }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = inquirySchema.safeParse(readInquiry(formData));
    if (!result.success) {
      const found = fieldErrorsFrom(result.error);
      setClientErrors(
        Object.fromEntries(INQUIRY_FIELDS.map((field) => [field, found[field] ?? null])),
      );
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setClientErrors({});
    setShowSummary(false);
    // Dispatching by hand keeps what was typed if the server sends something back.
    startTransition(() => formAction(formData));
  };

  if (state.status === "success") {
    return (
      <div className="py-6">
        <h2 tabIndex={-1} ref={(node) => node?.focus()} className="text-h2 text-ink outline-none">
          {contact.success.heading}
        </h2>
        <p className="mt-4 text-body-lg text-ink-body">{contact.success.body}</p>
        <button type="button" onClick={onReset} className="mt-8 link-inline text-ink">
          {contact.success.again}
        </button>
      </div>
    );
  }

  const summaryVisible = (showSummary && invalidFields.length > 0) || Boolean(formError);
  const input =
    "mt-2 block w-full border-0 border-b-2 border-dusk bg-transparent py-3 text-body text-ink placeholder:text-dusk focus:border-midnight aria-[invalid=true]:border-midnight";

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-label={contact.formLabel}
      className="relative space-y-10"
    >
      {summaryVisible && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border-l-4 border-midnight py-1 pl-5 outline-none"
        >
          {invalidFields.length > 0 && (
            <>
              <p className="text-ink">{copy.summary(invalidFields.length)}</p>
              <ul className="mt-2 space-y-1 text-small">
                {invalidFields.map((field) => (
                  <li key={field}>
                    <a href={`#${idFor(field)}`} className="link-inline text-ink">
                      {errorFor(field)}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {formError && <p className="text-ink">{formError}</p>}
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2 md:gap-x-(--gutter)">
        {(["name", "email", "company", "website"] as const).map((field) => {
          const config = fields[field];
          const hint = "hint" in config ? config.hint : undefined;
          return (
            <div key={field}>
              <label htmlFor={idFor(field)} className="text-ink">
                {config.label}
              </label>
              <Hint field={field}>{hint}</Hint>
              <input
                id={idFor(field)}
                name={field}
                type={field === "email" ? "email" : "text"}
                inputMode={field === "email" ? "email" : field === "website" ? "url" : undefined}
                autoComplete={config.autoComplete}
                placeholder={"placeholder" in config ? config.placeholder : undefined}
                defaultValue={draft?.[field]}
                aria-invalid={Boolean(errorFor(field))}
                aria-describedby={describedBy(field, Boolean(hint))}
                onBlur={() => recheck(field)}
                onChange={() => recheck(field, { onlyIfErrored: true })}
                className={input}
              />
              <FieldError field={field} message={errorFor(field)} />
            </div>
          );
        })}
      </div>

      <fieldset aria-describedby={describedBy("services", true)}>
        <legend id={idFor("services")} tabIndex={-1} className="text-ink outline-none">
          {fields.services.label}
        </legend>
        <Hint field="services">{fields.services.hint}</Hint>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {serviceOptions.map((option) => (
            <label key={option.value} className="choice">
              <input
                type="checkbox"
                name="services"
                value={option.value}
                defaultChecked={draft?.services.includes(option.value)}
                onChange={() => recheck("services", { onlyIfErrored: true })}
                className="sr-only"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FieldError field="services" message={errorFor("services")} />
      </fieldset>

      <fieldset aria-describedby={describedBy("budget")}>
        <legend id={idFor("budget")} tabIndex={-1} className="text-ink outline-none">
          {fields.budget.label}
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {budgetOptions.map((option) => (
            <label key={option.value} className="choice">
              <input
                type="radio"
                name="budget"
                value={option.value}
                defaultChecked={draft?.budget === option.value}
                onChange={() => recheck("budget", { onlyIfErrored: true })}
                className="sr-only"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FieldError field="budget" message={errorFor("budget")} />
      </fieldset>

      <div>
        <label htmlFor={idFor("message")} className="text-ink">
          {fields.message.label}
        </label>
        <Hint field="message">{fields.message.hint}</Hint>
        <textarea
          id={idFor("message")}
          name="message"
          rows={6}
          defaultValue={draft?.message}
          aria-invalid={Boolean(errorFor("message"))}
          aria-describedby={describedBy("message", true)}
          onBlur={() => recheck("message")}
          onChange={() => recheck("message", { onlyIfErrored: true })}
          className={cn(input, "resize-y")}
        />
        <FieldError field="message" message={errorFor("message")} />
      </div>

      {/* Honeypot: invisible to people and to assistive tech. Bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {fields.trap.label}
          <input type="text" name="address" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedRef} type="hidden" name="started" defaultValue="" />

      <div className="flex items-center gap-6">
        <Magnetic strength={0.2}>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? contact.pending : contact.submit}
          </Button>
        </Magnetic>
        <p aria-live="polite" className="sr-only">
          {pending ? contact.pending : ""}
        </p>
      </div>
    </form>
  );
}

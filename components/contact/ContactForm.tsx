"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CaretDown,
  CheckCircle,
  CircleNotch,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { contact, site } from "@/content/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "sent" | "error";

const field =
  "w-full rounded-sm border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-text " +
  "placeholder:text-faint transition-colors duration-200 outline-none " +
  "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1";

const labelCls = "block text-[0.875rem] font-medium text-text";
const helpCls = "mt-1.5 text-[0.8125rem] text-muted";
const errCls = "mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-danger";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string>("");
  const reduce = useReducedMotion();

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = "Please add your name.";
    if (!email) next.email = "Please add an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That email address does not look right.";
    if (message.length < 20)
      next.message = "A couple of sentences helps me give a useful reply.";

    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("submitting");
    setFailure("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "The message could not be sent.");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setFailure(
        err instanceof Error ? err.message : "The message could not be sent.",
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-md border border-line bg-surface p-8 md:p-10"
        role="status"
      >
        <CheckCircle
          weight="regular"
          aria-hidden
          className="size-8 text-text"
        />
        <h2 className="mt-4 text-xl font-medium tracking-[-0.024em]">
          Message sent
        </h2>
        <p className="lede mt-2 max-w-[42ch] text-[0.9375rem]">
          Thank you. I read everything myself and reply within a few days,
          including if the answer is no.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-sm text-[0.9375rem] font-medium underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-text"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${field} mt-2`}
          />
          {errors.name ? (
            <p id="name-error" className={errCls}>
              <WarningCircle weight="fill" aria-hidden className="size-3.5" />
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${field} mt-2`}
          />
          {errors.email ? (
            <p id="email-error" className={errCls}>
              <WarningCircle weight="fill" aria-hidden className="size-3.5" />
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelCls}>
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={`${field} mt-2`}
          />
          <p className={helpCls}>Optional.</p>
        </div>

        <div>
          <label htmlFor="reason" className={labelCls}>
            What is this about?
          </label>
          <div className="relative mt-2">
            <select
              id="reason"
              name="reason"
              defaultValue={contact.reasons[0]}
              className={`${field} appearance-none pr-11`}
            >
              {contact.reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <CaretDown
              weight="bold"
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-muted"
            />
          </div>
          <p className={helpCls}>A rough steer is enough.</p>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          What are you working on?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : "message-help"}
          className={`${field} mt-2 resize-y`}
        />
        {errors.message ? (
          <p id="message-error" className={errCls}>
            <WarningCircle weight="fill" aria-hidden className="size-3.5" />
            {errors.message}
          </p>
        ) : (
          <p id="message-help" className={helpCls}>
            The product, the team, and what is currently in the way.
          </p>
        )}
      </div>

      <AnimatePresence>
        {status === "error" ? (
          <motion.p
            role="alert"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden text-[0.875rem] text-text"
          >
            <span className="block rounded-sm border border-danger/40 bg-danger/8 px-4 py-3">
              {failure} You can email me directly at{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium underline underline-offset-4"
              >
                {site.email}
              </a>
              .
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <CircleNotch
                weight="bold"
                aria-hidden
                className="size-4 animate-spin"
              />
              Sending
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <p className="text-[0.8125rem] text-muted">
          I reply to everything.
        </p>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { IconTile } from "@/components/brand/icon-tile";
import { PrismButton } from "@/components/brand/prism-button";
import { CheckCircle } from "@/components/icons/forma";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Dropdown options, verbatim from the approved copy.
const TOPICS = [
  "Evaluating Prisma for my team",
  "Migrating from another stack",
  "Partnership",
  "Support or account help",
  "Book a demo",
  "Something else",
];

// The fields are taller and softer than the shadcn defaults (h-9, rounded-md):
// this form is the hero's right half, sitting beside a 3.5rem headline, and at
// default size it read as an admin form dropped into a marketing panel. White
// rather than transparent so the hero's spectral wash never runs under a field.
const FIELD =
  "rounded-lg border-black/[0.09] bg-white text-[15px] shadow-[0_1px_2px_rgba(21,21,21,0.04)]";

// The message form: the hero panel's right half. A solid white card, not the
// glass treatment used for content cards over the wash — legibility of the
// field labels and the values being typed wins over showing the light through.
export function ContactMessageForm() {
  const [sent, setSent] = useState(false);

  // No endpoint is wired yet — the form is presentational, and submitting only
  // swaps in the confirmation state.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    // `relative` is load-bearing: the hero's prism ray is an absolutely
    // positioned sibling, so a static card would paint UNDER it — positioned
    // elements sit above non-positioned ones in the same stacking context, and
    // the ray drew straight across the fields.
    <div className="relative rounded-2xl border border-black/[0.06] bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_16px_40px_-20px_rgba(21,21,21,0.22)] sm:p-8">
      <h2 className="text-2xl leading-tight">Send us a message</h2>

      {sent ? (
        // role="status" because submitting REPLACES the form: without a live
        // region a screen reader announces nothing, and focus is destroyed along
        // with the submit button and falls back to <body>. Nothing else on the
        // site does this swap yet, so this is the precedent.
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-[24rem] flex-col items-center justify-center gap-5 text-center"
        >
          <IconTile className="size-14">
            <CheckCircle className="size-6 text-foreground" aria-hidden />
          </IconTile>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium text-foreground">Message sent</p>
            {/* Echoes the hero's promise ("we'll route your message to the
                right person") without committing to a response-time SLA no
                team has signed off on. */}
            <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              Thanks for reaching out. We&apos;ll route your message to the right person on the team
              and get back to you soon.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                className={`h-11 ${FIELD}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">Work email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`h-11 ${FIELD}`}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-company">Company</Label>
              <Input
                id="contact-company"
                name="company"
                autoComplete="organization"
                className={`h-11 ${FIELD}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-topic">What&apos;s this about?</Label>
              {/* No placeholder: the label above already says it, and printing
                  the same sentence twice was the reason this field used to be
                  unlabelled. An empty closed select is consistent anyway — every
                  other field in this form is an empty box too. */}
              <Select name="topic">
                {/* h-11! because SelectTrigger ships `data-[size=default]:h-9`,
                    and an attribute selector out-specifies a plain h-11 — the
                    trigger rendered 36px next to Company's 44px. */}
                <SelectTrigger id="contact-topic" className={`h-11! w-full ${FIELD}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              className={`min-h-32 ${FIELD}`}
            />
          </div>

          <PrismButton type="submit" fullWidth className="mt-2">
            Send
          </PrismButton>
        </form>
      )}
    </div>
  );
}

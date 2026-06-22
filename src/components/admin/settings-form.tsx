"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@/lib/data/types";
import {
  Field,
  CheckboxField,
  FormBanner,
  SubmitButton,
} from "@/components/admin/form-controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateSettings } from "@/lib/actions";
import { IDLE } from "@/lib/actions/result";

export function SettingsForm({
  settings,
  readOnly,
}: {
  settings: SiteSettings;
  readOnly: boolean;
}) {
  const [state, formAction] = useActionState(updateSettings, IDLE);
  const e = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <FormBanner status={state.status} message={state.message} />

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Homepage hero</h2>
        <div className="space-y-4">
          <Field label="Kicker" htmlFor="hero_kicker" error={e.hero_kicker}>
            <Input
              id="hero_kicker"
              name="hero_kicker"
              defaultValue={settings.hero_kicker}
            />
          </Field>
          <Field label="Title" htmlFor="hero_title" error={e.hero_title}>
            <Input
              id="hero_title"
              name="hero_title"
              defaultValue={settings.hero_title}
            />
          </Field>
          <Field
            label="Subtitle"
            htmlFor="hero_subtitle"
            error={e.hero_subtitle}
          >
            <Textarea
              id="hero_subtitle"
              name="hero_subtitle"
              rows={3}
              defaultValue={settings.hero_subtitle}
            />
          </Field>
          <Field
            label="Primary CTA label"
            htmlFor="hero_cta_label"
            error={e.hero_cta_label}
          >
            <Input
              id="hero_cta_label"
              name="hero_cta_label"
              defaultValue={settings.hero_cta_label}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Contact & CV</h2>
        <div className="space-y-4">
          <Field
            label="Contact email"
            htmlFor="contact_email"
            error={e.contact_email}
          >
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={settings.contact_email}
            />
          </Field>
          <Field
            label="CV download URL"
            htmlFor="cv_url"
            optional
            hint="Link to a hosted PDF. Leave blank to rely on the print view."
            error={e.cv_url}
          >
            <Input
              id="cv_url"
              name="cv_url"
              defaultValue={settings.cv_url ?? ""}
              placeholder="https://…"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Toggles</h2>
        <div className="space-y-3">
          <CheckboxField
            name="available_for_work"
            label="Show “available for work” badge"
            defaultChecked={settings.available_for_work}
          />
          <CheckboxField
            name="ai_assistant_enabled"
            label="Enable the AI case-study assistant in the editor"
            defaultChecked={settings.ai_assistant_enabled}
          />
        </div>
      </section>

      <div className="flex justify-end">
        {readOnly ? (
          <Button type="submit">Try save (demo)</Button>
        ) : (
          <SubmitButton>Save settings</SubmitButton>
        )}
      </div>
    </form>
  );
}

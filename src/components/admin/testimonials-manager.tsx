"use client";

import { MessageSquareQuote } from "lucide-react";
import { CollectionManager } from "@/components/admin/collection-manager";
import { Field, CheckboxField } from "@/components/admin/form-controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createTestimonial, updateTestimonial } from "@/lib/actions";
import type { Testimonial } from "@/lib/data/types";

export function TestimonialsManager({
  testimonials,
  readOnly,
}: {
  testimonials: Testimonial[];
  readOnly: boolean;
}) {
  return (
    <CollectionManager<Testimonial>
      items={testimonials}
      table="testimonials"
      noun="testimonial"
      Icon={MessageSquareQuote}
      readOnly={readOnly}
      createAction={createTestimonial}
      updateAction={updateTestimonial}
      searchableText={(t) => `${t.author} ${t.role} ${t.quote}`}
      renderRow={(t) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{t.author}</p>
            <p className="truncate text-xs text-muted-foreground">{t.role}</p>
          </div>
          <Badge variant={t.approved ? "success" : "muted"}>
            {t.approved ? "Approved" : "Hidden"}
          </Badge>
        </div>
      )}
      renderFields={(item, errors) => (
        <>
          <Field label="Author" htmlFor="author" error={errors.author}>
            <Input id="author" name="author" defaultValue={item?.author ?? ""} />
          </Field>
          <Field label="Role" htmlFor="role" optional error={errors.role}>
            <Input id="role" name="role" defaultValue={item?.role ?? ""} />
          </Field>
          <Field label="Quote" htmlFor="quote" error={errors.quote}>
            <Textarea
              id="quote"
              name="quote"
              rows={4}
              defaultValue={item?.quote ?? ""}
            />
          </Field>
          <Field
            label="Source URL"
            htmlFor="source_url"
            optional
            error={errors.source_url}
          >
            <Input
              id="source_url"
              name="source_url"
              defaultValue={item?.source_url ?? ""}
              placeholder="https://…"
            />
          </Field>
          <div className="grid grid-cols-2 items-end gap-4">
            <Field
              label="Sort order"
              htmlFor="sort_order"
              error={errors.sort_order}
            >
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={item?.sort_order ?? 0}
              />
            </Field>
            <div className="pb-2.5">
              <CheckboxField
                name="approved"
                label="Approved (shown publicly)"
                defaultChecked={item?.approved ?? false}
              />
            </div>
          </div>
        </>
      )}
    />
  );
}

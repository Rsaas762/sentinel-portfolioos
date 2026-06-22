"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { Field } from "@/components/admin/form-controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createExperience, updateExperience } from "@/lib/actions";
import type { Experience } from "@/lib/data/types";

export function ExperienceManager({
  experience,
  readOnly,
}: {
  experience: Experience[];
  readOnly: boolean;
}) {
  return (
    <CollectionManager<Experience>
      items={experience}
      table="experience"
      noun="role"
      readOnly={readOnly}
      createAction={createExperience}
      updateAction={updateExperience}
      renderRow={(e) => (
        <div>
          <p className="truncate font-medium">{e.role}</p>
          <p className="truncate text-xs text-muted-foreground">
            {e.organization}
          </p>
        </div>
      )}
      renderFields={(item, errors) => (
        <>
          <Field label="Role" htmlFor="role" error={errors.role}>
            <Input id="role" name="role" defaultValue={item?.role ?? ""} />
          </Field>
          <Field
            label="Organization"
            htmlFor="organization"
            error={errors.organization}
          >
            <Input
              id="organization"
              name="organization"
              defaultValue={item?.organization ?? ""}
            />
          </Field>
          <Field
            label="Location"
            htmlFor="location"
            optional
            error={errors.location}
          >
            <Input
              id="location"
              name="location"
              defaultValue={item?.location ?? ""}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Start date"
              htmlFor="start_date"
              hint="YYYY-MM-DD"
              error={errors.start_date}
            >
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={item?.start_date ?? ""}
              />
            </Field>
            <Field
              label="End date"
              htmlFor="end_date"
              optional
              hint="Blank = present"
              error={errors.end_date}
            >
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={item?.end_date ?? ""}
              />
            </Field>
          </div>
          <Field label="Summary" htmlFor="summary" error={errors.summary}>
            <Textarea
              id="summary"
              name="summary"
              rows={3}
              defaultValue={item?.summary ?? ""}
            />
          </Field>
          <Field
            label="Highlights"
            htmlFor="highlights"
            hint="One per line"
            error={errors.highlights}
          >
            <Textarea
              id="highlights"
              name="highlights"
              rows={4}
              defaultValue={(item?.highlights ?? []).join("\n")}
            />
          </Field>
          <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order}>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={item?.sort_order ?? 0}
            />
          </Field>
        </>
      )}
    />
  );
}

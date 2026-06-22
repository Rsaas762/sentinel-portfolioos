"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { Field } from "@/components/admin/form-controls";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createSkill, updateSkill } from "@/lib/actions";
import { SKILL_CATEGORIES, type Skill } from "@/lib/data/types";
import { SKILL_CATEGORY_LABELS } from "@/lib/labels";

export function SkillsManager({
  skills,
  readOnly,
}: {
  skills: Skill[];
  readOnly: boolean;
}) {
  return (
    <CollectionManager<Skill>
      items={skills}
      table="skills"
      noun="skill"
      readOnly={readOnly}
      createAction={createSkill}
      updateAction={updateSkill}
      renderRow={(s) => (
        <div className="flex items-center gap-3">
          <span className="truncate font-medium">{s.name}</span>
          <Badge variant="muted">{SKILL_CATEGORY_LABELS[s.category]}</Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {s.proficiency}/5
          </span>
        </div>
      )}
      renderFields={(item, errors) => (
        <>
          <Field label="Name" htmlFor="name" error={errors.name}>
            <Input id="name" name="name" defaultValue={item?.name ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" htmlFor="category" error={errors.category}>
              <Select
                id="category"
                name="category"
                defaultValue={item?.category ?? "frontend"}
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {SKILL_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Proficiency"
              htmlFor="proficiency"
              error={errors.proficiency}
            >
              <Select
                id="proficiency"
                name="proficiency"
                defaultValue={String(item?.proficiency ?? 3)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} / 5
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Note" htmlFor="note" optional error={errors.note}>
            <Input id="note" name="note" defaultValue={item?.note ?? ""} />
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

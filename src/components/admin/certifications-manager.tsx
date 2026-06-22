"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { Field } from "@/components/admin/form-controls";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createCertification, updateCertification } from "@/lib/actions";
import { CERT_STATUSES, type Certification } from "@/lib/data/types";
import { CERT_BADGE_VARIANT, CERT_STATUS_LABELS } from "@/lib/labels";

export function CertificationsManager({
  certifications,
  readOnly,
}: {
  certifications: Certification[];
  readOnly: boolean;
}) {
  return (
    <CollectionManager<Certification>
      items={certifications}
      table="certifications"
      noun="certification"
      readOnly={readOnly}
      createAction={createCertification}
      updateAction={updateCertification}
      renderRow={(c) => (
        <div className="flex items-center gap-3">
          <span className="truncate font-medium">{c.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {c.issuer}
          </span>
          <Badge variant={CERT_BADGE_VARIANT[c.status]}>
            {CERT_STATUS_LABELS[c.status]}
          </Badge>
        </div>
      )}
      renderFields={(item, errors) => (
        <>
          <Field label="Name" htmlFor="name" error={errors.name}>
            <Input id="name" name="name" defaultValue={item?.name ?? ""} />
          </Field>
          <Field label="Issuer" htmlFor="issuer" error={errors.issuer}>
            <Input id="issuer" name="issuer" defaultValue={item?.issuer ?? ""} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status" htmlFor="status" error={errors.status}>
              <Select
                id="status"
                name="status"
                defaultValue={item?.status ?? "earned"}
              >
                {CERT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {CERT_STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Issued on"
              htmlFor="issued_on"
              optional
              error={errors.issued_on}
            >
              <Input
                id="issued_on"
                name="issued_on"
                type="date"
                defaultValue={item?.issued_on ?? ""}
              />
            </Field>
          </div>
          <Field
            label="Credential URL"
            htmlFor="credential_url"
            optional
            error={errors.credential_url}
          >
            <Input
              id="credential_url"
              name="credential_url"
              defaultValue={item?.credential_url ?? ""}
              placeholder="https://…"
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

import type { Metadata } from "next";
import { Award, ExternalLink } from "lucide-react";
import { getRepo } from "@/lib/data";
import { PageHeader } from "@/components/public/page-header";
import { Badge } from "@/components/ui/badge";
import { CERT_BADGE_VARIANT, CERT_STATUS_LABELS } from "@/lib/labels";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Certifications earned, in progress, and planned — tracked transparently.",
};

export default async function CertificationsPage() {
  const certs = await getRepo().listCertifications();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeader
        kicker="Credentials"
        title="Certifications"
        description="What I've earned, what I'm working towards, and what's on the roadmap — shown honestly, including in-progress items."
        className="mb-12"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="flex items-start gap-4 rounded-lg border bg-card p-5 shadow-sm"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Award className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold leading-tight">{cert.name}</h2>
                <Badge variant={CERT_BADGE_VARIANT[cert.status]}>
                  {CERT_STATUS_LABELS[cert.status]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {cert.issuer}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {cert.issued_on ? (
                  <span>Issued {formatMonthYear(cert.issued_on)}</span>
                ) : null}
                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Verify <ExternalLink className="size-3" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

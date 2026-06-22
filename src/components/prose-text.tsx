import { cn } from "@/lib/utils";

/**
 * Renders trusted, owner-authored body text as safe React nodes.
 * Supports paragraphs (blank-line separated) and simple "- " bullet lists.
 * Deliberately does NOT use dangerouslySetInnerHTML — React escapes all text,
 * so stored content can never inject markup.
 */
export function ProseText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className={cn("space-y-4 leading-relaxed text-muted-foreground", className)}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));

        if (isList) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{l.trim().replace(/^- /, "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {l}
                {j < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

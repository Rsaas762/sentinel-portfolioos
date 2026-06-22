import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <LogoMark size={56} className="text-primary" />
      <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-primary">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        That page doesn’t exist or may have moved. Let’s get you back to the
        proof.
      </p>
      <div className="mt-7 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">View projects</Link>
        </Button>
      </div>
    </div>
  );
}

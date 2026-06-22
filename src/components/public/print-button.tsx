"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <Button type="button" onClick={() => window.print()} variant="outline">
      <Printer className="size-4" /> {label}
    </Button>
  );
}

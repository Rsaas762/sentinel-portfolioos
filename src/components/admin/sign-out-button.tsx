"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton({ mode }: { mode: "demo" | "supabase" }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function signOut() {
    if (mode === "demo") {
      router.push("/");
      return;
    }
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground"
      onClick={signOut}
      disabled={pending}
    >
      <LogOut className="size-4" />
      {mode === "demo" ? "Exit admin" : "Sign out"}
    </Button>
  );
}

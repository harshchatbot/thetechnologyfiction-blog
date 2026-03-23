"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={async () => {
        await fetch("/api/auth/session", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}

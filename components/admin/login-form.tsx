"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");

        try {
          if (!firebaseAuth) {
            throw new Error("Firebase client env is not configured.");
          }

          const formData = new FormData(event.currentTarget);
          const email = String(formData.get("email") || "");
          const password = String(formData.get("password") || "");
          const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
          const token = await credentials.user.getIdToken();

          const response = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
          });

          if (!response.ok) {
            throw new Error("Unable to create admin session.");
          }

          router.push("/admin");
          router.refresh();
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "Login failed.");
        } finally {
          setPending(false);
        }
      }}
    >
      <Input name="email" type="email" placeholder="Admin email" required />
      <Input name="password" type="password" placeholder="Password" required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/features/categories/schema";
import { tagSchema } from "@/features/tags/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  type: "category" | "tag";
  action: (formData: FormData) => Promise<void>;
};

export function TaxonomyForm({ type, action }: Props) {
  const [pending, startTransition] = useTransition();
  const schema = type === "category" ? categorySchema : tagSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: "#c96d42"
    }
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-ink">
        New {type === "category" ? "category" : "tag"}
      </h2>
      <form
        className="mt-4 grid gap-4"
        onSubmit={form.handleSubmit((_, event) => {
          const formData = new FormData(event?.currentTarget as HTMLFormElement);
          startTransition(async () => action(formData));
        })}
      >
        <Input placeholder="Name" {...form.register("name")} />
        <Input placeholder="Slug" {...form.register("slug")} />
        <Textarea placeholder="Description" {...form.register("description")} />
        {type === "category" && <Input type="color" {...form.register("color")} className="h-12 p-2" />}
        <Button disabled={pending}>{pending ? "Saving..." : `Create ${type}`}</Button>
      </form>
    </Card>
  );
}

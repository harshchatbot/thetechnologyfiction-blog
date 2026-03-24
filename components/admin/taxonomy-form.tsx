"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/features/categories/schema";
import { tagSchema } from "@/features/tags/schema";
import { slugify } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  type: "category" | "tag";
  action: (formData: FormData) => Promise<void>;
};

export function TaxonomyForm({ type, action }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [manualSlug, setManualSlug] = useState(false);
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

  const watchedName = form.watch("name");

  useEffect(() => {
    if (!manualSlug) {
      form.setValue("slug", slugify(watchedName || ""));
    }
  }, [form, manualSlug, watchedName]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-ink">
        New {type === "category" ? "category" : "tag"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Slug is the URL-friendly version of the name, like `salesforce-careers` in `/category/salesforce-careers`.
        It auto-generates from the name, but you can edit it manually if needed.
      </p>
      <form
        className="mt-4 grid gap-4"
        onSubmit={form.handleSubmit((_, event) => {
          const formData = new FormData(event?.currentTarget as HTMLFormElement);
          startTransition(async () => {
            await action(formData);
            form.reset({
              name: "",
              slug: "",
              description: "",
              color: "#c96d42"
            });
            setManualSlug(false);
            router.refresh();
          });
        })}
      >
        <Input placeholder="Name" {...form.register("name")} />
        <Input
          placeholder="Slug"
          {...form.register("slug")}
          onChange={(event) => {
            setManualSlug(true);
            form.setValue("slug", event.target.value);
          }}
        />
        <Textarea placeholder="Description" {...form.register("description")} />
        {type === "category" && <Input type="color" {...form.register("color")} className="h-12 p-2" />}
        <Button disabled={pending}>{pending ? "Saving..." : `Create ${type}`}</Button>
      </form>
    </Card>
  );
}

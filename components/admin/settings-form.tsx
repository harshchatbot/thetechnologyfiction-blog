"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/content/site-config";

export function SettingsForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="p-6">
      <form
        ref={formRef}
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!formRef.current) return;
          const formData = new FormData(formRef.current);
          startTransition(async () => action(formData));
        }}
      >
        <Input name="siteName" defaultValue={siteConfig.siteName} placeholder="Site name" />
        <Input name="siteUrl" defaultValue={siteConfig.siteUrl} placeholder="Site URL" />
        <Textarea name="siteDescription" defaultValue={siteConfig.siteDescription} placeholder="Site description" />
        <Input name="defaultSeoTitle" defaultValue={siteConfig.defaultSeoTitle} placeholder="Default SEO title" />
        <Textarea name="defaultSeoDescription" defaultValue={siteConfig.defaultSeoDescription} placeholder="Default SEO description" />
        <Input name="organizationName" defaultValue={siteConfig.organizationName} placeholder="Organization name" />
        <Input name="organizationLogo" defaultValue={siteConfig.organizationLogo} placeholder="Organization logo URL" />
        <Input name="twitterHandle" defaultValue={siteConfig.twitterHandle} placeholder="Twitter handle" />
        <Input
          name="adsenseClientId"
          defaultValue={siteConfig.adsenseClientId}
          placeholder="ca-pub-xxxxxxxxxxxx"
        />
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" name="adsenseAutoAdsEnabled" value="true" defaultChecked={siteConfig.adsenseAutoAdsEnabled} />
          Enable Auto Ads
        </label>
        <Button disabled={pending}>{pending ? "Saving..." : "Save settings"}</Button>
      </form>
    </Card>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/gtag";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  eventName: string;
  eventParams?: Record<string, string | number | boolean | undefined>;
  external?: boolean;
  target?: string;
  rel?: string;
};

export function TrackedLink({
  href,
  children,
  className,
  eventName,
  eventParams,
  external = false,
  target,
  rel
}: Props) {
  const onClick = () => {
    trackEvent(eventName, {
      link_url: href,
      ...eventParams
    });
  };

  if (external) {
    return (
      <a href={href} target={target} rel={rel} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-ink text-white shadow-soft hover:bg-slate-800",
        variant === "secondary" &&
          "border border-slate-300 bg-white/80 text-ink hover:border-accent hover:text-accent",
        variant === "ghost" &&
          "bg-transparent text-steel hover:bg-white/70 hover:text-ink",
        className
      )}
      {...props}
    />
  );
}

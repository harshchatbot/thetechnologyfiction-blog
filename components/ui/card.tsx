import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border bg-[var(--card)]",
        className
      )}
    >
      {children}
    </div>
  );
}

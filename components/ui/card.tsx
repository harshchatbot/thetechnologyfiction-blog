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
        "rounded-[2rem] border border-border bg-white/80 shadow-soft backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

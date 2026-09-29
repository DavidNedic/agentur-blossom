import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Button/link with a restrained color change and directional arrow. */
export function Roll({
  href,
  children,
  variant = "outline",
  className,
  external,
  type,
  onClick,
}: {
  href?: string;
  children: string;
  variant?: "outline" | "solid" | "ink";
  className?: string;
  external?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  const cls = cn("roll", variant === "solid" && "roll-solid", variant === "ink" && "roll-ink", className);
  const inner = (
    <>
      <span>{children}</span>
      <Arrow className="roll-arrow" />
    </>
  );
  if (href)
    return (
      <a href={href} className={cls} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  return (
    <button type={type ?? "button"} className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden className={className} fill="none">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function SectionHead({ label, right, className }: { label: string; right?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between border-t border-hairline py-4", className)}>
      <span className="meta">{label}</span>
      {right && <span className="meta opacity-70">{right}</span>}
    </div>
  );
}

/** 12 column hairline grid behind the page. */
export function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="container-grid grid h-full grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={cn("h-full border-l border-hairline", i >= 4 && "hidden md:block", i === 11 && "md:border-r")} />
        ))}
      </div>
    </div>
  );
}

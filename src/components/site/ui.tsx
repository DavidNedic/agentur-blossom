import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Action({ href, children, tone = "ink", className, type = "button", onClick }: {
  href?: string; children: ReactNode; tone?: "ink" | "lime" | "outline"; className?: string; type?: "button" | "submit"; onClick?: () => void;
}) {
  const cls = cn("action", tone === "lime" && "action-lime", tone === "outline" && "action-outline", className);
  const content = <>{children}<Arrow className="action-arrow" /></>;
  return href ? <a href={href} className={cls} onClick={onClick}>{content}</a> : <button type={type} className={cls} onClick={onClick}>{content}</button>;
}

export function Arrow({ className }: { className?: string }) {
  return <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden className={className} fill="none"><path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function SectionHead({ label, right, className }: { label: string; right?: ReactNode; className?: string }) {
  return <div className={cn("section-head", className)}><span>{label}</span>{right && <span className="text-muted-foreground">{right}</span>}</div>;
}
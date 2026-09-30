import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false, ...props }: SVGProps<SVGSVGElement> & { light?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 70 3460 1910"
      role="img"
      aria-label="Klik"
      className={cn("block w-auto text-foreground", light && "text-ink", className)}
      {...props}
    >
      <g fill="currentColor">
        <path d="M131 1950V510H495V1237L774 920H1194L835 1343L1219 1950H790L571 1581L495 1664V1950Z" />
        <path d="M1307 1950V510H1671V1950Z" />
        <path d="M1872 1950V920H2236V1950Z" />
        <path d="M2437 1950V510H2801V1237L3080 920H3500L3141 1343L3525 1950H3096L2877 1581L2801 1664V1950Z" />
      </g>
      <polygon points="2010,330 2043,809 2153,693 2240,861 2315,823 2232,660 2375,650" fill="currentColor" stroke="currentColor" strokeWidth="99" strokeLinejoin="round" />
      <polygon points="2010,330 2043,809 2153,693 2240,861 2315,823 2232,660 2375,650" fill={light ? "var(--deep-cyan)" : "var(--primary)"} stroke={light ? "var(--deep-cyan)" : "var(--primary)"} strokeWidth="27" strokeLinejoin="round" />
      <line x1="1993" y1="235" x2="1977" y2="141" stroke={light ? "var(--deep-cyan)" : "var(--primary)"} strokeWidth="39" strokeLinecap="round" />
      <line x1="1931" y1="275" x2="1853" y2="220" stroke={light ? "var(--deep-cyan)" : "var(--primary)"} strokeWidth="39" strokeLinecap="round" />
      <line x1="1915" y1="347" x2="1821" y2="363" stroke={light ? "var(--deep-cyan)" : "var(--primary)"} strokeWidth="39" strokeLinecap="round" />
    </svg>
  );
}

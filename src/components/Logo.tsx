import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false, ...props }: SVGProps<SVGSVGElement> & { light?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 40 4990 1940"
      role="img"
      aria-label="Klik"
      className={cn("block w-auto text-foreground", light && "text-ink", className)}
      {...props}
    >
      <g fill="currentColor">
        <path d="M131 1950V510H495V1237L774 920H1194L835 1343L1219 1950H790L571 1581L495 1664V1950Z" />
        <path d="M1307 1950V510H1671V1950Z" />
        <path d="M1872 1950V920H2236V1950ZM2054 777Q1968 777 1904.5 724.5Q1841 672 1841 580Q1841 489 1904.5 436Q1968 383 2054 383Q2140 383 2203.5 436Q2267 489 2267 580Q2267 672 2203.5 724.5Q2140 777 2054 777Z" />
        <path d="M2437 1950V510H2801V1237L3080 920H3500L3141 1343L3525 1950H3096L2877 1581L2801 1664V1950Z" />
      </g>
      <polygon points="3990,660 4073,1841 4342,1555 4556,1970 4743,1876 4537,1475 4891,1450" fill="currentColor" stroke="currentColor" stroke-width="244" stroke-linejoin="round" />
      <polygon points="3990,660 4073,1841 4342,1555 4556,1970 4743,1876 4537,1475 4891,1450" fill={light ? "var(--deep-cyan)" : "var(--primary)"} stroke={light ? "var(--deep-cyan)" : "var(--primary)"} stroke-width="67" stroke-linejoin="round" />
      <line x1="3949" y1="427" x2="3908" y2="194" stroke="currentColor" stroke-width="96" stroke-linecap="round" />
      <line x1="3796" y1="524" x2="3602" y2="388" stroke="currentColor" stroke-width="96" stroke-linecap="round" />
      <line x1="3757" y1="701" x2="3524" y2="742" stroke="currentColor" stroke-width="96" stroke-linecap="round" />
    </svg>
  );
}

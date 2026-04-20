import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

export const jakarta = loadJakarta("normal", {
  weights: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export const COLORS = {
  bg: "#0a0d12",
  surface: "#111827",
  accent: "#b4f032",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  dim: "rgba(255,255,255,0.4)",
};

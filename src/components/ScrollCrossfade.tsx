import { useRef, useEffect, useState, type ReactNode } from "react";

interface ScrollCrossfadeProps {
  layers: ReactNode[];
}

export function ScrollCrossfade({ layers }: ScrollCrossfadeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [opacities, setOpacities] = useState<number[]>(() =>
    layers.map((_, i) => (i === 0 ? 1 : 0))
  );
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalScroll = container.scrollHeight - window.innerHeight;
      const layerCount = layers.length;
      const scrollPerLayer = totalScroll / (layerCount - 1);

      const newOpacities = layers.map((_, i) => {
        if (scrolled <= 0) return i === 0 ? 1 : 0;
        if (scrolled >= totalScroll) return i === layerCount - 1 ? 1 : 0;

        const layerStart = i * scrollPerLayer;
        const layerEnd = (i + 1) * scrollPerLayer;

        // Fade in
        if (i > 0) {
          const fadeInStart = (i - 1) * scrollPerLayer;
          const fadeInEnd = i * scrollPerLayer;
          if (scrolled < fadeInStart) return 0;
          if (scrolled >= fadeInStart && scrolled <= fadeInEnd) {
            return Math.min(1, (scrolled - fadeInStart) / scrollPerLayer);
          }
        }

        // Fully visible
        if (scrolled >= layerStart && scrolled <= layerEnd) return 1;

        // Fade out
        if (i < layerCount - 1 && scrolled > layerEnd) {
          const fadeOutProgress = (scrolled - layerEnd) / scrollPerLayer;
          return Math.max(0, 1 - fadeOutProgress);
        }

        if (i === 0 && scrolled <= scrollPerLayer) {
          return Math.max(0, 1 - scrolled / scrollPerLayer);
        }

        return i === layerCount - 1 ? 1 : 0;
      });

      // Cinematic black overlay pulses between transitions
      const progress = scrolled / totalScroll;
      const fractional = (progress * (layerCount - 1)) % 1;
      const blackPulse = Math.sin(fractional * Math.PI) * 0.3;

      setOpacities(newOpacities);
      setOverlayOpacity(scrolled > 0 && scrolled < totalScroll ? blackPulse : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [layers.length]);

  // Total height: each transition takes 100vh, so (layerCount - 1) * 100vh + 100vh for the last visible
  const totalHeight = `${layers.length * 100}vh`;

  return (
    <div ref={containerRef} style={{ height: totalHeight }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {layers.map((layer, i) => (
          <div
            key={i}
            className="absolute inset-0 overflow-y-auto"
            style={{
              opacity: opacities[i] ?? 0,
              transition: "opacity 0.15s ease",
              pointerEvents: opacities[i] > 0.5 ? "auto" : "none",
              zIndex: i,
            }}
          >
            {layer}
          </div>
        ))}
        {/* Cinematic black overlay */}
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{
            opacity: overlayOpacity,
            zIndex: layers.length,
            transition: "opacity 0.15s ease",
          }}
        />
      </div>
    </div>
  );
}

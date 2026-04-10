import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const scenes = [
  { img: "/img/scene1.jpg", overlay: 0, text: "Sve je počelo s idejom." },
  { img: "/img/scene2.jpg", overlay: 0.15, text: "I pravim alatom." },
  { img: "/img/scene3.jpg", overlay: 0.35, text: "Koji se otvara za tebe." },
  { img: "/img/scene4.jpg", overlay: 0.55, text: "Tvoj sajt se gradi." },
  { img: "/img/scene5.jpg", overlay: 0, text: null },
];

export function ScrollHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const lastIndex = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const rawIndex = progress * 5;
      const newIndex = Math.min(4, Math.floor(rawIndex));
      const fraction = rawIndex - newIndex;

      // Smooth overlay interpolation
      const currentOverlay = scenes[newIndex].overlay;
      const nextOverlay = newIndex < 4 ? scenes[newIndex + 1].overlay : scenes[newIndex].overlay;
      setOverlayOpacity(currentOverlay + (nextOverlay - currentOverlay) * fraction);

      // Text fade: visible in middle of each scene, fade out near edges
      const textFade = fraction < 0.15 ? fraction / 0.15 : fraction > 0.75 ? (1 - fraction) / 0.25 : 1;
      setTextOpacity(Math.max(0, Math.min(1, textFade)));

      if (newIndex !== lastIndex.current) {
        setTransitioning(true);
        lastIndex.current = newIndex;
        setTimeout(() => setTransitioning(false), 50);
      }
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} style={{ height: "500vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {scenes.map((scene, i) => (
          <img
            key={i}
            src={scene.img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: activeIndex === i ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              zIndex: 1,
            }}
          />
        ))}

        {/* Darkening overlay */}
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{
            opacity: overlayOpacity,
            transition: "opacity 1s ease",
            zIndex: 2,
          }}
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {activeIndex < 4 && scenes[activeIndex].text && (
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white text-center px-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
              style={{
                opacity: textOpacity,
                transition: transitioning ? "none" : "opacity 0.4s ease",
              }}
            >
              {scenes[activeIndex].text}
            </h2>
          )}

          {activeIndex === 4 && (
            <a
              href="#kontakt"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-xl text-background"
              style={{
                backgroundColor: "#b5f000",
                opacity: textOpacity,
                transition: transitioning ? "none" : "opacity 0.4s ease",
                boxShadow: "0 0 40px rgba(181,240,0,0.4)",
              }}
            >
              Zakaži konsultaciju <ArrowRight className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Lightweight scroll-controlled CSS 3D scene.
 * No canvas, WebGL, images, or third-party animation runtime.
 * Motion is isolated to transforms/opacity and disabled for reduced-motion.
 */
export function ScrollFlythrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 639px)");
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      if (!visible || motion.matches) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      scene.style.setProperty("--flight", progress.toFixed(4));
      scene.style.setProperty("--flight-z", `${Math.round(progress * (narrow.matches ? 480 : 900))}px`);
      // Fade the last part of the journey into the following content.
      scene.style.setProperty("--flight-fade", String(Math.min(1, (1 - progress) * 5)));
    };
    const schedule = () => {
      if (!frame && visible && !motion.matches) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) schedule();
    }, { rootMargin: "150px 0px" });
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    motion.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ttf-flight" aria-labelledby="ttf-flight-heading">
      <div className="ttf-flight-sticky">
        <div ref={sceneRef} className="ttf-flight-scene" aria-hidden="true">
          <div className="ttf-flight-perspective">
            <div className="ttf-flight-ring ttf-flight-ring-one" />
            <div className="ttf-flight-ring ttf-flight-ring-two" />
            <div className="ttf-flight-ring ttf-flight-ring-three" />
            <div className="ttf-flight-core">TTF</div>
            <span className="ttf-flight-label ttf-flight-label-one">Learn</span>
            <span className="ttf-flight-label ttf-flight-label-two">Practice</span>
            <span className="ttf-flight-label ttf-flight-label-three">Build</span>
            <span className="ttf-flight-label ttf-flight-label-four">Interview</span>
          </div>
        </div>
        <div className="ttf-flight-copy">
          <p className="ttf-eyebrow">The journey starts here</p>
          <h2 id="ttf-flight-heading">From curious<br /><em className="ttf-blue">to capable.</em></h2>
          <p className="ttf-muted">One step at a time. Learn the foundations, build something real, and prepare for your next opportunity.</p>
          <Link className="ttf-button" href="/roadmap">Explore the six steps ↗</Link>
        </div>
      </div>
    </section>
  );
}

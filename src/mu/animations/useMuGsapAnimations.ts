import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useMuGsapAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // MAPA DE ANIMACIONES
    const animations = {
      "fade-up": { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } },
      "fade-down": { from: { opacity: 0, y: -40 }, to: { opacity: 1, y: 0 } },
      "fade-left": { from: { opacity: 0, x: -40 }, to: { opacity: 1, x: 0 } },
      "fade-right": { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0 } },
      "fade-scale": { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } },
    } as const;

    const elements = gsap.utils.toArray<HTMLElement>("[data-mu-animate]");

    elements.forEach((el) => {
      const type = el.dataset.muAnimate as keyof typeof animations | undefined;
      const delay = Number(el.dataset.muDelay) || 0;
      const stagger = Number(el.dataset.muStagger) || 0;

      const anim = type ? animations[type] : undefined;
      if (!anim) return;

      gsap.fromTo(
        el,
        anim.from,
        {
          ...anim.to,
          duration: 0.9,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // TIMELINE ESPECIAL PARA HERO
    const hero = document.querySelector("#mu-hero");
    if (hero) {
      const title = hero.querySelector(".mu-hero-title");
      const subtitle = hero.querySelector(".mu-hero-subtitle");
      const actions = hero.querySelector(".mu-hero-actions");
      const metrics = hero.querySelector(".mu-hero-metrics");

      const tl = gsap.timeline({
        delay: 0.2,
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      if (title) tl.fromTo(title, { y: 50, opacity: 0 }, { y: 0, opacity: 1 });
      if (subtitle) tl.fromTo(subtitle, { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.4");
      if (actions) tl.fromTo(actions, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.4");
      if (metrics && metrics.children.length) {
        tl.fromTo(
          metrics.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1 },
          "-=0.3"
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}

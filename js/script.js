// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (window.gsap) {
      if (open) {
        gsap.fromTo(
          navLinks,
          { y: -40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(navLinks, {
          y: -40,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  });
}

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// GSAP scroll animations
window.addEventListener("DOMContentLoaded", () => {
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // --- existing GSAP animations (kept) ---
    // subtle blur -> sharp for key text when entering the viewport (reversible)
    gsap.utils
      .toArray(".kicker, .subheading, .section-title")
      .forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 8, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
            delay: i * 0.03,
          }
        );
      });

    // CTA buttons - small staggered float-up tied to hero (reversible)
    gsap.from(".cta a, .cta .btn", {
      y: 10,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: ".hero",
        start: "top 90%",
        toggleActions: "play reverse play reverse",
      },
    });

    // Brands - animate when the brands section enters view
    gsap.from(".brands-grid .brand-tile", {
      y: 18,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: "#brands",
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });

    // Services cards
    gsap.from("#services .card", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: "#services",
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });

    // Portfolio (mag cards)
    gsap.from(".mag-grid .mag-card", {
      y: 24,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: "#portfolio",
        start: "top 80%",
        toggleActions: "play reverse play reverse",
      },
    });

    // Fun Facts
    gsap.from("#fun-facts .card", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: "#fun-facts",
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });

    // Tools
    gsap.from("#tools .card", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: "#tools",
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });

    // Stats - smooth number counts (staggered, reversible)
    const formatCount = (value, format) => {
      const v = Math.floor(value);
      if (format === "short") {
        if (v >= 1000) return `${Math.round(v / 1000)}K+`;
        return `${v}+`;
      }
      return `${v}+`;
    };

    gsap.utils.toArray(".stat-number").forEach((el, i) => {
      const target = Number(el.dataset.target) || 0;
      const format = el.dataset.format || "plain";
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 6,
        ease: "power1.out",
        delay: i * 0.06,
        stagger: 0.02,
        scrollTrigger: {
          trigger: "#stats",
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
        onUpdate: function () {
          el.textContent = formatCount(obj.value, format);
        },
        onComplete: function () {
          if (format === "short" && target >= 1000) {
            el.textContent = `${Math.round(target / 1000)}K+`;
          } else {
            el.textContent = `${target}+`;
          }
        },
      });
    });

    // --- Hero image alternate crossfade loop (replacement) ---
    (function heroImageCycle() {
      const heroImg = document.getElementById("hero-photo");
      if (!heroImg) return;
      const defaultSrc = heroImg.getAttribute("src");
      const altSrc = heroImg.dataset.altSrc;
      if (!altSrc) return;

      // preload helper (returns a promise)
      const preload = (src) =>
        new Promise((resolve) => {
          if (!src) return resolve();
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img); // resolve even on error to keep loop stable
          img.src = src;
        });

      // small async sleep
      const wait = (s) => new Promise((r) => setTimeout(r, s * 1000));

      // respect reduced-motion
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) {
        heroImg.src = defaultSrc;
        heroImg.style.opacity = "1";
        heroImg.style.filter = "none";
        return;
      }

      // start state
      heroImg.src = defaultSrc;
      heroImg.style.opacity = "1";
      heroImg.style.filter = "none";

      // preload both images, then run loop without eval or string timers
      Promise.all([preload(defaultSrc), preload(altSrc)]).then(() => {
        (async function loop() {
          let showingAlt = false;
          const hold = 5; // seconds each image stays visible
          const fade = 0.8; // fade duration

          // entrance animation (from bottom)
          await gsap.fromTo(
            heroImg,
            { y: 100, opacity: 0, filter: "blur(6px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.6,
              ease: "power2.out",
            }
          );

          while (true) {
            await wait(hold);

            // fade out + blur
            await gsap.to(heroImg, {
              opacity: 0,
              filter: "blur(6px)",
              duration: fade,
              ease: "power2.in",
            });

            // swap src (preloaded)
            const nextSrc = showingAlt ? defaultSrc : altSrc;
            await preload(nextSrc);
            heroImg.src = nextSrc;
            showingAlt = !showingAlt;

            // fade in
            await gsap.to(heroImg, {
              opacity: 1,
              filter: "blur(0px)",
              duration: fade,
              ease: "power2.out",
            });
          }
        })();
      });
    })();
  }
});

// Hide header on scroll down, show on scroll up
(function () {
  const header = document.querySelector(".navbar");
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;
  let lastDirection = null;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      // if mobile nav is open, don't hide header
      const navOpen = document
        .querySelector(".nav-links")
        ?.classList.contains("open");
      if (navOpen) {
        header.classList.remove("nav-hidden");
      } else if (Math.abs(delta) > 5) {
        if (delta > 0 && lastDirection !== "down") {
          // scrolling down
          header.classList.add("nav-hidden");
          lastDirection = "down";
        } else if (delta < 0 && lastDirection !== "up") {
          // scrolling up
          header.classList.remove("nav-hidden");
          lastDirection = "up";
        }
      }
      lastY = currentY;
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

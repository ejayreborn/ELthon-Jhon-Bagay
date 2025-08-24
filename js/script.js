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
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
        );
      } else {
        gsap.to(navLinks, {
          y: -40,
          opacity: 0,
          duration: 0.35,
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
            duration: 0.8,
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
      duration: 0.6,
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
      duration: 0.7,
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
      duration: 0.75,
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
      duration: 0.8,
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
      duration: 0.72,
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
      duration: 0.72,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: "#tools",
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });
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

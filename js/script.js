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
    gsap.utils.toArray(".section, .mag-card, .card").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }
});

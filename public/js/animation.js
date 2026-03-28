"use strict";

////////////////////////////////////////////////////////////
// SECTION ANIMATION
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("active");
        }, 200); // ⏳ delay here (200ms)

        sectionObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

document.querySelectorAll(".reveal").forEach((el) => {
  sectionObserver.observe(el);
});

function animateCards() {
  const container = document.querySelector(
    ".all-courses, .preview-course-right",
  );
  if (!container) return;

  const children = container.querySelectorAll(".reveal-right");

  if (!children.length) {
    console.log("No cards found for animation");
    return;
  }

  children.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("active");
    }, i * 250);
  });
}

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

//////////////////////////////////////////////////////////
// CARD INFO

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll(".reveal-card");

        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add("active");
          }, i * 250); // stagger
        });

        cardObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  },
);

// Observe parent container
document
  .querySelectorAll(".section-choose-us, .section-testimonials, .section-teach")
  .forEach((section) => {
    cardObserver.observe(section);
  });

///////////////////////////////////////////////////////////
// CARD ANIMATION
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const children = entry.target.querySelectorAll(".reveal-right");

          children.forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("active");
            }, i * 250);
          });
        }, 100);

        observer.unobserve(entry.target); // run only once
      }
    });
  },
  {
    threshold: 0.3,
  },
);

// Observe ONLY the parent container
document
  .querySelectorAll(
    ".popular-courses, .vision-mission, .all-courses, .form-account, .cred-content, .hero-main",
  )
  .forEach((section) => {
    observer.observe(section);
  });

//////////////////////////////////////////////////////////
// Make mobile navigation work
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
  console.log("Clicked");
});

//////////////////////////////////////////////////////////
// Sticky Navigation

const stickySections = document.querySelectorAll(".observe-sticky");

if (stickySections.length > 0) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          document.body.classList.add("sticky");
        } else {
          document.body.classList.remove("sticky");
        }
      });
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
    },
  );

  stickySections.forEach((section) => obs.observe(section));
}

const mainNavList = document.querySelectorAll(".main-nav-list-item");
mainNavList.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < mainNavList.length; i++) {
      mainNavList[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

const faqQuestionBox = document.querySelectorAll(".faq-question-box");
faqQuestionBox.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < faqQuestionBox.length; i++) {
      faqQuestionBox[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

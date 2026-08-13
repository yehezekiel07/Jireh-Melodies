//////////////////////////////////////////////////////////
// Make mobile navigation work
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

//////////////////////////////////////////////////////////
// Sticky Navigation

const sectionHeroEl = document.querySelector(".section-hero");

let isSticky = false;

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (!ent.isIntersecting && !isSticky) {
      document.body.classList.add("sticky");
      isSticky = true;
    }

    if (ent.isIntersecting && isSticky) {
      document.body.classList.remove("sticky");
      isSticky = false;
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-80px", // slightly bigger buffer
  },
);
obs.observe(sectionHeroEl);

const mainNavList = document.querySelectorAll(".main-nav-list-item");
mainNavList.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < mainNavList.length; i++) {
      mainNavList[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

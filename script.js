"use strict";

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

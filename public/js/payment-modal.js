document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("paymentModal");
  const closeBtn = document.querySelector(".close-btn");

  // Open modal (for all buttons)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".addToCart");

    if (!btn) return;

    e.preventDefault();
    modal.style.display = "block";
  });

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Click outside closes modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

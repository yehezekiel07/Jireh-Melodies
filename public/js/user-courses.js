document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`/get-courses`);

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();

    const container = document.getElementById("coursesContainer");

    if (!container) return;

    container.innerHTML = "";

    data.courses.forEach((course) => {
      const div = document.createElement("div");
      div.className = "preview-cards";

      div.innerHTML = `

              <div class="course course-preview">
                <img
                  src="${course.thumbnail}"
                  class="course-img"
                  alt="Course Image"
                />
                <div class="course-content">
                  <p class="course-title">${course.title}</p>
                  <div class="course-tags">
                    <span class="tag tag--instructor"
                      >${course.instructor}</span
                    >
                    <span class="tag tag--lang"
                      >${course.language}</span
                    >
                  </div>
                  <p class="course-description">
                    ${course.description}
                  </p>
                  <div class="course-footer">
                    <span class="course-price">
                      <strong class="discount-price"
                        >${course.price}</strong
                      >
                      <p class="price-dashed">${course.originalPrice}</p>
                    </span>
                   <div class="buttons">
                    <button class="addToCart btn btn--primary" data-id="${course._id}">
                     <span>Add to cart</span>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
              
    `;

      div.addEventListener("click", () => {
        const currentPage = window.location.pathname;

        if (currentPage.includes("user-all-courses.html")) {
          window.location.href = `course-overview.html?id=${course._id}`;
        } else {
          window.location.href = `course-full-preview.html?id=${course._id}`;
        }
      });

      const btn = div.querySelector(".addToCart");

      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation(); // 🔥 stops card click
          e.preventDefault();

          const modal = document.getElementById("paymentModal");
          modal.style.display = "block";
        });
      }

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load your courses");
  }
});

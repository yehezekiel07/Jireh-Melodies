document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/get-courses");

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();

    const container = document.getElementById("coursesContainer");
    const languageFilter = document.getElementById("languageFilter");
    const languageOptions = document.getElementById("languageOptions");

    if (!container) return;

    // Store all courses in memory
    const allCourses = data.courses || [];

    // ===========================
    // CREATE LANGUAGE OPTIONS
    // ===========================

    const languages = [
      ...new Set(
        allCourses
          .map((course) => course.language)
          .filter((language) => language && language.trim() !== "")
          .map((language) => language.trim()),
      ),
    ].sort((a, b) => a.localeCompare(b));

    if (languageOptions) {
      languageOptions.innerHTML = "";

      // All Languages option
      const allOption = document.createElement("div");
      allOption.className = "language-option active";
      allOption.textContent = "All Languages";
      allOption.dataset.language = "all";

      languageOptions.appendChild(allOption);

      // Individual languages
      languages.forEach((language) => {
        const option = document.createElement("div");

        option.className = "language-option";
        option.textContent = language;
        option.dataset.language = language;

        languageOptions.appendChild(option);
      });
    }

    // ===========================
    // RENDER COURSES
    // ===========================

    function renderCourses(courses) {
      container.innerHTML = "";

      if (courses.length === 0) {
        container.innerHTML = `
          <p class="no-courses">
            No courses available for this language.
          </p>
        `;
        return;
      }

      courses.forEach((course) => {
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

              <div class="course-header">

                <p class="course-title">
                  ${course.title}
                </p>

                <div class="course-tags">

                  <span class="tag tag--instructor">
                    ${course.instructor}
                  </span>

                  <span class="tag tag--lang">
                    ${course.language}
                  </span>

                </div>

                <p class="course-description truncate-3">
                  ${course.description}
                </p>

              </div>

              <div class="course-footer">

                <span class="course-price">

                  <strong class="discount-price">
                    ${course.price}
                  </strong>

                  <p class="price-dashed">
                    ${course.originalPrice}
                  </p>

                </span>

                <div class="buttons">

                  <button
                    class="addToCart btn btn--primary"
                    data-id="${course._id}"
                  >
                    <span>Add to cart</span>
                  </button>

                </div>

              </div>

            </div>
          </div>
        `;

        // ===========================
        // COURSE CARD CLICK
        // ===========================

        div.addEventListener("click", () => {
          const currentPage = window.location.pathname;

          if (currentPage.includes("/user-all-courses")) {
            window.location.href = `/course-overview?id=${course._id}`;
          } else {
            window.location.href = `/course-full-preview?id=${course._id}`;
          }
        });

        // ===========================
        // ADD TO CART / PAYMENT MODAL
        // ===========================

        const btn = div.querySelector(".addToCart");

        if (btn) {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();

            const modal = document.getElementById("paymentModal");

            if (modal) {
              modal.style.display = "block";
            }
          });
        }

        container.appendChild(div);
      });
    }

    // Initially show all courses
    renderCourses(allCourses);

    // ===========================
    // LANGUAGE FILTER
    // ===========================

    if (languageOptions && languageFilter) {
      languageOptions.addEventListener("click", (e) => {
        const option = e.target.closest(".language-option");

        if (!option) return;

        const selectedLanguage = option.dataset.language;

        // Update label
        languageFilter.textContent =
          selectedLanguage === "all" ? "All Languages" : selectedLanguage;

        // Remove active state
        languageOptions.querySelectorAll(".language-option").forEach((item) => {
          item.classList.remove("active");
        });

        // Add active state
        option.classList.add("active");

        // Filter courses
        if (selectedLanguage === "all") {
          renderCourses(allCourses);
        } else {
          const filteredCourses = allCourses.filter((course) => {
            return (
              course.language &&
              course.language.trim().toLowerCase() ===
                selectedLanguage.trim().toLowerCase()
            );
          });

          renderCourses(filteredCourses);
        }

        // Close dropdown
        languageOptions.classList.remove("show");
      });
    }

    // ===========================
    // OPEN / CLOSE LANGUAGE DROPDOWN
    // ===========================

    if (languageFilter && languageOptions) {
      const languageDropdown = languageFilter.closest(".lang-dropdown");

      languageDropdown.addEventListener("click", (e) => {
        e.stopPropagation();

        // Do not toggle the dropdown when selecting a language
        if (e.target.closest(".language-option")) {
          return;
        }

        languageOptions.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        languageOptions.classList.remove("show");
      });
    }
  } catch (err) {
    console.error(err);

    alert("Failed to load your courses");
  }
});

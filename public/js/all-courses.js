// ===========================
// LOAD ALL COURSES
// ===========================

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("coursesContainer");

  try {
    const res = await fetch("/get-courses");

    if (!res.ok) throw new Error("Failed to fetch courses");

    const data = await res.json();

    if (!data.success) return;

    container.innerHTML = "";

    data.courses.forEach((course) => {
      const div = document.createElement("div");
      div.className = "preview-cards reveal";

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
                    <button class="editCourse btn btn--secondary" data-id="${course._id}">
                     <i class="ph ph-pencil link-icon"></i>
                    </button>

                    <button 
  class="deleteCourse btn btn--secondary"
  data-id="${course._id}"
>
                     <i class="ph ph-trash link-icon"></i>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
              
    `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load courses");
  }
});

// ===========================
// DELETE COURSE
// ===========================

let courseToDelete = null;

function openDeleteModal(courseId, courseTitle) {
  const modal = document.getElementById("deleteModal");
  console.log("MODAL:", modal);

  if (!modal) {
    console.error("Modal not found");
    return;
  }

  courseToDelete = courseId;

  const text = modal.querySelector("p");
  if (text) {
    text.textContent = `Are you sure you want to delete "${courseTitle}"?`;
  }

  modal.classList.remove("hidden");
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");

  if (!modal) return;

  courseToDelete = null;
  modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmDelete");
  const cancelBtn = document.getElementById("cancelDelete");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeDeleteModal);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      if (!courseToDelete) return;

      try {
        await fetch(`/delete-course/${courseToDelete}`, {
          method: "DELETE",
        });

        closeDeleteModal();
        window.location.reload();
      } catch (err) {
        console.error("Delete failed", err);
      }
    });
  }
});

document.addEventListener("click", (e) => {
  console.log("Clicked:", e.target);

  const deleteBtn = e.target.closest(".deleteCourse");
  if (!deleteBtn) return;

  console.log("Delete button clicked");

  const courseId = deleteBtn.dataset.id;
  const courseTitle = deleteBtn.dataset.title;

  openDeleteModal(courseId, courseTitle);
});

document.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".deleteCourse");
  if (!deleteBtn) return;

  const courseId = deleteBtn.dataset.id;

  // ✅ Get title from DOM (SAFE)
  const card = deleteBtn.closest(".course");
  const courseTitle = card.querySelector(".course-title")?.textContent;

  console.log("TITLE:", courseTitle); // debug

  openDeleteModal(courseId, courseTitle);
});

// ===========================
// EDIT COURSE
// ===========================

document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".editCourse");

  if (!editBtn) return;

  const courseId = editBtn.dataset.id;

  // redirect to step-1 with id
  window.location.href = `/add-course?id=${courseId}`;
});

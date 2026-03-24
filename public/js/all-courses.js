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
                    <button class="editCourse btn btn--secondary" data-id="${course._id}">
                     <i class="ph ph-pencil link-icon"></i>
                    </button>

                    <button class="deleteCourse btn btn--secondary" data-id="${course._id}">
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

document.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".deleteCourse");

  if (!deleteBtn) return;

  const courseId = deleteBtn.dataset.id;

  const confirmDelete = confirm("Are you sure you want to delete this course?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`/delete-course/${courseId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    const data = await res.json();

    if (data.success) {
      alert("Course deleted successfully");
      window.location.reload();
    } else {
      alert("Error deleting course");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while deleting");
  }
});

// ===========================
// EDIT COURSE
// ===========================

document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".editCourse");

  if (!editBtn) return;

  const courseId = editBtn.dataset.id;

  // redirect to step-1 with id
  window.location.href = `add-course.html?id=${courseId}`;
});

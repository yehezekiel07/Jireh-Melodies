document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.log("No userId found");
    return;
  }

  const res = await fetch(`/user-courses/${userId}`);
  const data = await res.json();

  const container = document.getElementById("myCourses");

  if (!container) {
    console.log("Container missing");
    return;
  }

  container.innerHTML = "";

  data.courses.forEach((course) => {
    const div = document.createElement("div");

    div.className = "preview-cards";

    console.log(data.courses);

    div.innerHTML = `

              <div class="course course-preview">
                <img
                  src="/uploads/${course.thumbnail}"
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
                   <div class="user-card-buttons">
                    <button class="viewCourse btn btn--primary" data-id="${course._id}">
                     <i class="ph ph-eye link-icon"></i><span>View Course</span>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
              
    `;

    div.addEventListener("click", () => {
      window.location.href = `course-player.html?id=${course._id}`;
    });

    container.appendChild(div);
  });
});

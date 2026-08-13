function calculateCourseProgress(course) {
  const progress = JSON.parse(localStorage.getItem("courseProgress")) || [];

  let totalLessons = 0;
  let completedLessons = 0;

  course.modules?.forEach((module) => {
    module.lessons?.forEach((lesson) => {
      totalLessons++;

      const lessonId = lesson._id || lesson.title;

      if (progress.includes(lessonId)) {
        completedLessons++;
      }
    });
  });

  if (totalLessons === 0) return 0;

  return Math.round((completedLessons / totalLessons) * 100);
}

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

    const progressPercent = calculateCourseProgress(course);

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
                  <p class="course-description truncate-3">
                    ${course.description}
                  </p>
                  
                  <div class="course-progress">
                   <div class="progress-bar">
                    <div 
                     class="progress-fill" 
                     style="width: ${progressPercent}%; background: ${progressPercent === 100 ? "#0b913c" : "#de7c62"}"
                     ></div>
                   </div>
                   <span class="progress-text">${progressPercent}% completed</span>
                  </div>

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
      window.location.href = `/course-player?id=${course._id}`;
    });

    container.appendChild(div);
  });
});

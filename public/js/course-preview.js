document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  const res = await fetch(`/get-course/${courseId}`);
  const course = await res.json();

  // STEP 1 DATA
  document.getElementById("courseTitle").textContent = course.title;
  document.getElementById("courseDescription").textContent = course.description;

  document.getElementById("courseInstructor").textContent =
    "Instructor: " + course.instructor;

  document.getElementById("courseLanguage").textContent =
    "Language: " + course.language;

  document.getElementById("coursePrice").textContent = "₹" + course.price;

  document.getElementById("courseOriginalPrice").textContent =
    "₹" + course.originalPrice;

  document.getElementById("courseThumbnail").src =
    "/uploads/" + course.thumbnail;

  // STEP 2 DATA
  const learnContainer = document.getElementById("learnPoints");

  course.whatYouLearn.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;

    learnContainer.appendChild(li);
  });

  const requirementContainer = document.getElementById("requirements");

  course.requirements.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;

    requirementContainer.appendChild(li);
  });

  const includesContainer = document.getElementById("courseIncludes");

  course.courseIncludes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;

    includesContainer.appendChild(li);
  });

  // STEP 3 DATA
  const modulesContainer = document.getElementById("modulesContainer");

  course.modules.forEach((module) => {
    const moduleDiv = document.createElement("div");
    moduleDiv.className = "preview-module";

    moduleDiv.innerHTML = `<h3>${module.title}</h3>`;

    module.lessons.forEach((lesson) => {
      const lessonDiv = document.createElement("div");

      lessonDiv.className = "preview-lesson";

      lessonDiv.innerHTML = `
        <p>${lesson.title}</p>
      `;

      moduleDiv.appendChild(lessonDiv);
    });

    modulesContainer.appendChild(moduleDiv);
  });
});

// Publish Course

document.getElementById("publishCourse").addEventListener("click", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  await fetch(`/publish-course/${courseId}`, {
    method: "PUT",
  });

  alert("Course published");

  window.location.href = "/admin-dashboard.html";
});

// ===========================
// BACK BUTTON
// ===========================

const backBtn = document.getElementById("backToModules");

if (backBtn) {
  backBtn.addEventListener("click", function () {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    window.location.href = `course-modules.html?id=${courseId}`;
  });
}

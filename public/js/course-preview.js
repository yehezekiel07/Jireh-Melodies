document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  const res = await fetch(`/get-course/${courseId}`);
  const course = await res.json();

  // STEP 1 DATA
  document.getElementById("courseTitle").textContent = course.title;
  document.getElementById("courseDescription").textContent = course.description;

  document.getElementById("courseInstructor").textContent = course.instructor;

  document.getElementById("courseLanguage").textContent =
    "Language: " + course.language;

  document.getElementById("coursePrice").textContent = "₹" + course.price;

  document.getElementById("courseOriginalPrice").textContent =
    "₹" + course.originalPrice;

  document.getElementById("courseThumbnail").src =
    "/uploads/" + course.thumbnail;

  // STEP 2 DATA
  const learnContainer = document.getElementById("learnPoints");

  (course.learnPoints || []).forEach((point) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="pointIconBox">
     <i class="ph ph-check link-icon"></i>
     <span>${point}</span>
    </div>
  `;

    learnContainer.appendChild(li);
  });

  const requirementContainer = document.getElementById("requirements");

  course.requirements.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;

    requirementContainer.appendChild(li);
  });

  // ✅ COURSE INCLUDES WITH ICONS

  const includesContainer = document.getElementById("courseIncludes");

  // clear first (important if reloading)
  includesContainer.innerHTML = "";

  // Duration
  if (course.duration) {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="includesBox">
     <i class="ph ph-video link-icon"></i>
     <span>${course.duration} on - demand Videos</span>
    </div> 
     `;
    includesContainer.appendChild(li);
  }

  // Downloadables
  if (course.downloadItems) {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="includesBox">
     <i class="ph ph-file-arrow-down link-icon"></i>
     <span>${course.downloadItems} downloadable resources</span>
    </div>
  `;
    includesContainer.appendChild(li);
  }

  // Mobile & Laptop Access
  if (course.mobileAccess) {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="includesBox">
     <i class="ph ph-device-mobile link-icon"></i>
     <span>Access on mobile & laptop</span>
    </div>
  `;
    includesContainer.appendChild(li);
  }

  // Certificate
  if (course.certificate) {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="includesBox">
     <i class="ph ph-certificate link-icon"></i>
     <span>Certificate of completion</span>
    </div>
  `;
    includesContainer.appendChild(li);
  }

  // Course Duration Seperately

  document.getElementById("courseDuration").textContent =
    course.duration || "N/A";

  document.querySelectorAll(".courseDuration").forEach((el) => {
    el.textContent = course.duration || "N/A";
  });

  // ✅ CARD PREVIEW POINTS

  const previewPointsContainer = document.getElementById("previewPoints");

  (course.previewPoints || []).forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;

    previewPointsContainer.appendChild(li);
  });

  // STEP 3 DATA

  // ✅ TOTAL LESSON COUNT

  let totalLessons = 0;

  (course.modules || []).forEach((module) => {
    totalLessons += (module.lessons || []).length;
  });

  document.querySelectorAll(".totalLessons").forEach((el) => {
    el.textContent = totalLessons + " lessons";
  });

  document.getElementById("totalLessons").textContent =
    totalLessons + " lessons";

  // // show in UI
  // const lessonCountEl = document.createElement("p");
  // lessonCountEl.textContent = totalLessons + " lessons";
  // lessonCountEl.style.fontWeight = "600";

  // document.querySelector(".course-curriculum").prepend(lessonCountEl);

  // ✅ TOTAL MODULES COUNT

  const totalModules = (course.modules || []).length;

  document.querySelectorAll(".totalModules").forEach((el) => {
    el.textContent = totalModules + " modules";
  });

  document.getElementById("totalModules").textContent =
    totalModules + " modules";

  const modulesContainer = document.getElementById("modulesContainer");

  course.modules.forEach((module) => {
    const moduleDiv = document.createElement("div");
    moduleDiv.className = "preview-module";

    moduleDiv.innerHTML = `
  <h3>
    <i class="ph ph-book-open"></i>
    <span>${module.title}</span>
  </h3>
`;

    module.lessons.forEach((lesson) => {
      const lessonDiv = document.createElement("div");

      lessonDiv.className = "preview-lesson";

      lessonDiv.innerHTML = `
  <div class="lesson-row">
    <i class="ph ph-play-circle"></i>
    <span>${lesson.title}</span>
  </div>

  ${lesson.video ? `<a href="${lesson.video}" target="_blank">Watch Video</a>` : ""}
  ${lesson.file ? `<a href="/uploads/${lesson.file}" target="_blank">Download File</a>` : ""}
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

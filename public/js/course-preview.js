document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  try {
    const res = await fetch(`/get-course/${courseId}`);

    if (!res.ok) throw new Error("Failed");

    const course = await res.json();

    function calculateTotalDuration(modules) {
      let totalSeconds = 0;

      modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
          if (!lesson.duration) return;

          if (lesson.duration.includes(":")) {
            const parts = lesson.duration.split(":").map(Number);

            if (parts.length === 2) {
              const [min, sec] = parts;
              totalSeconds += min * 60 + sec;
            } else if (parts.length === 3) {
              const [hr, min, sec] = parts;
              totalSeconds += hr * 3600 + min * 60 + sec;
            }
          } else {
            totalSeconds += parseFloat(lesson.duration) * 60;
          }
        });
      });

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      let result = "";
      if (hours > 0) result += `${hours}h `;
      if (minutes > 0) result += `${minutes}m `;
      if (seconds > 0) result += `${seconds}s`;

      return result.trim();
    }

    // your existing code

    // STEP 1 DATA
    document.getElementById("courseTitle").textContent = course.title;
    document.getElementById("courseDescription").textContent =
      course.description;

    document.getElementById("courseInstructor").textContent = course.instructor;

    document.getElementById("courseLanguage").textContent =
      "Language: " + course.language;

    document.getElementById("coursePrice").textContent = "₹" + course.price;

    document.getElementById("courseOriginalPrice").textContent =
      "₹" + course.originalPrice;

    document.getElementById("courseThumbnail").src = course.thumbnail;

    console.log("Thumbnail:", course.thumbnail);

    // STEP 2 DATA
    function getEmbedUrl(url) {
      if (!url) return "";

      // watch?v=
      if (url.includes("watch?v=")) {
        const id = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
      }

      // youtu.be
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }

      return "";
    }

    const demoContainer = document.getElementById("demoVideoContainer");

    if (course.demoVideo) {
      const embedUrl = getEmbedUrl(course.demoVideo);
      console.log("Embed URL:", embedUrl);

      demoContainer.innerHTML = `
    <iframe 
      width="100%" 
      height="300"
      src="${embedUrl}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
    }

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
    const totalDuration = calculateTotalDuration(course.modules || []);

    console.log("Modules:", course.modules);

    if (totalDuration) {
      const li = document.createElement("li");
      li.innerHTML = `
      <div class="includesBox">
     <i class="ph ph-video link-icon"></i>
    <span>${totalDuration} on-demand Videos</span>
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
      totalDuration || "N/A";

    document.querySelectorAll(".courseDuration").forEach((el) => {
      el.textContent = totalDuration || "N/A";
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
<div class="module-header">
   <div class="module-box">
    <div class="module-icon-box">
     <i class="ph ph-book-open link-icon"></i>
     <span class="module-title-preview">${module.title}</span>
    </div>
     <i class="ph ph-caret-down arrow link-icon"></i>
   </div>
   <div class="module-lessons hidden"></div>
  </div>
`;

      const header = moduleDiv.querySelector(".module-header");
      const lessons = moduleDiv.querySelector(".module-lessons");
      const arrow = moduleDiv.querySelector(".arrow");

      header.addEventListener("click", () => {
        // 🔴 Close all modules first
        document.querySelectorAll(".module-lessons").forEach((el) => {
          el.classList.add("hidden");
        });

        document.querySelectorAll(".arrow").forEach((el) => {
          el.classList.remove("rotate");
        });

        // 🟢 Open current module
        lessons.classList.remove("hidden");
        arrow.classList.add("rotate");
      });

      const lessonsContainer = moduleDiv.querySelector(".module-lessons");

      module.lessons.forEach((lesson) => {
        const lessonDiv = document.createElement("div");

        lessonDiv.className = "preview-lesson";

        lessonDiv.innerHTML = `
    <div class="lesson-row">
      <i class="ph ph-play-circle link-icon"></i>
      <span class="lesson-title-preview">${lesson.title}</span>
    </div>
    <div class="lesson-links">
     ${lesson.video ? `<a href="${lesson.video}" target="_blank">Watch Video</a>` : ""}
     ${
       lesson.file
         ? `<a href="${lesson.file}" target="_blank" rel="noopener noreferrer">Download</a>`
         : ""
     }
     <div class="duration-box">
      <i class="ph ph-clock link-icon"></i>
      <span class="lessonDurationDisplay"></span>
     </div>
    </div>
`;

        const durationEl = lessonDiv.querySelector(".lessonDurationDisplay");

        if (durationEl) {
          durationEl.textContent = lesson.duration || "";
        }

        lessonsContainer.appendChild(lessonDiv);
      });

      modulesContainer.appendChild(moduleDiv);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load course");
  }
});

// Publish Course

document.getElementById("publishCourse").addEventListener("click", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  await fetch(`/publish-course/${courseId}`, {
    method: "PUT",
  });

  alert("Course published");

  window.location.href = "/admin-dashboard";
});

// ===========================
// BACK BUTTON
// ===========================

const backBtn = document.getElementById("backToModules");

if (backBtn) {
  backBtn.addEventListener("click", function () {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    window.location.href = `/course-modules?id=${courseId}&t=${Date.now()}`;
  });
}

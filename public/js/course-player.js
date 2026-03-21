function getEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("watch?v=")) {
    const id = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  return "";
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId || courseId === "null") return;

  const res = await fetch(`/course/${courseId}`);
  const course = await res.json();

  if (!course.modules) return;

  renderModules(course.modules);

  if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
    loadLesson(course.modules[0].lessons[0]);
  }
});

function renderModules(modules) {
  const container = document.getElementById("moduleList");

  container.innerHTML = "";

  modules.forEach((module, mIndex) => {
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

    // ✅ Open only the module of first lesson (initial load)
    if (mIndex === 0) {
      lessons.classList.remove("hidden");
      arrow.classList.add("rotate");
    }

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

    module.lessons.forEach((lesson, lIndex) => {
      const lessonDiv = document.createElement("div");

      // 🔥 Set first lesson active on load
      lessonDiv.className = "preview-lesson";

      // 🔥 Set first lesson active on load
      if (mIndex === 0 && lIndex === 0) {
        lessonDiv.classList.add("active");
      }

      lessonDiv.innerHTML = `
    <div class="lesson-row">
      <i class="ph ph-play-circle link-icon"></i>
      <span class="lesson-title-preview">${lesson.title}</span>
    </div>
    <div class="lesson-links">
     ${lesson.file ? `<a href="/uploads/${lesson.file}" target="_blank">Download</a>` : ""}
    </div>
      `;

      lessonDiv.addEventListener("click", (e) => {
        e.stopPropagation(); // 🔥 prevents accordion closing

        document.querySelectorAll(".preview-lesson").forEach((el) => {
          el.classList.remove("active");
        });

        lessonDiv.classList.add("active");

        loadLesson(lesson);
      });
      lessonsContainer.appendChild(lessonDiv);
    });

    container.appendChild(moduleDiv);
  });
}

function loadLesson(lesson) {
  const videoPlayer = document.getElementById("videoPlayer");
  const lessonTitle = document.getElementById("lessonTitle");
  const downloadLink = document.getElementById("downloadLink");

  const embedUrl = getEmbedUrl(lesson.video);

  videoPlayer.src = embedUrl;

  if (!embedUrl) {
    lessonTitle.textContent = "Video not supported";
  } else {
    lessonTitle.textContent = lesson.title || "";
  }

  if (lesson.file) {
    downloadLink.href = `/uploads/${lesson.file}`;
    downloadLink.textContent = "Download Resource";
  } else {
    downloadLink.textContent = "";
    downloadLink.removeAttribute("href");
  }
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

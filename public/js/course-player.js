let playerReady = false;
let dataReady = false;
let firstLesson = null;

let player;
let currentLessonId = null;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("videoPlayer", {
    height: "500",
    width: "100%",
    videoId: "",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerReady() {
  playerReady = true;
  tryLoadFirstLesson();
}

function playNextLesson() {
  const allLessons = document.querySelectorAll(".preview-lesson");

  let nextFound = false;

  allLessons.forEach((lessonEl, index) => {
    if (lessonEl.classList.contains("active")) {
      const nextLesson = allLessons[index + 1];

      if (nextLesson) {
        nextLesson.click(); // 🔥 triggers loadLesson
        nextFound = true;
      }
    }
  });

  if (!nextFound) {
    console.log("No next lesson");
  }
}

function showNextLessonButton() {
  const btn = document.createElement("button");
  btn.textContent = "Play Next Lesson ▶";

  btn.style.position = "absolute";
  btn.style.top = "50%";
  btn.style.left = "50%";
  btn.style.transform = "translate(-50%, -50%)";
  btn.style.zIndex = "999";

  btn.onclick = () => {
    playNextLesson();
    btn.remove();
  };

  document.getElementById("videoPlayer").appendChild(btn);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    markLessonComplete(); // ✅ REAL completion
    showNextLessonButton(); // 👈 add this
  }
}

function extractYouTubeId(url) {
  if (!url) return "";

  if (url.includes("watch?v=")) {
    return url.split("v=")[1].split("&")[0];
  }

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  return "";
}

function getEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("watch?v=")) {
    const id = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  return "";
}

function tryLoadFirstLesson() {
  if (playerReady && dataReady && firstLesson) {
    loadLesson(firstLesson);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId || courseId === "null") return;

  const res = await fetch(`/course/${courseId}`);
  const course = await res.json();

  if (!course.modules) return;

  const courseTitleEl = document.getElementById("courseTitle");

  if (courseTitleEl) {
    courseTitleEl.textContent = course.title || "";
  }

  renderModules(course.modules);
  setTimeout(loadProgress, 300);

  // ✅ store lesson
  firstLesson = course.modules[0]?.lessons[0];
  dataReady = true;

  tryLoadFirstLesson();
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

      lessonDiv.setAttribute("data-lesson-id", lesson._id || lesson.title);

      lessonDiv.innerHTML = `
  <div class="lesson-row">
    <input type="checkbox" class="lesson-checkbox" />
    <i class="ph ph-play-circle link-icon"></i>
    <span class="lesson-title-preview">${lesson.title}</span>
  </div>
  <div class="lesson-links">
    ${lesson.file ? `<a href="${lesson.file}" target="_blank">Download</a>` : ""}
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
  currentLessonId = lesson._id || lesson.title;

  const lessonTitle = document.getElementById("lessonTitle");
  const downloadLink = document.getElementById("downloadLink");
  const lessonDescription = document.getElementById("lessonDescription");
  const lessonDuration = document.querySelector(".lessonDurationDisplay");

  const videoId = extractYouTubeId(lesson.video);

  console.log("VIDEO URL:", lesson.video);
  console.log("VIDEO ID:", videoId);

  if (!lesson) return;

  if (!videoId) {
    console.warn("Invalid video URL");
    return; // ⛔ STOP execution
  }

  if (!playerReady || !player) {
    console.warn("Player not ready yet");
    return; // ⛔ STOP execution
  }

  player.loadVideoById(videoId);

  if (lessonDuration) {
    lessonDuration.textContent = lesson.duration || "";
  }

  if (lessonTitle) {
    lessonTitle.textContent = videoId
      ? lesson.title + " Key Takeaway"
      : "Video not supported";
  }

  if (lessonDescription) {
    lessonDescription.textContent = lesson.description || "";
  }

  if (downloadLink) {
    if (lesson.file) {
      downloadLink.href = lesson.file;
      downloadLink.textContent = "Download Resource";
    } else {
      downloadLink.textContent = "";
      downloadLink.removeAttribute("href");
    }
  }
}
function markLessonComplete() {
  if (!currentLessonId) return;

  // Check checkbox
  const lessonEl = document.querySelector(
    `[data-lesson-id="${currentLessonId}"]`,
  );

  if (lessonEl) {
    const checkbox = lessonEl.querySelector(".lesson-checkbox");
    if (checkbox) checkbox.checked = true;
  }

  saveProgress(currentLessonId);
}

function saveProgress(lessonId) {
  let progress = JSON.parse(localStorage.getItem("courseProgress")) || [];

  if (!progress.includes(lessonId)) {
    progress.push(lessonId);
  }

  localStorage.setItem("courseProgress", JSON.stringify(progress));
}

function loadProgress() {
  const progress = JSON.parse(localStorage.getItem("courseProgress")) || [];

  progress.forEach((lessonId) => {
    const lessonEl = document.querySelector(`[data-lesson-id="${lessonId}"]`);

    if (lessonEl) {
      const checkbox = lessonEl.querySelector(".lesson-checkbox");
      if (checkbox) checkbox.checked = true;
    }
  });
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

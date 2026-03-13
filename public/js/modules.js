const modulesContainer = document.getElementById("modulesContainer");

// ===========================
// ADD LESSON
// ===========================

document.addEventListener("click", function (e) {
  const addBtn = e.target.closest(".addLesson");

  if (!addBtn) return;

  const module = addBtn.closest(".module");
  const lessonsContainer = module.querySelector(".lessonsContainer");

  const lessonDiv = document.createElement("div");
  lessonDiv.className = "lesson-field";

  lessonDiv.innerHTML = `
    
    <div class="icon-input-field lesson-input">
      <i class="ph ph-monitor-play link-icon"></i>

      <input
        class="user-input-field with-icon lesson-title"
        type="text"
        placeholder="Enter lesson title"
      />

      <div class="lesson-resources">
        <span class="video-indicator hidden">🎥</span>
        <span class="doc-indicator hidden">📄</span>
      </div>

      <i class="ph ph-x delete-lesson"></i>
    </div>

    <button class="btn btn--secondary lessonLinkBtn" type="button">
      <i class="ph ph-link"></i>
    </button>

`;

  lessonsContainer.appendChild(lessonDiv);
});

// DELETE LESSON
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-lesson")) {
    const lesson = e.target.closest(".lesson-field");
    lesson.remove();
  }
});

// ===========================
// OPEN LESSON MODAL
// ===========================

let activeLesson = null;

document.addEventListener("click", function (e) {
  const linkBtn = e.target.closest(".lessonLinkBtn");

  if (!linkBtn) return;

  activeLesson = linkBtn.closest(".lesson-field");

  const modal = document.getElementById("lessonModal");
  const videoInput = document.getElementById("lessonVideoLink");
  const documentInput = document.getElementById("lessonDocument");

  // Load previously saved video link
  if (videoInput) {
    videoInput.value = activeLesson.dataset.video || "";
  }

  const uploadedDoc = document.getElementById("uploadedDocumentName");

  if (uploadedDoc) {
    if (activeLesson.dataset.file) {
      uploadedDoc.innerHTML = `<a href="/uploads/${activeLesson.dataset.file}" target="_blank">
        ${activeLesson.dataset.file}
      </a>`;
    } else {
      uploadedDoc.innerHTML = "";
    }
  }

  // File inputs cannot be prefilled
  if (documentInput) {
    documentInput.value = "";
  }

  if (modal) {
    modal.classList.remove("hidden");
  }
});

// ===========================
// CLOSE MODAL
// ===========================

const closeModal = document.getElementById("closeLessonModal");

if (closeModal) {
  closeModal.addEventListener("click", function () {
    const modal = document.getElementById("lessonModal");

    if (modal) {
      modal.classList.add("hidden");
    }
  });
}

// ===========================
// SAVE LESSON RESOURCES
// ===========================

const saveLessonResources = document.getElementById("saveLessonResources");

if (saveLessonResources) {
  saveLessonResources.addEventListener("click", async function () {
    const videoLink = document.getElementById("lessonVideoLink").value;
    const documentFile = document.getElementById("lessonDocument").files[0];

    if (!activeLesson) return;

    activeLesson.dataset.video = videoLink;

    if (documentFile) {
      try {
        const formData = new FormData();
        formData.append("document", documentFile);

        const res = await fetch("/upload-document", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        activeLesson.dataset.file = data.file;

        document.getElementById("uploadedDocumentName").textContent =
          "Uploaded file: " + data.file;
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    const linkBtn = activeLesson.querySelector(".lessonLinkBtn");

    if (videoLink || activeLesson.dataset.file) {
      linkBtn.classList.add("lesson-linked");
    }

    // show indicators
    const videoIcon = activeLesson.querySelector(".video-indicator");
    const docIcon = activeLesson.querySelector(".doc-indicator");

    if (videoIcon) {
      videoIcon.classList.toggle("hidden", !videoLink);
    }

    if (docIcon) {
      docIcon.classList.toggle("hidden", !activeLesson.dataset.file);
    }

    document.getElementById("lessonModal").classList.add("hidden");
  });
}

// ADD MODULE
document.getElementById("addModule").addEventListener("click", function () {
  const moduleDiv = document.createElement("div");

  moduleDiv.className = "module";

  moduleDiv.innerHTML = `

             <div class="icon-input-field module-input">
                <i class="ph ph-book-open link-icon"></i>
                <input
                  class="user-input-field with-icon"
                  type="text"
                  placeholder="Enter module title"
                />

                <i class="ph ph-x delete-module"></i>
              </div>

              <div class="divider"></div>

              <div class="lessonsContainer">
                <div class="lesson-field">
                  <div class="icon-input-field lesson-input">
                    <i class="ph ph-monitor-play link-icon"></i>
                    <input
                      class="user-input-field with-icon lesson-title"
                      type="text"
                      placeholder="Enter lesson title"
                    />
                  </div>

                  <div class="lesson-resources">
                    <span class="video-indicator hidden">🎥</span>
                    <span class="doc-indicator hidden">📄</span>
                  </div>

                  <button
                    class="btn btn--secondary lessonLinkBtn"
                    type="button"
                  >
                    <i class="ph ph-link"></i>
                  </button>
                </div>
              </div>

              <button class="addLesson small-btn" type="button">
                <i class="ph ph-plus icon"></i><span>Add Lesson</span>
              </button>

  `;

  modulesContainer.appendChild(moduleDiv);
});

// DELETE MODULE
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-module")) {
    const module = e.target.closest(".module");
    module.remove();
  }
});

// ===========================
// PREVIEW COURSE
// ===========================

const previewBtn = document.getElementById("previewCourse");

if (previewBtn) {
  previewBtn.addEventListener("click", async function () {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    const modules = [];

    document.querySelectorAll(".module").forEach((module) => {
      const moduleTitle = module.querySelector(".module-input input").value;

      const lessons = [];

      module.querySelectorAll(".lesson-field").forEach((lesson) => {
        lessons.push({
          title: lesson.querySelector(".lesson-title").value,
          video: lesson.dataset.video || "",
          file: lesson.dataset.file || "",
        });
      });

      modules.push({
        title: moduleTitle,
        lessons: lessons,
      });
    });

    await fetch(`/save-modules/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modules }),
    });

    window.location.href = `course-preview.html?id=${courseId}`;
  });
}

// ===========================
// LOAD MODULES
// ===========================

document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId) return;

  try {
    const res = await fetch(`/get-modules/${courseId}`);
    const data = await res.json();

    if (!data.success) return;

    if (data.modules.length === 0) return;

    modulesContainer.innerHTML = "";

    data.modules.forEach((module) => {
      const moduleDiv = document.createElement("div");
      moduleDiv.className = "module";

      moduleDiv.innerHTML = `
        <div class="icon-input-field module-input">
          <i class="ph ph-book-open link-icon"></i>
          <input class="user-input-field with-icon"
                 type="text"
                 value="${module.title || ""}"
                 placeholder="Enter module title">

          <i class="ph ph-x delete-module"></i>
        </div>

        <div class="divider"></div>

        <div class="lessonsContainer"></div>

        <button class="addLesson small-btn">
          <i class="ph ph-plus icon"></i><span>Add Lesson</span>
        </button>
      `;

      const lessonsContainer = moduleDiv.querySelector(".lessonsContainer");

      module.lessons.forEach((lesson, index) => {
        const lessonDiv = document.createElement("div");
        lessonDiv.className = "lesson-field";

        lessonDiv.dataset.video = lesson.video ? lesson.video : "";
        lessonDiv.dataset.file = lesson.file ? lesson.file : "";

        lessonDiv.innerHTML = `
  <div class="icon-input-field lesson-input">
    <i class="ph ph-monitor-play link-icon"></i>

    <input class="user-input-field with-icon lesson-title"
           type="text"
           value="${lesson.title || ""}"
           placeholder="Enter lesson title">

    <div class="lesson-resources">
      <span class="video-indicator hidden">🎥</span>
      <span class="doc-indicator hidden">📄</span>
    </div>

    ${index !== 0 ? `<i class="ph ph-x delete-lesson"></i>` : ""}
  </div>

  <button class="btn btn--secondary lessonLinkBtn" type="button">
    <i class="ph ph-link"></i>
  </button>
`;

        if (lesson.video || lesson.file) {
          const btn = lessonDiv.querySelector(".lessonLinkBtn");
          btn.classList.add("lesson-linked");

          const videoIcon = lessonDiv.querySelector(".video-indicator");
          const docIcon = lessonDiv.querySelector(".doc-indicator");

          if (lesson.video && videoIcon) {
            videoIcon.classList.remove("hidden");
          }

          if (lesson.file && docIcon) {
            docIcon.classList.remove("hidden");
          }

          if (lesson.file) {
            btn.title = "Document uploaded: " + lesson.file;
          }
        }

        lessonsContainer.appendChild(lessonDiv);
      });

      modulesContainer.appendChild(moduleDiv);
    });
  } catch (err) {
    console.error("Error loading modules", err);
  }
});

// ===========================
// BACK BUTTON
// ===========================

const backBtn = document.getElementById("backModules");

if (backBtn) {
  backBtn.addEventListener("click", function () {
    const params = new URLSearchParams(window.location.search);

    const courseId = params.get("id");

    window.location.href = `add-course-details.html?id=${courseId}`;
  });
}

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, delay);
  };
}

async function autoSaveModules() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId) return;

  const modules = [];

  document.querySelectorAll(".module").forEach((module) => {
    const moduleTitle = module.querySelector(".module-input input").value;

    const lessons = [];

    module.querySelectorAll(".lesson-field").forEach((lesson) => {
      lessons.push({
        title: lesson.querySelector(".lesson-title").value,
        video: lesson.dataset.video || "",
        file: lesson.dataset.file || "",
      });
    });

    modules.push({
      title: moduleTitle,
      lessons: lessons,
    });
  });

  try {
    await fetch(`/save-modules/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modules }),
    });

    console.log("Auto-saved modules");
  } catch (err) {
    console.error("Auto-save failed", err);
  }
}

document.addEventListener("input", debounce(autoSaveModules, 2000));

document.addEventListener("change", debounce(autoSaveModules, 2000));

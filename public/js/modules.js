let loadingModules = true;
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

  lessonDiv.dataset.video = "";
  lessonDiv.dataset.file = "";
  lessonDiv.dataset.description = "";
  lessonDiv.dataset.duration = "";

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

  const descriptionInput = document.getElementById("lessonDescription");

  const durationInput = document.getElementById("lessonDuration");

  if (durationInput) {
    durationInput.value = activeLesson.dataset.duration || "";
  }

  if (descriptionInput) {
    descriptionInput.value = activeLesson.dataset.description || "";
  }

  // Load previously saved video link
  if (videoInput) {
    videoInput.value = activeLesson.dataset.video || "";
  }

  const uploadedDoc = document.getElementById("uploadedDocumentName");

  if (uploadedDoc) {
    if (activeLesson.dataset.file) {
      const fileName = activeLesson.dataset.file.split("/").pop();

      uploadedDoc.innerHTML = `<a href="${activeLesson.dataset.file}" target="_blank">
  ${fileName}
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
    const description = document.getElementById("lessonDescription").value;
    const duration = document.getElementById("lessonDuration").value;

    if (!activeLesson) return;

    activeLesson.dataset.video = videoLink;
    activeLesson.dataset.description = description;
    activeLesson.dataset.duration = duration;

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

        const fileName = data.file.split("/").pop();

        document.getElementById("uploadedDocumentName").textContent =
          "Uploaded file: " + fileName;
      } catch (err) {
        console.error("Upload failed:", err);
      }
    } else {
      // keep existing file if user did not upload a new one
      activeLesson.dataset.file = activeLesson.dataset.file || "";
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

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    console.log("COURSE ID:", courseId);

    const modules = [];

    document.querySelectorAll(".module").forEach((module) => {
      const moduleTitle = module.querySelector(".module-input input").value;

      const lessons = [];

      module.querySelectorAll(".lesson-field").forEach((lesson) => {
        lessons.push({
          title: lesson.querySelector(".lesson-title").value,
          video: lesson.dataset.video || "",
          file: lesson.dataset.file || "",
          description: lesson.dataset.description || "",
          duration: lesson.dataset.duration || "",
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

  const lesson = moduleDiv.querySelector(".lesson-field");
  lesson.dataset.video = "";
  lesson.dataset.file = "";
  lesson.dataset.description = "";
  lesson.dataset.duration = "";
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

    // 🔥 AUTO SAVE CURRENT MODAL DATA BEFORE PREVIEW
    if (activeLesson) {
      const durationInput = document.getElementById("lessonDuration");
      const descriptionInput = document.getElementById("lessonDescription");
      const videoInput = document.getElementById("lessonVideoLink");

      if (durationInput) {
        activeLesson.dataset.duration = durationInput.value;
      }

      if (descriptionInput) {
        activeLesson.dataset.description = descriptionInput.value;
      }

      if (videoInput) {
        activeLesson.dataset.video = videoInput.value;
      }
    }

    if (!courseId) {
      alert("Course ID missing");
      return;
    }

    const modules = [];

    document.querySelectorAll(".module").forEach((module) => {
      const moduleTitle = module.querySelector(".module-input input").value;

      const lessons = [];

      module.querySelectorAll(".lesson-field").forEach((lesson) => {
        lessons.push({
          title: lesson.querySelector(".lesson-title").value,
          video: lesson.dataset.video || "",
          file: lesson.dataset.file || "",
          description: lesson.dataset.description || "",
          duration: lesson.dataset.duration || "",
        });
      });

      modules.push({
        title: moduleTitle,
        lessons: lessons,
      });
    });

    // 🔥 SAVE BEFORE NAVIGATION
    await fetch(`/save-modules/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modules }),
    });

    // ✅ THEN NAVIGATE
    window.location.href = `/course-preview?id=${courseId}`;
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
    await new Promise((resolve) => setTimeout(resolve, 300));

    const res = await fetch(`/get-modules/${courseId}`);
    const data = await res.json();

    if (!data.success) return;

    if (data.modules.length === 0) return;

    modulesContainer.innerHTML = "";

    data.modules.forEach((module, index) => {
      const moduleDiv = document.createElement("div");
      moduleDiv.className = "module";

      moduleDiv.innerHTML = `
        <div class="icon-input-field module-input">
          <i class="ph ph-book-open link-icon"></i>
          <input class="user-input-field with-icon"
                 type="text"
                 value="${module.title || ""}"
                 placeholder="Enter module title">

          ${index !== 0 ? `<i class="ph ph-x delete-module"></i>` : ""}
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
        lessonDiv.dataset.description = lesson.description || "";
        lessonDiv.dataset.duration = lesson.duration || "";

        console.log("Loaded modules:", data.modules);

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

        lessonDiv.dataset.video = lesson.video || "";
        lessonDiv.dataset.file = lesson.file || "";
        lessonDiv.dataset.description = lesson.description || "";
        lessonDiv.dataset.duration = lesson.duration || "";

        const btn = lessonDiv.querySelector(".lessonLinkBtn");
        const videoIcon = lessonDiv.querySelector(".video-indicator");
        const docIcon = lessonDiv.querySelector(".doc-indicator");

        // Restore button state
        if (lesson.video || lesson.file) {
          btn.classList.add("lesson-linked");
        } else {
          btn.classList.remove("lesson-linked");
        }

        // Restore icons
        if (lesson.video && videoIcon) {
          videoIcon.classList.remove("hidden");
        } else if (videoIcon) {
          videoIcon.classList.add("hidden");
        }

        if (lesson.file && docIcon) {
          docIcon.classList.remove("hidden");
        } else if (docIcon) {
          docIcon.classList.add("hidden");
        }

        // Restore document tooltip
        if (lesson.file) {
          btn.title = "Document uploaded: " + lesson.file;
        }
        lessonsContainer.appendChild(lessonDiv);
      });

      modulesContainer.appendChild(moduleDiv);
    });

    loadingModules = false;
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

    window.location.href = `/add-course-details?id=${courseId}`;
  });
}

// Auto-Save Modules

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
  if (loadingModules) return;

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
        description: lesson.dataset.description || "",
        duration: lesson.dataset.duration || "",
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

// const debouncedSave = debounce(autoSaveModules, 500);

// document.addEventListener("input", debouncedSave);

// document.addEventListener("change", function (e) {
//   if (e.target.type === "file") return;
//   debouncedSave();
// });

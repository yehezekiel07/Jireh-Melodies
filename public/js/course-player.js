document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  const res = await fetch(`/course/${courseId}`);
  const course = await res.json();

  renderModules(course.modules);
});

function renderModules(modules) {
  const container = document.getElementById("moduleList");

  container.innerHTML = "";

  modules.forEach((module, mIndex) => {
    const moduleDiv = document.createElement("div");

    moduleDiv.innerHTML = `
      <h3>${module.title}</h3>
    `;

    module.lessons.forEach((lesson, lIndex) => {
      const lessonDiv = document.createElement("div");

      lessonDiv.innerHTML = `
        <p class="lesson-item">
          ${lesson.title}
        </p>
      `;

      lessonDiv.addEventListener("click", () => {
        loadLesson(lesson);
      });

      moduleDiv.appendChild(lessonDiv);
    });

    container.appendChild(moduleDiv);
  });
}

function loadLesson(lesson) {
  const videoPlayer = document.getElementById("videoPlayer");
  const lessonTitle = document.getElementById("lessonTitle");
  const downloadLink = document.getElementById("downloadLink");

  // YouTube embed conversion
  let videoUrl = lesson.videoLink;

  if (videoUrl.includes("watch?v=")) {
    videoUrl = videoUrl.replace("watch?v=", "embed/");
  }

  videoPlayer.src = videoUrl;

  lessonTitle.textContent = lesson.title;

  if (lesson.document) {
    downloadLink.href = `/uploads/${lesson.document}`;
    downloadLink.textContent = "Download Resource";
  } else {
    downloadLink.textContent = "";
  }
}

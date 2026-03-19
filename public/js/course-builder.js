// Draft Add Course Step -1

const nextBasic = document.getElementById("nextBasic");

if (nextBasic) {
  nextBasic.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    const formData = new FormData();

    formData.append("title", document.getElementById("courseTitle").value);
    formData.append(
      "instructor",
      document.getElementById("courseInstructor").value,
    );
    formData.append(
      "language",
      document.getElementById("courseLanguage").value,
    );
    formData.append(
      "description",
      document.getElementById("courseDescription").value,
    );
    formData.append("price", document.getElementById("coursePrice").value);
    formData.append(
      "originalPrice",
      document.getElementById("courseOriginalPrice").value,
    );

    const thumbInput = document.getElementById("thumbnailName");

    if (thumbInput && thumbInput.value) {
      formData.append("thumbnailName", thumbInput.value);
    }

    const imageInput = document.getElementById("courseImage");

    if (imageInput && imageInput.files.length > 0) {
      formData.append("image", imageInput.files[0]);
    }

    let nextId = courseId;

    try {
      if (courseId) {
        const res = await fetch(`/update-course-basic/${courseId}`, {
          method: "PUT",
          body: formData,
        });

        const data = await res.json();

        if (!data.success) {
          alert("Failed to update course");
          return;
        }
      } else {
        const response = await fetch("/create-course-draft", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          alert("Failed to create course");
          return;
        }

        nextId = data.courseId;
      }

      // redirect only after success
      window.location.href = `add-course-details.html?id=${nextId}`;
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Server error");
    }
  });
}

// Load saved data when step-1 opens (this is for card preview)

function updatePreview(course) {
  const previewTitle = document.getElementById("previewTitle");
  const previewInstructor = document.getElementById("previewInstructor");
  const previewLanguage = document.getElementById("previewLanguage");
  const previewDescription = document.getElementById("previewDescription");
  const previewPrice = document.getElementById("previewPrice");
  const previewOldPrice = document.getElementById("previewOldPrice");

  if (previewTitle) previewTitle.textContent = course.title || "Course Title";
  if (previewInstructor)
    previewInstructor.textContent = course.instructor || "Instructor";
  if (previewLanguage)
    previewLanguage.textContent = course.language || "Language";
  if (previewDescription)
    previewDescription.textContent = course.description || "Course description";

  if (previewPrice)
    previewPrice.textContent = course.price ? "₹" + course.price : "₹0";

  if (previewOldPrice)
    previewOldPrice.textContent = course.originalPrice
      ? "₹" + course.originalPrice
      : "₹0";
}

// Load saved data when step-1 opens

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId || courseId === "null") return;

  try {
    const response = await fetch(`/get-course/${courseId}`);

    if (!response.ok) {
      console.error("Failed to fetch course");
      return;
    }

    const course = await response.json();

    /* ---------- STEP 1 RESTORE ---------- */

    console.log("Course loaded:", course);

    updatePreview(course);

    console.log("Course Data:", course);
    console.log("Thumbnail:", course.thumbnail);

    // restore thumbnail name when coming back
    const thumbInput = document.getElementById("thumbnailName");

    if (thumbInput && course.thumbnail) {
      thumbInput.value = course.thumbnail;
    }

    const title = document.getElementById("courseTitle");
    const instructor = document.getElementById("courseInstructor");
    const language = document.getElementById("courseLanguage");
    const description = document.getElementById("courseDescription");
    const price = document.getElementById("coursePrice");
    const originalPrice = document.getElementById("courseOriginalPrice");

    if (title) title.value = course.title || "";
    if (instructor) instructor.value = course.instructor || "";
    if (language) language.value = course.language || "";
    if (description) description.value = course.description || "";
    if (price) price.value = course.price || "";
    if (originalPrice) originalPrice.value = course.originalPrice || "";

    const preview = document.getElementById("previewImage");
    const fileName = document.getElementById("file-name");

    if (preview) {
      if (course.thumbnail) {
        preview.src = `/uploads/${course.thumbnail}`;
        console.log("Setting preview image:", `/uploads/${course.thumbnail}`);
      } else {
        preview.src = "img/course-placeholder.png";
      }
    }

    if (fileName && course.thumbnail) {
      fileName.textContent = course.thumbnail;
    }

    /* ---------- STEP 2 RESTORE ---------- */

    // Restore learn points

    const learnContainer = document.getElementById("learnContainer");

    if (learnContainer && course.learnPoints && course.learnPoints.length) {
      const inputs = learnContainer.querySelectorAll("input");

      // fill first default input
      if (inputs[0]) {
        inputs[0].value = course.learnPoints[0] || "";
      }

      // add remaining inputs dynamically
      for (let i = 1; i < course.learnPoints.length; i++) {
        const div = document.createElement("div");
        div.className = "icon-input-field";

        div.innerHTML = `
      <i class="ph ph-check link-icon"></i>
      <input class="user-input-field with-icon" type="text" value="${course.learnPoints[i]}">
      <i class="ph ph-x delete-point"></i>
    `;

        learnContainer.appendChild(div);
      }
    }

    // Restore requirements

    const reqContainer = document.getElementById("requirementsContainer");

    if (reqContainer && course.requirements && course.requirements.length) {
      const inputs = reqContainer.querySelectorAll("input");

      if (inputs[0]) {
        inputs[0].value = course.requirements[0] || "";
      }

      for (let i = 1; i < course.requirements.length; i++) {
        const div = document.createElement("div");
        div.className = "icon-input-field";

        div.innerHTML = `
      <i class="ph ph-dot-outline link-icon"></i>
      <input class="user-input-field with-icon" type="text" value="${course.requirements[i]}">
      <i class="ph ph-x delete-point"></i>
    `;

        reqContainer.appendChild(div);
      }
    }

    // Restore preview points

    const previewContainer = document.getElementById("previewPointsContainer");

    if (
      previewContainer &&
      course.previewPoints &&
      course.previewPoints.length
    ) {
      const inputs = previewContainer.querySelectorAll("input");

      if (inputs[0]) {
        inputs[0].value = course.previewPoints[0] || "";
      }

      for (let i = 1; i < course.previewPoints.length; i++) {
        const div = document.createElement("div");
        div.className = "icon-input-field";

        div.innerHTML = `
      <i class="ph ph-dot-outline link-icon"></i>
      <input class="user-input-field with-icon" type="text" value="${course.previewPoints[i]}">
      <i class="ph ph-x delete-point"></i>
    `;

        previewContainer.appendChild(div);
      }
    }

    if (course.duration)
      document.getElementById("courseDuration").value = course.duration;

    if (course.downloadItems)
      document.getElementById("downloadItems").value = course.downloadItems;

    if (course.mobileAccess !== undefined)
      document.getElementById("mobileAccess").checked = course.mobileAccess;

    if (course.certificate !== undefined)
      document.getElementById("certificate").checked = course.certificate;
  } catch (err) {
    console.error("Error loading course:", err);
  }
});

// Add New Inputs Dynamically

function setupDynamicInputs(buttonId, containerId, iconClass, placeholder) {
  const button = document.getElementById(buttonId);
  const container = document.getElementById(containerId);

  if (!button || !container) return;

  button.addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "icon-input-field";

    div.innerHTML = `
      <i class="${iconClass} link-icon"></i>

      <input
        class="user-input-field with-icon"
        type="text"
        placeholder="${placeholder}"
      />

      <i class="ph ph-x delete-point"></i>
    `;

    container.appendChild(div);
  });
}

setupDynamicInputs(
  "addLearn",
  "learnContainer",
  "ph ph-check",
  "Enter learning point",
);

setupDynamicInputs(
  "addRequirement",
  "requirementsContainer",
  "ph ph-dot-outline",
  "Enter requirement",
);

setupDynamicInputs(
  "addPreviewPoint",
  "previewPointsContainer",
  "ph ph-dot-outline",
  "Enter preview point",
);

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-point")) {
    const parent = e.target.parentElement;
    const container = parent.parentElement;

    if (container.children.length > 1) {
      parent.remove();
    }
  }
});

// Going back to the add course basic details page

const backBtn = document.getElementById("backStep");

if (backBtn) {
  backBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    const learnPoints = [...document.querySelectorAll("#learnContainer input")]
      .map((i) => i.value)
      .filter((v) => v.trim() !== "");

    const requirements = [
      ...document.querySelectorAll("#requirementsContainer input"),
    ]
      .map((i) => i.value)
      .filter((v) => v.trim() !== "");

    const previewPoints = [
      ...document.querySelectorAll("#previewPointsContainer input"),
    ]
      .map((i) => i.value)
      .filter((v) => v.trim() !== "");

    await fetch(`/update-course-details/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learnPoints,
        requirements,
        previewPoints,
        duration: document.getElementById("courseDuration")?.value,
        downloadItems: document.getElementById("downloadItems")?.value,
        mobileAccess: document.getElementById("mobileAccess")?.checked,
        certificate: document.getElementById("certificate")?.checked,
      }),
    });

    window.location.href = `add-course.html?id=${courseId}`;
  });
}

// Saving and going next to Step-3

const nextDetails = document.getElementById("nextStep");

if (nextDetails) {
  nextDetails.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    const learnPoints = [...document.querySelectorAll("#learnContainer input")]
      .map((i) => i.value)
      .filter((v) => v.trim() !== "");

    const requirements = [
      ...document.querySelectorAll("#requirementsContainer input"),
    ]
      .map((i) => i.value)
      .filter((v) => v.trim() !== "");

    const previewPoints = [
      ...document.querySelectorAll("#previewPointsContainer input"),
    ]
      .map((i) => i.value)
      .filter((v) => v.trim() !== "");

    const response = await fetch(`/update-course-details/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        learnPoints,
        requirements,
        previewPoints,
        duration: document.getElementById("courseDuration").value,
        downloadItems: document.getElementById("downloadItems").value,
        mobileAccess: document.getElementById("mobileAccess").checked,
        certificate: document.getElementById("certificate").checked,
      }),
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = `course-modules.html?id=${courseId}`;
    }
  });
}

"use strict";

const mainNavList = document.querySelectorAll(".main-nav-list-item");
mainNavList.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < mainNavList.length; i++) {
      mainNavList[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

const faqQuestionBox = document.querySelectorAll(".faq-question-box");
faqQuestionBox.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < faqQuestionBox.length; i++) {
      faqQuestionBox[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

// Login Functionality

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      if (data.role === "admin") {
        window.location.href = "/admin-dashboard.html";
      } else {
        window.location.href = "/user-dashboard.html";
      }
    } else {
      alert("Invalid login credentials");
    }
  });
}

// Generate User Credentials Functionality (New)

const generateBtn = document.getElementById("generateBtn");

if (generateBtn && window.location.pathname.includes("add-user.html")) {
  let generated = false;

  generateBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    if (!generated) {
      const fullname = document.getElementById("fullname").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      if (fullname === "") {
        alert("Please enter Full Name before generating credentials");
        return;
      }

      if (phone === "") {
        alert("Please enter Phone Number before generating credentials");
        return;
      }

      if (email === "") {
        alert("Please enter Email Address before generating credentials");
        return;
      }

      const response = await fetch("/generate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, phone, email }),
      });

      const data = await response.json();

      document.getElementById("username").value = data.username;
      document.getElementById("password").value = data.password;

      document.getElementById("credentialsSection").style.display = "flex";

      generateBtn.textContent = "Save";

      generated = true;
    } else {
      const fullname = document.getElementById("fullname").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const response = await fetch("/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, phone, email, username, password }),
      });

      const data = await response.json();

      // Save Functionality

      if (data.success) {
        alert("User created successfully");

        window.location.href = "/admin-dashboard.html";
      } else {
        alert("Error saving user");
      }
    }
  });
}

// User Table Creation

const usersTable = document.getElementById("usersTable");

if (usersTable) {
  fetch("/users")
    .then((res) => res.json())
    .then((data) => {
      usersTable.innerHTML = "";

      data.forEach((user) => {
        const row = `
         <tr>
           <td>${user.fullname}</td>
           <td>${user.phone}</td>
           <td>${user.email}</td>
           <td>${user.username}</td>
           <td class="action-links">
            <a class="action-link" href="/view-user.html?id=${user._id}">
              <i class="ph ph-eye link-icon"></i>
            </a>

            <a class="action-link" href="/edit-user.html?id=${user._id}">
             <i class="ph ph-pencil-simple link-icon"></i>
            </a>
           </td>
         </tr>
`;

        usersTable.innerHTML += row;
      });
    })
    .catch((error) => console.log(error));
}

// Load user Data

if (window.location.pathname.includes("view-user.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(`/user/${id}`)
    .then((res) => res.json())
    .then((user) => {
      document.getElementById("fullname").value = user.fullname;
      document.getElementById("phone").value = user.phone;
      document.getElementById("email").value = user.email;
      document.getElementById("username").value = user.username;
      document.getElementById("password").value = user.password;
    });
}

// User Details (Pre-filled) for Updating User

if (window.location.pathname.includes("edit-user.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(`/user/${id}`)
    .then((res) => res.json())
    .then((user) => {
      document.getElementById("fullname").value = user.fullname;
      document.getElementById("phone").value = user.phone;
      document.getElementById("email").value = user.email;
      document.getElementById("username").value = user.username;
      document.getElementById("password").value = user.password;
    });
}

// Generate Cred For Updating User

if (generateBtn && window.location.pathname.includes("edit-user.html")) {
  let generated = false;

  generateBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (!generated) {
      const response = await fetch("/generate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, phone, email }),
      });

      const data = await response.json();

      document.getElementById("username").value = data.username;
      document.getElementById("password").value = data.password;

      generateBtn.textContent = "Update";

      generated = true;
    } else {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const response = await fetch(`/update-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          phone,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("User updated successfully");

        window.location.href = "/admin-dashboard.html";
      } else {
        alert("Error updating user");
      }
    }
  });
}

// Delete User Functionality

const deleteBtn = document.getElementById("deleteUser");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    await fetch(`/delete-user/${id}`, {
      method: "DELETE",
    });

    alert("User deleted successfully");

    window.location.href = "/admin-dashboard.html";
  });
}

// Course Related Code //

// Load Courses in Dashboard

const coursesContainer = document.getElementById("coursesContainer");

if (coursesContainer) {
  fetch("/courses")
    .then((res) => res.json())
    .then((data) => {
      coursesContainer.innerHTML = "";

      data.forEach((course) => {
        const card = `
            <div class="course-card">

                <h3>${course.title}</h3>
                <p>${course.description}</p>

                <p>₹${course.price}</p>

                <button>Edit</button>

            </div>
            `;

        coursesContainer.innerHTML += card;
      });
    });
}

// Live Preview of Course Details (Card)

const titleInput = document.getElementById("courseTitle");
const instructorInput = document.getElementById("courseInstructor");
const languageInput = document.getElementById("courseLanguage");
const priceInput = document.getElementById("coursePrice");
const oldPriceInput = document.getElementById("courseOriginalPrice");
const descriptionInput = document.getElementById("courseDescription");

if (titleInput) {
  titleInput.addEventListener("input", () => {
    document.getElementById("previewTitle").textContent = titleInput.value;
  });
}

if (instructorInput) {
  instructorInput.addEventListener("input", () => {
    document.getElementById("previewInstructor").textContent =
      instructorInput.value;
  });
}

if (languageInput) {
  languageInput.addEventListener("input", () => {
    document.getElementById("previewLanguage").textContent =
      languageInput.value;
  });
}

if (priceInput) {
  priceInput.addEventListener("input", () => {
    document.getElementById("previewPrice").textContent =
      "₹" + priceInput.value;
  });
}

if (oldPriceInput) {
  oldPriceInput.addEventListener("input", () => {
    document.getElementById("previewOldPrice").textContent =
      "₹" + oldPriceInput.value;
  });
}

if (descriptionInput) {
  descriptionInput.addEventListener("input", () => {
    document.getElementById("previewDescription").textContent =
      descriptionInput.value;
  });
}

// Live Preview of course image

const courseImageInput = document.getElementById("courseImage");

if (courseImageInput) {
  courseImageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        document.getElementById("previewImage").src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  });
}

// Draft Add Course Step -1

const nextBasic = document.getElementById("nextBasic");

if (nextBasic) {
  nextBasic.addEventListener("click", async () => {
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

    const image = document.getElementById("courseImage").files[0];

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch("/create-course-draft", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = `add-course-details.html?id=${data.courseId}`;
    }
  });
}
// Load saved data when step-1 opens

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  if (!courseId || courseId === "null") return;

  const response = await fetch(`/get-course/${courseId}`);
  const course = await response.json();

  document.getElementById("courseTitle").value = course.title || "";
  document.getElementById("courseInstructor").value = course.instructor || "";
  document.getElementById("courseLanguage").value = course.language || "";
  document.getElementById("courseDescription").value = course.description || "";
  document.getElementById("coursePrice").value = course.price || "";
  document.getElementById("courseOriginalPrice").value =
    course.originalPrice || "";

  if (course.thumbnail) {
    document.getElementById("previewImage").src =
      `/uploads/${course.thumbnail}`;
    document.getElementById("file-name").textContent = course.thumbnail;
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
  backBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    if (!courseId) {
      window.location.href = "add-course.html";
      return;
    }

    window.location.href = `add-course.html?id=${courseId}`;
  });
}
// Saving and going next to Step-3

const nextDetails = document.getElementById("nextStep");

if (nextDetails) {
  nextDetails.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    // collect inputs

    const learnPoints = [
      ...document.querySelectorAll("#learnContainer input"),
    ].map((i) => i.value);

    const requirements = [
      ...document.querySelectorAll("#requirementsContainer input"),
    ].map((i) => i.value);

    const previewPoints = [
      ...document.querySelectorAll("#previewPointsContainer input"),
    ].map((i) => i.value);

    const duration = document.getElementById("courseDuration").value;
    const downloadItems = document.getElementById("downloadItems").value;
    const mobileAccess = document.getElementById("mobileAccess").checked;
    const certificate = document.getElementById("certificate").checked;

    await fetch(`/update-course-details/${courseId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        learnPoints,
        requirements,
        previewPoints,
        duration,
        downloadItems,
        mobileAccess,
        certificate,
      }),
    });

    window.location.href = `course-modules.html?id=${courseId}`;
  });
}

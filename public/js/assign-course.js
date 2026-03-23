// ===========================
// LOAD USERS + COURSES
// ===========================

let users = [];
let courses = [];

async function loadData() {
  // load users
  const userRes = await fetch("/users");
  users = await userRes.json();

  // load courses
  const courseRes = await fetch("/get-courses");
  const courseData = await courseRes.json();

  if (courseData.success) {
    courses = courseData.courses;
  }

  populateDropdowns();
}

// ===========================
// POPULATE DROPDOWNS
// ===========================

function populateDropdowns() {
  const userDropdown = document.getElementById("userDropdown");

  userDropdown.innerHTML = "";

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user._id;
    option.textContent = user.fullname;

    userDropdown.appendChild(option);
  });

  const courseList = document.getElementById("courseList");

  courseList.innerHTML = "";

  courses.forEach((course) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <label>
      <input type="checkbox" value="${course._id}" class="courseCheckbox"/>
      ${course.title}
    </label>
  `;

    courseList.appendChild(div);
  });
}

// ===========================
// ASSIGN COURSE
// ===========================

document.getElementById("assignBtn").addEventListener("click", async () => {
  const userId = document.getElementById("userDropdown").value;
  const checkboxes = document.querySelectorAll(".courseCheckbox:checked");

  const courseIds = Array.from(checkboxes).map((cb) => cb.value);

  console.log("USER ID:", userId);
  console.log("COURSE ID:", courseIds);

  const res = await fetch("/assign-course", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseIds }),
  });

  const data = await res.json();

  console.log("RESPONSE:", data);

  if (data.success) {
    alert("Course assigned successfully!");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Error assigning course");
  }
});

// ===========================
// INIT
// ===========================

document.addEventListener("DOMContentLoaded", loadData);

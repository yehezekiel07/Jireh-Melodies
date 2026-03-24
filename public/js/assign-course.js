// ===========================
// LOAD USERS + COURSES
// ===========================

let users = [];
let courses = [];

async function loadData() {
  try {
    const userRes = await fetch("/users");

    if (!userRes.ok) throw new Error("Users fetch failed");

    users = await userRes.json();

    const courseRes = await fetch("/get-courses");

    if (!courseRes.ok) throw new Error("Courses fetch failed");

    const courseData = await courseRes.json();

    if (courseData.success) {
      courses = courseData.courses;
    }

    populateDropdowns();
  } catch (err) {
    console.error(err);
    alert("Failed to load users or courses");
  }
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
  try {
    const userId = document.getElementById("userDropdown").value;
    const checkboxes = document.querySelectorAll(".courseCheckbox:checked");

    const courseIds = Array.from(checkboxes).map((cb) => cb.value);

    const res = await fetch("/assign-course", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseIds }),
    });

    if (!res.ok) throw new Error("Assign failed");

    const data = await res.json();

    if (data.success) {
      alert("Course assigned successfully!");
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Error assigning course");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});

// ===========================
// INIT
// ===========================

document.addEventListener("DOMContentLoaded", loadData);

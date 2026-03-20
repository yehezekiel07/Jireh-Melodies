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
  const courseDropdown = document.getElementById("courseDropdown");

  userDropdown.innerHTML = "";
  courseDropdown.innerHTML = "";

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user._id;
    option.textContent = user.fullname;

    userDropdown.appendChild(option);
  });

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course._id;
    option.textContent = course.title;

    courseDropdown.appendChild(option);
  });
}

// ===========================
// ASSIGN COURSE
// ===========================

document.getElementById("assignBtn").addEventListener("click", async () => {
  const userId = document.getElementById("userDropdown").value;
  const courseId = document.getElementById("courseDropdown").value;

  console.log("USER ID:", userId);
  console.log("COURSE ID:", courseId);

  const res = await fetch("/assign-course", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseId }),
  });

  const data = await res.json();

  console.log("RESPONSE:", data);

  if (data.success) {
    alert("Course assigned successfully!");
  } else {
    alert("Error assigning course");
  }
});

// ===========================
// INIT
// ===========================

loadData();

console.log(users);
console.log(courses);

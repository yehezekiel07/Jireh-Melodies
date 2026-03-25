// Load user Data

if (window.location.pathname.includes("/view-user")) {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("id");

  // fallback if missing
  if (!id) {
    id = localStorage.getItem("viewUserId");
  } else {
    localStorage.setItem("viewUserId", id);
  }

  //Assigned Courses
  async function loadAssignedCourses() {
    const res = await fetch(`/user-courses/${id}`);
    const data = await res.json();

    const container = document.getElementById("assignedCourses");

    container.innerHTML = "";

    if (!data.courses || data.courses.length === 0) {
      container.innerHTML = "<p>No courses assigned</p>";
      return;
    }

    data.courses.forEach((course) => {
      const div = document.createElement("div");

      div.className = "assigned-course";

      div.innerHTML = `
      <div class="assigned-course-box">
       <i class="ph ph-dot-outline link-icon"></i>
       <span>${course.title}</span>
      </div>
      <button class="removeCourse" data-id="${course._id}"><i class="ph ph-trash link-icon"></i>
      </button>

    `;

      container.appendChild(div);
    });
  }

  // User Details

  async function loadUserDetails() {
    if (!id) {
      console.log("No user ID found ❌");
      return;
    }
    const res = await fetch(`/user/${id}`);
    const user = await res.json();

    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (fullname) fullname.value = user.fullname || "";
    if (phone) phone.value = user.phone || "";
    if (email) email.value = user.email || "";
    if (username) username.value = user.username || "";
    if (password) password.value = "********";
  }
  loadAssignedCourses();
  loadUserDetails();

  // Remove Assigned Course

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".removeCourse");

    if (!btn) return;

    const courseId = btn.dataset.id;

    const confirmDelete = confirm("Remove this course?");
    if (!confirmDelete) return;

    const res = await fetch("/remove-course", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        courseId,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Error removing course");
      return;
    }

    setTimeout(() => {
      loadAssignedCourses();
      loadUserDetails();
    }, 200);
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

    window.location.href = "/admin-dashboard";
  });
}

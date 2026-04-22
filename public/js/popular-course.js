async function loadCourses() {
  const res = await fetch("/get-courses");
  const data = await res.json();

  const container = document.getElementById("courseList");

  data.courses.forEach((course) => {
    container.innerHTML += `
      <div class="course-check">
      <input 
  type="checkbox" 
  value="${course._id}" 
  ${course.isPopular ? "checked" : ""}
/>
      <p class="pop-title">${course.title}</p>
      </div>
    `;
  });
}

loadCourses();

document.addEventListener("change", function (e) {
  if (e.target.type === "checkbox") {
    const checked = document.querySelectorAll("input[type='checkbox']:checked");

    const allCheckboxes = document.querySelectorAll("input[type='checkbox']");

    if (checked.length >= 3) {
      allCheckboxes.forEach((cb) => {
        if (!cb.checked) {
          cb.disabled = true;
        }
      });
    } else {
      allCheckboxes.forEach((cb) => {
        cb.disabled = false;
      });
    }
  }
});

async function savePopular() {
  const selected = [];

  document.querySelectorAll("input[type='checkbox']:checked").forEach((el) => {
    selected.push(el.value);
  });

  if (selected.length !== 3) {
    alert("Select exactly 3 courses");
    return;
  }

  await fetch("/set-popular-courses", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseIds: selected }),
  });

  alert("Saved successfully");
  window.location.href = "/all-courses";
}

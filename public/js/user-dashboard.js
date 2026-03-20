document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.log("No userId found");
    return;
  }

  const res = await fetch(`/user-courses/${userId}`);
  const data = await res.json();

  const container = document.getElementById("myCourses");

  if (!container) {
    console.log("Container missing");
    return;
  }

  container.innerHTML = "";

  data.courses.forEach((course) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="/uploads/${course.thumbnail}" width="200"/>
      <h3>${course.title}</h3>
    `;

    container.appendChild(div);
  });
});

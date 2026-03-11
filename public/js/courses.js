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

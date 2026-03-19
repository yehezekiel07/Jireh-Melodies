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

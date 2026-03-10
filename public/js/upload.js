const fileInput = document.getElementById("courseImage");
const fileName = document.getElementById("file-name");

fileInput.addEventListener("change", async function () {
  const file = this.files[0];

  if (!file) return;

  fileName.textContent = file.name;

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();

    img.src = event.target.result;

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxWidth = 800;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        async function (blob) {
          const formData = new FormData();
          formData.append("image", blob, file.name);

          await fetch("/upload-image", {
            method: "POST",
            body: formData,
          });

          console.log("Image uploaded");
        },
        "image/jpeg",
        0.7,
      );
    };
  };

  reader.readAsDataURL(file);
});

const sharp = require("sharp");
const path = require("path");

const input = path.join(__dirname, "../public/img/hero-img.png");
const output = path.join(__dirname, "../public/img/hero-img.webp");

sharp(input)
  .webp({
    quality: 85,
  })
  .toFile(output)
  .then((info) => {
    console.log("✅ Hero image converted successfully!");
    console.log("Output:", output);
    console.log("Size:", info.size, "bytes");
    console.log("Size:", (info.size / 1024 / 1024).toFixed(2), "MB");
  })
  .catch((err) => {
    console.error("❌ Image conversion failed:");
    console.error(err);
  });

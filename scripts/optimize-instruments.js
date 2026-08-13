const sharp = require("sharp");
const path = require("path");

const imgDir = path.join(__dirname, "../public/img");

const instruments = [
  "instrument-1.png",
  "instrument-2.png",
  "instrument-3.png",
  "instrument-4.png",
  "instrument-5.png",
  "instrument-6.png",
  "instrument-7.png",
  "instrument-8.png",
  "instrument-9.png",
];

async function optimizeImages() {
  for (const filename of instruments) {
    const input = path.join(imgDir, filename);
    const output = path.join(imgDir, filename.replace(".png", ".webp"));

    try {
      const info = await sharp(input)
        .webp({
          quality: 85,
        })
        .toFile(output);

      console.log(`✅ ${filename}`);
      console.log(`   → ${(info.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.error(`❌ Failed: ${filename}`);
      console.error(error.message);
    }
  }

  console.log("\n🎉 Instrument image optimization completed.");
}

optimizeImages();

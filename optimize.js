const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const srcDir = "src/img";
const distDir = "dist/img";

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

let optimizedCount = 0;
let copiedCount = 0;

fs.readdirSync(srcDir).forEach(file => {
  const inputPath = path.join(srcDir, file);
  const outputPath = path.join(distDir, file);

  if (/\.(jpe?g|png)$/i.test(file)) {
    sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true }) // ограничение ширины
      .jpeg({ quality: 75 }) // сохраняем в JPEG c 75%
      .toFile(outputPath.replace(/\.(png|jpg|jpeg)$/i, ".jpg"))
      .then(() => {
        optimizedCount++;
        console.log(`✔ Optimized: ${file}`);
      })
      .catch(err => console.error(`Error: ${file}`, err));
  } else if (/\.webp$/i.test(file)) {
    sharp(inputPath)
      .webp({ quality: 75 })
      .toFile(outputPath)
      .then(() => {
        optimizedCount++;
        console.log(`✔ Optimized WebP: ${file}`);
      })
      .catch(err => console.error(`Error: ${file}`, err));
  } else {
    fs.copyFileSync(inputPath, outputPath);
    copiedCount++;
    console.log(`→ Copied without changes: ${file}`);
  }
});

process.on("exit", () => {
  console.log(`\n📊 Итог: оптимизировано ${optimizedCount}, скопировано без изменений ${copiedCount}`);
});
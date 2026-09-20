// check-images.js
import fs from "fs";
import path from "path";

// Configuración
const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const exts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];

// 1. Recolectar todas las rutas de imágenes referenciadas en el código fuente
function collectImageReferences(dir) {
  const refs = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      refs.push(...collectImageReferences(filePath));
    } else if (/\.(astro|jsx|tsx|html|js|ts)$/.test(entry.name)) {
      const content = fs.readFileSync(filePath, "utf8");
      const matches = content.matchAll(/src=["']([^"']+\.(?:png|jpe?g|webp|svg|gif))["']/gi);
      for (const match of matches) {
        refs.push(match[1]);
      }
    }
  }
  return refs;
}

// 2. Listar todas las imágenes reales en /public
function listPublicImages(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(listPublicImages(fullPath));
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

// 3. Comparar referencias vs archivos reales
function checkImages() {
  console.log("🔍 Analizando imágenes...");

  const refs = collectImageReferences(path.join(projectRoot, "src"));
  const images = listPublicImages(publicDir);

  const notFound = refs.filter(
    ref => !images.some(img => img.endsWith(ref.replace(/^\/+/, "").replace(/\//g, path.sep)))
  );

  const unused = images.filter(
    img => !refs.some(ref => img.endsWith(ref.replace(/^\/+/, "").replace(/\//g, path.sep)))
  );

  console.log("\n📂 Imágenes referenciadas:", refs.length);
  console.log("📂 Imágenes en /public:", images.length);

  if (notFound.length) {
    console.log("\n❌ Imágenes referenciadas pero no encontradas:");
    notFound.forEach(f => console.log(" -", f));
  } else {
    console.log("\n✅ Todas las rutas de imágenes referenciadas existen.");
  }

  if (unused.length) {
    console.log("\n⚠️ Imágenes en /public que no se usan:");
    unused.forEach(f => console.log(" -", path.relative(publicDir, f)));
  }
}

checkImages();

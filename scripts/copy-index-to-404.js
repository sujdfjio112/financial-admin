// scripts/copy-index-to-404.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.copyFileSync(
  path.join(__dirname, "../dist/index.html"),
  path.join(__dirname, "../dist/404.html")
);

console.log("✅ 404.html 已从 index.html 复制完成");

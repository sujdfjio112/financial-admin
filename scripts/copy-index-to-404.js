// scripts/copy-index-to-404.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.join(projectRoot, "dist");

// helper: normalize base like '/financial-admin/' -> 'financial-admin'
function normalizeBase(b) {
  if (!b) return "";
  return b.replace(/^\/+|\/+$/g, "");
}

// recursive search (prefer root index.html)
function findIndexHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // 1) check current dir
  for (const e of entries) {
    if (e.isFile() && e.name.toLowerCase() === "index.html") {
      return path.join(dir, e.name);
    }
  }

  // 2) search subdirs in stable alphabetical order
  const dirs = entries.filter((e) => e.isDirectory()).map((d) => d.name).sort();
  for (const d of dirs) {
    const found = findIndexHtml(path.join(dir, d));
    if (found) return found;
  }
  return null;
}

try {
  if (!fs.existsSync(distRoot) || !fs.statSync(distRoot).isDirectory()) {
    console.error(`❌ dist 目录不存在: ${distRoot}`);
    process.exit(1);
  }

  // 优先：如果 CLI 传 base 参数则优先按该子目录查找
  const cliBase = normalizeBase(process.argv[2]); // e.g. '/financial-admin/' 或 'financial-admin'
  let indexPath = null;

  if (cliBase) {
    const candidate = path.join(distRoot, cliBase, "index.html");
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      indexPath = candidate;
    } else {
      console.warn(`⚠️ 通过 CLI 指定的 base 未找到 index.html: ${candidate}`);
    }
  }

  // 第二优先：直接 dist/index.html
  if (!indexPath) {
    const rootIndex = path.join(distRoot, "index.html");
    if (fs.existsSync(rootIndex) && fs.statSync(rootIndex).isFile()) {
      indexPath = rootIndex;
    }
  }

  // 第三优先：递归查找 dist 下第一个 index.html
  if (!indexPath) {
    indexPath = findIndexHtml(distRoot);
  }

  if (!indexPath) {
    console.error(`❌ 在 ${distRoot} 下未找到 index.html。请检查你的 Vite build 输出（或传入 base 参数）。`);
    process.exit(2);
  }

  const indexDir = path.dirname(indexPath);
  const dest404 = path.join(indexDir, "404.html");

  fs.copyFileSync(indexPath, dest404);
  console.log(`✅ 已复制:\n  ${indexPath}\n→ ${dest404}`);
  process.exit(0);
} catch (err) {
  console.error("❌ 复制失败：", err);
  process.exit(3);
}

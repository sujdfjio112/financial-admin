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

// 添加重定向逻辑到 HTML
function addRedirectLogic(htmlContent, basePath = '') {
  const redirectScript = `
<!-- SPA Redirect Script for GitHub Pages -->
<script>
  // 保存原始路径并重定向到首页
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    
    if (redirect && redirect !== location.pathname) {
      history.replaceState(null, null, redirect);
    }
    
    // 如果是 404 页面，设置重定向
    if (location.pathname !== '${basePath}/' && location.pathname !== '${basePath}/index.html') {
      sessionStorage.redirect = location.pathname;
      window.location.replace('${basePath}/');
    }
  })();
</script>
`;

  // 在 head 标签结束前插入脚本
  return htmlContent.replace('</head>', redirectScript + '</head>');
}

try {
  if (!fs.existsSync(distRoot) || !fs.statSync(distRoot).isDirectory()) {
    console.error(`❌ dist 目录不存在: ${distRoot}`);
    process.exit(1);
  }

  const cliBase = normalizeBase(process.argv[2]);
  let indexPath = path.join(distRoot, "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error(`❌ 未找到 index.html: ${indexPath}`);
    process.exit(2);
  }

  // 读取 index.html 内容
  const indexHtmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // 添加重定向逻辑
  const basePath = cliBase ? `/${cliBase}` : '';
  const htmlWithRedirect = addRedirectLogic(indexHtmlContent, basePath);
  
  // 写入 404.html
  const dest404 = path.join(distRoot, "404.html");
  fs.writeFileSync(dest404, htmlWithRedirect);
  
  console.log(`✅ 已复制并添加重定向逻辑:\n  ${indexPath}\n→ ${dest404}`);
  process.exit(0);
} catch (err) {
  console.error("❌ 复制失败：", err);
  process.exit(3);
}
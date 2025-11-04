// scripts/copy-index-to-404.js
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const indexFile = path.join(distDir, 'index.html');
const notFoundFile = path.join(distDir, '404.html');

if (!fs.existsSync(indexFile)) {
  console.error('build output not found! run build first.');
  process.exit(1);
}

fs.copyFileSync(indexFile, notFoundFile);
console.log('Copied index.html -> 404.html');

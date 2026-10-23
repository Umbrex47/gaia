import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found! Ensure build runs first.');
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, 'utf8');

// Also write 404.html
fs.writeFileSync(path.join(distDir, '404.html'), html);

const routes = [
  'auth/callback',
  'tienda',
  'planes',
  'nosotros',
  'blog',
  'contacto',
  'login',
  'registro',
  'simulador',
];

for (const route of routes) {
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  console.log(`Generated static fallback for /${route}`);
}

console.log('All SPA static routes generated successfully.');

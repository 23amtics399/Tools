import fs from 'fs';
import path from 'path';

const activeTools = [
  '/image/compress',
  '/image/resize',
  '/image/crop',
  '/image/jpg-to-png',
  '/image/png-to-jpg',
  '/image/webp-converter',
  '/image/image-to-pdf',
  '/pdf/pdf-to-image'
];

const categoryRoutes = [
  '/',
  '/image',
  '/pdf',
  '/tools'
];

const domain = 'https://tools.sji.one';
const currentDate = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryRoutes.map(route => `  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${activeTools.map(route => `  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent.trim());
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent.trim());

console.log('Successfully generated sitemap.xml and robots.txt');

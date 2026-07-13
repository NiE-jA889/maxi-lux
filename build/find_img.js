const fs = require('fs');
const html = fs.readFileSync('galeria.html', 'utf8');
const urls = [];
const regex = /<img[^>]+src=["']([^"']+)["']/g;
let match;
while ((match = regex.exec(html)) !== null) {
  urls.push(match[1]);
}
console.log(urls.slice(0, 15).join('\n'));

const fs = require('fs');
const cheerio = require('cheerio');

let html = fs.readFileSync('galeria.html', 'utf8');
const $ = cheerio.load(html);

const galleryContainer = $('.avia-gallery');
if (galleryContainer.length > 0) {
  const images = [];
  galleryContainer.find('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.match(/\.(jpg|jpeg|png|webp)$/i)) {
      images.push(href);
    }
  });

  // Build the new gallery HTML
  let newGallery = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 w-full">';
  images.forEach(img => {
    newGallery += `
      <div class="overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-coal aspect-square relative group">
        <img src="${img}" alt="Realizacja Maxi-Lux" loading="lazy" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
        <div class="absolute inset-0 bg-blue/0 group-hover:bg-blue/20 transition-colors duration-500 pointer-events-none"></div>
      </div>
    `;
  });
  newGallery += '</div>';

  galleryContainer.replaceWith(newGallery);

  fs.writeFileSync('galeria.html', $.html());
  console.log('Gallery successfully rebuilt with Tailwind grid! Found ' + images.length + ' images.');
} else {
  console.log('Could not find .avia-gallery in galeria.html.');
}

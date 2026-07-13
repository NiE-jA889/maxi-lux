const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const uslugiDir = './uslugi';
const files = fs.readdirSync(uslugiDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(uslugiDir, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  const contentArea = $('section .bg-coal');
  const originalImages = contentArea.find('img');

  if (originalImages.length > 0) {
    // Create a mini grid container
    const grid = $('<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12 pt-12 border-t border-white/10"></div>');
    const imageUrls = [];
    const uniqueImages = new Set();

    originalImages.each((i, el) => {
      let src = $(el).attr('data-lazy-src') || $(el).attr('src');
      if (!src || src.startsWith('data:image/svg')) return; // ignore pure SVG placeholders if no lazy-src
      
      let fullSrc = src;
      const parentA = $(el).closest('a');
      if (parentA.length > 0 && parentA.attr('href') && parentA.attr('href').match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        fullSrc = parentA.attr('href');
        if(fullSrc.startsWith('/')) fullSrc = 'https://maxi-lux.pl' + fullSrc;
      } else {
         fullSrc = src.replace(/-\d+x\d+\.(jpg|jpeg|png|webp|gif)$/i, '.$1');
      }

      if (uniqueImages.has(fullSrc)) return;
      uniqueImages.add(fullSrc);

      imageUrls.push(fullSrc);
      const index = imageUrls.length - 1;

      const wrapper = $('<div class="aspect-square overflow-hidden rounded-xl border border-white/10 hover:border-amber transition-colors shadow-lg"></div>');
      const imgElement = $('<img>').attr('src', src)
        .addClass('w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500 gallery-img')
        .attr('data-index', index);
      
      wrapper.append(imgElement);
      grid.append(wrapper);
    });

    // Remove all old images and their wrappers
    contentArea.find('.avia-gallery, .avia-image-container').remove();
    contentArea.find('img').remove();
    contentArea.find('a').filter((i, el) => $(el).attr('href') && $(el).attr('href').match(/\.(jpg|jpeg|png|webp|gif)$/i)).remove();
    
    // Add a title for the mini gallery if there are images
    if (imageUrls.length > 0) {
      grid.removeClass('mt-12 pt-12 border-t').addClass('mb-12 pb-12 border-b');
      grid.prepend('<div class="col-span-full mb-2"><h3 class="serif text-3xl text-amber">Galeria z realizacji</h3></div>');
      contentArea.prepend(grid);
    }

    const lightboxHtml = `
    <!-- Lightbox Modal -->
    <div id="lightbox" class="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md hidden flex-col items-center justify-center opacity-0 transition-opacity duration-300">
      <button id="lightbox-close" class="absolute top-6 right-6 text-bone/50 hover:text-amber text-5xl leading-none transition-colors">&times;</button>
      
      <div class="relative w-full h-full flex items-center justify-center p-4 sm:p-12">
        <!-- Prev Button -->
        <button id="lightbox-prev" class="absolute left-2 sm:left-8 text-bone/30 hover:text-amber text-6xl transition-colors p-4 z-10 drop-shadow-xl">&#10094;</button>
        
        <!-- Image Container -->
        <div class="relative max-w-full max-h-full flex items-center justify-center">
          <div id="lightbox-loader" class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-white/10 border-t-amber rounded-full animate-spin"></div>
          </div>
          <img id="lightbox-img" class="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl relative z-10 transition-opacity duration-300 opacity-0" src="" alt="Gallery Image" onload="this.classList.remove('opacity-0'); document.getElementById('lightbox-loader').style.display='none';" />
        </div>
        
        <!-- Next Button -->
        <button id="lightbox-next" class="absolute right-2 sm:right-8 text-bone/30 hover:text-amber text-6xl transition-colors p-4 z-10 drop-shadow-xl">&#10095;</button>
      </div>
      
      <div id="lightbox-counter" class="absolute bottom-8 text-bone/50 font-serif tracking-widest text-lg"></div>
    </div>

    <script>
      const images = ${JSON.stringify(imageUrls)};
      let currentIndex = 0;
      
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const btnClose = document.getElementById('lightbox-close');
      const btnPrev = document.getElementById('lightbox-prev');
      const btnNext = document.getElementById('lightbox-next');
      const counter = document.getElementById('lightbox-counter');
      const loader = document.getElementById('lightbox-loader');
      
      function showImage(index) {
        if(index < 0) index = images.length - 1;
        if(index >= images.length) index = 0;
        currentIndex = index;
        
        lightboxImg.classList.add('opacity-0');
        loader.style.display = 'flex';
        
        lightboxImg.src = images[currentIndex];
        counter.textContent = (currentIndex + 1) + " / " + images.length;
      }
      
      function openLightbox(index) {
        showImage(index);
        lightbox.classList.remove('hidden');
        setTimeout(() => {
          lightbox.classList.remove('opacity-0');
          lightbox.classList.add('opacity-100');
        }, 10);
        document.body.style.overflow = 'hidden';
      }
      
      function closeLightbox() {
        lightbox.classList.remove('opacity-100');
        lightbox.classList.add('opacity-0');
        setTimeout(() => {
          lightbox.classList.add('hidden');
          lightboxImg.src = '';
        }, 300);
        document.body.style.overflow = '';
      }
      
      document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index'));
          openLightbox(idx);
        });
      });
      
      btnClose.addEventListener('click', closeLightbox);
      btnPrev.addEventListener('click', () => showImage(currentIndex - 1));
      btnNext.addEventListener('click', () => showImage(currentIndex + 1));
      
      document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      });
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || (e.target.parentElement === lightbox && e.target !== lightboxImg && e.target !== btnPrev && e.target !== btnNext)) {
          closeLightbox();
        }
      });
    </script>
    `;

    $('body').find('#lightbox').remove();
    $('body').find('script:contains("const images = [")').remove();
    if(imageUrls.length > 0) {
       $('body').append(lightboxHtml);
    }
    
    fs.writeFileSync(filePath, $.html());
    console.log(`${file} updated successfully with mini gallery.`);
  }
});

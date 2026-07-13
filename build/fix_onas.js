const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('o-nas.html', 'utf8');
const $ = cheerio.load(html);

// --- 1. FIX LOGOS SECTION ---
const partnerSection = $('h2').filter(function() {
  return $(this).text().trim() === 'Zaufali Maxi-Lux';
}).closest('.avia-section');

if (partnerSection.length > 0) {
  const originalImages = partnerSection.find('img');
  
  if (originalImages.length > 0) {
    const grid = $('<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-12 py-8 px-8 bg-white/5 rounded-3xl border border-white/10 items-center justify-items-center"></div>');
    const uniqueImages = new Set();

    originalImages.each((i, el) => {
      let src = $(el).attr('data-lazy-src') || $(el).attr('src');
      if (!src || src.startsWith('data:image/svg')) return;
      let fullSrc = src.replace(/-\d+x\d+\.(jpg|jpeg|png|webp|gif)$/i, '.$1');

      if (uniqueImages.has(fullSrc)) return;
      uniqueImages.add(fullSrc);

      const wrapper = $('<div class="w-full aspect-[3/2] flex items-center justify-center p-6 bg-white rounded-xl shadow-xl hover:-translate-y-1 transition-transform"></div>');
      // REMOVED grayscale! Logotypy są teraz kolorowe.
      const imgElement = $('<img>').attr('src', fullSrc).attr('alt', $(el).attr('alt') || 'Logo firmy')
        .addClass('max-w-full max-h-full object-contain filter hover:brightness-110 transition-all duration-300');
      
      wrapper.append(imgElement);
      grid.append(wrapper);
    });

    partnerSection.find('.avia-image-container').remove();
    partnerSection.find('img').remove();
    partnerSection.find('.flex_column_table, .flex_column').each((i, el) => {
      if ($(el).text().trim() === '' && $(el).find('img, iframe, h1, h2, h3, h4, h5, h6, p').length === 0) {
        $(el).remove();
      }
    });

    // We only want to append it once. If the script was run before, there might be a grid already.
    partnerSection.find('.grid').remove();
    partnerSection.find('.entry-content-wrapper').append(grid);
  }
}

// --- 2. FIX TESTIMONIALS SLIDER ---
const testWrapper = $('.avia-testimonial-wrapper');
if (testWrapper.length > 0) {
  const testimonials = [];
  
  testWrapper.find('.avia-testimonial').each((i, el) => {
    const text = $(el).find('.avia-testimonial-content').html() || '';
    const name = $(el).find('.avia-testimonial-name').text().trim() || '';
    const subtitle = $(el).find('.avia-testimonial-subtitle').text().trim() || '';
    // The image was messed up by advanced_scraper.js, grab the original or lazy src
    const imgEl = $(el).find('img');
    let imgSrc = imgEl.attr('data-lazy-src') || imgEl.attr('src') || '';
    // fallback if it's an SVG
    if(imgSrc.startsWith('data:image/svg') && imgEl.attr('data-lazy-src')) {
      imgSrc = imgEl.attr('data-lazy-src');
    }
    
    testimonials.push({ text, name, subtitle, imgSrc });
  });

  if (testimonials.length > 0) {
    let slidesHtml = '';
    testimonials.forEach((t, index) => {
      slidesHtml += `
      <div class="testimonial-slide absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center text-center px-4 md:px-20 ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}">
        <div class="text-xl md:text-2xl text-bone/90 italic mb-8 font-serif leading-relaxed max-w-3xl">
          ${t.text}
        </div>
        <div class="flex items-center gap-4 mt-4">
          ${t.imgSrc && !t.imgSrc.startsWith('data:image/svg') ? `<img src="${t.imgSrc}" alt="${t.name}" class="w-16 h-16 rounded-full border-2 border-amber object-cover" />` : `<div class="w-16 h-16 rounded-full bg-amber/20 border-2 border-amber flex items-center justify-center font-bold text-amber text-xl">${t.name.charAt(0)}</div>`}
          <div class="text-left">
            <div class="font-bold text-bone text-lg">${t.name}</div>
            <div class="text-sm text-bone/50">${t.subtitle}</div>
          </div>
        </div>
      </div>
      `;
    });

    const sliderHtml = `
    <div id="custom-testimonial-slider" class="relative w-full max-w-5xl mx-auto h-[400px] bg-coal border border-white/5 rounded-3xl overflow-hidden mt-12 shadow-2xl">
      <!-- Arrows -->
      <button onclick="nextTestimonial(-1)" class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-bone/30 hover:text-amber text-4xl md:text-6xl z-20 transition-colors focus:outline-none">&#10094;</button>
      <button onclick="nextTestimonial(1)" class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-bone/30 hover:text-amber text-4xl md:text-6xl z-20 transition-colors focus:outline-none">&#10095;</button>
      
      <!-- Slides -->
      <div class="relative w-full h-full">
        ${slidesHtml}
      </div>
    </div>
    <script>
      let currentTestimonial = 0;
      const slides = document.querySelectorAll('.testimonial-slide');
      
      function nextTestimonial(direction) {
        slides[currentTestimonial].classList.replace('opacity-100', 'opacity-0');
        slides[currentTestimonial].classList.replace('z-10', 'z-0');
        
        currentTestimonial += direction;
        if (currentTestimonial < 0) currentTestimonial = slides.length - 1;
        if (currentTestimonial >= slides.length) currentTestimonial = 0;
        
        slides[currentTestimonial].classList.replace('opacity-0', 'opacity-100');
        slides[currentTestimonial].classList.replace('z-0', 'z-10');
      }
      
      // Auto advance every 8 seconds
      setInterval(() => nextTestimonial(1), 8000);
    </script>
    `;

    // Replace the old wrapper with our new slider
    testWrapper.replaceWith(sliderHtml);
  }
}

fs.writeFileSync('o-nas.html', $.html());
console.log('o-nas.html updated successfully with slider and colored logos.');


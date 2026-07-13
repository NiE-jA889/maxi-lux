const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace service placeholder images with real ones
html = html.replace('assets/service1.jpg', 'https://maxi-lux.pl/wp-content/uploads/2022/02/Maxi-Lux-slider-1.jpg');
html = html.replace('assets/service2.jpg', 'https://maxi-lux.pl/wp-content/uploads/2024/03/przepychanie-rur-glowna-1500x430.webp');
html = html.replace('assets/service3.jpg', 'https://maxi-lux.pl/wp-content/uploads/2026/06/pojazd-wuko-maxi-lux-768x816-2.webp');

// 2. Add Google Maps iframe below the contact grid in the #kontakt section
const mapHTML = `
    <div class="mt-12 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue/5 h-[400px]">
      <iframe title="Lokalizacja firmy Maxi-Lux" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2449.9698162755!2d21.471223077185265!3d52.11667797195825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471f2b647f80891b%3A0xf12cd70fa696d011!2sMAXI-LUX%20%7C%20WUKO%20Pogotowie%20kanalizacyjne!5e0!3m2!1spl!2spl!4v1759231409172!5m2!1spl!2spl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>`;

html = html.replace('    </div>\n  </div>\n</section>', mapHTML);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully with real images and Google Maps.');

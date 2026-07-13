const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The hero container currently looks like:
// <div class="relative max-w-7xl mx-auto px-6 pt-48 md:pt-56 pb-24">
//   <div class="max-w-3xl">

// I need to change it to flex and add the badge on the right.
html = html.replace('<div class="relative max-w-7xl mx-auto px-6 pt-48 md:pt-56 pb-24">', '<div class="relative max-w-7xl mx-auto px-6 pt-48 md:pt-56 pb-24 flex flex-col md:flex-row justify-between items-center md:items-end">');

const badgeHTML = `
    <!-- 23 Years Badge -->
    <div class="hidden lg:flex relative items-center justify-center group mb-8 mr-12">
      <!-- Glow -->
      <div class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-[1.5] group-hover:bg-blue-400/30 transition-all duration-700"></div>
      
      <!-- Ribbons -->
      <div class="absolute -bottom-8 flex justify-center w-full z-0 gap-8">
        <div class="w-10 h-20 bg-gradient-to-b from-blue-700 to-blue-900 shadow-xl rotate-[20deg] transform origin-top translate-x-2" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);"></div>
        <div class="w-10 h-20 bg-gradient-to-b from-blue-700 to-blue-900 shadow-xl -rotate-[20deg] transform origin-top -translate-x-2" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);"></div>
      </div>

      <!-- Golden/Blue Medal -->
      <div class="relative z-10 w-44 h-44 rounded-full border border-blue-400/50 bg-gradient-to-br from-coal/90 to-ink/90 backdrop-blur-md shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] flex flex-col items-center justify-center transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
        <!-- Inner ring -->
        <div class="absolute inset-2 rounded-full border-2 border-dashed border-blue-400/30 animate-[spin_30s_linear_infinite]"></div>
        
        <!-- Stars -->
        <div class="flex items-center gap-1 mb-1 mt-2 text-blue-400">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <svg class="w-5 h-5 text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.8)]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
        </div>
        
        <div class="text-6xl font-bold serif text-transparent bg-clip-text bg-gradient-to-b from-blue-100 to-blue-400 leading-none drop-shadow-md">23</div>
        
        <div class="mt-2 text-[10px] uppercase tracking-[0.25em] font-semibold text-bone/70 text-center w-full relative">
          <svg width="100" height="24" viewBox="0 0 100 24" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-blue-400">
            <path id="curve" d="M 10 20 Q 50 5 90 20" fill="transparent" stroke="transparent" />
            <text fill="currentColor" font-size="12" font-weight="600" letter-spacing="2">
              <textPath href="#curve" startOffset="50%" text-anchor="middle">LAT NA RYNKU</textPath>
            </text>
          </svg>
          <div class="opacity-0">LAT NA RYNKU</div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

html = html.replace('      </div>\n    </div>\n  </div>\n</section>', '      </div>\n    </div>\n' + badgeHTML);

fs.writeFileSync('index.html', html);
console.log('Medal CSS added successfully to index.html');

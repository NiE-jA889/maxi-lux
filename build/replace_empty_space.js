const fs = require('fs');

const gridHtml = `
<!-- Services Grid -->
<section id="pelna-oferta" class="pt-8 pb-20 relative z-10">
  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <div class="text-center mb-12" data-aos="fade-up">
      <div class="text-xs uppercase tracking-[0.3em] text-blue mb-4">— Pełna oferta</div>
      <h2 class="serif text-4xl md:text-5xl leading-[0.95]">Nasze usługi specjalistyczne</h2>
    </div>
    
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <!-- 1 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="50">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2.25c-5.385 4.954-9 8.228-9 11.625 0 4.802 3.84 8.625 8.625 8.625h.75c4.785 0 8.625-3.823 8.625-8.625 0-3.397-3.615-6.671-9-11.625z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Opróżnianie zbiorników bezodpływowych</h3>
      </div>
      <!-- 2 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="100">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Wywóz osadów z przydomowych oczyszczalni</h3>
      </div>
      <!-- 3 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="150">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Czyszczenie kanalizacji</h3>
      </div>
      <!-- 4 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="200">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Czyszczenie separatorów tłuszczu</h3>
      </div>
      <!-- 5 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="250">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Czyszczenie przepompowni ścieków</h3>
      </div>
      <!-- 6 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="300">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Czyszczenie separatorów ropopochodnych</h3>
      </div>
      <!-- 7 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="350">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Serwis oraz przegląd separatorów</h3>
      </div>
      <!-- 8 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="400">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Mycie zbiorników wysokociśnieniowo</h3>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6 max-w-2xl mx-auto">
      <!-- 9 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="450">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Wywóz płuczki wiertniczej</h3>
      </div>
      <!-- 10 -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue hover:bg-blue/10 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="500">
        <div class="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center text-blue mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6v1.5H9v-1.5zm0 4.5h6v1.5H9v-1.5zm0 4.5h6v1.5H9v-1.5z"></path></svg>
        </div>
        <h3 class="font-medium text-bone text-sm md:text-base">Obsługa garaży podziemnych</h3>
      </div>
    </div>
  </div>
</section>
`;

let content = fs.readFileSync('index.html', 'utf8');

// The offending blue circle and the empty space it creates
const oldDiv = '<div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue/20 blur-3xl relative z-10"></div>';

// Replace it and inject the new section before the kontakt section
if (content.includes(oldDiv)) {
  content = content.replace(oldDiv, '');
  
  // Now inject the new section right before <section id="kontakt"...>
  const kontaktRegex = /<section id="kontakt"[^>]*>/;
  const match = content.match(kontaktRegex);
  if (match) {
    content = content.replace(match[0], gridHtml + '\n\n' + match[0]);
    fs.writeFileSync('index.html', content);
    console.log('Successfully replaced empty space with new services grid in index.html');
  } else {
    console.log('Could not find kontakt section to insert before.');
  }
} else {
  console.log('Could not find the exact blue circle div to remove.');
}

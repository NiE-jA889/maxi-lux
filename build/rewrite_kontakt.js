const fs = require('fs');

const html = fs.readFileSync('kontakt.html', 'utf8');

const headerEndIndex = html.indexOf('</header>') + '</header>'.length;
const footerStartIndex = html.indexOf('<!-- Footer -->');

if (headerEndIndex !== -1 && footerStartIndex !== -1) {
  const headHTML = html.substring(0, headerEndIndex);
  const footerHTML = html.substring(footerStartIndex);

  const newMainHTML = `
<!-- Main Content -->
<section class="py-24 bg-ink relative min-h-[100vh]">
  <div class="max-w-[1200px] mx-auto px-6 relative z-10">
    
    <div class="text-center mb-16" data-aos="fade-up">
      <h1 class="serif text-blue mb-6 text-5xl md:text-6xl font-bold drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">Kontakt</h1>
      <p class="text-bone/80 text-lg max-w-2xl mx-auto leading-relaxed">Masz awarię? Potrzebujesz wyceny? Napisz lub zadzwoń. Jesteśmy do Twojej dyspozycji 24/7!</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <!-- Contact Info -->
      <div class="lg:col-span-1 space-y-8" data-aos="fade-up" data-aos-delay="100">
        <div class="bg-coal/50 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
          <h3 class="text-xl font-bold text-bone mb-6">Szybki kontakt</h3>
          <div class="flex flex-col gap-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center text-blue shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <div class="text-sm text-bone/50 mb-1">Telefon (24/7)</div>
                <a href="tel:+48513412313" class="text-lg font-bold text-blue hover:text-blueSoft transition-colors">513 412 313</a>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center text-blue shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <div class="text-sm text-bone/50 mb-1">E-mail</div>
                <a href="mailto:biuro@maxi-lux.pl" class="text-lg font-bold text-bone hover:text-blue transition-colors">biuro@maxi-lux.pl</a>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center text-blue shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <div class="text-sm text-bone/50 mb-1">Adres siedziby</div>
                <div class="text-lg font-bold text-bone">ul. Wawrzyniecka 78<br>05-340 Kołbiel</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
        <form class="bg-coal/50 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
          <h3 class="serif text-blue mb-8 text-3xl font-bold">Prześlij zapytanie</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 relative group">
              <label for="fname" class="text-sm font-medium text-bone/70 group-focus-within:text-blue transition-colors ml-1">Imię <span class="text-blue">*</span></label>
              <input type="text" id="fname" required class="w-full bg-ink border border-white/10 rounded-xl px-5 py-4 text-bone focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all placeholder:text-bone/30 shadow-inner">
            </div>
            
            <div class="flex flex-col gap-2 relative group">
              <label for="lname" class="text-sm font-medium text-bone/70 group-focus-within:text-blue transition-colors ml-1">Nazwisko <span class="text-blue">*</span></label>
              <input type="text" id="lname" required class="w-full bg-ink border border-white/10 rounded-xl px-5 py-4 text-bone focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all placeholder:text-bone/30 shadow-inner">
            </div>
            
            <div class="flex flex-col gap-2 relative group">
              <label for="email" class="text-sm font-medium text-bone/70 group-focus-within:text-blue transition-colors ml-1">E-mail <span class="text-blue">*</span></label>
              <input type="email" id="email" required class="w-full bg-ink border border-white/10 rounded-xl px-5 py-4 text-bone focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all placeholder:text-bone/30 shadow-inner">
            </div>
            
            <div class="flex flex-col gap-2 relative group">
              <label for="phone" class="text-sm font-medium text-bone/70 group-focus-within:text-blue transition-colors ml-1">Telefon <span class="text-blue">*</span></label>
              <input type="tel" id="phone" required class="w-full bg-ink border border-white/10 rounded-xl px-5 py-4 text-bone focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all placeholder:text-bone/30 shadow-inner">
            </div>
            
            <div class="md:col-span-2 flex flex-col gap-2 relative group">
              <label for="message" class="text-sm font-medium text-bone/70 group-focus-within:text-blue transition-colors ml-1">Szczegóły zapytania <span class="text-blue">*</span></label>
              <textarea id="message" rows="5" required class="w-full bg-ink border border-white/10 rounded-xl px-5 py-4 text-bone focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all placeholder:text-bone/30 shadow-inner resize-none"></textarea>
            </div>
            
            <div class="md:col-span-2 space-y-4 mt-2">
              <label class="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required class="mt-1 w-5 h-5 bg-ink border-white/20 rounded text-blue focus:ring-blue focus:ring-2 focus:ring-offset-coal transition-all">
                <span class="text-sm text-bone/70 group-hover:text-bone transition-colors">Akceptuję warunki regulaminu i politykę prywatności <a href="#" class="text-blue hover:underline">RODO</a> <span class="text-blue">*</span></span>
              </label>
              
              <label class="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required class="mt-1 w-5 h-5 bg-ink border-white/20 rounded text-blue focus:ring-blue focus:ring-2 focus:ring-offset-coal transition-all">
                <span class="text-sm text-bone/70 group-hover:text-bone transition-colors">Wyrażam zgodę na otrzymywanie informacji handlowej na wskazany numer telefonu oraz adres poczty elektronicznej <span class="text-blue">*</span></span>
              </label>
            </div>
            
            <div class="md:col-span-2 mt-6">
              <button type="submit" class="w-full md:w-auto bg-blue hover:bg-blueSoft text-ink font-bold text-lg px-12 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                Wyślij wiadomość
              </button>
            </div>
          </div>
        </form>
      </div>
      
    </div>
    
    <!-- Map -->
    <div class="mt-20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[400px]" data-aos="fade-up" data-aos-delay="300">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27719.660081107195!2d21.450471857465445!3d52.11440111540461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471f2b647f80891b%3A0xf12cd70fa696d011!2sMaxi-Lux%20us%C5%82ugi%20kanalizacyjne%20woj%20mazowieckie%20%7C%20Pogotowie%20kanalizacyjne%7C%20przepychanie%20i%20udra%C5%BCnianie%20rur%20Warszawa%20i%20okolice!5e0!3m2!1spl!2spl!4v1706374476846!5m2!1spl!2spl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

  </div>
</section>
`;

  fs.writeFileSync('kontakt.html', headHTML + newMainHTML + footerHTML);
  console.log('Kontakt page completely rebuilt!');
} else {
  console.log('Could not find header or footer bounds.');
}

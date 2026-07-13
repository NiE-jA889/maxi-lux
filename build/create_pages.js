const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerEnd = indexHtml.indexOf('<!-- Hero -->');
const footerStart = indexHtml.indexOf('<!-- Footer -->');

const headerPart = indexHtml.substring(0, headerEnd);
const footerPart = indexHtml.substring(footerStart);

function createPage(filename, title, content) {
  const customHeader = headerPart.replace('<title>MAXI-LUX — Pogotowie Kanalizacyjne 24/7 | Warszawa i okolice</title>', '<title>' + title + ' | Maxi-Lux</title>');
  
  const pageContent = `
<section class="py-24 relative min-h-[70vh] overflow-hidden z-10">
  <div class="max-w-[1000px] mx-auto px-6 relative z-10" data-aos="fade-up">
    <div class="text-center mb-12">
      <div class="text-xs uppercase tracking-[0.3em] text-blue mb-4">— Maxi-Lux</div>
      <h1 class="serif text-4xl md:text-5xl text-[#f5f2ec]">` + title + `</h1>
    </div>
    <div class="rounded-[2rem] border border-glassBorder p-8 md:p-12 overflow-hidden bg-glass backdrop-blur-md shadow-2xl text-bone/80 prose prose-invert max-w-none">
      ` + content + `
    </div>
  </div>
</section>
`;

  fs.writeFileSync(filename, customHeader + pageContent + footerPart);
  console.log('Created ' + filename);
}

const rodoContent = `
<h2 class="text-xl font-bold text-blue mb-4">Państwa dane są bezpieczne</h2>
<p class="mb-6 leading-relaxed">Szanowni Państwo, w związku z tym, że od 25 maja 2018r. ma zastosowanie Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), przekazujemy informacje dotyczące Państwa danych osobowych.</p>

<h3 class="text-lg font-bold text-white mb-2">Kto przetwarza Państwa dane?</h3>
<p class="mb-6 leading-relaxed">Informujemy, że administratorem Państwa danych osobowych jest Maxi-Lux Krzysztof Jarosiński ul. Wawrzyniecka 78, 05-340 Kołbiel.</p>

<h3 class="text-lg font-bold text-white mb-2">W jakim celu dane są przetwarzane?</h3>
<p class="mb-6 leading-relaxed">Zgodnie z nowymi przepisami, uwzględniając potrzebę zachowania kontaktu z Państwem informujemy, że dane przekazane przez Państwa posłużą nam w celu przedstawienia ofert handlowych i korespondencji biznesowej prowadzonej przez naszą firmę, a także w celu odpowiedzi na Państwa pytania w sposób, na który została wyrażona takowa zgoda. Dla utrzymania relacji biznesowej dane zostaną przechowane bezterminowo. Podstawą prawną przetwarzania danych osobowych jest prawnie uzasadniony interes Firmy. Co do zasady, w naszej bazie przechowujemy imię i nazwisko, nazwa firmy, adres, NIP, adres e-mail i numer telefonu.</p>

<h3 class="text-lg font-bold text-white mb-2">Dostęp i zarządzanie danymi</h3>
<p class="mb-6 leading-relaxed">Zgodnie z przepisami wskazanego Rozporządzenia, przysługuje Państwu prawo do: żądania dostępu do swoich danych osobowych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, a także prawo do przenoszenia danych, cofnięcia zgody na przetwarzanie danych w dowolnym momencie, wniesienia skargi do organu nadzorczego.</p>
<p class="mb-6 leading-relaxed">W przypadku sprzeciwu przetwarzania danych i tym samym zaprzestania ich przetwarzania prosimy o przesłanie takiej informacji w formie wiadomości zwrotnej. Podkreślamy, że Państwa dane są u nas bezpiecznie. Jednocześnie informujemy, że przy braku Państwa sprzeciwu do tego czasu, Maxi-Lux będzie stale przechowywać Państwa dane osobowe i korzystać z nich w celu utrzymania relacji biznesowej i wysyłania korespondencji na zasadach nawiązujących do dotychczasowej współpracy.</p>
`;

createPage('rodo.html', 'Informacja RODO', rodoContent);

const politykaContent = `
<p class="mb-6 leading-relaxed text-lg">Polityka prywatności opisuje zasady przetwarzania przez nas informacji na Twój temat, w tym danych osobowych oraz ciasteczek, czyli tzw. cookies.</p>

<h3 class="text-xl font-bold text-blue mt-8 mb-4">1. Informacje ogólne</h3>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod adresem url: maxi-lux.pl</li>
  <li>Operatorem serwisu oraz Administratorem danych osobowych jest: MAXI-LUX Krzysztof Jarosiński ul. Wawrzyniecka 78, 05-340 Kołbiel</li>
  <li>Adres kontaktowy poczty elektronicznej operatora: biuro@maxi-lux.pl</li>
  <li>Operator jest Administratorem Twoich danych osobowych w odniesieniu do danych podanych dobrowolnie w Serwisie.</li>
  <li>Serwis wykorzystuje dane osobowe w celach: Obsługa zapytań przez formularz, Realizacja zamówionych usług, Prezentacja oferty lub informacji.</li>
  <li>Serwis realizuje funkcje pozyskiwania informacji o użytkownikach i ich zachowaniu poprzez dobrowolnie wprowadzone w formularzach dane oraz poprzez zapisywanie w urządzeniach końcowych plików cookie (tzw. "ciasteczka").</li>
</ul>

<h3 class="text-xl font-bold text-blue mt-8 mb-4">2. Wybrane metody ochrony danych stosowane przez Operatora</h3>
<ul class="list-disc pl-5 space-y-2 mb-6">
  <li>Miejsca logowania i wprowadzania danych osobowych są chronione w warstwie transmisji (certyfikat SSL). Dzięki temu dane osobowe i dane logowania są szyfrowane.</li>
  <li>Dane osobowe przechowywane w bazie danych są zaszyfrowane tak, że jedynie Operator posiada klucz do ich odczytu.</li>
  <li>Hasła użytkowników są przechowywane w postaci hashowanej.</li>
  <li>W serwisie może być stosowana autentykacja dwuskładnikowa.</li>
  <li>W celu ochrony danych Operator regularnie wykonuje kopie bezpieczeństwa.</li>
</ul>

<h3 class="text-xl font-bold text-blue mt-8 mb-4">3. Hosting</h3>
<p class="mb-6 leading-relaxed">Serwis jest hostowany (technicznie utrzymywany) na serwerach operatora: cyberFolks.pl. Firma hostingowa w celu zapewnienia niezawodności technicznej prowadzi logi na poziomie serwera obejmujące adresy IP, czasy zapytań, informacje o błędach i przeglądarkach.</p>

<h3 class="text-xl font-bold text-blue mt-8 mb-4">4. Twoje prawa i dodatkowe informacje</h3>
<p class="mb-4 leading-relaxed">W niektórych sytuacjach Administrator ma prawo przekazywać Twoje dane osobowe innym odbiorcom, jeśli będzie to niezbędne do wykonania umowy. Dotyczy to: firmy hostingowej, upoważnionych pracowników oraz firm realizujących płatności.</p>
<p class="mb-4 leading-relaxed">Twoje dane osobowe przetwarzane przez Administratora nie dłużej, niż jest to konieczne do wykonania związanych z nimi czynności. Przysługuje Ci prawo żądania od Administratora dostępu do danych, sprostowania, usunięcia lub ograniczenia przetwarzania.</p>
<p class="mb-6 leading-relaxed">Podanie danych osobowych jest dobrowolne, lecz niezbędne do obsługi Serwisu. Dane osobowe nie są przekazywane poza teren Unii Europejskiej.</p>

<h3 class="text-xl font-bold text-blue mt-8 mb-4">5. Informacja o plikach cookies</h3>
<p class="mb-4 leading-relaxed">Serwis korzysta z plików cookies. Pliki cookies stanowią dane informatyczne przechowywane w urządzeniu końcowym Użytkownika. Wykorzystywane są w celach utrzymania sesji użytkownika oraz w celach analitycznych/marketingowych.</p>
<p class="mb-6 leading-relaxed">Jeśli użytkownik nie chce otrzymywać plików cookies, może zmienić ustawienia przeglądarki internetowej.</p>
`;

createPage('polityka-prywatnosci.html', 'Polityka prywatności', politykaContent);

const blogContent = `
<p class="mb-6 leading-relaxed text-lg text-white font-medium">Firma Maxi-Lux to Twój zaufany partner w dziedzinie usług kanalizacyjnych, oferujący profesjonalne udrażnianie i czyszczenie rur w Warszawie i okolicach.</p>
<p class="mb-4 leading-relaxed">Zajmujemy się wszystkimi problemami, od prostych zatorów w zlewie, aż po skomplikowane awarie kanalizacyjne, które wymagają natychmiastowej i profesjonalnej interwencji. W naszej pracy kierujemy się zasadą, że najlepszym rozwiązaniem jest zapobieganie problemom, zanim jeszcze się pojawią, dlatego oferujemy również regularne przeglądy i konserwacje instalacji hydraulicznych, zapewniające ich długotrwałe i bezawaryjne funkcjonowanie.</p>
<p class="mb-4 leading-relaxed">Na naszym blogu znajdziesz bogaty zbiór artykułów, które mają na celu edukację naszych klientów w zakresie prawidłowej eksploatacji i konserwacji instalacji wodno-kanalizacyjnych. Piszemy o najczęstszych przyczynach problemów z kanalizacją, domowych sposobach na drobne awarie, a także o tym, kiedy koniecznie należy wezwać specjalistę.</p>
<p class="mb-8 leading-relaxed">Zapraszamy do regularnego odwiedzania naszego bloga, aby być na bieżąco z najlepszymi praktykami, poradami oraz aktualnościami z branży. Jeśli masz dodatkowe pytania czy potrzebujesz profesjonalnej porady, zawsze możesz skontaktować się z nami – jesteśmy tutaj, aby pomóc!</p>

<div class="space-y-4 border-t border-glassBorder pt-8 mt-8">
  <h3 class="text-2xl font-serif text-blue mb-6">Ostatnie artykuły:</h3>
  <a href="#" class="block p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-glassBorder transition-all">
    <h4 class="text-lg font-bold text-white mb-2">Ciśnieniowe mycie zbiorników – kiedy warto je wykonać i jakie osady można usunąć</h4>
    <p class="text-sm text-bone/60">Przeczytaj o tym, kiedy warto zastosować mycie ciśnieniowe i dlaczego jest ono najskuteczniejsze w walce z trudnymi osadami.</p>
  </a>
  <a href="#" class="block p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-glassBorder transition-all">
    <h4 class="text-lg font-bold text-white mb-2">Korzenie w kanalizacji – jak je wykryć i skutecznie usunąć bez rozkopywania działki</h4>
    <p class="text-sm text-bone/60">Dowiedz się, w jaki sposób diagnozujemy problem korzeni używając nowoczesnych kamer inspekcyjnych i jak szybko rozwiązujemy awarię.</p>
  </a>
  <a href="#" class="block p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-glassBorder transition-all">
    <h4 class="text-lg font-bold text-white mb-2">Naprawa rur bez kucia i wykopów – na czym polega metoda QuickLock</h4>
    <p class="text-sm text-bone/60">Szybka naprawa technologią Quick-Lock System (mankiety ze stali nierdzewnej) bez wykonywania kosztownych wykopów i rujnowania podwórka.</p>
  </a>
  <a href="#" class="block p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-glassBorder transition-all">
    <h4 class="text-lg font-bold text-white mb-2">Serwis przepompowni ścieków – jak często i dlaczego jest potrzebny</h4>
    <p class="text-sm text-bone/60">Dlaczego regularny serwis przepompowni ścieków to klucz do uniknięcia kosztownych napraw w przyszłości i powodzi w piwnicy.</p>
  </a>
  <a href="#" class="block p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-glassBorder transition-all">
    <h4 class="text-lg font-bold text-white mb-2">WUKO – ciśnieniowe czyszczenie kanalizacji jak to działa?</h4>
    <p class="text-sm text-bone/60">Poznaj sekret naszej floty. Pojazdy asenizacyjne WUKO to najpotężniejsza broń w walce z niedrożnymi rurami.</p>
  </a>
</div>
`;

createPage('blog.html', 'Blog firmowy', blogContent);

// Fix links in the footer across all files to point to .html files instead of the live website
function fixFooterLinks(filePath) {
  let htmlText = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (htmlText.includes('href="https://maxi-lux.pl/polityka-prywatnosci-2/"')) {
    htmlText = htmlText.replace(/href="https:\/\/maxi-lux.pl\/polityka-prywatnosci-2\/"/g, 'href="polityka-prywatnosci.html"');
    changed = true;
  }
  if (htmlText.includes('href="https://maxi-lux.pl/rodo/"')) {
    htmlText = htmlText.replace(/href="https:\/\/maxi-lux.pl\/rodo\/"/g, 'href="rodo.html"');
    changed = true;
  }
  if (htmlText.includes('href="https://maxi-lux.pl/blog/"')) {
    htmlText = htmlText.replace(/href="https:\/\/maxi-lux.pl\/blog\/"/g, 'href="blog.html"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, htmlText);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
rootFiles.forEach(file => {
  fixFooterLinks(file);
});
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];
uslugiFiles.forEach(file => {
  // Dla plików w podkatalogu dodajemy ../
  let htmlText = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (htmlText.includes('href="https://maxi-lux.pl/polityka-prywatnosci-2/"')) {
    htmlText = htmlText.replace(/href="https:\/\/maxi-lux.pl\/polityka-prywatnosci-2\/"/g, 'href="../polityka-prywatnosci.html"');
    changed = true;
  }
  if (htmlText.includes('href="https://maxi-lux.pl/rodo/"')) {
    htmlText = htmlText.replace(/href="https:\/\/maxi-lux.pl\/rodo\/"/g, 'href="../rodo.html"');
    changed = true;
  }
  if (htmlText.includes('href="https://maxi-lux.pl/blog/"')) {
    htmlText = htmlText.replace(/href="https:\/\/maxi-lux.pl\/blog\/"/g, 'href="../blog.html"');
    changed = true;
  }
  if (changed) fs.writeFileSync(file, htmlText);
});

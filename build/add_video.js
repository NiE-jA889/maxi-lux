const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('o-nas.html', 'utf8');
const $ = cheerio.load(html);

// Find the video container
const videoDiv = $('.avia-video');

if (videoDiv.length > 0) {
  // Replace it with a responsive iframe
  videoDiv.replaceWith(`
    <div class="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 mt-8 relative group">
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/n128YeffbGo?si=MDvinm-oKwloHWNQ&autoplay=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
        class="absolute top-0 left-0 w-full h-full">
      </iframe>
    </div>
  `);
  
  fs.writeFileSync('o-nas.html', $.html());
  console.log('Successfully added YouTube video to o-nas.html');
} else {
  console.log('Could not find .avia-video in o-nas.html');
}

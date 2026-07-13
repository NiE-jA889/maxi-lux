const cheerio = require('cheerio');
const html = require('fs').readFileSync('galeria_raw.html','utf8');
const $ = cheerio.load(html);
let contentArea = $('#main');
contentArea.find('script, style').remove();
contentArea.find('.sharedaddy, #comments, .navigation, .sidebar').remove();
console.log('Main length:', contentArea.length);
console.log('HTML length of #main:', contentArea.html().length);
const gallery = $('.avia-gallery');
console.log('Is gallery inside #main?', contentArea.find('.avia-gallery').length > 0);

console.log('Images in #main:', $('#main img').length);

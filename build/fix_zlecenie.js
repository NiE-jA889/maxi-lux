const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('zlecenie.html', 'utf8');
const $ = cheerio.load(html);

const form = $('form.avia_ajax_form');

if (form.length > 0) {
  // We will build a new form inner HTML
  let newFormHtml = `<h3 class="serif text-blue mb-8 text-4xl text-center">Zlecenie wykonania usługi</h3>`;
  newFormHtml += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
  
  // Extract fields
  form.find('p.form_element').each((i, el) => {
    const $p = $(el);
    const label = $p.find('label').text().trim();
    const isRequired = $p.find('abbr').length > 0 || label.includes('*');
    const cleanLabel = label.replace(/\*$/, '').trim();
    const isFullWidth = $p.hasClass('form_fullwidth');
    const colClass = isFullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1';
    
    // Check if it's the checkbox
    if ($p.find('input[type="checkbox"]').length > 0) {
      const checkbox = $p.find('input[type="checkbox"]');
      const cbName = checkbox.attr('name');
      const cbId = checkbox.attr('id');
      const cbVal = checkbox.attr('value');
      
      newFormHtml += `
      <div class="${colClass} flex items-start gap-3 mt-4">
        <div class="flex items-center h-5">
          <input id="${cbId}" name="${cbName}" type="checkbox" value="${cbVal}" class="w-5 h-5 bg-ink border-white/20 rounded text-blue focus:ring-blue focus:ring-2 focus:ring-offset-coal transition-all">
        </div>
        <div class="text-sm text-bone/70">
          <label for="${cbId}" class="font-medium cursor-pointer">
            Akceptuję warunki <a href="https://maxi-lux.pl/rodo/" target="_blank" class="text-blue hover:text-blueSoft underline">RODO</a> ${isRequired ? '<span class="text-blue">*</span>' : ''}
          </label>
        </div>
      </div>`;
      return;
    }

    // Identify input type
    const input = $p.find('input[type="text"], textarea, select');
    const inputName = input.attr('name');
    const inputId = input.attr('id');
    const isTextarea = input.is('textarea');
    const isSelect = input.is('select');
    
    // Some fields have hidden inputs (captcha verifier)
    const hiddenInputs = $p.find('input[type="hidden"]');
    let hiddenHtml = '';
    hiddenInputs.each((j, hid) => {
      hiddenHtml += `<input type="hidden" name="${$(hid).attr('name')}" id="${$(hid).attr('id')}" value="${$(hid).attr('value')}">`;
    });

    const commonClasses = "w-full bg-ink border border-white/10 rounded-xl px-5 py-4 text-bone focus:border-blue focus:ring-1 focus:ring-blue outline-none transition-all placeholder:text-bone/30 shadow-inner";

    newFormHtml += `<div class="${colClass} flex flex-col gap-2 relative group">`;
    newFormHtml += hiddenHtml;
    
    if (cleanLabel && !cleanLabel.includes('Akceptuję warunki')) {
       // if captcha, the label has the equation before it
       const verifierLabel = $p.find('.value_verifier_label').text();
       const displayLabel = verifierLabel ? `${verifierLabel} - ${cleanLabel}` : cleanLabel;
       newFormHtml += `<label for="${inputId}" class="text-sm font-medium text-bone/70 group-focus-within:text-blue transition-colors ml-1">${displayLabel} ${isRequired ? '<span class="text-blue">*</span>' : ''}</label>`;
    }
    
    if (isTextarea) {
      newFormHtml += `<textarea name="${inputName}" id="${inputId}" rows="5" class="${commonClasses} resize-none"></textarea>`;
    } else if (isSelect) {
      let optionsHtml = '';
      input.find('option').each((j, opt) => {
        optionsHtml += `<option value="${$(opt).attr('value')}">${$(opt).text()}</option>`;
      });
      // specific style for select
      newFormHtml += `<select name="${inputName}" id="${inputId}" class="${commonClasses} appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1.25em]" style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232563eb%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');">${optionsHtml}</select>`;
    } else {
      newFormHtml += `<input type="text" name="${inputName}" id="${inputId}" class="${commonClasses}">`;
    }
    
    newFormHtml += `</div>`;
  });

  // Submit button
  // Find hidden fields outside form_element
  let extraHidden = '';
  form.find('> fieldset > input[type="hidden"]').each((i, el) => {
    extraHidden += $.html(el);
  });
  
  newFormHtml += `
    <div class="col-span-1 md:col-span-2 mt-8 flex flex-col items-center">
      ${extraHidden}
      <button type="submit" class="bg-blue hover:bg-blueSoft text-ink font-bold text-lg py-4 px-12 rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-1 w-full md:w-auto">Wyślij zlecenie</button>
    </div>
  `;
  
  newFormHtml += `</div><div id="ajaxresponse_1" class="hidden mt-6 p-4 rounded-xl text-center bg-blue/10 text-blue border border-blue/20"></div>`;

  form.html(`<fieldset class="border-0 p-0 m-0">${newFormHtml}</fieldset>`);
  
  fs.writeFileSync('zlecenie.html', $.html());
  console.log('zlecenie.html successfully reformatted into a modern Tailwind grid.');
}

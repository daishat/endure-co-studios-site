/* Progressive contact-form validation. FormSubmit enforces CAPTCHA and _honey.
 * Browser-side validation improves input quality; it cannot authenticate senders
 * or stop bots that bypass the website and POST directly to FormSubmit.
 */
(function () {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').trim();
  function validateContact(values) {
    const name = normalize(values.name);
    const email = normalize(values.email);
    const message = normalize(values.message);
    const errors = {};
    if (!name || name.length > 100 || !/\p{L}/u.test(name) || /[\r\n<>]|(?:https?:\/\/|www\.)/i.test(name)) {
      errors.name = 'Please enter your name (up to 100 characters), without links.';
    }
    // Keep international names, single names, punctuation, and initials valid.
    if (email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/u.test(email)) {
      errors.email = 'Please enter a properly formatted email address.';
    }
    const letters = (message.match(/\p{L}/gu) || []).length;
    if (message.length < 20 || message.length > 5000 || letters < 10 || /(.)\1{14,}/u.test(message)) {
      errors.message = 'Please write a brief description of your inquiry (20–5,000 characters).';
    }
    const links = message.match(/(?:https?:\/\/|www\.)[^\s<>]+/giu) || [];
    const lines = message.split(/\r?\n/).map(line => line.trim().toLowerCase().replace(/\s+/g, ' ')).filter(line => line.length >= 20);
    const counts = new Map();
    const repeatedLine = lines.some(line => {
      const count = (counts.get(line) || 0) + 1; counts.set(line, count); return count >= 3;
    });
    // Repeated multi-word advertising is a stronger signal than a lone keyword.
    const repeatedPhrase = /\b([\p{L}\p{N}]+(?:\s+[\p{L}\p{N}]+){2,7})(?:[\s.!?,;:-]+\1){2,}\b/iu.test(message);
    if (links.length > 3 || repeatedLine || repeatedPhrase) {
      errors.message = 'Please use no more than three links and remove repeated promotional text.';
    }
    return { errors, blocked: normalize(values.honey) !== '', values: { name, email, message } };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { validateContact };
  if (typeof document === 'undefined') return;
  const form = document.getElementById('studio-contact-form');
  if (!form) return;
  const fields = { name: form.elements.namedItem('name'), email: form.elements.namedItem('email'), message: form.elements.namedItem('message') };
  Object.values(fields).forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
  form.addEventListener('submit', event => {
    Object.values(fields).forEach(field => field.setCustomValidity(''));
    const result = validateContact({ name: fields.name.value, email: fields.email.value, message: fields.message.value, honey: form.elements.namedItem('_honey').value });
    if (result.blocked) { event.preventDefault(); return; }
    let firstInvalid;
    Object.entries(result.errors).forEach(([key, error]) => {
      fields[key].setCustomValidity(error);
      if (!firstInvalid) firstInvalid = fields[key];
    });
    if (firstInvalid) {
      event.preventDefault(); firstInvalid.focus(); firstInvalid.reportValidity(); return;
    }
    Object.entries(result.values).forEach(([key, value]) => { fields[key].value = value; });
    document.dispatchEvent(new Event('studio:contact-valid'));
    // Keep a regular HTML POST: FormSubmit's hosted CAPTCHA remains in the flow.
  });
})();

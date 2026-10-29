/* No network tracking here. Optional analytics can consume the fixed-label event
 * after consent when the existing GA4 draft is activated. Never read form text. */
(function () {
  'use strict';
  const KEY = 'endure.product-inquiry.v1';
  const allowed = ['lifexp', 'brain_dump', 'monster_daycare'];
  function validReceipt(pending, token, now) {
    return !!(pending && /^[a-f0-9]{32}$/.test(token || '') && pending.token === token && allowed.includes(pending.product) && ['beta','feedback'].includes(pending.kind) && now >= pending.time && now - pending.time < 1800000);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { validReceipt };
  if (typeof document === 'undefined') return;
  const form = document.querySelector('form[data-product-inquiry]');
  if (form) form.addEventListener('submit', event => {
    if (event.defaultPrevented || !form.checkValidity() || form.elements.namedItem('_honey').value.trim()) return;
    const product = form.dataset.productInquiry, kind = form.dataset.inquiryKind;
    if (!allowed.includes(product) || !['beta','feedback'].includes(kind)) return;
    try {
      const token = [...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');
      sessionStorage.setItem(KEY, JSON.stringify({ token, product, kind, time: Date.now() }));
      form.elements.namedItem('_next').value = location.origin + '/product-thanks/?receipt=' + token;
    } catch { /* Keep the standard FormSubmit POST working without browser storage. */ }
  });
  if (location.pathname.replace(/index\.html$/, '') === '/product-thanks/') {
    try {
      const pending = JSON.parse(sessionStorage.getItem(KEY));
      const token = new URL(location.href).searchParams.get('receipt');
      if (validReceipt(pending, token, Date.now())) {
        sessionStorage.removeItem(KEY);
        const status = document.getElementById('product-receipt-status');
        if (status) status.textContent = 'Your product inquiry returned from FormSubmit’s confirmation process. We’ll review it and reply as appropriate. This does not verify inbox delivery or guarantee beta access.';
        document.dispatchEvent(new CustomEvent('studio:product-inquiry-confirmed', { detail: { product: pending.product, kind: pending.kind } }));
        history.replaceState(null, '', '/product-thanks/');
      }
    } catch { /* An ordinary visit or blocked storage must not count as completion. */ }
  }
})();

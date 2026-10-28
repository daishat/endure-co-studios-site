(function () {
  'use strict';
  const CONSENT_KEY = 'endure.analytics-consent.v1';
  const PENDING_KEY = 'endure.contact-receipt.v1';
  const TTL = 180 * 24 * 60 * 60 * 1000;
  const actions = new Set(['read_more', 'explore_more', 'read_excerpt', 'project_link', 'newsletter_link', 'shop_link', 'voice_link', 'read_blog', 'read_comics']);
  const projects = new Set(['the_aware', 'monster_daycare', 'brain_dump', 'lifexp', 'brain_dump_times', 'stories', 'blog', 'studio_shop', 'studio']);
  function safeLocation(input) {
    const url = new URL(input);
    const clean = new URL(url.origin + url.pathname);
    // Only intentionally formatted campaign labels; never arbitrary query data.
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      const value = url.searchParams.get(key);
      if (value && /^[a-z0-9_-]{1,80}$/i.test(value)) clean.searchParams.set(key, value);
    }
    return clean.href;
  }
  function safeReferrer(input) {
    try { return input ? new URL(input).origin + '/' : ''; } catch { return ''; }
  }
  function validReceipt(pending, token, now) {
    return !!(pending && token && /^[a-f0-9]{32}$/.test(token) && pending.token === token && now >= pending.time && now - pending.time < 30 * 60 * 1000);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { safeLocation, safeReferrer, validReceipt };
  if (typeof document === 'undefined') return;
  const id = window.STUDIO_ANALYTICS_ID || '';
  if (!/^G-[A-Z0-9]+$/.test(id)) return; // Draft stays completely inactive without a real ID.
  let active = false;
  let consent = null;
  let engagement = 0;
  let visibleSince = null;
  const readStore = (store, key) => { try { return JSON.parse((store === 'local' ? window.localStorage : window.sessionStorage).getItem(key)); } catch { return null; } };
  const writeStore = (store, key, value) => { try { (store === 'local' ? window.localStorage : window.sessionStorage).setItem(key, JSON.stringify(value)); } catch {} };
  const removeStore = (store, key) => { try { (store === 'local' ? window.localStorage : window.sessionStorage).removeItem(key); } catch {} };
  function currentConsent() {
    if (navigator.globalPrivacyControl === true) return 'denied';
    const saved = readStore('local', CONSENT_KEY);
    return saved && Date.now() >= saved.time && Date.now() - saved.time < TTL && ['granted', 'denied'].includes(saved.choice) ? saved.choice : null;
  }
  window.dataLayer = window.dataLayer || [];
  function tag() { window.dataLayer.push(arguments); }
  function send(name, params) {
    if (!active || consent !== 'granted' || window['ga-disable-' + id]) return;
    tag('event', name, Object.assign({ page_location: safeLocation(location.href), page_referrer: safeReferrer(document.referrer) }, params));
  }
  function receipt() {
    if (location.pathname !== '/contact-thanks.html') return;
    const pending = readStore('session', PENDING_KEY);
    const token = new URL(location.href).searchParams.get('receipt');
    if (validReceipt(pending, token, Date.now())) {
      removeStore('session', PENDING_KEY);
      send('generate_lead', { form_id: 'studio_contact', confirmation: 'formsubmit_return' });
    }
  }
  function start() {
    if (active || consent !== 'granted') return;
    active = true;
    window['ga-disable-' + id] = false;
    engagement = 0;
    visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
    tag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('consent', 'update', { analytics_storage: 'granted' });
    tag('js', new Date());
    tag('config', id, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: safeLocation(location.href), page_referrer: safeReferrer(document.referrer),
      page_title: document.title, cookie_expires: 15552000
    });
    const script = document.createElement('script');
    script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
    send('page_view', { page_title: document.title });
    receipt();
    if ('IntersectionObserver' in window) {
      const seen = new Set();
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const project = entry.target.dataset.projectInterest;
          if (entry.intersectionRatio >= 0.5 && projects.has(project) && !seen.has(project)) {
            seen.add(project); send('studio_project_view', { project }); observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('[data-project-interest]').forEach(card => observer.observe(card));
    }
  }
  function clearAnalyticsCookies() {
    const hostname = location.hostname;
    const domains = ['', hostname, '.' + hostname];
    if (hostname.startsWith('www.')) domains.push(hostname.slice(4), '.' + hostname.slice(4));
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of domains) document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
    }
  }
  function choose(choice) {
    if (navigator.globalPrivacyControl === true) choice = 'denied';
    consent = choice;
    writeStore('local', CONSENT_KEY, { choice, time: Date.now() });
    banner.hidden = true;
    if (choice === 'granted') start();
    else {
      window['ga-disable-' + id] = true;
      removeStore('session', PENDING_KEY);
      clearAnalyticsCookies();
      if (active) location.reload(); // Fully unload Google rather than sending denied-consent pings.
    }
  }
  const banner = document.createElement('section');
  banner.id = 'studio-consent'; banner.setAttribute('aria-label', 'Optional website analytics'); banner.hidden = true;
  banner.innerHTML = '<p>May we use optional analytics to understand visits and improve the studio website? No contact-form contents are sent to Google Analytics. <a href="/privacy.html">Privacy policy</a></p><div><button type="button" data-choice="granted">Accept analytics</button><button type="button" data-choice="denied">Reject analytics</button></div>';
  document.body.append(banner);
  banner.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => choose(button.dataset.choice)));
  const settings = document.querySelector('[data-analytics-settings]');
  if (settings) settings.addEventListener('click', () => {
    banner.hidden = false;
    const accept = banner.querySelector('[data-choice="granted"]');
    accept.disabled = navigator.globalPrivacyControl === true;
    banner.querySelector('[data-choice="denied"]').focus();
  });
  consent = currentConsent();
  if (consent === 'granted') start();
  else if (!consent) banner.hidden = false;
  else { window['ga-disable-' + id] = true; clearAnalyticsCookies(); }
  document.addEventListener('click', event => {
    const slideButton = event.target.closest('#endure-slides [data-slide]');
    if (slideButton) {
      const feature = ['the_aware', 'stories', 'studio', 'studio_shop', 'studio'][Number(slideButton.dataset.slide)];
      if (feature) send('homepage_feature_view', { project: feature, feature_index: Number(slideButton.dataset.slide) });
    }
    const link = event.target.closest('a[data-studio-action]');
    if (!link || !actions.has(link.dataset.studioAction) || !projects.has(link.dataset.studioProject)) return;
    send('studio_click', { action: link.dataset.studioAction, project: link.dataset.studioProject });
  });
  document.addEventListener('studio:contact-valid', () => {
    if (!active || consent !== 'granted') return;
    const form = document.getElementById('studio-contact-form');
    const next = form && form.elements.namedItem('_next');
    if (!next) return;
    try {
      const token = [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, '0')).join('');
      writeStore('session', PENDING_KEY, { token, time: Date.now() });
      next.value = location.origin + '/contact-thanks.html?receipt=' + token;
      send('contact_submit_attempt', { form_id: 'studio_contact' });
    } catch { /* Form submission still works if browser storage/crypto is unavailable. */ }
  });

  function flushEngagement() {
    if (visibleSince !== null) { engagement += performance.now() - visibleSince; visibleSince = null; }
    if (engagement >= 1000) { send('studio_engagement', { engagement_time_msec: Math.round(engagement) }); engagement = 0; }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEngagement();
    else visibleSince = performance.now();
  });
  window.addEventListener('pagehide', flushEngagement);
})();

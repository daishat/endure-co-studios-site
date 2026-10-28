(() => {
  const root = document.getElementById('endure-slides');
  if (!root) return;
  const slides = [...root.querySelectorAll('.slide')];
  const buttons = [...root.querySelectorAll('[data-slide]')];
  const previous = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const position = root.querySelector('.slide-position');
  const stage = root.querySelector('.stage');
  const names = ['Featured', 'Read & Explore', 'Portfolio', 'Studio Shop', 'Games & Apps'];
  let index = 0;
  function showSlide(number) {
    index = Math.max(0, Math.min(slides.length - 1, number));
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    buttons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    position.textContent = `${index + 1} / ${slides.length} · ${names[index]}`;
  }
  buttons.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
  previous.addEventListener('click', () => showSlide(index - 1));
  next.addEventListener('click', () => showSlide(index + 1));
  root.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.go))));
  root.querySelector('.slide-controls').hidden = false;
  // Keyboard shortcuts apply only to the slide selectors, not reading or form fields.
  buttons.forEach(button => button.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = Math.min(index + 1, slides.length - 1);
    else if (event.key === 'ArrowLeft') target = Math.max(index - 1, 0);
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = slides.length - 1;
    else return;
    event.preventDefault(); showSlide(target); buttons[index].focus();
  }));
  let start = null;
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) { start = null; return; }
    const touch = event.touches[0]; start = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { start = null; }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x, dy = touch.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(index + (dx < 0 ? 1 : -1));
    start = null;
  }, { passive: true });
  // The latest comic stays synchronized with the existing comic collection.
  const comic = Array.isArray(window.COMICS) ? window.COMICS[0] : null;
  if (comic) {
    const image = slides[1].querySelector('img');
    image.src = '/' + comic.image.replace(/^\//, '');
    image.alt = `Brain Dump Times: ${comic.title}`;
    slides[1].querySelector('.status').textContent = `Featuring Brain Dump Times issue #${comic.issue}: ${comic.title}`;
  }
  showSlide(0);
})();

const comicList = document.getElementById('comic-list');

function createComicCard(comic) {
  const article = document.createElement('article');
  article.className = 'comic-entry';

  const imageMarkup = comic.image
    ? `<a href="${comic.image}" aria-label="Open Issue #${comic.issue}"><img src="${comic.image}" alt="${comic.title} — Brain Dump Times Issue #${comic.issue}" loading="lazy"></a>`
    : `<div class="comic-image-placeholder">Issue #${comic.issue} is not available yet.</div>`;

  article.innerHTML = `
    <div class="comic-image-wrap">
      ${imageMarkup}
    </div>
    <div class="comic-meta">
      <div class="issue">ISSUE #${comic.issue}</div>
      <h2>${comic.title}</h2>
      <div class="date">${comic.date}</div>
      ${comic.image ? `<a class="btn primary" href="${comic.image}">Open Issue #${comic.issue}</a>` : ""}
    </div>
  `;
  return article;
}

if (comicList && Array.isArray(window.COMICS)) {
  window.COMICS.forEach(comic => comicList.appendChild(createComicCard(comic)));
}

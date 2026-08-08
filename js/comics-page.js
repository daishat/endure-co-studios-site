const comicList = document.getElementById('comic-list');

function createComicCard(comic) {
  const article = document.createElement('article');
  article.className = 'comic-entry';

  const imageMarkup = comic.image
    ? `<img src="${comic.image}" alt="${comic.title} — Brain Dump Times Issue #${comic.issue}" loading="lazy">`
    : `<div class="comic-image-placeholder">Upload Issue #${comic.issue} to<br><strong>images/comics/</strong><br>then add its filename in <strong>js/comics-data.js</strong></div>`;

  article.innerHTML = `
    <div class="comic-image-wrap">
      ${imageMarkup}
    </div>
    <div class="comic-meta">
      <div class="issue">ISSUE #${comic.issue}</div>
      <h2>${comic.title}</h2>
      <div class="date">${comic.date}</div>
    </div>
  `;
  return article;
}

if (comicList && Array.isArray(window.COMICS)) {
  window.COMICS.forEach(comic => comicList.appendChild(createComicCard(comic)));
}

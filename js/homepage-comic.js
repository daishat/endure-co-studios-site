const latestComic = Array.isArray(window.COMICS) ? window.COMICS[0] : null;

if (latestComic) {
  const image = document.getElementById("featured-comic-image");
  const issue = document.getElementById("featured-comic-issue");
  const title = document.getElementById("featured-comic-title");
  const description = document.getElementById("featured-comic-description");
  const date = document.getElementById("featured-comic-date");

  if (image) {
    image.src = latestComic.image;
    image.alt = `${latestComic.title} - Brain Dump Times Issue ${latestComic.issue}`;
  }

  if (issue) {
    issue.textContent = `ISSUE #${latestComic.issue}`;
  }

  if (title) {
    title.textContent = latestComic.title;
  }

  if (description) {
    description.textContent = latestComic.description || "";
  }

  if (date) {
    date.textContent = latestComic.date
      ? `PUBLISHED ${latestComic.date}`
      : "";
  }
}

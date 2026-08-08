# Endure Co Studios Website

This is the coded version of the Endure Co Studios website.

## Files

- `index.html` — main website
- `brain-dump-times.html` — comic archive
- `css/styles.css` — website design
- `js/main.js` — mobile menu
- `js/comics-data.js` — comic issue information
- `js/comics-page.js` — automatically builds the comic archive
- `images/comics/` — upload Brain Dump Times comic images here
- `images/books/` — book covers
- `images/site/` — site photos/background images

## Add a new comic

1. Upload the comic image to `images/comics/`
2. Open `js/comics-data.js`
3. Add a new entry at the TOP:

```js
{
  issue: "024",
  title: "Your New Comic Title",
  date: "August 15, 2026",
  image: "images/comics/issue-024.jpg"
},
```

4. Commit the change.

The archive updates automatically.

## Turn on GitHub Pages

In the GitHub repository:

1. Open **Settings**
2. Click **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select branch **main**
5. Select folder **/(root)**
6. Click **Save**

GitHub will give you a public site address.

## Custom domain

Wait until the GitHub Pages version works first. Then add your custom domain in:
**Settings → Pages → Custom domain**

Your domain provider will also need DNS records pointing to GitHub Pages. Do that only after the GitHub Pages preview works.

## Important

The contact forms currently use `mailto:`. They open the visitor's email program.
A true web form that sends submissions without opening email will require a form service or backend later.

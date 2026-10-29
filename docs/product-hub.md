# Product hub: review draft

This update adds discovery/marketing pages only. It does not migrate or change the LifeXP, Brain Dump, or Monster Daycare applications. No new hosting, domains, payments, subscriptions, or active analytics are introduced.

## Routes and source
- `/projects/`: existing URL and Games & Apps main-menu destination, divided into Apps & Tools and Games.
- `/apps/life-xp/`: published-prototype overview; external link listed in daishat/lifexp metadata: https://lifexp-navy.vercel.app. Its HTML returned HTTP 200 during review, but full app acceptance testing remains outstanding.
- `/apps/brain-dump/`: alpha overview and beta inquiry.
- `/games/monster-daycare/`: player-facing game overview and testing inquiry; retained `/portfolio/monster-daycare.html` focuses on portfolio context and links back.
- `/product-thanks/`: noindex confirmation-return page, not a guarantee of delivery or immediate beta access.

Plain HTML, existing shared header/footer/navigation, scoped `css/products.css`, and the existing security validator. No site framework/build-system dependency. `products.json` is the documented inventory; it does not generate pages at runtime. To add a product, copy the matching product HTML page, edit its verified content/metadata/forms/artwork, add its hub card and catalog record, update sitemap, and run link/receipt checks. Keep the shared CSS. Add no inactive Try/Play links.

## Claims and unresolved content

LifeXP source currently contains the rental and budgeting scenarios, branching outcomes, takeaways and calculator. This is source evidence, not certification of the live release. Future scenarios remain planned. Brain Dump source supports capture/local storage/tasks/journals and a sorting/review workflow; live AI integration remains unverified. Offline data capture must not be confused with a fully offline-installable web app. Recycle bin/PIN/biometrics are unverified; premium/accounts/cloud backup are not active product offers. No prices, quotas, launch dates, users, testimonials or sales claims are invented.

All present hero/card images are labeled concept artwork, not screenshots. Actual app screenshots and gameplay visuals are still required. Newsletter signup URL remains explicitly pending. Current requests go privately through FormSubmit to founder@endurecostudios.com; they do not automatically subscribe visitors to marketing.

## Feedback and beta inquiries

Each product has at most one form using the existing `studio-contact-form` name/email/message field IDs. Existing CAPTCHA, honeypot, spam phrase list and custom validation are retained. Fixed product and inquiry-type fields route requests by email subject. No form fields are written to browser storage. A short-lived random per-tab receipt marker contains only product/kind/token/time. A successful FormSubmit return consumes it and dispatches a fixed-label DOM event. Plain visits do not count. This is client-side confirmation, not proof of inbox delivery or tamper-proof server verification. Storage failure leaves the standard form POST available.

Do not send production spam tests or disable CAPTCHA. Before publication, verify genuine beta and feedback submissions, CAPTCHA, return routing, and receipt in the studio inbox. The studio owner must confirm inbox delivery.

## Existing analytics draft (PR #2)

No second tracker is installed. This product branch only prepares fixed `data-studio-action`, `data-studio-project`, body `data-product` and the `studio:product-inquiry-confirmed` notification. When the consent-gated GA4 branch is integrated:
1. Rebase it on the new hub/main navigation; do not overwrite Games & Apps or these pages.
2. Include `product_explore` and `app_launch` in its allowed action list.
3. On analytics opt-in, send one `product_view` using the allowlisted body `data-product`.
4. Send `app_launch` for a launch click, with only allowlisted project/action labels; do not send the full external URL.
5. Listen for `studio:product-inquiry-confirmed` and, only after analytics consent, send `beta_signup` or `product_feedback_submitted` with allowlisted product labels. Do not read the form or include receipt tokens.
6. If a return fires before deferred GA4 code loads, consume a short-lived fixed-label pending completion once within that module; do not install an independent analytics client here.
7. Keep submissions uncounted when consent is denied and do not call a submit-button click a completed signup. Verify event receipt with the real G- ID and Realtime/DebugView.

GA4 is currently inactive. PostHog instrumentation exists inside the separate LifeXP application and needs its own privacy review; this website update does not modify it.

## Before publication
- Owner review: copy, product availability, LifeXP public URL, concept-art labels and unfinished feature distinctions.
- Provide real screenshots, verified Brain Dump tester build URL, Monster Daycare playable link if available, Substack signup URL.
- Desktop and mobile browser QA: headings, stacked cards, form fields, focus states, no overflow, load times.
- Verify external LifeXP launch, original navigation and existing content, metadata and deep links.
- Contact delivery and privacy notice review. The general privacy-policy page is in the separate GA4 draft; product forms include a plain-language data-use notice in this draft.
- Publish only after review, then verify the GitHub Pages deployment and live routes.

## December revenue focus

Product pages create destinations; they do not create revenue by themselves. The near-term funnel is discovery → LifeXP trial or tester request → product feedback → verified release/offer. Keep existing Ko-fi products purchasable through Studio Shop while apps are tested. Pricing, paid app features, payment-provider setup, business registration and business banking are separate decisions requiring owner input. Do not add paid checkout or promise a revenue date in this change.

# Endure Co Studios analytics setup — draft, not live

No Google Analytics, Google Tag Manager, or privacy policy was found in the audited source at main commit aae5fec0a527c203666929423568cc4b1b06eb8b. This branch has no live Measurement ID. It must not be described as collecting traffic or fully verified with GA4.

## Create or reuse the free GA4 property

1. Sign in at https://analytics.google.com/ with the Google account that should own studio analytics. Use your own account; do not send credentials or API secrets in chat.
2. Look at the account/property selector first. If Endure Co Studios already exists, reuse it rather than creating a duplicate.
3. If needed, choose Start measuring (or Admin → Create → Account). Account name: Endure Co Studios. Choose data-sharing settings deliberately; extra Google sharing options are not required for this integration.
4. Create a GA4 property named Endure Co Studios. Reporting time zone: United States / Central Time (America/Chicago). Currency: USD. Choose the accurate business category, size, and website-traffic/lead objectives. The account owner must review and accept Google's terms.
5. Choose Web as the data stream platform, URL https://endurecostudios.com, stream name Endure Co Studios Website.
6. Turn Enhanced measurement OFF for this initial privacy-minimized setup. In particular, do not enable automatic form interaction, outbound click, site-search, file-download, or history-based page tracking. Those features can collect destinations and query strings, and automatic form_submit is not a delivery confirmation. Our code supplies page views and fixed-label interactions explicitly.
7. Copy the web stream's Measurement ID (G-...). This public identifier is safe to share. Put it in js/analytics-config.js; it is the only missing code configuration.
8. Keep Google Signals, user-provided data collection, advertising personalization, and advertising product links OFF. Do not activate User-ID. In Data Settings/Data retention, choose 2 months for user/event data and turn off reset on new activity. Enable email/query-parameter data redaction as extra defense. Never include personal data in UTM labels.
9. In GA4 custom definitions, add event-scoped dimensions `project`, `action`, and (optionally) `confirmation`. Mark `generate_lead` as a key event. Do NOT mark `contact_submit_attempt` as a successful lead.
10. Merge/deploy only after the real ID and settings above are confirmed. Verify deployment and live requests; then verify Realtime and DebugView with the owner signed into GA4.

## What is measured

- page_view: sanitized page URL and published title, after analytics consent.
- studio_click: fixed `action` and `project` labels, never link text, full link URLs, or form fields.
- studio_project_view: project card at least half visible, once per page after consent (where IntersectionObserver is supported). Covers Brain Dump, LifeXP, Monster Daycare on their shared projects page; visibility is exposure, not proof of interest or a playable release.
- homepage_feature_view: an explicitly selected homepage feature. Not a separate page view.
- studio_engagement: visible time after consent. No hidden-tab time.
- contact_submit_attempt: validated contact form, before FormSubmit CAPTCHA. Not successful delivery.
- generate_lead: return to the thank-you page with a matching single-use per-tab receipt marker created before a valid submit. Does not prove inbox delivery and is not tamper-proof server-side verification. Ordinary visits and refreshes do not count.

Google also derives standard session/new-browser/device/source reporting from the consented tag. Visitors means measured browsers/devices, not verified unique people. Consent refusals, ad blockers, changed browsers/devices, and deleted cookies affect totals and returning-user counts. GA4 does not retroactively recover traffic before installation.

## Privacy design

Basic consent mode: no Google Analytics tag or request before opt-in, and no denied-consent pings. Equal Accept/Reject choices. Advertising consent remains denied. Footer Analytics settings permit withdrawal; accessible analytics cookies are cleared and the page reloads to unload Google. Respect Global Privacy Control. Preference expires after 180 days. Contact, shop, stories, and navigation remain usable without analytics.

No names, emails, messages, full outgoing URLs, receipt tokens, or arbitrary query strings are added to custom events. URL parameters are dropped except utm_source, utm_medium, utm_campaign, utm_content with short alphanumeric/underscore/hyphen values. Referrer is origin-only. Approved campaign values are still content you control: never use someone's name/email as a campaign label.

The privacy policy documents current contact services, optional analytics, browser storage, providers, and requests. Its analytics retention wording is contingent on configuring the GA4 property as above. Consent is global rather than guessing visitors' jurisdictions. This technical design is not a determination that all privacy laws applying to the studio have been satisfied.

## Tests and activation checks

Run `node --test tests/analytics.test.cjs tests/contact-form.test.cjs`.

Before release: validate all local URLs; compare the underlying content/navigation; inspect banner at phone and desktop widths. Confirm Google requests remain absent before consent and after rejection; one tag/initial page view after acceptance; stored preference, GPC, and withdrawal work. Inspect outgoing payloads with Tag Assistant: no form data, personal query strings, raw referrer paths, or receipt token. Confirm action/project dimensions.

GA4 owner: open Realtime, accept analytics on the website, browse The Aware and project pages, select homepage slides, use Explore More, and inspect event names. Use Tag Assistant / DebugView for event details. Complete a clearly labeled genuine form test and CAPTCHA; ensure generate_lead fires once only on return. Check the contact inbox separately. Never disable CAPTCHA to test conversions.

## Phone dashboard

Use the official Google Analytics app on Android/iOS or https://analytics.google.com/ in your mobile browser. Sign in with the account owning the property and select Endure Co Studios. Use Realtime during tests. For ongoing monitoring, compare 7/28-day or calendar-month periods in Reports: acquisition, pages/screens, engagement, retention, events/key events. Dashboard names can vary with chosen reporting objectives. Standard reports may take 24–48 hours after data collection begins.

## Marketing attribution

Use lowercase consistent labels when sharing studio links. Example:
https://endurecostudios.com/stories/the-aware/?utm_source=instagram&utm_medium=social&utm_campaign=aware_preview&utm_content=excerpt_reel

Suggested sources: instagram, tiktok, youtube, substack. Keep medium values consistent (social or email). Test each destination. Direct traffic can include untagged app/social/email shares, not just typed/bookmarked addresses. These are website measurements, not native-platform reach or follower counts.

## Monthly performance report (future)

Compare each calendar month with the prior month: active/total/new/returning users, sessions, top pages, acquisition by source/medium, project exposures and clicks, engagement, confirmed form returns, Ko-fi clicks, newsletter clicks. Include absolute totals and percent changes only with a valid prior-month denominator. Treat storefront clicks as clicks, not sales: Ko-fi sales require its own transaction reports. Add the month's campaigns/content and 2–3 recommended actions. State consent/measurement limitations. No recurring automation or external report access has been configured yet.

Primary references:
- https://support.google.com/analytics/answer/14183469
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://support.google.com/analytics/answer/9216061
- https://developers.google.com/analytics/devguides/collection/protocol/ga4/policy

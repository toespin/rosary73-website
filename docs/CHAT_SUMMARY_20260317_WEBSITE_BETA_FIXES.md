# Chat Summary — March 17, 2026
## Topic: Website Beta Notice, Non-PH Payment UX, Xendit Branding

---

## 🔑 Key Context

- **Repos:** `toespin/rosary73-website` (website), `toespin/rosary73` (app)
- **Website:** `rosary73.com` — deployed via GitHub Pages (~1–2 min deploy)
- **Backend:** Firebase Cloud Functions at `https://us-central1-rosary--interact-app.cloudfunctions.net`
- **Auth function:** `functions/auth/webAuth.js`
- **Payment:** Xendit (`createXenditPaymentWeb`)
- **Session keys:** `rosary73User` (subscribe.html), `rosary73UserData` (members.html, index.html)
- **Perpetual users (hardcoded):** `['drekki', 'rissa', 'andre', 'kristin']`

---

## ✅ Completed This Session

### 1. "Rosary73 by Toespin" Branding in subscribe.html Footer
- **Why:** Xendit foreign acceptance application (Rachel, Customer Success) needed proof that `rosary73.com` and `toespin.com` belong to the same owner.
- **What was added:** Footer now shows `Rosary73 by Toespin` (linked to toespin.com) and `© 2025 Rosary73 — a product of Toespin`.
- **URL for Xendit:** `https://rosary73.com/subscribe.html` → scroll to bottom.
- **Commit:** `6c16b9491846a1436839da3db01d9e5a2dddfe08`

### 2. Xendit Email Reply (drafted)
- Explained that `toespin.com` = sole-proprietorship business, `rosary73.com` = product under Toespin.
- Directed Rachel to `https://rosary73.com/subscribe.html` footer as proof of relationship.

### 3. Beta Notice Modal on subscribe.html (page-load)
- Already existed from previous session. Shows once per browser session (`sessionStorage: betaNoticeSeen`).
- Two buttons: **✝ Apply for Free Access** → `subscribe.html?tab=free`, **Got it — show me the plans** → dismisses.

### 4. Beta Notice Modal on index.html (Subscribe button intercept)
- **Problem:** Previous `addEventListener` bubble-phase approach was being silently blocked by `enhanced.js`/`main.js` mobile nav handlers calling `stopImmediatePropagation`.
- **Root cause confirmed** via Chrome DevTools automation — `link.click()` worked programmatically, but real user clicks on nav links were intercepted by existing JS.
- **Fix:** Moved intercept to `document.addEventListener('click', handler, **true**)` in `<head>` — **capture phase**, which runs before ALL other handlers and cannot be blocked.
- Handler walks up DOM tree to find `.subscribe-intercept` anchor (catches clicks on child SVG icons too).
- Sets `betaNoticeSeen` in sessionStorage so subscribe.html won't double-show the modal.
- **All "Subscribe" links** across index.html have class `subscribe-intercept`: nav bar, Features, How It Works, App Preview, Privacy, Pricing, CTA, footer.
- **Commit:** `f4c7a0c6382c8cf5cb1a86402ee0455f358064bb`

### 5. Non-PH Auto-Select Card + "Payment Method" Rename (subscribe.html)
- **Problem:** Non-Philippines users (USD) only have Credit/Debit Card as payment option, but had to manually click the card logo box before the Subscribe button would enable.
- **Fix 1:** `updatePaymentVisibility()` now auto-sets `selectedPaymentSub/Upgrade/Gift/Donate = 'card'` and marks the card button as `.selected` for non-PH users immediately on page load.
- **Fix 2:** Subscribe/Extend/Donate action buttons now enable immediately for non-PH (no click required).
- **Fix 3:** Heading renamed from "Select Payment Method" → "Payment Method" in Subscribe tab (already correct in other tabs).
- **Fix 4:** `processPayment()` now gates non-PH users through the beta warning modal before processing (instead of the old `selectPayment()` trigger).
- **Fix 5:** `betaContinue()` now calls `processPaymentDirect(type)` instead of `applyCardSelection()`.
- **Commit:** `b8111e3ae3dbfc4e3ce78ac5273f033afe21ed3e`

### 6. Beta Banner on signup.html / index.html (IN PROGRESS — NOT YET PUSHED)
- **Decision at end of chat:** Instead of modal-based approach, add a **static always-visible beta notice banner** above the login card (index.html) and above the signup form (signup.html).
- User can see it without clicking anything — better UX for new visitors.
- **Banner location:**
  - `signup.html`: Between `<div class="signup-header">` and `<div class="form-card">`
  - `index.html`: Just above `<div class="compact-login-card">` inside `.hero-text`
- **Status: Paused — user moved to new chat. TO BE COMPLETED NEXT SESSION.**

---

## 📋 Current File SHAs (as of end of session)

| File | SHA |
|------|-----|
| `index.html` | `a3668ae30bf4722714aac89551c6f9fdb944ccec` |
| `subscribe.html` | `4ac202c7dee279783a3b84f47a41c49ad6a1af7d` |
| `signup.html` | `007a1006b1e9584893ceb0407e19409db39e7eed` |

---

## 🔧 Technical Notes

### subscribe.html Architecture
```
updatePaymentVisibility()
  └─ Non-PH: auto-sets card + calls updateSubscribeButton(), updateUpgradeButton(), updateDonateButton()

processPayment(type)        ← called by action buttons
  └─ Non-PH: shows beta modal → user confirms → processPaymentDirect(type)
  └─ PH: calls processPaymentDirect(type) directly

processPaymentDirect(type)  ← actual Xendit fetch
betaContinue()              ← calls processPaymentDirect(type)
```

### index.html Beta Intercept Architecture
```html
<head>
  <script>
    // Capture phase — fires before enhanced.js/main.js bubble handlers
    document.addEventListener('click', function(e) {
      // Walk up DOM to find a.subscribe-intercept
      // e.preventDefault() + e.stopPropagation()
      // Show #idx-beta-overlay
    }, true); // <-- capture phase
  </script>
</head>
```

### subscribe.html Beta Logic
- Page-load: `showBetaNoticeIfNeeded()` — checks `sessionStorage.betaNoticeSeen`
- Non-PH Subscribe button click: `processPayment()` shows beta modal
- Both set `betaNoticeSeen = '1'` so modal only shows once per session

---

## 🚧 Pending Items

### Immediate (Next Session)
1. **Add static beta banner to signup.html** — above `.form-card`, below `.signup-header`
2. **Add static beta banner to index.html** — above `.compact-login-card` inside `.hero-text`

### Banner HTML to use:
```html
<!-- ✦ BETA NOTICE — always visible ✦ -->
<div style="background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.45);border-radius:14px;padding:16px 18px;margin-bottom:22px;display:flex;align-items:flex-start;gap:12px;">
  <span style="background:rgba(59,130,246,0.28);border:1px solid rgba(59,130,246,0.55);color:#60a5fa;font-size:0.68rem;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;margin-top:2px;">&#128312; BETA</span>
  <span style="color:rgba(255,255,255,0.82);font-size:0.88rem;line-height:1.6;">
    <strong style="color:#fff;">We're in Beta Testing Mode</strong> — 
    <a href="subscribe.html?tab=free" style="color:#60a5fa;font-weight:600;text-decoration:none;">Apply for Free Access</a> 
    to start or join rosaries right away, or 
    <a href="subscribe.html" style="color:#60a5fa;font-weight:600;text-decoration:none;">choose a subscription plan</a> 
    anytime to support the community. &#x1F64F;
  </span>
</div>
```

### Ongoing
- Xendit foreign acceptance approval (Rachel) — awaiting response on USD card transactions
- `functions.config()` migration → **URGENT**, deadline March 2026
- Node 20 → 22 upgrade — deadline April 30, 2026
- Apple IAP certificate (renewed March 8, 2026 — see `docs/ROSARY73_TECHNICAL_DOCUMENTATION_20260308.md`)

---

## 📁 Related Docs in Repo
- `docs/ROSARY73_TECHNICAL_DOCUMENTATION_20260308_FULL.md` — full technical reference
- `docs/ROSARY73_TECHNICAL_DOCUMENTATION_20260308.md` — condensed reference
- `docs/R73_DEVELOPMENT_CONTINUITY.md` — app dev continuity file

# Rosary73 Website

Official website for the Rosary73 mobile app - an interactive audio rosary with 73 unique voices.

## 🌐 Live Site
[https://rosary73.com](https://rosary73.com) (via GitHub Pages)

## 📱 About Rosary73
Rosary73 is a revolutionary prayer app that brings together 73 different people to pray one complete rosary. Each participant records one prayer, creating a powerful community prayer experience that transcends geographical boundaries.

## 🚀 Features
- Modern, responsive design
- Mobile-first approach
- SEO optimized
- Fast loading with optimized assets
- Accessible (WCAG compliant)
- Contact form ready (configure Formspree)

## 📂 Structure
```
rosary73-website/
├── index.html          # Homepage
├── about.html          # About Us
├── faq.html           # FAQ
├── contact.html       # Contact Form
├── terms.html         # Terms of Service
├── privacy.html       # Privacy Policy
├── get/
│   └── index.html     # Smart store redirect (rosary73.com/get)
├── css/
│   ├── style.css      # Main stylesheet
│   └── faq.css        # FAQ specific styles
├── js/
│   └── main.js        # JavaScript functionality
├── images/            # Images and icons
├── .nojekyll          # Disable Jekyll processing
└── CNAME             # Custom domain
```

## 🔗 Smart Download Link — `/get`

`https://rosary73.com/get` is a single link that sends each visitor to the right
store for their device. Use it in social bios (Instagram, TikTok), QR codes and
any place that only allows one URL.

Behaviour:

| Device | Destination |
|---|---|
| iPhone / iPad | App Store — `id6753041495` |
| Android | Google Play — `com.drekkitech.rosary73` |
| Desktop / other | Branded card with both buttons |

Notes:

- iPadOS 13+ reports itself as a Mac, so detection also checks
  `navigator.maxTouchPoints` to catch iPads.
- Redirect uses `location.replace()` so the browser Back button returns the
  visitor to where they came from, not to this page.
- The page is marked `noindex, follow` — it is a redirect, not a landing page,
  and should not compete with the homepage in search results.
- Both store buttons are present in the HTML as a fallback, so the page still
  works if JavaScript is disabled.
- Source: `get/index.html`. Served at `/get` by GitHub Pages without a trailing
  slash redirect.

Verified working on iPhone and Android tablet, September 2026.

## 🛠 Setup & Development

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/toespin/rosary73-website.git
   cd rosary73-website
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Make changes and test locally

### Deployment (GitHub Pages)
1. Push changes to main branch
2. Go to Settings → Pages
3. Source: Deploy from branch (main)
4. Custom domain: rosary73.com is configured

## 📝 Configuration

### Contact Form
The contact form uses Formspree. To activate:
1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form
3. Replace `YOUR_FORM_ID` in `contact.html` with your Formspree form ID

### Domain Setup
1. Configure DNS with your domain provider:
   - A Record: `185.199.108.153`
   - A Record: `185.199.109.153`
   - A Record: `185.199.110.153`
   - A Record: `185.199.111.153`
   - CNAME: `www` → `toespin.github.io`

2. CNAME file is already configured for `rosary73.com`

## 🎨 Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-blue: #4169E1;
    --success-green: #4CAF50;
    --warning-orange: #FF9800;
    --error-red: #f44336;
}
```

### Images
Replace placeholder images in `/images/` with actual:
- `logo.svg` - Your logo
- `app-mockup.png` - App screenshots
- `favicon.png` - Browser favicon

## 📊 Analytics
To add Google Analytics:
1. Get your tracking ID from Google Analytics
2. Add the tracking code to each HTML file before `</head>`

## 🔄 Updates

### App Store Links (live)
The app is live on both stores. Canonical URLs:

```html
<!-- iOS App Store -->
<a href="https://apps.apple.com/app/id6753041495">

<!-- Google Play Store -->
<a href="https://play.google.com/store/apps/details?id=com.drekkitech.rosary73">

<!-- Or, device-agnostic -->
<a href="https://rosary73.com/get">
```

## 📱 Mobile App Repository
The mobile app source code: [github.com/toespin/rosary73](https://github.com/toespin/rosary73)

## 📧 Support
For questions or issues: support@rosary73.com

## 📄 License
© 2025 Rosary73. All rights reserved.

---

*Unite in Prayer with 73 Unique Voices*

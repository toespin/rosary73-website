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
├── css/
│   ├── style.css      # Main stylesheet
│   └── faq.css        # FAQ specific styles
├── js/
│   └── main.js        # JavaScript functionality
├── images/            # Images and icons
└── CNAME             # Custom domain
```

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

### Adding App Store Links
When your app is live, update download buttons in `index.html`:
```html
<!-- iOS App Store -->
<a href="https://apps.apple.com/app/rosary73/id[YOUR_APP_ID]">

<!-- Google Play Store -->
<a href="https://play.google.com/store/apps/details?id=com.rosary73">
```

### TestFlight Beta Link
Update the TestFlight link when available:
```html
<a href="https://testflight.apple.com/join/[YOUR_CODE]">
```

## 📱 Mobile App Repository
The mobile app source code: [github.com/toespin/rosary73](https://github.com/toespin/rosary73)

## 📧 Support
For questions or issues: support@rosary73.com

## 📄 License
© 2025 Rosary73. All rights reserved.

---

*Unite in Prayer with 73 Unique Voices*
# WEBSITE_DEV_PROMPT_SCRIPT.md - Updated December 8, 2025

## 🎯 PREVIOUS SESSION SUMMARY
**Previous Chat:** Rosary73 website professional redesign proposal
**Chat URL:** https://claude.ai/chat/9eef4196-53a7-46a0-bf56-88d7cf971f55

### Session Achievements:
1. ✅ Removed floating images from FAQ page (cleaner design)
2. ✅ Hybrid hero section - Combined modern left panel ("Unite in Prayer...") with classic carousel on right
3. ✅ Complete refinement package:
   - Carousel: 70% bigger beads, removed concentric circles, highly visible arrows (blue bg, white border)
   - Left panel: Removed fake stats, trust bar, scroll indicator
   - Features: Removed "Learn more" links
   - How It Works: Removed circles/lines, 2.5x bigger numbers
   - Fixed all button links (#how-it-works, #download)
4. ✅ Applied clean Apple-style typography (font-weight: 600, subtle shadows)
5. ✅ Professional design audit comparing to Apple.com/mac

---

## 🆕 CURRENT SESSION (December 8, 2025)

### New Features Added:
1. ✅ **Scrolling Mobile Mockup Section** - Added "Experience the App" section with 3 iPhone frames showing auto-scrolling app screenshots
   - HomeScreen mockup
   - Visual Rosary mockup
   - Record Prayers mockup

### Implementation Details:

#### Scrolling iPhone Mockup Section Features:
- **Realistic iPhone frame** with Dynamic Island/notch
- **Auto-scrolling content** - Screenshots scroll vertically inside the phone frame
- **Hover to pause** - Animation pauses when users hover over mockup
- **Different scroll speeds** - Each phone scrolls at slightly different rate for visual interest
- **Responsive design** - Works on desktop (3 phones), tablet (2+1), mobile (1 column)
- **Placeholder fallback** - If screenshots not found, displays attractive placeholder content

#### Screenshot Requirements:
Screenshots should be placed in: `images/screenshots/`
- `homescreen.png` - HomeScreen with 7 prayer beads
- `visual-rosary.png` - Visual rosary with 73 beads display  
- `record-prayers.png` - Recording interface for 7 prayers

**Recommended size:** 1170 x 2532 pixels (iPhone 14 Pro resolution)

---

## 📁 FILES MODIFIED THIS SESSION

| File | Change |
|------|--------|
| `index.html` | Added scrolling mobile mockup section with CSS animations |
| `images/screenshots/README.md` | Created - Instructions for adding screenshots |

---

## 🎨 CURRENT WEBSITE STRUCTURE

```
index.html
├── Splash Screen (tap to enter)
├── Navigation (sticky, with dark mode toggle)
├── Hero Section (hybrid: text left + carousel right)
├── Features Section (3 cards with images)
├── How It Works (3 steps with bead images)
├── 📱 NEW: App Preview Section (3 scrolling iPhone mockups)
├── Privacy Section 
├── Pricing Section
├── Download CTA
└── Footer
```

---

## 🔧 TYPOGRAPHY STATUS

Typography is already clean Apple-style:
- **Font weights:** 600 for titles, 500 for subtitles
- **Text shadows:** Subtle `0 2px 8px rgba(0,0,0,0.08)`
- **No heavy outlines or stencil effects**

---

## 📱 NEXT STEPS

1. **Take app screenshots** on iPhone using the Rosary73 app:
   - HomeScreen
   - Visual Rosary (ParticipateScreen or RosaryScreen)
   - Record Prayers (RecordPrayersScreen)

2. **Upload screenshots** to `images/screenshots/` folder with exact names:
   - `homescreen.png`
   - `visual-rosary.png`
   - `record-prayers.png`

3. **Optional enhancements:**
   - Add more mockup screens (Groups, Finished Rosaries, etc.)
   - Create animated GIF screenshots for more dynamic display
   - Add captions below each mockup

---

## 🚀 PROMPT FOR NEXT SESSION

```
Hi Claude! Continuing Rosary73 website development.

**Context:** Catholic prayer app website at https://rosary73.com
**Repository:** toespin/rosary73-website (you have full MCP access)

**Current State:**
- Hybrid hero section complete ✅
- Clean Apple-style typography ✅
- Scrolling mobile mockup section added ✅
- Screenshots folder ready (images/screenshots/)

**Next Task:** [Describe what you want to work on]

Possible tasks:
1. Add actual app screenshots to the mockup section
2. Improve animations/interactions
3. Add more pages or sections
4. Performance optimization
5. SEO improvements
```

---

## 📞 QUICK REFERENCE

**Repository:** toespin/rosary73-website
**Live URL:** https://rosary73.com
**Screenshots folder:** images/screenshots/
**Main files:** index.html, about.html, faq.html, contact.html

# Asset Placeholder Instructions

This file contains instructions for adding your actual images to the portfolio.

## Required Images

### 1. Headshot Photo
**Path**: `public/assets/headshot.png`
**Specifications**:
- Recommended size: 800×800px
- Format: PNG or JPG
- Style: Professional portrait, neutral background
- Note: Circular crop will be applied automatically
- Grayscale filter applied in the design

**Temporary Placeholder**: 
Create a simple circular portrait or use a professional photo service. The image will be displayed with an orange border and grayscale filter.

### 2. Project Thumbnails
**Path**: `public/assets/projects/`

You need 6 project images matching the projects in `data/projects.json`:

1. **project-1.jpg** - E-Commerce ML Recommender (Category: MOCKUP)
   - Size: 1200×800px
   - Style: Dashboard/UI mockup with data visualization

2. **project-2.jpg** - Brand Identity System (Category: BRANDING)
   - Size: 1200×800px
   - Style: Logo and brand colors showcase

3. **project-3.jpg** - AI Chatbot Platform (Category: VIDEO)
   - Size: 1200×800px
   - Style: Chat interface or AI visualization

4. **project-4.jpg** - Modern Logo Collection (Category: LOGO)
   - Size: 1200×800px
   - Style: Multiple logo designs on dark background

5. **project-5.jpg** - Healthcare Dashboard (Category: MOCKUP)
   - Size: 1200×800px
   - Style: Health analytics dashboard UI

6. **project-6.jpg** - SaaS Product Demo (Category: VIDEO)
   - Size: 1200×800px
   - Style: SaaS product interface screenshot

## Image Guidelines

- **Format**: JPG for photos, PNG for designs with transparency
- **Optimization**: Compress images before adding (use TinyPNG or similar)
- **Dark Theme**: Ensure images work well on dark backgrounds
- **Consistency**: Maintain similar visual style across all project images
- **Quality**: Use high-resolution images (at least 1200px wide)

## Quick Setup (Placeholder Images)

If you want to test the site before adding real images, you can:

1. Create solid color placeholders:
   - Use Figma, Photoshop, or online tools
   - Dark background with text overlay
   - Save as JPG in the required sizes

2. Use stock images:
   - Unsplash.com (free, high-quality)
   - Pexels.com (free)
   - Search for: "UI mockup", "dashboard", "tech", "minimal design"

3. Use online placeholder services:
   - https://placeholder.com/1200x800/0a0a0a/FF5A2A?text=Project+1
   - Download and rename to match project filenames

## After Adding Images

1. Verify all paths in `data/projects.json` match your filenames
2. Run `npm run dev` to see your images
3. Check that images load correctly on all project cards
4. Optimize build size with `npm run build`

---

**Note**: The site will show broken image icons until you add actual images. This is expected and will be resolved once you add the image files.

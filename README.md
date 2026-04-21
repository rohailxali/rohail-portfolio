# Noir Portfolio - Muhammad Rohail Ali

A production-ready, pixel-perfect portfolio website featuring a dark "Noir" theme built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

![Portfolio Preview](./docs/preview.png)

## 🚀 Features

- **Noir Dark Theme** - Extremely dark background (#050505) with orange accent (#FF5A2A)
- **Two-Column Layout** - Desktop layout with 62% left panel and 38% right portfolio grid
- **Smooth Animations** - Framer Motion parallax, hover effects, and page transitions
- **Fully Responsive** - Mobile-first design that scales beautifully
- **SEO Optimized** - Complete meta tags, OpenGraph, and Twitter cards
- **Accessible** - WCAG AA compliant with keyboard navigation and ARIA attributes
- **Performance** - Lighthouse score >90 with image optimization and lazy loading
- **Contact Form** - Serverless API route with email integration
- **Type Safe** - Built with TypeScript strict mode

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **UI Components**: Headless UI
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## 🛠️ Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone or extract the project**
   ```bash
   cd portfolio-noir
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for contact form)
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your SMTP credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Update Personal Information

Edit `data/personal.json`:

```json
{
  "name": "Your Name",
  "role": "Your Role",
  "tagline": "Your tagline",
  "email": "public@example.com",
  "emailFull": "actual@example.com",
  "phone": "03** ******",
  "phoneFull": "03XX XXXXXX",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "github": "https://github.com/yourusername"
}
```

### Add/Edit Projects

Edit `data/projects.json`:

```json
{
  "id": "unique-id",
  "title": "Project Name",
  "category": "BRANDING|MOCKUP|LOGO|VIDEO",
  "description": "Project description",
  "thumbnail": "/assets/projects/your-image.jpg",
  "isVideo": false,
  "tech": ["React", "Node.js"],
  "demoUrl": "https://demo.com",
  "githubUrl": "https://github.com/...",
  "gallery": ["/assets/projects/image1.jpg"]
}
```

### Add Images

Place your images in:
- **Headshot**: `public/assets/headshot.png` (800×800px recommended, circular crop will be applied)
- **Project thumbnails**: `public/assets/projects/` (1200×800px recommended)

### Modify Services

Edit `data/services.json` to add or modify service cards.

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  noir: {
    bg: '#050505',      // Main background
    panel: '#0b0b0b',   // Panel background
    // ... customize as needed
  },
  accent: {
    orange: '#FF5A2A',  // Primary accent
  },
}
```

## 📧 Contact Form Setup

The contact form requires SMTP configuration for production use.

### Option 1: Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL_TO=recipient@gmail.com
   ```

### Option 2: SendGrid / Mailgun / Resend

1. Sign up for a service (SendGrid, Mailgun, Resend)
2. Get your SMTP credentials
3. Update `.env.local` with your credentials
4. Uncomment the nodemailer code in `app/api/contact/route.ts`

### Option 3: Formspree (No Backend Required)

1. Sign up at [Formspree.io](https://formspree.io)
2. Create a form and get your endpoint
3. Modify `ContactModal.tsx` to submit to Formspree endpoint

## 🏗️ Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfolio-noir)

#### Manual Deploy

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard (if using contact form)

### Deploy to Other Platforms

- **Netlify**: Use `npm run build` and deploy `.next` folder
- **AWS Amplify**: Connect your Git repository
- **Docker**: Create a Dockerfile (example available on request)

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

## 📂 Project Structure

```
portfolio-noir/
├── app/
│   ├── api/contact/route.ts    # Contact form API
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── Nav.tsx                 # Navigation
│   ├── Hero.tsx                # Hero section
│   ├── Services.tsx            # Services grid
│   ├── Portfolio.tsx           # Portfolio masonry
│   ├── ProjectCard.tsx         # Project tile
│   ├── ProjectModal.tsx        # Project details modal
│   ├── ContactModal.tsx        # Contact form modal
│   └── Footer.tsx              # Footer
├── data/
│   ├── personal.json           # Your info
│   ├── services.json           # Services
│   └── projects.json           # Portfolio projects
├── public/assets/              # Images and static files
├── __tests__/                  # Unit tests
└── lib/                        # Utilities

```

## ♿ Accessibility

- WCAG AA compliant color contrast
- Keyboard navigation support
- Focus-visible states on all interactive elements
- ARIA labels and attributes
- Screen reader friendly
- Respects `prefers-reduced-motion`

## 🎯 Performance Tips

1. **Optimize images**: Convert to WebP format, compress before uploading
2. **Use proper image sizes**: Don't upload 4MB images for 200px thumbnails
3. **Enable caching**: Vercel does this automatically
4. **Minimize dependencies**: Only add what you need

## 🐛 Troubleshooting

### Build Errors

- Ensure Node.js version is 18.x or higher
- Delete `node_modules` and `.next`, then run `npm install` again

### Images Not Loading

- Check file paths are correct in JSON files
- Ensure images are in `public/assets/` directory
- Verify image extensions match (case-sensitive on Linux)

### Contact Form Not Working

- Check browser console for errors
- Verify `.env.local` is configured correctly
- Ensure SMTP credentials are valid
- Check Vercel environment variables are set

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Muhammad Rohail Ali**

- LinkedIn: [rohail-ali-6238613a4](https://www.linkedin.com/in/rohail-ali-6238613a4)
- GitHub: [@rohailxali](https://github.com/rohailxali)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio sites
- Built with love using Next.js and Tailwind CSS
- Icons from Heroicons and social media platforms

---

**Need help?** Open an issue or contact me through the website!

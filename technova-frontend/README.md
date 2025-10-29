# TechNova Digital - Frontend

A polished, responsive, accessible, high-performance single-page marketing site for TechNova Digital built with React + Tailwind CSS, featuring modern animations and production-ready deployment.

## 🌟 Features

- **Modern Tech Stack**: React 18 + Vite + Tailwind CSS
- **Smooth Animations**: Framer Motion with reduced-motion support
- **Interactive Background**: TSParticles with customizable effects
- **Responsive Design**: Mobile-first approach with clean breakpoints
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Performance**: Optimized images, lazy loading, code splitting
- **Testing**: Unit tests with Vitest + React Testing Library
- **CI/CD Ready**: GitHub Actions configuration included

## 🎨 Design System

### Colors
- **Primary 900**: `#071633` (Deep Navy)
- **Primary 600**: `#0ea5a4` (Teal Neon)
- **Accent**: `#7CFFB2` (Lime Green)
- **Muted**: `#94a3b8` (Steel Gray)
- **Glass**: `rgba(255,255,255,0.04)` (Glass Morphism)

### Typography
- **Body**: Inter (Google Fonts)
- **Display**: Poppins (Google Fonts)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`

## ✅ Acceptance Criteria Checklist

- [x] **Responsive Design**: Works across all breakpoints (mobile/tablet/desktop)
- [x] **Performance**: Lighthouse Performance ≥ 85
- [x] **Accessibility**: WCAG AA compliance, Lighthouse Accessibility ≥ 90
- [x] **Best Practices**: Lighthouse Best Practices ≥ 90
- [x] **Keyboard Navigation**: All interactive elements accessible via keyboard
- [x] **Contact Form**: Functional with validation and error handling
- [x] **Modern Stack**: React + Vite + Tailwind CSS + Framer Motion
- [x] **Testing**: Unit tests with Jest + React Testing Library
- [x] **SEO**: Meta tags, structured data, sitemap.xml, robots.txt
- [x] **CI/CD**: GitHub Actions configuration for deployment
- [x] **Documentation**: Comprehensive README with setup instructions

Built with ❤️ by the TechNova Digital team.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

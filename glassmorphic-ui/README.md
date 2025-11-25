# Glassmorphic UI - Angular + TailwindCSS

A modern, minimalist UI featuring clean glassmorphic design built with Angular 21 and TailwindCSS.

## ✨ Features

- **Glassmorphic Design**: Translucent cards with backdrop blur effects (20-35% opacity, 10-25px blur)
- **Custom Color Scheme**: Dark gradient backgrounds with vibrant accent colors
- **Responsive Layout**: Mobile-first responsive design
- **Reusable Components**: Pre-built glass card variants and utilities
- **Modern Stack**: Angular 21 + TailwindCSS 3

## 🎨 Design System

### Color Palette

- **Background Gradient**: `#0f172a → #1e293b → #334155`
- **Glass Backgrounds**: 
  - Light: `rgba(255,255,255,0.18)`
  - Medium: `rgba(255,255,255,0.28)`
- **Glass Border**: `rgba(255,255,255,0.4)` with 1-2px soft borders
- **Accent Colors**:
  - Blue: `#38bdf8`
  - Indigo: `#818cf8`
  - Pink: `#ec4899`
  - Mint: `#34d399`
- **Text Colors**:
  - Primary: `#f8fafc`
  - Secondary: `#cbd5e1`

### Glass Card Classes

- `.glass-card` - Standard glass card with p-6 padding, rounded-2xl
- `.glass-card-medium` - Medium glass card with p-8 padding, rounded-2xl
- `.glass-card-large` - Large glass card with p-10 padding, rounded-3xl, stronger effects

### Button Classes

- `.btn-glass` - Glassmorphic button with hover effects
- `.btn-accent-blue` - Blue accent button with glow effect
- `.btn-accent-indigo` - Indigo accent button with glow effect
- `.btn-accent-pink` - Pink accent button with glow effect

### Input Classes

- `.input-glass` - Glassmorphic input field with focus glow

### Text Utilities

- `.text-gradient-blue` - Blue to indigo gradient text
- `.text-gradient-pink` - Pink to indigo gradient text

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to the project directory
cd glassmorphic-ui

# Install dependencies
npm install

# Start the development server
ng serve
# or
npm start
```

The application will be available at `http://localhost:4200`

### Build for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
glassmorphic-ui/
├── src/
│   ├── app/
│   │   ├── app.html          # Glassmorphic UI template
│   │   ├── app.ts             # Main application component
│   │   └── app.css            # Component-specific styles
│   ├── styles.css             # Global styles with Tailwind & glass utilities
│   └── index.html             # HTML entry point
├── tailwind.config.js         # Tailwind configuration with custom tokens
└── package.json               # Dependencies
```

## 🎯 Customization

### Modifying Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  'accent-blue': '#38bdf8',     // Change accent colors
  'accent-indigo': '#818cf8',
  'accent-pink': '#ec4899',
  'accent-mint': '#34d399',
  // ... other colors
}
```

### Adjusting Blur Effects

Modify backdrop blur values in `tailwind.config.js`:

```javascript
backdropBlur: {
  'glass-sm': '10px',
  'glass-md': '15px',
  'glass-lg': '20px',
  'glass-xl': '25px',
}
```

### Creating Custom Glass Components

Use the Tailwind utilities defined in `styles.css`:

```html
<div class="glass-card hover:shadow-glow-blue transition-all duration-300">
  <h3 class="text-gradient-blue">Your Title</h3>
  <p class="text-text-secondary">Your content</p>
</div>
```

## 🎨 Design Principles

- **Generous Spacing**: p-6 to p-10 for cards
- **Soft Shadows**: Subtle drop shadows for elevation
- **Rounded Corners**: 2xl (1rem) or larger
- **Translucent Surfaces**: 20-35% opacity with backdrop blur
- **Minimalist Modern**: Clean, uncluttered interface

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with Angular 21
- Styled with TailwindCSS 3
- Inspired by modern glassmorphic design trends


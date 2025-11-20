# Iconfont Viewer

A modern, web-based iconfont viewer that allows you to inspect and explore icon fonts (TTF, WOFF, OTF, SVG) directly in your browser. Built with a warm, brutalist design aesthetic optimized for desktop use.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)

## Features

### Core Functionality
- **Drag & Drop Support** - Simply drag and drop your font files anywhere on the page
- **Multiple Format Support** - Works with TTF, WOFF, WOFF2, OTF, and SVG font files
- **Multi-Font Loading** - Load and view multiple font files simultaneously
- **Icon Grid Display** - Visual grid layout showing all glyphs/icons in each font
- **Unicode Copy** - Click to copy icon unicode values (e.g., `\ue610`) with visual feedback

### Smart History Management
- **Automatic History** - Fonts are automatically saved to browser storage
- **Persistent Storage** - Up to 2MB of font files stored locally
- **Quick Load** - Click history items to toggle fonts on/off in the viewer
- **Visual Selection** - Clear indication of which fonts are currently loaded
- **Easy Clear** - Clear all history with a confirmation dialog

### Modern Design
- **Warm Color Palette** - Orange and stone-based brutalist aesthetic
- **PC-Optimized Layout** - Fixed sidebar with scrollable main content area
- **Responsive Grid** - Displays more icons per row on larger screens
- **Copy Feedback** - Animated visual feedback when copying unicode values
- **Tooltip Support** - Hover to see full icon names when truncated

## Quick Start

### Prerequisites
- **Node.js** 20+ (check `.node-version`)
- **pnpm** package manager

### Installation

```bash
# Clone the repository
git clone git@github.com:molinla/iconfont-viewer.git
cd iconfont-viewer

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Usage

1. **Load Fonts**
   - Drag and drop font files anywhere on the page, or
   - Click "Select Files" button to browse and select files
   - Supports multiple files at once

2. **View Icons**
   - Icons are displayed in a responsive grid
   - Each icon shows its name/alias and unicode value
   - Hover over truncated names to see the full text

3. **Copy Unicode Values**
   - Click the copy button (top-right of each icon card)
   - The unicode value is copied to your clipboard
   - Visual feedback confirms successful copy

4. **Manage History**
   - Previously loaded fonts appear in the left sidebar
   - Click a history item to toggle that font on/off
   - Selected fonts are highlighted with orange styling
   - Clear all history using the trash icon

5. **Workspace Management**
   - Use "Clear Workspace" to remove all currently loaded fonts
   - History remains intact for quick reloading

## Tech Stack

### Core Technologies
- **React 18.2** - UI framework
- **TypeScript 5.3** - Type safety
- **Vite 5.1** - Build tool and dev server

### Key Libraries
- **opentype.js** - Font parsing and glyph extraction
- **lucide-react** - Icon set for UI elements
- **clsx** - Conditional className utility
- **Tailwind CSS** - Utility-first styling (with custom warm palette)

### Development Tools
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript** - Static type checking

## Project Structure

```
iconfont-viewer/
├── src/
│   ├── components/
│   │   ├── Dropzone.tsx       # Drag & drop file handler
│   │   ├── IconGrid.tsx       # Grid display of icons
│   │   ├── Dialog.tsx         # Confirmation dialogs
│   │   └── Tooltip.tsx        # Tooltip component
│   ├── utils/
│   │   ├── fontParser.ts      # Font file parsing logic
│   │   └── storage.ts         # LocalStorage management
│   ├── App.tsx                # Main application
│   ├── index.css              # Global styles & design tokens
│   └── main.tsx               # Application entry point
├── public/
│   └── favicon.svg            # Application favicon
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions deployment
└── index.html                 # HTML template with SEO tags
```

## Design System

The application uses a warm, brutalist design aesthetic with:

### Color Palette
- **Primary**: Orange (`#ea580c`) - Accent and interactive elements
- **Neutral Base**: Stone shades - Backgrounds and borders
- **Text**: Dark stone (`#292524`) - Primary text
- **Borders**: Thick (2px) borders for brutalist feel
- **Shadows**: Offset box shadows (`4px_4px_0px`) for depth

### Typography
- **Headings**: Black weight, uppercase, tight tracking
- **Body**: Medium weight, readable sizing
- **Mono**: For technical information (file names, dates, unicode)

### Interactions
- **Hover Effects**: Border color changes and shadow animations
- **Active States**: Translate and shadow adjustments
- **Transitions**: Smooth 200-300ms transitions
- **Visual Feedback**: Color changes and animations for actions

## Deployment

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Automatic Deployment
- Pushes to `main` branch trigger automatic builds
- Built files are deployed to `gh-pages` branch
- Accessible at: `https://molinla.github.io/iconfont-viewer/`

### Manual Deployment
```bash
# Build the project
pnpm build

# Deploy the dist folder to your hosting service
```

## Configuration

### Vite Configuration
The project uses a custom base path for GitHub Pages:
```typescript
// vite.config.ts
export default defineConfig({
  base: '/iconfont-viewer/',
  plugins: [react()]
})
```

### Storage Limits
- Maximum history storage: **2MB**
- Files are stored as base64 in localStorage
- Oldest items are automatically removed when limit is reached

## SEO & Meta Tags

The application includes comprehensive SEO optimization:
- Semantic HTML structure
- Meta descriptions and keywords
- Open Graph tags for social sharing
- Unique favicon
- Proper heading hierarchy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with React, TypeScript, and Vite

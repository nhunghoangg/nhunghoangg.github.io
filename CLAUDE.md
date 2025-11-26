# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio website for a voice talent (Hoàng Nhung - female voice-over artist). It's a vanilla HTML/CSS/JavaScript static site with no build step, styled with Tailwind CSS via CDN and Material Symbols icons.

**Key characteristics:**
- Single-page application with multiple sections (Hero, Demos, About, Contact)
- Content-driven by JSON data files in the `/data` directory
- Audio and video demo playback with modal dialogs
- Dark mode support via Tailwind's `dark:` utilities
- No npm/build process - just raw HTML, CSS, and vanilla JS

## Architecture & Structure

### Core Components

**HTML Structure** (`index.html`):
- Single page with 5 main sections: header, hero, demos, about, contact
- All text content is populated dynamically by JavaScript from JSON files
- Uses `id` attributes extensively for JS selectors (e.g., `#hero-title`, `#demo-items`)
- Modal dialog for audio/video playback with video iframe or custom audio player

**Data Files** (`/data/`):
- `common.json`: Site-wide content (name, nav links, footer, CTA buttons)
- `hero.json`: Hero section (title, subtitle, CTAs, profile image)
- `demos.json`: Demo items with categories, filtering, and media embeds
- `about.json`: About section (description, features, image)
- `contact.json`: Contact info (email, Zalo, Facebook links)

Each load function (`loadCommon()`, `loadHero()`, etc.) fetches its JSON and populates the corresponding DOM elements.

**Styling**:
- Tailwind CSS via CDN with custom theme extension in `<script id="tailwind-config">`
- Custom colors: primary (#004d40), secondary (#c5a773), light/dark backgrounds
- Custom fonts: Montserrat (display), Merriweather (body)
- Minimal CSS in `styles/style.css` - mostly fade-in animations and Material Symbols config

**JavaScript** (`scripts/main.js`):
- Loads all data on page load via `fetchData()` helper
- Category filtering for demo items with dynamic rendering
- Modal system for video (iframe) and audio (custom player) playback
- Audio player controls: play/pause, rewind/forward 10s, progress bar, time display
- Intersection Observer for fade-in section animations
- Dark mode works automatically via Tailwind config

### Key Functions

- `fetchData(file)`: Fetches JSON from `/data/` folder
- `loadCommon()`, `loadHero()`, `loadDemos()`, `loadAbout()`, `loadContact()`: Data loading & DOM population
- `openModal(embedUrl, type, title, desc, thumbnail)`: Opens video or audio player modal
- `setupModal()`: Attaches modal close handlers (click, Escape key)
- `renderCategories()`, `renderItems()`: Demo section filtering and rendering
- `getDriveId(url)`: Extracts Google Drive file ID for audio download

## Common Development Tasks

### Updating Content
Edit the corresponding JSON file in `/data/`:
- `common.json`: Change site title, nav links, footer
- `hero.json`: Change hero copy, CTAs, or profile image URL
- `demos.json`: Add/remove/edit demo items, categories
- `about.json`: Update bio, features, profile image
- `contact.json`: Update contact methods

### Adding a New Demo Item
Edit `data/demos.json` and add to the `items` array:
```json
{
  "title": "Demo Title",
  "category": "TVC",
  "description": "Short description",
  "thumbnail": "assets/thumbnail.png",
  "embedUrl": "https://drive.google.com/file/d/.../preview",
  "type": "video"  // or "audio"
}
```

For audio files, the `embedUrl` must be a Google Drive link (format: `/d/FILE_ID/`). The code extracts the ID and converts it to a download URL.

### Adding a New Category
Edit `data/demos.json`, add the category name to the `categories` array. The JS will auto-generate filter buttons.

### Styling Changes
- Modify `index.html` Tailwind classes directly or add to `styles/style.css`
- Update theme colors in the `<script id="tailwind-config">` block
- Custom animations live in `styles/style.css` (.fade-in-section)

### Debugging
- Check browser console for fetch errors (common if JSON paths are wrong)
- Audio player issues: verify Google Drive link format and that the file is publicly accessible
- Modal not showing: check `#media-modal` visibility and z-index conflicts

## Notable Quirks & Implementation Details

1. **Audio Player**: Uses Google Drive as the backend. The embed URL must match `/d/FILE_ID/` pattern for the extraction to work. It then converts to a direct download URL: `https://docs.google.com/uc?export=download&id=FILE_ID`

2. **Modal Styling**: Dynamically changes classes based on content type:
   - Video: `max-w-4xl aspect-video bg-black`
   - Audio: `max-w-md aspect-auto bg-white dark:bg-gray-900`

3. **Dark Mode**: Works via Tailwind's `dark:` prefix applied to body. No manual theme toggle in current code (relies on system preference).

4. **JSON Loading**: All data loads asynchronously. If a JSON file is missing, that section will be blank (caught by try-catch in `fetchData`).

5. **Intersection Observer**: Fade-in animations only work on elements with `fade-in-section` class. The threshold is 0.1 (10% visible).

## Files Not to Edit
- `.git/` - version control directory
- `assets/` - images (edit JSON to change URLs instead)
- `screen.png` - screenshot

## Performance Considerations
- No minification or bundling - all code sent as-is
- Tailwind CDN loaded from CDN (cached by browser)
- JSON files are small, loaded on-demand
- Media embeds (Google Drive) depend on external services

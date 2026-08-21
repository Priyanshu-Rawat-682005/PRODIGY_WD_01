# Wavefold - Landing Page

## About

This is a responsive landing page I made for a hardware synthesizer module called Wavefold (a Eurorack complex oscillator). I built this project using plain HTML, CSS, and Vanilla JavaScript. 

The main feature of the page is an interactive patchbay section where users can drag control knobs (Fold, Shape, Drive) or use keyboard arrow keys to alter a real-time SVG waveform animation.

## Features

- **Interactive Synth Knobs**: You can drag the Fold, Shape, and Drive knobs up and down with your mouse or use arrow keys on your keyboard to change values. Double-clicking resets a knob to default.
- **Live SVG Waveform Animation**: The waveform display updates dynamically in real-time based on the knob values using JavaScript sine math and quadratic curves.
- **Dynamic Navigation Cable**: A colored cable indicator smoothly slides under the active navigation link based on the section currently visible on the screen.
- **Card 3D Tilt Effect**: The module feature cards slightly tilt in 3D space when you move your cursor over them.
- **Hero Spotlight**: A subtle radial gradient spotlight follows the mouse movement in the hero header.
- **Responsive Layout**: Works on desktop and mobile screens with a collapsible mobile hamburger menu.
- **Reduced Motion Support**: Respects system `prefers-reduced-motion` settings by turning off heavy animations for users who prefer reduced motion.

## Technologies Used

- **HTML5**: Page structure and semantic layout.
- **CSS3**: Layout design using Flexbox and CSS Grid, CSS custom variables, and responsive media queries.
- **JavaScript (Vanilla ES6)**: DOM manipulation, event listeners for mouse/touch/keyboard, IntersectionObserver, and SVG path math calculation.
- **Google Fonts**: Space Grotesk, Inter, and IBM Plex Mono for typography.

## How to Run

1. Clone or download this repository to your computer:
   ```bash
   git clone https://github.com/your-username/wavefold-landing-page.git
   ```
2. Navigate into the project folder:
   ```bash
   cd wavefold-v2
   ```
3. Open `index.html` in your web browser (or use the Live Server extension in VS Code). No installation or build steps are required.

## How It Works

- `index.html` sets up the structural layout of the landing page, including the navigation menu, hero section with SVG path element, module cards, process timeline, quotes, and preorder section.
- `styles.css` handles the dark theme color palette, layout grids, typography, knob styling, hover states, and responsive design breakpoints.
- `script.js` contains all interactive logic:
  - Tracks pointer dragging and keyboard inputs to change knob values (`fold`, `shape`, `drive`).
  - Calculates 96 wave coordinates using sine functions combined with shape distortion and drive multiplier.
  - Converts coordinates into a smooth SVG path using quadratic curve commands (`Q`).
  - Uses `requestAnimationFrame` to continuously increment the wave phase for an oscilloscope effect.
  - Uses `IntersectionObserver` to highlight the active section in the navigation bar.

## Project Structure

```text
wavefold-v2/
├── index.html    # Main page layout and structural markup
├── styles.css    # Custom CSS styles, themes, and responsive design
├── script.js     # Knob drag logic, SVG waveform rendering, and UI interactions
└── README.md     # Project documentation
```

## Future Improvements

- Add Web Audio API support so turning the knobs produces actual audio output.
- Add preset buttons (like "Warm Bell", "Overdrive", "Pure Sine") to quickly set knob positions.
- Save user knob settings in `localStorage` so they stay set when reloading the page.

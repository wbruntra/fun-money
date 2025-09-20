
# Fun Money

Fun Money is a simple, installable Progressive Web App (PWA) for tracking your personal fun budget using a marble system. Each marble represents a fixed amount of money, and you can log your spending, add funds, and visualize your available budget in a playful way.

## Features

- 📱 **Installable PWA**: Works offline and can be installed on Android devices and desktops.
- 🫙 **Marble System**: Each marble represents a set amount (default: 4€). Your daily budget is tracked as marbles.
- 💸 **Spending Log**: Record, view, and delete spending entries with notes and dates.
- ➕ **Add Funds**: Add money to your budget and see it reflected as marbles.
- 📊 **Automatic Budgeting**: Marbles are automatically added each day based on your daily budget.
- ☁️ **Local Storage**: All data is stored locally in your browser for privacy.
- 🚀 **Deploys to GitHub Pages**: Easily host your app for free using GitHub Pages.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Deploy to GitHub Pages

Make sure your repository is public and you have set the correct `homepage` in `package.json`.

```bash
npm run deploy
```

The app will be published to the `gh-pages` branch and available at:

```
https://wbruntra.github.io/fun-money/
```

## PWA Installation

- On Android: Open the app in Chrome, tap the menu, and select "Add to Home screen".
- On desktop: In Chrome/Edge, click the install icon in the address bar.

## Customization

- **Marble Value & Daily Budget**: Change the values in `src/App.jsx` if you want a different marble value or daily budget.
- **Icons & Theme**: Update `public/vite.svg` and `vite.config.js` for custom icons and colors.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [gh-pages](https://www.npmjs.com/package/gh-pages)

## License

MIT

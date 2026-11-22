import { createGlobalStyle, css } from 'styled-components';

const darkTokens = css`
  --bg: #121418;
  --surface: #1b1e24;
  --surface-2: #23272f;
  --text: #ecebe7;
  --text-muted: #9a9fa9;
  --border: #2c3039;
  --border-strong: #3b414c;

  --accent: #2cc2b0;
  --accent-hover: #4fd6c5;
  --accent-soft: rgba(44, 194, 176, 0.13);
  --accent-contrast: #0b1f1c;
  --gold: #e3b45c;
  --gold-soft: rgba(227, 180, 92, 0.14);
  --muted-soft: #22252c;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 14px -2px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 24px 48px -12px rgba(0, 0, 0, 0.7);

  color-scheme: dark;
`;

const GlobalStyle = createGlobalStyle`
  :root {
    --font-ui: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;

    --bg: #f5f2ec;
    --surface: #ffffff;
    --surface-2: #ece8df;
    --text: #1d2129;
    /* At least 4.5:1 (WCAG AA) on every light surface, --surface-2 included. */
    --text-muted: #62666f;
    --border: #e2ddd2;
    --border-strong: #cfc8ba;

    --accent: #0f766e;
    --accent-hover: #0b5f58;
    --accent-soft: #e2f1ee;
    --accent-contrast: #ffffff;
    --gold: #b7791f;
    --gold-soft: #f8edd8;
    --muted-soft: #eceae6;

    --shadow-sm: 0 1px 2px rgba(29, 33, 41, 0.06), 0 1px 3px rgba(29, 33, 41, 0.06);
    --shadow-md: 0 4px 12px -2px rgba(29, 33, 41, 0.1), 0 2px 4px rgba(29, 33, 41, 0.05);
    --shadow-lg: 0 24px 48px -12px rgba(29, 33, 41, 0.28);

    --radius-sm: 10px;
    --radius: 16px;
    --radius-lg: 22px;

    color-scheme: light;
  }

  /* Dark colours apply when the device prefers dark and the player hasn't
     forced light, or when they forced dark (see src/theme.js). Paper always
     gets the light colours. */
  @media screen and (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) {
      ${darkTokens}
    }
  }

  @media screen {
    :root[data-theme='dark'] {
      ${darkTokens}
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-ui);
    font-size: 15px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, p {
    margin: 0;
  }

  button {
    font: inherit;
    color: inherit;
  }

  a {
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  @media print {
    body {
      background: #fff;
    }
    [data-print-hide] {
      display: none !important;
    }
  }
`;

export default GlobalStyle;

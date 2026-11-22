import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { applyTheme, loadTheme, nextTheme, saveTheme } from '../theme';
import Button from './Button';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';

const LABELS = { system: 'Device setting', light: 'Light', dark: 'Dark' };
const ICONS = { system: MonitorIcon, light: SunIcon, dark: MoonIcon };

const Square = styled(Button)`
  width: 34px;
  padding: 0;
`;

// One button that cycles device setting → light → dark. The icon shows the
// current choice; the label says what a press will switch to.
const ThemeToggle = () => {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  const next = nextTheme(theme);
  const Icon = ICONS[theme];
  const label = `Theme: ${LABELS[theme]}. Switch to ${LABELS[next].toLowerCase()}`;

  return (
    <Square
      $variant="ghost"
      $size="sm"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      data-print-hide
    >
      <Icon size={16} />
    </Square>
  );
};

export default ThemeToggle;

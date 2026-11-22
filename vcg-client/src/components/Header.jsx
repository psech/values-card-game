import styled from 'styled-components';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { LogoMark, RestartIcon } from './icons';

// Deliberately shows no stepper: players shouldn't know how many rounds of
// narrowing are coming, or they'd aim for a top 3 straight away.
const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: saturate(1.4) blur(12px);
  -webkit-backdrop-filter: saturate(1.4) blur(12px);
  border-bottom: 1px solid var(--border);
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  height: 68px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

const Tools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RestartLabel = styled.span`
  @media (max-width: 479px) {
    display: none;
  }
`;

const Header = ({ onRestart }) => (
  <Bar>
    <Inner>
      <Brand>
        <LogoMark />
        <span>Values Card Game</span>
      </Brand>
      <Tools>
        <ThemeToggle />
        <Button
          $variant="ghost"
          $size="sm"
          onClick={onRestart}
          aria-label="Start over"
          data-print-hide
        >
          <RestartIcon size={16} />
          <RestartLabel>Start over</RestartLabel>
        </Button>
      </Tools>
    </Inner>
  </Bar>
);

export default Header;

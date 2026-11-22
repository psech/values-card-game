import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: var(--accent);
    color: var(--accent-contrast);
    box-shadow: var(--shadow-sm);

    &:hover:not(:disabled) {
      background: var(--accent-hover);
    }
  `,
  secondary: css`
    background: var(--surface);
    border-color: var(--border);
    box-shadow: var(--shadow-sm);

    &:hover:not(:disabled) {
      border-color: var(--border-strong);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--text-muted);

    &:hover:not(:disabled) {
      background: var(--surface-2);
      color: var(--text);
    }
  `,
};

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $size }) => ($size === 'sm' ? '34px' : '44px')};
  padding: 0 ${({ $size }) => ($size === 'sm' ? '14px' : '22px')};
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: ${({ $size }) => ($size === 'sm' ? '14px' : '15px')};
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease,
    opacity 0.15s ease, transform 0.1s ease;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $variant = 'secondary' }) => variants[$variant]}
`;

export default Button;

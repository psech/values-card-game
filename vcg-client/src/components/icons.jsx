const Icon = ({ children, size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
  </Icon>
);

export const ArrowLeftIcon = (props) => (
  <Icon {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </Icon>
);

export const ArrowRightIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Icon>
);

export const RestartIcon = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);

export const PrintIcon = (props) => (
  <Icon {...props}>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 14h12v8H6z" />
  </Icon>
);

export const LogoMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect
      x="5"
      y="7"
      width="16"
      height="21"
      rx="3.5"
      transform="rotate(-12 13 17.5)"
      fill="var(--gold)"
      opacity="0.85"
    />
    <rect x="11" y="4" width="16" height="21" rx="3.5" fill="var(--accent)" />
    <path
      d="M19 10.2c-1-1.4-3.6-1.2-3.6 1.1 0 2 3.6 4.2 3.6 4.2s3.6-2.2 3.6-4.2c0-2.3-2.6-2.5-3.6-1.1z"
      fill="var(--accent-contrast)"
    />
  </svg>
);

export const SunIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Icon>
);

export const MoonIcon = (props) => (
  <Icon {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Icon>
);

export const MonitorIcon = (props) => (
  <Icon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </Icon>
);

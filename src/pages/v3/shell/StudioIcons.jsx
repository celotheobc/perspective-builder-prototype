export function StudioTabIcon({ kind, size = 14 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };

  if (kind === 'grid') {
    return (
      <svg {...props}>
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    );
  }

  if (kind === 'perspective') {
    return (
      <svg {...props}>
        <rect x="6" y="2" width="4" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 4.5v1.5M4 6h8M4 6v2M12 6v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <rect x="3" y="8" width="3.5" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9.5" y="8" width="3.5" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    );
  }

  if (kind === 'process') {
    return (
      <svg {...props}>
        <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.25" />
        <path d="M6 7.2l3.5-2M6 8.8l3.5 2" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    );
  }

  if (kind === 'object') {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M6 4V3h4v1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function SectionIcon({ kind, size = 14 }) {
  return <StudioTabIcon kind={kind === 'event' ? 'object' : kind} size={size} />;
}

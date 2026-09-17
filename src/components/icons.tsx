export function IconHome({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 9.5L10 3L17 9.5V17H12V12H8V17H3V9.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconGrid({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <path d="M11 3V19M3 11H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M18 18L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3 18c0-4 3.5-6.5 7-6.5s7 2.5 7 6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBag({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M5 7H15L14.3 18H5.7L5 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 7V5.5C7 3.5 8.3 2 10 2C11.7 2 13 3.5 13 5.5V7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHand({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 12V5.5a1.5 1.5 0 013 0V11M10 11V4a1.5 1.5 0 013 0v7M13 11V5.5a1.5 1.5 0 013 0V12M16 12V8a1.5 1.5 0 013 0v6c0 3.5-2 7-6.5 7S5 19 5 15.5V13l-1.8-2.3A1.3 1.3 0 015 8.6L7 11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12L9 17L15 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 15L15 20L21 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBox({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 8L12 4L20 8V16L12 20L4 16V8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M4 8L12 12L20 8M12 12V20" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

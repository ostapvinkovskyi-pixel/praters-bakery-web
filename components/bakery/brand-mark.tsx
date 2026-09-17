// The owner's rolling-pin mark, redrawn as inline SVG so it stays crisp.
export function RollingPin({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 120 20" fill="currentColor">
      <rect x="0" y="7" width="22" height="6" rx="3" />
      <circle cx="3" cy="10" r="3.2" />
      <rect x="20" y="1" width="80" height="18" rx="9" />
      <rect x="98" y="7" width="22" height="6" rx="3" />
      <circle cx="117" cy="10" r="3.2" />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <span className="pb-lockup">
      <span className="pb-lockup__name">Praters Bakery</span>
      <RollingPin className="pb-lockup__pin" />
    </span>
  );
}

export default function Logo({ className = "h-7 w-7" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="6" width="32" height="38" rx="4" fill="#6366F1"/>
      <rect x="12" y="2" width="32" height="38" rx="4" fill="#8B5CF6" opacity="0.85"/>
      <path d="M18 16h20M18 24h20M18 32h12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// src/components/StickyActionBar.jsx
// Minimal sticky action bar used on mobile to keep the primary CTA visible.
// Reuses the same styling convention as your existing index.css (.sticky-bar).

export default function StickyActionBar({ children }) {
  return (
    <div className="sticky-bar md:static md:p-0 md:bg-transparent">
      <div className="container flex gap-2 justify-end">
        {children}
      </div>
    </div>
  );
}

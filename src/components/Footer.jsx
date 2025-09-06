import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} OnDevicePDF. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link className="nav-link" to="/tools">Tools</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/faq">FAQ</Link>
          <Link className="nav-link" to="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}

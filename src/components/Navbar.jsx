import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const link = ({isActive}) => isActive ? "nav-link font-semibold text-brand-700" : "nav-link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Logo/>
        <nav className="flex items-center gap-6">
          <NavLink to="/tools" className={link}>Tools</NavLink>
          <NavLink to="/about" className={link}>About</NavLink>
          <NavLink to="/faq" className={link}>FAQ</NavLink>
        </nav>
      </div>
    </header>
  );
}

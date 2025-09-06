import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="container h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-brand">OnDevicePDF</Link>
        <div className="flex items-center gap-6 text-sm">
          <NavLink className="navlink" to="/tools">Tools</NavLink>
          <NavLink className="navlink" to="/about">About</NavLink>
          <NavLink className="navlink" to="/faq">FAQ</NavLink>
          <NavLink className="navlink" to="/blog">Blog</NavLink>
          <NavLink className="navlink" to="/contact">Contact</NavLink>
        </div>
      </nav>
    </header>
  )
}

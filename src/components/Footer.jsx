import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="border-t border-slate-200 mt-20">
      <div className="container py-10 text-sm text-slate-600 flex flex-wrap items-center justify-between gap-4">
        <p>© 2025 OnDevicePDF. All rights reserved.</p>
        <nav className="flex items-center gap-5">
          <Link className="link" to="/tools">Tools</Link>
          <Link className="link" to="/about">About</Link>
          <Link className="link" to="/faq">FAQ</Link>
          <Link className="link" to="/contact">Contact</Link>
          <Link className="link" to="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  )
}

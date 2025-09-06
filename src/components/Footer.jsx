import { Link } from 'react-router-dom'
export default function Footer(){
  return (
    <footer className="border-t mt-14">
      <div className="container py-8 text-sm text-slate-600 flex flex-wrap gap-4 items-center">
        <div>© {new Date().getFullYear()} OnDevicePDF. All rights reserved.</div>
        <nav className="ml-auto flex gap-4">
          <Link to="/tools">Tools</Link><Link to="/about">About</Link><Link to="/faq">FAQ</Link><Link to="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  )
}

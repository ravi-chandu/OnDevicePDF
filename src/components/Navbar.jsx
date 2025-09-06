import { Link, NavLink } from 'react-router-dom'
export default function Navbar(){
  const N = ({to, children}) => (
    <NavLink to={to} className={({isActive})=>'px-3 py-2 text-sm '+(isActive?'text-black font-medium':'text-slate-600 hover:text-black')}>{children}</NavLink>
  )
  return (
    <header className="border-b bg-white">
      <div className="container h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-blue-700">OnDevicePDF</Link>
        <nav className="flex items-center">
          <N to="/tools">Tools</N><N to="/about">About</N><N to="/faq">FAQ</N><N to="/blog">Blog</N><N to="/contact">Contact</N>
        </nav>
      </div>
    </header>
  )
}

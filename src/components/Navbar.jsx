import { NavLink, Link } from "react-router-dom";

export default function Navbar(){
  const active = ({isActive}) => "navlink " + (isActive ? "active" : "");
  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="logo" style={{fontWeight:700,fontSize:'1.05rem'}}>OnDevicePDF</Link>
        <nav className="navlinks">
          <NavLink to="/tools" className={active}>Tools</NavLink>
          <NavLink to="/about" className={active}>About</NavLink>
          <NavLink to="/faq" className={active}>FAQ</NavLink>
        </nav>
      </div>
    </header>
  );
}

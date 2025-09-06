import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className="footer">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
        <span>© {new Date().getFullYear()} OnDevicePDF. All rights reserved.</span>
        <nav style={{display:'flex',gap:'12px'}}>
          <Link to="/tools">Tools</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <a href="/privacy.html">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}

import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Brand acts as Home */}
        <Link to="/" className="font-semibold text-lg flex items-center gap-2">
          <span role="img" aria-label="logo">📄</span> OnDevicePDF
        </Link>

        {/* Right-aligned nav */}
        <div className="flex items-center gap-6">
          <NavLink to="/tools" className={({isActive}) => isActive ? "font-medium text-black" : "text-gray-600 hover:text-black"}>
            Tools
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "font-medium text-black" : "text-gray-600 hover:text-black"}>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

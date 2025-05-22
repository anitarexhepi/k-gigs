import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#6b8f71] text-white px-6 py-4 flex items-center justify-between shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center space-x-2">
        {/*<img src="/img/logo.png" alt="K-Gigs Logo" className="w-8 h-8" />*/}
        <span className="text-xl font-bold">K-Gigs</span>
      </div>

      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="hover:text-[#d3e4cd] transition">Home</Link>
        <Link to="/about" className="hover:text-[#d3e4cd] transition">About Us</Link>
        <Link to="/contact" className="hover:text-[#d3e4cd] transition">Contact Us</Link>
        <Link to="/gigs" className="hover:text-[#d3e4cd] transition">Gigs</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-white hover:text-[#d3e4cd] transition">Log In</Link>
        <Link to="/signup" className="text-white hover:text-[#d3e4cd] transition">Sign Up</Link>
        <Link
          to="/post-gig"
          className="bg-[#5e7f63] hover:bg-[#a5c4aa] text-white font-semibold px-4 py-2 rounded transition duration-200"
        >
          Post a Gig
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;



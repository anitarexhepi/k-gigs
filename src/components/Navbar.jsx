import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-zinc-100 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
       <h1 className="text-xl font-bold text-green-600">K-Gigs</h1>
       <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-green-600">About Us</Link>
        <Link to="/contact" className="text-gray-700 hover:text-green-600">Contact Us</Link>
        <Link to="/gigs" className="text-gray-700 hover:text-green-600">Gigs</Link>
        <Link
          to="/signup"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

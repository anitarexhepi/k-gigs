import React, { useRef, useState, useEffect } from 'react';
import {
  FaLaptopCode, FaPaintBrush, FaBullhorn, FaFileAlt,
  FaVideo, FaRobot, FaHeadphones, FaBriefcase, FaClipboard,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const categories = [
  { name: 'Programim & Teknologji', icon: <FaLaptopCode size={40} className="text-green-700" /> },
  { name: 'Grafikë & Dizajn', icon: <FaPaintBrush size={40} className="text-green-700" /> },
  { name: 'Marketing Digjital', icon: <FaBullhorn size={40} className="text-green-700" /> },
  { name: 'Shkrim & Përkthim', icon: <FaFileAlt size={40} className="text-green-700" /> },
  { name: 'Video & Animacion', icon: <FaVideo size={40} className="text-green-700" /> },
  { name: 'Shërbime AI', icon: <FaRobot size={40} className="text-green-700" /> },
  { name: 'Muzikë & Audio', icon: <FaHeadphones size={40} className="text-green-700" /> },
  { name: 'Biznes', icon: <FaBriefcase size={40} className="text-green-700" /> },
  { name: 'Konsulencë', icon: <FaClipboard size={40} className="text-green-700" /> },
];

const ServiceCategories = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#e6f0e4] py-12 px-6 relative">
      {/* Arrows */}
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full p-2 z-10"
        >
          <FaChevronLeft className="text-green-700" />
        </button>
      )}
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full p-2 z-10"
        >
          <FaChevronRight className="text-green-700" />
        </button>
      )}

      {/* Scrollable Category Cards */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-2 transition-all"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="min-w-[160px] bg-white hover:bg-green-50 border border-green-100 rounded-xl shadow p-4 flex flex-col items-center text-center transition"
          >
            <div className="mb-2">{category.icon}</div>
            <p className="text-sm font-medium text-green-800">{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCategories;

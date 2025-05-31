'use client';

import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  

  return (
    <nav className="bg-purple-800 text-white px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span className="tracking-widest">QUIZARD</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          {[
            { label: "Home", href: "/" },
            { label: "Quizzes", href: "/quizzes" },
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-yellow-300 transition"
            >
              {item.label}
            </a>
          ))}

          {/* Category */}
          <div className="flex items-center gap-1 hover:text-yellow-300 cursor-pointer transition">
            <select className="bg-transparent border-none outline-none">
              <option>Category</option>
              <option>Science</option>
              <option>Math</option>
            </select>
          </div>

          {/* User Dropdown */}
          <div className="flex items-center gap-1 hover:text-yellow-300 cursor-pointer transition">
            <span>Krishna Murari</span>
            <MdKeyboardArrowDown className="text-lg" />
          </div>

          {/* Coin display */}
          <div className="flex items-center gap-1 bg-purple-700 border border-white rounded-full px-3 py-1 text-sm font-semibold">
            <FaCoins className="text-yellow-400" />
            <span>68</span>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden flex flex-col gap-4 mt-4 px-4 pb-4 text-sm font-medium bg-purple-900 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {[
              { label: "Home", href: "/" },
              { label: "Quizzes", href: "/quizzes" },
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "About Us", href: "/about" },
              { label: "Contact Us", href: "/contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-yellow-300 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <div className="flex items-center gap-1 hover:text-yellow-300 cursor-pointer transition">
              <span>Category</span>
              <MdKeyboardArrowDown className="text-lg" />
            </div>

            <div className="flex items-center gap-1 hover:text-yellow-300 cursor-pointer transition">
              <span>Krishna Murari</span>
              <MdKeyboardArrowDown className="text-lg" />
            </div>

            <div className="flex items-center gap-1 bg-purple-700 border border-white rounded-full px-3 py-1 text-sm font-semibold w-fit">
              <FaCoins className="text-yellow-400" />
              <span>68</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

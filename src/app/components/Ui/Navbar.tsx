"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Image from "next/image";

// 🔹 Define navigation links
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "New Arrivals ", href: "/newarrivals" },
  { name: "Contact", href: "/contact-Us" },
];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // GSAP animations for entry (desktop)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(linksRef.current?.children || [], {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.3,
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.classList.add(
            "bg-white/90",
            "backdrop-blur-md",
            "shadow-lg"
          );
        } else {
          navRef.current.classList.remove(
            "bg-white/90",
            "backdrop-blur-md",
            "shadow-lg"
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full fixed top-4 flex justify-center z-50 transition-all duration-300">
      <div
        ref={navRef}
        className="flex items-center justify-between w-[95%] max-w-6xl px-4 md:px-10 py-3 rounded-full border border-gray-200 bg-gray-100/80 transition-all duration-300"
      >
        {/* Logo */}
        <div
          ref={logoRef}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
                    <Image
                      src="/images/logo/main logo.jpg"
                      alt="Next Win Logo"
                      width={50}
                      height={50}
                      className="object-contain"
                    />
        </div>

        {/* Links (Desktop) */}
        <div
          ref={linksRef}
          className="hidden md:flex items-center gap-6 lg:gap-10 text-green-900 font-medium"
        >
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Link
                href={link.href}
                className="transition-colors duration-300 hover:text-orange-600 capitalize"
              >
                {link.name}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </motion.div>
          ))}
        </div>

        {/* Right side (Desktop) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-green-900">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href="/login"
              className="transition-colors duration-300 hover:text-orange-600"
            >
              log in
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ rotate: -10, scale: 1.2 }}
            className="relative flex items-center cursor-pointer"
          >
            <Heart size={22} className="hover:text-orange-600 transition" />
            <span className="absolute -top-2 -right-3 bg-green-900 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-20 w-[90%] max-w-sm bg-white shadow-lg rounded-xl p-6 flex flex-col gap-6 text-green-900 font-medium md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors duration-300 hover:text-orange-600 capitalize"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="transition-colors duration-300 hover:text-orange-600"
            onClick={() => setMenuOpen(false)}
          >
            log in
          </Link>
          <div className="flex items-center gap-3 cursor-pointer">
            <Heart size={22} className="hover:text-orange-600 transition" />
            <span>Wishlist (0)</span>
          </div>
        </div>
      )}
    </nav>
  );
}

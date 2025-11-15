"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "./MegaMenu";
import { FiMenu, FiX } from "react-icons/fi";
import NavUser from "./NavUser";


const navLinks = [
  { title: "New In", href: "#", hasMenu: true },
  { title: "Ready to Wear", href: "#", hasMenu: true },
  { title: "Trinted T-shirt", href: "/shop" },
  { title: "Costmize T-shirt", href: "/contact-Us" },
  // { title: "Tops", href: "#", hasMenu: true },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMouseEnter = (title: string) => setActiveMenu(title);

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isHoveringMenu) setActiveMenu(null);
    }, 100);
  };

  return (
    <nav className="relative capitalize text-black z-50 border-b border-gray-200 bg-white">
      {/* --- TOP BAR --- */}
      <div className="w-full bg-gray-100 text-black text-xs py-2 tracking-wide flex items-center justify-between px-4 sm:px-6">
        <div>Shopping in India 🇮🇳</div>

        {/* Icons on Right */}
        <div className="flex items-center  gap-5">
          <button className="text-black cursor-pointer hover:text-gray-700">
            <i className="ri-search-line cursor-pointer text-base" />
          </button>
            {/* 👇 Insert NavUser here */}
           <NavUser />
          <Link
            href="/auth/createaccount"
            className="flex items-center cursor-pointer text-black hover:text-gray-500 gap-1"
          >
            <i className="ri-user-line text-base" />
            <span>Create Account</span>
          </Link>
          <button className="text-black hover:text-gray-700">
            <i className="ri-shopping-bag-line text-base" />
          </button>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <div className="flex items-center justify-between py-3 px-4 sm:px-6 md:px-10">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/nav-logo.svg"
            alt="Next Win Logo"
            width={10}
            height={10}
            className="object-contain w-32 sm:w-40 md:w-48"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex justify-center flex-1">
          <ul className="flex gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <li
                key={link.title}
                className="relative"
                onMouseEnter={() => link.hasMenu && handleMouseEnter(link.title)}
                onMouseLeave={() => link.hasMenu && handleMouseLeave()}
              >
                <a
                  href={link.href}
                  className="hover:text-black transition-colors"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-md text-2xl text-black hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <div key={link.title}>
                <a
                  href={link.href}
                  className="block py-2 text-base font-medium text-gray-800 hover:text-black transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.title}
                </a>
                {link.hasMenu && (
                  <div className="pl-4 text-sm text-gray-600">Subcategories →</div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DESKTOP MEGA MENU --- */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="hidden lg:block absolute left-0 top-full w-screen bg-white text-black border-t border-gray-100 shadow-lg z-40"
            onMouseEnter={() => setIsHoveringMenu(true)}
            onMouseLeave={() => {
              setIsHoveringMenu(false);
              setActiveMenu(null);
            }}
          >
            <div className="mx-auto max-w-7xl px-10 py-6">
              {activeMenu === "Ready to Wear" && (
                <MegaMenu category="readyToWear" />
              )}
              {activeMenu === "Accessories" && (
                <MegaMenu category="accessories" />
              )}
              {activeMenu === "New In" && <MegaMenu category="newIn" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

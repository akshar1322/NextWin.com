"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import gsap from "gsap";
import { motion } from "framer-motion";

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // GSAP animations for entry
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

  // Navbar scroll effect (keeps rounded)
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
    <nav
      className="w-full fixed top-4 flex justify-center z-50 transition-all duration-300"
    >
      <div
        ref={navRef}
        className="flex items-center justify-between w-[95%] max-w-6xl px-10 py-3 rounded-full border border-gray-200 bg-gray-100/80 transition-all duration-300"
      >
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-2 cursor-pointer">
          <div className="bg-green-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg">
            *
          </div>
          <span className="text-green-900 font-bold text-2xl">Next Win</span>
        </div>

        {/* Links */}
        <div
          ref={linksRef}
          className="flex items-center gap-10 text-green-900 font-medium"
        >
          {["home", "shop", "about"].map((link) => (
            <motion.div
              key={link}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Link
                href={link === "home" ? "/" : `/${link}`}
                className="transition-colors duration-300 hover:text-orange-600"
              >
                {link}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </motion.div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-8 text-green-900">
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
      </div>
    </nav>
  );
}

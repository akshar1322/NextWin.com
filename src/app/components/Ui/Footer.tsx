"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const version = "[ V SX-ACT 01r.mx.00.01 ]";

// 🔹 Footer Links Data
const footerLinks = [
  {
    title: "FOLLOW US",
    links: [
      { name: "Instagram", href: "https://www.instagram.com" },
      { name: "X", href: "https://x.com" },
      { name: "Bēhance", href: "https://www.behance.net" },
      { name: "Dribbble", href: "https://dribbble.com/" },
    ],
  },
  {
    title: "NAVIGATION",
    links: [
      { name: "Home", href: "/" },
      { name: "Contact-Us", href: "/contact-Us" },
      { name: "Shop", href: "/shop" },
    ],
  },
  {
    title: "PARTNERS",
    links: [{ name: "abd", href: "#" }],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 md:px-14 py-20 mt-20 relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Section 1: Footer Links */}
        <motion.div
          className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-orange-500 font-bold text-2xl uppercase mb-4">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link) => (
                  <li
                    key={link.name}
                    className="mb-2 group cursor-pointer text-xl"
                  >
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : "_self"}
                      className="hover:text-orange-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                    {/* Underline hover effect */}
                    <div className="w-full h-1 mt-1 bg-black relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full h-full bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Section 2: Newsletter */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-bold text-5xl mb-6 text-orange-500">Subscribe</h3>
          <p className="text-lg text-gray-300 mb-6 max-w-lg leading-relaxed">
            Be the first to know about our latest collections, special offers,
            and exclusive discounts delivered straight to your inbox.
          </p>
          <form className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-md border border-white/20 bg-black/70 text-white placeholder-gray-400 outline-none w-full max-w-xl text-lg focus:border-orange-500 transition"
              required
            />
            <label className="flex items-center gap-3 text-lg text-gray-400">
              <input
                type="checkbox"
                required
                className="scale-125 accent-orange-500"
              />
              Yes, subscribe me to your newsletter.
            </label>
            <button
              type="submit"
              className="bg-orange-500 text-black font-bold px-7 py-4 rounded-md text-xl hover:bg-orange-400 active:scale-95 transition"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-white/20 mt-16 pt-10 flex flex-col md:flex-row items-center justify-between text-lg relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 mb-6 md:mb-0">
          <Image
            src="/images/logo/main logo.jpg"
            alt="Next Win Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-gray-400">
          <p>
            © {new Date().getFullYear()} by{" "}
            <span className="font-bold text-white">Next Win</span>. Built with{" "}
            <Link
              href="https://splitxcom.vercel.app/"
              target="_blank"
              className="underline hover:text-orange-500"
            >
              SplitsX
            </Link>
          </p>
          <p className="mt-2 text-sm uppercase opacity-60">{version}</p>
        </div>
      </motion.div>
    </footer>
  );
}

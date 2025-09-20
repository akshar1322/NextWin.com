"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/**
 * Each category has:
 * - bg: initial background color for the card
 * - hover: the hover background class (must include "hover:" so Tailwind sees it)
 * - btnHover: group-hover class for the button (must include "group-hover:")
 */
const categories = [
  {
    name: "New Arrivals",
    href: "/newarrivals",
    img: "/images/prodcts/p1.jpg",
    bg: "bg-[#EEEEEE]",
    hover: "hover:bg-green-200",
    btnHover: "group-hover:bg-green-600",
  },
  {
    name: "Women",
    href: "/women",
    img: "/images/prodcts/p2.jpg",
    bg: "bg-[#EEEEEE]",
    hover: "hover:bg-pink-200",
    btnHover: "group-hover:bg-pink-600",
  },
  {
    name: "Men",
    href: "/men",
    img: "/images/prodcts/p3.jpg",
    bg: "bg-[#EEEEEE]",
    hover: "hover:bg-blue-200",
    btnHover: "group-hover:bg-blue-600",
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-1 px-4 md:px-4 lg:px-20 text-black">
      <motion.h2
        className="text-4xl md:text-5xl right-15
         font-bold  mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Shop by Category
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full mx-auto">
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            whileHover={{ scale: 1.02 }}
            className={`group rounded-2xl transition-all duration-300 cursor-pointer ${cat.bg} ${cat.hover} p-4`}
          >
            {/* Inner white frame so outer bg is visible as a colored border */}
            <div className="bg-transparent rounded-xl overflow-hidden p-3">
              <div className="relative w-full h-[480px] sm:h-[580px] rounded-lg overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Button area — uses group-hover to change color on parent hover */}
            <div className="w-full py-6 flex justify-center bg-transparent">
              <Link
                href={cat.href}
                className={`border border-black px-10 py-2 rounded-2xl font-medium text-lg transition  group-hover:text-black`}
              >
                {cat.name}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

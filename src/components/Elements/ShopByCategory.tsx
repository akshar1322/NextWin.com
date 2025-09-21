"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "New Arrivals",
    href: "/newarrivals",
    img: "/images/prodcts/p1.jpg",
    bg: "bg-[#EEEEEE]",
    hover: "hover:bg-green-200",
    btnHover: "group-hover:bg-green-600 group-hover:text-white",
  },
  {
    name: "Women",
    href: "/women",
    img: "/images/prodcts/p2.jpg",
    bg: "bg-[#EEEEEE]",
    hover: "hover:bg-pink-200",
    btnHover: "group-hover:bg-pink-600 group-hover:text-white",
  },
  {
    name: "Men",
    href: "/men",
    img: "/images/prodcts/p3.jpg",
    bg: "bg-[#EEEEEE]",
    hover: "hover:bg-blue-200",
    btnHover: "group-hover:bg-blue-600 group-hover:text-white",
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-20 text-black">
      {/* Heading */}
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-center lg:text-left"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Shop by Category
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            whileHover={{ scale: 1.02 }}
            className={`group rounded-2xl transition-all duration-300 cursor-pointer ${cat.bg} ${cat.hover} p-4`}
          >
            {/* Inner Frame */}
            <div className="rounded-xl overflow-hidden p-3">
              <div className="relative w-full h-64 sm:h-96 lg:h-[580px] rounded-lg overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Button */}
            <div className="w-full py-6 flex justify-center">
              <Link
                href={cat.href}
                className={`border border-black px-8 sm:px-10 py-2 rounded-2xl font-medium text-base sm:text-lg transition ${cat.btnHover}`}
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

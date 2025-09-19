"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// 🔹 Category Data
const categories = [
  {
    name: " New Arrivals",
    href: "/shop/NewArrivals",
    img: "/images/prodcts/p1.jpg", // Replace with your image paths
    bgColor: "bg-green-100", // Tailwind color for face
  },
  {
    name: "Woman",
    href: "/shop/Woman",
    img: "/images/prodcts/p2.jpg", // Replace with your image paths
    bgColor: "bg-pink-100", // Tailwind color for body
  },
  {
    name: "Man",
    href: "/shop/Man",
    img: "/images/prodcts/p3.jpg", // Replace with your image paths
    bgColor: "bg-blue-100", // Tailwind color for hair
  },
];

export default function ShopByCategory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-12 lg:px-20 bg-white text-black">
      {/* Heading */}
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-14"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Shop by Category
      </motion.h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            className={`category-card rounded-2xl overflow-hidden shadow-md flex flex-col text-center transition-all duration-300 hover:shadow-xl group relative ${cat.bgColor}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Image */}
            <div className="w-full flex items-center justify-center p-6 bg-white/50">
              <Image
                src={cat.img}
                alt={cat.name}
                width={500}
                height={500}
                className="rounded-xl object-contain transition-transform duration-500 group-hover:scale-108"
              />
            </div>

            {/* Text + Button */}
            <div className="px-6 py-8">

              <Link
                href={cat.href}
                className="inline-block border border-black  text-black px-10 py-3 rounded-2xl font-medium text-lg hover:bg-orange-400 active:scale-95 transition"
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

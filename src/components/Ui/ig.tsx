"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const instagramImages = [
  // Row 1 (will move right to left)
  "/images/ig/instagram-post-1.png",
  "/images/ig/instagram-post-2.png",
  "/images/ig/instagram-post-3.png",
  "/images/ig/instagram-post-4.png",
  "/images/ig/instagram-post-5.png",
  "/images/ig/instagram-post-6.jpg",
  "/images/ig/instagram-post-18.png",
  "/images/ig/instagram-post-19.png",
  "/images/ig/instagram-post-20.png",
  "/images/ig/instagram-post-21.png",
  // Row 2 (will move left to right)
  "/images/ig/instagram-post-7.png",
  "/images/ig/instagram-post-8.png",
  "/images/ig/instagram-post-9.png",
  "/images/ig/instagram-post-10.png",
  "/images/ig/instagram-post-11.png",
  "/images/ig/instagram-post-12.png",
  "/images/ig/instagram-post-13.png",
  "/images/ig/instagram-post-14.png",
  "/images/ig/instagram-post-15.png",
  "/images/ig/instagram-post-16.png",
  "/images/ig/instagram-post-17.png",


];

export default function InstagramSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Row 1: Move from right to left
      gsap.to(row1Ref.current, {
        x: -50, // Adjust this value for speed
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Row 2: Move from left to right
      gsap.to(row2Ref.current, {
        x: 50, // Adjust this value for speed
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto text-center mb-12">
        <motion.h2
          className="text-4xl text-black md:text-5xl font-bold mb-2"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Follow Us on Instagram
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          #next_win
        </motion.p>
      </div>

      <div className="flex flex-col gap-6">
        {/* First Row of Images (Right to Left) */}
        <div ref={row1Ref} className="flex gap-6 pl-6">
          {instagramImages.slice(0, 10).map((imgSrc, index) => (
            <Link
              href="https://instagram.com"
              target="_blank"
              key={index}
              className="relative w-72 h-72 flex-none rounded-xl overflow-hidden shadow-md group"
            >
              <Image
                src={imgSrc}
                alt={`Instagram image ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  @next_win
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Second Row of Images (Left to Right) */}
        <div ref={row2Ref} className="flex gap-6 pr-6">
          {instagramImages.slice(10, 21).map((imgSrc, index) => (
            <Link
              href="https://instagram.com"
              target="_blank"
              key={index}
              className="relative w-72 h-72 flex-none rounded-xl overflow-hidden shadow-md group"
            >
              <Image
                src={imgSrc}
                alt={`Instagram image ${index + 11}`}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                 @next_win
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

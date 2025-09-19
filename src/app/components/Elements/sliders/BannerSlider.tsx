"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "win the Next Style",
    description: "Explore the latest trends and find your perfect look.",
    image:
      "/images/banners/hjkdhjkah.jpg",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Fresh styles just landed. Shop the new collection now.",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: 3,
    title: "Exclusive Offers",
    description: "Don't miss out on our limited-time deals and discounts.",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function HeroBanner() {
  const textRef = useRef(null);

  // Animate text on slide change
  const onSlideChange = () => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }, textRef);
    return () => ctx.revert();
  };

  return (
    <div className="relative w-full h-screen rounded-4xl overflow-hidden">

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={onSlideChange}
        className="w-full h-full"
      >
        {slides.map(({ id, image }) => (
          <SwiperSlide key={id}>
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

      {/* Text content */}
      <div
        ref={textRef}
        className="absolute bottom-20 left-10 max-w-xl text-white z-20"
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key="title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl font-bold mb-4 uppercase drop-shadow-lg"
          >
            {slides[0].title}
          </motion.h1>
          <motion.p
            key="desc"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="mb-6 text-lg drop-shadow-md"
          >
            {slides[0].description}
          </motion.p>
          <motion.button
            key="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold shadow-lg"
          >
            Shop Now
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
}

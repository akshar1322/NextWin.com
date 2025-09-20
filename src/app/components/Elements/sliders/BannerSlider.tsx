"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image: "/images/banners/hjkdhjkah.jpg",
    link: "https://your-link-1.com",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1920&q=80",
    link: "https://your-link-2.com",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80",
    link: "https://your-link-3.com",
  },
];

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[20vh] sm:h-[35vh] md:h-[45vh] lg:h-[65vh] overflow-hidden rounded-none">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {slides.map(({ id, image, link }) => (
          <SwiperSlide key={id}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                src={image}
                alt={`banner-${id}`}
                className="w-full h-full object-cover"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

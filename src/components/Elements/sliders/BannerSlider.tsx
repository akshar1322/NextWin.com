"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image: "/images/banners/5202247.jpg",
    link: "https://your-link-1.com",
  },
  {
    id: 2,
    image: "/images/banners/6766025.jpg",
    link: "https://your-link-2.com",
  },
  {
    id: 3,
    image: "/images/banners/8925411.jpg",
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

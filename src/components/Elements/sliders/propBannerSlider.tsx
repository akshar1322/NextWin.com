"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export interface Slide {
  id: number;
  image: string;
  link?: string;
}

interface BannerSliderProps {
  slides: Slide[];
  height?: string; // optional custom height (default: lg:h-[65vh])
}

export default function BannerSlider({ slides, height }: BannerSliderProps) {
  return (
    <div
      className={`relative w-full h-[20vh] sm:h-[35vh] md:h-[45vh] ${
        height || "lg:h-[65vh]"
      } overflow-hidden rounded-none`}
    >
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
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                <img
                  src={image}
                  alt={`banner-${id}`}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={image}
                alt={`banner-${id}`}
                className="w-full h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

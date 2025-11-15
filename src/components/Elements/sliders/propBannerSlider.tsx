"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect, useState } from "react";
import Image from "next/image";
export interface Slide {
  id: number;
  image: string;
  link?: string;
  title?: string;
  tags?: string[];
}

interface BannerSliderProps {
  height?: string; // optional custom height (default: lg:h-[65vh])
  tag?: string; // optional tag to filter banners
  limit?: number; // optional limit for number of banners (default: 3)
}

interface Banner {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  image: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function BannerSlider({ height, tag, limit = 3 }: BannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/banners");
        const data = await res.json();

        if (data.success) {
          // Filter active banners
          let filteredBanners = data.banners.filter((banner: Banner) =>
            banner.status === "active"
          );

          // Filter by tag if provided
          if (tag) {
            filteredBanners = filteredBanners.filter((banner: Banner) =>
              banner.tags.some(bannerTag =>
                bannerTag.toLowerCase().includes(tag.toLowerCase())
              )
            );
          }

          // Limit the number of banners
          filteredBanners = filteredBanners.slice(0, limit);

          setBanners(filteredBanners);
        } else {
          setError("Failed to fetch banners");
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Error loading banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [tag, limit]);

  // Convert banners to slides format
  const slides: Slide[] = banners.map((banner, index) => ({
    id: index + 1,
    image: banner.image,
    link: banner.link,
    title: banner.title,
    tags: banner.tags
  }));

  // Show loading state
  if (loading) {
    return (
      <div
        className={`relative w-full h-[20vh] sm:h-[35vh] md:h-[45vh] ${
          height || "lg:h-[65vh]"
        } overflow-hidden rounded-none bg-gray-800 flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-2">Loading banners...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`relative w-full h-[20vh] sm:h-[35vh] md:h-[45vh] ${
          height || "lg:h-[65vh]"
        } overflow-hidden rounded-none bg-gray-800 flex items-center justify-center`}
      >
        <div className="text-center text-red-400">
          <i className="ri-error-warning-line text-2xl mb-2"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (banners.length === 0) {
    return (
      <div
        className={`relative w-full h-[20vh] sm:h-[35vh] md:h-[45vh] ${
          height || "lg:h-[65vh]"
        } overflow-hidden rounded-none bg-gray-800 flex items-center justify-center`}
      >
        <div className="text-center text-gray-400">
          <i className="ri-image-line text-2xl mb-2"></i>
          <p>No banners available</p>
        </div>
      </div>
    );
  }

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
        loop={banners.length > 1}
        className="w-full h-full"
      >
        {slides.map(({ id, image, link, title }) => (
          <SwiperSlide key={id}>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <Image
                  src={image}
                  alt={title || `banner-${id}`}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                />
                {/* Optional: Add title overlay */}
                {title && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                )}
              </a>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={title || `banner-${id}`}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                />
                {/* Optional: Add title overlay */}
                {title && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Banner counter indicator */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
        {banners.length} / {limit}
      </div>
    </div>
  );
}

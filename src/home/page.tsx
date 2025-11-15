import React from "react";
import HeroBanner from "../components/Elements/sliders/BannerSlider";
import BestSeller from "../components/cards/Best-Seller";
import ShopByCategory from "@/components/Elements/ShopByCategory";
import InstagramSection from "@/components/Ui/ig";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";
import InfiniteTextStrip from "@/components/shared/InfiniteTextStrip";

const Homepage = () => {
  return (
    <>
      <main className="bg-[#EEEEEE] overflow-hidden">
        {/* Banner with top margin */}

          <BannerSlider
            height="lg:h-[70vh]"
            tag="featured"
            limit={4}
          />
          <br />
          <InfiniteTextStrip
          direction="right"
          textClassName="text-3xl font-extrabold text-black  "
           />

        {/* Best Seller */}
        <section className="py-10 sm:py-14 lg:py-20">
          <BestSeller />
        </section>

        {/* Shop By Category */}
        <section className="py-10 sm:py-14 lg:py-20">
          <ShopByCategory />
        </section>

        {/* Instagram */}
        <section className="py-10 sm:py-14 lg:py-20">
          <InstagramSection />
        </section>
      </main>
    </>
  );
};

export default Homepage;

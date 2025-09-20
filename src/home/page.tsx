import React from "react";
import HeroBanner from "../components/Elements/sliders/BannerSlider";
import BestSeller from "../components/cards/Best-Seller";
import ShopByCategory from "@/components/Elements/ShopByCategory";
import InstagramSection from "@/components/Ui/ig";

const Homepage = () => {
  return (
    <>
      <main className="bg-[#EEEEEE] px-4 md:px-8 lg:px-12 overflow-hidden">
        {/* Banner with top margin */}
        <div className="mt-6 sm:mt-10 lg:mt-14">
          <HeroBanner />
        </div>

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

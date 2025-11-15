import ProductCard from "@/components/cards/ProductCard";
import { products } from "@/data/products";
import Navbar from "../../components/Ui/Navbar/Navbar";
import Footer from "../../components/Ui/Footer";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals Collection | NextWin",
  description: "Explore the latest Men's fashion and styles.",
};



export default function NewArrivals() {
  const menProducts = products.filter((p) => p.category === "new");

  return (
    <>
          <main className=' bg-[#EEEEEE]  overflow-hidden ' >
                   <Navbar/>
                   <BannerSlider
                      height="lg:h-[70vh]"
                      tag="featured"
                      limit={4}
                    />
    <section className="w-full px-8 bg-[#EEEEEE] text-black py-16">
      <h2 className="text-5xl font-bold mt-10 mb-10">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {menProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, _id: String(product.id) }}
          />
        ))}
      </div>
    </section>
    <Footer/>
    </main>
    </>

  );
}

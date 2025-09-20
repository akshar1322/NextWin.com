import ProductCard from "@/components/cards/ProductCard";
import { products } from "@/data/products";
import Navbar from "../../components/Ui/Navbar";
import Footer from "../../components/Ui/Footer";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Collection | NextWin",
  description: "Explore the latest Men's fashion and styles.",
};

const menSlides = [
  { id: 1, image: "/images/banners/1600w-IM0sQ6hr9Kc (1).jpg", link: "#" },
  { id: 2, image: "/images/banners/emma-swoboda-qKaioqt8mo4-unsplash.jpg", link: "#" },
];
export default function MenPage() {
  const menProducts = products.filter((p) => p.category === "men");

  return (
    <>
     <main className=' bg-[#EEEEEE]  overflow-hidden ' >
                <Navbar/>
                    <div className=' mt-6 sm:mt-14 lg:mt-16'>
                            <BannerSlider slides={menSlides} />
                    </div>
    <BannerSlider slides={menSlides} />
    <section className="w-full px-8 bg-[#EEEEEE] text-black py-16">
      <h2 className="text-5xl font-bold mt-10 mb-10">{`Men's`} </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {menProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
    <Footer/>
    </main>
    </>

  );
}

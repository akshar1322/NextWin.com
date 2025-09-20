import ProductCard from "@/components/cards/ProductCard";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";
import Footer from "@/components/Ui/Footer";
import Navbar from "@/components/Ui/Navbar";
import { products } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextWin",
  description: "Explore the latest Men's fashion and styles.",
};

const menSlides = [
  { id: 1, image: "/images/banners/1600w-IM0sQ6hr9Kc (1).jpg", link: "#" },
  { id: 2, image: "/images/banners/emma-swoboda-qKaioqt8mo4-unsplash.jpg", link: "#" },
];

export default function ShopPage() {
  return (
     <>

        <main className=' bg-[#EEEEEE]  overflow-hidden ' >
            <Navbar/>
                <div className=' mt-6 sm:mt-14 lg:mt-16'>
                        <BannerSlider slides={menSlides} />
                </div>

                <section className="w-full bg-[#EEEEEE] text-black  px-8 py-16">
                    {/* Header */}
                    <h2 className="text-5xl mt-10 font-bold mb-15">Shop All Products</h2>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            <Footer/>

        </main>
    </>

  );
}

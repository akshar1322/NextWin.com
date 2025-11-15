"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Ui/Navbar/Navbar";
import Footer from "@/components/Ui/Footer";
import BannerSlider from "@/components/Elements/sliders/propBannerSlider";
import ProductCard from "@/components/cards/ProductCard";




export default function MenPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        const res = await fetch("/api/products?category=man");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load men products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenProducts();
  }, []);

  return (
    <main className="bg-[#EEEEEE] overflow-hidden min-h-screen text-black">
      <Navbar />
          <BannerSlider
          height="lg:h-[70vh]"
          tag="featured"
          limit={4}
        />


      {/* --- Product Section --- */}
      <section className="w-full px-8 py-16">
        <h2 className="text-4xl md:text-5xl font-bold mt-10 mb-10">{`Men's Collection`}</h2>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        )}
      </section>

      <Footer />
    </main>
  );
}

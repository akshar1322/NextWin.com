"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "@/data/products";
import Navbar from "@/components/Ui/Navbar";
import Footer from "@/components/Ui/Footer";

import { FaAmazon, FaShoppingBag } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id.toString() === id);
  const [mainImage, setMainImage] = useState(product?.images[0]);
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="p-10 text-center text-2xl font-bold text-gray-700">
        Product not found
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="w-full bg-[#EEEEEE] text-black px-4 sm:px-8 md:px-20 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left: Images */}
          <div>
            <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={mainImage || product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition"
              />
            </div>
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden cursor-pointer border ${
                    mainImage === img ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center">
            {product.tag && (
              <span className="bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-full w-fit mb-4">
                {product.tag}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold capitalize">
              {product.name}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mt-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Affiliate Links */}
            <div className="flex gap-4 mt-6">
              {product.affiliates.amazon && (
                <Link
                  href={product.affiliates.amazon}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  <FaAmazon className="text-xl text-yellow-600" /> Amazon
                </Link>
              )}
              {product.affiliates.flipkart && (
                <Link
                  href={product.affiliates.flipkart}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  <SiFlipkart className="text-xl text-blue-600" /> Flipkart
                </Link>
              )}
              {product.affiliates.myntra && (
                <Link
                  href={product.affiliates.myntra}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  <FaShoppingBag className="text-xl text-pink-600" /> Myntra
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="mt-16 sm:mt-20 border-t border-gray-200 pt-8 sm:pt-12 space-y-4 sm:space-y-6">
          {[
            { title: "Product Information", content: product.description },
            {
              title: "Return & Refund Policy",
              content:
                "We accept returns within 14 days of purchase. Refunds will be processed once the product is received in its original condition.",
            },
            {
              title: "Shipping Info",
              content:
                "Orders are processed within 2–3 business days. Standard shipping takes 5–7 days depending on your location.",
            },
          ].map((section) => (
            <div key={section.title} className="border-b border-gray-200 pb-4 sm:pb-6">
              <button
                onClick={() =>
                  setOpenSection(
                    openSection === section.title ? null : section.title
                  )
                }
                className="flex justify-between items-center w-full text-left text-lg sm:text-xl font-semibold"
              >
                {section.title}
                <span className="ml-2 text-xl">
                  {openSection === section.title ? "−" : "+"}
                </span>
              </button>
              {openSection === section.title && (
                <p className="mt-3 sm:mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

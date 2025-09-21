"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ✅ Product type
interface Product {
  id: number;
  name: string;
  price: number;
  image1: string;
  image2: string;
  tag?: string; // optional tag
}

const products: Product[] = [
  {
    id: 1,
    name: "radiant renewal serum",
    price: 27,
    image1: "/images/prodcts/p1-.jpg",
    image2: "/images/prodcts/p1.jpg",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "luminous eye cream",
    price: 25,
    image1: "/images/prodcts/p2-.jpg",
    image2: "/images/prodcts/p2.jpg",
    tag: "New",
  },
  {
    id: 3,
    name: "hydraglow moisturizer",
    price: 32,
    image1: "/images/prodcts/p3-.jpg",
    image2: "/images/prodcts/p3.jpg",
    tag: "Limited",
  },
  {
    id: 4,
    name: "radiance cleanser",
    price: 35,
    image1: "/images/prodcts/p1-.jpg",
    image2: "/images/prodcts/p4.jpg",
  },
];

export default function BestSeller() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          Best Seller
        </h2>

        <Link
          href="/shop"
          className="px-4 sm:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm md:text-base lg:text-lg border border-gray-800 rounded-lg text-gray-800 font-medium transition hover:bg-gray-800 hover:text-white hover:rounded-full"
        >
          View More
        </Link>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ✅ Product Card
function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);

  return (
    <Link href={`/shop/${product.id}`}>
      <div
        className="rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Product Image */}
        <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={hover ? product.image2 : product.image1}
            alt={product.name}
            fill
            className="object-cover transition duration-500"
          />

          {/* 🔹 Tag Badge */}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-md uppercase font-medium tracking-wide">
              {product.tag}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-2 sm:mt-3 text-center md:text-left">
          <h3 className="text-gray-800 font-medium capitalize text-sm sm:text-base">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}

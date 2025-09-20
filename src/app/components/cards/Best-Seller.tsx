"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ✅ Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  image1: string;
  image2: string;
  tag?: string; // optional tag (e.g. Best Seller, New, Limited Edition)
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
    <section className="w-full px-8 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
          Best Seller
        </h2>

        <Link
          href="/shop"
          className="px-4 sm:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm md:text-base lg:text-lg border border-gray-800 rounded-lg sm:rounded-xl text-gray-800 font-medium transition hover:bg-gray-800 hover:text-white hover:rounded-full"
        >
          View More
        </Link>

      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ✅ Strongly typed props
function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);

  return (
    <Link href={`/shop/${product.id}`}>
      <div
        className="rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={hover ? product.image2 : product.image1}
            alt={product.name}
            fill
            className="object-cover transition duration-500"
          />

          {/* 🔹 Tag Badge */}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-black text-white text-xs md:text-sm px-3 py-1 rounded-sm uppercase font-light tracking-wide">
              {product.tag}
            </span>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-gray-800 font-medium capitalize">
            {product.name}
          </h3>
          <p className="text-gray-600">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}

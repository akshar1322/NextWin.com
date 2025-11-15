"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);

  return (
    <Link href={`/shop/${product._id}`}>
      <div
        className="rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={hover && product.images[1] ? product.images[1] : product.images[0]}
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

        {/* Details */}
        <div className="mt-3">
          <h3 className="text-gray-800 font-medium capitalize">{product.name}</h3>
          <p className="text-gray-600">${product.price.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Stock: {product.stock}</p>
        </div>
      </div>
    </Link>
  );
}

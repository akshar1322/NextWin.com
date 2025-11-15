"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface InfiniteTextStripProps {
  text?: string;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  textClassName?: string;
}

export default function InfiniteTextStrip({
  text = "✨ Exclusive Offers - Limited Time Only - ✨ ",
  speed = 20,
  direction = "left",
  className = "",
  textClassName = ""
}: InfiniteTextStripProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        },
      });
    }
  }, [controls, isInView, direction, speed]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden bg-transparent py-4 ${className}`}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={controls}
      >
        {[...Array(6)].map((_, index) => (
          <span
            key={index}
            className={`${textClassName}`}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

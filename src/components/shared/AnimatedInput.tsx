'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface AnimatedInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg
                 text-white placeholder-transparent focus:outline-none focus:border-blue-400
                 transition-all duration-300"
        placeholder={label}
        required={required}
      />

      <motion.label
        className={`absolute left-4 pointer-events-none transition-all duration-300 ${
          isFocused || value ? 'text-blue-400' : 'text-gray-400'
        }`}
        initial={false}
        animate={{
          y: isFocused || value ? -28 : 12,
          fontSize: isFocused || value ? 12 : 16,
        }}
      >
        {label} {required && '*'}
      </motion.label>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 origin-left"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <motion.label
      className="flex items-center space-x-3 cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
            checked
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white/10 border-white/30 group-hover:border-white/50'
          }`}
          animate={{
            scale: checked ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>
      </div>
      <span className="text-white text-sm select-none">{label}</span>
    </motion.label>
  );
};

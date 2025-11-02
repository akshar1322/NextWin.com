'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SocialLoginButtonProps {
  provider: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  icon: Icon,
  onClick,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg
                 text-white flex items-center justify-center space-x-3 transition-all duration-300
                 hover:bg-white/20 hover:border-white/30 active:scale-95"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" />
      <span>Continue with {provider}</span>
    </motion.button>
  );
};

// components/ui/toaster.tsx
"use client";

import { useToast } from "@/components/Ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  const getToastConfig = (variant: string) => {
    const config = {
      icon: <Info className="w-5 h-5" />,
      gradient: "from-blue-500 to-blue-600",
      glow: "shadow-blue-500/25",
      border: "border-blue-400/20",
      iconBg: "bg-blue-500/20"
    };

    switch (variant) {
      case "destructive":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          gradient: "from-red-500 to-red-600",
          glow: "shadow-red-500/25",
          border: "border-red-400/20",
          iconBg: "bg-red-500/20"
        };
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          gradient: "from-green-500 to-green-600",
          glow: "shadow-green-500/25",
          border: "border-green-400/20",
          iconBg: "bg-green-500/20"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          gradient: "from-yellow-500 to-yellow-600",
          glow: "shadow-yellow-500/25",
          border: "border-yellow-400/20",
          iconBg: "bg-yellow-500/20"
        };
      default:
        return config;
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map(toast => {
          const config = getToastConfig(toast.variant || "default");

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className="relative"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-lg opacity-30 -z-10`} />

              {/* Main Toast */}
              <div className={`
                relative p-4 rounded-2xl backdrop-blur-xl border
                bg-gradient-to-br from-gray-900/95 to-gray-800/95
                ${config.border} ${config.glow} shadow-2xl
                min-w-[320px] max-w-md
                ${toast.className || ""}
              `}>
                {/* Animated Progress Bar */}
                {toast.duration && (
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: (toast.duration || 3000) / 1000, ease: "linear" }}
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} rounded-t-2xl origin-left`}
                  />
                )}

                <div className="flex items-start gap-3">
                  {/* Icon with Glossy Effect */}
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-xl
                    ${config.iconBg} border ${config.border}
                    flex items-center justify-center
                    backdrop-blur-sm
                  `}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {toast.title && (
                      <p className="font-semibold text-white text-lg leading-tight">
                        {toast.title}
                      </p>
                    )}
                    {toast.description && (
                      <p className="text-gray-300 text-sm leading-relaxed mt-1">
                        {toast.description}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => removeToast(toast.id!)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  >
                    <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Subtle Shine Effect */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

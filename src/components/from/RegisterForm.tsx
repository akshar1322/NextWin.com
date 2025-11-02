'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormData } from '@/types/auth';
import { AnimatedInput } from '../shared/AnimatedInput';
import { AnimatedCheckbox } from '../shared/AnimatedCheckbox';
import { SocialLoginButton } from '../shared/SocialLoginButton';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { authState, registerWithCredentials, registerWithOAuth } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      tl.from(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, []);

  const handleInputChange = (field: keyof RegisterFormData) => (value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerWithCredentials(formData);
  };
  
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    registerWithOAuth(provider);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
                 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background elements remain the same */}
      <div className="absolute inset-0 overflow-hidden">
        {/* ... floating shapes animation ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full gap-12 items-center">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10
                     shadow-2xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400
                          bg-clip-text text-transparent mb-4">
              Create an account
            </h1>
            <p className="text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Login
              </a>
            </p>
          </motion.div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
              />
              <AnimatedInput
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
              />
            </div>

            <AnimatedInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />

            <AnimatedInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
            />

            <AnimatedInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
            />

            <AnimatedCheckbox
              checked={formData.agreeToTerms}
              onChange={handleInputChange('agreeToTerms')}
              label="I agree to the Terms & Conditions"
            />

            <AnimatePresence>
              {authState.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
                >
                  {authState.error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={authState.isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500
                         text-white rounded-lg font-semibold flex items-center justify-center
                         space-x-2 transition-all duration-300 hover:from-blue-600 hover:to-purple-600
                         disabled:opacity-50 disabled:cursor-not-allowed group"
              whileHover={{ scale: authState.isLoading ? 1 : 1.02 }}
              whileTap={{ scale: authState.isLoading ? 1 : 0.98 }}
            >
              {authState.isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Or register with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialLoginButton
              provider="Google"
              icon={Mail}
              onClick={() => handleSocialLogin('google')}
            />
            <SocialLoginButton
              provider="Apple"
              icon={Lock}
              onClick={() => handleSocialLogin('apple')}
            />
          </div>
        </motion.div>

        {/* Hero Section remains the same */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center lg:text-left"
        >
          {/* ... hero content ... */}
        </motion.div>
      </div>
    </div>
  );
};

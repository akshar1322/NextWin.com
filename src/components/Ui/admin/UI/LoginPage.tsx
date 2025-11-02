"use client";

import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
      } else {
        toast.success("Login successful!");
        localStorage.setItem("adminToken", data.token);
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo/Brand */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <i className="ri-admin-line text-white text-3xl"></i>
            </div>
          </div>

          <h2 className="mt-8 text-center text-4xl font-bold text-white">
            Admin Login
          </h2>
          <p className="mt-3 text-center text-lg text-gray-300">
            Access your admin dashboard
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Glassmorphism Login Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl py-10 px-8 sm:px-12">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Username/Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your username or email"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <i className="ri-user-line text-gray-400 text-lg"></i>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <i className="ri-lock-line text-gray-400 text-lg"></i>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 bg-white/5 border border-white/10 rounded focus:ring-blue-500/50 focus:ring-2 text-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/admin/forgot-password"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-3 text-xl"></i>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="ri-login-box-line mr-3 text-xl"></i>
                      Sign in to dashboard
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Divider */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-gray-400 backdrop-blur-sm">
                    Secure admin access
                  </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
              <i className="ri-shield-check-line text-blue-400 text-xl mr-3"></i>
              <p className="text-sm text-gray-300">
                This area is restricted to authorized personnel only.
              </p>
            </div>
          </div>

          {/* Back to main site */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to main website
            </Link>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </div>
    </>
  );
}

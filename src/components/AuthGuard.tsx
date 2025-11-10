// components/AuthGuard.tsx
"use client"; // <-- This makes it a client component (runs in the browser)

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode; // The layout/content to render if authenticated
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Step 1: Check authentication (replace with your real logic)
    const token = localStorage.getItem("adminToken"); // Example: Check for a stored token
    if (token) {
      // If token exists, assume user is authenticated
      setIsAuthenticated(true);
    } else {
      // If no token, redirect to login page
      router.push("/login"); // Change "/login" to your login page URL if different
    }
    // Step 2: Stop loading after check
    setIsLoading(false);
  }, [router]);

  // Step 3: Show loading spinner while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Step 4: Render children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}

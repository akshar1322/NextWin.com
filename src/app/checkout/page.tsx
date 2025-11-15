"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import Loader from "@/components/Ui/Loader";

// This page depends on runtime URL search params and client-only APIs
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center ">
          <Loader message="Loading" words={["checkout", "totals", "shipping"]} />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGuest, setIsGuest] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  // ✅ Fetch product by ID
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/client/products/${productId}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    firstName: "",
    lastName: "",
    country: "United Kingdom",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    mobilePhone: "",
    shippingMethod: "free",
    sameAsBilling: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleGuestCheckout = () => {
    setIsGuest(true);
    setCurrentStep(2);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const proceedToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const proceedToPayment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!product) {
    alert("❌ Product not found.");
    return;
  }

  try {
    const orderData = {
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      postcode: formData.postcode,
      country: formData.country,
    };

    const res = await fetch("/api/client/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Order placed successfully!");
      console.log("Order:", data.order);
    } else {
      alert("❌ Failed to place order: " + data.error);
    }
  } catch (err) {
    console.error("Error placing order:", err);
    alert("❌ Something went wrong.");
  }
};

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Loader message="Fetching" words={["orders", "customers", "reports"]} />
      </div>
    );

  return (
    <div className="min-h-screen text-[#1A1A1A] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step
                      ? "bg-black border-black text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 mx-4 ${
                      currentStep > step ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Returning Customers */}
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Returning Customers</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Login
                    </button>
                  </form>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or</span>
                  </div>
                </div>

                {/* New Customers */}
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">New Customers</h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You can checkout without creating an account.
                    </p>
                    <button
                      onClick={handleGuestCheckout}
                      className="w-full bg-gray-800 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Checkout as Guest
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <form onSubmit={proceedToShipping} className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Payment</h2>
                <form onSubmit={proceedToPayment}>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Complete Order
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ✅ Right Column - Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-sm h-fit">
            <h2 className="text-2xl font-bold mb-6">ORDER SUMMARY</h2>

            {!product ? (
              <p className="text-gray-500">No product found.</p>
            ) : (
              <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm text-gray-600">Quantity: 1</p>
                  </div>
                </div>
                <span className="font-semibold">${product.price.toFixed(2)}</span>
              </div>
            )}

            {product && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items total</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

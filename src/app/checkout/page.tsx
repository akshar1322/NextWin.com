"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGuest, setIsGuest] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGuestCheckout = () => {
    setIsGuest(true);
    setCurrentStep(2);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
    setCurrentStep(2);
  };

  const proceedToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const proceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle final submission
    console.log("Checkout completed", formData);
  };

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
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Remember Me</span>
                      </label>
                      <Link href="#" className="text-sm text-blue-600 hover:underline">
                        Forget Password?
                      </Link>
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
                      You can checkout without creating an account. You will have a chance to create
                      an account after you've placed the order.
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
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
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
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">BILLING ADDRESS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Country *</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        >
                          <option value="United Kingdom">United Kingdom</option>
                          {/* Add more countries */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          placeholder="Start typing street address and house number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Address Line 2</label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          placeholder="Address Line 2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City / Suburb *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City / Suburb"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Zip / Postcode *</label>
                          <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleInputChange}
                            placeholder="Zip / Postcode"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mobile Phone *</label>
                        <div className="flex">
                          <div className="w-20 px-3 py-3 border border-gray-300 border-r-0 rounded-l-md bg-gray-50 flex items-center justify-center">
                            +44
                          </div>
                          <input
                            type="tel"
                            name="mobilePhone"
                            value={formData.mobilePhone}
                            onChange={handleInputChange}
                            placeholder="Mobile Phone"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    The total amount you pay includes all applicable customs duties & taxes.
                    We guarantee no additional charges on delivery.
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Continue to Shipping
                  </button>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Payment</h2>

                {/* Express Checkout */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">EXPRESS CHECKOUT</h3>
                  <div className="flex space-x-4">
                    <button className="flex-1 border border-gray-300 py-3 px-4 rounded-md hover:border-gray-400 transition-colors">
                      PayPal
                    </button>
                    <button className="flex-1 border border-gray-300 py-3 px-4 rounded-md hover:border-gray-400 transition-colors">
                      amazon pay
                    </button>
                  </div>
                </div>

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={proceedToPayment} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">C Pay</h3>
                    {/* Add payment form fields here */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

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

          {/* Right Column - Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-sm h-fit">
            <h2 className="text-2xl font-bold mb-6">ORDER SUMMARY</h2>

            {/* Product Item */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">Fabbella Tiny Take Bag</h4>
                  <p className="text-sm text-gray-600">Colour: Silver</p>
                  <p className="text-sm text-gray-600">Size: OS</p>
                  <p className="text-sm text-gray-600">Quantity: 1</p>
                </div>
                <span className="font-semibold">£775.00</span>
              </div>
            </div>

            {/* Promotion Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Please enter promotion code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promotion code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button className="px-6 py-3 border border-black text-black rounded-md hover:bg-gray-50 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Order Totals */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items total</span>
                <span>£775.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>£775.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

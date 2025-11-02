"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";
import { useToast } from "@/components/Ui/use-toast";

export default function UploadProductPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Default values for dropdowns
  const categories = ["NewArivel", "Fashion", "Accessories", "Child", "Other"];
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Purple"];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith("image/"));
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    images.forEach(file => formData.append("images", file));

    try {
      const res = await fetch("/api/products", { method: "POST", body: formData });

      if (res.status < 200 || res.status >= 300) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.error || "Upload error occurred");
        (error as any).status = res.status;
        throw error;
      }

      const data = await res.json();

      console.log("Upload Successful:", data);
      form.reset();
      setImages([]);
      setImagePreviews([]);

      toast({
        title: "✅ Product uploaded successfully!",
        description: "Your product has been added to the store.",
        className: "bg-green-600 text-white border-none",
      });
    } catch (error: any) {
      console.error("Upload Error:", error);
      const code = error.status || "Unknown";

      toast({
        title: `⚠️ Upload error (${code})`,
        description: error.message || "Unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start py-4 px-4 lg:px-8 ml-64">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Upload New Product
            </h1>
            <p className="text-gray-400 text-lg">Add a new product to your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    required
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Brand
                  </label>
                  <input
                    name="brand"
                    placeholder="e.g., Sony, Nike"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    SKU
                  </label>
                  <input
                    name="sku"
                    placeholder="e.g., PROD-001"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Detailed product description..."
                  className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 resize-vertical placeholder-gray-500"
                />
              </div>
            </div>

            {/* Variants */}
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-orange-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-orange-500 rounded-full mr-3"></div>
                Product Variants
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Available Sizes
                  </label>
                  <select
                    name="sizes"
                    multiple
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 h-32"
                  >
                    {sizes.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-400 text-xs mt-2">Hold Ctrl/Cmd to select multiple sizes</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Available Colors
                  </label>
                  <select
                    name="colors"
                    multiple
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 h-32"
                  >
                    {colors.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-400 text-xs mt-2">Hold Ctrl/Cmd to select multiple colors</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Tags (comma separated)
                </label>
                <input
                  name="tags"
                  placeholder="e.g., wireless, premium, new-arrival"
                  className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Price *
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Stock Quantity *
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    required
                    placeholder="0"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Rating
                  </label>
                  <input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Reviews Count
                  </label>
                  <input
                    name="reviews"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Affiliate Links */}
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                Affiliate Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Amazon URL
                  </label>
                  <input
                    name="affiliates[amazon]"
                    type="url"
                    placeholder="https://amazon.com/product-link"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Flipkart URL
                  </label>
                  <input
                    name="affiliates[flipkart]"
                    type="url"
                    placeholder="https://flipkart.com/product-link"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Myntra URL
                  </label>
                  <input
                    name="affiliates[myntra]"
                    type="url"
                    placeholder="https://myntra.com/product-link"
                    className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-green-500/50 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-pink-500/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-pink-500 rounded-full mr-3"></div>
                Product Images *
              </h2>
              <div
                className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-pink-400 bg-pink-900/20"
                    : "border-gray-600/50 hover:border-pink-400/70 hover:bg-pink-900/10"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <p className="text-white font-semibold mb-2">Drag & Drop or Click to Upload</p>
                <p className="text-gray-400 text-sm">Supports JPG, PNG, WEBP - Max 10MB each</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <p className="text-gray-300 mb-4">{imagePreviews.length} image(s) selected:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-28 object-cover rounded-xl border-2 border-white/10 group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-60 transition-all shadow-lg text-lg font-semibold"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </span>
                ) : (
                  "Upload Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

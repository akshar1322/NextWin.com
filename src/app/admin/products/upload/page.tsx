"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";

export default function UploadProductPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Fetch Inventory metadata (categories, tags, sizes, colors)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch metadata");

        const data = await res.json();
        setCategories(data.categories || []);
        setSizes(data.sizes || []);
        setColors(data.colors || []);
        setTags(data.tags || []);
        setMetaError(null);
      } catch (err: any) {
        console.error("Metadata fetch failed:", err);
        setMetaError("Could not load inventory metadata");
      } finally {
        setMetaLoading(false);
      }
    };
    fetchMeta();

    // Cleanup image object URLs on unmount to avoid memory leaks
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
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

    const formData = new FormData(e.currentTarget);
    images.forEach(file => formData.append("images", file));

    try {
      const res = await fetch("/api/product", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        console.log("Upload Successful:", data);
        e.currentTarget.reset();
        setImages([]);
        setImagePreviews([]);
        alert("✅ Product uploaded successfully!");
      } else {
        alert("❌ Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("⚠️ Upload error occurred");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start py-4 px-4 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Upload New Product
            </h1>
            <p className="text-gray-400 text-lg">
              Add a new product to your eCommerce store
            </p>
          </div>

          {/* Metadata Loader */}
          {metaLoading ? (
            <div className="text-gray-400 text-center py-20 animate-pulse">
              Fetching inventory metadata...
            </div>
          ) : metaError ? (
            <div className="text-red-400 text-center py-20">{metaError}</div>
          ) : (
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
                      Tag
                    </label>
                    <select
                      name="tag"
                      className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="">Select Tag</option>
                      {tags.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
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
                      className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50"
                    >
                      {sizes.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl (Windows) or ⌘ (Mac) to select multiple
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Available Colors
                    </label>
                    <select
                      name="colors"
                      multiple
                      className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50"
                    >
                      {colors.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                  Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="w-full bg-gray-900/80 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div
                className={`bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-green-500/10`}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                  Product Images
                </h2>
                <div
                  className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-green-400 bg-green-900/20"
                      : "border-gray-600/50 hover:border-green-400/70 hover:bg-green-900/10"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <p className="text-white font-semibold mb-2">
                    Drag & Drop or Click to Upload
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports JPG, PNG, WEBP - Max 10MB each
                  </p>
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
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-60 transition-all shadow-lg"
                >
                  {loading ? "Uploading..." : "Upload Product"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

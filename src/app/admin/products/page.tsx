"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  status: "active" | "inactive" | "draft";
  images: string[];
  rating: number;
  reviews: number;
  createdAt: string;
  tags: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    stock: 0,
    status: "active" as "active" | "inactive" | "draft",
    tags: ""
  });

  // ✅ Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const productsArray = Array.isArray(data) ? data : data.products;

        if (productsArray) {
          setProducts(
            productsArray.map((p: any) => ({
              id: p._id,
              name: p.name,
              description: p.description || "",
              price: p.price || 0,
              category: p.category?.name || "Uncategorized",
              brand: p.brand || "Unknown",
              stock: p.stock || 0,
              status: p.status || "active",
              images: p.images?.length ? p.images : ["/api/placeholder/400/400"],
              rating: p.rating || 0,
              reviews: p.reviews || 0,
              createdAt: new Date(p.createdAt).toISOString().split("T")[0],
              tags: p.tags || []
            }))
          );
        }

      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔍 Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseFloat(value) || 0 : value
    }));
  };

  // ✅ Update product via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/products/${editingProduct?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim())
        })
      });

      const data = await res.json();
      if (data.success) {
        setProducts(prev =>
          prev.map(p => (
            p.id === editingProduct?.id
              ? { ...p, ...formData, tags: formData.tags.split(",").map(t => t.trim()) }
              : p
          ))
        );
        resetForm();
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      brand: "",
      stock: 0,
      status: "active",
      tags: ""
    });
    setEditingProduct(null);
    setShowEditForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      status: product.status,
      tags: product.tags.join(", ")
    });
    setEditingProduct(product);
    setShowEditForm(true);
  };

  // ✅ Delete product via API
  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // UI Helper Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "draft": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return "ri-checkbox-circle-line";
      case "inactive": return "ri-close-circle-line";
      case "draft": return "ri-draft-line";
      default: return "ri-question-line";
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-400";
    if (stock < 10) return "text-orange-400";
    return "text-green-400";
  };

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Main Content - Adjusted for sidebar */}
      <div className="flex-1 ml-64 py-4 px-4 lg:px-8"> {/* Added ml-64 for sidebar width */}
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                  Products
                </h1>
                <p className="text-gray-400 text-lg">Manage your product catalog</p>
              </div>
              <div className="flex space-x-4 mt-4 lg:mt-0">
                <Link
                  href="/admin/products/upload"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add New Product
                </Link>
                <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex items-center">
                  <i className="ri-download-line mr-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-white mt-2">{totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <i className="ri-shopping-bag-line text-blue-400 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Products</p>
                  <p className="text-3xl font-bold text-white mt-2">{activeProducts}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <i className="ri-checkbox-circle-line text-green-400 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-orange-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Out of Stock</p>
                  <p className="text-3xl font-bold text-white mt-2">{outOfStockProducts}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <i className="ri-error-warning-line text-orange-400 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Inventory Value</p>
                  <p className="text-3xl font-bold text-white mt-2">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-purple-400 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 lg:mb-0 flex items-center">
                <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                All Products ({filteredProducts.length})
              </h2>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 w-full sm:w-64"
                  />
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-search-eye-line text-gray-400 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Product</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Category</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Brand</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Price</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Stock</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Rating</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover mr-3"
                            />
                            <div>
                              <span className="text-white font-medium block">{product.name}</span>
                              <span className="text-gray-400 text-xs line-clamp-1">{product.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-400 text-sm">{product.category}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-400 text-sm">{product.brand}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-medium">${product.price}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${getStockColor(product.stock)}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <i className="ri-star-fill text-yellow-400 mr-1"></i>
                            <span className="text-white font-medium">{product.rating}</span>
                            <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            <i className={`${getStatusIcon(product.status)} mr-1`}></i>
                            {product.status.toUpperCase()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                              title="Edit Product"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                              title="Delete Product"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                            <button
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                              title="View Details"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Edit Product
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category"
                    required
                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand"
                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  required
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 resize-vertical placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., wireless, premium, new-arrival"
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 placeholder-gray-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-red-500/20 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-red-400 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Delete Product</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remixicon CDN */}
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </div>
  );
}

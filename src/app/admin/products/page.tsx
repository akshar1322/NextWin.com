"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";
import { useToast } from "@/components/Ui/use-toast";

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
  sku?: string;
  affiliates?: {
    amazon?: string;
    flipkart?: string;
    myntra?: string;
  };
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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    brand: "",
    stock: 0,
    status: "active" as "active" | "inactive" | "draft",
    tags: "",
    sku: "",
    rating: 0,
    reviews: 0,
    affiliates: {
      amazon: "",
      flipkart: "",
      myntra: "",
    },
  });

  // ✅ Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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
            category: p.category || "Uncategorized",
            brand: p.brand || "Unknown",
            stock: p.stock || 0,
            status: p.status || "active",
            images: p.images?.length ? p.images : ["/api/placeholder/400/400"],
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            createdAt: new Date(p.createdAt).toISOString().split("T")[0],
            tags: p.tags || [],
            sku: p.sku || "",
            affiliates: p.affiliates || {},
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ✅ Input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("affiliates.")) {
      const affiliateField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        affiliates: {
          ...prev.affiliates,
          [affiliateField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "stock" || name === "reviews" || name === "rating"
            ? parseFloat(value) || 0
            : value,
      }));
    }
  };

  // ✅ PUT request using FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price.toString());
      form.append("category", formData.category);
      form.append("brand", formData.brand);
      form.append("stock", formData.stock.toString());
      form.append("status", formData.status);
      form.append("tags", formData.tags);
      form.append("sku", formData.sku);
      form.append("rating", formData.rating.toString());
      form.append("reviews", formData.reviews.toString());

      form.append("affiliates[amazon]", formData.affiliates.amazon);
      form.append("affiliates[flipkart]", formData.affiliates.flipkart);
      form.append("affiliates[myntra]", formData.affiliates.myntra);

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                tags: typeof formData.tags === "string" ? formData.tags.split(",").map(tag => tag.trim()) : formData.tags,
              }
            : p
        )
      );

      toast({
        title: "Success!",
        description: "Product updated successfully",
        variant: "success",
      });

      resetForm();
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  // ✅ Delete product
  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setDeleteConfirm(null);

      toast({
        title: "Deleted!",
        description: "Product deleted successfully",
        variant: "success",
      });
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // ✅ Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Warning",
        description: "Please select products to perform this action",
        variant: "warning",
      });
      return;
    }

    try {
      if (action === "delete") {
        if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

        const deletePromises = selectedProducts.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" })
        );

        await Promise.all(deletePromises);
        setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);

        toast({
          title: "Deleted!",
          description: `${selectedProducts.length} products deleted successfully`,
          variant: "success",
        });
      } else if (action === "activate" || action === "deactivate") {
        const status = action === "activate" ? "active" : "inactive";
        await Promise.all(
          selectedProducts.map((id) =>
            fetch(`/api/products/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            })
          )
        );

        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, status } : p
          )
        );

        toast({
          title: "Updated!",
          description: `${selectedProducts.length} products ${status}d`,
          variant: "success",
        });
      }
    } catch (err) {
      console.error("Error performing bulk action:", err);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  // ✅ Helpers
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id)
    );
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
      tags: product.tags.join(", "),
      sku: product.sku || "",
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      affiliates: {
        amazon: product.affiliates?.amazon || "",
        flipkart: product.affiliates?.flipkart || "",
        myntra: product.affiliates?.myntra || "",
      },
    });
    setEditingProduct(product);
    setShowEditForm(true);
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
      tags: "",
      sku: "",
      rating: 0,
      reviews: 0,
      affiliates: {
        amazon: "",
        flipkart: "",
        myntra: "",
      },
    });
    setEditingProduct(null);
    setShowEditForm(false);
  };

  // ✅ Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-400";
    if (stock < 10) return "text-orange-400";
    return "text-green-400";
  };

  // ✅ Stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const averageRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 0;

  // ✅ UI
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 py-4 px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
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
                <button
                  onClick={fetchProducts}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex items-center"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-white">{totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-box-3-line text-2xl text-purple-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Products</p>
                  <p className="text-3xl font-bold text-white">{activeProducts}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-checkbox-circle-line text-2xl text-green-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Out of Stock</p>
                  <p className="text-3xl font-bold text-white">{outOfStockProducts}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-error-warning-line text-2xl text-red-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">{averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <i className="ri-star-line text-2xl text-yellow-400"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Bulk Actions */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProducts.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Activate ({selectedProducts.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  >
                    <i className="ri-close-line mr-2"></i>
                    Deactivate ({selectedProducts.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Delete ({selectedProducts.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 border border-gray-700 rounded-xl">
              <i className="ri-inbox-line text-6xl text-gray-600 mb-4"></i>
              <p className="text-gray-400 text-lg">No products found</p>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50 border-b border-gray-700">
                    <tr>
                      <th className="py-4 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={selectAllProducts}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                        />
                      </th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Product</th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Category</th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Price</th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Stock</th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Status</th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Rating</th>
                      <th className="py-4 px-4 text-left text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0] || "/api/placeholder/400/400"}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-white font-medium">{product.name}</p>
                              <p className="text-gray-400 text-sm">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-300">{product.category}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${getStockColor(product.stock)}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}
                          >
                            <i className={`${product.status === "active" ? "ri-checkbox-circle-line" : product.status === "inactive" ? "ri-close-circle-line" : "ri-draft-line"} mr-1`}></i>
                            {product.status.toUpperCase()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <i className="ri-star-fill text-yellow-400"></i>
                            <span className="text-gray-300">{product.rating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({product.reviews})</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                              title="Edit"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit Product</h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Reviews</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Affiliate Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Amazon</label>
                    <input
                      type="url"
                      name="affiliates.amazon"
                      value={formData.affiliates.amazon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Flipkart</label>
                    <input
                      type="url"
                      name="affiliates.flipkart"
                      value={formData.affiliates.flipkart}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Myntra</label>
                    <input
                      type="url"
                      name="affiliates.myntra"
                      value={formData.affiliates.myntra}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-error-warning-line text-2xl text-red-400"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delete Product</h2>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this product? This will permanently remove it from your catalog.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />
    </div>
  );
}

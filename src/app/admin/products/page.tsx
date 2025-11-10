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
          {/* Continue with your table + modal (unchanged) */}
        </div>
      </div>

      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />
    </div>
  );
}

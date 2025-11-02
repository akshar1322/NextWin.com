"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";


interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
  status: "active" | "inactive";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive",
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(
            data.categories.map((cat: any) => ({
              id: cat._id,
              name: cat.name,
              description: cat.description || "",
              productCount: cat.productCount || 0,
              createdAt: new Date(cat.createdAt).toISOString().split("T")[0],
              status: cat.status,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : `/api/categories`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        if (editingCategory) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === editingCategory.id
                ? { ...cat, ...formData }
                : cat
            )
          );
        } else {
          const newCat = data.category;
          setCategories((prev) => [
            ...prev,
            {
              id: newCat._id,
              name: newCat.name,
              description: newCat.description,
              productCount: newCat.productCount || 0,
              createdAt: new Date(newCat.createdAt).toISOString().split("T")[0],
              status: newCat.status,
            },
          ]);
        }
      }
      resetForm();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "active",
    });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  // Edit category
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  // Delete category
  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setUpdating(true);
      try {
        const res = await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        } else {
          alert(data.message || "Failed to delete category");
        }
      } catch (err) {
        console.error("Error deleting category:", err);
      } finally {
        setUpdating(false);
      }
    }
  };

  // Toggle active/inactive status
  const toggleStatus = async (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    const newStatus = cat.status === "active" ? "inactive" : "active";

    setUpdating(true);
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId ? { ...c, status: newStatus } : c
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto lg:ml-80">
        <Sidebar />
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Categories
              </h1>
              <p className="text-gray-400 text-lg">Manage your product categories</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"disabled={updating}
            >
              <i className="ri-add-line mr-2"></i>
              Add New Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Categories</p>
                <p className="text-3xl font-bold text-white mt-2">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-folder-line text-blue-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Categories</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {categories.filter(cat => cat.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-orange-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-shopping-bag-line text-orange-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactive Categories</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {categories.filter(cat => cat.status === "inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-pause-circle-line text-purple-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 lg:mb-0 flex items-center">
              <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
              All Categories
            </h2>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-10 pr-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300 w-full sm:w-64"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              </div>

              <select className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Category Name</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Description</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Products</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Created</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                            <i className="ri-folder-line text-white text-sm"></i>
                          </div>
                          <span className="text-white font-medium">{category.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 text-sm">{category.description}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">{category.productCount}</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleStatus(category.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            category.status === "active"
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {category.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 text-sm">{category.createdAt}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                            title="Edit"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-green-500/20 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  required
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300 resize-vertical placeholder-gray-500"
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
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  {editingCategory ? "Update" : "Create"} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remixicon CDN */}
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </div>
  );
}

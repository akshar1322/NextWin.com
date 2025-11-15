// app/admin/products/inventory/page.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: string;
  supplier: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStockForm, setShowStockForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockUpdate, setStockUpdate] = useState({
    quantity: 0,
    type: "add" as "add" | "remove",
    reason: ""
  });

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory);
      }
      setLoading(false);
    };
    fetchInventory();
  }, []);


  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItem) {
      const newStock = stockUpdate.type === "add"
        ? selectedItem.currentStock + stockUpdate.quantity
        : selectedItem.currentStock - stockUpdate.quantity;

      const updatedStatus = newStock === 0
        ? "out-of-stock"
        : newStock <= selectedItem.lowStockThreshold
        ? "low-stock"
        : "in-stock";

      setInventory(prev => prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              currentStock: newStock,
              status: updatedStatus,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : item
      ));

      resetStockForm();
    }
  };

  const resetStockForm = () => {
    setStockUpdate({
      quantity: 0,
      type: "add",
      reason: ""
    });
    setSelectedItem(null);
    setShowStockForm(false);
  };

  const handleUpdateStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowStockForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock": return "bg-green-500/20 text-green-400";
      case "low-stock": return "bg-orange-500/20 text-orange-400";
      case "out-of-stock": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock": return "ri-checkbox-circle-line";
      case "low-stock": return "ri-alert-line";
      case "out-of-stock": return "ri-close-circle-line";
      default: return "ri-question-line";
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
  const lowStockItems = inventory.filter(item => item.status === "low-stock").length;
  const outOfStockItems = inventory.filter(item => item.status === "out-of-stock").length;
  const inStockItems = inventory.filter(item => item.status === "in-stock").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto lg:ml-80">
        <Sidebar />
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-400 text-lg">Monitor and manage your product inventory</p>
            </div>
            <div className="flex space-x-4 mt-4 lg:mt-0">
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
                <i className="ri-download-line mr-2"></i>
                Export Report
              </button>
              <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 flex items-center">
                <i className="ri-refresh-line mr-2"></i>
                Refresh
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
                <p className="text-3xl font-bold text-white mt-2">{inventory.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-box-3-line text-blue-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Stock</p>
                <p className="text-3xl font-bold text-white mt-2">{inStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-orange-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock</p>
                <p className="text-3xl font-bold text-white mt-2">{lowStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-alert-line text-orange-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inventory Value</p>
                <p className="text-3xl font-bold text-white mt-2">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-purple-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-orange-500/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 lg:mb-0 flex items-center">
              <div className="w-2 h-8 bg-orange-500 rounded-full mr-3"></div>
              Product Inventory
            </h2>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-300 w-full sm:w-64"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              </div>

              <select className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-300">
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              <select className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-300">
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Kitchen</option>
                <option value="sports">Sports</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Product</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">SKU</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Category</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Current Stock</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Low Stock Alert</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Price</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Last Updated</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-3">
                            <i className="ri-box-3-line text-white text-sm"></i>
                          </div>
                          <div>
                            <span className="text-white font-medium block">{item.productName}</span>
                            <span className="text-gray-400 text-xs">{item.supplier}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 font-mono text-sm">{item.sku}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 text-sm">{item.category}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">{item.currentStock}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-orange-400 text-sm">{item.lowStockThreshold}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">${item.price}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          <i className={`${getStatusIcon(item.status)} mr-1`}></i>
                          {item.status.replace('-', ' ').toUpperCase()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 text-sm">{item.lastUpdated}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStock(item)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                            title="Update Stock"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors duration-300"
                            title="Reorder"
                          >
                            <i className="ri-restart-line"></i>
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

        {/* Low Stock Alert Section */}
        {lowStockItems > 0 && (
          <div className="mt-6 bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
                  <i className="ri-alert-line text-orange-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Low Stock Alert</h3>
                  <p className="text-orange-300 text-sm">
                    {lowStockItems} product{lowStockItems !== 1 ? 's' : ''} are running low on stock
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                View All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Update Stock Modal */}
      {showStockForm && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-orange-500/20 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Update Stock
              </h3>
              <button
                onClick={resetStockForm}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-700/50 rounded-xl">
              <h4 className="text-white font-semibold mb-2">{selectedItem.productName}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">SKU:</span>
                  <p className="text-white">{selectedItem.sku}</p>
                </div>
                <div>
                  <span className="text-gray-400">Current Stock:</span>
                  <p className="text-white font-medium">{selectedItem.currentStock}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Update Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setStockUpdate(prev => ({ ...prev, type: "add" }))}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      stockUpdate.type === "add"
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : "bg-gray-700/50 border-gray-600 text-gray-400 hover:border-green-500"
                    }`}
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockUpdate(prev => ({ ...prev, type: "remove" }))}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      stockUpdate.type === "remove"
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : "bg-gray-700/50 border-gray-600 text-gray-400 hover:border-red-500"
                    }`}
                  >
                    <i className="ri-subtract-line mr-2"></i>
                    Remove Stock
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockUpdate.quantity}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter quantity"
                  required
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-300 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Reason
                </label>
                <input
                  type="text"
                  value={stockUpdate.reason}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for update"
                  className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400 transition-all duration-300 placeholder-gray-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetStockForm}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  Update Stock
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

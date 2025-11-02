// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "shipped": return "bg-blue-500/20 text-blue-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

 if (loading) {
    return (
      <div className="flex min-h-screen"> 
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading orders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-white/60">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <span className="text-white/60 text-sm">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Filters and Search */}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-white/80 text-sm font-medium whitespace-nowrap drop-shadow-sm">
                  Filter by status:
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-lg shadow-black/10 hover:bg-white/10"
                  >
                    <option value="all" className="bg-gray-800 rounded-xl text-white">All Status</option>
                    <option value="pending" className="bg-gray-800 rounded-xl text-white">Pending</option>
                    <option value="shipped" className="bg-gray-800 rounded-xl text-white">Shipped</option>
                    <option value="delivered" className="bg-gray-800 rounded-xl text-white">Delivered</option>
                    <option value="cancelled" className="bg-gray-800 rounded-xl  text-white">Cancelled</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Payment Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-white/80 text-sm font-medium whitespace-nowrap drop-shadow-sm">
                  Payment:
                </label>
                <div className="relative">
                  <select className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-lg shadow-black/10 hover:bg-white/10">
                    <option value="all" className="bg-gray-800 rounded-xl text-white">All Payments</option>
                    <option value="paid" className="bg-gray-800 rounded-xl text-white">Paid</option>
                    <option value="pending" className="bg-gray-800 rounded-xl text-white">Pending</option>
                    <option value="failed" className="bg-gray-800 rounded-xl text-white">Failed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Filter - Additional Option */}
              <div className="flex items-center space-x-2">
                <label className="text-white/80 text-sm font-medium whitespace-nowrap drop-shadow-sm">
                  Date Range:
                </label>
                <div className="relative">
                  <select className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-lg shadow-black/10 hover:bg-white/10">
                    <option value="all" className="bg-gray-800 rounded-xl text-white">All Time</option>
                    <option value="today" className="bg-gray-800 rounded-xl text-white">Today</option>
                    <option value="week" className="bg-gray-800 rounded-xl text-white">This Week</option>
                    <option value="month" className="bg-gray-800 rounded-xl text-white">This Month</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Search Box - Additional Feature */}
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 w-full lg:w-64 shadow-lg shadow-black/10"
                />
                <svg className="absolute left-3 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Filters Display - Optional */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-white/60 text-sm font-medium">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {statusFilter !== 'all' && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 flex items-center space-x-2 group">
                  <span className="text-white/80 text-sm">{statusFilter}</span>
                  <button className="text-white/50 hover:text-white transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Orders Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Order ID</th>
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Customer</th>
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Date</th>
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Amount</th>
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Payment</th>
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Status</th>
                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                >
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{order.orderNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{order.customerName}</div>
                    <div className="text-white/60 text-sm">{order.email}</div>
                  </td>
                  <td className="py-4 px-6 text-white/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white font-bold">${order.total.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/orders/${order._id}`);
                        }}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Order"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-inbox-line text-4xl text-white/40 mb-4"></i>
            <p className="text-white/60">No orders found</p>
            {searchTerm || statusFilter !== "all" ? (
              <p className="text-white/40 text-sm mt-2">Try adjusting your filters</p>
            ) : null}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
          <div className="text-white/60 text-sm">
            Showing 5 from {filteredOrders.length} orders
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </main>
    </div>
  );
}

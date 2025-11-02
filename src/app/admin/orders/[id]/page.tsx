// app/admin/orders/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: Order["orderStatus"]) => {
    if (!order) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        setOrder({ ...order, orderStatus: newStatus });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "shipped": return "bg-blue-500/20 text-blue-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <i className="ri-error-warning-line text-4xl text-white/40 mb-4"></i>
        <p className="text-white/60">Order not found</p>
        <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link
              href="/admin/orders"
              className="text-white/60 hover:text-white transition-colors"
            >
              <i className="ri-arrow-left-line"></i>
            </Link>
            <h1 className="text-3xl font-bold text-white">Order Details</h1>
          </div>
          <p className="text-white/60">Order #{order.orderNumber}</p>
        </div>

        {/* Status Update */}
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <span className="text-white/60">Update Status:</span>
          <select
            value={order.orderStatus}
            onChange={(e) => updateOrderStatus(e.target.value as Order["orderStatus"])}
            disabled={updating}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {updating && <i className="ri-loader-4-line animate-spin text-white/60"></i>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <i className="ri-shopping-bag-line text-white/60"></i>
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-white/60 text-sm">${item.price} each</p>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-white/20">
                <span className="text-white font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-white">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Order Placed</p>
                  <p className="text-white/60 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  order.orderStatus !== "pending" ? "bg-green-500" : "bg-white/20"
                }`}></div>
                <div>
                  <p className="text-white font-medium">Order Confirmed</p>
                  <p className="text-white/60 text-sm">
                    {order.orderStatus !== "pending" ? new Date(order.updatedAt).toLocaleString() : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Information Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Order Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Payment Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" :
                  order.paymentStatus === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Payment Method:</span>
                <span className="text-white font-medium">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-white/60 text-sm">Customer Name</p>
                <p className="text-white font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Email</p>
                <p className="text-white font-medium">{order.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p className="text-white">{order.shippingAddress.street}</p>
              <p className="text-white">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p className="text-white">Pincode: {order.shippingAddress.pincode}</p>
            </div>
          </div>
        </div>
      </div>

      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </div>
  );
}

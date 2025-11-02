// app/admin/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Ui/admin/UI/Sidemenu"; // <-- ADDED: Import the Sidebar component (adjust path if needed)

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30 DAYS");

  const statsData = [
    { date: "JUN 17, 25", sales: "59,232", growth: "+59,232" },
    { date: "JUN 16, 25", sales: "19,292", growth: "+9,626" },
    { date: "JUN 15, 25", sales: "15,413", growth: "+9,626" },
    { date: "JUN 14, 25", sales: "54,254", growth: "+3,61" },
    { date: "JUN 13, 25", sales: "45,706", growth: "+3,61" },
  ];

  const trafficSources = [
    { name: "Direct", value: "1,43,382" },
    { name: "Referral", value: "87,974" },
    { name: "Social Media", value: "48,211" },
    { name: "Twitter", value: "21,893" },
    { name: "Facebook", value: "21,893" },
  ];

  const recentCustomers = [
    { id: "#202295", name: "Ripon Ahmed", date: "1 Jun 24", price: "$20,584", status: "Complete" },
    { id: "#202296", name: "Leslie Alexander", date: "2 Jun 24", price: "$11,234", status: "Pending" },
    { id: "#202297", name: "Ralph Edwards", date: "3 Jun 24", price: "$11,159", status: "Complete" },
    { id: "#202298", name: "Ronald Richards", date: "4 Jun 24", price: "$10,483", status: "Complete" },
    { id: "#202399", name: "Deron Lane", date: "5 Jun 24", price: "$9,084", status: "Pending" },
  ];

  const deviceStats = [
    { name: "Mobile", percentage: 65 },
    { name: "Laptop", percentage: 25 },
    { name: "Watch", percentage: 10 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900"> {/* <-- ADDED: Flex wrapper for layout */}
      <Sidebar /> {/* <-- ADDED: Render the sidebar */}
      <main className="flex-1 lg:ml-64 p-6 space-y-6"> {/* <-- ADDED: Main content area with left margin on large screens */}
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">HI, Jubed</h1>
            <p className="text-gray-300">Welcome back to Ecommerce</p> {/* <-- FIXED: Typo "Ecomic" → "Ecommerce" */}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Today&apos;s Sale</p>
            <p className="text-2xl font-bold text-white">$12,426</p>
            <p className="text-green-400 text-sm">↑ +36% vs last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sales Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Report Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Sales Report</h2>
                <div className="flex space-x-2">
                  {["11 MONTHS", "6 MONTHS", "30 DAYS", "7 DAYS"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        timeRange === range
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {statsData.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">{stat.date}</p>
                      <p className="text-gray-300 text-sm">{stat.sales}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{stat.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Customers Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Customers</h2>
                <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  Show 5 from 12
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left pb-3 text-gray-300 font-medium">Orders ID</th>
                      <th className="text-left pb-3 text-gray-300 font-medium">Customer Name</th>
                      <th className="text-left pb-3 text-gray-300 font-medium">Date</th>
                      <th className="text-left pb-3 text-gray-300 font-medium">Price</th>
                      <th className="text-left pb-3 text-gray-300 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCustomers.map((customer, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 text-white font-medium">{customer.id}</td>
                        <td className="py-3 text-white">{customer.name}</td>
                        <td className="py-3 text-gray-300">{customer.date}</td>
                        <td className="py-3 text-white font-medium">{customer.price}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              customer.status === "Complete"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Total Sales Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Total Sales</h2>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">84,382</p>
                <p className="text-green-400 text-sm">↑ +36% vs last month</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-gray-300 text-sm">Total Orders</p>
              </div>
            </div>

            {/* Traffic Sources Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Traffic Sources</h2>
                <span className="text-gray-300 text-sm">LAST DAY</span> {/* <-- FIXED: Typo "LATT DAVE" → "LAST DAY" */}
              </div>
              <div className="space-y-3">
                {trafficSources.map((source, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{source.name}</span>
                    <span className="text-white font-medium">{source.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Stats Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Device Stats</h2> {/* <-- FIXED: "Total Bets" → "Device Stats" for clarity */}
              <div className="space-y-4">
                {deviceStats.map((device, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{device.name}</span>
                      <span className="text-white">{device.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// components/Ui/admin/UI/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(item => item !== menuName)
        : [...prev, menuName]
    );
  };

  const mainMenuItems = [
    {
      name: "Dashboard",
      icon: "ri-dashboard-line",
      href: "/admin",
      badge: null,
      submenu: null
    },
    {
      name: "Orders",
      icon: "ri-shopping-cart-line",
      href: "/admin/orders",
      badge: null,
      submenu: null
    },
    {
      name: "Products",
      icon: "ri-shopping-bag-line",
      href: "/admin/products",
      badge: null,
      submenu: [
        { name: "All Products", href: "/admin/products", icon: "ri-list-check" },
        { name: "Add Product", href: "/admin/products/upload", icon: "ri-add-circle-line" },
        { name: "Categories", href: "/admin/products/categories", icon: "ri-folder-line" },
        { name: "Inventory", href: "/admin/products/inventory", icon: "ri-archive-line" },
        { name: "Reviews", href: "/admin/products/reviews", icon: "ri-star-line" }
      ]
    },
    {
      name: "Analytics",
      icon: "ri-bar-chart-line",
      href: "/admin/analytics",
      badge: null,
      submenu: null
    },
    {
      name: "Banners",
      icon: "ri-image-line",
      href: "/admin/BannerManagement",
      badge: null,
      submenu: null
    },
    {
      name: "Customers",
      icon: "ri-user-line",
      href: "/admin/customers",
      badge: null,
      submenu: null
    },
    // {
    //   name: "Finances",
    //   icon: "ri-money-dollar-circle-line",
    //   href: "/admin/finances",
    //   badge: null,
    //   submenu: null
    // },
    {
      name: "Invoices",
      icon: "ri-file-text-line",
      href: "/admin/invoices",
      badge: 3,
      submenu: null
    },
    // {
    //   name: "Discounts",
    //   icon: "ri-coupon-line",
    //   href: "/admin/discounts",
    //   badge: null,
    //   submenu: null
    // },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isProductsActive = pathname.startsWith("/admin/products");

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50  // <-- CHANGED: Removed lg:static, now always fixed
          bg-black backdrop-blur-lg border-r border-white/20
          transform transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        <div className="flex flex-col min-h-screen h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="ri-shopping-cart-2-line text-white text-lg"></i>
                </div>
                <span className="text-white font-bold text-lg">Next win</span>
              </div>
            )}

            {isCollapsed && (
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
                <i className="ri-shopping-cart-2-line text-white text-lg"></i>
              </div>
            )}

            {/* Toggle Button - Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <i className={`ri-${isCollapsed ? 'sidebar-unfold' : 'sidebar-fold'}-line text-xl`}></i>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            {!isCollapsed ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-colors"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"></i>
              </div>
            ) : (
              <button className="w-full p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors flex justify-center">
                <i className="ri-search-line text-xl"></i>
              </button>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex-1  overflow-y-auto">
            {/* Main Menu */}
            <div className="px-3 py-2">
              {!isCollapsed && (
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                  Main Menu
                </p>
              )}
              <ul className="space-y-1">
                {mainMenuItems.map((item) => {
                  const active = isActive(item.href);
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenus.includes(item.name);
                  const isProductsItem = item.name === "Products";

                  return (
                    <li key={item.name}>
                      <div className="relative">
                        <Link
                          href={hasSubmenu ? "#" : item.href}
                          onClick={(e) => {
                            if (hasSubmenu) {
                              e.preventDefault();
                              toggleMenu(item.name);
                            }
                          }}
                          className={`
                            flex items-center  px-3 py-3 rounded-lg transition-all group relative
                            ${active || (isProductsItem && isProductsActive)
                              ? 'bg-white/20 text-white shadow-lg'
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }
                            ${isCollapsed ? 'justify-center' : ''}
                          `}
                        >
                          <i className={`${item.icon} text-xl ${active ? 'text-white' : ''}`}></i>

                          {!isCollapsed && (
                            <>
                              <span className="ml-3 font-medium flex-1">{item.name}</span>
                              {item.badge && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                              {hasSubmenu && (
                                <i className={`ri-arrow-down-s-line ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                              )}
                            </>
                          )}

                          {/* Tooltip for collapsed state */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                              {item.name}
                              {item.badge && (
                                <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>

                        {/* Submenu */}
                        {!isCollapsed && hasSubmenu && isExpanded && (
                          <ul className="ml-6 mt-1 space-y-1 border-l border-white/20 pl-3">
                            {item.submenu!.map((subItem) => {
                              const subActive = isActive(subItem.href);
                              return (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className={`
                                      flex items-center px-3 py-2 rounded-lg transition-all group
                                      ${subActive
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                                      }
                                    `}
                                  >
                                    <i className={`${subItem.icon} text-lg mr-3`}></i>
                                    <span className="text-sm font-medium">{subItem.name}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-white/20 p-4 space-y-2">
            {/* Settings */}
            <button className={`
              flex items-center w-full px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}>
              <i className="ri-settings-3-line text-xl"></i>
              {!isCollapsed && <span className="ml-3 font-medium">Settings</span>}
            </button>

            {/* Help Center */}
            <button className={`
              flex items-center w-full px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}>
              <i className="ri-customer-service-2-line text-xl"></i>
              {!isCollapsed && <span className="ml-3 font-medium">Help Center</span>}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`
                flex items-center w-full px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} text-xl`}></i>
              {!isCollapsed && (
                <span className="ml-3 font-medium">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className={`
              flex items-center pt-2 mt-2 border-t border-white/20
              ${isCollapsed ? 'justify-center' : 'space-x-3'}
            `}>
              <img
                src="/api/placeholder/40/40"
                alt="Ryan Reybrown"
                className="w-8 h-8 rounded-full border-2 border-white/20"
              />

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">Ryan Reybrown</p>
                  <p className="text-white/60 text-xs truncate">vommi@gmail.com</p>
                </div>
              )}

              {!isCollapsed && (
                <button className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                  <i className="ri-arrow-down-s-line text-lg"></i>
                </button>
              )}
            </div>
          </div>
          <div className="bg-black">
            <samp className="text-amber-100">Dev by Splisx Studio</samp>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white"
      >
        <i className="ri-menu-line text-xl"></i>
      </button>

      {/* Remixicon CDN */}
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </>
  );
}

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  TrendingUp,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Layout({ children, currentPage = 'dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      key: "dashboard",
      path: "/",
      active: currentPage === 'dashboard',
    },
    {
      icon: FileText,
      label: "Issues",
      key: "issues",
      path: "/issues",
      active: currentPage === 'issues',
    },
    {
      icon: Building2,
      label: "Departments",
      key: "departments",
      path: "/departments",
      active: currentPage === 'departments',
    },
    {
      icon: Users,
      label: "Staff",
      key: "staff",
      path: "/staff",
      active: currentPage === 'staff',
    },
    {
      icon: TrendingUp,
      label: "Reports",
      key: "reports",
      path: "/reports", 
      active: currentPage === 'reports',
    },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: "Settings", key: "settings", path: "/settings" },
    { icon: LogOut, label: "Log Out", isLogout: true },
  ];

  const handleNavigation = (item) => {
    if (item.isLogout) {
      // Handle logout logic
      console.log('Logging out...');
    } else if (item.path) {
      window.location.href = item.path;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-['Inter']">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-[#EDF0F4] z-50 transition-all duration-300 ease-in-out w-60 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[#EDF0F4] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#4F8BFF] rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-[#07111F] font-bold text-xl">
              Municipal Hub
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden p-1 rounded hover:bg-[#F5F7FB] transition-colors"
          >
            <X size={24} className="text-[#536081]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                item.active
                  ? "bg-[#4F8BFF] text-white"
                  : "text-[#536081] hover:bg-[#F1F5FF] hover:text-[#4F8BFF]"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-[#EDF0F4] p-3 space-y-1 flex-shrink-0">
          {bottomMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                item.isLogout
                  ? "text-[#E12929] hover:bg-[#FFEDED] hover:text-[#C71414]"
                  : "text-[#536081] hover:bg-[#F1F5FF] hover:text-[#4F8BFF]"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-60">
        {/* Top Bar */}
        <header
          className="h-16 bg-white border-b border-[#EDF0F4] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1 rounded hover:bg-[#F5F7FB] transition-colors"
            >
              <Menu size={24} className="text-[#536081]" />
            </button>

            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A94A7]"
              />
              <input
                type="text"
                placeholder="Search issues, staff, departments..."
                className="w-48 sm:w-64 md:w-72 pl-10 pr-4 py-2 bg-white border border-[#E1E6ED] rounded-lg text-sm text-[#8A94A7] placeholder-[#8A94A7] focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="relative p-2 bg-white border border-[#E1E6ED] rounded-lg hover:bg-[#F5F7FB] transition-colors">
              <Bell size={20} className="text-[#536081]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E12929] rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-[#4F8BFF]"></div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
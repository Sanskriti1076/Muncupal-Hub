import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Building2,
  TrendingUp,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  User,
  MapPin,
  Calendar,
  Menu,
  X,
} from "lucide-react";

export default function MunicipalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const statsResponse = await fetch("/api/municipal/dashboard/stats");
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setDashboardStats(stats);
        }

        const issuesResponse = await fetch("/api/municipal/issues?limit=10");
        if (issuesResponse.ok) {
          const issues = await issuesResponse.json();
          setRecentIssues(issues.data || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      key: "dashboard",
      active: activeTab === "dashboard",
    },
    {
      icon: FileText,
      label: "Issues",
      key: "issues",
      active: activeTab === "issues",
      path: "/issues",
    },
    {
      icon: Building2,
      label: "Departments",
      key: "departments",
      active: activeTab === "departments",
    },
    {
      icon: Users,
      label: "Staff",
      key: "staff",
      active: activeTab === "staff",
    },
    {
      icon: TrendingUp,
      label: "Reports",
      key: "reports",
      active: activeTab === "reports",
    },
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      window.location.href = item.path;
    } else {
      setActiveTab(item.key);
    }
  };

  const bottomMenuItems = [
    { icon: Settings, label: "Settings", key: "settings" },
    { icon: LogOut, label: "Log Out", isLogout: true },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-[#FF8A00] border-[#FF8A00] bg-[#FFF4E6]";
      case "in_progress":
        return "text-[#4F8BFF] border-[#4F8BFF] bg-[#F0F7FF]";
      case "resolved":
        return "text-[#0E9250] border-[#0E9250] bg-[#EAF9F0]";
      case "closed":
        return "text-[#536081] border-[#536081] bg-[#F5F7FB]";
      default:
        return "text-[#536081] border-[#536081] bg-[#F5F7FB]";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "text-[#E12929] border-[#E12929] bg-[#FFEDED]";
      case "high":
        return "text-[#FF8A00] border-[#FF8A00] bg-[#FFF4E6]";
      case "medium":
        return "text-[#4F8BFF] border-[#4F8BFF] bg-[#F0F7FF]";
      case "low":
        return "text-[#0E9250] border-[#0E9250] bg-[#EAF9F0]";
      default:
        return "text-[#536081] border-[#536081] bg-[#F5F7FB]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4F8BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#536081]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <main className="p-4 md:p-6 lg:p-8">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-[#07111F] font-bold text-2xl sm:text-3xl mb-2">
                Dashboard Overview
              </h1>
              <p className="text-[#536081]">
                Monitor and manage civic issues across all departments
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#4F8BFF] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-[#4F8BFF]" />
                  </div>
                  <span className="text-2xl font-bold text-[#07111F]">
                    {dashboardStats?.total_issues || 0}
                  </span>
                </div>
                <h3 className="text-[#536081] text-sm font-medium mb-1">
                  Total Issues
                </h3>
                <p className="text-xs text-[#8A94A7]">All reported issues</p>
              </div>

              <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#FF8A00] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Clock size={24} className="text-[#FF8A00]" />
                  </div>
                  <span className="text-2xl font-bold text-[#07111F]">
                    {dashboardStats?.pending_issues || 0}
                  </span>
                </div>
                <h3 className="text-[#536081] text-sm font-medium mb-1">
                  Pending
                </h3>
                <p className="text-xs text-[#8A94A7]">Awaiting assignment</p>
              </div>

              <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#4F8BFF] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={24} className="text-[#4F8BFF]" />
                  </div>
                  <span className="text-2xl font-bold text-[#07111F]">
                    {dashboardStats?.in_progress_issues || 0}
                  </span>
                </div>
                <h3 className="text-[#536081] text-sm font-medium mb-1">
                  In Progress
                </h3>
                <p className="text-xs text-[#8A94A7]">Being worked on</p>
              </div>

              <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#0E9250] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <CheckCircle size={24} className="text-[#0E9250]" />
                  </div>
                  <span className="text-2xl font-bold text-[#07111F]">
                    {dashboardStats?.resolved_issues || 0}
                  </span>
                </div>
                <h3 className="text-[#536081] text-sm font-medium mb-1">
                  Resolved
                </h3>
                <p className="text-xs text-[#8A94A7]">Completed this month</p>
              </div>
            </div>

            {/* Recent Issues Table */}
            <div className="bg-white rounded-xl border border-[#EDF0F4] overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-[#EDF0F4] flex items-center justify-between">
                <h2 className="text-[#07111F] font-semibold text-lg">
                  Recent Issues
                </h2>
                <button
                  onClick={() => setActiveTab("issues")}
                  className="text-[#4F8BFF] text-sm font-medium hover:text-[#3D6FE5] transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[#FAFBFC] border-b border-[#EDF0F4]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Issue ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Citizen
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#EDF0F4]">
                    {recentIssues.map((issue) => (
                      <tr
                        key={issue.id}
                        className="hover:bg-[#F7F9FC] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-[#07111F] font-medium">
                          {issue.issue_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#07111F] max-w-xs truncate">
                          {issue.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#536081]">
                          {issue.citizen_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#536081] max-w-xs truncate">
                          {issue.location}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              issue.priority,
                            )}`}
                          >
                            {issue.priority?.charAt(0).toUpperCase() +
                              issue.priority?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              issue.status,
                            )}`}
                          >
                            {issue.status
                              ?.replace("_", " ")
                              .charAt(0)
                              .toUpperCase() +
                              issue.status?.replace("_", " ").slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#536081]">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                              <Eye size={16} className="text-[#536081]" />
                            </button>
                            <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                              <Edit size={16} className="text-[#536081]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* Other tabs content will be added here */}
        {activeTab !== "dashboard" && (
          <main className="p-4 md:p-6 lg:p-8">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-[#07111F] mb-2">
                {menuItems.find((item) => item.key === activeTab)?.label}{" "}
                Section
              </h2>
              <p className="text-[#536081]">
                This section is under development.
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

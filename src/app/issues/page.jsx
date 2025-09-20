import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  X,
} from "lucide-react";

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    department: "",
    priority: "",
    sortBy: "created_at",
    sortOrder: "DESC",
  });

  // Fetch issues with filters
  const fetchIssues = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== ""),
        ),
      });

      const response = await fetch(`/api/municipal/issues?${params}`);
      if (response.ok) {
        const data = await response.json();
        setIssues(data.data || []);
        setPagination(data.pagination || {});
      } else {
        console.error("Failed to fetch issues");
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments for filter dropdown
  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/municipal/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchIssues(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      department: "",
      priority: "",
      sortBy: "created_at",
      sortOrder: "DESC",
    });
  };

  const handlePageChange = (page) => {
    fetchIssues(page);
  };

  const toggleIssueSelection = (issueId) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId],
    );
  };

  const toggleAllSelection = () => {
    setSelectedIssues((prev) =>
      prev.length === issues.length ? [] : issues.map((issue) => issue.id),
    );
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "in_progress":
        return <RefreshCw size={14} />;
      case "resolved":
        return <CheckCircle size={14} />;
      case "closed":
        return <CheckCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <Layout currentPage="issues">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#07111F] font-bold text-2xl sm:text-3xl mb-2">
            Issues Management
          </h1>
          <p className="text-[#536081]">
            Track and manage all civic issues reported by citizens
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A94A7]"
              />
              <input
                type="text"
                placeholder="Search by title, citizen name, location, or issue ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-[#4F8BFF] text-white border-[#4F8BFF]"
                    : "bg-white border-[#E1E6ED] text-[#536081] hover:border-[#4F8BFF]"
                }`}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>

              <button className="flex items-center px-4 py-2 bg-white border border-[#E1E6ED] rounded-lg text-[#536081] hover:border-[#4F8BFF] transition-colors">
                <Download size={16} className="mr-2" />
                Export
              </button>

              <button className="flex items-center px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5] transition-colors">
                <Plus size={16} className="mr-2" />
                New Issue
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#EDF0F4]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#536081] mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF]"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#536081] mb-1">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF]"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#536081] mb-1">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF]"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center px-4 py-2 text-[#536081] border border-[#E1E6ED] rounded-lg hover:border-[#4F8BFF] transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-[#EDF0F4] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-[#07111F] font-semibold text-lg">
                Issues ({pagination.totalCount || 0})
              </h2>
              {selectedIssues.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#536081]">
                    {selectedIssues.length} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-xs bg-[#4F8BFF] text-white rounded hover:bg-[#3D6FE5] transition-colors">
                      Assign
                    </button>
                    <button className="px-3 py-1 text-xs bg-[#E12929] text-white rounded hover:bg-[#C71414] transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#FAFBFC] border-b border-[#EDF0F4]">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedIssues.length === issues.length &&
                        issues.length > 0
                      }
                      onChange={toggleAllSelection}
                      className="rounded border-[#E1E6ED] text-[#4F8BFF] focus:ring-[#4F8BFF]"
                    />
                  </th>
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
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#EDF0F4]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-[#536081]"
                    >
                      <div className="w-8 h-8 border-4 border-[#4F8BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      Loading issues...
                    </td>
                  </tr>
                ) : issues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-[#536081]"
                    >
                      <FileText
                        size={48}
                        className="mx-auto mb-4 text-[#8A94A7]"
                      />
                      No issues found
                    </td>
                  </tr>
                ) : (
                  issues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="hover:bg-[#F7F9FC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIssues.includes(issue.id)}
                          onChange={() => toggleIssueSelection(issue.id)}
                          className="rounded border-[#E1E6ED] text-[#4F8BFF] focus:ring-[#4F8BFF]"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-[#07111F] font-medium">
                        {issue.issue_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-[#07111F] truncate">
                            {issue.title}
                          </div>
                          {issue.location && (
                            <div className="text-xs text-[#536081] flex items-center mt-1">
                              <MapPin size={12} className="mr-1" />
                              {issue.location.length > 40
                                ? `${issue.location.substring(0, 40)}...`
                                : issue.location}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#536081]">
                          {issue.citizen_name}
                        </div>
                        {issue.citizen_email && (
                          <div className="text-xs text-[#8A94A7]">
                            {issue.citizen_email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#536081]">
                        {issue.department_name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            issue.priority,
                          )}`}
                        >
                          <AlertTriangle size={12} className="mr-1" />
                          {issue.priority?.charAt(0).toUpperCase() +
                            issue.priority?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            issue.status,
                          )}`}
                        >
                          {getStatusIcon(issue.status)}
                          <span className="ml-1">
                            {issue.status
                              ?.replace("_", " ")
                              .charAt(0)
                              .toUpperCase() +
                              issue.status?.replace("_", " ").slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#536081] flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(issue.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-[#8A94A7]">
                          {new Date(issue.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                            <Eye size={16} className="text-[#536081]" />
                          </button>
                          <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                            <Edit size={16} className="text-[#536081]" />
                          </button>
                          <button className="p-1 rounded hover:bg-[#FFEDED] transition-colors">
                            <Trash2 size={16} className="text-[#E12929]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#EDF0F4] flex items-center justify-between">
              <div className="text-sm text-[#536081]">
                Showing {(pagination.currentPage - 1) * 20 + 1} to{" "}
                {Math.min(pagination.currentPage * 20, pagination.totalCount)}{" "}
                of {pagination.totalCount} results
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E1E6ED] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F7FB] transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="px-3 py-1 text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E1E6ED] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F7FB] transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

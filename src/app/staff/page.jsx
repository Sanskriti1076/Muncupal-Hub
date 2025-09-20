import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
} from "lucide-react";
import Layout from "@/components/Layout";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch staff and departments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch departments
        const deptResponse = await fetch("/api/municipal/departments");
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData.data || []);
        }

        // Fetch staff (we'll create this API endpoint)
        const staffResponse = await fetch("/api/municipal/staff");
        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          setStaff(staffData.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter staff based on search and filters
  const filteredStaff = staff.filter((member) => {
    const matchesSearch = 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || member.department_id === selectedDepartment;
    const matchesRole = !selectedRole || member.role === selectedRole;
    const matchesStatus = !selectedStatus || 
      (selectedStatus === "active" && member.is_active) ||
      (selectedStatus === "inactive" && !member.is_active);

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-[#E12929] border-[#E12929] bg-[#FFEDED]";
      case "officer":
        return "text-[#4F8BFF] border-[#4F8BFF] bg-[#F0F7FF]";
      case "staff":
        return "text-[#0E9250] border-[#0E9250] bg-[#EAF9F0]";
      default:
        return "text-[#536081] border-[#536081] bg-[#F5F7FB]";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown size={14} />;
      case "officer":
        return <Shield size={14} />;
      case "staff":
        return <Users size={14} />;
      default:
        return <Users size={14} />;
    }
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : "Unassigned";
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStaff(paginatedStaff.map(member => member.id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleSelectStaff = (staffId, checked) => {
    if (checked) {
      setSelectedStaff([...selectedStaff, staffId]);
    } else {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    }
  };

  if (loading) {
    return (
      <Layout currentPage="staff">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#4F8BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#536081]">Loading staff...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="staff">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-[#07111F] font-bold text-2xl sm:text-3xl mb-2">
                Staff Management
              </h1>
              <p className="text-[#536081]">
                Manage municipal staff members, roles, and permissions
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5] transition-colors font-medium"
            >
              <UserPlus size={20} className="mr-2" />
              Add Staff Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#4F8BFF] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-[#4F8BFF]" />
              </div>
              <span className="text-2xl font-bold text-[#07111F]">
                {staff.length}
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Total Staff
            </h3>
            <p className="text-xs text-[#8A94A7]">All registered staff</p>
          </div>

          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#0E9250] bg-opacity-10 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-[#0E9250]" />
              </div>
              <span className="text-2xl font-bold text-[#07111F]">
                {staff.filter(s => s.is_active).length}
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Active Staff
            </h3>
            <p className="text-xs text-[#8A94A7]">Currently active</p>
          </div>

          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E12929] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Crown size={24} className="text-[#E12929]" />
              </div>
              <span className="text-2xl font-bold text-[#07111F]">
                {staff.filter(s => s.role === 'admin').length}
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Administrators
            </h3>
            <p className="text-xs text-[#8A94A7]">Admin level access</p>
          </div>

          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FF8A00] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-[#FF8A00]" />
              </div>
              <span className="text-2xl font-bold text-[#07111F]">
                {departments.length}
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Departments
            </h3>
            <p className="text-xs text-[#8A94A7]">Active departments</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A94A7]"
                />
                <input
                  type="text"
                  placeholder="Search staff by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              >
                <option value="">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="officer">Officer</option>
                <option value="staff">Staff</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EDF0F4] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-[#07111F] font-semibold text-lg">
                Staff Members ({filteredStaff.length})
              </h2>
              {selectedStaff.length > 0 && (
                <span className="text-sm text-[#4F8BFF] bg-[#F0F7FF] px-3 py-1 rounded-full">
                  {selectedStaff.length} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#536081] hover:bg-[#F5F7FB] rounded-lg transition-colors">
                <Filter size={20} />
              </button>
              <button className="p-2 text-[#536081] hover:bg-[#F5F7FB] rounded-lg transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#FAFBFC] border-b border-[#EDF0F4]">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStaff.length === paginatedStaff.length && paginatedStaff.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-[#E1E6ED] text-[#4F8BFF] focus:ring-[#4F8BFF]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#EDF0F4]">
                {paginatedStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-[#F7F9FC] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(member.id)}
                        onChange={(e) => handleSelectStaff(member.id, e.target.checked)}
                        className="rounded border-[#E1E6ED] text-[#4F8BFF] focus:ring-[#4F8BFF]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#4F8BFF] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-[#4F8BFF] font-medium text-sm">
                            {member.full_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#07111F]">
                            {member.full_name}
                          </div>
                          <div className="text-sm text-[#536081]">
                            @{member.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          member.role,
                        )}`}
                      >
                        {getRoleIcon(member.role)}
                        <span className="ml-1">
                          {member.role?.charAt(0).toUpperCase() + member.role?.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#536081]">
                      {getDepartmentName(member.department_id)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#536081]">
                        <div className="flex items-center mb-1">
                          <Mail size={14} className="mr-2 text-[#8A94A7]" />
                          {member.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          member.is_active
                            ? "text-[#0E9250] border-[#0E9250] bg-[#EAF9F0]"
                            : "text-[#E12929] border-[#E12929] bg-[#FFEDED]"
                        }`}
                      >
                        {member.is_active ? (
                          <>
                            <CheckCircle size={12} className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#536081]">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                          <Eye size={16} className="text-[#536081]" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                          <Edit size={16} className="text-[#536081]" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#F5F7FB] transition-colors">
                          <Trash2 size={16} className="text-[#E12929]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#EDF0F4] flex items-center justify-between">
              <div className="text-sm text-[#536081]">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff members
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-[#E1E6ED] rounded hover:bg-[#F5F7FB] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === page
                        ? "bg-[#4F8BFF] text-white border-[#4F8BFF]"
                        : "border-[#E1E6ED] hover:bg-[#F5F7FB]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-[#E1E6ED] rounded hover:bg-[#F5F7FB] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
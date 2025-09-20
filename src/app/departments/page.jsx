import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  Building2,
  Search,
  Plus,
  Users,
  AlertTriangle,
  Edit,
  Trash2,
  User,
  Mail,
  ChevronRight,
  X,
} from "lucide-react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample department data - replace with your API call
  const sampleDepartments = [
    {
      id: 1,
      name: "Sanitation Department",
      description: "Waste Management, recycling, and environmental programs",
      headName: "",
      headEmail: "",
      staffCount: 0,
      activeIssuesCount: 0,
    },
    {
      id: 2,
      name: "Public Works",
      description: "Roads, infrastructure, and public facilities maintenance",
      headName: "",
      headEmail: "",
      staffCount: 0,
      activeIssuesCount: 0,
    },
    {
      id: 3,
      name: "Parks & Recreation",
      description: "Parks, recreational facilities, and green spaces",
      headName: "",
      headEmail: "",
      staffCount: 0,
      activeIssuesCount: 0,
    },
    {
      id: 4,
      name: "Public Safety",
      description: "Traffic, security, and safety concerns",
      headName: "",
      headEmail: "",
      staffCount: 0,
      activeIssuesCount: 0,
    },
    {
      id: 5,
      name: "Utilities",
      description: "Water, electricity, and waste management",
      headName: "",
      headEmail: "",
      staffCount: 0,
      activeIssuesCount: 0,
    }
  ];

  // Fetch departments - replace with your actual API call
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      // const response = await fetch('/api/municipal/departments');
      // if (response.ok) {
      //   const data = await response.json();
      //   setDepartments(data.data || []);
      // } else {
      //   console.error('Failed to fetch departments');
      // }
      
      // Using sample data for now
      setDepartments(sampleDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (formData) => {
    try {
      // Replace with your actual API call
      // const response = await fetch('/api/municipal/departments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (response.ok) {
      //   await fetchDepartments(); // Refresh the list
      //   setShowCreateForm(false);
      // } else {
      //   console.error('Failed to create department');
      // }
      
      // For demo purposes, add to local state
      const newDepartment = {
        id: departments.length + 1,
        ...formData,
        headName: "",
        headEmail: "",
        staffCount: 0,
        activeIssuesCount: 0,
      };
      
      setDepartments([...departments, newDepartment]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleDeleteDepartment = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout currentPage="departments">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#4F8BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#536081]">Loading departments...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="departments">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#07111F] font-bold text-2xl sm:text-3xl mb-2">
            Departments
          </h1>
          <p className="text-[#536081]">
            Manage municipal departments and their staff assignments
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A94A7]"
              />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5] transition-colors"
            >
              <Plus size={16} className="mr-2" />
              New Department
            </button>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <DepartmentCard 
              key={department.id} 
              department={department} 
              onDelete={handleDeleteDepartment}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 size={48} className="mx-auto mb-4 text-[#8A94A7]" />
            <h3 className="text-[#07111F] font-semibold mb-2">No departments found</h3>
            <p className="text-[#536081] mb-4">Get started by creating your first department</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5] transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Create Department
            </button>
          </div>
        )}

        {/* Create Department Modal */}
        {showCreateForm && (
          <CreateDepartmentModal
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateDepartment}
          />
        )}
      </div>
    </Layout>
  );
}

// Department Card Component
function DepartmentCard({ department, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-all duration-200">
      {/* Department Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-[#4F8BFF] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <Building2 size={20} className="text-[#4F8BFF]" />
            </div>
            <h3 className="text-[#07111F] font-semibold text-lg">
              {department.name}
            </h3>
          </div>
          {department.description && (
            <p className="text-[#536081] text-sm mb-3">
              {department.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 rounded hover:bg-[#F5F7FB] transition-colors">
            <Edit size={16} className="text-[#536081]" />
          </button>
          <button 
            onClick={() => onDelete(department.id)}
            className="p-1.5 rounded hover:bg-[#FFEDED] transition-colors"
          >
            <Trash2 size={16} className="text-[#E12929]" />
          </button>
        </div>
      </div>

      {/* Department Head */}
      {department.headName ? (
        <div className="flex items-center mb-4 p-3 bg-[#F7F9FC] rounded-lg">
          <div className="w-8 h-8 bg-[#4F8BFF] rounded-full flex items-center justify-center mr-3">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-[#07111F]">
              {department.headName}
            </div>
            <div className="text-xs text-[#536081] flex items-center">
              <Mail size={12} className="mr-1" />
              {department.headEmail}
            </div>
          </div>
          <div className="text-xs text-[#8A94A7] font-medium">
            HEAD
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mb-4 p-3 bg-[#F7F9FC] rounded-lg border-2 border-dashed border-[#E1E6ED]">
          <User size={16} className="text-[#8A94A7] mr-2" />
          <span className="text-sm text-[#8A94A7]">No department head assigned</span>
        </div>
      )}

      {/* Department Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-[#F0F7FF] rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-[#4F8BFF] mr-1" />
            <span className="text-lg font-bold text-[#07111F]">
              {department.staffCount || 0}
            </span>
          </div>
          <div className="text-xs text-[#536081] font-medium">Staff</div>
        </div>
        
        <div className="text-center p-3 bg-[#FFF4E6] rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle size={16} className="text-[#FF8A00] mr-1" />
            <span className="text-lg font-bold text-[#07111F]">
              {department.activeIssuesCount || 0}
            </span>
          </div>
          <div className="text-xs text-[#536081] font-medium">Active Issues</div>
        </div>
      </div>

      {/* View Details Button */}
      <button className="w-full flex items-center justify-center px-4 py-2 border border-[#E1E6ED] rounded-lg text-[#536081] hover:border-[#4F8BFF] hover:text-[#4F8BFF] transition-colors">
        View Details
        <ChevronRight size={16} className="ml-2" />
      </button>
    </div>
  );
}

// Create Department Modal Component
function CreateDepartmentModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#EDF0F4] w-full max-w-md">
        <div className="px-6 py-4 border-b border-[#EDF0F4]">
          <h2 className="text-[#07111F] font-semibold text-xl">Create New Department</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#536081] mb-2">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              placeholder="Enter department name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#536081] mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              placeholder="Enter department description"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E1E6ED] rounded-lg text-[#536081] hover:border-[#4F8BFF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
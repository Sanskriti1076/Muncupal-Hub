import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Users,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import Layout from "@/components/Layout";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch reports data
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);

        // Fetch departments
        const deptResponse = await fetch("/api/municipal/departments");
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData.data || []);
        }

        // Fetch reports data (we'll create this API endpoint)
        const reportsResponse = await fetch(`/api/municipal/reports?period=${selectedPeriod}&department=${selectedDepartment}`);
        if (reportsResponse.ok) {
          const reports = await reportsResponse.json();
          setReportData(reports.data || {});
        }
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [selectedPeriod, selectedDepartment]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleExport = (format) => {
    // Simulate export functionality
    console.log(`Exporting reports as ${format}`);
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp size={16} className="text-[#0E9250]" />;
    if (trend < 0) return <ArrowDown size={16} className="text-[#E12929]" />;
    return <Minus size={16} className="text-[#8A94A7]" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-[#0E9250]";
    if (trend < 0) return "text-[#E12929]";
    return "text-[#8A94A7]";
  };

  // Mock data for demonstration
  const mockReportData = {
    overview: {
      totalIssues: 1247,
      resolvedIssues: 892,
      avgResolutionTime: 4.2,
      customerSatisfaction: 87.5,
      trends: {
        totalIssues: 12.5,
        resolvedIssues: 8.3,
        avgResolutionTime: -15.2,
        customerSatisfaction: 3.1
      }
    },
    issuesByStatus: [
      { status: "Pending", count: 156, percentage: 12.5, color: "#FF8A00" },
      { status: "In Progress", count: 199, percentage: 16.0, color: "#4F8BFF" },
      { status: "Resolved", count: 892, percentage: 71.5, color: "#0E9250" }
    ],
    issuesByPriority: [
      { priority: "Critical", count: 23, percentage: 1.8, color: "#E12929" },
      { priority: "High", count: 187, percentage: 15.0, color: "#FF8A00" },
      { priority: "Medium", count: 623, percentage: 50.0, color: "#4F8BFF" },
      { priority: "Low", count: 414, percentage: 33.2, color: "#0E9250" }
    ],
    departmentPerformance: [
      { name: "Public Works", issues: 342, resolved: 298, percentage: 87.1 },
      { name: "Parks & Recreation", issues: 189, resolved: 167, percentage: 88.4 },
      { name: "Transportation", issues: 234, resolved: 198, percentage: 84.6 },
      { name: "Utilities", issues: 156, resolved: 142, percentage: 91.0 },
      { name: "Housing", issues: 98, resolved: 87, percentage: 88.8 }
    ],
    monthlyTrends: [
      { month: "Jan", issues: 98, resolved: 89 },
      { month: "Feb", issues: 112, resolved: 95 },
      { month: "Mar", issues: 134, resolved: 118 },
      { month: "Apr", issues: 156, resolved: 142 },
      { month: "May", issues: 189, resolved: 167 },
      { month: "Jun", issues: 178, resolved: 159 }
    ]
  };

  const currentData = reportData || mockReportData;

  if (loading) {
    return (
      <Layout currentPage="reports">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#4F8BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#536081]">Loading reports...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="reports">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-[#07111F] font-bold text-2xl sm:text-3xl mb-2">
                Reports & Analytics
              </h1>
              <p className="text-[#536081]">
                Comprehensive insights into municipal operations and performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-[#E1E6ED] text-[#536081] rounded-lg hover:bg-[#F5F7FB] transition-colors font-medium disabled:opacity-50"
              >
                <RefreshCw size={20} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="inline-flex items-center px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5] transition-colors font-medium"
                >
                  <Download size={20} className="mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="inline-flex items-center px-4 py-2 border border-[#4F8BFF] text-[#4F8BFF] rounded-lg hover:bg-[#F0F7FF] transition-colors font-medium"
                >
                  <Download size={20} className="mr-2" />
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#536081] mb-2">
                Time Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#536081] mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-[#E1E6ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F8BFF] focus:border-[#4F8BFF]"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#4F8BFF] bg-opacity-10 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-[#4F8BFF]" />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(currentData.overview?.trends?.totalIssues || 0)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.overview?.trends?.totalIssues || 0)}`}>
                  {Math.abs(currentData.overview?.trends?.totalIssues || 0)}%
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-[#07111F]">
                {currentData.overview?.totalIssues?.toLocaleString() || '0'}
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Total Issues
            </h3>
            <p className="text-xs text-[#8A94A7]">All reported issues</p>
          </div>

          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#0E9250] bg-opacity-10 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-[#0E9250]" />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(currentData.overview?.trends?.resolvedIssues || 0)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.overview?.trends?.resolvedIssues || 0)}`}>
                  {Math.abs(currentData.overview?.trends?.resolvedIssues || 0)}%
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-[#07111F]">
                {currentData.overview?.resolvedIssues?.toLocaleString() || '0'}
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Resolved Issues
            </h3>
            <p className="text-xs text-[#8A94A7]">Successfully completed</p>
          </div>

          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FF8A00] bg-opacity-10 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-[#FF8A00]" />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(currentData.overview?.trends?.avgResolutionTime || 0)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.overview?.trends?.avgResolutionTime || 0)}`}>
                  {Math.abs(currentData.overview?.trends?.avgResolutionTime || 0)}%
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-[#07111F]">
                {currentData.overview?.avgResolutionTime || '0'} days
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Avg Resolution Time
            </h3>
            <p className="text-xs text-[#8A94A7]">Time to resolve issues</p>
          </div>

          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E12929] bg-opacity-10 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-[#E12929]" />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(currentData.overview?.trends?.customerSatisfaction || 0)}
                <span className={`text-sm font-medium ${getTrendColor(currentData.overview?.trends?.customerSatisfaction || 0)}`}>
                  {Math.abs(currentData.overview?.trends?.customerSatisfaction || 0)}%
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-[#07111F]">
                {currentData.overview?.customerSatisfaction || '0'}%
              </span>
            </div>
            <h3 className="text-[#536081] text-sm font-medium mb-1">
              Satisfaction Rate
            </h3>
            <p className="text-xs text-[#8A94A7]">Citizen satisfaction</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Issues by Status */}
          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#07111F] font-semibold text-lg">Issues by Status</h3>
              <PieChart size={20} className="text-[#8A94A7]" />
            </div>
            <div className="space-y-4">
              {currentData.issuesByStatus?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-[#07111F]">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#536081]">{item.count}</span>
                    <span className="text-sm font-medium text-[#07111F] min-w-[3rem] text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues by Priority */}
          <div className="bg-white rounded-xl border border-[#EDF0F4] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#07111F] font-semibold text-lg">Issues by Priority</h3>
              <BarChart3 size={20} className="text-[#8A94A7]" />
            </div>
            <div className="space-y-4">
              {currentData.issuesByPriority?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-[#07111F]">{item.priority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#536081]">{item.count}</span>
                    <span className="text-sm font-medium text-[#07111F] min-w-[3rem] text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#EDF0F4] flex items-center justify-between">
            <h3 className="text-[#07111F] font-semibold text-lg">Department Performance</h3>
            <Building2 size={20} className="text-[#8A94A7]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#FAFBFC] border-b border-[#EDF0F4]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Total Issues
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Resolution Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#8A94A7] uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#EDF0F4]">
                {currentData.departmentPerformance?.map((dept, index) => (
                  <tr key={index} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#07111F]">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#536081]">
                      {dept.issues}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#536081]">
                      {dept.resolved}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#07111F]">
                      {dept.percentage}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#F5F7FB] rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-[#4F8BFF]"
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          dept.percentage >= 90 ? 'text-[#0E9250]' :
                          dept.percentage >= 80 ? 'text-[#FF8A00]' : 'text-[#E12929]'
                        }`}>
                          {dept.percentage >= 90 ? 'Excellent' :
                           dept.percentage >= 80 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl border border-[#EDF0F4] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#07111F] font-semibold text-lg">Monthly Trends</h3>
            <Calendar size={20} className="text-[#8A94A7]" />
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-end justify-between gap-4 min-w-[500px] h-64 px-4">
              {currentData.monthlyTrends?.map((month, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 h-48 justify-end">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-[#536081] font-medium">{month.resolved}</span>
                      <div 
                        className="w-8 bg-[#0E9250] rounded-t"
                        style={{ height: `${(month.resolved / Math.max(...currentData.monthlyTrends.map(m => m.issues))) * 160}px` }}
                      ></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-[#536081] font-medium">{month.issues}</span>
                      <div 
                        className="w-8 bg-[#4F8BFF] rounded-t"
                        style={{ height: `${(month.issues / Math.max(...currentData.monthlyTrends.map(m => m.issues))) * 160}px` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#07111F]">{month.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#EDF0F4]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#4F8BFF] rounded"></div>
                <span className="text-sm text-[#536081]">Total Issues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0E9250] rounded"></div>
                <span className="text-sm text-[#536081]">Resolved Issues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
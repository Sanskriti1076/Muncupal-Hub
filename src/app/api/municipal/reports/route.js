import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period')) || 30;
    const departmentId = searchParams.get('department');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    // Base WHERE clause for date filtering
    let dateFilter = `created_at >= $1 AND created_at <= $2`;
    let baseParams = [startDate.toISOString(), endDate.toISOString()];
    let paramCount = 2;

    // Add department filter if specified
    let departmentFilter = '';
    if (departmentId) {
      paramCount++;
      departmentFilter = ` AND department_id = $${paramCount}`;
      baseParams.push(departmentId);
    }

    // Get overview statistics
    const overviewQuery = `
      SELECT 
        COUNT(*) as total_issues,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_issues,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_issues,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_issues,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_issues,
        AVG(CASE 
          WHEN actual_resolution_date IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (actual_resolution_date - created_at)) / 86400 
        END) as avg_resolution_days
      FROM issues 
      WHERE ${dateFilter}${departmentFilter}
    `;

    const overviewResult = await sql(overviewQuery, baseParams);
    const overview = overviewResult[0];

    // Get previous period for trend calculation
    const prevStartDate = new Date();
    prevStartDate.setDate(startDate.getDate() - period);
    
    const prevOverviewQuery = `
      SELECT 
        COUNT(*) as prev_total_issues,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as prev_resolved_issues,
        AVG(CASE 
          WHEN actual_resolution_date IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (actual_resolution_date - created_at)) / 86400 
        END) as prev_avg_resolution_days
      FROM issues 
      WHERE created_at >= $1 AND created_at < $2${departmentFilter}
    `;

    const prevParams = [prevStartDate.toISOString(), startDate.toISOString()];
    if (departmentId) {
      prevParams.push(departmentId);
    }

    const prevOverviewResult = await sql(prevOverviewQuery, prevParams);
    const prevOverview = prevOverviewResult[0];

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const trends = {
      totalIssues: calculateTrend(
        parseInt(overview.total_issues), 
        parseInt(prevOverview.prev_total_issues)
      ),
      resolvedIssues: calculateTrend(
        parseInt(overview.resolved_issues), 
        parseInt(prevOverview.prev_resolved_issues)
      ),
      avgResolutionTime: calculateTrend(
        parseFloat(overview.avg_resolution_days), 
        parseFloat(prevOverview.prev_avg_resolution_days)
      ),
      customerSatisfaction: Math.random() * 10 - 5 // Mock data for satisfaction
    };

    // Get issues by status
    const statusQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 1) as percentage
      FROM issues 
      WHERE ${dateFilter}${departmentFilter}
      GROUP BY status
      ORDER BY count DESC
    `;

    const statusResult = await sql(statusQuery, baseParams);
    const statusColors = {
      'pending': '#FF8A00',
      'in_progress': '#4F8BFF',
      'resolved': '#0E9250',
      'closed': '#536081'
    };

    const issuesByStatus = statusResult.map(row => ({
      status: row.status.charAt(0).toUpperCase() + row.status.slice(1).replace('_', ' '),
      count: parseInt(row.count),
      percentage: parseFloat(row.percentage),
      color: statusColors[row.status] || '#8A94A7'
    }));

    // Get issues by priority
    const priorityQuery = `
      SELECT 
        priority,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 1) as percentage
      FROM issues 
      WHERE ${dateFilter}${departmentFilter}
      GROUP BY priority
      ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END
    `;

    const priorityResult = await sql(priorityQuery, baseParams);
    const priorityColors = {
      'critical': '#E12929',
      'high': '#FF8A00',
      'medium': '#4F8BFF',
      'low': '#0E9250'
    };

    const issuesByPriority = priorityResult.map(row => ({
      priority: row.priority.charAt(0).toUpperCase() + row.priority.slice(1),
      count: parseInt(row.count),
      percentage: parseFloat(row.percentage),
      color: priorityColors[row.priority] || '#8A94A7'
    }));

    // Get department performance
    const deptPerformanceQuery = `
      SELECT 
        d.name,
        COUNT(i.id) as issues,
        COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) as resolved,
        ROUND(
          (COUNT(CASE WHEN i.status = 'resolved' THEN 1 END) * 100.0 / 
           NULLIF(COUNT(i.id), 0)), 1
        ) as percentage
      FROM departments d
      LEFT JOIN issues i ON d.id = i.department_id 
        AND i.created_at >= $1 AND i.created_at <= $2
      WHERE d.is_active = true
      ${departmentId ? `AND d.id = $${paramCount}` : ''}
      GROUP BY d.id, d.name
      HAVING COUNT(i.id) > 0
      ORDER BY percentage DESC, issues DESC
    `;

    const deptParams = [startDate.toISOString(), endDate.toISOString()];
    if (departmentId) {
      deptParams.push(departmentId);
    }

    const deptPerformanceResult = await sql(deptPerformanceQuery, deptParams);
    const departmentPerformance = deptPerformanceResult.map(row => ({
      name: row.name,
      issues: parseInt(row.issues),
      resolved: parseInt(row.resolved),
      percentage: parseFloat(row.percentage) || 0
    }));

    // Get monthly trends (last 6 months)
    const monthlyTrendsQuery = `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
        COUNT(*) as issues,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
      FROM issues 
      WHERE created_at >= $1 AND created_at <= $2
      ${departmentFilter}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyParams = [sixMonthsAgo.toISOString(), endDate.toISOString()];
    if (departmentId) {
      monthlyParams.push(departmentId);
    }

    const monthlyTrendsResult = await sql(monthlyTrendsQuery, monthlyParams);
    const monthlyTrends = monthlyTrendsResult.map(row => ({
      month: row.month,
      issues: parseInt(row.issues),
      resolved: parseInt(row.resolved)
    }));

    // Calculate customer satisfaction (mock data based on resolution rate)
    const resolutionRate = overview.total_issues > 0 
      ? (overview.resolved_issues / overview.total_issues) * 100 
      : 0;
    const customerSatisfaction = Math.min(95, Math.max(60, resolutionRate + Math.random() * 10));

    const reportData = {
      overview: {
        totalIssues: parseInt(overview.total_issues),
        resolvedIssues: parseInt(overview.resolved_issues),
        avgResolutionTime: parseFloat(overview.avg_resolution_days) || 0,
        customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
        trends
      },
      issuesByStatus,
      issuesByPriority,
      departmentPerformance,
      monthlyTrends,
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };

    return Response.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    console.error('Error generating reports:', error);
    return Response.json(
      { success: false, error: 'Failed to generate reports' },
      { status: 500 }
    );
  }
}

// Export endpoint for generating downloadable reports
export async function POST(request) {
  try {
    const body = await request.json();
    const { format, period, department, reportType } = body;

    // This would typically generate a file and return a download URL
    // For now, we'll simulate the export process
    
    const exportData = {
      format,
      period,
      department,
      reportType,
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/municipal/reports/download/${Date.now()}.${format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    return Response.json({
      success: true,
      data: exportData,
      message: `Report export initiated. ${format.toUpperCase()} file will be ready for download shortly.`
    });

  } catch (error) {
    console.error('Error exporting report:', error);
    return Response.json(
      { success: false, error: 'Failed to export report' },
      { status: 500 }
    );
  }
}
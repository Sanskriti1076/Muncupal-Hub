import sql from "@/app/api/utils/sql";

import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Get dashboard statistics
    const statsQuery = await sql`
      SELECT 
        COUNT(*) as total_issues,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_issues,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_issues,
        COUNT(*) FILTER (WHERE status = 'resolved' AND DATE_TRUNC('month', updated_at) = DATE_TRUNC('month', CURRENT_DATE)) as resolved_issues,
        COUNT(*) FILTER (WHERE priority = 'critical') as critical_issues,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority_issues
      FROM issues
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 year'
    `;

    // Get department wise statistics
    const departmentStatsQuery = await sql`
      SELECT 
        d.name as department_name,
        COUNT(i.id) as total_issues,
        COUNT(*) FILTER (WHERE i.status = 'pending') as pending_issues,
        COUNT(*) FILTER (WHERE i.status = 'in_progress') as in_progress_issues,
        COUNT(*) FILTER (WHERE i.status = 'resolved') as resolved_issues
      FROM departments d
      LEFT JOIN issues i ON d.id = i.department_id
      WHERE d.is_active = true
      GROUP BY d.id, d.name
      ORDER BY total_issues DESC
    `;

    // Get category wise statistics
    const categoryStatsQuery = await sql`
      SELECT 
        ic.name as category_name,
        COUNT(i.id) as total_issues,
        AVG(
          CASE 
            WHEN i.status = 'resolved' AND i.actual_resolution_date IS NOT NULL
            THEN EXTRACT(EPOCH FROM (i.actual_resolution_date - i.created_at)) / 86400
          END
        ) as avg_resolution_days
      FROM issue_categories ic
      LEFT JOIN issues i ON ic.id = i.category_id
      WHERE ic.is_active = true
      GROUP BY ic.id, ic.name
      ORDER BY total_issues DESC
      LIMIT 10
    `;

    // Get monthly trends (last 12 months)
    const monthlyTrendsQuery = await sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as total_issues,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_issues
      FROM issues
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `;

    const stats = statsQuery[0];
    const departmentStats = departmentStatsQuery;
    const categoryStats = categoryStatsQuery;
    const monthlyTrends = monthlyTrendsQuery;

    return Response.json({
      success: true,
      data: {
        ...stats,
        department_breakdown: departmentStats,
        category_breakdown: categoryStats,
        monthly_trends: monthlyTrends.reverse(), // Show oldest to newest
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
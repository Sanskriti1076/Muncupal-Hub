import { sql } from '@/app/api/utils/sql';

export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.API_SYNC_TOKEN}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    const report = await sql`
      SELECT id, status, priority, assigned_department, updated_at
      FROM public_reports 
      WHERE user_report_id = ${id} OR id = ${id}
    `;

    if (report.length === 0) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }

    return Response.json({ status: report[0] });
  } catch (error) {
    console.error('Error fetching report status:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
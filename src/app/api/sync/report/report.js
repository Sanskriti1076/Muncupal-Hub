import { sql } from '@/app/api/utils/sql';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.API_SYNC_TOKEN}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reportData = await request.json();

    // Check if report already exists
    const existingReport = await sql`
      SELECT id FROM public_reports WHERE user_report_id = ${reportData.user_report_id}
    `;

    if (existingReport.length > 0) {
      // Update existing
      const result = await sql`
        UPDATE public_reports 
        SET title = ${reportData.title},
            description = ${reportData.description},
            category = ${reportData.category},
            latitude = ${reportData.latitude},
            longitude = ${reportData.longitude},
            image_url = ${reportData.image_url},
            audio_url = ${reportData.audio_url},
            updated_at = NOW()
        WHERE user_report_id = ${reportData.user_report_id}
        RETURNING *
      `;

      return Response.json({ 
        success: true, 
        action: 'updated',
        report: result[0] 
      });
    } else {
      // Insert new
      const result = await sql`
        INSERT INTO public_reports 
          (user_report_id, title, description, category, latitude, longitude, 
           image_url, audio_url, created_at)
        VALUES 
          (${reportData.user_report_id}, ${reportData.title}, ${reportData.description}, 
           ${reportData.category}, ${reportData.latitude}, ${reportData.longitude},
           ${reportData.image_url}, ${reportData.audio_url}, ${reportData.created_at})
        RETURNING *
      `;

      return Response.json({ 
        success: true, 
        action: 'created',
        report: result[0] 
      });
    }
  } catch (error) {
    console.error('Error syncing report:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const departments = await sql`
      SELECT 
        d.*,
        mu.full_name as head_name,
        mu.email as head_email,
        COUNT(staff.id) as staff_count,
        COUNT(issues.id) as active_issues_count
      FROM departments d
      LEFT JOIN municipal_users mu ON d.head_user_id = mu.id
      LEFT JOIN municipal_users staff ON staff.department_id = d.id AND staff.is_active = true
      LEFT JOIN issues ON issues.department_id = d.id AND issues.status IN ('pending', 'in_progress')
      WHERE d.is_active = true
      GROUP BY d.id, d.name, d.description, d.head_user_id, d.is_active, d.created_at, d.updated_at, mu.full_name, mu.email
      ORDER BY d.name ASC
    `;

    return Response.json({
      success: true,
      data: departments
    });

  } catch (error) {
    console.error('Departments fetch error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, head_user_id } = body;

    // Validate required fields
    if (!name) {
      return Response.json(
        { success: false, error: 'Department name is required' },
        { status: 400 }
      );
    }

    // Check if department name already exists
    const existingDept = await sql`
      SELECT id FROM departments WHERE LOWER(name) = LOWER(${name}) AND is_active = true
    `;

    if (existingDept.length > 0) {
      return Response.json(
        { success: false, error: 'Department with this name already exists' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO departments (name, description, head_user_id)
      VALUES (${name}, ${description}, ${head_user_id})
      RETURNING *
    `;

    // Update the head user's department if specified
    if (head_user_id) {
      await sql`
        UPDATE municipal_users 
        SET department_id = ${result[0].id}
        WHERE id = ${head_user_id}
      `;
    }

    return Response.json({
      success: true,
      data: result[0],
      message: 'Department created successfully'
    });

  } catch (error) {
    console.error('Department creation error:', error);
    return Response.json(
      { success: false, error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
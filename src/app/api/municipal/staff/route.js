import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Build the query dynamically
    let query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.role,
        u.department_id,
        u.is_active,
        u.created_at,
        u.updated_at,
        d.name as department_name
      FROM municipal_users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (
        LOWER(u.full_name) LIKE LOWER($${paramCount}) OR
        LOWER(u.email) LIKE LOWER($${paramCount}) OR
        LOWER(u.username) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${search}%`);
    }

    // Add department filter
    if (department) {
      paramCount++;
      query += ` AND u.department_id = $${paramCount}`;
      params.push(department);
    }

    // Add role filter
    if (role) {
      paramCount++;
      query += ` AND u.role = $${paramCount}`;
      params.push(role);
    }

    // Add status filter
    if (status) {
      paramCount++;
      if (status === 'active') {
        query += ` AND u.is_active = $${paramCount}`;
        params.push(true);
      } else if (status === 'inactive') {
        query += ` AND u.is_active = $${paramCount}`;
        params.push(false);
      }
    }

    // Add ordering and pagination
    query += ` ORDER BY u.created_at DESC`;
    
    if (limit > 0) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);
    }
    
    if (offset > 0) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(offset);
    }

    const staff = await sql(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM municipal_users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamCount = 0;

    // Apply same filters for count
    if (search) {
      countParamCount++;
      countQuery += ` AND (
        LOWER(u.full_name) LIKE LOWER($${countParamCount}) OR
        LOWER(u.email) LIKE LOWER($${countParamCount}) OR
        LOWER(u.username) LIKE LOWER($${countParamCount})
      )`;
      countParams.push(`%${search}%`);
    }

    if (department) {
      countParamCount++;
      countQuery += ` AND u.department_id = $${countParamCount}`;
      countParams.push(department);
    }

    if (role) {
      countParamCount++;
      countQuery += ` AND u.role = $${countParamCount}`;
      countParams.push(role);
    }

    if (status) {
      countParamCount++;
      if (status === 'active') {
        countQuery += ` AND u.is_active = $${countParamCount}`;
        countParams.push(true);
      } else if (status === 'inactive') {
        countQuery += ` AND u.is_active = $${countParamCount}`;
        countParams.push(false);
      }
    }

    const countResult = await sql(countQuery, countParams);
    const total = parseInt(countResult[0].total);

    return Response.json({
      success: true,
      data: staff,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + staff.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching staff:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch staff members' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      username, 
      email, 
      password_hash, 
      full_name, 
      role, 
      department_id 
    } = body;

    // Validate required fields
    if (!username || !email || !password_hash || !full_name || !role) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'officer', 'staff'].includes(role)) {
      return Response.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await sql`
      SELECT id FROM municipal_users 
      WHERE username = ${username} OR email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { success: false, error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Create new staff member
    const newStaff = await sql`
      INSERT INTO municipal_users (
        username, email, password_hash, full_name, role, department_id
      ) VALUES (
        ${username}, ${email}, ${password_hash}, ${full_name}, ${role}, ${department_id}
      )
      RETURNING id, username, email, full_name, role, department_id, is_active, created_at
    `;

    return Response.json({
      success: true,
      data: newStaff[0],
      message: 'Staff member created successfully'
    });

  } catch (error) {
    console.error('Error creating staff member:', error);
    return Response.json(
      { success: false, error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      id,
      username, 
      email, 
      full_name, 
      role, 
      department_id,
      is_active
    } = body;

    if (!id) {
      return Response.json(
        { success: false, error: 'Staff member ID is required' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramCount = 0;

    if (username !== undefined) {
      paramCount++;
      updates.push(`username = $${paramCount}`);
      params.push(username);
    }

    if (email !== undefined) {
      paramCount++;
      updates.push(`email = $${paramCount}`);
      params.push(email);
    }

    if (full_name !== undefined) {
      paramCount++;
      updates.push(`full_name = $${paramCount}`);
      params.push(full_name);
    }

    if (role !== undefined) {
      if (!['admin', 'officer', 'staff'].includes(role)) {
        return Response.json(
          { success: false, error: 'Invalid role' },
          { status: 400 }
        );
      }
      paramCount++;
      updates.push(`role = $${paramCount}`);
      params.push(role);
    }

    if (department_id !== undefined) {
      paramCount++;
      updates.push(`department_id = $${paramCount}`);
      params.push(department_id);
    }

    if (is_active !== undefined) {
      paramCount++;
      updates.push(`is_active = $${paramCount}`);
      params.push(is_active);
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    params.push(new Date().toISOString());

    // Add ID for WHERE clause
    paramCount++;
    params.push(id);

    const query = `
      UPDATE municipal_users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, full_name, role, department_id, is_active, updated_at
    `;

    const updatedStaff = await sql(query, params);

    if (updatedStaff.length === 0) {
      return Response.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: updatedStaff[0],
      message: 'Staff member updated successfully'
    });

  } catch (error) {
    console.error('Error updating staff member:', error);
    return Response.json(
      { success: false, error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Staff member ID is required' },
        { status: 400 }
      );
    }

    // Check if staff member exists
    const existingStaff = await sql`
      SELECT id FROM municipal_users WHERE id = ${id}
    `;

    if (existingStaff.length === 0) {
      return Response.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Instead of hard delete, we'll soft delete by setting is_active to false
    const deletedStaff = await sql`
      UPDATE municipal_users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, username, full_name
    `;

    return Response.json({
      success: true,
      data: deletedStaff[0],
      message: 'Staff member deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting staff member:', error);
    return Response.json(
      { success: false, error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}
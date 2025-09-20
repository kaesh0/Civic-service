import { supabaseAdmin } from '../config/supabase.js';

export const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      latitude,
      longitude,
      photo_url,
      anonymous,
      manual_location
    } = req.body;

    const reportData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority,
      status: 'Submitted',
      vouch_count: 0,
      anonymous: anonymous || false,
      user_id: req.user.id,
      created_at: new Date().toISOString()
    };

    // Add geolocation if provided
    if (latitude && longitude) {
      reportData.latitude = parseFloat(latitude);
      reportData.longitude = parseFloat(longitude);
    }

    // Add manual location if provided
    if (manual_location) {
      reportData.manual_location = manual_location;
    }

    // Add photo URL if provided
    if (photo_url) {
      reportData.photo_url = photo_url;
    }

    const { data: newReport, error } = await supabaseAdmin
      .from('reports')
      .insert([reportData])
      .select(`
        *,
        users!reports_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Create report error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create report'
      });
    }

    // Award points to user for creating report
    const { error: pointsError } = await supabaseAdmin
      .from('users')
      .update({ 
        points: req.user.points + 10 
      })
      .eq('id', req.user.id);

    if (pointsError) {
      console.error('Points update error:', pointsError);
    }

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: {
        report: newReport
      }
    });
  } catch (error) {
    console.error('Create report controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const editReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Check if report exists and belongs to user
    const { data: existingReport, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (existingReport.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reports'
      });
    }

    // Update report
    const { data: updatedReport, error } = await supabaseAdmin
      .from('reports')
      .update({ 
        description: description.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        users!reports_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Edit report error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update report'
      });
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: {
        report: updatedReport
      }
    });
  } catch (error) {
    console.error('Edit report controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const vouchReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if report exists
    const { data: existingReport, error: fetchError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user already vouched for this report
    const { data: existingVouch } = await supabaseAdmin
      .from('report_vouches')
      .select('id')
      .eq('report_id', id)
      .eq('user_id', req.user.id)
      .single();

    if (existingVouch) {
      return res.status(400).json({
        success: false,
        message: 'You have already vouched for this report'
      });
    }

    // Create vouch record
    const { error: vouchError } = await supabaseAdmin
      .from('report_vouches')
      .insert([{
        report_id: id,
        user_id: req.user.id,
        created_at: new Date().toISOString()
      }]);

    if (vouchError) {
      console.error('Vouch creation error:', vouchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to vouch for report'
      });
    }

    // Update vouch count
    const { data: updatedReport, error: updateError } = await supabaseAdmin
      .from('reports')
      .update({ 
        vouch_count: existingReport.vouch_count + 1 
      })
      .eq('id', id)
      .select(`
        *,
        users!reports_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (updateError) {
      console.error('Vouch count update error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update vouch count'
      });
    }

    res.json({
      success: true,
      message: 'Report vouched successfully',
      data: {
        report: updatedReport
      }
    });
  } catch (error) {
    console.error('Vouch report controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      status, 
      priority,
      user_id 
    } = req.query;

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('reports')
      .select(`
        *,
        users!reports_user_id_fkey (
          id,
          name,
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Get reports error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reports'
      });
    }

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reports controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: report, error } = await supabaseAdmin
      .from('reports')
      .select(`
        *,
        users!reports_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error || !report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Get report by ID controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
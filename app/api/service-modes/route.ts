import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface ServiceModeData {
  service_mode: string;
  total_deliveries: number;
  successful_deliveries: number;
  delayed_deliveries: number;
  failed_deliveries: number;
  success_rate: number;
  avg_delivery_time: number;
  avg_rating: number;
  total_revenue: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2024-01-01';
    const endDate = searchParams.get('endDate') || '2024-12-31';
    const region = searchParams.get('region');

    const sql = `
      SELECT 
        ds.service_mode,
        COUNT(*) as total_deliveries,
        SUM(CASE WHEN fd.is_successful = 1 THEN 1 ELSE 0 END) as successful_deliveries,
        SUM(CASE WHEN fd.is_delayed = 1 THEN 1 ELSE 0 END) as delayed_deliveries,
        SUM(CASE WHEN fd.is_successful = 0 THEN 1 ELSE 0 END) as failed_deliveries,
        ROUND((SUM(CASE WHEN fd.is_successful = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as success_rate,
        ROUND(AVG(fd.delivery_time_hours), 2) as avg_delivery_time,
        ROUND(AVG(fd.delivery_rating), 2) as avg_rating,
        ROUND(SUM(fd.delivery_cost), 2) as total_revenue
      FROM fact_delivery fd
      JOIN dim_service_mode ds ON fd.service_key = ds.service_key
      JOIN dim_time dt ON fd.time_key = dt.time_key
      ${region ? 'JOIN dim_region dr ON fd.region_key = dr.region_key' : ''}
      WHERE dt.date_actual BETWEEN ? AND ?
      ${region ? 'AND dr.region_name = ?' : ''}
      GROUP BY ds.service_mode
      ORDER BY 
        CASE ds.service_mode
          WHEN 'same day' THEN 1
          WHEN 'express' THEN 2
          WHEN 'two day' THEN 3
          WHEN 'standard' THEN 4
          ELSE 5
        END
    `;

    const params: any[] = [startDate, endDate];
    if (region) params.push(region);

    const results = await query<ServiceModeData[]>(sql, params);

    return NextResponse.json({ 
      success: true,
      data: results 
    });
  } catch (error: any) {
    console.error('Service Modes API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

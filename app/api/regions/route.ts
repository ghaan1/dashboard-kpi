import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RegionData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2024-01-01';
    const endDate = searchParams.get('endDate') || '2024-12-31';

    const sql = `
      SELECT 
        dr.region_name,
        COUNT(*) as total_deliveries,
        ROUND((SUM(CASE WHEN fd.is_successful = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as success_rate,
        ROUND(AVG(fd.delivery_rating), 2) as avg_rating,
        ROUND(SUM(fd.delivery_cost), 2) as total_revenue
      FROM fact_delivery fd
      JOIN dim_region dr ON fd.region_key = dr.region_key
      JOIN dim_time dt ON fd.time_key = dt.time_key
      WHERE dt.date_actual BETWEEN ? AND ?
      GROUP BY dr.region_name
      ORDER BY total_deliveries DESC
    `;

    const results = await query<RegionData[]>(sql, [startDate, endDate]);

    return NextResponse.json({ 
      success: true,
      data: results 
    });
  } catch (error: any) {
    console.error('Regions API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

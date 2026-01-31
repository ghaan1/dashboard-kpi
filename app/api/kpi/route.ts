import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { KPIMetrics } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2024-01-01';
    const endDate = searchParams.get('endDate') || '2024-12-31';
    const region = searchParams.get('region');
    const partner = searchParams.get('partner');

    const sql = `
      SELECT 
        COUNT(*) as total_deliveries,
        ROUND((SUM(CASE WHEN is_successful = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as success_rate,
        ROUND(AVG(delivery_rating), 2) as avg_rating,
        ROUND(SUM(delivery_cost), 2) as total_revenue,
        ROUND(AVG(delivery_time_hours), 2) as avg_delivery_time,
        SUM(CASE WHEN is_delayed = 0 THEN 1 ELSE 0 END) as on_time_deliveries
      FROM fact_delivery fd
      JOIN dim_time dt ON fd.time_key = dt.time_key
      ${region ? 'JOIN dim_region dr ON fd.region_key = dr.region_key' : ''}
      ${partner ? 'JOIN dim_partner dp ON fd.partner_key = dp.partner_key' : ''}
      WHERE dt.date_actual BETWEEN ? AND ?
      ${region ? 'AND dr.region_name = ?' : ''}
      ${partner ? 'AND dp.partner_name = ?' : ''}
    `;

    const params: any[] = [startDate, endDate];
    if (region) params.push(region);
    if (partner) params.push(partner);

    const results = await query<KPIMetrics[]>(sql, params);
    const kpi = results[0] || {
      total_deliveries: 0,
      success_rate: 0,
      avg_rating: 0,
      total_revenue: 0,
      avg_delivery_time: 0,
      on_time_deliveries: 0,
    };

    return NextResponse.json({ 
      success: true,
      data: kpi 
    });
  } catch (error: any) {
    console.error('KPI API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

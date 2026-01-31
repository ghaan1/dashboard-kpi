import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PartnerPerformance } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2024-01-01';
    const endDate = searchParams.get('endDate') || '2024-12-31';
    const region = searchParams.get('region');
    const serviceMode = searchParams.get('serviceMode');

    const sql = `
      SELECT 
        dp.partner_name,
        SUM(fpp.total_deliveries) as total_deliveries,
        ROUND(AVG(fpp.success_rate), 2) as success_rate,
        ROUND(AVG(fpp.on_time_rate), 2) as on_time_rate,
        ROUND(AVG(fpp.avg_rating), 2) as avg_rating,
        ROUND(SUM(fpp.total_revenue), 2) as total_revenue,
        ROUND(AVG(fpp.cost_per_delivery), 2) as cost_efficiency
      FROM fact_partner_performance fpp
      JOIN dim_partner dp ON fpp.partner_key = dp.partner_key
      JOIN dim_time dt ON fpp.time_key = dt.time_key
      ${region ? 'JOIN dim_region dr ON fpp.region_key = dr.region_key' : ''}
      ${serviceMode ? 'JOIN dim_service_mode ds ON fpp.service_key = ds.service_key' : ''}
      WHERE dt.date_actual BETWEEN ? AND ?
      ${region ? 'AND dr.region_name = ?' : ''}
      ${serviceMode ? 'AND ds.service_mode = ?' : ''}
      GROUP BY dp.partner_name
      ORDER BY success_rate DESC
    `;

    const params: any[] = [startDate, endDate];
    if (region) params.push(region);
    if (serviceMode) params.push(serviceMode);

    const results = await query<PartnerPerformance[]>(sql, params);

    return NextResponse.json({ 
      success: true,
      data: results 
    });
  } catch (error: any) {
    console.error('Partners API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

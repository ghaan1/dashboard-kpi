import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { DeliveryData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2024-01-01';
    const endDate = searchParams.get('endDate') || '2024-12-31';
    const region = searchParams.get('region');
    const groupBy = searchParams.get('groupBy') || 'day'; // day, week, month

    const dateFormat = groupBy === 'month' ? '%Y-%m' : groupBy === 'week' ? '%Y-%u' : '%Y-%m-%d';
    
    const sql = `
      SELECT 
        DATE_FORMAT(dt.date_actual, '${dateFormat}') as date,
        COUNT(*) as total_deliveries,
        SUM(CASE WHEN fd.is_successful = 1 THEN 1 ELSE 0 END) as successful_deliveries,
        SUM(CASE WHEN fd.is_delayed = 1 THEN 1 ELSE 0 END) as delayed_deliveries,
        SUM(CASE WHEN fd.is_successful = 0 THEN 1 ELSE 0 END) as failed_deliveries,
        ROUND(AVG(fd.delivery_rating), 2) as avg_rating,
        ROUND(AVG(fd.delivery_time_hours), 2) as avg_delivery_time,
        ROUND(SUM(fd.delivery_cost), 2) as total_revenue
      FROM fact_delivery fd
      JOIN dim_time dt ON fd.time_key = dt.time_key
      ${region ? 'JOIN dim_region dr ON fd.region_key = dr.region_key' : ''}
      WHERE dt.date_actual BETWEEN ? AND ?
      ${region ? 'AND dr.region_name = ?' : ''}
      GROUP BY date
      ORDER BY date ASC
    `;

    const params: string[] = [startDate, endDate];
    if (region) params.push(region);

    const results = await query<DeliveryData[]>(sql, params);

    return NextResponse.json({ 
      success: true,
      data: results 
    });
  } catch (error: unknown) {
    console.error('Deliveries API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface WeatherImpact {
  weather_condition: string;
  total_deliveries: number;
  success_rate: number;
  avg_delivery_time: number;
  delayed_count: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2024-01-01';
    const endDate = searchParams.get('endDate') || '2024-12-31';
    const region = searchParams.get('region');

    const sql = `
      SELECT 
        dw.weather_condition,
        COUNT(*) as total_deliveries,
        ROUND((SUM(CASE WHEN fd.is_successful = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as success_rate,
        ROUND(AVG(fd.delivery_time_hours), 2) as avg_delivery_time,
        SUM(CASE WHEN fd.is_delayed = 1 THEN 1 ELSE 0 END) as delayed_count
      FROM fact_delivery fd
      JOIN dim_weather dw ON fd.weather_key = dw.weather_key
      JOIN dim_time dt ON fd.time_key = dt.time_key
      ${region ? 'JOIN dim_region dr ON fd.region_key = dr.region_key' : ''}
      WHERE dt.date_actual BETWEEN ? AND ?
      ${region ? 'AND dr.region_name = ?' : ''}
      GROUP BY dw.weather_condition
      ORDER BY total_deliveries DESC
    `;

    const params: any[] = [startDate, endDate];
    if (region) params.push(region);

    const results = await query<WeatherImpact[]>(sql, params);

    return NextResponse.json({ 
      success: true,
      data: results 
    });
  } catch (error: any) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

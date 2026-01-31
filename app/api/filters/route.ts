import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Get all partners
    const partners = await query<{partner_name: string}[]>(
      'SELECT DISTINCT partner_name FROM dim_partner ORDER BY partner_name'
    );

    // Get all regions
    const regions = await query<{region_name: string}[]>(
      'SELECT DISTINCT region_name FROM dim_region ORDER BY region_name'
    );

    // Get all service modes
    const serviceModes = await query<{service_mode: string}[]>(
      'SELECT DISTINCT service_mode FROM dim_service_mode ORDER BY service_mode'
    );

    // Get all weather conditions
    const weatherConditions = await query<{weather_condition: string}[]>(
      'SELECT DISTINCT weather_condition FROM dim_weather ORDER BY weather_condition'
    );

    return NextResponse.json({ 
      success: true,
      data: {
        partners: partners.map(p => p.partner_name),
        regions: regions.map(r => r.region_name),
        serviceModes: serviceModes.map(s => s.service_mode),
        weatherConditions: weatherConditions.map(w => w.weather_condition),
      }
    });
  } catch (error: any) {
    console.error('Filters API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

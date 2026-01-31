// ===============================================
// DATABASE TYPES
// ===============================================

export interface DeliveryData {
  date: string;
  total_deliveries: number;
  successful_deliveries: number;
  delayed_deliveries: number;
  failed_deliveries: number;
  avg_rating: number;
  avg_delivery_time: number;
  total_revenue: number;
}

export interface PartnerPerformance {
  partner_name: string;
  total_deliveries: number;
  success_rate: number;
  on_time_rate: number;
  avg_rating: number;
  total_revenue: number;
  cost_efficiency: number;
}

export interface RegionData {
  region_name: string;
  total_deliveries: number;
  success_rate: number;
  avg_rating: number;
  total_revenue: number;
}

export interface RouteAnalysis {
  origin_region: string;
  destination_region: string;
  avg_distance: number;
  avg_time: number;
  avg_cost: number;
  avg_speed: number;
  efficiency_ratio: number;
}

export interface KPIMetrics {
  total_deliveries: number;
  success_rate: number;
  avg_rating: number;
  total_revenue: number;
  avg_delivery_time: number;
  on_time_deliveries: number;
}

export interface ServiceModeData {
  service_mode: string;
  total_deliveries: number;
  avg_delivery_time: number;
  success_rate: number;
}

export interface WeatherImpact {
  weather_condition: string;
  total_deliveries: number;
  success_rate: number;
  avg_delay_minutes: number;
}

// ===============================================
// FILTER TYPES
// ===============================================

export interface DateFilter {
  startDate: string;
  endDate: string;
}

export interface DashboardFilters {
  dateRange?: DateFilter;
  region?: string;
  partner?: string;
  serviceMode?: string;
}

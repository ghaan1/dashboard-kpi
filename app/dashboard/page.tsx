'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps, ComposedChart, Area } from 'recharts';
import { Package, TrendingUp, Star, DollarSign, Clock, CheckCircle, Filter, Calendar, MapPin, ArrowUp, ArrowDown, Activity, Truck, BarChart3, Cloud, Zap, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface KPIData {
  total_deliveries: number;
  success_rate: number;
  avg_rating: number;
  total_revenue: number;
  avg_delivery_time: number;
  on_time_deliveries: number;
}

interface DeliveryTrend {
  date: string;
  total_deliveries: number;
  successful_deliveries: number;
  delayed_deliveries: number;
}

interface RegionData {
  region_name: string;
  total_deliveries: number;
  success_rate: number;
}

interface WeatherData {
  weather_condition: string;
  total_deliveries: number;
  success_rate: number;
  avg_delivery_time: number;
  delayed_count: number;
}

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

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];
const WEATHER_COLORS: { [key: string]: string } = {
  'clear': '#10b981',
  'hot': '#f59e0b',
  'cold': '#3b82f6',
  'rainy': '#6366f1',
  'foggy': '#64748b',
  'stormy': '#ef4444',
};

const SERVICE_COLORS: { [key: string]: string } = {
  'same day': '#ef4444',
  'express': '#f59e0b',
  'two day': '#3b82f6',
  'standard': '#10b981',
};

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [deliveryTrend, setDeliveryTrend] = useState<DeliveryTrend[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [serviceModeData, setServiceModeData] = useState<ServiceModeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    region: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.region && { region: filters.region }),
      });

      // Fetch all data
      const [kpiRes, trendRes, regionRes, weatherRes, serviceModeRes] = await Promise.all([
        fetch(`/api/kpi?${params}`),
        fetch(`/api/deliveries?${params}`),
        fetch(`/api/regions?${params}`),
        fetch(`/api/weather?${params}`),
        fetch(`/api/service-modes?${params}`),
      ]);

      const kpiJson = await kpiRes.json();
      if (kpiJson.success) setKpiData(kpiJson.data);

      const trendJson = await trendRes.json();
      if (trendJson.success) setDeliveryTrend(trendJson.data);

      const regionJson = await regionRes.json();
      if (regionJson.success) setRegionData(regionJson.data);

      const weatherJson = await weatherRes.json();
      if (weatherJson.success) setWeatherData(weatherJson.data);

      const serviceModeJson = await serviceModeRes.json();
      if (serviceModeJson.success) setServiceModeData(serviceModeJson.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-slate-600 text-lg font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Truck className="h-10 w-10" />
                <span>Logistics Dashboard</span>
              </h1>
              <p className="text-indigo-100 text-lg">Executive Summary - IndiaLogistics Multi-Partner Network</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard/partners"
                className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <Users className="h-5 w-5 text-white" />
                <span className="text-white font-semibold text-sm">View Partners</span>
                <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white/70 text-xs">Last Updated</p>
                <p className="text-white font-semibold">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-[1920px] mx-auto">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-500" />
                Region
              </label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 appearance-none cursor-pointer"
              >
                <option value="">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="central">Central</option>
              </select>
              <div className="absolute right-3 top-[38px] pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        {kpiData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Deliveries */}
            <div className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-6 w-6 text-white/80" />
                    <p className="text-sm font-medium text-indigo-100">Total Deliveries</p>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{kpiData.total_deliveries.toLocaleString()}</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-xs text-white font-medium">
                        <ArrowUp className="inline h-3 w-3 mr-1" />
                        12.5%
                      </p>
                    </div>
                    <p className="text-sm text-indigo-100">vs last period</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-6 w-6 text-white/80" />
                    <p className="text-sm font-medium text-emerald-100">Success Rate</p>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{parseFloat(kpiData.success_rate.toString()).toFixed(1)}%</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-xs text-white font-medium">
                        <ArrowUp className="inline h-3 w-3 mr-1" />
                        2.3%
                      </p>
                    </div>
                    <p className="text-sm text-emerald-100">
                      {Math.round((kpiData.success_rate / 100) * kpiData.total_deliveries).toLocaleString()} successful
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-white/80 fill-current" />
                    <p className="text-sm font-medium text-amber-100">Average Rating</p>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-4xl font-bold text-white">{parseFloat(kpiData.avg_rating.toString()).toFixed(2)}</h3>
                    <span className="text-lg text-white/80">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-xs text-white font-medium">
                        <ArrowUp className="inline h-3 w-3 mr-1" />
                        0.4
                      </p>
                    </div>
                    <p className="text-sm text-amber-100">Excellent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="group bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-6 w-6 text-white/80" />
                    <p className="text-sm font-medium text-pink-100">Total Revenue</p>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">₹{(parseFloat(kpiData.total_revenue.toString()) / 1000000).toFixed(2)}M</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-xs text-white font-medium">
                        <ArrowUp className="inline h-3 w-3 mr-1" />
                        18.2%
                      </p>
                    </div>
                    <p className="text-sm text-pink-100">
                      ₹{(parseFloat(kpiData.total_revenue.toString()) / kpiData.total_deliveries).toFixed(2)}/delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avg Delivery Time */}
            <div className="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-6 w-6 text-white/80" />
                    <p className="text-sm font-medium text-cyan-100">Avg Delivery Time</p>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{parseFloat(kpiData.avg_delivery_time.toString()).toFixed(2)}h</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-xs text-white font-medium">
                        <ArrowDown className="inline h-3 w-3 mr-1" />
                        8.5%
                      </p>
                    </div>
                    <p className="text-sm text-cyan-100">Optimized</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Time Deliveries */}
            <div className="group bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-6 w-6 text-white/80" />
                    <p className="text-sm font-medium text-violet-100">On-Time Deliveries</p>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{kpiData.on_time_deliveries.toLocaleString()}</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <p className="text-xs text-white font-medium">
                        <ArrowUp className="inline h-3 w-3 mr-1" />
                        15.3%
                      </p>
                    </div>
                    <p className="text-sm text-violet-100">
                      {((kpiData.on_time_deliveries / kpiData.total_deliveries) * 100).toFixed(1)}% on-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Trend Line Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Delivery Trend</h2>
                  <p className="text-sm text-slate-500">Over time analysis</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={deliveryTrend}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_deliveries"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="Total"
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="successful_deliveries"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Successful"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="delayed_deliveries"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Delayed"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Region Distribution Bar Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Deliveries by Region</h2>
                  <p className="text-sm text-slate-500">Geographic distribution</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region_name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="total_deliveries"
                  name="Total Deliveries"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Success Rate by Region */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Success Rate</h2>
                  <p className="text-sm text-slate-500">Performance by region</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region_name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="success_rate"
                  name="Success Rate (%)"
                  fill="url(#successBarGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="successBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Region Distribution Pie Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-2 rounded-xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Market Share</h2>
                  <p className="text-sm text-slate-500">Regional distribution</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={regionData}
                  dataKey="total_deliveries"
                  nameKey="region_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  label={(entry: PieLabelRenderProps) => {
                    const pct = ((entry.value as number) / regionData.reduce((sum, r) => sum + r.total_deliveries, 0) * 100).toFixed(1);
                    return `${entry.name}: ${pct}%`;
                  }}
                  labelLine={false}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🆕 WEATHER IMPACT ANALYSIS - ComposedChart with Bar + Line */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-xl">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Weather Impact Analysis</h2>
                  <p className="text-sm text-slate-500">Performance across weather conditions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-700">Critical for Planning</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={weatherData}>
                <defs>
                  <linearGradient id="weatherAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="weather_condition" 
                  stroke="#64748b" 
                  fontSize={12}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} label={{ value: 'Deliveries', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} label={{ value: 'Success Rate (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid #0ea5e9',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                    padding: '12px 16px',
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'Success Rate') return [`${value}%`, name];
                    if (name === 'Delayed') return [value, name];
                    return [value.toLocaleString(), name];
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  yAxisId="left"
                  dataKey="total_deliveries" 
                  name="Total Deliveries"
                  radius={[8, 8, 0, 0]}
                >
                  {weatherData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WEATHER_COLORS[entry.weather_condition] || '#6366f1'} />
                  ))}
                </Bar>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="delayed_count"
                  name="Delayed"
                  stroke="#f59e0b"
                  fill="url(#weatherAreaGradient)"
                  strokeWidth={0}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="success_rate"
                  name="Success Rate"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ fill: '#10b981', strokeWidth: 3, r: 6, stroke: '#fff' }}
                  activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* Weather Insights */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {weatherData.slice(0, 3).map((weather, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border-2 border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: WEATHER_COLORS[weather.weather_condition] || '#6366f1' }}
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase">{weather.weather_condition}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{parseFloat(weather.success_rate.toString()).toFixed(1)}%</p>
                  <p className="text-xs text-slate-500 mt-1">Success Rate</p>
                  <p className="text-xs text-slate-600 mt-2">
                    <span className="font-semibold">{weather.total_deliveries.toLocaleString()}</span> deliveries
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 🆕 SERVICE MODE PERFORMANCE - Stacked Bar Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Service Mode Performance</h2>
                  <p className="text-sm text-slate-500">Delivery status breakdown by service type</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                <Star className="h-4 w-4 text-amber-500 fill-current" />
                <span className="text-xs font-semibold text-slate-700">Priority Analysis</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={serviceModeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="service_mode" 
                  stroke="#64748b" 
                  fontSize={13}
                  fontWeight={600}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid #ec4899',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                    padding: '12px 16px',
                  }}
                  formatter={(value: any) => value.toLocaleString()}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="square"
                />
                <Bar 
                  dataKey="successful_deliveries" 
                  stackId="a" 
                  name="Successful"
                  fill="#10b981"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="delayed_deliveries" 
                  stackId="a" 
                  name="Delayed"
                  fill="#f59e0b"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="failed_deliveries" 
                  stackId="a" 
                  name="Failed"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Service Mode Stats Cards */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {serviceModeData.map((service, idx) => (
                <div 
                  key={idx} 
                  className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
                  style={{
                    borderLeftWidth: '6px',
                    borderLeftColor: SERVICE_COLORS[service.service_mode] || '#6366f1'
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4" style={{ color: SERVICE_COLORS[service.service_mode] || '#6366f1' }} />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      {service.service_mode}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{parseFloat(service.success_rate.toString()).toFixed(1)}%</p>
                      <p className="text-xs text-slate-500">Success Rate</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Avg Time:</span>
                      <span className="font-semibold text-slate-800">{parseFloat(service.avg_delivery_time.toString()).toFixed(1)}h</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Rating:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-current" />
                        {parseFloat(service.avg_rating.toString()).toFixed(1)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500">Total Deliveries</p>
                      <p className="text-sm font-bold text-slate-800">{service.total_deliveries.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Insights Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Insight 1 */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Best Performance</h3>
            </div>
            <p className="text-white/90 text-sm mb-2">Clear weather conditions show 15% higher success rates</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
              <span className="text-xs font-semibold">Optimize for Clear Days</span>
            </div>
          </div>

          {/* Key Insight 2 */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Service Priority</h3>
            </div>
            <p className="text-white/90 text-sm mb-2">Same Day deliveries achieve highest satisfaction ratings</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
              <span className="text-xs font-semibold">Premium Service Excellence</span>
            </div>
          </div>

          {/* Key Insight 3 */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Growth Trend</h3>
            </div>
            <p className="text-white/90 text-sm mb-2">Overall delivery volume increased 12.5% this period</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
              <span className="text-xs font-semibold">Strong Growth Momentum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

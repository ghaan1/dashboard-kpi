'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { Package, TrendingUp, Star, DollarSign, Clock, CheckCircle, Filter, Calendar, MapPin, ArrowUp, ArrowDown, Activity, Truck, BarChart3 } from 'lucide-react';

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

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [deliveryTrend, setDeliveryTrend] = useState<DeliveryTrend[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
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

      // Fetch KPI data
      const kpiRes = await fetch(`/api/kpi?${params}`);
      const kpiJson = await kpiRes.json();
      if (kpiJson.success) setKpiData(kpiJson.data);

      // Fetch delivery trend
      const trendRes = await fetch(`/api/deliveries?${params}`);
      const trendJson = await trendRes.json();
      if (trendJson.success) setDeliveryTrend(trendJson.data);

      // Fetch region data
      const regionRes = await fetch(`/api/regions?${params}`);
      const regionJson = await regionRes.json();
      if (regionJson.success) setRegionData(regionJson.data);

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
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white/70 text-xs">Last Updated</p>
                <p className="text-white font-semibold">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
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

        {/* Charts */}
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
                  <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
        </div>
      </div>
    </div>
  );
}

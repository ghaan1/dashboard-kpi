'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, Star, DollarSign, Filter, Calendar, MapPin, Truck, Award, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PartnerData {
  partner_name: string;
  total_deliveries: number;
  success_rate: number;
  on_time_rate: number;
  avg_rating: number;
  total_revenue: number;
  cost_efficiency: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16'];

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    region: '',
    serviceMode: '',
  });

  useEffect(() => {
    fetchPartnerData();
  }, [filters]);

  const fetchPartnerData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.region && { region: filters.region }),
        ...(filters.serviceMode && { serviceMode: filters.serviceMode }),
      });

      const res = await fetch(`/api/partners?${params}`);
      const json = await res.json();
      if (json.success) {
        setPartners(json.data);
      }
    } catch (error) {
      console.error('Error fetching partner data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate metrics
  const totalDeliveries = partners.reduce((sum, p) => sum + p.total_deliveries, 0);
  const avgSuccessRate = partners.length > 0
    ? (partners.reduce((sum, p) => sum + p.success_rate, 0) / partners.length).toFixed(2)
    : '0.00';
  const totalRevenue = partners.reduce((sum, p) => sum + p.total_revenue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-slate-600 text-lg font-medium animate-pulse">Loading partner data...</p>
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
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="group bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6 text-white group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Truck className="h-10 w-10" />
                  <span>Partner Performance</span>
                </h1>
                <p className="text-indigo-100 text-lg">Analyze and compare logistics partner performance</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white/70 text-xs">Active Partners</p>
                <p className="text-white font-semibold text-xl">{partners.length}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-indigo-500" />
                Service Mode
              </label>
              <select
                value={filters.serviceMode}
                onChange={(e) => setFilters({ ...filters, serviceMode: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300 appearance-none cursor-pointer"
              >
                <option value="">All Services</option>
                <option value="same day">Same Day</option>
                <option value="express">Express</option>
                <option value="two day">Two Day</option>
                <option value="standard">Standard</option>
              </select>
              <div className="absolute right-3 top-[38px] pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Active Partners */}
          <div className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-6 w-6 text-white/80" />
                  <p className="text-sm font-medium text-indigo-100">Active Partners</p>
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{partners.length}</h3>
                <p className="text-sm text-indigo-100">Total partners</p>
              </div>
            </div>
          </div>

          {/* Total Deliveries */}
          <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-6 w-6 text-white/80" />
                  <p className="text-sm font-medium text-emerald-100">Total Deliveries</p>
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{totalDeliveries.toLocaleString()}</h3>
                <p className="text-sm text-emerald-100">Across all partners</p>
              </div>
            </div>
          </div>

          {/* Avg Success Rate */}
          <div className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-6 w-6 text-white/80" />
                  <p className="text-sm font-medium text-amber-100">Avg Success Rate</p>
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{avgSuccessRate}%</h3>
                <p className="text-sm text-amber-100">Network average</p>
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
                <h3 className="text-4xl font-bold text-white mb-2">₹{(totalRevenue / 1000000).toFixed(2)}M</h3>
                <p className="text-sm text-pink-100">Network revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Partner Success Rate Comparison */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Success Rate</h2>
                  <p className="text-sm text-slate-500">By partner</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={partners} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="partner_name" width={120} stroke="#64748b" fontSize={12} />
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
                  onClick={(data: any) => setSelectedPartner(data.partner_name)}
                  cursor="pointer"
                  radius={[0, 8, 8, 0]}
                >
                  {partners.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={selectedPartner === entry.partner_name ? '#ef4444' : COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Deliveries Volume Comparison */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Delivery Volume</h2>
                  <p className="text-sm text-slate-500">By partner</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={partners}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="partner_name" angle={-45} textAnchor="end" height={100} stroke="#64748b" fontSize={11} />
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
                <Bar dataKey="total_deliveries" name="Total Deliveries" fill="url(#volumeGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost vs Rating Scatter */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-2 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Cost vs Rating</h2>
                  <p className="text-sm text-slate-500">Efficiency analysis</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="cost_efficiency" name="Cost per Delivery" stroke="#64748b" fontSize={12} />
                <YAxis type="number" dataKey="avg_rating" name="Avg Rating" domain={[0, 5]} stroke="#64748b" fontSize={12} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Scatter name="Partners" data={partners} fill="#8b5cf6">
                  {partners.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* On-Time Performance */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">On-Time Rate</h2>
                  <p className="text-sm text-slate-500">Delivery punctuality</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={partners} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="partner_name" width={120} stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="on_time_rate" name="On-Time Rate (%)" fill="url(#onTimeGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partner Details Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2 rounded-xl">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Detailed Partner Metrics</h2>
              <p className="text-sm text-slate-500">Complete performance data</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Partner</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Deliveries</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Success Rate</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">On-Time</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg Rating</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Cost/Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner, index) => (
                  <tr
                    key={partner.partner_name}
                    className={`hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 ${
                      selectedPartner === partner.partner_name ? 'bg-indigo-100/50 ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedPartner(partner.partner_name)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3 shadow-md" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-semibold text-slate-800">{partner.partner_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-slate-800">{partner.total_deliveries.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                        partner.success_rate >= 95 ? 'bg-emerald-100 text-emerald-800' :
                        partner.success_rate >= 90 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {partner.success_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-slate-800">{partner.on_time_rate}%</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <Star size={16} className="text-yellow-500 mr-1 fill-current" />
                        <span className="text-sm font-medium text-slate-800">{partner.avg_rating.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-slate-800">₹{(partner.total_revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-slate-800">₹{partner.cost_efficiency.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Partner Details */}
        {selectedPartner && (
          <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Selected Partner</h3>
                  <p className="text-indigo-100 font-medium">{selectedPartner}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                Clear Selection
              </button>
            </div>
            <p className="text-white/90">
              Click on a partner in the charts or table to view detailed metrics.
              Future enhancement: This area will show detailed time-series analysis and drilldown data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Truck, BarChart3, Users, Activity, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Truck className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-700">IndiaLogistics BI Dashboard</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Logistics Intelligence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Monitor delivery performance, partner metrics, and regional analytics in real-time with our comprehensive Business Intelligence dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                View Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/partners"
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-slate-200"
              >
                Partner Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Analytics</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to monitor and optimize your logistics operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time KPIs</h3>
            <p className="text-slate-600">
              Monitor 6 key performance metrics including delivery success rates, revenue, and customer satisfaction in real-time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Partner Performance</h3>
            <p className="text-slate-600">
              Compare and analyze performance across multiple logistics partners with detailed metrics and interactive visualizations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Regional Insights</h3>
            <p className="text-slate-600">
              Get comprehensive regional analysis with market share distribution and performance metrics across different geographic areas.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">25K+</div>
              <div className="text-indigo-100 font-medium">Deliveries Tracked</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10+</div>
              <div className="text-indigo-100 font-medium">Logistics Partners</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">5</div>
              <div className="text-indigo-100 font-medium">Regions Covered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-indigo-100 font-medium">Data Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Optimize Your Logistics?</h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Start analyzing your delivery data today and make data-driven decisions to improve your operations.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-semibold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Launch Dashboard
          <ArrowRight className="h-6 w-6" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold text-white">IndiaLogistics BI</span>
          </div>
          <p className="mb-4">Business Intelligence Dashboard for Multi-Partner Logistics Network</p>
          <p className="text-sm">© 2026 IndiaLogistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

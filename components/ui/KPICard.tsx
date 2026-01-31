interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  gradient?: string;
}

export default function KPICard({ title, value, subtitle, trend, icon, gradient = 'from-indigo-500 to-purple-600' }: KPICardProps) {
  return (
    <div className={`group bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className="text-white/80">{icon}</div>}
            <p className="text-sm font-medium text-white/90">{title}</p>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-white/80">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className={`text-xs font-medium text-white`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              </div>
              <span className="text-xs text-white/70 ml-2">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

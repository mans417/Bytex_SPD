import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, icon, iconColor, trend, trendValue, loading = false }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-250">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm md:text-base text-muted-foreground caption mb-2">{title}</p>
          {loading ? (
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          ) : (
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground data-text">
              {value}
            </h3>
          )}
        </div>
        <div className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg ${iconColor}`}>
          <Icon name={icon} size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
            <span className="text-xs md:text-sm font-medium caption">{trendValue}</span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground caption">vs yesterday</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
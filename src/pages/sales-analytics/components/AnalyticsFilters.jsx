import Button from '../../../components/ui/Button';

const AnalyticsFilters = ({ dateRange, selectedPeriod, onDateRangeChange, onPeriodChange }) => {
  const dateRangeOptions = [
    { value: 'daily', label: 'Daily', icon: 'Calendar' },
    { value: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
    { value: 'monthly', label: 'Monthly', icon: 'CalendarRange' }
  ];

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Date Range Selector */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            View Mode
          </label>
          <div className="flex gap-2">
            {dateRangeOptions?.map(option => (
              <Button
                key={option?.value}
                variant={dateRange === option?.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDateRangeChange(option?.value)}
                iconName={option?.icon}
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Time Period
          </label>
          <div className="grid grid-cols-2 gap-2">
            {periodOptions?.map(option => (
              <Button
                key={option?.value}
                variant={selectedPeriod === option?.value ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onPeriodChange(option?.value)}
                className="text-xs"
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
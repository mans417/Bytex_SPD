import { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const RevenueChart = ({ bills, dateRange, loading }) => {
  const chartData = useMemo(() => {
    if (!bills || bills?.length === 0) return [];

    const groupedData = {};

    bills?.forEach(bill => {
      const date = new Date(bill?.timestamp);
      let key;

      if (dateRange === 'daily') {
        key = format(startOfDay(date), 'MMM dd');
      } else if (dateRange === 'weekly') {
        key = format(startOfWeek(date), 'MMM dd');
      } else {
        key = format(startOfMonth(date), 'MMM yyyy');
      }

      if (!groupedData?.[key]) {
        groupedData[key] = { date: key, revenue: 0, transactions: 0 };
      }

      groupedData[key].revenue += bill?.totalAmount || 0;
      groupedData[key].transactions += 1;
    });

    return Object.values(groupedData)?.sort((a, b) => {
      return new Date(a?.date) - new Date(b?.date);
    });
  }, [bills, dateRange]);

  const totalRevenue = chartData?.reduce((sum, d) => sum + d?.revenue, 0);
  const avgRevenue = chartData?.length > 0 ? totalRevenue / chartData?.length : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.payload?.date}</p>
          <p className="text-sm text-success">
            Revenue: {formatCurrency(payload?.[0]?.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Transactions: {payload?.[0]?.payload?.transactions}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">Revenue Trends</h2>
            <p className="text-sm text-muted-foreground">Loading chart data...</p>
          </div>
        </div>
        <div className="h-80 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (chartData?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">Revenue Trends</h2>
            <p className="text-sm text-muted-foreground">No data available for selected period</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center bg-muted/30 rounded">
          <div className="text-center">
            <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">Revenue Trends</h2>
          <p className="text-sm text-muted-foreground">
            {dateRange === 'daily' ? 'Daily' : dateRange === 'weekly' ? 'Weekly' : 'Monthly'} performance overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-lg font-semibold text-success">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(avgRevenue)}</p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="date"
            stroke="rgb(148, 163, 184)"
            style={{ fontSize: '12px' }}
            tickMargin={10}
          />
          <YAxis
            stroke="rgb(148, 163, 184)"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `₹${(value / 1000)?.toFixed(0)}k`}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="rgb(16, 185, 129)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PeakHours = ({ bills, loading }) => {
  const hourlyData = useMemo(() => {
    if (!bills || bills?.length === 0) return [];

    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
      transactions: 0
    }));

    bills?.forEach(bill => {
      const date = new Date(bill?.timestamp);
      const hour = date?.getHours();
      hours[hour].transactions += 1;
    });

    return hours?.filter(h => h?.transactions > 0);
  }, [bills]);

  const peakHour = useMemo(() => {
    if (hourlyData?.length === 0) return null;
    return hourlyData?.reduce((max, curr) => 
      curr?.transactions > max?.transactions ? curr : max
    , hourlyData?.[0]);
  }, [hourlyData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.payload?.label}</p>
          <p className="text-sm text-primary">
            {payload?.[0]?.value} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary">
            <Icon name="Clock" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Peak Hours</h2>
            <p className="text-sm text-muted-foreground">Loading hourly data...</p>
          </div>
        </div>
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (hourlyData?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary">
            <Icon name="Clock" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Peak Hours</h2>
            <p className="text-sm text-muted-foreground">Transaction frequency by time</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded">
          <div className="text-center">
            <Icon name="Clock" size={40} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No hourly data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 text-secondary">
            <Icon name="Clock" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Peak Hours</h2>
            <p className="text-sm text-muted-foreground">Transaction frequency by time</p>
          </div>
        </div>
        {peakHour && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Busiest Hour</p>
            <p className="text-lg font-semibold text-secondary">{peakHour?.label}</p>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="label"
            stroke="rgb(148, 163, 184)"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="rgb(148, 163, 184)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="transactions"
            fill="rgb(13, 148, 136)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeakHours;
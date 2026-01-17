import { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const ReportSummary = ({ bills, selectedPeriod, loading }) => {
  const metrics = useMemo(() => {
    if (!bills || bills?.length === 0) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        totalItems: 0,
        uniqueCustomers: 0
      };
    }

    const totalRevenue = bills?.reduce((sum, b) => sum + (b?.totalAmount || 0), 0);
    const totalTransactions = bills?.length;
    const averageTransaction = totalRevenue / totalTransactions;
    const totalItems = bills?.reduce((sum, b) => {
      return sum + (b?.items?.reduce((itemSum, item) => itemSum + (item?.quantity || 0), 0) || 0);
    }, 0);
    const uniqueCustomers = new Set(bills?.map(b => b?.customerName))?.size;

    return {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      totalItems,
      uniqueCustomers
    };
  }, [bills]);

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics?.totalRevenue),
      icon: 'IndianRupee',
      iconColor: 'bg-success/10 text-success',
      description: 'Total sales amount'
    },
    {
      title: 'Transactions',
      value: metrics?.totalTransactions?.toString(),
      icon: 'Receipt',
      iconColor: 'bg-primary/10 text-primary',
      description: 'Total number of bills'
    },
    {
      title: 'Avg Transaction',
      value: formatCurrency(metrics?.averageTransaction),
      icon: 'TrendingUp',
      iconColor: 'bg-secondary/10 text-secondary',
      description: 'Average bill amount'
    },
    {
      title: 'Items Sold',
      value: metrics?.totalItems?.toString(),
      icon: 'Package',
      iconColor: 'bg-warning/10 text-warning',
      description: 'Total items quantity'
    },
    {
      title: 'Unique Customers',
      value: metrics?.uniqueCustomers?.toString(),
      icon: 'Users',
      iconColor: 'bg-accent/10 text-accent',
      description: 'Different customers'
    }
  ];

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'last7days': return 'Last 7 Days';
      case 'last30days': return 'Last 30 Days';
      default: return 'Selected Period';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
            Performance Summary
          </h2>
          <p className="text-sm text-muted-foreground">
            Key metrics for {getPeriodLabel()}
          </p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
          <Icon name="BarChart3" size={24} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5]?.map(i => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : bills?.length === 0 ? (
        <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center">
            <Icon name="FileText" size={40} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No data available for this period</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {summaryCards?.map((card, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${card?.iconColor}`}>
                  <Icon name={card?.icon} size={18} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground mb-1">{card?.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{card?.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{card?.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportSummary;
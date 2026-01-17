import { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const TopCustomers = ({ bills, loading }) => {
  const topCustomers = useMemo(() => {
    if (!bills || bills?.length === 0) return [];

    const customerMap = {};

    bills?.forEach(bill => {
      const name = bill?.customerName || 'Unknown';
      if (!customerMap?.[name]) {
        customerMap[name] = {
          name,
          totalSpent: 0,
          visits: 0,
          phone: bill?.customerPhone || 'N/A'
        };
      }
      customerMap[name].totalSpent += bill?.totalAmount || 0;
      customerMap[name].visits += 1;
    });

    return Object.values(customerMap)
      ?.sort((a, b) => b?.totalSpent - a?.totalSpent)
      ?.slice(0, 5);
  }, [bills]);

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Icon name="Users" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Top Customers</h2>
            <p className="text-sm text-muted-foreground">Loading customer data...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5]?.map(i => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (topCustomers?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Icon name="Users" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Top Customers</h2>
            <p className="text-sm text-muted-foreground">By purchase volume</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded">
          <div className="text-center">
            <Icon name="Users" size={40} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No customer data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
          <Icon name="Users" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Top Customers</h2>
          <p className="text-sm text-muted-foreground">By purchase volume</p>
        </div>
      </div>

      <div className="space-y-3">
        {topCustomers?.map((customer, index) => (
          <div
            key={customer?.name}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{customer?.name}</p>
                <p className="text-xs text-muted-foreground">{customer?.visits} visits</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-success">{formatCurrency(customer?.totalSpent)}</p>
              <p className="text-xs text-muted-foreground">Total spent</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCustomers;
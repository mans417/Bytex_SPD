import Icon from '../../../components/AppIcon';
import { formatCurrencyCompact } from '../../../utils/currency';

const SummaryCards = ({ totalBills, totalRevenue, pendingSyncCount, loading }) => {
  const cards = [
    {
      title: 'Total Bills',
      value: loading ? '...' : totalBills,
      icon: 'Receipt',
      iconColor: 'bg-primary/10 text-primary',
      bgColor: 'bg-card'
    },
    {
      title: 'Total Revenue',
      value: loading ? '...' : formatCurrencyCompact(totalRevenue),
      icon: 'IndianRupee',
      iconColor: 'bg-success/10 text-success',
      bgColor: 'bg-card'
    },
    {
      title: 'Pending Sync',
      value: loading ? '...' : pendingSyncCount,
      icon: 'RefreshCw',
      iconColor: 'bg-warning/10 text-warning',
      bgColor: 'bg-card'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {cards?.map((card, index) => (
        <div
          key={index}
          className={`${card?.bgColor} rounded-xl border border-border p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-250`}
        >
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex-1">
              <p className="text-sm md:text-base text-muted-foreground caption mb-2">{card?.title}</p>
              {loading ? (
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              ) : (
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground data-text">
                  {card?.value}
                </h3>
              )}
            </div>
            <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg ${card?.iconColor}`}>
              <Icon name={card?.icon} size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
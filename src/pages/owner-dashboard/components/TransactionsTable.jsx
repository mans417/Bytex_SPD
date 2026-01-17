import { formatCurrency } from '../../../utils/currency';
import Icon from '../../../components/AppIcon';

const TransactionsTable = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 shadow-sm text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
            <Icon name="Receipt" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-1">No transactions found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting the filters or date range</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bill ID</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created By</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id || index}
                className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <td className="p-4">
                  <span className="text-sm font-mono text-foreground">
                    #{(transaction.id || transaction.localId || index).toString().slice(-6)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {transaction.customerName || 'N/A'}
                    </span>
                    {transaction.customerPhone && (
                      <span className="text-xs text-muted-foreground">
                        {transaction.customerPhone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">
                    {transaction.items?.length || 0} item{transaction.items?.length !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(transaction.totalAmount || 0)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {transaction.createdBy || 'Unknown'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
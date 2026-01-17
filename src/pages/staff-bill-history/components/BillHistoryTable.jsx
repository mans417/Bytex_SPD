import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currency';
import { printBill } from '../../../utils/printBill';
import BillDetailsModal from './BillDetailsModal';

const BillHistoryTable = ({ bills, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedBills = [...bills]?.sort((a, b) => {
    if (sortConfig?.key === 'timestamp') {
      return sortConfig?.direction === 'desc'
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp);
    }
    if (sortConfig?.key === 'totalAmount') {
      return sortConfig?.direction === 'desc'
        ? b?.totalAmount - a?.totalAmount
        : a?.totalAmount - b?.totalAmount;
    }
    return 0;
  });

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetailsModal(true);
  };

  const handlePrint = async (bill) => {
    try {
      await printBill(bill);
    } catch (error) {
      console.error('Error printing bill:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 md:p-8">
          {[1, 2, 3, 4, 5]?.map(i => (
            <div key={i} className="flex items-center gap-4 mb-4">
              <div className="h-12 w-full bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bills?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center">
            <Icon name="Receipt" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Bills Found</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              No bills match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center gap-2 text-sm font-semibold text-foreground caption hover:text-primary transition-colors"
                  >
                    Bill ID
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-foreground caption">Customer</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('totalAmount')}
                    className="flex items-center gap-2 text-sm font-semibold text-foreground caption hover:text-primary transition-colors"
                  >
                    Amount
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center gap-2 text-sm font-semibold text-foreground caption hover:text-primary transition-colors"
                  >
                    Date & Time
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-foreground caption">Status</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-foreground caption">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBills?.map((bill) => {
                const dateTime = formatDateTime(bill?.timestamp);
                return (
                  <tr key={bill?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground data-text">#{bill?.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground data-text">{bill?.customerName}</p>
                        {bill?.customerPhone && (
                          <p className="text-xs text-muted-foreground caption">{bill?.customerPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground data-text">
                        {formatCurrency(bill?.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-foreground data-text">{dateTime?.date}</p>
                        <p className="text-xs text-muted-foreground caption">{dateTime?.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {bill?.synced ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                          <Icon name="CheckCircle2" size={12} />
                          Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                          <Icon name="Clock" size={12} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(bill)}
                          iconName="Eye"
                          iconPosition="left"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrint(bill)}
                          iconName="Printer"
                          iconPosition="left"
                        >
                          Print
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedBills?.map((bill) => {
          const dateTime = formatDateTime(bill?.timestamp);
          const isExpanded = expandedRow === bill?.id;
          return (
            <div key={bill?.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground caption mb-1">Bill #{bill?.id}</p>
                    <h3 className="text-base font-semibold text-foreground data-text">{bill?.customerName}</h3>
                    {bill?.customerPhone && (
                      <p className="text-xs text-muted-foreground caption mt-1">{bill?.customerPhone}</p>
                    )}
                  </div>
                  {bill?.synced ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      <Icon name="CheckCircle2" size={12} />
                      Synced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                      <Icon name="Clock" size={12} />
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground caption mb-1">Amount</p>
                    <p className="text-lg font-bold text-primary data-text">{formatCurrency(bill?.totalAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground caption mb-1">Date & Time</p>
                    <p className="text-sm text-foreground data-text">{dateTime?.date}</p>
                    <p className="text-xs text-muted-foreground caption">{dateTime?.time}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(bill)}
                    iconName="Eye"
                    iconPosition="left"
                    fullWidth
                  >
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePrint(bill)}
                    iconName="Printer"
                    iconPosition="left"
                    fullWidth
                  >
                    Print
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BillDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        billData={selectedBill}
        onPrint={handlePrint}
      />
    </>
  );
};

export default BillHistoryTable;
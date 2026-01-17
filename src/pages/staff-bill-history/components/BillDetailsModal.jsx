import { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currency';

const BillDetailsModal = ({ isOpen, onClose, billData, onPrint }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !billData) return null;

  const dateTime = new Date(billData?.timestamp);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Bill Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Bill Information */}
          <div className="bg-muted rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">Bill ID</p>
                <p className="text-sm font-semibold text-foreground data-text">#{billData?.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">Status</p>
                {billData?.synced ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                    <Icon name="CheckCircle2" size={12} />
                    Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                    <Icon name="Clock" size={12} />
                    Pending Sync
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">Date</p>
                <p className="text-sm font-medium text-foreground data-text">
                  {dateTime?.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">Time</p>
                <p className="text-sm font-medium text-foreground data-text">
                  {dateTime?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Customer Information</h3>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground data-text">{billData?.customerName}</span>
              </div>
              {billData?.customerPhone && (
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground data-text">{billData?.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Items</h3>
            <div className="space-y-2">
              {billData?.items?.map((item, index) => (
                <div key={index} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground data-text">{item?.name}</h4>
                    <span className="text-sm font-bold text-foreground data-text">{formatCurrency(item?.total)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground caption">
                    <span>Qty: {item?.quantity}</span>
                    <span>×</span>
                    <span>Price: {formatCurrency(item?.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground caption">Subtotal</span>
              <span className="text-sm font-medium text-foreground data-text">{formatCurrency(billData?.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground caption">Tax (8%)</span>
              <span className="text-sm font-medium text-foreground data-text">{formatCurrency(billData?.tax)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-base font-semibold text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-primary data-text">{formatCurrency(billData?.totalAmount)}</span>
            </div>
          </div>

          {/* Staff Information */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Icon name="UserCheck" size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground caption">Created by:</span>
              <span className="text-sm font-medium text-foreground data-text">{billData?.createdBy}</span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 md:p-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => onPrint(billData)}
            iconName="Printer"
            iconPosition="left"
            fullWidth
          >
            Print Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsModal;
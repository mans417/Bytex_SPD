import { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currency';

const SuccessModal = ({ isOpen, onClose, billData }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-xl border border-border shadow-xl max-w-md w-full p-6 md:p-8 animate-slide-in">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-success/10 flex items-center justify-center">
            <Icon name="CheckCircle2" size={40} className="text-success" />
          </div>
          
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Bill Generated Successfully!</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Bill for {billData?.customerName} has been created
            </p>
          </div>

          <div className="w-full bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground caption">Bill Amount</span>
              <span className="text-lg font-bold text-foreground data-text">{formatCurrency(billData?.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground caption">Items</span>
              <span className="text-sm font-medium text-foreground data-text">{billData?.items?.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground caption">Time</span>
              <span className="text-sm font-medium text-foreground data-text">
                {new Date(billData?.timestamp)?.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={onClose}
            fullWidth
          >
            Create New Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
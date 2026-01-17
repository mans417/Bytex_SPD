import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const BillSummary = ({ items }) => {
  const subtotal = items?.reduce((sum, item) => sum + item?.total, 0);
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  if (items?.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Calculator" size={20} className="text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">Bill Summary</h2>
      </div>
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between py-2 md:py-3">
          <span className="text-sm md:text-base text-muted-foreground">Subtotal</span>
          <span className="text-base md:text-lg font-medium text-foreground data-text">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between py-2 md:py-3 border-t border-border">
          <span className="text-sm md:text-base text-muted-foreground">GST (18%)</span>
          <span className="text-base md:text-lg font-medium text-foreground data-text">{formatCurrency(taxAmount)}</span>
        </div>

        <div className="flex items-center justify-between py-3 md:py-4 border-t-2 border-border">
          <span className="text-base md:text-lg font-semibold text-foreground">Total Amount</span>
          <span className="text-xl md:text-2xl lg:text-3xl font-bold text-primary data-text">{formatCurrency(total)}</span>
        </div>

        <div className="pt-3 md:pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span className="caption">All amounts are in Indian Rupees (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillSummary; 
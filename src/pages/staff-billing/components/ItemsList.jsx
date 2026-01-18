import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ItemsList = ({ items, onRemoveItem }) => {
  if (items?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center">
            <Icon name="ShoppingCart" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Items Added</h3>
            <p className="text-sm md:text-base text-muted-foreground">Add items to start creating your bill</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 md:p-6 lg:p-8 border-b border-border">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">Bill Items</h2>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground caption">Item Name</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground caption">Quantity</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground caption">Unit Price</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground caption">Total</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-foreground caption">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm md:text-base text-foreground font-medium">{item?.name}</td>
                <td className="px-6 py-4 text-sm md:text-base text-foreground text-right data-text">{item?.quantity}</td>
                <td className="px-6 py-4 text-sm md:text-base text-foreground text-right data-text">₹{item?.price?.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm md:text-base text-foreground font-semibold text-right data-text">₹{item?.total?.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item?.id)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {items?.map((item) => (
          <div key={item?.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1 truncate">{item?.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="data-text">Qty: {item?.quantity}</span>
                  <span className="data-text">@ ₹{item?.price?.toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item?.id)}
                iconName="Trash2"
                iconSize={18}
                className="text-error hover:text-error hover:bg-error/10 flex-shrink-0"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground caption">Line Total</span>
              <span className="text-base font-bold text-foreground data-text">₹{item?.total?.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
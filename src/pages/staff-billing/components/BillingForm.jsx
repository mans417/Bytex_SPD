import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BillingForm = ({ onAddItem, items, onRemoveItem, onGenerateBill, isOffline }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});

  const validateItemForm = () => {
    const newErrors = {};
    if (!itemName?.trim()) newErrors.itemName = 'Item name is required';
    if (!quantity || quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!price || price <= 0) newErrors.price = 'Valid price is required';
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleAddItem = () => {
    if (validateItemForm()) {
      onAddItem({
        id: Date.now(),
        name: itemName,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        total: parseFloat(quantity) * parseFloat(price)
      });
      setItemName('');
      setQuantity('');
      setPrice('');
      setErrors({});
    }
  };

  const validateBillForm = () => {
    const newErrors = {};
    if (!customerName?.trim()) newErrors.customerName = 'Customer name is required';
    if (items?.length === 0) newErrors.items = 'Add at least one item to generate bill';
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleGenerateBill = () => {
    if (validateBillForm()) {
      onGenerateBill({ customerName, customerPhone });
      setCustomerName('');
      setCustomerPhone('');
      setErrors({});
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Customer Information Section */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6 lg:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Input
            label="Customer Name"
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e?.target?.value)}
            error={errors?.customerName}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number (optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e?.target?.value)}
          />
        </div>
      </div>
      {/* Item Entry Section */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6 lg:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">Add Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <Input
            label="Item Name"
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e?.target?.value)}
            error={errors?.itemName}
            required
          />
          <Input
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e?.target?.value)}
            error={errors?.quantity}
            min="0.01"
            step="0.01"
            required
          />
          <Input
            label="Price (₹)"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e?.target?.value)}
            error={errors?.price}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <Button
          variant="default"
          onClick={handleAddItem}
          iconName="Plus"
          iconPosition="left"
          fullWidth
          className="md:w-auto"
        >
          Add Item
        </Button>
        {errors?.items && (
          <p className="text-sm text-error mt-2">{errors?.items}</p>
        )}
      </div>
      {/* Generate Bill Button */}
      {items?.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button
            variant="success"
            size="lg"
            onClick={handleGenerateBill}
            iconName="FileText"
            iconPosition="left"
            fullWidth
            className="sm:flex-1"
          >
            Generate Bill
          </Button>
          {isOffline && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-warning/10 border border-warning rounded-lg">
              <Icon name="WifiOff" size={18} className="text-warning" />
              <span className="text-sm font-medium text-warning caption">Offline – will sync</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillingForm;
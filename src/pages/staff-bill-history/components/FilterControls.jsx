import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const FilterControls = ({
  dateRange,
  onDateRangeChange,
  amountRange,
  onAmountRangeChange,
  syncStatusFilter,
  onSyncStatusChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = dateRange?.start || dateRange?.end || amountRange?.min || amountRange?.max || syncStatusFilter !== 'all';

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-foreground" />
          <span className="text-base md:text-lg font-semibold text-foreground">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          size={20}
          className="text-muted-foreground"
        />
      </button>
      {isExpanded && (
        <div className="p-4 md:p-6 border-t border-border space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={dateRange?.start}
                  onChange={(e) => onDateRangeChange({ ...dateRange, start: e?.target?.value })}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={dateRange?.end}
                  onChange={(e) => onDateRangeChange({ ...dateRange, end: e?.target?.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount Range (₹)</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Min Amount"
                  value={amountRange?.min}
                  onChange={(e) => onAmountRangeChange({ ...amountRange, min: e?.target?.value })}
                  min="0"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="Max Amount"
                  value={amountRange?.max}
                  onChange={(e) => onAmountRangeChange({ ...amountRange, max: e?.target?.value })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sync Status</label>
            <select
              value={syncStatusFilter}
              onChange={(e) => onSyncStatusChange(e?.target?.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="all">All Bills</option>
              <option value="synced">Synced Only</option>
              <option value="pending">Pending Sync</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;
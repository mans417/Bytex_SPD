import { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ onFilterChange, staffMembers = [] }) => {
  const [dateRange, setDateRange] = useState('today');
  const [selectedStaff, setSelectedStaff] = useState('all');

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' }
  ];

  const staffOptions = [
    { value: 'all', label: 'All Staff Members' },
    ...staffMembers?.map(staff => ({
      value: staff?.id,
      label: staff?.name
    }))
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    onFilterChange({ dateRange: value, staff: selectedStaff });
  };

  const handleStaffChange = (value) => {
    setSelectedStaff(value);
    onFilterChange({ dateRange, staff: value });
  };

  const handleReset = () => {
    setDateRange('today');
    setSelectedStaff('all');
    onFilterChange({ dateRange: 'today', staff: 'all' });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex items-center gap-2 mb-2 lg:mb-0">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-semibold text-foreground">Filters</h3>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-auto">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full"
          />
          
          <Select
            label="Staff Member"
            options={staffOptions}
            value={selectedStaff}
            onChange={handleStaffChange}
            searchable
            className="w-full"
          />
        </div>
        
        <Button
          variant="outline"
          size="default"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
          className="w-full md:w-auto"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
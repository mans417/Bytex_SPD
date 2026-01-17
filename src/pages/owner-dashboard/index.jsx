import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import RoleTransitionHeader from '../../components/ui/RoleTransitionHeader';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SyncProgressFeedback from '../../components/ui/SyncProgressFeedback';
import MetricCard from './components/MetricCard';
import FilterControls from './components/FilterControls';
import TransactionsTable from './components/TransactionsTable';
import ConnectionStatus from './components/ConnectionStatus';
import Icon from '../../components/AppIcon';

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [filters, setFilters] = useState({ dateRange: 'today', staff: 'all' });

  // Mock data for transactions
  const mockTransactions = [
    {
      id: 'TXN001',
      items: [
        { name: 'Wireless Mouse', quantity: 2, price: 25.99 },
        { name: 'USB-C Cable', quantity: 3, price: 12.50 },
        { name: 'Laptop Stand', quantity: 1, price: 45.00 }
      ],
      totalAmount: 126.48,
      timestamp: new Date('2026-01-13T14:30:00'),
      createdBy: 'Sarah Johnson'
    },
    {
      id: 'TXN002',
      items: [
        { name: 'Mechanical Keyboard', quantity: 1, price: 89.99 },
        { name: 'Mouse Pad', quantity: 2, price: 15.00 }
      ],
      totalAmount: 119.99,
      timestamp: new Date('2026-01-13T13:45:00'),
      createdBy: 'Michael Chen'
    },
    {
      id: 'TXN003',
      items: [
        { name: 'Webcam HD', quantity: 1, price: 65.00 },
        { name: 'Microphone', quantity: 1, price: 55.00 },
        { name: 'Ring Light', quantity: 1, price: 35.00 }
      ],
      totalAmount: 155.00,
      timestamp: new Date('2026-01-13T12:20:00'),
      createdBy: 'Sarah Johnson'
    },
    {
      id: 'TXN004',
      items: [
        { name: 'External SSD 1TB', quantity: 1, price: 120.00 },
        { name: 'USB Hub', quantity: 2, price: 22.50 }
      ],
      totalAmount: 165.00,
      timestamp: new Date('2026-01-13T11:15:00'),
      createdBy: 'David Martinez'
    },
    {
      id: 'TXN005',
      items: [
        { name: 'Monitor 27 inch', quantity: 1, price: 299.99 },
        { name: 'HDMI Cable', quantity: 2, price: 18.00 }
      ],
      totalAmount: 335.99,
      timestamp: new Date('2026-01-13T10:30:00'),
      createdBy: 'Michael Chen'
    },
    {
      id: 'TXN006',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 79.99 },
        { name: 'Phone Case', quantity: 3, price: 12.99 }
      ],
      totalAmount: 118.96,
      timestamp: new Date('2026-01-13T09:45:00'),
      createdBy: 'Sarah Johnson'
    },
    {
      id: 'TXN007',
      items: [
        { name: 'Bluetooth Speaker', quantity: 2, price: 45.00 },
        { name: 'Power Bank', quantity: 1, price: 35.00 }
      ],
      totalAmount: 125.00,
      timestamp: new Date('2026-01-13T08:20:00'),
      createdBy: 'David Martinez'
    },
    {
      id: 'TXN008',
      items: [
        { name: 'Smart Watch', quantity: 1, price: 199.99 },
        { name: 'Watch Band', quantity: 2, price: 25.00 }
      ],
      totalAmount: 249.99,
      timestamp: new Date('2026-01-12T16:30:00'),
      createdBy: 'Michael Chen'
    }
  ];

  const mockStaffMembers = [
    { id: 'staff1', name: 'Sarah Johnson' },
    { id: 'staff2', name: 'Michael Chen' },
    { id: 'staff3', name: 'David Martinez' }
  ];

  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Simulate periodic sync
    const syncInterval = setInterval(() => {
      setIsSyncing(true);
      setSyncProgress(0);
      
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setIsSyncing(false);
              setSyncProgress(0);
            }, 500);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }, 45000);

    return () => clearInterval(syncInterval);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (filters?.dateRange === 'today') {
      filtered = filtered?.filter(t => new Date(t.timestamp) >= today);
    } else if (filters?.dateRange === 'yesterday') {
      const yesterday = new Date(today);
      yesterday?.setDate(yesterday?.getDate() - 1);
      filtered = filtered?.filter(t => {
        const txDate = new Date(t.timestamp);
        return txDate >= yesterday && txDate < today;
      });
    } else if (filters?.dateRange === 'last7days') {
      const weekAgo = new Date(today);
      weekAgo?.setDate(weekAgo?.getDate() - 7);
      filtered = filtered?.filter(t => new Date(t.timestamp) >= weekAgo);
    } else if (filters?.dateRange === 'last30days') {
      const monthAgo = new Date(today);
      monthAgo?.setDate(monthAgo?.getDate() - 30);
      filtered = filtered?.filter(t => new Date(t.timestamp) >= monthAgo);
    }

    // Staff filter
    if (filters?.staff !== 'all') {
      const staffMember = mockStaffMembers?.find(s => s?.id === filters?.staff);
      if (staffMember) {
        filtered = filtered?.filter(t => t?.createdBy === staffMember?.name);
      }
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const calculateMetrics = () => {
    const totalSales = filteredTransactions?.reduce((sum, t) => sum + t?.totalAmount, 0);
    const totalTransactions = filteredTransactions?.length;
    
    // Calculate today's sales for trend
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    const todaySales = filteredTransactions?.filter(t => new Date(t.timestamp) >= today)?.reduce((sum, t) => sum + t?.totalAmount, 0);

    return {
      totalSales,
      totalTransactions,
      todaySales
    };
  };

  const metrics = calculateMetrics();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Helmet>
        <title>Owner Dashboard - SmartBill Lite</title>
        <meta name="description" content="Monitor your business sales performance in real-time with comprehensive transaction oversight and analytics" />
      </Helmet>
      <RoleTransitionHeader />
      <OfflineStatusIndicator />
      <SyncProgressFeedback 
        isSyncing={isSyncing}
        syncProgress={syncProgress}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
                  Sales Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time business performance monitoring and analytics
                </p>
              </div>
              <ConnectionStatus />
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-10">
            <MetricCard
              title="Total Sales"
              value={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              })?.format(metrics?.totalSales)}
              icon="DollarSign"
              iconColor="bg-success/10 text-success"
              trend="up"
              trendValue="+12.5%"
              loading={loading}
            />
            <MetricCard
              title="Total Transactions"
              value={metrics?.totalTransactions?.toString()}
              icon="Receipt"
              iconColor="bg-primary/10 text-primary"
              trend="up"
              trendValue="+8.3%"
              loading={loading}
            />
            <MetricCard
              title="Today's Sales"
              value={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              })?.format(metrics?.todaySales)}
              icon="TrendingUp"
              iconColor="bg-accent/10 text-accent"
              trend="neutral"
              trendValue=""
              loading={loading}
            />
          </div>

          {/* Filter Controls */}
          <FilterControls 
            onFilterChange={handleFilterChange}
            staffMembers={mockStaffMembers}
          />

          {/* Transactions Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
                <Icon name="List" size={20} className="text-primary md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                  Recent Transactions
                </h2>
                <p className="text-sm md:text-base text-muted-foreground caption">
                  {filteredTransactions?.length} transaction{filteredTransactions?.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            <TransactionsTable 
              transactions={filteredTransactions}
              loading={loading}
            />
          </div>

          {/* Footer Info */}
          <div className="mt-8 md:mt-10 lg:mt-12 text-center">
            <p className="text-xs md:text-sm text-muted-foreground caption">
              Data updates in real-time • Last updated: {new Date()?.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;